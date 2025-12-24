<script setup lang="ts">
import Header from '@/components/Header/Header.vue'
import RaceContent from '@/components/RaceContent/RaceContent.vue'

</script>

<template>
  <div class="app">
    <Header />
    <RaceContent />
  </div>
</template>

<style scoped lang="scss">

.app {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  background-color: $color-background;
  display: flex;
  flex-direction: column;

  > :first-child {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .app {
    flex-direction: column;
    overflow: auto;
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
}

</style>
