<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import {
  Banknote,
  Cake,
  Clock,
  GraduationCap,
  IdCard,
  KeyRound,
  Mail,
  Mailbox,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(true)
const erro = ref('')

const baba = ref<any>(null)

// Espelha os critérios de completude do backend (core/signals.py)
const perfilCompleto = computed(() => {
  if (!baba.value) return false

  const u = baba.value.usuario ?? {}
  const p = baba.value

  if (!p.chave_pix || String(p.chave_pix).trim() === '') {
    return false
  }

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

// Exibe como no Vercel: usa username quando disponível, senão nome/email
const nomeExibido = computed(() => {
  const u = baba.value?.usuario ?? {}

  if (u.username) {
    return u.username
  }

  const nome = [u.primeiro_nome, u.ultimo_nome].filter(Boolean).join(' ')
  if (nome.trim()) {
    return nome.trim()
  }

  return String(u.email || '').split('@')[0] || 'Babá'
})

const fotoUrl = computed(() => baba.value?.usuario?.foto?.url || '')

function mascarar(valor: string | null | undefined, regex: RegExp, formato: string) {
  const digitos = String(valor ?? '').replace(/\D/g, '')
  return regex.test(digitos) ? digitos.replace(regex, formato) : (valor || '')
}

function formatarData(data: string | null | undefined) {
  if (!data) return ''
  const [ano, mes, dia] = String(data).split('-')
  return `${dia}/${mes}/${ano}`
}

// Dados pessoais: aparecem só aqui, para a própria babá
const dadosPessoais = computed(() => {
  const u = baba.value?.usuario ?? {}
  const p = baba.value ?? {}
  const telefone = String(u.telefone ?? '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')

  return [
    { rotulo: 'E-mail', icone: Mail, valor: u.email },
    { rotulo: 'Telefone', icone: Phone, valor: mascarar(telefone, /^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3') },
    { rotulo: 'CPF', icone: IdCard, valor: mascarar(u.cpf, /^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') },
    { rotulo: 'Nascimento', icone: Cake, valor: formatarData(p.dtnasc) },
    { rotulo: 'CEP', icone: Mailbox, valor: mascarar(u.cep, /^(\d{5})(\d{3})$/, '$1-$2') },
    { rotulo: 'Localização', icone: MapPin, valor: [u.cidade, u.bairro].filter(Boolean).join(', ') },
    { rotulo: 'Chave Pix', icone: KeyRound, valor: p.chave_pix },
  ].map((item) => ({ ...item, valor: item.valor || 'Não informado' }))
})

const dadosProfissionais = computed(() => {
  const p = baba.value ?? {}
  const anos = Number(p.experiencia_anos || 0)

  return [
    { rotulo: 'Valor/hora', icone: Banknote, valor: `R$ ${Number(p.valor_hora ?? 0).toFixed(2)}` },
    { rotulo: 'Experiência', icone: Clock, valor: `${anos} ${anos === 1 ? 'ano' : 'anos'}` },
    { rotulo: 'Formação', icone: GraduationCap, valor: p.formacao || 'Não informada' },
    { rotulo: 'Habilidades', icone: Sparkles, valor: p.habilidades || 'Não informadas' },
  ]
})

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

// Dias sem valor salvo contam como disponíveis (padrão do backend)
const disponibilidade = computed<Record<string, boolean>>(() =>
  Object.fromEntries(
    DIAS_SEMANA.map((dia) => [dia, baba.value?.disponibilidade?.[dia] !== false])
  )
)

const salvandoDia = ref<string | null>(null)
const erroDisponibilidade = ref('')

async function alternarDia(dia: string) {
  if (salvandoDia.value) return

  const anterior = { ...disponibilidade.value }
  const nova = { ...anterior, [dia]: !anterior[dia] }

  salvandoDia.value = dia
  erroDisponibilidade.value = ''
  baba.value = { ...baba.value, disponibilidade: nova }

  try {
    const { data } = await api.patch('/perfil-baba/me/', { disponibilidade: nova })
    baba.value = { ...baba.value, disponibilidade: data.disponibilidade }
  } catch (e: any) {
    baba.value = { ...baba.value, disponibilidade: anterior }
    erroDisponibilidade.value =
      e?.response?.data?.disponibilidade?.[0] ||
      'Não foi possível salvar a disponibilidade. Tente novamente.'
  } finally {
    salvandoDia.value = null
  }
}

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

    // A completude é calculada só com os dados da própria babá (/me/).
    // Não usar a lista pública de babás: ela é cacheada no store e esconde
    // a chave Pix, o que faria um perfil completo parecer incompleto.
    const { data: perfil } = await api.get('/perfil-baba/me/')
    baba.value = perfil
  } catch (err: any) {
    console.error(err)
    baba.value = null
    erro.value =
      err?.response?.status === 404
        ? 'Perfil de babá não encontrado.'
        : 'Não foi possível carregar seu perfil agora. Tente novamente.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <div class="pagina">

    <div v-if="carregando" class="card">
      <h3>Carregando...</h3>
    </div>

    <div v-else-if="erro && !baba" class="card erro">
      <p>{{ erro }}</p>
      <button class="btn-formulario" type="button" @click="carregarDados">
        Tentar novamente
      </button>
    </div>

    <template v-else-if="baba">

      <!-- Perfil incompleto -->
      <template v-if="!perfilCompleto">
        <div class="card identidade">
          <div class="foto-pequena foto-vazia"><User :size="32" aria-hidden="true" /></div>
          <div>
            <h2>{{ nomeExibido }}</h2>
            <span class="aviso">Perfil incompleto</span>
          </div>
        </div>

        <div class="card formulario">
          <h3>Complete seu perfil</h3>
          <p>
            Falta pouco! Preencha o formulário para que as famílias
            possam encontrar você.
          </p>

          <button class="btn-formulario" @click="irParaFormulario">
            Abrir formulário
          </button>
        </div>
      </template>

      <!-- Perfil completo: foto, nome e dados (visíveis só para a própria babá) -->
      <template v-else>
        <section class="card perfil">
          <img v-if="fotoUrl" :src="fotoUrl" :alt="nomeExibido" class="foto" />
          <div v-else class="foto foto-vazia"><User :size="52" aria-hidden="true" /></div>

          <h1>{{ nomeExibido }}</h1>

          <span class="disponivel" :class="{ indisponivel: !baba.disponivel }">
            {{ baba.disponivel ? 'Disponível' : 'Indisponível' }}
          </span>
        </section>

        <section class="card">
          <h2 class="titulo-secao">Disponibilidade</h2>
          <p class="dica">
            Toque num dia para mudar. Vale para os próximos pedidos; os
            agendamentos já marcados continuam iguais.
          </p>

          <div class="dias">
            <button
              v-for="dia in DIAS_SEMANA"
              :key="dia"
              type="button"
              class="dia"
              :class="disponibilidade[dia] ? 'livre' : 'ocupado'"
              :disabled="salvandoDia !== null"
              :aria-pressed="disponibilidade[dia]"
              @click="alternarDia(dia)"
            >
              {{ dia }}
              <span class="dia-status">
                {{ salvandoDia === dia ? 'Salvando...' : disponibilidade[dia] ? 'Disponível' : 'Indisponível' }}
              </span>
            </button>
          </div>

          <p v-if="erroDisponibilidade" class="erro-texto">{{ erroDisponibilidade }}</p>
        </section>

        <section class="card">
          <h2 class="titulo-secao">Dados pessoais</h2>
          <div class="grade">
            <div v-for="item in dadosPessoais" :key="item.rotulo" class="item">
              <span class="rotulo">
                <component :is="item.icone" :size="14" aria-hidden="true" />
                {{ item.rotulo }}
              </span>
              <span>{{ item.valor }}</span>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="titulo-secao">Dados profissionais</h2>
          <div class="grade">
            <div v-for="item in dadosProfissionais" :key="item.rotulo" class="item">
              <span class="rotulo">
                <component :is="item.icone" :size="14" aria-hidden="true" />
                {{ item.rotulo }}
              </span>
              <span>{{ item.valor }}</span>
            </div>
          </div>

          <div v-if="baba.descricao" class="sobre">
            <span class="rotulo">
              <MessageCircle :size="14" aria-hidden="true" />
              Sobre mim
            </span>
            <p>{{ baba.descricao }}</p>
          </div>
        </section>
      </template>

    </template>

  </div>
</template>

<style scoped>
/* ── Base ─────────────────────────────────────────── */
.pagina {
  --rosa: #F6339A;
  --roxo: #8b5cf6;
  --degrade: linear-gradient(135deg, #ff2f92, #8b5cf6);
  --texto: #1f2937;
  --texto-suave: #6b7280;
  --fundo-item: #fafafa;
  --borda: #f1f1f4;
  --sombra: 0 4px 18px rgba(17, 24, 39, .06);

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

.card {
  background: white;
  border: 1px solid var(--borda);
  border-radius: 18px;
  padding: 22px;
  box-shadow: var(--sombra);
}

/* ── Perfil incompleto (sem alterações visuais grandes) ── */
.identidade {
  display: flex;
  align-items: center;
  gap: 14px;
}

.foto-pequena {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 30px !important;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: var(--texto);
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
  border-radius: 12px;
  padding: 13px;
  background: var(--degrade);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(246, 51, 154, .25);
  transition: transform .15s, box-shadow .15s;
}

.btn-formulario:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(246, 51, 154, .32);
}

/* ── Cabeçalho do perfil completo ─────────────────── */
.perfil {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding-top: 28px;
}

.perfil h1 {
  font-size: 26px;
  margin: 6px 0 0;
  color: var(--texto);
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.foto {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 6px 18px rgba(246, 51, 154, .2);
  background: white;
}

.foto-vazia {
  color: #c4c8d0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: #F3F4F6;
}

.disponivel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #DCFCE7;
  color: #15803D;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: bold;
}

.disponivel::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.disponivel.indisponivel {
  background: #F3F4F6;
  color: #6b7280;
}

/* ── Títulos de seção ─────────────────────────────── */
.titulo-secao {
  font-size: 17px;
  margin: 0 0 14px;
  text-align: center;
  color: var(--texto);
}

.titulo-secao::after {
  content: '';
  display: block;
  width: 36px;
  height: 3px;
  margin: 8px auto 0;
  border-radius: 999px;
  background: var(--rosa);
}

/* ── Dados pessoais / profissionais ───────────────── */
.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.item {
  background: var(--fundo-item);
  border: 1px solid var(--borda);
  border-left: 3px solid var(--rosa);
  border-radius: 12px;
  padding: 11px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  font-size: 14px;
  color: #333;
  overflow-wrap: anywhere;
  transition: transform .15s, box-shadow .15s;
}

.item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(17, 24, 39, .06);
}

.rotulo {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: bold;
  color: var(--rosa);
  letter-spacing: .2px;
}

.sobre {
  margin-top: 12px;
  background: #FDF2F8;
  border-radius: 12px;
  padding: 12px 14px;
}

.sobre p {
  margin: 6px 0 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

/* ── Disponibilidade ──────────────────────────────── */
.dica {
  margin: -4px 0 14px;
  font-size: 13px;
  color: var(--texto-suave);
  text-align: center;
  line-height: 1.5;
}

.dias {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.dia {
  /* anula o estilo global de button (fit-content, margin auto, sombra) */
  width: 100%;
  margin: 0;
  box-shadow: none;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px 8px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: background .15s, color .15s, border-color .15s, transform .15s;
}

.dia:hover:not(:disabled) {
  transform: translateY(-1px);
}

.dia:focus-visible {
  outline: none;
  border-color: var(--roxo);
}

.dia:disabled {
  cursor: wait;
  opacity: .7;
}

.dia.livre {
  background: #DCFCE7;
  color: #15803D;
}

.dia.livre:hover:not(:disabled) {
  border-color: #86EFAC;
}

.dia.ocupado {
  background: #FEE2E2;
  color: #B91C1C;
}

.dia.ocupado:hover:not(:disabled) {
  border-color: #FCA5A5;
}

.dia-status {
  font-size: 11px;
  font-weight: 500;
  opacity: .85;
}

/* ── Erros ────────────────────────────────────────── */
.erro-texto {
  margin: 12px 0 0;
  color: #B91C1C;
  font-size: 13px;
  text-align: center;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
  border-color: #FECACA;
}

.erro p {
  margin: 0 0 12px;
}

/* ── Responsivo ───────────────────────────────────── */
@media (max-width: 420px) {
  .pagina {
    padding: 14px 12px 32px;
    gap: 14px;
  }

  .card {
    padding: 18px 14px;
    border-radius: 16px;
  }

  .foto {
    width: 108px;
    height: 108px;
  }

  .perfil h1 {
    font-size: 22px;
  }

  .grade {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 600px) {
  .dias {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 760px) {
  .dias {
    grid-template-columns: repeat(7, 1fr);
  }

  .dia {
    padding: 14px 6px;
    font-size: 13px;
  }
}

/* Desktop largo: dados pessoais e profissionais lado a lado */
@media (min-width: 1024px) {
  .pagina {
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .pagina > * {
    grid-column: 1 / -1;
  }

  .pagina > section.card:nth-last-of-type(-n + 2) {
    grid-column: auto;
    height: 100%;
    box-sizing: border-box;
  }

  .grade {
    grid-template-columns: 1fr 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .item,
  .dia,
  .btn-formulario {
    transition: none;
  }

  .item:hover,
  .dia:hover:not(:disabled),
  .btn-formulario:hover {
    transform: none;
  }
}
</style>
