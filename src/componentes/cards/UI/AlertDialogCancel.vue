<script setup lang="ts">
import { inject } from 'vue'

const dialog = inject<any>('alertDialog')
</script>

<template>
  <button class="btn-cancelar" type="button" @click="dialog.aberto.value = false">
    <slot />
  </button>
</template>

<style scoped>
.btn-cancelar {
  padding: 10px 24px;
  border-radius: 10px;
  border: 2px solid #E5E5E5;
  background-color: transparent;
  color: #555;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background-color: #f5f5f5;
}
</style>
