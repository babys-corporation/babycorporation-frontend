<script setup lang="ts">
import { inject, computed } from 'vue'

const carousel = inject<any>('carousel')
const orientacao = computed(() => carousel?.orientation.value ?? 'horizontal')
</script>

<template>
  <div class="carousel-item" :class="orientacao === 'vertical' ? 'vertical' : ''" role="group" aria-roledescription="slide">
    <slot />
  </div>
</template>

<style scoped>
.carousel-item {
  min-width: 0;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;
  padding-left: 16px;
}

.carousel-item.vertical {
  padding-left: 0;
  padding-top: 16px;
}
</style>
