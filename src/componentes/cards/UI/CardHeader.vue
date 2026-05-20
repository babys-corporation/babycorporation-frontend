<script setup lang="ts">
// cabeçalho do card
</script>

<template>
  <div class="card-header">
    <slot />
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 24px 0 24px;
}
</style>
