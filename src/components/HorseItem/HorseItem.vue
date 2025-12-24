<template>
  <li class="horse-item">
    <span class="horse-item__order">{{ order }}</span>
    <span class="horse-item__color-circle" :style="{ backgroundColor: horse.color }"></span>
    <span class="horse-item__name">{{ horse.name }}</span>
    <Chip :text="`${horse.condition}`" />
  </li>
</template>

<script setup lang="ts">
import Chip from '@/components/common/Chip/Chip.vue'
import type { Horse } from '@/types/horse'

defineProps<{
  horse: Horse
  order: number
}>()
</script>

<style scoped src="./HorseItem.scss"></style>
