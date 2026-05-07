<script setup lang="ts">
import BabaCard from './BabaCard.vue'

const babas = [
  {
    nome: 'Patrícia Alves',
    cidade: 'Brasília, DF',
    descricao: 'Mais de 10 anos de experiência...',
    experiencia: '10 anos de experiência',
    foto: '/patricia.png',
    tags: ['Psicologia Infantil'],
    verificada: true
  },
  // ... outras babás
]
</script>

<template>
  <div class="lista">
    <BabaCard
      v-for="baba in babas"
      :key="baba.nome"
      v-bind="baba"
    />
  </div>
</template>