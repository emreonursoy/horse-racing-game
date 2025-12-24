<template>
  <div class="race-content__layout">
    <div class="race-content__section-horses">
      <HorseList
        :horses="horses"
        :currentRound="currentRound"
        :isRacing="isRacing"
        :raceSchedule="raceSchedule"
      />
    </div>
    <div class="race-content__section-race-program">
      <RaceProgram
        :schedule="raceSchedule"
        :results="raceResults"
        :raceSchedule="raceSchedule"
        :isRacing="isRacing"
        :currentRound="currentRound"
      />
    </div>
    <div class="race-content__section-race-track">
      <RaceWinners :schedule="raceSchedule" :isRaceFinished="isRaceFinished" />
      <RaceTrack
        :round="currentRound"
        :horses="currentRoundHorses || []"
        :distance="currentRound?.distance || 0"
        :isRacing="isRacing"
        :roundNumber="currentRound?.roundNumber"
        :results="currentRound?.results"
        :isRaceFinished="isRaceFinished"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import HorseList from '@/components/HorseList/HorseList.vue'
import RaceProgram from '@/components/RaceProgram/RaceProgram.vue'
import RaceTrack from '@/components/RaceTrack/RaceTrack.vue'
import RaceWinners from '@/components/RaceWinners/RaceWinners.vue'
import { useGame } from '@/composables/useGame'

const {
  horses,
  raceSchedule,
  currentRound,
  currentRoundHorses,
  isRacing,
  raceResults,
  isRaceFinished,
} = useGame()
</script>

<style scoped src="./RaceContent.scss"></style>
