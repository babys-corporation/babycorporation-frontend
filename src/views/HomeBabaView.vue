<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'

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
    { rotulo: '📧 E-mail', valor: u.email },
    { rotulo: '📞 Telefone', valor: mascarar(telefone, /^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3') },
    { rotulo: '🪪 CPF', valor: mascarar(u.cpf, /^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') },
    { rotulo: '🎂 Nascimento', valor: formatarData(p.dtnasc) },
    { rotulo: '📮 CEP', valor: mascarar(u.cep, /^(\d{5})(\d{3})$/, '$1-$2') },
    { rotulo: '📍 Localização', valor: [u.cidade, u.bairro].filter(Boolean).join(', ') },
    { rotulo: '💠 Chave Pix', valor: p.chave_pix },
  ].map((item) => ({ ...item, valor: item.valor || 'Não informado' }))
})

const dadosProfissionais = computed(() => {
  const p = baba.value ?? {}
  const anos = Number(p.experiencia_anos || 0)

  return [
    { rotulo: '💰 Valor/hora', valor: `R$ ${Number(p.valor_hora ?? 0).toFixed(2)}` },
    { rotulo: '🕐 Experiência', valor: `${anos} ${anos === 1 ? 'ano' : 'anos'}` },
    { rotulo: '🎓 Formação', valor: p.formacao || 'Não informada' },
    { rotulo: '🎯 Habilidades', valor: p.habilidades || 'Não informadas' },
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
          <div class="foto-pequena foto-vazia">👤</div>
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
          <div v-else class="foto foto-vazia">👤</div>

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
              <span class="rotulo">{{ item.rotulo }}</span>
              <span>{{ item.valor }}</span>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="titulo-secao">Dados profissionais</h2>
          <div class="grade">
            <div v-for="item in dadosProfissionais" :key="item.rotulo" class="item">
              <span class="rotulo">{{ item.rotulo }}</span>
              <span>{{ item.valor }}</span>
            </div>
          </div>

          <div v-if="baba.descricao" class="sobre">
            <span class="rotulo">💬 Sobre mim</span>
            <p>{{ baba.descricao }}</p>
          </div>
        </section>
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

.card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

/* Perfil incompleto */
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
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

/* Perfil completo */
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

.disponivel {
  display: inline-block;
  background: #22c55e;
  color: white;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: bold;
}

.disponivel.indisponivel {
  background: #9ca3af;
}

.titulo-secao {
  font-size: 17px;
  margin: 0 0 12px;
  text-align: center;
  color: #1f2937;
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
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

.sobre {
  margin-top: 10px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 10px 12px;
}

.sobre p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.dica {
  margin: -4px 0 12px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.dias {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.dia {
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: background .15s, color .15s;
}

.dia:disabled {
  cursor: wait;
  opacity: .7;
}

.dia.livre {
  background: #DCFCE7;
  color: #15803D;
}

.dia.ocupado {
  background: #FEE2E2;
  color: #B91C1C;
}

.dia-status {
  font-size: 11px;
  font-weight: 400;
}

.erro-texto {
  margin: 10px 0 0;
  color: #B91C1C;
  font-size: 13px;
  text-align: center;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
