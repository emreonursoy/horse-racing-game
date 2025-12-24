import { describe, expect, it } from 'vitest'

import type { Horse } from '../../types/horse'
import { calculateRaceResults } from '../../utils/raceCalculator'

describe('raceCalculator', () => {
  const createHorse = (id: string, condition: number): Horse => ({
    id,
    name: `Horse ${id}`,
    color: '#000000',
    condition,
  })

  describe('calculateRaceResults', () => {
    it('should calculate results for all horses', () => {
      const horses = [createHorse('1', 100), createHorse('2', 50), createHorse('3', 1)]
      const distance = 1200

      const results = calculateRaceResults(horses, distance)

      expect(results.length).toBe(3)
      results.forEach((result) => {
        expect(result).toHaveProperty('horse')
        expect(result).toHaveProperty('position')
        expect(result).toHaveProperty('time')
        expect(result).toHaveProperty('distance')
        expect(result.distance).toBe(distance)
        expect(result.time).toBeGreaterThan(0)
        expect(result.position).toBeGreaterThanOrEqual(1)
        expect(result.position).toBeLessThanOrEqual(3)
      })
    })

    it('should assign positions correctly (1, 2, 3...)', () => {
      const horses = [createHorse('1', 100), createHorse('2', 50), createHorse('3', 1)]

      const results = calculateRaceResults(horses, 1200)
      const positions = results.map((r) => r.position).sort((a, b) => a - b)

      expect(positions).toEqual([1, 2, 3])
    })

    it('should sort results by time (fastest first)', () => {
      const horses = [
        createHorse('1', 100), // Best condition
        createHorse('2', 50),
        createHorse('3', 1), // Worst condition
      ]

      const results = calculateRaceResults(horses, 1200)

      // Results should be sorted by time (fastest = lowest time)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].time).toBeLessThanOrEqual(results[i + 1].time)
      }
    })

    it('should handle different distances', () => {
      const horses = [createHorse('1', 50)]
      const distances = [1200, 1400, 1600, 1800, 2000, 2200]

      distances.forEach((distance) => {
        const results = calculateRaceResults(horses, distance)
        expect(results[0].distance).toBe(distance)
        expect(results[0].time).toBeGreaterThan(0)
      })
    })

    it('should ensure all times are positive', () => {
      const horses = Array.from({ length: 10 }, (_, i) => createHorse(`${i}`, Math.random() * 100))

      const results = calculateRaceResults(horses, 1200)

      results.forEach((result) => {
        expect(result.time).toBeGreaterThan(0)
      })
    })
  })
})
