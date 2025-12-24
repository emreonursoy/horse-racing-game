<template>
  <Card title="Race Program & Results">
    <div v-if="schedule && schedule.length > 0" class="race-program">
      <div
        v-for="round in schedule"
        :key="round.roundNumber"
        class="race-program__lap"
        :class="{ 'race-program__lap--completed': round.isCompleted }"
      >
        <div class="race-program__header">
          <span class="race-program__lap-number">Lap {{ round.roundNumber }}</span>
          <Chip :text="`${round.distance}m`" />
          <span
            v-if="round.isCompleted"
            class="race-program__status race-program__status--completed"
            >✓ Completed</span
          >
          <span
            v-else-if="isRacing && currentRound && round.roundNumber === currentRound.roundNumber"
            class="race-program__status race-program__status--racing"
            >Race on track</span
          >
          <span v-else class="race-program__status race-program__status--waiting">Waiting</span>
        </div>

        <div class="race-program__content">
          <div class="race-program__program">
            <div class="race-program__list-title">Program</div>
            <ul class="race-program__list">
              <li
                v-for="(horse, index) in round.horses"
                :key="horse.id"
                class="race-program__list-item"
                :style="{ color: horse.color, borderLeftColor: horse.color }"
              >
                <span class="race-program__result-position">{{ index + 1 }}.</span>
                {{ horse.name }}
              </li>
            </ul>
          </div>

          <div class="race-program__results">
            <div class="race-program__list-title">Results</div>
            <ul
              v-if="round.isCompleted && round.results && round.results.length > 0"
              class="race-program__list"
            >
              <li
                v-for="(result, index) in sortedResults(round.results)"
                :key="index"
                class="race-program__list-item race-program__result-item"
                :style="{ borderLeftColor: result.horse.color }"
              >
                <span class="race-program__result-position">{{ index + 1 }}.</span>
                <span class="race-program__result-name" :style="{ color: result.horse.color }">
                  {{ result.horse.name }}
                </span>
                <span class="race-program__result-time">{{ result.time.toFixed(2) }}s</span>
              </li>
            </ul>
            <ul v-else class="race-program__list">
              <li class="race-program__list-item race-program__list-item--empty">No results yet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <NoDataContainer
      v-else
      text="No race schedule generated yet. Click 'Generate Schedule' to create a race program."
    />
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card/Card.vue'
import Chip from '@/components/common/Chip/Chip.vue'
import NoDataContainer from '@/components/common/NoDataContainer/NoDataContainer.vue'
import type { RaceSchedule, Round } from '@/types/race'
import type { RaceResult } from '@/types/race'

defineProps<{
  schedule?: RaceSchedule | null
  results?: string[]
  raceSchedule?: RaceSchedule | null
  isRacing?: boolean
  currentRound?: Round | null
}>()

function sortedResults(results: RaceResult[]): RaceResult[] {
  return [...results].sort((a, b) => a.time - b.time)
}
</script>

<style scoped src="./RaceProgram.scss"></style>
