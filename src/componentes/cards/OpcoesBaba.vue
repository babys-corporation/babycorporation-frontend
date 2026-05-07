<script setup>
defineProps({
  babas: Array
})
</script>

<template>
  <div class="secao">
    <h3>Opções de Babá</h3>
    <div class="grid">
      <div class="card" v-for="baba in babas" :key="baba.nome">
        <div class="img-container">
          <img :src="baba.foto" :alt="baba.nome" />
          <span class="badge">✔</span>
        </div>
        <p class="nome">{{ baba.nome }}</p>
        <p class="info">📍 {{ baba.cidade }}</p>
        <p class="disponivel">🕐 {{ baba.status }}</p>
      </div>
    </div>
    <p class="ver-todas">Ver todas →</p>
  </div>
</template>

<style scoped>
.secao {
  padding: 16px 0;
}

.secao h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.img-container {
  position: relative;
}

.img-container img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.nome {
  font-weight: bold;
  font-size: 14px;
  padding: 8px 8px 2px;
}

.info, .disponivel {
  font-size: 12px;
  color: #666;
  padding: 0 8px 4px;
}

.ver-todas {
  color: #F6339A;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;
  font-size: 14px;
}
</style>