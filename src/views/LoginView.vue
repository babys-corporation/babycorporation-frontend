<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { accessTokenRequest, meRequest } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import api from '../api/config'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const erro = ref('')
const carregando = ref(false)
const mostrarSenha = ref(false)

const entrar = async () => {
  erro.value = ''
  carregando.value = true
  try {
    const { data: tokens } = await accessTokenRequest({
      username: form.value.username,
      password: form.value.password
    })
    authStore.setTokens(tokens.access, tokens.refresh)

    const { data: usuario } = await api.get('/usuarios/me/', {
      headers: { Authorization: `Bearer ${tokens.access}` }
    })
    authStore.setUsuario(usuario)

    if (usuario.tipo === 'BABA') {
      router.push('/home-baba')
    } else if (usuario.tipo === 'PAI') {
      router.push('/home-familia')
    } else {
      router.push('/')
    }
  } catch (e: any) {
    const status = e.response?.status
    if (status === 401) {
      erro.value = 'Usuário ou senha inválidos.'
    } else {
      erro.value = e.response?.data?.detail || 'Erro ao entrar. Tente novamente.'
    }
  } finally {
    carregando.value = false
  }
}

const irParaCadastro = () => {
  router.push('/cadastro')
}
</script>

<template>
  <div class="pagina">
    <div class="hero">
      <div class="logo">👶</div>
      <h1>Bem-vindo de volta!</h1>
      <p>Entre na sua conta e encontre a babá ideal</p>
    </div>

    <div v-if="erro" class="card erro">
      ⚠️ {{ erro }}
    </div>

    <div class="card">
      <p class="titulo">Entrar na conta</p>
      <div class="icone">🔐</div>

      <div class="campo">
        <input
          v-model="form.username"
          placeholder="Nome de usuário"
          autocomplete="username"
          @keyup.enter="entrar"
        />
      </div>

      <div class="campo campo-senha">
        <input
          v-model="form.password"
          :type="mostrarSenha ? 'text' : 'password'"
          placeholder="Senha"
          autocomplete="current-password"
          @keyup.enter="entrar"
        />
        <button
          class="toggle-senha"
          type="button"
          @click="mostrarSenha = !mostrarSenha"
          :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
        >
          {{ mostrarSenha ? '🙈' : '👁️' }}
        </button>
      </div>

      <button class="btn-link" type="button">
        Esqueci minha senha
      </button>
    </div>

    <button class="btn-entrar" @click="entrar" :disabled="carregando">
      {{ carregando ? 'Entrando...' : 'Entrar' }}
    </button>

    <div class="rodape">
      <p>Não tem uma conta?</p>
      <button class="btn-cadastro" type="button" @click="irParaCadastro">
        Criar conta gratuita
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  padding: 40px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  text-align: center;
  color: white;
  padding: 8px 0 4px;
}

.logo {
  font-size: 48px;
  margin-bottom: 12px;
}

.hero h1 {
  font-size: 28px;
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
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.titulo {
  font-weight: bold;
  color: #F6339A;
  text-align: center;
  font-size: 16px;
  margin: 0;
}

.icone {
  font-size: 32px;
  text-align: center;
}

.campo {
  position: relative;
  display: flex;
  align-items: center;
}

.campo input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.campo-senha input {
  padding-right: 44px;
}

.toggle-senha {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  line-height: 1;
}

.btn-link {
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 13px;
  cursor: pointer;
  text-align: right;
  padding: 0;
  align-self: flex-end;
  text-decoration: underline;
}

.btn-entrar {
  background: white;
  color: #F6339A;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;
}

.btn-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-entrar:not(:disabled):active {
  opacity: 0.85;
}

.rodape {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rodape p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  margin: 0;
}

.btn-cadastro {
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cadastro:hover {
  background: rgba(255, 255, 255, 0.15);
}

.erro {
  background: #fee2e2;
  color: #991b1b;
  text-align: center;
  padding: 14px;
  border-radius: 16px;
}
</style>