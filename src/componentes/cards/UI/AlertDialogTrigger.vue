<script setup lang="ts">
import { inject } from 'vue'

const dialog = inject<any>('alertDialog')
</script>

<template>
  <button type="button" @click="dialog.aberto.value = true">
    <slot />
  </button>
</template>
