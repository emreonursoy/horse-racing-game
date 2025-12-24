import { computed } from 'vue'
import { useStore } from 'vuex'

import type { Horse } from '@/types/horse'
import type { RaceSchedule } from '@/types/race'
import type { Round } from '@/types/race'
import type { GameState } from '@/types/store'

export function useGame() {
  const store = useStore<GameState>()

  const horses = computed<Horse[]>(() => store.getters.allHorses)
  const raceSchedule = computed<RaceSchedule | null>(() => store.getters.raceSchedule)
  const currentRound = computed<Round | null>(() => store.getters.currentRound)
  const currentRoundHorses = computed<Horse[]>(() => store.getters.currentRoundHorses)
  const isRacing = computed<boolean>(() => store.getters.isRacing)
  const isPaused = computed<boolean>(() => store.getters.isPaused)
  const raceResults = computed<string[]>(() => store.getters.raceResults)
  const canGenerateSchedule = computed<boolean>(() => store.getters.canGenerateSchedule)
  const canStartRace = computed<boolean>(() => store.getters.canStartRace)
  const canPause = computed<boolean>(() => store.getters.canPause)
  const canResume = computed<boolean>(() => store.getters.canResume)
  const canResetRace = computed<boolean>(() => store.getters.canResetRace)
  const isRaceFinished = computed<boolean>(() => store.getters.isRaceFinished)

  const generateHorses = async (): Promise<void> => {
    await store.dispatch('generateHorses')
  }

  const generateRaceSchedule = async (): Promise<void> => {
    await store.dispatch('generateRaceSchedule')
  }

  const startRace = async (): Promise<void> => {
    await store.dispatch('startRace')
  }

  const pauseRace = async (): Promise<void> => {
    await store.dispatch('pauseRace')
  }

  const resumeRace = async (): Promise<void> => {
    await store.dispatch('resumeRace')
  }

  const resetRaceState = async (): Promise<void> => {
    await store.dispatch('resetRaceState')
  }

  const resetGame = async (): Promise<void> => {
    await store.dispatch('resetGame')
  }

  return {
    horses,
    raceSchedule,
    currentRound,
    currentRoundHorses,
    isRacing,
    isPaused,
    raceResults,
    canGenerateSchedule,
    canStartRace,
    canPause,
    canResume,
    canResetRace,
    isRaceFinished,
    generateHorses,
    generateRaceSchedule,
    startRace,
    pauseRace,
    resumeRace,
    resetRaceState,
    resetGame,
  }
}
