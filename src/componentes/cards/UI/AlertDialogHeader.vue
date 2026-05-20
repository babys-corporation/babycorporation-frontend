<script setup lang="ts">
// cabeçalho do dialog
</script>

<template>
  <div class="dialog-header">
    <slot />
  </div>
</template>

<style scoped>
.dialog-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
