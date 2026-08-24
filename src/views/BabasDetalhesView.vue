<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/config'

const route = useRoute()
const router = useRouter()

const carregando = ref(true)
const erro = ref('')
const baba = ref<any>(null)

// Formulário de agendamento (sem função por enquanto)
const agendamento = ref({
  data: '',
  horaInicio: '',
  horaFim: '',
})

function calcularIdade(dtnasc: string | null): number | null {
  if (!dtnasc) return null
  const nascimento = new Date(dtnasc)
  if (isNaN(nascimento.getTime())) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

function nomeCompleto(): string {
  return [baba.value?.usuario?.primeiro_nome, baba.value?.usuario?.ultimo_nome]
    .filter(Boolean)
    .join(' ')
}

function voltar() {
  router.push('/buscar-babas')
}

async function carregar() {
  try {
    carregando.value = true
    erro.value = ''

    const id = route.query.id
    if (!id) {
      erro.value = 'Babá não especificada.'
      return
    }

    const { data } = await api.get(`/perfil-baba/${id}/`)
    baba.value = data
  } catch (e) {
    console.error(e)
    erro.value = 'Não foi possível carregar o perfil desta babá.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)
</script>

<template>
  <div class="pagina">

    <div class="voltar" @click="voltar">
      ← Voltar para a busca
    </div>

    <div v-if="carregando" class="card">
      Carregando perfil...
    </div>

    <div v-else-if="erro" class="card erro">
      {{ erro }}
    </div>

    <template v-else-if="baba">

      <!-- Cabeçalho do perfil -->
      <div class="card cabecalho">
        <img
          v-if="baba.usuario?.foto?.url"
          :src="baba.usuario.foto.url"
          :alt="`Foto de ${nomeCompleto()}`"
          class="foto"
        />
        <div v-else class="foto foto-vazia">👤</div>

        <div class="identidade">
          <h1>{{ nomeCompleto() }}</h1>

          <span class="disponivel" :class="{ indisponivel: !baba.disponivel }">
            {{ baba.disponivel ? 'Disponível' : 'Indisponível' }}
          </span>

          <p v-if="calcularIdade(baba.dtnasc)" class="linha-info">
            🎂 {{ calcularIdade(baba.dtnasc) }} anos
          </p>

          <p class="linha-info">
            🕐 {{ baba.experiencia_anos ?? 0 }} ano(s) de experiência
          </p>

          <p class="linha-info">
            📍
            {{
              [baba.usuario?.cidade, baba.usuario?.bairro].filter(Boolean).join(', ')
              || 'Localização não informada'
            }}
          </p>
        </div>
      </div>

      <!-- Sobre -->
      <div v-if="baba.sobre || baba.descricao" class="card">
        <h2>Sobre mim</h2>
        <p>{{ baba.sobre || baba.descricao }}</p>
      </div>

      <!-- Informações -->
      <div class="card">
        <h2>Informações</h2>
        <div class="grade">
          <div class="item">
            <span class="rotulo">🎓 Formação</span>
            <span>{{ baba.formacao || 'Não informada' }}</span>
          </div>
          <div class="item">
            <span class="rotulo">🎯 Habilidades</span>
            <span>{{ baba.habilidades || 'Não informadas' }}</span>
          </div>
          <div class="item">
            <span class="rotulo">📧 E-mail</span>
            <span>{{ baba.usuario?.email || 'Não informado' }}</span>
          </div>
          <div class="item">
            <span class="rotulo">📞 Telefone</span>
            <span>{{ baba.usuario?.telefone || 'Não informado' }}</span>
          </div>
        </div>

        <p class="preco">
          R$ {{ baba.valor_hora ?? '0,00' }}/hora
        </p>
      </div>

      <!-- Agendamento -->
      <div class="card">
        <h2>Agendar um cuidado</h2>

        <label>Data</label>
        <input v-model="agendamento.data" type="date" />

        <div class="linha">
          <div class="campo">
            <label>Início</label>
            <input v-model="agendamento.horaInicio" type="time" />
          </div>
          <div class="campo">
            <label>Fim</label>
            <input v-model="agendamento.horaFim" type="time" />
          </div>
        </div>

        <!-- Por enquanto, sem função -->
        <button class="btn-agendar">
          📅 Agendar cuidado
        </button>
      </div>

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

.voltar {
  align-self: flex-start;
  color: #F6339A;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.cabecalho {
  display: flex;
  gap: 18px;
  align-items: center;
}

.foto {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: #F3F4F6;
}

.identidade h1 {
  margin: 0 0 6px;
  font-size: 24px;
}

.disponivel {
  display: inline-block;
  background: #22c55e;
  color: white;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: bold;
  margin-bottom: 8px;
}

.disponivel.indisponivel {
  background: #9ca3af;
}

.linha-info {
  margin: 3px 0;
  font-size: 14px;
  color: #666;
}

.card h2 {
  font-size: 17px;
  margin: 0 0 10px;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
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
}

.rotulo {
  font-size: 12px;
  font-weight: bold;
  color: #F6339A;
}

.preco {
  color: #F6339A;
  font-size: 26px;
  font-weight: bold !important;
}

label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #555;
  margin: 12px 0 4px;
}

input[type="date"],
input[type="time"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;
}

.linha {
  display: flex;
  gap: 10px;
}

.campo {
  flex: 1;
}

.btn-agendar {
  width: 100%;
  margin-top: 16px;
  border: none;
  border-radius: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
