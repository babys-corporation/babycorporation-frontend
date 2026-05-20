<script setup lang="ts">
// cartão base do projeto
</script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  background-color: #fff;
  overflow: hidden;
}
</style>
