<template>
  <section :class="cardClasses">
    <h2 v-if="title" class="card__title">{{ title }}</h2>
    <div class="card__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  title?: string
}>()

const cardClasses = computed(() => {
  const base = 'card'
  return [base]
})
</script>

<style scoped src="./Card.scss"></style>
