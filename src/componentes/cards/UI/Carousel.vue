<script setup lang="ts">
import { ref, provide, onMounted, onBeforeUnmount, computed } from 'vue'
import emblaCarouselVanilla from 'embla-carousel'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'

const props = withDefaults(defineProps<{
  opts?: EmblaOptionsType
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal'
})

const emit = defineEmits<{
  (e: 'init-api', api: EmblaCarouselType): void
}>()

const viewportRef = ref<HTMLElement | null>(null)
const embla = ref<EmblaCarouselType | null>(null)
const podePrev = ref(false)
const podeNext = ref(false)

function atualizarEstado() {
  if (!embla.value) return
  podePrev.value = embla.value.canScrollPrev()
  podeNext.value = embla.value.canScrollNext()
}

function irPrev() {
  embla.value?.scrollPrev()
}

function irNext() {
  embla.value?.scrollNext()
}

function aoApertarTecla(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    irPrev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    irNext()
  }
}

onMounted(() => {
  if (!viewportRef.value) return

  embla.value = emblaCarouselVanilla(viewportRef.value, {
    ...props.opts,
    axis: props.orientation === 'horizontal' ? 'x' : 'y'
  })

  embla.value.on('select', atualizarEstado)
  embla.value.on('reInit', atualizarEstado)
  atualizarEstado()
  emit('init-api', embla.value)
})

onBeforeUnmount(() => {
  embla.value?.destroy()
})

provide('carousel', {
  viewportRef,
  embla,
  orientation: computed(() => props.orientation),
  irPrev,
  irNext,
  podePrev,
  podeNext
})
</script>

<template>
  <div
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    @keydown="aoApertarTecla"
  >
    <slot />
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  outline: none;
}
</style>
