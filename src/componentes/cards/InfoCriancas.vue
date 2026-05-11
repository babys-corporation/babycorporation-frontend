<script setup>
defineProps({
  quantidade: Number,
  criancas: Array,
  habilidades: Array,
  condicoes: Array
})
</script>

<template>
  <div class="card">
    <p class="titulo">Informação geral das Crianças</p>

    <div class="linha-info">
      <span>Quantidade</span>
      <span>{{ quantidade }}</span>
    </div>

    <div class="linha-info" v-for="(c, i) in criancas" :key="i">
      <span>Idade</span>
      <span>{{ c.idade }} {{ c.unidade }}</span>
    </div>

    <p class="subtitulo">Habilidades necessarias</p>
    <div class="tags">
      <span v-for="h in habilidades" :key="h">{{ h }}</span>
    </div>

    <p class="subtitulo">Condições Medicas</p>
    <div class="tags">
      <span v-for="c in condicoes" :key="c">{{ c }}</span>
    </div>

    <div class="alterar">
      <span>Alterar perfis das crianças</span>
      <span>✏️</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.titulo {
  font-weight: bold;
  font-size: 15px;
}

.linha-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background: #F9FAFB;
  border-radius: 8px;
  font-size: 14px;
}

.subtitulo {
  font-weight: bold;
  font-size: 14px;
  margin-top: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  background: #F3F4F6;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.alterar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  cursor: pointer;
}
</style>