<script setup lang="ts">
import { inject } from 'vue'

const item = inject<any>('accordionItem')
</script>

<template>
  <Transition
    enter-active-class="transicao-abrir"
    leave-active-class="transicao-fechar"
  >
    <div v-if="item?.isOpen.value" class="accordion-content">
      <div class="accordion-content-inner">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.accordion-content {
  overflow: hidden;
  font-size: 14px;
}

.accordion-content-inner {
  padding: 0 0 16px 0;
  color: #555;
}

.transicao-abrir {
  transition: all 0.2s ease-out;
}

.transicao-fechar {
  transition: all 0.2s ease-in;
}
</style>
