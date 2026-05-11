<script setup>
defineProps({
  nome: String,
  cidade: String,
  filhos: Number
})
</script>

<template>
  <div class="card">
    <div class="topo">
      <div>
        <h2>{{ nome }}</h2>
        <div class="info-linha">
          <span>📍 {{ cidade }}</span>
          <span>🕐 {{ filhos }} filhos</span>
        </div>
      </div>
      <span class="editar">✏️</span>
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

.topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h2 {
  font-size: 22px;
  font-weight: bold;
}

.info-linha {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.editar {
  font-size: 18px;
  cursor: pointer;
}
</style>