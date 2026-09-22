<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useResponsavelStore } from '@/stores/responsavel'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import CompletarPerfilResponsavel from './CompletarPerfilResponsavelView.vue'

const authStore = useAuthStore()
const responsavelStore = useResponsavelStore()

const carregando = ref(true)
const erro = ref('')

const usuario = ref<any>(null)
const perfilPai = ref<any>(null)
const agendamentos = ref<any[]>([])
const agendamentosRespondidos = ref<any[]>([])

const toast = ref<{ mensagem: string; tipo: 'aceito' | 'recusado' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

let toastIndex = 0

function mostrarToast(mensagem: string, tipo: 'aceito' | 'recusado') {
  toast.value = { mensagem, tipo }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
    setTimeout(() => proximoToast(), 350)
  }, 10000)
}

function fecharToast() {
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = null
  toast.value = null
  setTimeout(() => proximoToast(), 350)
}

function proximoToast() {
  if (toastIndex < agendamentosRespondidos.value.length) {
    const ag = agendamentosRespondidos.value[toastIndex]
    const tipo = ag.status === 'ACEITO' ? 'aceito' : 'recusado'
    mostrarToast(`Solicitação ${tipo} — ${ag.nome_familia || ag.data}`, tipo)
    toastIndex++
  }
}

function statusPagamentoLabel(status: string): string {
  const nomes: Record<string, string> = {
    AGUARDANDO: 'Aguardando pagamento',
    PAGO: 'Pagamento confirmado',
    NAO_EXIGIDO: 'Sem cobrança (babá sem chave Pix)',
  }
  return nomes[status] || status
}

function formatarPreco(v: any): string {
  const n = Number(v) || 0
  return n.toFixed(2).replace('.', ',')
}

function traduzirStatus(status: string): string {
  const nomes: Record<string, string> = {
    PENDENTE: 'Pendente',
    ACEITO: 'Aceito',
    RECUSADO: 'Recusado',
  }
  return nomes[status] || status
}

async function copiarPix(brcode: string) {
  try {
    await navigator.clipboard.writeText(brcode)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = brcode
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

const marcando = ref<number | null>(null)
const marcarPagoMsg = ref('')
const qrUrls = ref<Record<number, string>>({})

async function carregarQrcode(ag: any) {
  try {
    const resp = await api.get(`/agendamentos/${ag.id}/pagamento_qrcode/`, {
      responseType: 'blob',
    })
    const url = URL.createObjectURL(resp.data)
    qrUrls.value[ag.id] = url
  } catch {
    // sem QR (babá sem chave pix)
  }
}

async function marcarPago(ag: any) {
  marcarPagoMsg.value = ''
  marcando.value = ag.id
  try {
    const { data } = await api.post(`/agendamentos/${ag.id}/marcar_pago/`)
    const idx = agendamentos.value.findIndex(a => a.id === ag.id)
    if (idx !== -1) agendamentos.value[idx] = data
  } catch (err: any) {
    marcarPagoMsg.value = err?.response?.data?.detail || 'Erro ao marcar como pago.'
  } finally {
    marcando.value = null
  }
}

// Perfil completo: tem PerfilPai E os dados essenciais do usuário preenchidos
const perfilCompleto = computed(() => {
  const u = usuario.value
  if (!u || !perfilPai.value) return false

  return Boolean(
    String(u.primeiro_nome || '').trim() &&
    String(u.ultimo_nome || '').trim() &&
    String(u.telefone || '').trim() &&
    u.foto &&
    perfilPai.value.numero_filhos !== null &&
    perfilPai.value.numero_filhos !== undefined
  )
})

// Completo: primeiro nome + último nome | Incompleto: e-mail antes do @
const nomeExibido = computed(() => {
  const u = usuario.value ?? {}

  if (perfilCompleto.value) {
    return [u.primeiro_nome, u.ultimo_nome]
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  return String(u.email || '').split('@')[0] || 'Responsável'
})

const quantidadeFilhos = computed(() => perfilPai.value?.numero_filhos ?? 0)

// Quando o formulário embutido cria o perfil, troca para o modo completo na hora
watch(() => responsavelStore.responsavel, async (novo) => {
  if (!novo) return
  perfilPai.value = novo

  try {
    const { data } = await meRequest()
    usuario.value = data
    authStore.setUsuario(data)
  } catch {
    // mantém os dados atuais
  }
})

async function carregarDados() {
  try {
    carregando.value = true
    erro.value = ''

    // Busca o usuário logado
    const { data } = await meRequest()
    usuario.value = data
    authStore.setUsuario(data)

    // Busca o perfil do pai logado (404 => ainda não completou o perfil)
    const { data: perfil } = await api.get('/perfil-pai/me/')
    perfilPai.value = perfil

    const { data: agendamentosData } = await api.get('/agendamentos/me/')
    agendamentos.value = agendamentosData.results || agendamentosData

    for (const ag of agendamentos.value) {
      if (ag.status === 'ACEITO' && ag.status_pagamento === 'AGUARDANDO' && ag.pix_brcode) {
        carregarQrcode(ag)
      }
    }
    agendamentosRespondidos.value = agendamentos.value.filter(
      (ag: any) => ag.status === 'ACEITO' || ag.status === 'RECUSADO'
    )

    if (agendamentosRespondidos.value.length > 0) {
      toastIndex = 0
      proximoToast()
    }
  } catch (err: any) {
    if (err?.response?.status === 404) {
      perfilPai.value = null
    } else {
      console.error(err)
      erro.value = 'Erro ao carregar os dados.'
    }
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)

onBeforeUnmount(() => {
  Object.values(qrUrls.value).forEach((url) => URL.revokeObjectURL(url))
})
</script>

<template>
  <div class="pagina">

    <div v-if="carregando" class="card">
      <h3>Carregando...</h3>
    </div>

    <div v-else-if="erro" class="card erro">
      {{ erro }}
    </div>

    <template v-else-if="usuario">

      <!-- Cabeçalho -->
      <div class="card perfil">

        <div class="identidade">

          <img
            v-if="perfilCompleto && usuario?.foto?.url"
            :src="usuario.foto.url"
            alt="Foto do responsável"
            class="foto"
          />
          <div v-else-if="perfilCompleto" class="foto foto-vazia">
            👤
          </div>

          <div>
            <h2>{{ nomeExibido }}</h2>

            <span v-if="!perfilCompleto" class="aviso">
              Perfil incompleto
            </span>

            <div v-if="perfilCompleto" class="contato">
              <span>📧 {{ usuario?.email }}</span>
              <span v-if="usuario?.telefone">
                📞 {{ usuario.telefone }}
              </span>
            </div>

            <p v-if="perfilCompleto" class="filhos">
              🧒 {{ quantidadeFilhos }}
              {{ quantidadeFilhos === 1 ? 'filho' : 'filhos' }}
            </p>
          </div>

        </div>

      </div>

      <!-- Formulário (perfil incompleto): CompletarPerfilResponsavelView embutido -->
      <CompletarPerfilResponsavel v-if="!perfilCompleto" />

      <!-- Meus agendamentos (perfil completo) -->
      <div v-if="perfilCompleto" class="card agendamentos">

        <h3>Meus agendamentos</h3>

        <div
          v-if="agendamentos.length === 0"
          class="s-sem"
        >
          Nenhum agendamento feito.
        </div>

        <div
          class="ag-card"
          v-for="ag in agendamentos"
          :key="ag.id"
        >

          <div class="ag-topo">
            <span class="ag-status" :class="ag.status.toLowerCase()">
              {{ traduzirStatus(ag.status) }}
            </span>
            <span class="ag-data">{{ ag.data }}</span>
          </div>

          <p><strong>{{ ag.nome_familia }}</strong></p>
          <p>
            {{ ag.hora_inicio }} às {{ ag.hora_fim }} ·
            {{ ag.qtd_criancas }} criança(s) ·
            R$ {{ formatarPreco(ag.preco) }}
          </p>

          <template v-if="ag.status === 'ACEITO'">
            <p
              class="ag-pag"
              :class="ag.status_pagamento"
            >
              {{ statusPagamentoLabel(ag.status_pagamento) }}
            </p>

            <div
              v-if="ag.status_pagamento === 'AGUARDANDO' && ag.pix_brcode"
              class="pix-box"
            >
              <p class="pix-titulo">Pagamento via Pix</p>

              <img
                v-if="qrUrls[ag.id]"
                class="pix-qr"
                :src="qrUrls[ag.id]"
                alt="QR Code Pix"
              />
              <div v-else class="pix-qr-aguardando">Gerando QR Code...</div>

              <p class="pix-dica">
                Escaneie o QR Code ou use o código abaixo
                para pagar. A babá confirma o recebimento.
              </p>
              <code class="pix-codigo">{{ ag.pix_brcode }}</code>
              <button
                class="btn-copiar"
                @click="copiarPix(ag.pix_brcode)"
              >
                Copiar código Pix
              </button>
              <p class="pix-dica">
                Abra o app do seu banco, escolha "Pix", "Pagar com Pix",
                cole o código e confirme. Depois marque abaixo:
              </p>

              <button
                v-if="!ag.pagamento_marcado_em"
                class="btn-paguei"
                :disabled="marcando === ag.id"
                @click="marcarPago(ag)"
              >
                {{ marcando === ag.id ? 'Enviando...' : 'Paguei — aguardando a babá confirmar' }}
              </button>
              <p v-else class="pix-confirmado">
                ✅ Você marcou o pagamento. A babá tem até 24h para
                confirmar o recebimento.
              </p>

              <p
                v-if="marcarPagoMsg"
                class="pix-erro"
              >
                {{ marcarPagoMsg }}
              </p>
            </div>
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

.filhos {
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

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
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

.agendamentos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.s-sem {
  color: #888;
  font-size: 14px;
}

.ag-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #fff;
}

.ag-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ag-status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.ag-status.pendente {
  background: #FEF3C7;
  color: #92400E;
}

.ag-status.aceito {
  background: #DCFCE7;
  color: #166534;
}

.ag-status.recusado {
  background: #FEE2E2;
  color: #B91C1C;
}

.ag-data {
  font-size: 12px;
  color: #888;
}

.ag-pag {
  font-size: 13px;
  font-weight: 600;
}

.ag-pag.aguardando {
  color: #B45309;
}

.ag-pag.pago {
  color: #166534;
}

.ag-pag.nao_exigido {
  color: #888;
}

.pix-box {
  margin-top: 8px;
  border: 1px dashed #16a34a;
  border-radius: 12px;
  padding: 12px;
  background: #F0FDF4;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pix-titulo {
  font-weight: 700;
  font-size: 14px;
  color: #166534;
  margin: 0;
}

.pix-codigo {
  font-size: 12px;
  word-break: break-all;
  color: #333;
  background: white;
  border-radius: 8px;
  padding: 10px;
}

.pix-qr {
  align-self: center;
  width: 180px;
  height: 180px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.pix-qr-aguardando {
  align-self: center;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #6B7280;
  font-size: 13px;
}

.btn-copiar {
  border: none;
  border-radius: 10px;
  background: #16a34a;
  color: white;
  font-weight: 600;
  padding: 10px 14px;
  cursor: pointer;
}

.pix-dica {
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.btn-paguei {
  border: none;
  border-radius: 10px;
  background: #0f766e;
  color: white;
  font-weight: 600;
  padding: 10px 14px;
  cursor: pointer;
}

.btn-paguei:disabled {
  opacity: .6;
  cursor: default;
}

.pix-confirmado {
  font-size: 13px;
  font-weight: 600;
  color: #0f766e;
  margin: 0;
}

.pix-erro {
  font-size: 12px;
  color: #B91C1C;
  margin: 0;
}
</style>
