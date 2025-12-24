<template>
  <div class="results">
    <div
      v-for="(result, index) in results"
      :key="index"
      class="results__item"
      :class="{
        'results__item--header': result.includes('Round'),
        'results__item--empty': result === '',
      }"
    >
      {{ result }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  results: string[]
}>()
</script>

<style scoped src="./RaceResults.scss"></style>
