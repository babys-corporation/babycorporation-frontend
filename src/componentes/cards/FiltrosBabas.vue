<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowDown, ArrowUp, Search, SlidersHorizontal } from 'lucide-vue-next'

const emit = defineEmits(['atualizar'])

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

// Emite sempre que qualquer filtro mudar
watch(filtros, () => {
  emit('atualizar', { ...filtros.value })
}, { deep: true })

// Setas: clicar na seta ativa desliga a ordenação
function definirOrdem(
  campo: 'ordemIdade' | 'ordemExperiencia',
  valor: 'asc' | 'desc'
) {
  filtros.value[campo] = filtros.value[campo] === valor ? 'nenhuma' : valor
}

function limpar() {
  filtros.value = {
    nome: '',
    precoMin: '',
    precoMax: '',
    idadeMin: '',
    idadeMax: '',
    experienciaMin: '',
    ordemIdade: 'nenhuma',
    ordemExperiencia: 'nenhuma',
  }
}
</script>

<template>
  <div class="filtros">
    <div class="topo-filtros">
      <h3><SlidersHorizontal :size="18" class="icone-titulo" aria-hidden="true" /> Filtros</h3>
      <button class="btn-limpar" @click="limpar">Limpar</button>
    </div>

    <!-- Nome -->
    <div class="grupo">
      <label>Nome</label>
      <div class="input-icon">
        <Search :size="17" class="icone-busca" aria-hidden="true" />
        <input v-model="filtros.nome" type="text" placeholder="Buscar pelo nome..." />
      </div>
    </div>

    <!-- Preço -->
    <div class="grupo">
      <label>Preço por hora (R$)</label>
      <div class="linha">
        <input v-model.number="filtros.precoMin" type="number" min="0" placeholder="Mínimo" />
        <span class="ate">até</span>
        <input v-model.number="filtros.precoMax" type="number" min="0" placeholder="Máximo" />
      </div>
    </div>

    <!-- Idade -->
    <div class="grupo">
      <label>Idade</label>
      <div class="linha">
        <input v-model.number="filtros.idadeMin" type="number" min="16" placeholder="Mínima" />
        <span class="ate">até</span>
        <input v-model.number="filtros.idadeMax" type="number" min="16" placeholder="Máxima" />
      </div>
      <div class="setas-grupo">
        <span class="setas-label">Ordenar:</span>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemIdade === 'asc' }"
          title="Menor para maior"
          aria-label="Ordenar do menor para o maior"
          @click="definirOrdem('ordemIdade', 'asc')"
        >
          <ArrowUp :size="16" aria-hidden="true" />
        </button>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemIdade === 'desc' }"
          title="Maior para menor"
          aria-label="Ordenar do maior para o menor"
          @click="definirOrdem('ordemIdade', 'desc')"
        >
          <ArrowDown :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Anos de experiência -->
    <div class="grupo">
      <label>Anos de experiência (mínimo)</label>
      <div class="linha">
        <input
          v-model.number="filtros.experienciaMin"
          type="number"
          min="0"
          placeholder="Ex.: 2"
        />
      </div>
      <div class="setas-grupo">
        <span class="setas-label">Ordenar:</span>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemExperiencia === 'asc' }"
          title="Menor para maior"
          aria-label="Ordenar do menor para o maior"
          @click="definirOrdem('ordemExperiencia', 'asc')"
        >
          <ArrowUp :size="16" aria-hidden="true" />
        </button>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemExperiencia === 'desc' }"
          title="Maior para menor"
          aria-label="Ordenar do maior para o menor"
          @click="definirOrdem('ordemExperiencia', 'desc')"
        >
          <ArrowDown :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filtros {
  --rosa: #F6339A;
  --borda: #e5e7eb;
  --campo: #f9fafb;

  background: #fff;
  padding: 20px;
  border: 1px solid #f1f1f4;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(17, 24, 39, .05);
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.topo-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f1f4;
}

.filtros h3 {
  font-size: 17px;
  font-weight: bold;
  margin: 0;
  color: #1f2937;
}

/* anula o estilo global de button (fit-content, margin auto, sombra) */
.btn-limpar,
.seta {
  margin: 0;
  box-shadow: none;
  font-family: inherit;
}

.btn-limpar {
  width: auto;
  border: 1px solid transparent;
  background: transparent;
  color: var(--rosa);
  font-size: 13px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s;
}

.btn-limpar:hover {
  background: #FDF2F8;
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grupo label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* campos */
.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid var(--borda);
  border-radius: 10px;
  padding: 0 12px;
  gap: 8px;
  background: var(--campo);
  transition: border-color .15s, box-shadow .15s, background .15s;
}

.input-icon input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
  padding: 11px 0;
  font-family: inherit;
}

.linha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.linha input {
  width: 100%;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--borda);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  background: var(--campo);
  outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}

.input-icon:focus-within,
.linha input:focus {
  border-color: var(--rosa);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(246, 51, 154, .12);
}

.ate {
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}

.filtros h3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icone-titulo {
  color: var(--rosa);
}

.icone-busca {
  color: #9ca3af;
  flex-shrink: 0;
}

.input-icon:focus-within .icone-busca {
  color: var(--rosa);
}

/* ordenação: controle compacto (setas) */
.setas-grupo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
}

.setas-label {
  font-size: 13px;
  color: #6b7280;
  margin-right: 2px;
}

.seta {
  width: 36px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--borda);
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 15px;
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}

.seta,
.seta:hover {
  opacity: 1;
}

.seta:hover {
  border-color: var(--rosa);
  color: var(--rosa);
}

.seta:focus-visible,
.btn-limpar:focus-visible {
  outline: 3px solid rgba(246, 51, 154, .3);
  outline-offset: 2px;
}

.seta.ativo,
.seta.ativo:hover {
  background: var(--rosa);
  border-color: var(--rosa);
  color: white;
}

/* tablet: grupos em grade (nome ocupa a linha toda) */
@media (min-width: 640px) and (max-width: 1023px) {
  .filtros {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
  }

  .topo-filtros,
  .grupo:first-of-type {
    grid-column: 1 / -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .seta,
  .btn-limpar,
  .linha input,
  .input-icon {
    transition: none;
  }
}
</style>
