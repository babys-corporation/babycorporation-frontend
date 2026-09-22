<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import AreaAgendamento from '@/componentes/cards/AreaAgendamento.vue'

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const disponibilidadeInicial = ref(
  diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: false }), {})
)

const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(true)
const erro = ref('')

const baba = ref<any>(null)
const solicitacoes = ref<any[]>([])

const toast = ref<{ mensagem: string; tipo: 'aceito' | 'recusado' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function mostrarToast(mensagem: string, tipo: 'aceito' | 'recusado') {
  toast.value = { mensagem, tipo }

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toast.value = null
  }, 10000)
}

function fecharToast() {
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = null
  toast.value = null
}

// Espelha os critérios de completude do backend (core/signals.py)
const perfilCompleto = computed(() => {
  if (!baba.value) return false

  const u = baba.value.usuario ?? {}
  const p = baba.value

  const campos = [
    u.foto,
    u.cpf,
    u.telefone,
    u.cep,
    u.cidade,
    u.bairro,
    p.descricao,
    p.valor_hora,
    p.habilidades,
    p.dtnasc,
    p.formacao,
  ]

  return campos.every(
    (v) => v !== null && v !== undefined && String(v).trim() !== ''
  )
})

// Completa: primeiro nome + último nome | Incompleta: e-mail sem o @...
const nomeExibido = computed(() => {
  const u = baba.value?.usuario ?? {}

  if (perfilCompleto.value) {
    return [u.primeiro_nome, u.ultimo_nome]
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  return String(u.email || '').split('@')[0] || 'Babá'
})

const localizacao = computed(() => {
  const u = baba.value?.usuario ?? {}
  return [u.bairro, u.cidade].filter(Boolean).join(', ')
})

function irParaFormulario() {
  router.push('/completar-perfil-baba')
}

async function carregarDados() {
  try {
    carregando.value = true
    erro.value = ''

    // Busca o usuário logado
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    // Busca o perfil da babá logada (independe de completude)
    const { data: perfil } = await api.get('/perfil-baba/me/')
    baba.value = perfil

    // Busca os agendamentos da babá logada
    const { data } = await api.get('/agendamentos/me/')

    solicitacoes.value = data.results || data

  } catch (err) {
    console.error(err)
    erro.value = 'Erro ao carregar os dados.'
  } finally {
    carregando.value = false
  }
}

async function responderAgendamento(ag: any, aceitar: boolean) {
  try {
    await api.post(`/agendamentos/${ag.id}/${aceitar ? 'aceitar' : 'recusar'}/`)
    await carregarDados()
    mostrarToast(aceitar ? 'Solicitação aceita' : 'Solicitação recusada', aceitar ? 'aceito' : 'recusado')
  } catch (err: any) {
    console.error(err)
    alert(err?.response?.data?.detail || 'Não foi possível responder ao agendamento.')
  }
}

function traduzirStatus(status: string): string {
  const nomes: Record<string, string> = {
    PENDENTE: 'Pendente',
    ACEITO: 'Aceito',
    RECUSADO: 'Recusado',
  }
  return nomes[status] || status
}

function statusPagamentoLabel(status: string): string {
  const nomes: Record<string, string> = {
    AGUARDANDO: 'Aguardando pagamento',
    PAGO: 'Pagamento confirmado',
    NAO_EXIGIDO: 'Sem cobrança',
  }
  return nomes[status] || status
}

const confirmando = ref<number | null>(null)
const confirmarMsg = ref('')

async function confirmarPagamento(s: any) {
  confirmarMsg.value = ''
  confirmando.value = s.id
  try {
    const { data } = await api.post(`/agendamentos/${s.id}/confirmar_pagamento/`)
    await carregarDados()
    mostrarToast(`Pagamento do dia ${data.data} confirmado!`, 'aceito')
  } catch (err: any) {
    console.error(err)
    confirmarMsg.value = err?.response?.data?.detail || 'Não foi possível confirmar o pagamento.'
  } finally {
    confirmando.value = null
  }
}

const mensagemBanimento = computed(() => {
  if (!baba.value?.banido) return ''
  return 'Sua conta foi banida por não confirmar pagamentos. Você não aparece mais na busca de babás.'
})

const mensagemAdvertencia = computed(() => {
  const n = baba.value?.advertencias ?? 0
  if (baba.value?.banido || n === 0) return ''
  return `Atenção: você tem ${n} advertência(s) por não confirmar pagamentos. Após a 3ª, sua conta será banida.`
})

const editandoChavePix = ref(false)
const chavePixInput = ref('')
const salvandoChavePix = ref(false)

function iniciarEdicaoChavePix() {
  chavePixInput.value = baba.value?.chave_pix ?? ''
  editandoChavePix.value = true
}

async function salvarChavePix() {
  salvandoChavePix.value = true
  try {
    const { data } = await api.patch('/perfil-baba/me/', {
      chave_pix: chavePixInput.value || null,
    })
    baba.value = data
    editandoChavePix.value = false
    mostrarToast('Chave Pix salva!', 'aceito')
  } catch (err: any) {
    console.error(err)
    alert(err?.response?.data?.detail || 'Não foi possível salvar a chave Pix.')
  } finally {
    salvandoChavePix.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <div class="pagina">

    <div v-if="carregando" class="card">
      <h3>Carregando...</h3>
    </div>

    <div v-else-if="erro" class="card erro">
      {{ erro }}
    </div>

    <template v-else-if="baba">

      <!-- Cabeçalho -->
      <div class="card perfil">

        <div class="identidade">

          <img
            v-if="perfilCompleto && baba.usuario?.foto?.url"
            :src="baba.usuario.foto.url"
            alt="Foto da babá"
            class="foto"
          />
          <div v-else class="foto foto-vazia">
            👤
          </div>

          <div>
            <h2>{{ nomeExibido }}</h2>

            <span v-if="!perfilCompleto" class="aviso">
              Perfil incompleto
            </span>

            <p v-if="perfilCompleto && localizacao" class="localizacao">
              📍 {{ localizacao }}
            </p>

            <div v-if="perfilCompleto" class="contato">
              <span>📧 {{ baba.usuario?.email }}</span>
              <span v-if="baba.usuario?.telefone">
                📞 {{ baba.usuario.telefone }}
              </span>
            </div>
          </div>

        </div>

        <template v-if="perfilCompleto">

          <p v-if="baba.descricao" class="descricao">
            {{ baba.descricao }}
          </p>

          <div class="info-linha">
            <span>
              🕐 {{ baba.experiencia_anos }}
              {{ baba.experiencia_anos === 1 ? 'ano' : 'anos' }} de experiência
            </span>

            <span v-if="baba.habilidades" class="habilidades">
              🎯 {{ baba.habilidades }}
            </span>
          </div>

          <p class="preco">
            R$ {{ baba.valor_hora ?? '0,00' }}
            /hora
          </p>

          <div class="pix-chave">
            <template v-if="!editandoChavePix">
              <p class="pix-chave-linha">
                <span class="pix-status"
                  :class="{ ativa: baba.chave_pix }">
                  {{
                    baba.chave_pix
                      ? 'Pix configurado ✓'
                      : 'Pix não configurado'
                  }}
                </span>
              </p>
              <button
                class="btn-pix-chave"
                @click="iniciarEdicaoChavePix"
              >
                {{ baba.chave_pix ? 'Editar chave Pix' : 'Adicionar chave Pix' }}
              </button>
            </template>

            <template v-else>
              <input
                v-model="chavePixInput"
                class="input-pix-chave"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
              />
              <div class="pix-chave-acoes">
                <button
                  class="btn-pix-salvar"
                  :disabled="salvandoChavePix"
                  @click="salvarChavePix"
                >
                  {{ salvandoChavePix ? 'Salvando...' : 'Salvar' }}
                </button>
                <button
                  class="btn-pix-cancelar"
                  @click="editandoChavePix = false"
                >
                  Cancelar
                </button>
              </div>
            </template>
          </div>

        </template>

      </div>

      <!-- Avisos de advertência / banimento -->
      <div v-if="mensagemBanimento" class="card aviso-banido">
        ⛔ {{ mensagemBanimento }}
      </div>

      <div v-else-if="mensagemAdvertencia" class="card aviso-advertencia">
        ⚠️ {{ mensagemAdvertencia }}
      </div>

      <!-- Formulário (perfil incompleto) -->
      <div v-if="!perfilCompleto" class="card formulario">
        <h3>Complete seu perfil</h3>
        <p>
          Falta pouco! Preencha o formulário para que as famílias
          possam encontrar você.
        </p>

        <button
          class="btn-formulario"
          @click="irParaFormulario"
        >
          Abrir formulário
        </button>
      </div>

<!-- Agendamento (perfil completo) -->
      <div v-if="perfilCompleto" class="card agendamento">
        <h3>Meu agendamento</h3>
        <AreaAgendamento
          :nome="nomeExibido"
          :localizacao="localizacao"
          :experiencia="baba.experiencia_anos ?? 0"
          :disponibilidade="disponibilidadeInicial"
        />
      </div>

      <!-- Solicitações (perfil completo) -->
      <div v-if="perfilCompleto" class="solicitacoes">

        <h3>
          Solicitações de agendamento
        </h3>

        <div
          v-if="solicitacoes.length === 0"
          class="card"
        >
          <p>
            Nenhuma solicitação encontrada.
          </p>
        </div>

        <div
          class="card"
          v-for="s in solicitacoes"
          :key="s.id"
        >

          <div class="sol-topo">

            <span class="familia">
              {{ s.nome_familia || 'Família' }}
            </span>

            <span class="tempo">
              {{ s.data }}
            </span>

          </div>

          <p>
            {{ s.qtd_criancas }}
            criança(s)
          </p>

          <p>
            {{ s.hora_inicio }}
            às
            {{ s.hora_fim }}
          </p>

          <span
            v-if="s.status"
            class="status"
            :class="s.status.toLowerCase()"
          >
            {{ traduzirStatus(s.status) }}
          </span>

          <div
            v-if="s.status === 'PENDENTE'"
            class="acoes"
          >
            <button
              class="btn-aceitar"
              @click="responderAgendamento(s, true)"
            >
              ✓ Aceitar
            </button>
            <button
              class="btn-recusar"
              @click="responderAgendamento(s, false)"
            >
              ✕ Recusar
            </button>
          </div>

          <template v-if="s.status === 'ACEITO'">
            <span
              class="status pagamento"
              :class="s.status_pagamento?.toLowerCase()"
            >
              💳 {{ statusPagamentoLabel(s.status_pagamento) }}
            </span>

            <button
              v-if="!s.pagamento_marcado_em && s.status_pagamento === 'AGUARDANDO'"
              class="btn-aguardando"
              disabled
            >
              Aguardando o pai pagar (via Pix)
            </button>

            <button
              v-else-if="s.pagamento_marcado_em && s.status_pagamento === 'AGUARDANDO'"
              class="btn-aceitar"
              :disabled="confirmando === s.id"
              @click="confirmarPagamento(s)"
            >
              {{
                confirmando === s.id
                  ? 'Confirmando...'
                  : '✅ Confirmar recebimento do Pix'
              }}
            </button>

            <p v-if="confirmarMsg" class="confirmar-erro">
              {{ confirmarMsg }}
            </p>
          </template>

        </div>

      </div>

    </template>

    <Transition name="toast">
      <div
        v-if="toast"
        class="toast"
        :class="toast.tipo"
        @click="fecharToast"
      >
        {{ toast.mensagem }}
      </div>
    </Transition>

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

.toast {
  position: fixed;
  top: 24px;
  left: 16px;
  z-index: 9999;
  max-width: 90vw;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .18);
}

.toast.aceito {
  background: #16a34a;
}

.toast.recusado {
  background: #dc2626;
}

.toast-enter-active {
  transition: transform .45s ease, opacity .45s ease;
}

.toast-leave-active {
  transition: opacity .3s ease;
}

.toast-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.toast-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.toast-leave-to {
  opacity: 0;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.perfil {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.identidade {
  display: flex;
  align-items: center;
  gap: 14px;
}

.foto {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background: #F3F4F6;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

.aviso {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  color: #B45309;
  background: #FEF3C7;
  padding: 2px 10px;
  border-radius: 999px;
}

.localizacao {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
}

.contato {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.habilidades {
  background: #F3F4F6;
  padding: 4px 10px;
  border-radius: 10px;
}

.preco {
  color: #F6339A;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.descricao {
  background: #F3F4F6;
  border-radius: 8px;
  padding: 12px;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.formulario h3 {
  margin: 0 0 6px;
  font-size: 18px;
}

.formulario p {
  margin: 0 0 12px;
  color: #666;
  font-size: 14px;
}

.btn-formulario {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.solicitacoes h3 {
  margin-bottom: 12px;
  font-size: 18px;
}

.sol-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.familia {
  font-weight: bold;
  font-size: 15px;
}

.tempo {
  color: #F6339A;
  font-size: 13px;
}

.solicitacoes p {
  margin: 4px 0;
  color: #666;
}

.status {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 10px;
  border-radius: 999px;
}

.status.pendente {
  background: #FEF3C7;
  color: #B45309;
}

.status.aceito {
  background: #D1FAE5;
  color: #065F46;
}

.status.recusado {
  background: #FEE2E2;
  color: #B91C1C;
}

.acoes {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-aceitar,
.btn-recusar {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.btn-aceitar {
  background: #22c55e;
  color: white;
}

.btn-recusar {
  background: #ef4444;
  color: white;
}

.btn-aguardando {
  width: 100%;
  margin-top: 12px;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  background: #F3F4F6;
  color: #6B7280;
  cursor: default;
}

.status.pagamento {
  background: #FEF3C7;
  color: #92400E;
}

.status.pagamento.pago {
  background: #D1FAE5;
  color: #065F46;
}

.status.pagamento.nao_exigido {
  background: #F3F4F6;
  color: #6B7280;
}

.confirmar-erro {
  margin: 8px 0 0;
  color: #B91C1C;
  font-size: 13px;
}

.pix-chave {
  border-top: 1px solid #F3F4F6;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pix-chave-linha {
  margin: 0;
}

.pix-status {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
}

.pix-status.ativa {
  color: #166534;
}

.btn-pix-chave {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: #F3F4F6;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.input-pix-chave {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
}

.pix-chave-acoes {
  display: flex;
  gap: 10px;
}

.btn-pix-salvar,
.btn-pix-cancelar {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-pix-salvar {
  background: #16a34a;
  color: white;
}

.btn-pix-salvar:disabled {
  opacity: .6;
  cursor: default;
}

.btn-pix-cancelar {
  background: #F3F4F6;
  color: #4B5563;
}

.aviso-banido {
  background: #FEE2E2;
  border: 1px solid #FECACA;
  color: #B91C1C;
  font-weight: 600;
}

.aviso-advertencia {
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  color: #92400E;
  font-weight: 600;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
