<script setup lang="ts">
// lista dos itens do breadcrumb
</script>

<template>
  <ol class="breadcrumb-lista">
    <slot />
  </ol>
</template>

<style scoped>
.breadcrumb-lista {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #888;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
