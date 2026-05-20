<script setup lang="ts">
// rodapé do dialog com os botões
</script>

<template>
  <div class="dialog-footer">
    <slot />
  </div>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 640px) {
  .dialog-footer {
    flex-direction: column-reverse;
  }
}
</style>
