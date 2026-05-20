<script setup lang="ts">
import { inject, computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const carousel = inject<any>('carousel')
const orientacao = computed(() => carousel?.orientation.value ?? 'horizontal')
const podePrev = computed(() => carousel?.podePrev.value ?? false)

function aoClicar() {
  carousel?.irPrev()
}
</script>

<template>
  <button
    class="carousel-btn carousel-btn-prev"
    :class="orientacao === 'vertical' ? 'vertical' : ''"
    :disabled="!podePrev"
    @click="aoClicar"
  >
    <ArrowLeft :size="16" />
    <span class="sr-only">Slide anterior</span>
  </button>
</template>

<style scoped>
.carousel-btn {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #E5E5E5;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.carousel-btn:hover {
  background-color: #f5f5f5;
}

.carousel-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.carousel-btn-prev {
  top: 50%;
  left: -48px;
  transform: translateY(-50%);
}

.carousel-btn-prev.vertical {
  top: -48px;
  left: 50%;
  transform: translateX(-50%) rotate(90deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
</style>
