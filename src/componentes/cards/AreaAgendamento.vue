<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  nome: {
    type: String,
    default: ''
  },
  localizacao: {
    type: String,
    default: ''
  },
  experiencia: {
    type: Number,
    default: 0
  },
  disponibilidade: {
    type: Object,
    default: () => ({
      Segunda: false,
      Terça: false,
      Quarta: false,
      Quinta: false,
      Sexta: false,
      Sábado: false,
      Domingo: false
    })
  },
  editar: {
    type: Boolean,
    default: true
  }
})

const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const disponibilidade = ref({ ...props.disponibilidade })

watch(
  () => props.disponibilidade,
  (novo) => {
    disponibilidade.value = { ...novo }
  }
)

function alternar(dia) {
  if (!props.editar) return
  disponibilidade.value[dia] = !disponibilidade.value[dia]
}

function textoAnos() {
  return `${props.experiencia} ${props.experiencia === 1 ? 'ano' : 'anos'} de experiência`
}
</script>

<template>
  <div class="secao">
    <h2 class="nome">{{ nome }}</h2>

    <div class="info-linha">
      <span class="informacao">
        📍 {{ localizacao || 'Localização não informada' }}
      </span>
      <span class="informacao">
        🕐 {{ textoAnos() }}
      </span>
    </div>

    <h3 class="titulo-disponibilidade">Disponibilidade</h3>

    <div class="grid-dias">
      <button
        v-for="dia in dias"
        :key="dia"
        class="bloco"
        :class="disponibilidade[dia] ? 'disponivel' : 'indisponivel'"
        type="button"
        :disabled="!editar"
        @click="alternar(dia)"
      >
        <span class="dia">{{ dia }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.secao {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nome {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 10px;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.informacao {
  display: inline-flex;
  align-items: center;
}

.titulo-disponibilidade {
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
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.bloco:disabled {
  cursor: default;
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
</style>