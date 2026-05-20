<script setup lang="ts">
import { inject } from 'vue'

const dialog = inject<any>('alertDialog')
</script>

<template>
  <button class="btn-confirmar" type="button" @click="dialog.aberto.value = false">
    <slot />
  </button>
</template>

<style scoped>
.btn-confirmar {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background-color: #F6339A;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirmar:hover {
  background-color: #e0288a;
}
</style>
