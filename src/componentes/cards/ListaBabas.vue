<!-- src/componentes/ListaBabas.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import BabaCard from './BabaCard.vue'
import FiltrosBabas from './FiltrosBabas.vue'

const babas = ref([
  {
    nome: 'Patrícia Alves',
    cidade: 'Brasília, DF',
    descricao: 'Mais de 10 anos de experiência. Especialista em rotinas e desenvolvimento infantil.',
    experiencia: 10,
    foto: '/patricia.png',
    tags: ['Psicologia Infantil'],
    verificada: true,
    avaliacao: 5.0
  },
  {
    nome: 'Ana Paula Costa',
    cidade: 'Rio de Janeiro, RJ',
    descricao: 'Experiência com gêmeos e bebês. Formação em enfermagem pediátrica e muita paciência!',
    experiencia: 6,
    foto: '/Ana Paula Costa.png',
    tags: ['Enfermagem', 'Bebês'],
    verificada: true,
    avaliacao: 4.8
  },
  {
    nome: 'Maria Silva',
    cidade: 'São Paulo, SP',
    descricao: 'Adoro crianças e tenho experiência com todas as idades. Formada em pedagogia.',
    experiencia: 5,
    foto: '/mariasilva.png',
    tags: ['Primeiros Socorros'],
    verificada: true,
    avaliacao: 4.7
  },
  {
    nome: 'Juliana Santos',
    cidade: 'Belo Horizonte, MG',
    descricao: 'Sou estudante de psicologia infantil e amo criar brincadeiras criativas.',
    experiencia: 3,
    foto: '/julianasantos.png',
    tags: ['Psicologia Infantil'],
    verificada: true,
    avaliacao: 4.6
  },
  {
    nome: 'Camila Oliveira',
    cidade: 'Curitiba, PR',
    descricao: 'Experiência com crianças especiais e rotinas estruturadas. Responsável e carinhosa.',
    experiencia: 6,
    foto: '/camila.png',
    tags: ['Enfermagem', 'Bebês'],
    verificada: true,
    avaliacao: 4.5
  },
  {
    nome: 'Fernanda Lima',
    cidade: 'Porto Alegre, RS',
    descricao: 'Amo ensinar e brincar! Tenho experiência com crianças de 2 a 10 anos.',
    experiencia: 4,
    foto: '/fernanda.png',
    tags: ['Primeiros Socorros'],
    verificada: false,
    avaliacao: 4.3
  }
])

// estado dos filtros
const busca = ref('')
const experiencia = ref('Todas')
const apenasVerificadas = ref(false)
const ordenar = ref('Melhor Avaliação')

// recebe os filtros emitidos pelo FiltrosBabas
function atualizarFiltros(filtros: {
  busca: string
  experiencia: string
  apenasVerificadas: boolean
  ordenar: string
}) {
  busca.value = filtros.busca
  experiencia.value = filtros.experiencia
  apenasVerificadas.value = filtros.apenasVerificadas
  ordenar.value = filtros.ordenar
}

// lógica de filtro + ordenação
const babasFiltradas = computed(() => {
  let resultado = [...babas.value]

  // filtro por busca
  if (busca.value) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(b =>
      b.nome.toLowerCase().includes(termo) ||
      b.cidade.toLowerCase().includes(termo) ||
      b.tags.some(t => t.toLowerCase().includes(termo))
    )
  }

  // filtro por experiência
  if (experiencia.value !== 'Todas') {
    const anos = parseInt(experiencia.value)
    resultado = resultado.filter(b => b.experiencia >= anos)
  }

  // filtro apenas verificadas
  if (apenasVerificadas.value) {
    resultado = resultado.filter(b => b.verificada)
  }

  // ordenação
  if (ordenar.value === 'Melhor Avaliação') {
    resultado.sort((a, b) => b.avaliacao - a.avaliacao)
  } else if (ordenar.value === 'Mais Experiência') {
    resultado.sort((a, b) => b.experiencia - a.experiencia)
  }

  return resultado
})
</script>

<template>
  <div class="pagina">
    <h1>Encontrar Babás</h1>
    <p class="subtitulo">{{ babasFiltradas.length }} babás disponíveis</p>

    <FiltrosBabas @atualizar="atualizarFiltros" />

    <div v-if="babasFiltradas.length > 0" class="lista">
      <BabaCard
        v-for="baba in babasFiltradas"
        :key="baba.nome"
        v-bind="baba"
      />
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

.vazio {
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 15px;
}
</style>