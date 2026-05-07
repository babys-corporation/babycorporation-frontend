<script setup>
defineProps({
  preco: Number
})
</script>

<template>
  <div class="secao">
    <div class="preco">R$ {{ preco }}/hora</div>
    <p class="label">Valor por hora</p>

    <button class="btn-principal">💬 Enviar Mensagem</button>
    <button class="btn-secundario">📅 Agendar Entrevista</button>

    <div class="info">
      <p class="titulo">Resposta Rápida</p>
      <p>Geralmente responde em menos de 24 horas</p>
    </div>

    <div class="dicas">
      <p class="titulo">Dicas de Segurança</p>
      <p>✅ Sempre marque uma entrevista presencial</p>
      <p>✅ Verifique referências anteriores</p>
      <p>✅ Nunca compartilhe informações financeiras</p>
    </div>
  </div>
</template>

<style scoped>
.secao {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preco {
  font-size: 32px;
  font-weight: bold;
  color: #F6339A;
  text-align: center;
}

.label {
  text-align: center;
  font-size: 13px;
  color: #888;
  margin-top: -8px;
}

.btn-principal {
  background: #F6339A;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
  height: auto;
}

.btn-secundario {
  background: white;
  color: #333;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
  height: auto;
}

.info, .dicas {
  font-size: 13px;
  color: #555;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.titulo {
  font-weight: bold;
  margin-bottom: 6px;
}

.dicas p {
  margin: 4px 0;
}
</style>