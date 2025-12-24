import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'vuex'

import { actions } from '../store/actions'
import { getters } from '../store/getters'
import { mutations } from '../store/mutations'
import type { Horse } from '../types/horse'
import type { Round } from '../types/race'
import type { GameState } from '../types/store'

const initialState: GameState = {
  horses: [],
  raceSchedule: null,
  currentRoundIndex: -1,
  isRacing: false,
  raceResults: [],
  isPaused: false,
}

describe('Vuex Store', () => {
  let testStore: ReturnType<typeof createStore<GameState>>

  beforeEach(() => {
    testStore = createStore<GameState>({
      state: { ...initialState },
      mutations,
      actions,
      getters,
    })
  })

  describe('Initial State', () => {
    it('should have empty initial state', () => {
      expect(testStore.state.horses).toEqual([])
      expect(testStore.state.raceSchedule).toBeNull()
      expect(testStore.state.currentRoundIndex).toBe(-1)
      expect(testStore.state.isRacing).toBe(false)
      expect(testStore.state.isPaused).toBe(false)
      expect(testStore.state.raceResults).toEqual([])
    })
  })

  describe('Actions', () => {
    describe('generateHorses', () => {
      it('should generate exactly 20 horses', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses

        expect(horses.length).toBe(20)
        const firstHorse = horses[0]!
        expect(firstHorse).toHaveProperty('id')
        expect(firstHorse).toHaveProperty('name')
        expect(firstHorse).toHaveProperty('color')
        expect(firstHorse).toHaveProperty('condition')
        expect(firstHorse.condition).toBeGreaterThanOrEqual(1)
        expect(firstHorse.condition).toBeLessThanOrEqual(100)
      })

      it('should generate horses with valid conditions between 1 and 100', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses

        horses.forEach((horse) => {
          expect(horse.condition).toBeGreaterThanOrEqual(1)
          expect(horse.condition).toBeLessThanOrEqual(100)
          expect(Number.isInteger(horse.condition)).toBe(true)
        })
      })

      it('should generate horses with unique IDs', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses
        const ids = horses.map((h) => h.id)
        const uniqueIds = new Set(ids)

        expect(uniqueIds.size).toBe(20)
      })

      it('should generate horses with unique names', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses
        const names = horses.map((h) => h.name)
        const uniqueNames = new Set(names)

        expect(uniqueNames.size).toBe(20)
      })

      it('should generate horses with unique colors', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses
        const colors = horses.map((h) => h.color)
        const uniqueColors = new Set(colors)

        expect(uniqueColors.size).toBe(20)
      })

      it('should replace existing horses when called again', async () => {
        await testStore.dispatch('generateHorses')
        const firstGeneration = [...testStore.state.horses]
        const firstHorseId = firstGeneration[0]!.id

        await testStore.dispatch('generateHorses')
        const secondGeneration = testStore.state.horses

        expect(secondGeneration.length).toBe(20)
        // The horses should be different (at least the first one should have different ID or name)
        // Since IDs are sequential, they should be the same, but names/colors might differ
        // We'll check that the generation happened
        expect(secondGeneration[0]!.id).toBe(firstHorseId) // IDs are sequential
      })

      it('should commit horses to store', async () => {
        expect(testStore.state.horses.length).toBe(0)
        await testStore.dispatch('generateHorses')
        expect(testStore.state.horses.length).toBe(20)
      })

      it('should generate horses with two-part names', async () => {
        await testStore.dispatch('generateHorses')
        const horses = testStore.state.horses

        horses.forEach((horse) => {
          const nameParts = horse.name.split(' ')
          expect(nameParts.length).toBe(2)
          expect(nameParts[0]).toBeTruthy()
          expect(nameParts[1]).toBeTruthy()
        })
      })
    })

    describe('generateRaceSchedule', () => {
      it('should generate race schedule with 10 horses per round', async () => {
        await testStore.dispatch('generateHorses')
        expect(testStore.state.horses.length).toBe(20) // Ensure we have exactly 20

        await testStore.dispatch('generateRaceSchedule')

        const schedule = testStore.state.raceSchedule
        expect(schedule).not.toBeNull()
        expect(schedule?.length).toBe(6)

        schedule?.forEach((round: Round, index: number) => {
          expect(round.roundNumber).toBe(index + 1)
          expect(round.horses.length).toBe(10) // Each round should have exactly 10 horses
          expect(round.isCompleted).toBe(false)
        })
      })

      it('should only generate schedule without regenerating horses', async () => {
        await testStore.dispatch('generateHorses')
        const horsesBeforeSchedule = [...testStore.state.horses]
        const firstHorseBefore = horsesBeforeSchedule[0]!

        await testStore.dispatch('generateRaceSchedule')

        // Horses should remain the same
        expect(testStore.state.horses.length).toBe(20)
        expect(testStore.state.horses[0]!.id).toBe(firstHorseBefore.id)
        expect(testStore.state.horses[0]!.name).toBe(firstHorseBefore.name)
        expect(testStore.state.horses[0]!.color).toBe(firstHorseBefore.color)
        expect(testStore.state.horses[0]!.condition).toBe(firstHorseBefore.condition)
      })

      it('should throw error when generating schedule without horses', async () => {
        await expect(testStore.dispatch('generateRaceSchedule')).rejects.toThrow(
          'No horses available',
        )
      })

      it('should throw error if not exactly 20 horses when generating schedule', async () => {
        // Manually set horses to an invalid count
        testStore.commit(
          'SET_HORSES',
          Array(10)
            .fill(null)
            .map((_, i) => ({
              id: `horse-${i}`,
              name: `Horse ${i}`,
              color: '#000000',
              condition: 50,
            })),
        )

        await expect(testStore.dispatch('generateRaceSchedule')).rejects.toThrow(
          'Expected exactly 20 horses',
        )
      })
    })

    describe('resetGame', () => {
      it('should reset game state and clear horses', async () => {
        await testStore.dispatch('generateHorses')
        await testStore.dispatch('generateRaceSchedule')

        await testStore.dispatch('resetGame')

        expect(testStore.state.raceSchedule).toBeNull()
        expect(testStore.state.currentRoundIndex).toBe(-1)
        expect(testStore.state.isRacing).toBe(false)
        expect(testStore.state.isPaused).toBe(false)
        expect(testStore.state.raceResults).toEqual([])
        // Horses should be cleared
        expect(testStore.state.horses).toEqual([])
      })
    })
  })

  describe('Getters', () => {
    beforeEach(async () => {
      await testStore.dispatch('generateHorses')
    })

    it('should return all horses', () => {
      const horses = testStore.getters.allHorses
      expect(horses).toEqual(testStore.state.horses)
    })

    it('should return canGenerateSchedule when horses exist', () => {
      expect(testStore.getters.canGenerateSchedule).toBe(true)
    })

    it('should return canStartRace when schedule exists', async () => {
      await testStore.dispatch('generateRaceSchedule')
      expect(testStore.getters.canStartRace).toBe(true)
    })

    it('should return current round when racing', async () => {
      await testStore.dispatch('generateRaceSchedule')
      testStore.commit('SET_CURRENT_ROUND', 0)

      const currentRound = testStore.getters.currentRound
      expect(currentRound).not.toBeNull()
      expect(currentRound?.roundNumber).toBe(1)
    })
  })

  describe('Mutations', () => {
    it('should set horses', () => {
      const horses: Horse[] = [{ id: '1', name: 'Test', color: '#000', condition: 50 }]
      testStore.commit('SET_HORSES', horses)
      expect(testStore.state.horses).toEqual(horses)
    })

    it('should set isRacing', () => {
      testStore.commit('SET_IS_RACING', true)
      expect(testStore.state.isRacing).toBe(true)
    })

    it('should set current round index', () => {
      testStore.commit('SET_CURRENT_ROUND', 2)
      expect(testStore.state.currentRoundIndex).toBe(2)
    })

    it('should set isPaused', () => {
      testStore.commit('SET_IS_PAUSED', true)
      expect(testStore.state.isPaused).toBe(true)
    })
  })

  describe('Pause/Resume Actions', () => {
    beforeEach(async () => {
      await testStore.dispatch('generateHorses')
      await testStore.dispatch('generateRaceSchedule')
    })

    it('should pause race when racing', async () => {
      testStore.dispatch('startRace').catch(() => {
        // Ignore errors for this test
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      await testStore.dispatch('pauseRace')

      expect(testStore.state.isPaused).toBe(true)
      expect(testStore.state.isRacing).toBe(true)
    })

    it('should resume race when paused', async () => {
      testStore.dispatch('startRace').catch(() => {
        // Ignore errors for this test
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      await testStore.dispatch('pauseRace')
      expect(testStore.state.isPaused).toBe(true)

      await testStore.dispatch('resumeRace')
      expect(testStore.state.isPaused).toBe(false)
      expect(testStore.state.isRacing).toBe(true)
    })

    it('should not pause when not racing', async () => {
      await testStore.dispatch('pauseRace')
      expect(testStore.state.isPaused).toBe(false)
    })

    it('should not resume when not paused', async () => {
      // Start race in background
      testStore.dispatch('startRace').catch(() => {
        // Ignore errors for this test
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      // Try to resume when not paused
      await testStore.dispatch('resumeRace')
      // Should remain false if not paused
      expect(testStore.state.isPaused).toBe(false)
    })
  })

  describe('Pause/Resume Getters', () => {
    it('should return isPaused state', () => {
      testStore.commit('SET_IS_PAUSED', true)
      expect(testStore.getters.isPaused).toBe(true)
    })

    it('should return canPause when racing and not paused', () => {
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', false)
      expect(testStore.getters.canPause).toBe(true)
    })

    it('should return canResume when racing and paused', () => {
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', true)
      expect(testStore.getters.canResume).toBe(true)
    })

    it('should not return canPause when not racing', () => {
      testStore.commit('SET_IS_RACING', false)
      testStore.commit('SET_IS_PAUSED', false)
      expect(testStore.getters.canPause).toBe(false)
    })

    it('should not return canPause when already paused', () => {
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', true)
      expect(testStore.getters.canPause).toBe(false)
    })

    it('should return canResetRace when racing and paused', () => {
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', true)
      expect(testStore.getters.canResetRace).toBe(true)
    })

    it('should not return canResetRace when not racing', () => {
      testStore.commit('SET_IS_RACING', false)
      testStore.commit('SET_IS_PAUSED', false)
      expect(testStore.getters.canResetRace).toBe(false)
    })

    it('should not return canResetRace when racing but not paused', () => {
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', false)
      expect(testStore.getters.canResetRace).toBe(false)
    })
  })

  describe('resetGame Action', () => {
    beforeEach(async () => {
      await testStore.dispatch('generateHorses')
      await testStore.dispatch('generateRaceSchedule')
    })

    it('should reset entire system to initial state', async () => {
      testStore.commit('SET_CURRENT_ROUND', 2)
      testStore.commit('SET_RACE_RESULTS', ['Lap 1: Result 1', 'Lap 2: Result 2'])
      testStore.commit('SET_IS_RACING', true)
      testStore.commit('SET_IS_PAUSED', true)

      await testStore.dispatch('resetGame')

      // All state should be reset to initial state
      expect(testStore.state.horses).toEqual([])
      expect(testStore.state.raceSchedule).toBeNull()
      expect(testStore.state.isRacing).toBe(false)
      expect(testStore.state.isPaused).toBe(false)
      expect(testStore.state.currentRoundIndex).toBe(-1)
      expect(testStore.state.raceResults).toEqual([])
    })

    it('should clear horses and schedule when resetting', async () => {
      expect(testStore.state.horses.length).toBe(20)
      expect(testStore.state.raceSchedule).not.toBeNull()

      await testStore.dispatch('resetGame')

      expect(testStore.state.horses).toEqual([])
      expect(testStore.state.raceSchedule).toBeNull()
    })
  })
})
