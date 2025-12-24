import type { MutationTree } from 'vuex'

import type { Horse } from '@/types/horse'
import type { RaceResult, RaceSchedule } from '@/types/race'
import type { GameState } from '@/types/store'

export const mutations: MutationTree<GameState> = {
  SET_HORSES(state: GameState, horses: Horse[]): void {
    state.horses = horses
  },

  SET_RACE_SCHEDULE(state: GameState, schedule: RaceSchedule): void {
    state.raceSchedule = schedule
    state.currentRoundIndex = -1
    state.raceResults = []
  },

  SET_CURRENT_ROUND(state: GameState, index: number): void {
    state.currentRoundIndex = index
  },

  SET_IS_RACING(state: GameState, isRacing: boolean): void {
    state.isRacing = isRacing
  },

  SET_IS_PAUSED(state: GameState, isPaused: boolean): void {
    state.isPaused = isPaused
  },

  SET_RACE_RESULTS(state: GameState, results: string[]): void {
    state.raceResults = results
  },

  SET_ROUND_RESULTS(
    state: GameState,
    payload: { roundIndex: number; results: RaceResult[] },
  ): void {
    const { roundIndex, results } = payload

    if (!state.raceSchedule) {
      return
    }

    const round = state.raceSchedule[roundIndex]
    if (!round) {
      return
    }

    state.raceSchedule[roundIndex] = {
      ...round,
      results,
    }
  },

  COMPLETE_ROUND(state: GameState, payload: { roundIndex: number; results: string[] }): void {
    const { roundIndex, results } = payload

    if (!state.raceSchedule) {
      return
    }

    const round = state.raceSchedule[roundIndex]
    if (!round) {
      return
    }

    state.raceSchedule[roundIndex] = {
      ...round,
      isCompleted: true,
    }
    state.raceResults = [...state.raceResults, ...results]
  },

  RESET_GAME(state: GameState): void {
    state.raceSchedule = null
    state.currentRoundIndex = -1
    state.isRacing = false
    state.isPaused = false
    state.raceResults = []
  },
}
