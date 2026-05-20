<script setup lang="ts">
// ação do card (botão ou link no canto)
</script>

<template>
  <div class="card-acao">
    <slot />
  </div>
</template>

<style scoped>
.card-acao {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 0 24px;
}
</style>
