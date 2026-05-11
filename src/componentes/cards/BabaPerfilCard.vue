<script setup>
defineProps({
  nome: String,
  cidade: String,
  experiencia: String,
  avaliacao: Number,
  avaliacoes: Number,
  preco: Number,
  foto: String
})
</script>

<template>
  <div class="card">
    <img :src="foto" :alt="nome" class="foto" />
    <h2>{{ nome }}</h2>
    <div class="info-linha">
      <span>📍 {{ cidade }}</span>
      <span>🕐 {{ experiencia }}</span>
    </div>
    <div class="avaliacao">
      ⭐ {{ avaliacao }} ({{ avaliacoes }} avaliações)
    </div>
    <div class="preco">R$ {{ preco }}/hora</div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.foto {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 12px;
}

h2 {
  font-size: 22px;
  font-weight: bold;
}

.info-linha {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 13px;
  color: #666;
  margin: 8px 0;
}

.avaliacao {
  font-size: 14px;
  color: #555;
}

.preco {
  font-size: 22px;
  font-weight: bold;
  color: #F6339A;
  margin-top: 8px;
}
</style>