<script setup lang="ts">
// componente de navegação breadcrumb
</script>

<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <slot />
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}
</style>
