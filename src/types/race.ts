import type { Horse } from '@/types/horse'

export interface Round {
  roundNumber: number
  distance: number
  horses: Horse[]
  results?: RaceResult[]
  isCompleted: boolean
}

export type RaceSchedule = Round[]

export interface RaceResult {
  horse: Horse
  position: number
  time: number
  distance: number
}
