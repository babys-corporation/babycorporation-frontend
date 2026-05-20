<script setup lang="ts">
// título do card
</script>

<template>
  <h4 class="card-titulo">
    <slot />
  </h4>
</template>

<style scoped>
.card-titulo {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1.2;
}
</style>
