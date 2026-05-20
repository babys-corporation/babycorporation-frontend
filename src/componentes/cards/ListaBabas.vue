<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BabaCard from '@/componentes/cards/BabaCard.vue'
import FiltrosBabas from '@/componentes/cards/FiltrosBabas.vue' 
import { useBabaStore } from '@/stores/baba'
const babaStore = useBabaStore()

const filtros = ref({
  busca: '',
  experiencia: 'Todas',
  apenasVerificadas: false,
  ordenar: 'Melhor Avaliação'
})

function atualizarFiltros(novosFiltros: any) {
  filtros.value = novosFiltros
}

onMounted(async() => {
  await babaStore.getBabas()
})
</script>

<template>
  <div class="pagina">
    <h1>Encontrar Babás</h1>
    <p class="subtitulo">{{ babaStore.babas.length }} babás disponíveis</p>

    <FiltrosBabas @atualizar="atualizarFiltros" />

    <div v-if="babaStore.babas.length > 0" class="lista">
      <div v-for="(baba, index) in babaStore.babas" :key="index" class="baba-card">
        <img v-if="baba.usuario.foto" :src="baba.usuario.foto" alt="foto">
        <div v-else class="user-default"></div>
        <div class="user-scope">
          <h1>{{ baba.usuario.username }}</h1>
        </div>
      </div>
    </div>

    <div v-else class="vazio">
      <p>Nenhuma babá encontrada com esses filtros.</p>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  padding: 24px 16px;
  background: #F9FAFB;
  min-height: 100vh;
}

.pagina h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.subtitulo {
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.baba-card {
  border: solid 1px #000000;
  border-radius: 10px;
  text-align: start;
}

.baba-card .user-default {
  width: 100%;
  border-radius: 10px 0 0 0;
  height: 20%;
}

.baba-card .user-scope {
  width: 100%;
  padding: 10px;
}

.baba-card .user-scope h1 {
  font-weight: 100;
  font-size: 15px;
}

.vazio {
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 15px;
}
</style>