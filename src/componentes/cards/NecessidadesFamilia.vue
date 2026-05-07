<script setup>
import { ref } from 'vue'

defineProps({
  disponibilidade: Object
})

const data = ref('')
const horario = ref('')
</script>

<template>
  <div class="card">
    <p class="titulo">Necessita</p>
    <div class="grid">
      <span
        v-for="(ativo, dia) in disponibilidade"
        :key="dia"
        :class="ativo ? 'ativo' : 'inativo'"
      >
        {{ dia }}
      </span>
    </div>

    <div class="select-grupo">
      <div class="select-item">
        <span>Data</span>
        <span>⌄</span>
      </div>
      <div class="select-item">
        <span>Horario</span>
        <span>⌄</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.titulo {
  font-weight: bold;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.ativo, .inativo {
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.ativo {
  background: #D1FAE5;
  color: #065F46;
}

.inativo {
  background: #F3F4F6;
  color: #9CA3AF;
}

.select-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
}
</style>