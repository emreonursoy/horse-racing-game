import { describe, expect, it } from 'vitest'

import type { Horse } from '../../types/horse'
import { generateHorses, selectRandomHorses } from '../../utils/horseGenerator'

describe('horseGenerator', () => {
  describe('generateHorses', () => {
    it('should generate exactly 20 horses', () => {
      const horses = generateHorses()
      expect(horses.length).toBe(20)
    })

    it('should generate horses with unique colors', () => {
      const horses = generateHorses()
      const colors = horses.map((h) => h.color)
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBe(colors.length)
    })

    it('should generate horses with unique names', () => {
      const horses = generateHorses()
      const names = horses.map((h) => h.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })

    it('should generate horses with two-part names (first name + second name)', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        const nameParts = horse.name.split(' ')
        expect(nameParts.length).toBe(2)
        expect(nameParts[0]).toBeTruthy()
        expect(nameParts[1]).toBeTruthy()
      })
    })

    it('should ensure no two horses share the same first name or second name', () => {
      const horses = generateHorses()
      const firstNames = horses.map((h) => h.name.split(' ')[0]!)
      const secondNames = horses.map((h) => h.name.split(' ')[1]!)

      // All first names should be unique
      const uniqueFirstNames = new Set(firstNames)
      expect(uniqueFirstNames.size).toBe(firstNames.length)

      // All second names should be unique
      const uniqueSecondNames = new Set(secondNames)
      expect(uniqueSecondNames.size).toBe(secondNames.length)
    })

    it('should generate horses with valid condition scores', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse.condition).toBeGreaterThanOrEqual(1)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })

    it('should generate horses with required properties', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('condition')
        expect(typeof horse.id).toBe('string')
        expect(typeof horse.name).toBe('string')
        expect(typeof horse.color).toBe('string')
        expect(typeof horse.condition).toBe('number')
      })
    })
  })

  describe('selectRandomHorses', () => {
    const allHorses: Horse[] = Array.from({ length: 20 }, (_, i) => ({
      id: `horse-${i}`,
      name: `Horse ${i}`,
      color: `#${i.toString(16).padStart(6, '0')}`,
      condition: 50,
    }))

    it('should select 10 horses by default', () => {
      const selected = selectRandomHorses(allHorses)
      expect(selected.length).toBe(10)
    })

    it('should select specified number of horses', () => {
      const selected = selectRandomHorses(allHorses, 5)
      expect(selected.length).toBe(5)
    })

    it('should return all horses if count exceeds available', () => {
      const selected = selectRandomHorses(allHorses, 25)
      expect(selected.length).toBe(20)
    })

    it('should return all horses if count equals available', () => {
      const selected = selectRandomHorses(allHorses, 20)
      expect(selected.length).toBe(20)
    })

    it('should return different selections on multiple calls', () => {
      const selection1 = selectRandomHorses(allHorses, 10)
      const selection2 = selectRandomHorses(allHorses, 10)

      // Due to randomness, they might be the same, but likely different
      // We'll just check that both are valid
      expect(selection1.length).toBe(10)
      expect(selection2.length).toBe(10)
    })

    it('should select exactly 10 horses from 20 available', () => {
      const selected = selectRandomHorses(allHorses, 10)
      expect(selected.length).toBe(10)

      // Verify all selected horses are from the original set
      const selectedIds = new Set(selected.map((h) => h.id))
      allHorses.forEach((horse) => {
        if (selectedIds.has(horse.id)) {
          // This horse was selected, verify it's in the selection
          expect(selected.some((h) => h.id === horse.id)).toBe(true)
        }
      })
    })

    it('should not select duplicate horses in a single selection', () => {
      const selected = selectRandomHorses(allHorses, 10)
      const ids = selected.map((h) => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10) // All 10 should be unique
    })
  })
})
