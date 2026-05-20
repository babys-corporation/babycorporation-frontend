<script setup lang="ts">
import { ref, provide } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
}>(), {
  type: 'single'
})

const openItems = ref<string[]>(
  props.defaultValue
    ? Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]
    : []
)

function toggle(value: string) {
  if (props.type === 'single') {
    openItems.value = openItems.value[0] === value ? [] : [value]
  } else {
    if (openItems.value.includes(value)) {
      openItems.value = openItems.value.filter(v => v !== value)
    } else {
      openItems.value = [...openItems.value, value]
    }
  }
}

provide('accordion', { openItems, toggle })
</script>

<template>
  <div class="accordion">
    <slot />
  </div>
</template>

<style scoped>
.accordion {
  width: 100%;
}
</style>
