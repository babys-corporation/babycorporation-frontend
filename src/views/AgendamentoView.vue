<script setup>
import { ref } from 'vue'
import AreaAgendamento from '../componentes/cards/AreaAgendamento.vue'

const baba = ref({
  nome: 'Fernanda Lima',
  localizacao: 'Porto Alegre, RS',
  experiencia: 4,
  disponibilidade: {
    Segunda: true,
    Terça: true,
    Quarta: true,
    Quinta: true,
    Sexta: false,
    Sábado: false,
    Domingo: false
  }
})
</script>

<template>
  <div class="pagina">
    <h1>Agendamento</h1>

    <AreaAgendamento
      :nome="baba.nome"
      :localizacao="baba.localizacao"
      :experiencia="baba.experiencia"
      :disponibilidade="baba.disponibilidade"
    />
  </div>
</template>

<style scoped>
.pagina {
  padding: 16px;
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
</style>