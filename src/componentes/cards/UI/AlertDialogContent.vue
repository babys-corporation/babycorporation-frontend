<script setup lang="ts">
import { inject } from 'vue'

const dialog = inject<any>('alertDialog')
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="dialog?.aberto.value" class="dialog-portal">
        <div class="dialog-overlay" @click="dialog.aberto.value = false" />
        <div class="dialog-box">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-portal {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 51;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
