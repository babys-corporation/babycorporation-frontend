<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  src?: string
  alt?: string
}>()

const avatar = inject<any>('avatar')

function aoCarregar() {
  if (avatar) avatar.imagemCarregou.value = true
}

function aoErrar() {
  if (avatar) avatar.imagemErro.value = true
}
</script>

<template>
  <img
    v-if="props.src"
    class="avatar-imagem"
    :src="props.src"
    :alt="props.alt ?? ''"
    @load="aoCarregar"
    @error="aoErrar"
  />
</template>

<style scoped>
.avatar-imagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
