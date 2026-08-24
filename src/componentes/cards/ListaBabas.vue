<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FiltrosBabas from '@/componentes/cards/FiltrosBabas.vue'
import { useBabaStore } from '@/stores/baba'

const router = useRouter()
const babaStore = useBabaStore()

const filtros = ref({
  nome: '',
  precoMin: '',
  precoMax: '',
  idadeMin: '',
  idadeMax: '',
  experienciaMin: '',
  ordemIdade: 'nenhuma' as 'nenhuma' | 'asc' | 'desc',
  ordemExperiencia: 'nenhuma' as 'nenhuma' | 'asc' | 'desc',
})

// Abre a página de perfil da babá selecionada
function abrirPerfil(id: number) {
  router.push(`/detalhes-baba?id=${id}`)
}

function atualizarFiltros(novos: typeof filtros.value) {
  filtros.value = novos
}

// Converte valor de input em número ou null (vazio)
function numero(valor: any): number | null {
  if (valor === '' || valor === null || valor === undefined) return null
  const n = Number(valor)
  return isNaN(n) ? null : n
}

// Idade calculada a partir da data de nascimento (dtnasc)
function calcularIdade(dtnasc: string | null): number | null {
  if (!dtnasc) return null
  const nascimento = new Date(dtnasc)
  if (isNaN(nascimento.getTime())) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

function nomeCompleto(baba: any): string {
  return [baba.usuario?.primeiro_nome, baba.usuario?.ultimo_nome]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const babasFiltradas = computed(() => {
  const precoMin = numero(filtros.value.precoMin)
  const precoMax = numero(filtros.value.precoMax)
  const idadeMin = numero(filtros.value.idadeMin)
  const idadeMax = numero(filtros.value.idadeMax)
  const experienciaMin = numero(filtros.value.experienciaMin)

  let lista = babaStore.babas.filter((baba: any) => {
    // Nome
    const matchNome =
      !filtros.value.nome ||
      nomeCompleto(baba).includes(filtros.value.nome.trim().toLowerCase())

    // Preço (mínimo e máximo)
    const preco = baba.valor_hora ?? 0
    const matchPreco =
      (precoMin === null || preco >= precoMin) &&
      (precoMax === null || preco <= precoMax)

    // Idade (mínima e máxima)
    const idade = calcularIdade(baba.dtnasc)
    const matchIdade =
      (idadeMin === null || (idade !== null && idade >= idadeMin)) &&
      (idadeMax === null || (idade !== null && idade <= idadeMax))

    // Anos de experiência (mínimo)
    const experiencia = baba.experiencia_anos ?? 0
    const matchExperiencia =
      experienciaMin === null || experiencia >= experienciaMin

    return matchNome && matchPreco && matchIdade && matchExperiencia
  })

  // Ordenação por idade (setas) — clicar na ativa desliga
  if (filtros.value.ordemIdade !== 'nenhuma') {
    lista = [...lista].sort((a: any, b: any) => {
      const ia = calcularIdade(a.dtnasc) ?? -1
      const ib = calcularIdade(b.dtnasc) ?? -1
      return filtros.value.ordemIdade === 'asc' ? ia - ib : ib - ia
    })
  }

  // Ordenação por experiência (setas)
  if (filtros.value.ordemExperiencia !== 'nenhuma') {
    lista = [...lista].sort((a: any, b: any) => {
      const ea = a.experiencia_anos ?? 0
      const eb = b.experiencia_anos ?? 0
      return filtros.value.ordemExperiencia === 'asc' ? ea - eb : eb - ea
    })
  }

  return lista
})

onMounted(async () => {
  await babaStore.getBabas()
})
</script>

<template>
  <div class="pagina">
    <h1>Encontrar Babás</h1>
    <p class="subtitulo">
      {{ babasFiltradas.length }} babá(s) encontrada(s)
    </p>

    <FiltrosBabas @atualizar="atualizarFiltros" />

    <div v-if="babasFiltradas.length > 0" class="lista">
      <div
        v-for="baba in babasFiltradas"
        :key="baba.id"
        class="baba-card"
        @click="abrirPerfil(baba.id)"
      >
        <div class="foto-area">
          <img
            v-if="baba.usuario.foto"
            :src="baba.usuario.foto.url"
            alt="foto"
          />
          <div v-else class="user-default"></div>

          <span class="disponivel" :class="{ indisponivel: !baba.disponivel }">
            {{ baba.disponivel ? 'Disponível' : 'Indisponível' }}
          </span>
        </div>

        <div class="conteudo">
          <h2>{{ nomeCompleto(baba) }}</h2>

          <p class="descricao">
            {{ baba.descricao }}
          </p>

          <div class="info-linha">
            <span
              v-if="calcularIdade(baba.dtnasc) !== null"
              class="experiencia"
            >
              🎂 {{ calcularIdade(baba.dtnasc) }} anos
            </span>

            <span class="experiencia">
              🕐 {{ baba.experiencia_anos }} anos de experiência
            </span>
          </div>

          <div class="rodape-card">
            <span class="preco">
              R$ {{ baba.valor_hora || 24 }}/hora
            </span>

            <span class="ver-perfil">Ver perfil completo →</span>
          </div>
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
  cursor: pointer;
}

.baba-card:hover {
  transform: translateY(-2px);
  border-color: #F6339A;
}

.disponivel {
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

.disponivel.indisponivel {
  background: #9ca3af;
}

.conteudo {
  padding: 16px;
}

.conteudo h2 {
  font-size: 20px;
  margin-bottom: 6px;
  color: #111;
}

.descricao {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
}

.habilidade {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
  background-color: #E5E5E5;
  padding: 4px;
  border-radius: 10px;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 12px;
}

.experiencia {
  font-size: 13px;
  color: #777;
}

.rodape-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ver-perfil {
  font-size: 13px;
  color: #F6339A;
  font-weight: bold;
}

.preco {
  color: #ff2d8d;
  font-size: 22px;
  font-weight: bold;
}

.vazio {
  text-align: center;
  padding: 40px;
  color: #999;
}

.foto-area {
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
