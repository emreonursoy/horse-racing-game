import type { ActionContext, MutationTree } from 'vuex'

import type { Horse } from './horse'
import type { RaceResult, RaceSchedule } from './race'

export interface GameState {
  horses: Horse[]
  raceSchedule: RaceSchedule | null
  currentRoundIndex: number
  isRacing: boolean
  isPaused: boolean
  raceResults: string[]
}

export type GameContext = ActionContext<GameState, GameState>

export interface GameMutations extends MutationTree<GameState> {
  SET_HORSES(state: GameState, horses: Horse[]): void
  SET_RACE_SCHEDULE(state: GameState, schedule: RaceSchedule): void
  SET_CURRENT_ROUND(state: GameState, index: number): void
  SET_IS_RACING(state: GameState, isRacing: boolean): void
  SET_IS_PAUSED(state: GameState, isPaused: boolean): void
  SET_ROUND_RESULTS(state: GameState, payload: { roundIndex: number; results: RaceResult[] }): void
  COMPLETE_ROUND(state: GameState, payload: { roundIndex: number; results: string[] }): void
  RESET_GAME(state: GameState): void
}
