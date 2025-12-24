<template>
  <Card title="Horses" variant="horses">
    <div v-if="horses.length > 0">
      <div class="horses-list__condition-container">
        <span class="horses-list__condition">Condition</span>
      </div>
      <ul class="horses-list">
        <HorseItem v-for="(h, index) in horses" :key="h.id" :horse="h" :order="index + 1" />
      </ul>
    </div>
    <NoDataContainer v-else text="No horses generated yet. Click 'Generate Horses' to create a horse list." />
  </Card>
</template>

<script setup lang="ts">
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
</script>

<style scoped src="./HorseList.scss"></style>
