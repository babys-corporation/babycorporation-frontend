<template>
  <!-- Mensagem de sucesso -->
  <div v-if="sucesso" class="card sucesso">
     Cadastro realizado! Entrando automaticamente...
  </div>

  <!-- Mensagem de erro -->
  <div v-if="erro" class="card erro">
    {{ erro }}
  </div>

  <!-- Dados de acesso -->
  <div class="card">
    <p class="titulo">Criar conta</p>

    <div class="icone">imagem</div>

    <!-- E-mail -->
    <input
      v-model="form.email"
      placeholder="E-mail"
      type="email"
      autocomplete="email"
      :disabled="carregando"
    />

    <!-- Senha -->
    <input
      v-model="form.password"
      placeholder="Senha (mínimo 8 caracteres)"
      type="password"
      autocomplete="new-password"
      minlength="8"
      :disabled="carregando"
    />

    <!-- Tipo de usuário -->
    <label for="tipo">Tipo de usuário:</label>

    <select
      id="tipo"
      v-model="form.tipo"
      :disabled="carregando"
    >
      <option value="" disabled>
        Selecione o tipo de usuário
      </option>

      <option value="PAI">
        Responsável
      </option>

      <option value="BABA">
        Babá
      </option>
    </select>

    <!-- Confirmar senha -->
    <input
      v-model="form.confirmPassword"
      placeholder="Confirme sua senha"
      type="password"
      autocomplete="new-password"
      minlength="8"
      :disabled="carregando"
    />

    <!-- Botão -->
    <button
      class="btn-cadastrar"
      @click="cadastrar"
      :disabled="carregando"
    >
      {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
    </button>
  </div>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, accessTokenRequest } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  tipo: ''
})

const sucesso = ref(false)
const erro = ref('')
const carregando = ref(false)

async function cadastrar() {
  erro.value = ''
  sucesso.value = false

  if (!form.email) {
    erro.value = 'Digite seu e-mail.'
    return
  }

  if (!form.password) {
    erro.value = 'Digite uma senha.'
    return
  }

  if (form.password.length < 8) {
    erro.value = 'A senha deve ter pelo menos 8 caracteres.'
    return
  }

  if (form.password !== form.confirmPassword) {
    erro.value = 'As senhas não são iguais.'
    return
  }

  if (!form.tipo) {
    erro.value = 'Selecione o tipo de usuário.'
    return
  }

  carregando.value = true

  try {
    await createUser({
      email: form.email,
      password: form.password,
      tipo: form.tipo,
    })

    const { data: tokens } = await accessTokenRequest({
      email: form.email,
      password: form.password,
    })

    authStore.setTokens(tokens.access, tokens.refresh)

    const { data: usuario } = await api.get('/usuarios/me/', {
      headers: {
        Authorization: `Bearer ${tokens.access}`
      }
    })

    authStore.setUsuario(usuario)

    sucesso.value = true

    setTimeout(() => {
      if (usuario.tipo?.toUpperCase() === 'BABA') {
        router.push('/home-baba')
      } else {
        router.push('/home-familia')
      }
    }, 1500)

  } catch (e) {
    const data = e.response?.data

    if (data?.email) {
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


<style scoped>

.card {
  width: 100%;
  max-width: 400px;
  margin: 15px auto;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.titulo {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.icone {
  text-align: center;
  font-size: 45px;
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
}

label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}

.btn-cadastrar {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.btn-cadastrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sucesso {
  text-align: center;
}

.erro {
  text-align: center;
}

</style>
