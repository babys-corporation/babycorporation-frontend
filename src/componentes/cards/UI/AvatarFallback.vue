<script setup lang="ts">
import { inject, computed } from 'vue'

const avatar = inject<any>('avatar')

// mostra o fallback quando a imagem não carregou ou deu erro
const mostrar = computed(() => !avatar?.imagemCarregou.value || avatar?.imagemErro.value)
</script>

<template>
  <div v-if="mostrar" class="avatar-fallback">
    <slot />
  </div>
</template>

<style scoped>
.avatar-fallback {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #f0e6f6;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #F6339A;
}
</style>
