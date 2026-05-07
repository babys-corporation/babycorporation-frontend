<script setup>
defineProps({
  disponibilidade: Object
})
</script>

<template>
  <div class="secao">
    <h3>Disponibilidade</h3>
    <div class="grid">
      <span
        v-for="(disponivel, dia) in disponibilidade"
        :key="dia"
        :class="disponivel ? 'ativo' : 'inativo'"
      >
        {{ dia }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.secao {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.secao h3 {
  font-weight: bold;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
</style>