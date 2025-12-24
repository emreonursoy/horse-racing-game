<template>
  <header class="header">
    <h1 class="header__title">Horse Racing Game</h1>
    <div class="header__actions">
      <Button
        variant="primary"
        :disabled="isRacing || isRaceFinished"
        @click="handleGenerateHorses"
      >
        Generate Horses
      </Button>
      <Button
        v-if="horses.length > 0"
        variant="primary"
        :disabled="!canGenerateSchedule || isRacing"
        @click="handleGenerateSchedule"
      >
        {{ isRaceFinished ? 'Generate new Schedule' : 'Generate Schedule' }}
      </Button>
      <Button
        v-if="!isRaceFinished && horses.length > 0 && !isRacing"
        variant="secondary"
        :disabled="!canStartRace"
        @click="handleStartRace"
      >
        Start Race
      </Button>
      <Button v-if="isRacing && canPause" variant="secondary" @click="handlePauseRace">
        Pause
      </Button>
      <Button v-if="isRacing && canResume" variant="secondary" @click="handleResumeRace">
        Resume
      </Button>
      <Button v-if="canResetRace" variant="danger" @click="handleResetGame"> Reset Game </Button>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import { useGame } from '@/composables/useGame'

const {
  horses,
  isRacing,
  isRaceFinished,
  canGenerateSchedule,
  canStartRace,
  canPause,
  canResume,
  canResetRace,
  resetGame,
  generateHorses,
  generateRaceSchedule,
  startRace,
  pauseRace,
  resumeRace,
  resetRaceState,
} = useGame()

async function handleGenerateHorses(): Promise<void> {
  try {
    await resetGame()
    await generateHorses()
  } catch (error) {
    console.error('Failed to generate horses:', error)
  }
}

async function handleGenerateSchedule(): Promise<void> {
  try {
    await resetRaceState()
    await generateRaceSchedule()
  } catch (error) {
    console.error('Failed to generate schedule:', error)
  }
}

async function handleStartRace(): Promise<void> {
  try {
    await startRace()
  } catch (error) {
    console.error('Failed to start race:', error)
  }
}

async function handlePauseRace(): Promise<void> {
  try {
    await pauseRace()
  } catch (error) {
    console.error('Failed to pause race:', error)
  }
}

async function handleResumeRace(): Promise<void> {
  try {
    await resumeRace()
  } catch (error) {
    console.error('Failed to resume race:', error)
  }
}

async function handleResetGame(): Promise<void> {
  try {
    await resetGame()
  } catch (error) {
    console.error('Failed to reset game:', error)
  }
}
</script>

<style scoped src="./Header.scss"></style>
