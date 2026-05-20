<script setup lang="ts">
import { inject } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const accordion = inject<any>('accordion')
const item = inject<any>('accordionItem')

function handleClick() {
  accordion?.toggle(item?.value)
}
</script>

<template>
  <button class="accordion-trigger" type="button" @click="handleClick">
    <slot />
    <ChevronDown
      :size="16"
      class="accordion-icon"
      :class="{ 'rotacionado': item?.isOpen.value }"
    />
  </button>
</template>

<style scoped>
.accordion-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: inherit;
}

.accordion-trigger:hover {
  text-decoration: underline;
}

.accordion-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: #888;
}

.rotacionado {
  transform: rotate(180deg);
}
</style>
