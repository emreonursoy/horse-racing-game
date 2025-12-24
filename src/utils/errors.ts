export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = 'GameError'
    Object.setPrototypeOf(this, GameError.prototype)
  }
}

export class HorseGenerationError extends GameError {
  constructor(message: string) {
    super(message, 'HORSE_GENERATION_ERROR')
    this.name = 'HorseGenerationError'
  }
}

export class RaceScheduleError extends GameError {
  constructor(message: string) {
    super(message, 'RACE_SCHEDULE_ERROR')
    this.name = 'RaceScheduleError'
  }
}

export class RaceExecutionError extends GameError {
  constructor(message: string) {
    super(message, 'RACE_EXECUTION_ERROR')
    this.name = 'RaceExecutionError'
  }
}
