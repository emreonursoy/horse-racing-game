<template>
  <Card title="Race Winners" v-if="isRaceFinished && schedule && schedule.length > 0">
    <div class="race-winners">
      <div v-for="round in completedRounds" :key="round.roundNumber" class="race-winners__lap">
        <div class="race-winners__lap-header">
          <span class="race-winners__lap-title">Lap {{ round.roundNumber }}</span>
          <Chip :text="`${round.distance}m`" />
        </div>

        <div class="race-winners__podium">
          <div
            v-for="(winner, index) in getTopThree(round)"
            :key="winner.horse.id"
            class="race-winners__medal"
            :class="`race-winners__medal--${getMedalType(index)}`"
          >
            <div class="race-winners__medal-icon">
              <MedalIcon :type="getMedalType(index)" />
            </div>
            <div class="race-winners__medal-content">
              <span class="race-winners__horse-name">
                {{ winner.horse.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Card from '@/components/common/Card/Card.vue'
import Chip from '@/components/common/Chip/Chip.vue'
import MedalIcon from '@/components/common/MedalIcon/MedalIcon.vue'
import type { RaceResult, RaceSchedule, Round } from '@/types/race'

const props = defineProps<{
  schedule?: RaceSchedule | null
  isRaceFinished?: boolean
}>()

const completedRounds = computed(() => {
  if (!props.schedule) return []
  return props.schedule.filter(
    (round) => round.isCompleted && round.results && round.results.length > 0,
  )
})

function getTopThree(round: Round): RaceResult[] {
  if (!round.results || round.results.length === 0) return []

  const sorted = [...round.results].sort((a, b) => a.time - b.time)
  return sorted.slice(0, 3)
}

function getMedalType(index: number): 'gold' | 'silver' | 'bronze' {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  return 'bronze'
}
</script>

<style scoped src="./RaceWinners.scss"></style>
