<script setup lang="ts">
import { inject, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const carousel = inject<any>('carousel')
const orientacao = computed(() => carousel?.orientation.value ?? 'horizontal')
const podeNext = computed(() => carousel?.podeNext.value ?? false)

function aoClicar() {
  carousel?.irNext()
}
</script>

<template>
  <button
    class="carousel-btn carousel-btn-next"
    :class="orientacao === 'vertical' ? 'vertical' : ''"
    :disabled="!podeNext"
    @click="aoClicar"
  >
    <ArrowRight :size="16" />
    <span class="sr-only">Próximo slide</span>
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

.carousel-btn-next {
  top: 50%;
  right: -48px;
  transform: translateY(-50%);
}

.carousel-btn-next.vertical {
  bottom: -48px;
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
