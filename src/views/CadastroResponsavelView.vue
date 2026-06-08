<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, TipoUsuario } from '@/api/auth'
import { useResponsavelStore } from '@/stores/responsavel'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'

const router = useRouter()
const responsavelStore = useResponsavelStore()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  telefone: '',
  endereco: '',
})

const quantidadeCriancas = ref(1)

const criancas = ref([
  { nome: '', genero: '', idade: '', alergias: '', condicoes: '' }
])

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

// Salva rascunho no localStorage
onMounted(() => {
  const dadosSalvos = localStorage.getItem('rascunho_cadastro_responsavel')
  if (dadosSalvos) {
    form.value = JSON.parse(dadosSalvos)
  }
})

watch(form, (novoValor) => {
  localStorage.setItem('rascunho_cadastro_responsavel', JSON.stringify(novoValor))
}, { deep: true })

const incrementarCriancas = () => {
  quantidadeCriancas.value++
  criancas.value.push({ nome: '', genero: '', idade: '', alergias: '', condicoes: '' })
}

const diminuirCriancas = () => {
  if (quantidadeCriancas.value > 1) {
    quantidadeCriancas.value--
    criancas.value.pop()
  }
}

const cadastrar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    // 1. Cria o usuário
    const { data: tokens } = await createUser({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      tipo: TipoUsuario.PAI,
    })

    // 2. Salva os tokens no store
    authStore.setTokens(tokens.access, tokens.refresh)

    // 3. Cria o perfil de responsável usando o token recém obtido
    await api.post('/perfil-pai/', {
      endereco: form.value.endereco,
      numero_filhos: quantidadeCriancas.value,
    }, {
      headers: { Authorization: `Bearer ${tokens.access}` }
    })

    // 4. Limpa rascunho e redireciona
    localStorage.removeItem('rascunho_cadastro_responsavel')
    sucesso.value = true

    setTimeout(() => router.push('/login'), 1500)

  } catch (e: any) {
    const data = e.response?.data
    if (data?.username) {
      erro.value = 'Nome de usuário já existe.'
    } else if (data?.email) {
      erro.value = 'E-mail já cadastrado.'
    } else if (data?.password) {
      erro.value = 'Senha muito fraca. Use pelo menos 8 caracteres.'
    } else {
      erro.value = data?.detail || 'Erro ao cadastrar. Tente novamente.'
    }
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina">
    <div class="hero">
      <h1>Pronta para começar?</h1>
      <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
    </div>

    <div v-if="sucesso" class="card sucesso">
      ✅ Cadastro realizado! Redirecionando para o login...
    </div>

    <div v-if="erro" class="card erro">
      ⚠️ {{ erro }}
    </div>

    <!-- Dados de acesso -->
    <div class="card">
      <p class="titulo">Criar conta</p>
      <div class="icone">👤</div>
      <input v-model="form.username" placeholder="Nome de usuário" autocomplete="username" />
      <input v-model="form.email" placeholder="E-mail" type="email" autocomplete="email" />
      <input v-model="form.password" placeholder="Senha (mínimo 8 caracteres)" type="password" autocomplete="new-password" />
    </div>

    <!-- Dados pessoais -->
    <div class="card">
      <p class="titulo">Dados pessoais</p>
      <input v-model="form.telefone" placeholder="Número de telefone" type="tel" />
      <input v-model="form.endereco" placeholder="Endereço" />
    </div>

    <!-- Quantidade de crianças -->
    <div class="card quantidade">
      <span>Quantas crianças você tem?</span>
      <div class="contador">
        <span>{{ quantidadeCriancas }}</span>
        <div class="setas">
          <button @click="incrementarCriancas">▲</button>
          <button @click="diminuirCriancas">▼</button>
        </div>
      </div>
    </div>

    <!-- Card de cada criança -->
    <div v-for="(crianca, index) in criancas" :key="index" class="card">
      <p class="titulo">Criança {{ index + 1 }}</p>
      <div class="icone">👶</div>
      <input v-model="crianca.nome" placeholder="Nome da criança" />
      <input v-model="crianca.genero" placeholder="Gênero" />
      <input v-model="crianca.idade" placeholder="Idade" type="number" min="0" />
      <input v-model="crianca.alergias" placeholder="Alergias" />
      <input v-model="crianca.condicoes" placeholder="Condições físicas/mentais" />
    </div>

    <button class="btn-cadastrar" @click="cadastrar" :disabled="carregando">
      {{ carregando ? 'Cadastrando...' : 'Cadastrar responsável' }}
    </button>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hero {
  text-align: center;
  color: white;
}
.hero h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}
.hero p { font-size: 14px; opacity: 0.9; }
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.titulo {
  font-weight: bold;
  color: #F6339A;
  text-align: center;
  font-size: 16px;
}
.icone {
  font-size: 32px;
  text-align: center;
}
input {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
}
.quantidade {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.quantidade span { font-size: 14px; }
.contador {
  display: flex;
  align-items: center;
  gap: 8px;
}
.setas {
  display: flex;
  flex-direction: column;
}
.setas button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}
.btn-cadastrar {
  background: white;
  color: #F6339A;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}
.btn-cadastrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.sucesso {
  background: #d1fae5;
  color: #065f46;
  text-align: center;
  font-weight: bold;
}
.erro {
  background: #fee2e2;
  color: #991b1b;
  text-align: center;
}
</style>