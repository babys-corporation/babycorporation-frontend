<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/config'
import {
  aceitarAgendamento,
  confirmarPagamento,
  recusarAgendamento,
  type Agendamento,
} from '@/api/agendamentoApi'

const carregando = ref(true)
const erro = ref('')
const acaoEmAndamento = ref<number | null>(null)
const agendamentos = ref<Agendamento[]>([])

// Pedidos feitos à babá, aguardando ela conferir o Pix e aceitar
const pedidos = computed(() =>
  agendamentos.value.filter((a) => a.status === 'PENDENTE')
)

// Agendamentos que ela já confirmou
const confirmados = computed(() =>
  agendamentos.value.filter((a) => a.status === 'ACEITO')
)

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const hora = (h: string) => String(h).slice(0, 5)

const moeda = (v: string | number) =>
  Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function statusPagamentoTexto(a: Agendamento) {
  if (a.status_pagamento === 'PAGO') return 'Pagamento confirmado'
  if (a.status_pagamento === 'NAO_EXIGIDO') return 'Pagamento combinado com a família'

  if (a.status === 'PENDENTE') {
    return a.pagamento_marcado_em
      ? 'Família avisou que pagou — confira o Pix e aceite'
      : 'Aguardando o Pix da família'
  }

  return a.pagamento_marcado_em
    ? 'Família avisou que pagou — confirme o recebimento'
    : 'Aguardando pagamento da família'
}

async function carregar() {
  try {
    carregando.value = true
    erro.value = ''

    const { data } = await api.get('/agendamentos/me/')
    const lista: Agendamento[] = data.results || data

    agendamentos.value = [...lista].sort((a, b) =>
      `${a.data}${a.hora_inicio}`.localeCompare(`${b.data}${b.hora_inicio}`)
    )
  } catch (e) {
    console.error(e)
    erro.value = 'Não foi possível carregar os agendamentos.'
  } finally {
    carregando.value = false
  }
}

async function executarAcao(
  agendamento: Agendamento,
  acao: (id: number) => Promise<{ data: Agendamento }>,
  padrao: string
) {
  acaoEmAndamento.value = agendamento.id
  erro.value = ''

  try {
    const { data } = await acao(agendamento.id)
    agendamentos.value = agendamentos.value.map((a) =>
      a.id === data.id ? data : a
    )
  } catch (e: any) {
    erro.value =
      e?.response?.data?.detail ||
      e?.response?.data?.non_field_errors?.[0] ||
      padrao
  } finally {
    acaoEmAndamento.value = null
  }
}

const aceitar = (a: Agendamento) =>
  executarAcao(a, aceitarAgendamento, 'Não foi possível aceitar o agendamento.')

const recusar = (a: Agendamento) =>
  executarAcao(a, recusarAgendamento, 'Não foi possível recusar o agendamento.')

const confirmar = (a: Agendamento) =>
  executarAcao(a, confirmarPagamento, 'Não foi possível confirmar o pagamento.')

onMounted(carregar)
</script>

<template>
  <div class="pagina">
    <h1>Agendamentos</h1>

    <div v-if="carregando" class="card">Carregando...</div>

    <template v-else>
      <div v-if="erro" class="card erro">{{ erro }}</div>

      <!-- Pedidos recebidos -->
      <section class="card">
        <h2>Pedidos recebidos</h2>

        <p v-if="pedidos.length === 0" class="vazio">
          Nenhum pedido de agendamento.
        </p>

        <div v-for="a in pedidos" :key="a.id" class="agendamento">
          <div class="ag-topo">
            <strong>{{ a.nome_familia || 'Família' }}</strong>
            <span class="ag-valor">{{ moeda(a.preco) }}</span>
          </div>
          <p>
            📅 {{ formatarData(a.data) }} · 🕐 {{ hora(a.hora_inicio) }} às
            {{ hora(a.hora_fim) }} · 👶 {{ a.qtd_criancas }} criança(s)
          </p>
          <p v-if="a.cidade">📍 {{ a.cidade }}</p>
          <p class="ag-status">{{ statusPagamentoTexto(a) }}</p>

          <div class="acoes">
            <button
              class="btn-aceitar"
              type="button"
              :disabled="acaoEmAndamento === a.id"
              @click="aceitar(a)"
            >
              {{
                acaoEmAndamento === a.id
                  ? 'Processando...'
                  : a.status_pagamento === 'AGUARDANDO'
                    ? 'Pix recebido · Aceitar'
                    : 'Aceitar'
              }}
            </button>

            <button
              class="btn-recusar"
              type="button"
              :disabled="acaoEmAndamento === a.id"
              @click="recusar(a)"
            >
              Recusar
            </button>
          </div>
        </div>
      </section>

      <!-- Agendamentos confirmados -->
      <section class="card">
        <h2>Agendamentos confirmados</h2>

        <p v-if="confirmados.length === 0" class="vazio">
          Nenhum agendamento confirmado.
        </p>

        <div v-for="a in confirmados" :key="a.id" class="agendamento confirmado">
          <div class="ag-topo">
            <strong>{{ a.nome_familia || 'Família' }}</strong>
            <span class="ag-valor">{{ moeda(a.preco) }}</span>
          </div>
          <p>
            📅 {{ formatarData(a.data) }} · 🕐 {{ hora(a.hora_inicio) }} às
            {{ hora(a.hora_fim) }} · 👶 {{ a.qtd_criancas }} criança(s)
          </p>
          <p v-if="a.cidade">📍 {{ a.cidade }}</p>
          <p class="ag-status">{{ statusPagamentoTexto(a) }}</p>

          <!-- Agendamentos antigos: aceitos antes do Pix ser pago -->
          <div
            v-if="a.status_pagamento === 'AGUARDANDO' && a.pagamento_marcado_em"
            class="acoes"
          >
            <button
              class="btn-aceitar"
              type="button"
              :disabled="acaoEmAndamento === a.id"
              @click="confirmar(a)"
            >
              {{
                acaoEmAndamento === a.id
                  ? 'Processando...'
                  : 'Confirmar recebimento do Pix'
              }}
            </button>
          </div>
        </div>
      </section>
    </template>
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
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

h1 {
  font-size: 26px;
  text-align: center;
  margin: 0;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.card h2 {
  font-size: 17px;
  margin: 0 0 12px;
  text-align: center;
  color: #1f2937;
}

.vazio {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  padding: 12px 0;
  margin: 0;
}

.agendamento {
  border: 1px solid #F3F4F6;
  border-left: 4px solid #F59E0B;
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #374151;
}

.agendamento p {
  margin: 0;
}

.agendamento.confirmado {
  border-left-color: #22c55e;
}

.ag-topo {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.ag-valor {
  color: #F6339A;
  font-weight: bold;
}

.ag-status {
  color: #b45309;
  font-size: 13px;
}

.acoes {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.acoes button {
  flex: 1;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.acoes button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-aceitar {
  border: none;
  background: #22c55e;
  color: white;
}

.btn-recusar {
  border: 1.5px solid #ef4444;
  background: white;
  color: #ef4444;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
