<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  ratio?: number
}>()

// calcula o padding baseado na proporção (ex: 16/9 = 56.25%)
const paddingTop = computed(() => {
  if (!props.ratio) return '100%'
  return `${(1 / props.ratio) * 100}%`
})
</script>

<template>
  <div class="aspect-ratio-container" :style="{ paddingTop }">
    <div class="aspect-ratio-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.aspect-ratio-container {
  position: relative;
  width: 100%;
}

.aspect-ratio-inner {
  position: absolute;
  inset: 0;
}
</style>
