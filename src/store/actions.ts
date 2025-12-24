import type { ActionTree } from 'vuex'

import { GAME_CONFIG, RACE_TIMING } from '@/constants/game'
import { ROUNDS } from '@/constants/rounds'
import type { GameContext, GameState } from '@/types/store'
import { RaceExecutionError, RaceScheduleError } from '@/utils/errors'
import { generateHorses, selectRandomHorses } from '@/utils/horseGenerator'
import { calculateRaceResults, formatRaceResults } from '@/utils/raceCalculator'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function delayWithPauseCheck(
  ms: number,
  getState: () => { isPaused: boolean },
  checkInterval: number = 100,
): Promise<void> {
  const startTime = Date.now()
  const endTime = startTime + ms

  while (Date.now() < endTime) {
    // Check if paused
    if (getState().isPaused) {
      // Wait until resumed
      await new Promise<void>((resolve) => {
        const checkResume = setInterval(() => {
          if (!getState().isPaused) {
            clearInterval(checkResume)
            resolve()
          }
        }, checkInterval)
      })
      // After resuming, continue with remaining time
      continue
    }

    const remaining = endTime - Date.now()
    if (remaining <= 0) {
      break
    }

    const waitTime = Math.min(checkInterval, remaining)
    await delay(waitTime)
  }
}

export const actions: ActionTree<GameState, GameState> = {
  async generateHorses({ commit }: GameContext): Promise<void> {
    try {
      const horses = generateHorses()
      commit('SET_HORSES', horses)
    } catch (error) {
      throw new RaceScheduleError(
        `Failed to generate horses: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },

  async generateRaceSchedule({ commit, state }: GameContext): Promise<void> {
    if (state.horses.length === 0) {
      throw new RaceScheduleError('No horses available. Please generate horses first.')
    }

    if (state.horses.length !== GAME_CONFIG.TOTAL_HORSES) {
      throw new RaceScheduleError(
        `Expected exactly ${GAME_CONFIG.TOTAL_HORSES} horses, but found ${state.horses.length}. Please regenerate horses.`,
      )
    }

    try {
      const schedule = ROUNDS.map((round) => {
        const selectedHorses = selectRandomHorses(state.horses, GAME_CONFIG.HORSES_PER_ROUND)

        if (selectedHorses.length !== GAME_CONFIG.HORSES_PER_ROUND) {
          throw new RaceScheduleError(
            `Expected ${GAME_CONFIG.HORSES_PER_ROUND} horses per round, but got ${selectedHorses.length}`,
          )
        }

        return {
          roundNumber: round.round,
          distance: round.distance,
          horses: selectedHorses,
          isCompleted: false,
        }
      })

      commit('SET_RACE_SCHEDULE', schedule)
    } catch (error) {
      if (error instanceof RaceScheduleError) {
        throw error
      }
      throw new RaceScheduleError(
        `Failed to generate race schedule: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },

  async startRace({ commit, state, dispatch }: GameContext): Promise<void> {
    if (!state.raceSchedule) {
      throw new RaceExecutionError('No race schedule available. Please generate schedule first.')
    }

    commit('SET_IS_RACING', true)
    commit('SET_IS_PAUSED', false)
    commit('SET_CURRENT_ROUND', -1)

    try {
      // Run each round sequentially
      for (let i = 0; i < state.raceSchedule.length; i++) {
        // Small delay to allow animation reset between rounds (keep isRacing true to prevent button flickering)
        await delayWithPauseCheck(GAME_CONFIG.ANIMATION_RESET_DELAY_MS, () => state)

        // Set new round and continue racing
        commit('SET_CURRENT_ROUND', i)

        // Small delay to ensure DOM updates
        await delayWithPauseCheck(GAME_CONFIG.DOM_UPDATE_DELAY_MS, () => state)

        await dispatch('runRound', i)

        // Delay between rounds
        await delayWithPauseCheck(GAME_CONFIG.ROUND_DELAY_MS, () => state)
      }

      commit('SET_IS_RACING', false)
      commit('SET_IS_PAUSED', false)
    } catch (error) {
      commit('SET_IS_RACING', false)
      commit('SET_IS_PAUSED', false)
      throw new RaceExecutionError(
        `Race execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },

  async runRound({ commit, state }: GameContext, roundIndex: number): Promise<void> {
    if (!state.raceSchedule) {
      return
    }

    const round = state.raceSchedule[roundIndex]
    if (!round) {
      return
    }

    try {
      // Calculate results first to get actual race times
      const results = calculateRaceResults(round.horses, round.distance)
      // Commit results to store immediately for RaceTrack animation timing
      // But RaceProgram will only display them after isCompleted is set
      commit('SET_ROUND_RESULTS', { roundIndex, results })

      const slowestTime = Math.max(...results.map((r) => r.time))
      const raceDurationMs = (slowestTime * 1000) / RACE_TIMING.ANIMATION_SPEED_MULTIPLIER

      await delayWithPauseCheck(raceDurationMs, () => state)

      const resultStrings = formatRaceResults(round.roundNumber, round.distance, results)

      commit('COMPLETE_ROUND', { roundIndex, results: resultStrings })
    } catch (error) {
      throw new RaceExecutionError(
        `Round ${roundIndex + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },

  async pauseRace({ commit, state }: GameContext): Promise<void> {
    if (state.isRacing && !state.isPaused) {
      commit('SET_IS_PAUSED', true)
    }
  },

  async resumeRace({ commit, state }: GameContext): Promise<void> {
    if (state.isRacing && state.isPaused) {
      commit('SET_IS_PAUSED', false)
    }
  },

  async resetRaceState({ commit }: GameContext): Promise<void> {
    // Reset only race-related state, keep horses
    commit('RESET_GAME')
  },

  async resetGame({ commit }: GameContext): Promise<void> {
    commit('RESET_GAME')
    commit('SET_HORSES', [])
  },
}
