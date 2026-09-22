<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/config'

const props = defineProps({
  baba: {
    type: Object,
    required: true
  },
  disponibilidade: {
    type: Object,
    default: () => ({})
  }
})

const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const diasDoJs = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const data = ref('')
const horaInicio = ref('')
const horaFim = ref('')
const erro = ref('')
const sucesso = ref(false)
const enviando = ref(false)

const disponibilidade = computed(() => ({
  Segunda: props.disponibilidade['Segunda'] ?? false,
  Terça: props.disponibilidade['Terça'] ?? false,
  Quarta: props.disponibilidade['Quarta'] ?? false,
  Quinta: props.disponibilidade['Quinta'] ?? false,
  Sexta: props.disponibilidade['Sexta'] ?? false,
  Sábado: props.disponibilidade['Sábado'] ?? false,
  Domingo: props.disponibilidade['Domingo'] ?? false,
}))

const temDisponibilidade = computed(() =>
  dias.some((dia) => disponibilidade.value[dia])
)

const dados = computed(() => ({
  nome: props.baba?.nome,
  foto: props.baba?.foto?.url,
  localizacao: [props.baba?.usuario?.cidade, props.baba?.usuario?.bairro]
    .filter(Boolean)
    .join(', ') || props.baba?.localizacao || 'Localização não informada',
  experiencia: props.baba?.experiencia_anos ?? props.baba?.experiencia ?? 0,
  valorHora: props.baba?.valor_hora ?? props.baba?.preco ?? 0,
}))

const hoje = computed(() => {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
})

function diaDaSemana(dataIso) {
  return diasDoJs[new Date(dataIso + 'T00:00:00').getDay()]
}

function diaPermitido(dataIso) {
  return disponibilidade.value[diaDaSemana(dataIso)] === true
}

function validarData() {
  erro.value = ''
  sucesso.value = false

  if (!data.value) return

  if (!diaPermitido(data.value)) {
    erro.value = `A babá não está disponível em ${diaDaSemana(data.value)}. Escolha um dos dias disponíveis acima.`
    data.value = ''
    return
  }
}

function minutosDesdeMeiaNoite(hora) {
  if (!hora) return null
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function formatarHora(totalMinutos) {
  const h = Math.floor(totalMinutos / 60)
  const m = totalMinutos % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const horarios = computed(() => {
  const lista = []
  for (let min = 8 * 60; min <= 20 * 60; min += 60) {
    lista.push(formatarHora(min))
  }
  return lista
})

watch(horaInicio, (novo) => {
  if (!novo) return
  horaFim.value = formatarHora(minutosDesdeMeiaNoite(novo) + 60)
})

function validarIntervaloHora() {
  const inicio = minutosDesdeMeiaNoite(horaInicio.value)
  const fim = minutosDesdeMeiaNoite(horaFim.value)

  if (inicio === null || fim === null) return true

  return fim - inicio === 60
}

function validarHoraFim() {
  erro.value = ''
  sucesso.value = false

  if (!horaFim.value) return

  const intervalo = minutosDesdeMeiaNoite(horaFim.value) - minutosDesdeMeiaNoite(horaInicio.value)

  if (intervalo !== 60) {
    erro.value = 'O intervalo deve ser de exatamente 1 hora (fim = início + 1h).'
    horaFim.value = ''
  }
}

function opcoesFim() {
  if (!horaInicio.value) return []
  const fimValido = formatarHora(minutosDesdeMeiaNoite(horaInicio.value) + 60)
  return [fimValido]
}

const valorTotal = computed(() => {
  const v = Number(dados.value.valorHora) || 0
  return v.toFixed(2)
})

async function efetuarAgendamento() {
  erro.value = ''
  sucesso.value = false

  if (!data.value) {
    erro.value = 'Escolha uma data.'
    return
  }

  if (!horaInicio.value) {
    erro.value = 'Escolha o horário de início.'
    return
  }

  if (!horaFim.value) {
    erro.value = 'Escolha o horário de fim.'
    return
  }

  if (horaInicio.value < '08:00') {
    erro.value = 'O horário não pode começar antes das 08:00.'
    return
  }

  if (horaFim.value > '21:00') {
    erro.value = 'O horário não pode passar das 21:00.'
    return
  }

  if (!validarIntervaloHora()) {
    erro.value = 'O intervalo deve ser de exatamente 1 hora (fim = início + 1h).'
    return
  }

  enviando.value = true

  try {
    await api.post('/agendamentos/', {
      baba: props.baba.id,
      data: data.value,
      hora_inicio: horaInicio.value,
      hora_fim: horaFim.value,
      preco: String(dados.value.valorHora),
    })

    sucesso.value = true
  } catch (error) {
    const detalhes = error?.response?.data

    if (typeof detalhes === 'object' && detalhes !== null) {
      erro.value = Object.values(detalhes).flat().join(' ')
    } else {
      erro.value = detalhes?.detail || 'Não foi possível efetuar o agendamento. Tente novamente.'
    }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="secao">
    <div class="cabecalho">
      <img
        v-if="dados.foto"
        :src="dados.foto"
        :alt="`Foto de ${dados.nome}`"
        class="foto"
      />
      <div v-else class="foto foto-vazia">👤</div>

      <h2 class="nome">{{ dados.nome }}</h2>
    </div>

    <div class="info-linha">
      <span class="informacao">📍 {{ dados.localizacao }}</span>
      <span class="informacao">
        🕐 {{ dados.experiencia }} {{ dados.experiencia === 1 ? 'ano' : 'anos' }} de experiência
      </span>
    </div>

    <h3 class="titulo">Disponibilidade</h3>

    <div class="grid-dias">
      <div
        v-for="dia in dias"
        :key="dia"
        class="bloco"
        :class="disponibilidade[dia] ? 'disponivel' : 'indisponivel'"
      >
        <span class="dia">{{ dia }}</span>
      </div>
    </div>

    <p v-if="!temDisponibilidade" class="aviso-sem-dias">
      Esta babá ainda não definiu dias disponíveis.
    </p>

    <div class="formulario">
      <label>Data</label>
      <input
        v-model="data"
        type="date"
        :min="hoje"
        @change="validarData"
      />
      <small class="dica">
        Apenas dias em que a babá está disponível (verde acima).
      </small>

      <label>Hora de início</label>
      <select v-model="horaInicio">
        <option value="" disabled>Selecione o horário</option>
        <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
      </select>
      <small class="dica">Horários permitidos entre 08:00 e 20:00.</small>

      <label>Hora de fim</label>
      <select
        v-model="horaFim"
        @change="validarHoraFim"
      >
        <option value="" disabled>Selecione o horário</option>
        <option v-for="h in opcoesFim()" :key="h" :value="h">{{ h }}</option>
      </select>
      <small class="dica">Deve ser início + 1 hora.</small>
    </div>

    <p v-if="erro" class="erro">{{ erro }}</p>

    <p class="valor-hora">
      Valor por hora: R$ {{ valorTotal }}
    </p>

    <button
      class="btn-agendar"
      :disabled="enviando"
      @click="efetuarAgendamento"
    >
      {{ enviando ? 'Enviando...' : '📅 Efetuar agendamento' }}
    </button>

    <p v-if="sucesso" class="sucesso">
      Agendamento solicitado com sucesso!
    </p>
  </div>
</template>

<style scoped>
.secao {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cabecalho {
  display: flex;
  align-items: center;
  gap: 14px;
}

.foto {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: #f3f4f6;
}

.nome {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin: 12px 0 16px;
}

.titulo {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px;
}

.grid-dias {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.bloco {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
}

.dia {
  font-size: 13px;
  font-weight: 600;
}

.disponivel {
  background: #d1fae5;
  border-color: #34d399;
  color: #065f46;
}

.indisponivel {
  background: white;
  color: #9ca3af;
}

.aviso-sem-dias {
  font-size: 13px;
  color: #b45309;
  background: #fef3c7;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 12px;
}

.formulario {
  margin-top: 16px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #555;
  margin: 12px 0 4px;
}

.dica {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

input[type="date"],
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;
}

input[readonly] {
  background: #f3f4f6;
  color: #555;
}

.erro {
  margin: 12px 0 0;
  font-size: 13px;
  color: #b91c1c;
  background: #fee2e2;
  border-radius: 8px;
  padding: 8px 12px;
}

.sucesso {
  margin: 12px 0 0;
  font-size: 13px;
  color: #065f46;
  background: #d1fae5;
  border-radius: 8px;
  padding: 8px 12px;
}

.valor-hora {
  margin: 16px 0 12px;
  font-size: 22px;
  font-weight: bold;
  color: #f6339a;
}

.btn-agendar {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.btn-agendar:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>