<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { createBaba } from '@/api/babaApi'
import api from '@/api/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  first_name: '',
  last_name: '',
  telefone: '',
  experiencia_anos: 0,
  descricao: '',
  disponivel: true,
  valor_hora: '',
  habilidades: '',
  dtnasc: '',
  formacao: '',
  sobre: '',
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

    await createBaba({
      usuario: usuario.id,
      experiencia_anos: form.value.experiencia_anos,
      descricao: form.value.descricao,
      disponivel: form.value.disponivel,
      valor_hora: form.value.valor_hora || null,
      habilidades: form.value.habilidades,
      dtnasc: form.value.dtnasc || null,
      formacao: form.value.formacao,
      sobre: form.value.sobre,
    })

    authStore.setUsuario({
      ...usuario,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      telefone: form.value.telefone,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/home-baba')
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
      <p>Conte-nos mais sobre você para que as famílias possam te encontrar</p>
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

      <input
        v-model="form.dtnasc"
        type="date"
        placeholder="Data de nascimento"
      />

      <p class="titulo">Sobre sua experiência</p>

      <input
        v-model="form.formacao"
        type="text"
        placeholder="Formação (ex: Pedagogia, Enfermagem...)"
      />

      <div class="linha">
        <input
          v-model.number="form.experiencia_anos"
          type="number"
          placeholder="Anos de experiência"
          min="0"
        />
        <input
          v-model="form.valor_hora"
          type="number"
          placeholder="Valor/hora (R$)"
          min="0"
          step="0.50"
        />
      </div>

      <input
        v-model="form.habilidades"
        type="text"
        placeholder="Habilidades (ex: Primeiro socorro, Música...)"
      />

      <textarea
        v-model="form.descricao"
        placeholder="Breve descrição sobre você"
        rows="2"
      ></textarea>

      <textarea
        v-model="form.sobre"
        placeholder="Conte mais sobre sua experiência com crianças"
        rows="3"
      ></textarea>

      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="form.disponivel"
        />
        Disponível para novos agendamentos
      </label>

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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #F6339A;
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
