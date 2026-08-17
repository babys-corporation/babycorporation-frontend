<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useResponsavelStore } from '@/stores/responsavel'
import api from '@/api/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const responsavelStore = useResponsavelStore()

const form = ref({
  first_name: '',
  last_name: '',
  telefone: '',
  numero_filhos: 1,
  endereco: '',
})

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const completar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    const usuario = authStore.usuario
    if (!usuario) {
      erro.value = 'Usuário não encontrado. Faça login novamente.'
      return
    }

    await api.patch(`/usuarios/${usuario.id}/`, {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      telefone: form.value.telefone,
    })

    await responsavelStore.createResponsavel({
      usuario: usuario.id,
      numero_filhos: form.value.numero_filhos,
      endereco: form.value.endereco,
    })

    authStore.setUsuario({
      ...usuario,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      telefone: form.value.telefone,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/home-familia')
    }, 1500)
  } catch (e: any) {
    const data = e.response?.data
    erro.value = data?.detail || data?.usuario?.[0] || 'Erro ao completar perfil. Tente novamente.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina">
    <div class="hero">
      <h1>Complete seu perfil</h1>
      <p>Conte-nos sobre sua família para encontrar a babá ideal</p>
    </div>

    <div v-if="sucesso" class="card sucesso">
      ✅ Perfil completado! Redirecionando...
    </div>

    <div v-if="erro" class="card erro">
      ⚠️ {{ erro }}
    </div>

    <form class="card" @submit.prevent="completar">
      <p class="titulo">Dados pessoais</p>

      <div class="linha">
        <input
          v-model="form.first_name"
          type="text"
          placeholder="Nome"
          required
        />
        <input
          v-model="form.last_name"
          type="text"
          placeholder="Sobrenome"
          required
        />
      </div>

      <input
        v-model="form.telefone"
        type="tel"
        placeholder="Telefone"
        required
      />

      <p class="titulo">Sua família</p>

      <div class="campo-filhos">
        <label class="label-filhos">Quantos filhos você tem?</label>
        <div class="controles-numero">
          <button
            type="button"
            class="btn-numero"
            @click="form.numero_filhos = Math.max(0, form.numero_filhos - 1)"
          >
            −
          </button>
          <span class="valor-numero">{{ form.numero_filhos }}</span>
          <button
            type="button"
            class="btn-numero"
            @click="form.numero_filhos++"
          >
            +
          </button>
        </div>
      </div>

      <input
        v-model="form.endereco"
        type="text"
        placeholder="Endereço completo"
        required
      />

      <button
        class="btn-salvar"
        type="submit"
        :disabled="carregando"
      >
        {{ carregando ? 'Salvando...' : 'Completar perfil' }}
      </button>
    </form>
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
  font-size: 28px;
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
  margin-top: 8px;
}

.linha {
  display: flex;
  gap: 10px;
}

.linha input {
  flex: 1;
}

input {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.campo-filhos {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-filhos {
  color: #6B7280;
  font-size: 14px;
}

.controles-numero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.btn-numero {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #F6339A;
  background: white;
  color: #F6339A;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.btn-numero:hover {
  background: #F6339A;
  color: white;
}

.valor-numero {
  font-size: 24px;
  font-weight: bold;
  color: #F6339A;
  min-width: 40px;
  text-align: center;
}

.btn-salvar {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #F6339A;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #F6339A;
  transition: background 0.2s, color 0.2s;
}

.btn-salvar:hover {
  background: #F6339A;
  color: white;
}

.btn-salvar:disabled {
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
