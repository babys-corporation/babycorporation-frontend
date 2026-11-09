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
  cpf: '',
  cep: '',
  numero_filhos: 1,
})

const fotoFile = ref<File | null>(null)
const previewFoto = ref<string | null>(null)

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

function onFotoChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    fotoFile.value = file
    previewFoto.value = URL.createObjectURL(file)
  }
}

const completar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    let usuario = authStore.usuario
    if (!usuario) {
      try {
        const res = await import('@/api/auth')
        const { data } = await res.meRequest()
        authStore.setUsuario(data)
        usuario = data
      } catch {
        erro.value = 'Usuário não encontrado. Faça login novamente.'
        return
      }
    }

    let foto_attachment_key = null

    if (fotoFile.value) {
      const fdImg = new FormData()
      fdImg.append('file', fotoFile.value)

      // Usa a instância `api` (baseURL já inclui /api).
      // Não definir Content-Type: o axios coloca o boundary correto sozinho.
      const token = localStorage.getItem('access_token')
      const imgRes = await api.post('/media/images/', fdImg, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      foto_attachment_key = imgRes.data.attachment_key
    }

const payloadUsuario: any = {
  primeiro_nome: form.value.first_name,
  ultimo_nome: form.value.last_name,
  telefone: form.value.telefone.replace(/\D/g, ''),
  cpf: form.value.cpf.replace(/\D/g, ''),
  cep: form.value.cep.replace(/\D/g, ''),
}

    if (foto_attachment_key) {
      payloadUsuario.foto_attachment_key = foto_attachment_key
    }

    await api.patch(`/usuarios/${usuario.id}/`, payloadUsuario)

    try {
      await api.get('/perfil-pai/me/')
      await api.patch('/perfil-pai/me/', {
        numero_filhos: form.value.numero_filhos,
      })
    } catch {
      try {
        await responsavelStore.createResponsavel({
          usuario: usuario.id,
          numero_filhos: form.value.numero_filhos,
        })
      } catch (e: any) {
        const data = e.response?.data
        if (!(data?.detail && String(data.detail).includes('já possui'))) {
          throw e
        }
        await api.patch('/perfil-pai/me/', {
          numero_filhos: form.value.numero_filhos,
        })
      }
    }

    authStore.setUsuario({
      ...usuario,
      primeiro_nome: form.value.first_name,
      ultimo_nome: form.value.last_name,
      telefone: form.value.telefone,
      cpf: form.value.cpf,
      cep: form.value.cep,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/home-familia')
    }, 1500)
  } catch (e: any) {
    const data = e.response?.data
    console.error('COMPLETAR_PAI_ERRO:', e?.response?.status, data)
    let msg = 'Erro ao completar perfil. Tente novamente.'
    if (typeof data === 'string') {
      // Evita mostrar uma página HTML inteira (ex.: 404/500 do Django) no card de erro
      msg = data.trim().startsWith('<')
        ? 'Erro de comunicação com o servidor. Tente novamente.'
        : data.substring(0, 300)
    } else if (data?.detail) msg = data.detail
    else if (data?.usuario?.[0]) msg = data.usuario[0]
    else if (data?.non_field_errors?.[0]) msg = data.non_field_errors[0]
    else if (Object.keys(data || {}).length) {
      const k = Object.keys(data)[0] as string
      const v = data[k]
      msg = Array.isArray(v) ? v[0] : String(v)
    }
    erro.value = msg
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

      <div class="foto-upload">
        <label class="foto-label">
          <div class="foto-preview">
            <img v-if="previewFoto" :src="previewFoto" alt="Foto" />
            <span v-else>📷 Adicionar foto</span>
          </div>
          <input type="file" accept="image/*" @change="onFotoChange" required />
        </label>
      </div>

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
        v-model="form.cpf"
        type="text"
        placeholder="CPF"
        required
      />

      <input
        v-model="form.cep"
        type="text"
        placeholder="CEP"
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
.foto-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.foto-label {
  cursor: pointer;
}

.foto-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.foto-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-preview span {
  font-size: 12px;
  text-align: center;
  color: #6b7280;
  padding: 8px;
}

.foto-label input {
  display: none;
}
</style>