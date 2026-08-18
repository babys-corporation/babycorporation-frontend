<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BabaCard from '@/componentes/cards/BabaCard.vue'
import FiltrosBabas from '@/componentes/cards/FiltrosBabas.vue' 
import { useBabaStore } from '@/stores/baba'
const babaStore = useBabaStore()

const filtros = ref({
  busca: '',
  foto: '',
  nome: '',
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
    <p class="subtitulo">
      {{ babaStore.babas.length }} babás disponíveis
    </p>

    <FiltrosBabas @atualizar="atualizarFiltros" />

    <div v-if="babaStore.babas.length > 0" class="lista">
      <div
        v-for="(baba, index) in babaStore.babas"
        :key="index"
        class="baba-card"
      >
        <div class="foto-area">
          <img
            v-if="baba.usuario.foto"
            :src="baba.usuario.foto.file"
            alt="foto"
          />

          <div v-else class="user-default"></div>

         <!--
          <span
            v-if="baba.verificada"
            class="verificado"
          >
            Verificado
          </span>
          -->
        </div>

        <div class="conteudo">
          <h2>{{ baba.usuario.first_name }}  {{ baba.usuario.last_name }}</h2>

          <p class="descricao">
            {{ baba.descricao }}
          </p>

           <span class="experiencia">
              {{ baba.experiencia_anos }} anos de experiência
            </span>

          <p class="habilidade">
            {{ baba.habilidades }}
          </p>

          <div class="rodape">
            <span class="preco">
              R$ {{ baba.valor_hora || 24 }}/hora
            </span>

           
          </div>
        </div>
      </div>
    </div>

    <div v-else class="vazio">
      <p>Nenhuma babá encontrada.</p>
    </div>
  </div>
</template>
      
<style scoped>
.pagina {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 24px 16px;
  font-family: Arial, Helvetica, sans-serif;
}

.pagina h1 {
  font-size: 34px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}

.subtitulo {
  color: #888;
  font-size: 14px;
  margin-bottom: 24px;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}

.baba-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #ececec;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
  width: 80%;
  text-align: left;
}

.baba-card:hover {
  transform: translateY(-2px);
}



.verificado {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #22c55e;
  color: white;
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: bold;
}

.conteudo {
  padding: 16px;
}

.conteudo h2 {
  font-size: 20px;
  margin-bottom: 6px;
  color: #111;
}

.cidade {
  color: #777;
  font-size: 13px;
  margin-bottom: 10px;
}

.descricao {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
}
.habilidade{
font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
  background-color:#E5E5E5 ;
  padding: 4px;
  border-radius: 10px;
}

.rodape {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preco {
  color: #ff2d8d;
  font-size: 22px;
  font-weight: bold;
}

.experiencia {
  font-size: 13px;
  color: #777;
}

.vazio {
  text-align: center;
  padding: 40px;
  color: #999;
}.foto-area {
  position: relative;
  height: 200px; 
}

.foto-area img,
.user-default {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #ddd;
}
</style>