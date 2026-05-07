<script setup>
import BabaDisponibilidade from '../componentes/BabaDisponibilidade.vue'

const baba = {
  nome: 'Fernanda Lima',
  cidade: 'Porto Alegre, RS',
  experiencia: '4 anos de experiência',
  avaliacao: 4.6,
  avaliacoes: 22,
  preco: 24,
  foto: '/fernanda.png',
  disponibilidade: {
    Segunda: true, Terça: true, Quarta: true,
    Quinta: true, Sexta: false, Sábado: false, Domingo: false
  }
}
</script>

<template>
  <div class="pagina">
    <h1>Agendamento</h1>

    <div class="card">
      <img :src="baba.foto" :alt="baba.nome" class="foto" />
      <h2>{{ baba.nome }}</h2>
      <div class="info-linha">
        <span>📍 {{ baba.cidade }}</span>
        <span>🕐 {{ baba.experiencia }}</span>
      </div>
      <p class="avaliacao">⭐ {{ baba.avaliacao }} ({{ baba.avaliacoes }} avaliações)</p>
      <p class="preco">R$ {{ baba.preco }}/hora</p>
    </div>

    <div class="card">
      <BabaDisponibilidade :disponibilidade="baba.disponibilidade" />
      <div class="select-grupo">
        <div class="select-item"><span>Data</span><span>⌄</span></div>
        <div class="select-item"><span>Horario</span><span>⌄</span></div>
      </div>
    </div>

    <div class="card acoes">
      <p class="preco-grande">R$ {{ baba.preco }}/hora</p>
      <p class="label">Valor por hora</p>
      <button class="btn-principal">💰 Efetuar Pagamento</button>
      <button class="btn-secundario">📅 Agendar cuidado</button>
      <div class="info">
        <p class="titulo">Resposta Rápida</p>
        <p>Geralmente responde em menos de 24 horas</p>
      </div>
    </div>
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

h1 {
  font-size: 28px;
  font-weight: bold;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.foto {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 12px;
}

h2 { font-size: 20px; font-weight: bold; }

.info-linha {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
  margin: 6px 0;
}

.avaliacao { font-size: 14px; color: #555; }

.preco {
  font-size: 20px;
  font-weight: bold;
  color: #F6339A;
  margin-top: 6px;
}

.select-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.select-item {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
}

.acoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preco-grande {
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

.info {
  border-top: 1px solid #eee;
  padding-top: 12px;
  font-size: 13px;
  color: #555;
}

.titulo { font-weight: bold; margin-bottom: 4px; }
</style>