<script setup lang="ts">
// rodapé do card
</script>

<template>
  <div class="card-rodape">
    <slot />
  </div>
</template>

<style scoped>
.card-rodape {
  display: flex;
  align-items: center;
  padding: 0 24px 24px 24px;
  gap: 10px;
}
</style>
