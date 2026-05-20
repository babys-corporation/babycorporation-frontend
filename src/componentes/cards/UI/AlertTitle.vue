<script setup lang="ts">
// sem props extras por enquanto
</script>

<template>
  <div class="alert-title">
    <slot />
  </div>
</template>

<style scoped>
.alert-title {
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
}
</style>
