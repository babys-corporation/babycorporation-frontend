<script setup lang="ts">
import { inject, computed, ref, onMounted } from 'vue'

const carousel = inject<any>('carousel')
const orientacao = computed(() => carousel?.orientation.value ?? 'horizontal')

const viewportEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (carousel && viewportEl.value) {
    carousel.viewportRef.value = viewportEl.value
  }
})
</script>

<template>
  <div ref="viewportEl" class="carousel-viewport">
    <div class="carousel-track" :class="orientacao === 'vertical' ? 'vertical' : ''">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 16px;
}

.carousel-track.vertical {
  flex-direction: column;
  margin-top: -16px;
}
</style>
