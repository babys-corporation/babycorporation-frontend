<script setup lang="ts">
// item individual do breadcrumb
</script>

<template>
  <li class="breadcrumb-item">
    <slot />
  </li>
</template>

<style scoped>
.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
