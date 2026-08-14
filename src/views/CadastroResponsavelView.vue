```vue
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


// Router
const router = useRouter()


// Formulário
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  tipo: ''
})


// Estados da tela
const sucesso = ref(false)
const erro = ref('')
const carregando = ref(false)


// URL da API
const API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || 'http://127.0.0.1:8000'

// Função de cadastro
async function cadastrar() {
  // Limpa mensagens anteriores
  erro.value = ''
  sucesso.value = false


  // Verifica e-mail
  if (!form.email) {
    erro.value = 'Digite seu e-mail.'
    return
  }


  // Verifica senha
  if (!form.password) {
    erro.value = 'Digite uma senha.'
    return
  }


  // Verifica tamanho da senha
  if (form.password.length < 8) {
    erro.value = 'A senha deve ter pelo menos 8 caracteres.'
    return
  }


  // Verifica confirmação da senha
  if (form.password !== form.confirmPassword) {
    erro.value = 'As senhas não são iguais.'
    return
  }


  // Verifica tipo de usuário
  if (!form.tipo) {
    erro.value = 'Selecione o tipo de usuário.'
    return
  }


  // Começa carregamento
  carregando.value = true


  try {
    const resposta = await fetch(
    `${API_URL}/api/registro/`,
      {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email: form.email,
          password: form.password,
          tipo: form.tipo
        })
      }
    )


    // Tenta obter a resposta da API
    const dados = await resposta.json()

console.log('Status:', resposta.status)
console.log('Resposta do Django:', dados)

    // Se o backend retornar erro
    if (!resposta.ok) {
      if (dados.detail) {
        erro.value = dados.detail
      } else {
        erro.value = 'Não foi possível realizar o cadastro.'
      }

      return
    }


    // Cadastro realizado
    sucesso.value = true


    /*
     * Login automático
     *
     * Caso o backend retorne um token:
     */
    if (dados.access) {
      localStorage.setItem('access_token', dados.access)
    }

    if (dados.refresh) {
      localStorage.setItem('refresh_token', dados.refresh)
    }

    if (dados.token) {
      localStorage.setItem('token', dados.token)
    }


    // Aguarda um pouco e entra na página inicial
    setTimeout(() => {
      router.push('/')
    }, 1000)


  } catch (error) {
    console.error('Erro no cadastro:', error)

    erro.value =
      'Não foi possível conectar ao servidor. Verifique se o Django está rodando.'

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
```
