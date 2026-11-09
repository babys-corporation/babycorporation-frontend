<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PagamentoPix from '../componentes/cards/PagamentoPix.vue'
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import type { Agendamento } from '@/api/agendamentoApi'

const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(true)
const erro = ref('')

const usuario = ref<any>(null)
const perfilPai = ref<any>(null)


const agendamentos = ref<Agendamento[]>([])
const pixAberto = ref<Agendamento | null>(null)

const fotoUrl = computed(() => usuario.value?.foto?.url || '')

function mascarar(valor: string | null | undefined, regex: RegExp, formato: string) {
  const digitos = String(valor ?? '').replace(/\D/g, '')
  return regex.test(digitos) ? digitos.replace(regex, formato) : (valor || '')
}

const dadosPessoais = computed(() => {
  const u = usuario.value || {}
  const telefone = String(u.telefone ?? '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')

  return [
    { rotulo: '📧 E-mail', valor: u.email },
    { rotulo: '📞 Telefone', valor: mascarar(telefone, /^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3') },
    { rotulo: '🪪 CPF', valor: mascarar(u.cpf, /^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') },
    { rotulo: '📮 CEP', valor: mascarar(u.cep, /^(\d{5})(\d{3})$/, '$1-$2') },
    { rotulo: '📍 Localização', valor: [u.cidade, u.bairro].filter(Boolean).join(', ') },
    { rotulo: '👶 Filhos', valor: String(perfilPai.value?.numero_filhos ?? 0) },
  ].map((item) => ({ ...item, valor: item.valor || 'Não informado' }))
})

const pendentes = computed(() =>
  agendamentos.value.filter((a) => a.status === 'PENDENTE')
)

const marcados = computed(() =>
  agendamentos.value.filter((a) => a.status === 'ACEITO')
)

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const hora = (h: string) => String(h).slice(0, 5)

const moeda = (v: string | number) =>
  Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function textoPagamento(a: Agendamento) {
  if (a.status_pagamento === 'PAGO') return 'Pagamento confirmado'
  if (a.status_pagamento === 'NAO_EXIGIDO') return 'Pagamento combinado com a babá'
  return a.pagamento_marcado_em
    ? 'Aguardando a babá confirmar o Pix'
    : 'Aguardando pagamento via Pix'
}

async function carregarAgendamentos() {
  try {
    const { data } = await api.get('/agendamentos/me/')
    const lista: Agendamento[] = data.results || data
    agendamentos.value = [...lista].sort((a, b) =>
      `${a.data}${a.hora_inicio}`.localeCompare(`${b.data}${b.hora_inicio}`)
    )
  } catch (e) {
    console.error('Erro ao carregar agendamentos:', e)
    agendamentos.value = []
  }
}

function fecharPix() {
  pixAberto.value = null
  carregarAgendamentos()
}

const nomeExibido = computed(() => {
  const u = usuario.value || authStore.usuario || {}
  const nome = [u.primeiro_nome, u.ultimo_nome].filter(Boolean).join(' ')
  if (nome.trim()) return nome.trim()
  if (u.email) return String(u.email).split('@')[0]
  return 'Responsável'
})

const perfilCompleto = computed(() => {
  const u = usuario.value || authStore.usuario || {}
  const p = perfilPai.value || {}

  const temNome = !!(u.primeiro_nome || u.first_name || u.ultimo_nome || u.last_name)
  const temTelefone = !!u.telefone
  const temCpf = !!u.cpf
  const temCep = !!u.cep
  const temFoto = !!(u.foto || u.foto_id)
  const temFilhos = p.numero_filhos !== null && p.numero_filhos !== undefined

  return temNome && temTelefone && temCpf && temCep && temFoto && temFilhos
})

function irParaFormulario() {
  router.push('/completar-perfil-responsavel')
}

onMounted(async () => {
  try {
    carregando.value = true
    erro.value = ''

    const { data: usuarioData } = await meRequest()
    usuario.value = usuarioData
    authStore.setUsuario(usuarioData)

    try {
      const { data: paiData } = await api.get('/perfil-pai/me/')
      perfilPai.value = paiData
    } catch {
      try {
        const { data: lista } = await api.get('/perfil-pai/')
        const resultados = lista.results || lista
        perfilPai.value = resultados.find((p: any) => p.usuario?.id === usuarioData.id || p.usuario === usuarioData.id)
      } catch {
        perfilPai.value = null
      }
    }

    if (perfilCompleto.value) {
      await carregarAgendamentos()
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
    erro.value = 'Erro ao carregar dados.'
  } finally {
    carregando.value = false
  }
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

    <template v-else>
      <header v-if="!perfilCompleto" class="cabecalho">
        <div class="info-usuario">
          <h2>{{ nomeExibido }}</h2>
          <p>{{ usuario?.email }}</p>
        </div>
      </header>

      <div v-if="!perfilCompleto" class="card incompleto">
        <h3>Complete seu perfil</h3>
        <p>Falta pouco para você conseguir agendar com as babás.</p>
        <button class="btn-completar" @click="irParaFormulario">
          Completar perfil
        </button>
      </div>

      <template v-else>
        <!-- Perfil: foto, nome e dados pessoais (visíveis só para o próprio usuário) -->
        <section class="card perfil">
          <img v-if="fotoUrl" :src="fotoUrl" :alt="nomeExibido" class="foto" />
          <div v-else class="foto foto-vazia">👤</div>

          <h1>{{ nomeExibido }}</h1>

          <div class="grade">
            <div v-for="item in dadosPessoais" :key="item.rotulo" class="item">
              <span class="rotulo">{{ item.rotulo }}</span>
              <span>{{ item.valor }}</span>
            </div>
          </div>
        </section>

        <!-- Agendamentos -->
        <section class="card">
          <h2>Agendamentos pendentes</h2>

          <p v-if="pendentes.length === 0" class="vazio">
            Nenhum agendamento pendente.
          </p>

          <div v-for="a in pendentes" :key="a.id" class="agendamento">
            <div class="ag-topo">
              <strong>{{ a.nome_baba }}</strong>
              <span class="ag-valor">{{ moeda(a.preco) }}</span>
            </div>
            <p>📅 {{ formatarData(a.data) }} · 🕐 {{ hora(a.hora_inicio) }} às {{ hora(a.hora_fim) }}</p>
            <p class="ag-status">Aguardando a babá aceitar · {{ textoPagamento(a) }}</p>
            <button
              v-if="a.pix_brcode && a.status_pagamento === 'AGUARDANDO'"
              class="btn-pix"
              type="button"
              @click="pixAberto = a"
            >
              Ver QR Code Pix
            </button>
          </div>
        </section>

        <section class="card">
          <h2>Agendamentos marcados</h2>

          <p v-if="marcados.length === 0" class="vazio">
            Nenhum agendamento marcado.
          </p>

          <div v-for="a in marcados" :key="a.id" class="agendamento marcado">
            <div class="ag-topo">
              <strong>{{ a.nome_baba }}</strong>
              <span class="ag-valor">{{ moeda(a.preco) }}</span>
            </div>
            <p>📅 {{ formatarData(a.data) }} · 🕐 {{ hora(a.hora_inicio) }} às {{ hora(a.hora_fim) }}</p>
            <p class="ag-status">{{ textoPagamento(a) }}</p>
          </div>
        </section>


        <PagamentoPix
          v-if="pixAberto"
          :agendamento="pixAberto"
          @pago="carregarAgendamentos"
          @fechar="fecharPix"
        />
      </template>
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

.cabecalho {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-usuario h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.info-usuario p {
  color: #6b7280;
  font-size: 14px;
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
  color: #1f2937;
}

.perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.perfil h1 {
  font-size: 24px;
  margin: 0;
  color: #1f2937;
}

.foto {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: #F3F4F6;
}

.grade {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 6px;
  text-align: left;
}

.item {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  color: #333;
  overflow-wrap: anywhere;
}

.rotulo {
  font-size: 12px;
  font-weight: bold;
  color: #F6339A;
}

.vazio {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  padding: 12px 0;
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

.agendamento.marcado {
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
  color: #6b7280;
  font-size: 13px;
}

.btn-pix {
  align-self: flex-start;
  margin-top: 6px;
  background: #F6339A;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}

.incompleto {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.incompleto h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.incompleto p {
  color: #6b7280;
  font-size: 14px;
}

.btn-completar {
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
}
</style>


