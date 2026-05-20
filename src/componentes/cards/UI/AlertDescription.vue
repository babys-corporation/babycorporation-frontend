<script setup lang="ts">
// sem props extras por enquanto
</script>

<template>
  <div class="alert-descricao">
    <slot />
  </div>
</template>

<style scoped>
.alert-descricao {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
