<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, TipoUsuario } from '@/api/auth'

const router = useRouter()

const form = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  experiencia_anos: '',
  descricao: '',
})

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const cadastrar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    // Cria o usuário.
    // O PerfilBaba é criado automaticamente pelo signal do Django.
    await createUser({
      username: form.value.username,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      tipo: TipoUsuario.BABA,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/login')
    }, 1500)

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

    <div class="card">
      <p class="titulo">Criar conta</p>

      <div class="icone">👤</div>

      <input
        v-model="form.email"
        type="email"
        placeholder="E-mail"
        autocomplete="email"
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Senha (mínimo 8 caracteres)"
        autocomplete="new-password"
      />

      <label for="tipo">Tipo de usuário:</label>

<select id="tipo" name="tipo">
    <option value="PAI">Pai</option>
    <option value="BABA">Babá</option>
</select>
      

    </div>

    
    

    <button
      class="btn-cadastrar"
      @click="cadastrar"
      :disabled="carregando"
    >
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
  opacity: .9;
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
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #F6339A;
}

.icone {
  text-align: center;
  font-size: 32px;
}

input,
textarea {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.btn-cadastrar {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #F6339A;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cadastrar:disabled {
  opacity: .6;
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