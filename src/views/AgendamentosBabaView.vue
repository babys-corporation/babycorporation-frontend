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
/* ── Base ─────────────────────────────────────────── */
.pagina {
  --rosa: #F6339A;
  --texto: #1f2937;
  --texto-suave: #6b7280;
  --borda: #f1f1f4;

  padding: 20px 16px 40px;
  background: #F9FAFB;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

h1 {
  font-size: 28px;
  text-align: center;
  margin: 4px 0 0;
  color: var(--texto);
}

.card {
  background: white;
  border: 1px solid var(--borda);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 18px rgba(17, 24, 39, .06);
}

.card h2 {
  font-size: 19px;
  margin: 0 0 6px;
  text-align: center;
  color: var(--texto);
}

/* traço rosa sob o título da seção */
.card h2::after {
  content: '';
  display: block;
  width: 36px;
  height: 3px;
  margin: 8px auto 4px;
  border-radius: 999px;
  background: var(--rosa);
}

.vazio {
  color: var(--texto-suave);
  font-size: 15px;
  text-align: center;
  padding: 18px 0 6px;
  margin: 0;
}

/* ── Card de agendamento ──────────────────────────── */
.agendamento {
  border: 1px solid var(--borda);
  border-left: 4px solid #F59E0B;
  border-radius: 14px;
  padding: 16px 18px;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #374151;
  text-align: left;
  background: #fff;
  transition: box-shadow .15s, transform .15s;
}

.agendamento:hover {
  box-shadow: 0 6px 16px rgba(17, 24, 39, .07);
  transform: translateY(-1px);
}

.agendamento p {
  margin: 0;
  text-align: left;
}

.agendamento.confirmado {
  border-left-color: #22c55e;
}

.ag-topo {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 2px;
}

.ag-topo strong {
  font-size: 17px;
  color: var(--texto);
  text-transform: capitalize;
  overflow-wrap: anywhere;
}

.ag-valor {
  color: var(--rosa);
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
}

/* selo de status do pagamento */
.ag-status {
  align-self: flex-start;
  margin-top: 4px !important;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #B45309;
  background: #FEF3C7;
}

.agendamento.confirmado .ag-status {
  color: #15803D;
  background: #DCFCE7;
}

/* ── Ações ────────────────────────────────────────── */
.acoes {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.acoes button {
  /* anula o estilo global de button (fit-content, margin auto, sombra) */
  flex: 1;
  width: auto;
  margin: 0;
  box-shadow: none;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: filter .15s, background .15s;
}

.acoes button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.acoes button:focus-visible {
  outline: 3px solid rgba(246, 51, 154, .35);
  outline-offset: 2px;
}

.btn-aceitar {
  border: none;
  background: #22c55e;
  color: white;
}

.btn-aceitar:hover:not(:disabled) {
  filter: brightness(.95);
}

.btn-recusar {
  border: 1.5px solid #ef4444;
  background: white;
  color: #ef4444;
}

.btn-recusar:hover:not(:disabled) {
  background: #FEF2F2;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
  border-color: #FECACA;
}

/* ── Responsivo ───────────────────────────────────── */
@media (max-width: 480px) {
  .pagina {
    padding: 14px 12px 32px;
    gap: 14px;
  }

  h1 {
    font-size: 24px;
  }

  .card {
    padding: 18px 14px;
    border-radius: 16px;
  }

  .agendamento {
    padding: 14px;
    font-size: 14px;
  }

  .ag-topo {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .acoes {
    flex-direction: column;
  }
}

/* Desktop largo: pedidos e confirmados lado a lado */
@media (min-width: 1024px) {
  .pagina {
    max-width: 1100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    align-content: start;
  }

  .pagina > * {
    grid-column: 1 / -1;
  }

  .pagina > section.card {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agendamento,
  .acoes button {
    transition: none;
  }

  .agendamento:hover {
    transform: none;
  }
}
</style>
