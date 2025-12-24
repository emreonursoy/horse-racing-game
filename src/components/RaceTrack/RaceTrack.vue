<template>
  <Card v-if="!isRaceFinished" title="Race Track" variant="track">
    <div v-if="round && horses && horses.length > 0 && !isRaceFinished" class="track">
      <div class="track__header">
        <span v-if="round.isCompleted" class="track__status">Lap finished</span>
        <span v-else-if="isRacing" class="track__status">Racing</span>
        <span v-else class="track__status">Waiting</span>
      </div>
      <div class="track__container">
        <div
          v-for="(horse, index) in sortedHorses"
          :key="`${roundKey}-${horse.id}`"
          class="track__lane"
        >
          <div class="track__lane-number">{{ index + 1 }}</div>
          <div class="track__path">
            <div
              :key="`runner-${roundKey}-${horse.id}`"
              class="track__runner"
              :class="{ 'track__runner--racing': isRacing }"
              :style="{
                animationDelay: isRacing ? `${horse.animationDelay}ms` : '0ms',
                animationDuration: isRacing ? `${horse.animationDuration}ms` : '0ms',
              }"
            >
              <span class="track__horse-name" :style="{ color: horse.color }">
                {{ horse.name }}
              </span>
              <HorseIcon :color="horse.color" custom-class="track__horse-icon" />
            </div>
            <div class="track__finish-line" />
          </div>
        </div>
        <div class="track_footer">
          <span class="track__distance">Distance: {{ distance }}m</span>
          <span>Lap {{ round?.roundNumber }}</span>
          <span class="track__finish">Finish</span>
        </div>
      </div>
    </div>
    <NoDataContainer
      v-else
      text="No active race. Generate a schedule and start a race to see the track."
    />
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Card from '@/components/common/Card/Card.vue'
import HorseIcon from '@/components/common/HorseIcon/HorseIcon.vue'
import NoDataContainer from '@/components/common/NoDataContainer/NoDataContainer.vue'
import { RACE_TIMING } from '@/constants/game'
import type { Horse } from '@/types/horse'
import type { RaceResult, Round } from '@/types/race'
import { calculateRaceResults } from '@/utils/raceCalculator'

const props = defineProps<{
  horses?: Horse[]
  distance?: number
  isRacing?: boolean
  roundNumber?: number
  results?: RaceResult[]
  round?: Round | null
  isRaceFinished?: boolean
}>()

const roundKey = computed(() => props.roundNumber ?? Date.now())

const raceResults = computed(() => {
  if (props.results && props.results.length > 0) {
    return props.results
  }

  if (!props.horses || props.horses.length === 0 || !props.distance) {
    return []
  }

  return calculateRaceResults(props.horses, props.distance)
})

const sortedHorses = computed(() => {
  if (!props.horses || props.horses.length === 0) {
    return []
  }

  const results = raceResults.value

  if (!Array.isArray(results) || results.length === 0) {
    return props.horses.map((horse) => ({
      ...horse,
      animationDuration: 2000,
      animationDelay: 0,
      position: 999,
    }))
  }

  const horsesWithTiming = props.horses
    .filter((horse) => horse && horse.id)
    .map((horse) => {
      const result = results.find((r) => r && r.horse && r.horse.id === horse.id)

      if (!result) {
        const estimatedTime = (props.distance || 0) / 10 + (100 - horse.condition) / 10
        return {
          ...horse,
          animationDuration: (estimatedTime * 1000) / RACE_TIMING.ANIMATION_SPEED_MULTIPLIER,
          animationDelay: 0,
          position: 999,
        }
      }

      const animationDuration = (result.time * 1000) / RACE_TIMING.ANIMATION_SPEED_MULTIPLIER

      const animationDelay = 0

      return {
        ...horse,
        animationDuration,
        animationDelay,
        position: result.position,
      }
    })

  if (props.results && props.results.length > 0) {
    return horsesWithTiming.sort((a, b) => {
      const aPos = a.position ?? 999
      const bPos = b.position ?? 999
      return aPos - bPos
    })
  }

  return horsesWithTiming
})
</script>

<style scoped src="./RaceTrack.scss"></style>
