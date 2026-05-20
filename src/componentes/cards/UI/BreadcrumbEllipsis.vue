<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
</script>

<template>
  <span class="breadcrumb-reticencias" role="presentation" aria-hidden="true">
    <MoreHorizontal :size="16" />
    <span class="sr-only">Mais</span>
  </span>
</template>

<style scoped>
.breadcrumb-reticencias {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: #888;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
</style>
