<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, TipoUsuario } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  telefone: '',
  cep: '',
})

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const cepValido = (cep: string) => /^\d{5}-?\d{3}$/.test(cep)

// Salva rascunho no localStorage (sem a senha, por segurança)
onMounted(() => {
  const dadosSalvos = localStorage.getItem('rascunho_cadastro_responsavel')
  if (dadosSalvos) {
    form.value = { ...form.value, ...JSON.parse(dadosSalvos) }
  }
})

watch(form, (novoValor) => {
  const { password, ...rascunho } = novoValor
  localStorage.setItem('rascunho_cadastro_responsavel', JSON.stringify(rascunho))
}, { deep: true })

const cadastrar = async () => {
  erro.value = ''

  // Validação do CEP antes de qualquer chamada à API
  if (form.value.cep && !cepValido(form.value.cep)) {
    erro.value = 'CEP inválido. Use o formato 00000-000.'
    return
  }

  carregando.value = true

  try {
    // 1. Cria o usuário
    const { data: tokens } = await createUser({
      username: form.value.username,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      tipo: TipoUsuario.PAI,
    })

    // 2. Salva os tokens no store
    authStore.setTokens(tokens.access, tokens.refresh)

    const authHeaders = { headers: { Authorization: `Bearer ${tokens.access}` } }

    // 3. Cria o perfil de responsável
    await api.post('/perfil-pai/', {}, authHeaders)

    // 4. Atualiza telefone e CEP no usuário (campos existem em Usuario, não em PerfilPai)
    if (form.value.telefone || form.value.cep) {
      const payloadUsuario: Record<string, string> = {}
      if (form.value.telefone) payloadUsuario.telefone = form.value.telefone
      if (form.value.cep) payloadUsuario.cep = form.value.cep

      if (!tokens.id) {
        console.error('Resposta de createUser não contém "id" do usuário.')
      } else {
        await api.patch(`/usuarios/${tokens.id}/`, payloadUsuario, authHeaders)
      }
    }

    // 5. Limpa rascunho e redireciona
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
    } else if (data?.cep) {
      erro.value = Array.isArray(data.cep) ? data.cep[0] : 'CEP inválido.'
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
      <input v-model="form.email" placeholder="E-mail" type="email" autocomplete="email" />
      <input v-model="form.password" placeholder="Senha (mínimo 8 caracteres)" type="password"
        autocomplete="new-password" />

        <label for="tipo">Tipo de usuário:</label>

<select id="tipo" name="tipo">
    <option value="PAI">Pai</option>
    <option value="BABA">Babá</option>
</select>
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
}

input,
select {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
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

label{
  color: #F6339A;
  font-weight: bold;
}
select{
  color: #8b5cf6;

}
</style>