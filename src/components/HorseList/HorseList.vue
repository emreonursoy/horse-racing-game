<template>
  <Card title="Horses" variant="horses">
    <div v-if="horses.length > 0">
      <div class="horses-list__condition-container">
        <span class="horses-list__condition">Condition</span>
      </div>
      <ul class="horses-list">
        <HorseItem v-for="(h, index) in orderedHorses" :key="h.id" :horse="h" :order="index + 1" />
      </ul>
    </div>
    <NoDataContainer v-else text="No horses generated yet. Click 'Generate Horses' to create a horse list." />
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Card from '@/components/common/Card/Card.vue'
import NoDataContainer from '@/components/common/NoDataContainer/NoDataContainer.vue'
import HorseItem from '@/components/HorseItem/HorseItem.vue'
import type { Horse } from '@/types/horse'
import type { RaceSchedule, Round } from '@/types/race'

const props = defineProps<{
  horses: Horse[]
  currentRound?: Round | null
  isRacing?: boolean
  raceSchedule?: RaceSchedule | null
}>()

const isRaceFinished = computed(() => {
  if (!props.raceSchedule || props.raceSchedule.length === 0) {
    return false
  }
  return props.raceSchedule.every((round) => round.isCompleted)
})

const orderedHorses = computed(() => {
  if (props.isRacing || !isRaceFinished.value) {
    return [...props.horses].sort((a, b) => b.condition - a.condition)
  }

  if (props.currentRound?.results && props.currentRound.results.length > 0) {
    const resultsMap = new Map(props.currentRound.results.map((r) => [r.horse.id, r.position]))

    return [...props.horses].sort((a, b) => {
      const aPos = resultsMap.get(a.id) ?? 999
      const bPos = resultsMap.get(b.id) ?? 999
      return aPos - bPos
    })
  }

  return [...props.horses].sort((a, b) => b.condition - a.condition)
})
</script>

<style scoped src="./HorseList.scss"></style>
