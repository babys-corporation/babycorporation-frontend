<script setup>
import { ref } from 'vue'
import OpcoesBaba from '../componentes/OpcoesBaba.vue'

const diaSelecionado = ref(1)

const dias = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

const semanas = [
  [null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null]
]

const babas = [
  { nome: 'Patrícia Alves', cidade: 'Brasília, DF', status: 'Disponível', foto: '/patricia.png' },
  { nome: 'Ana Paula Costa', cidade: 'Rio de Janeiro, RJ', status: 'Disponível', foto: '/Ana Paula Costa.png' },
  { nome: 'Patrícia Alves', cidade: 'Brasília, DF', status: 'Disponível', foto: '/patricia.png' },
  { nome: 'Ana Paula Costa', cidade: 'Rio de Janeiro, RJ', status: 'Disponível', foto: '/Ana Paula Costa.png' }
]
</script>

<template>
  <div class="pagina">
    <h1>Calendario</h1>
    <p class="subtitulo">Dias disponíveis</p>

    <div class="card">
      <p class="mes">Abril</p>
      <div class="cabecalho-dias">
        <span v-for="d in dias" :key="d">{{ d }}</span>
      </div>
      <div class="semana" v-for="(semana, i) in semanas" :key="i">
        <span
          v-for="(dia, j) in semana"
          :key="j"
          :class="{ selecionado: dia === diaSelecionado, vazio: !dia }"
          @click="if(dia) diaSelecionado = dia"
        >
          {{ dia || '' }}
        </span>
      </div>
    </div>

    <div class="card responsavel">
      <div class="img-container">
        <img src="/patricia.png" alt="Responsavel" />
        <span class="badge">✔</span>
      </div>
      <p class="nome">Responsavel</p>
      <p class="info">💳 Pagamento efetivado</p>
      <p class="info">🕐 Agendado</p>
    </div>

    <div class="grid-criancas">
      <div class="card" v-for="n in 2" :key="n">
        <div class="img-container">
          <img src="/patricia.png" :alt="'Criança ' + n" />
          <span class="badge">✔</span>
        </div>
        <p class="nome">Criança {{ n }}</p>
        <p class="info">{{ n === 1 ? '♀ Menina' : '♂ Menino' }}</p>
        <p class="info">🕐 Agendado</p>
      </div>
    </div>

    <div class="botoes">
      <button class="btn-principal">Agendar</button>
      <button class="btn-secundario">Desagendar</button>
    </div>

    <OpcoesBaba :babas="babas" />
  </div>
</template>

<style scoped>
.pagina {
  padding: 16px;
  background: #F9FAFB;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 { font-size: 28px; font-weight: bold; }

.subtitulo { font-size: 13px; color: #888; margin-top: -8px; }

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.mes {
  text-align: center;
  font-weight: bold;
  color: #F6339A;
  font-size: 16px;
  margin-bottom: 12px;
}

.cabecalho-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
}

.semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
}

.semana span {
  padding: 6px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

.selecionado {
  background: #F6339A;
  color: white;
}

.vazio { visibility: hidden; }

.responsavel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.img-container {
  position: relative;
}

.img-container img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.nome { font-weight: bold; font-size: 14px; }
.info { font-size: 12px; color: #666; }

.grid-criancas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-criancas .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.botoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-principal {
  background: #F6339A;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: bold;
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
</style>