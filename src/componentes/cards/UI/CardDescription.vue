<script setup lang="ts">
// descrição/subtítulo do card
</script>

<template>
  <p class="card-descricao">
    <slot />
  </p>
</template>

<style scoped>
.card-descricao {
  font-size: 14px;
  color: #888;
  margin: 0;
}
</style>
