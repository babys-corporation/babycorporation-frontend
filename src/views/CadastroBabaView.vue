<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, TipoUsuario } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  telefone: '',
  dtnasc: '',
  experiencia_anos: '',
  valor_hora: '',
  formacao: '',
  habilidades: '',
  sobre: '',
  descricao: '',
  first_name:'',
  last_name:''
})

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const cadastrar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    // 1. Cria o usuário com tipo BABA
  const { data: tokens } = await createUser({
  username: form.value.username,
  first_name: form.value.first_name,
  last_name: form.value.last_name,
  email: form.value.email,
  password: form.value.password,
  tipo: TipoUsuario.BABA,
})

    // 2. Salva tokens
    authStore.setTokens(tokens.access, tokens.refresh)

    // 3. Cria o perfil de babá
    await api.post('/perfil-baba/', {
      dtnasc: form.value.dtnasc || null,
      experiencia_anos: Number(form.value.experiencia_anos) || 0,
      valor_hora: form.value.valor_hora || null,
      formacao: form.value.formacao || null,
      habilidades: form.value.habilidades || null,
      sobre: form.value.sobre || null,
      descricao: form.value.descricao || null,
      disponivel: true,
    }, {
      headers: { Authorization: `Bearer ${tokens.access}` }
    })

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
      <p>Cadastre-se agora e seja a babá perfeita para uma família</p>
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
      <input v-model="form.first_name" placeholder="Primeiro nome" autocomplete="first_name"/>
      <input v-model="form.last_name" placeholder="Sobrenome" autocomplete="last_name"/>
      <input v-model="form.email" placeholder="E-mail" type="email" autocomplete="email" />
      <input v-model="form.password" placeholder="Senha (mínimo 8 caracteres)" type="password" autocomplete="new-password" />
      <input v-model="form.telefone" placeholder="Número de telefone" type="tel" />
    </div>

    <!-- Dados profissionais -->
    <div class="card">
      <p class="titulo">Dados profissionais</p>
      <div class="icone">💼</div>
      <input v-model="form.dtnasc" placeholder="Data de nascimento" type="date" />
      <input v-model="form.experiencia_anos" placeholder="Anos de experiência" type="number" min="0" />
      <input v-model="form.valor_hora" placeholder="Valor por hora (R$)" type="number" min="0" step="0.01" />
      <input v-model="form.formacao" placeholder="Formação / Educação" />
      <input v-model="form.habilidades" placeholder="Habilidades (ex: primeiros socorros, música...)" />
    </div>

    <!-- Sobre você -->
    <div class="card">
      <p class="titulo">Sobre você</p>
      <div class="icone">📝</div>
      <textarea v-model="form.sobre" placeholder="Conte mais sobre você para as famílias..." rows="4" />
    </div>

    <button class="btn-cadastrar" @click="cadastrar" :disabled="carregando">
      {{ carregando ? 'Cadastrando...' : 'Cadastrar babá' }}
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
.hero p {
  font-size: 14px;
  opacity: 0.9;
}
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
  margin-bottom: 4px;
}
input, textarea {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  resize: vertical;
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