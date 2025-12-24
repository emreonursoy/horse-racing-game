import type { GetterTree } from 'vuex'

import type { Round } from '@/types/race'
import type { GameState } from '@/types/store'

export const getters: GetterTree<GameState, GameState> = {
  allHorses(state: GameState): GameState['horses'] {
    return state.horses
  },

  raceSchedule(state: GameState): GameState['raceSchedule'] {
    return state.raceSchedule
  },

  currentRound(state: GameState): Round | null {
    if (state.currentRoundIndex >= 0 && state.raceSchedule) {
      return state.raceSchedule[state.currentRoundIndex] ?? null
    }
    return null
  },

  currentRoundHorses(state: GameState, getters: Record<string, unknown>): GameState['horses'] {
    const round = getters.currentRound as Round | null
    return round ? round.horses : []
  },

  isRacing(state: GameState): boolean {
    return state.isRacing
  },

  raceResults(state: GameState): string[] {
    return state.raceResults
  },

  canGenerateSchedule(state: GameState): boolean {
    return state.horses.length > 0
  },

  canStartRace(state: GameState): boolean {
    return (
      state.raceSchedule !== null &&
      !state.isRacing &&
      state.raceSchedule.some((round: Round) => !round.isCompleted)
    )
  },

  isRaceFinished(state: GameState): boolean {
    if (!state.raceSchedule || state.raceSchedule.length === 0) {
      return false
    }
    return state.raceSchedule.every((round: Round) => round.isCompleted)
  },

  isPaused(state: GameState): boolean {
    return state.isPaused
  },

  canPause(state: GameState): boolean {
    return state.isRacing && !state.isPaused
  },

  canResume(state: GameState): boolean {
    return state.isRacing && state.isPaused
  },

  canResetRace(state: GameState): boolean {
    return state.isRacing && state.isPaused
  },
}
