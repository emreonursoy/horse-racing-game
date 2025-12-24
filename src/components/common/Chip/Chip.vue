<template>
  <span class="chip">{{ text }}</span>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped src="./Chip.scss"></style>
