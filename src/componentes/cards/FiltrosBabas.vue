<!-- src/componentes/FiltrosBabas.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const busca = ref('')
const experiencia = ref('Todas')
const apenasVerificadas = ref(false)
const ordenar = ref('Melhor Avaliação')

const opcoesExperiencia = ['Todas', '1 ano', '2 anos', '3+ anos', '5+ anos', '10+ anos']
const opcoesOrdenar = ['Melhor Avaliação', 'Mais Experiência', 'Mais Recente']
</script>

<template>
  <div class="filtros">
    <h3>⚙ Filtros</h3>

    <!-- Busca -->
    <div class="grupo">
      <label>Buscar</label>
      <div class="input-icon">
        <span>🔍</span>
        <input
          v-model="busca"
          type="text"
          placeholder="Nome, cidade, habilidade..."
        />
      </div>
    </div>

    <!-- Experiência -->
    <div class="grupo">
      <label>Experiência</label>
      <select v-model="experiencia">
        <option v-for="op in opcoesExperiencia" :key="op">{{ op }}</option>
      </select>
    </div>

    <!-- Apenas verificadas -->
    <div class="grupo checkbox">
      <input type="checkbox" v-model="apenasVerificadas" id="verificadas" />
      <label for="verificadas">Apenas verificadas</label>
    </div>

    <!-- Ordenar -->
    <div class="grupo ordenar">
      <span>Ordenar por:</span>
      <select v-model="ordenar">
        <option v-for="op in opcoesOrdenar" :key="op">{{ op }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filtros {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filtros h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grupo label {
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

select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f9f9f9;
  appearance: auto;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.checkbox input {
  width: 16px;
  height: 16px;
  accent-color: #F6339A;
}

.ordenar {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.ordenar span {
  font-size: 14px;
  white-space: nowrap;
  color: #333;
}

.ordenar select {
  flex: 1;
}
</style>