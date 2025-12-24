import { GAME_CONFIG } from '@/constants/game'
import { HORSE_COLORS, HORSE_FIRST_NAMES, HORSE_SECOND_NAMES } from '@/constants/horses'
import type { Horse } from '@/types/horse'

import { randomInt, shuffle } from './array'
import { HorseGenerationError } from './errors'

export function generateHorses(): Horse[] {
  try {
    const horses: Horse[] = []

    const shuffledColors = shuffle([...HORSE_COLORS])
    const shuffledFirstNames = shuffle([...HORSE_FIRST_NAMES])
    const shuffledSecondNames = shuffle([...HORSE_SECOND_NAMES])

    if (shuffledColors.length < GAME_CONFIG.TOTAL_HORSES) {
      throw new HorseGenerationError(
        `Insufficient colors: need ${GAME_CONFIG.TOTAL_HORSES}, have ${shuffledColors.length}`,
      )
    }

    if (shuffledFirstNames.length < GAME_CONFIG.TOTAL_HORSES) {
      throw new HorseGenerationError(
        `Insufficient first names: need ${GAME_CONFIG.TOTAL_HORSES}, have ${shuffledFirstNames.length}`,
      )
    }

    if (shuffledSecondNames.length < GAME_CONFIG.TOTAL_HORSES) {
      throw new HorseGenerationError(
        `Insufficient second names: need ${GAME_CONFIG.TOTAL_HORSES}, have ${shuffledSecondNames.length}`,
      )
    }

    for (let i = 0; i < GAME_CONFIG.TOTAL_HORSES; i++) {
      const firstName = shuffledFirstNames[i]!
      const secondName = shuffledSecondNames[i]!
      const fullName = `${firstName} ${secondName}`

      horses.push({
        id: `horse-${i + 1}`,
        name: fullName,
        color: shuffledColors[i]!,
        condition: randomInt(GAME_CONFIG.MIN_CONDITION, GAME_CONFIG.MAX_CONDITION),
      })
    }

    return horses
  } catch (error) {
    if (error instanceof HorseGenerationError) {
      throw error
    }
    throw new HorseGenerationError(
      `Failed to generate horses: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export function selectRandomHorses(
  horses: Horse[],
  count: number = GAME_CONFIG.HORSES_PER_ROUND,
): Horse[] {
  if (horses.length <= count) {
    return [...horses]
  }

  const shuffled = shuffle(horses)
  return shuffled.slice(0, count)
}
