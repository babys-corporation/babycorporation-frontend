<script setup>
defineProps({
  nome: String,
  cidade: String,
  descricao: String,
  experiencia: String,
  foto: String,
  tags: Array,
  verificada: Boolean
})
</script>

<template>
  <div class="card">
    <div class="img-container">
      <img :src="foto" :alt="nome" />
      <span v-if="verificada" class="verificado">✔ Verificado</span>
    </div>
    <div class="info">
      <h3>{{ nome }}</h3>
      <div class="linha">
        <span>📍 {{ cidade }}</span>
      </div>
      <p>{{ descricao }}</p>
      <div class="linha">
        <span>🕐 {{ experiencia }}</span>
      </div>
      <div class="tags">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.img-container {
  position: relative;
}

.img-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.verificado {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #22c55e;
  color: white;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 8px;
}

.info {
  padding: 15px;
}

.info h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
}

.linha {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
}

.info p {
  font-size: 13px;
  color: #666;
  margin: 8px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tags span {
  background: #F3F4F6;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}
</style>