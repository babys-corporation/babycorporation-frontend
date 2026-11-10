<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Cake, Clock, SearchX, User } from 'lucide-vue-next'
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
  router.push(`/agendamento/${id}`)
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
          <div v-else class="user-default">
            <User :size="56" aria-hidden="true" />
          </div>

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
              <Cake :size="13" aria-hidden="true" /> {{ calcularIdade(baba.dtnasc) }} anos
            </span>

            <span class="experiencia">
              <Clock :size="13" aria-hidden="true" /> {{ baba.experiencia_anos }} anos de experiência
            </span>
          </div>

          <div class="rodape-card">
            <span class="preco">
              R$ {{ baba.valor_hora || 24 }}/hora
            </span>

            <span class="ver-perfil">
              Ver perfil completo <ArrowRight :size="14" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="vazio">
      <SearchX :size="36" class="icone-vazio" aria-hidden="true" />
      <p>Nenhuma babá encontrada com esses filtros.</p>
    </div>
  </div>
</template>

<style scoped>
/* ── Página ───────────────────────────────────────── */
.pagina {
  --rosa: #F6339A;
  --texto: #1f2937;
  --texto-suave: #6b7280;

  background: #F9FAFB;
  min-height: 100vh;
  padding: 28px 16px 48px;
  max-width: 1180px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pagina h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--texto);
  margin: 0;
  text-align: center;
}

.subtitulo {
  color: var(--texto-suave);
  font-size: 15px;
  margin: -10px 0 4px;
  text-align: center;
}

/* ── Lista de cards ───────────────────────────────── */
.lista {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.baba-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #f1f1f4;
  box-shadow: 0 4px 18px rgba(17, 24, 39, .05);
  transition: transform .2s, box-shadow .2s, border-color .2s;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.baba-card:hover {
  transform: translateY(-3px);
  border-color: #FBCFE8;
  box-shadow: 0 10px 26px rgba(246, 51, 154, .12);
}

.foto-area {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #F3F4F6;
}

.foto-area img,
.user-default {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.user-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
}

.user-default {
  color: #c4c8d0;
}

.disponivel {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, .95);
  color: #15803D;
  font-size: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(17, 24, 39, .12);
}

.disponivel::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

.disponivel.indisponivel {
  color: #6b7280;
}

.disponivel.indisponivel::before {
  background: #9ca3af;
}

.conteudo {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.conteudo h2 {
  font-size: 19px;
  margin: 0;
  color: var(--texto);
  text-transform: capitalize;
  overflow-wrap: anywhere;
}

/* descrição limitada a 3 linhas */
.descricao {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.descricao:empty {
  display: none;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.experiencia {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #4b5563;
  background: #F3F4F6;
  padding: 4px 10px;
  border-radius: 999px;
}

.rodape-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.preco {
  color: var(--rosa);
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.ver-perfil {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--rosa);
  font-weight: bold;
  padding: 7px 12px;
  border-radius: 999px;
  background: #FDF2F8;
  white-space: nowrap;
  transition: background .15s, color .15s;
}

.baba-card:hover .ver-perfil {
  background: var(--rosa);
  color: white;
}

.vazio {
  text-align: center;
  padding: 48px 20px;
  color: var(--texto-suave);
  background: white;
  border: 1px dashed #e5e7eb;
  border-radius: 16px;
}

.vazio p {
  margin: 0;
}

.icone-vazio {
  display: block;
  margin: 0 auto 10px;
  color: #c4c8d0;
}

/* ── Responsivo ───────────────────────────────────── */
@media (max-width: 420px) {
  .pagina {
    padding: 20px 12px 36px;
  }

  .pagina h1 {
    font-size: 26px;
  }

  .ver-perfil {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (min-width: 640px) {
  .lista {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* desktop: filtros à esquerda (fixos ao rolar), cards à direita */
@media (min-width: 1024px) {
  .pagina {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: start;
    align-content: start;
    column-gap: 24px;
    row-gap: 18px;
  }

  .pagina h1,
  .subtitulo {
    grid-column: 1 / -1;
  }

  .pagina > .filtros {
    grid-column: 1;
    position: sticky;
    top: 90px;
  }

  .lista,
  .vazio {
    grid-column: 2;
  }
}

@media (min-width: 1440px) {
  .lista {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .baba-card,
  .ver-perfil {
    transition: none;
  }

  .baba-card:hover {
    transform: none;
  }
}
</style>
