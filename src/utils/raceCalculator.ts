import { RACE_TIMING } from '@/constants/game'
import type { Horse } from '@/types/horse'
import type { RaceResult } from '@/types/race'

export function calculateRaceResults(horses: Horse[], distance: number): RaceResult[] {
  const results: RaceResult[] = horses.map((horse) => {
    const conditionFactor = (100 - horse.condition) / 100
    const baseTime = distance / RACE_TIMING.BASE_SPEED_MPS
    const timeVariation = conditionFactor * (distance / 20)
    const randomVariation = (Math.random() - 0.5) * 2

    const time = Math.max(1, baseTime + timeVariation + randomVariation)

    return {
      horse,
      position: 0,
      time,
      distance,
    }
  })

  results.forEach((result, index) => {
    result.position = index + 1
  })

  return results
}

export function calculateRaceDuration(distance: number): number {
  return Math.max(
    RACE_TIMING.MIN_RACE_DURATION_MS,
    (distance / 1000) * RACE_TIMING.DISTANCE_TO_DURATION_FACTOR * 1000,
  )
}

export function formatRaceResults(
  roundNumber: number,
  distance: number,
  results: RaceResult[],
): string[] {
  return [
    `Round ${roundNumber} (${distance}m):`,
    ...results.map(
      (result) => `${result.position}. ${result.horse.name} - ${result.time.toFixed(2)}s`,
    ),
    '',
  ]
}
