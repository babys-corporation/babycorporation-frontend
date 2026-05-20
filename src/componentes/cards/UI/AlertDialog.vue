<script setup lang="ts">
import { ref, provide } from 'vue'

const aberto = ref(false)

provide('alertDialog', { aberto })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
