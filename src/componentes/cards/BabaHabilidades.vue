<script setup>
defineProps({
  habilidades: Array,
  idiomas: Array
})
</script>

<template>
  <div class="secoes">
    <div class="secao">
      <h3>Habilidades e Qualificações</h3>
      <div class="tags">
        <span v-for="h in habilidades" :key="h">{{ h }}</span>
      </div>
    </div>

    <div class="secao">
      <h3>Idiomas</h3>
      <div class="tags">
        <span v-for="i in idiomas" :key="i">{{ i }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.secoes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.secao {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.secao h3 {
  font-weight: bold;
  margin-bottom: 10px;
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
</style>