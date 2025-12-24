import { createStore } from 'vuex'

import type { GameState } from '@/types/store'

import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const initialState: GameState = {
  horses: [],
  raceSchedule: null,
  currentRoundIndex: -1,
  isRacing: false,
  isPaused: false,
  raceResults: [],
}

const store = createStore<GameState>({
  state: initialState,
  mutations,
  actions,
  getters,
  strict: import.meta.env.DEV,
})

export default store
export type { GameState }
