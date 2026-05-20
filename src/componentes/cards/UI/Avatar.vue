<script setup lang="ts">
import { ref, provide } from 'vue'

const imagemCarregou = ref(false)
const imagemErro = ref(false)

provide('avatar', { imagemCarregou, imagemErro })
</script>

<template>
  <div class="avatar">
    <slot />
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  display: flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background-color: #f0e6f6;
}
</style>
