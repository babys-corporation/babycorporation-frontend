<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
</script>

<template>
  <li class="breadcrumb-separador" role="presentation" aria-hidden="true">
    <slot>
      <ChevronRight :size="14" />
    </slot>
  </li>
</template>

<style scoped>
.breadcrumb-separador {
  display: inline-flex;
  align-items: center;
  color: #bbb;
}
</style>
