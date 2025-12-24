<template>
  <div class="no-data-container">
    <p class="no-data-container__text">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style scoped src="./NoDataContainer.scss"></style>
