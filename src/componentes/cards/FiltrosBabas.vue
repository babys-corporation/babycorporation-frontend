<script setup lang="ts">
import { ref, watch } from 'vue'

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
      <h3>⚙ Filtros</h3>
      <button class="btn-limpar" @click="limpar">Limpar</button>
    </div>

    <!-- Nome -->
    <div class="grupo">
      <label>Nome</label>
      <div class="input-icon">
        <span>🔍</span>
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
          @click="definirOrdem('ordemIdade', 'asc')"
        >
          ↑
        </button>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemIdade === 'desc' }"
          title="Maior para menor"
          @click="definirOrdem('ordemIdade', 'desc')"
        >
          ↓
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
          @click="definirOrdem('ordemExperiencia', 'asc')"
        >
          ↑
        </button>
        <button
          class="seta"
          :class="{ ativo: filtros.ordemExperiencia === 'desc' }"
          title="Maior para menor"
          @click="definirOrdem('ordemExperiencia', 'desc')"
        >
          ↓
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filtros {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.topo-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filtros h3 {
  font-size: 16px;
  font-weight: bold;
}

.btn-limpar {
  border: none;
  background: transparent;
  color: #F6339A;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grupo label,
.setas-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
  background: #f9f9f9;
}

.input-icon input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.linha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.linha input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f9f9f9;
  outline: none;
}

.ate {
  font-size: 13px;
  color: #888;
  white-space: nowrap;
}

.setas-grupo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setas-label {
  font-weight: normal;
  color: #888;
}

.seta {
  width: 34px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  color: #555;
  font-size: 15px;
  cursor: pointer;
  transition: all .15s;
}

.seta:hover {
  border-color: #F6339A;
  color: #F6339A;
}

.seta.ativo {
  background: #F6339A;
  border-color: #F6339A;
  color: white;
}
</style>
