<script setup lang="ts">
import { provide, inject, computed } from 'vue'

const props = defineProps<{
  value: string
}>()

const accordion = inject<any>('accordion')

const isOpen = computed(() => accordion?.openItems.value.includes(props.value))

provide('accordionItem', { value: props.value, isOpen })
</script>

<template>
  <div class="accordion-item">
    <slot />
  </div>
</template>

<style scoped>
.accordion-item {
  border-bottom: 1px solid #E5E5E5;
}

.accordion-item:last-child {
  border-bottom: none;
}
</style>
