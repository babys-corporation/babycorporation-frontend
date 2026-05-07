<script setup>
import BabaDisponibilidade from '../componentes/BabaDisponibilidade.vue'

const baba = {
  nome: 'Fernanda Lima',
  cidade: 'Porto Alegre, RS',
  experiencia: '4 anos de experiência',
  preco: 24,
  disponibilidade: {
    Segunda: true, Terça: true, Quarta: true,
    Quinta: true, Sexta: false, Sábado: false, Domingo: false
  }
}

const solicitacoes = [
  { familia: 'Família Silva', tempo: 'há 2 semanas', descricao: 'Solicitamos cuidado para 2 crianças de 7 e 10 anos, as duas meninas...' },
  { familia: 'Família Costa', tempo: 'há 2 semanas', descricao: 'Solicitamos cuidado para 1 bebe de 7 meses, um menino...' },
  { familia: 'Família Oliveira', tempo: 'há 2 meses', descricao: 'Solicitamos cuidados para 4 crianças, 3 meninas e 1 menino...' }
]
</script>

<template>
  <div class="pagina">
    <div class="card perfil">
      <div class="topo">
        <div>
          <h2>{{ baba.nome }}</h2>
          <div class="info-linha">
            <span>📍 {{ baba.cidade }}</span>
            <span>🕐 {{ baba.experiencia }}</span>
          </div>
        </div>
        <span class="editar">✏️</span>
      </div>

      <BabaDisponibilidade :disponibilidade="baba.disponibilidade" />

      <div class="select-grupo">
        <div class="select-item"><span>Data</span><span>⌄</span></div>
        <div class="select-item"><span>Horario</span><span>⌄</span></div>
      </div>

      <p class="preco">R$ {{ baba.preco }}/hora</p>
    </div>

    <div class="solicitacoes">
      <h3>Solicitações de agendamento</h3>
      <div class="card" v-for="s in solicitacoes" :key="s.familia">
        <div class="sol-topo">
          <span class="familia">{{ s.familia }}</span>
          <span class="tempo">{{ s.tempo }}</span>
        </div>
        <p>{{ s.descricao }}</p>
      </div>
      <p class="ver-todas">Ver todas →</p>
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

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.topo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

h2 { font-size: 22px; font-weight: bold; }

.info-linha {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.editar { font-size: 18px; cursor: pointer; }

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

.preco {
  font-size: 22px;
  font-weight: bold;
  color: #F6339A;
  margin-top: 12px;
}

.solicitacoes h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.sol-topo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.familia { font-weight: bold; font-size: 14px; }

.tempo {
  font-size: 12px;
  color: #F6339A;
}

.solicitacoes p {
  font-size: 13px;
  color: #666;
}

.ver-todas {
  color: #F6339A;
  text-align: center;
  margin-top: 12px;
  cursor: pointer;
}
</style>