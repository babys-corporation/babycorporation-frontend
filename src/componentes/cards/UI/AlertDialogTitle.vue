<script setup lang="ts">
// título do dialog
</script>

<template>
  <h2 class="dialog-titulo">
    <slot />
  </h2>
</template>

<style scoped>
.dialog-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #111;
}
</style>
