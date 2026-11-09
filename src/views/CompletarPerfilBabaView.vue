<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { meRequest } from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const buscandoCep = ref(false)
const erroCep = ref('')
const bairroManual = ref(false)

async function buscarCep() {
  erroCep.value = ''

  const digitos = form.value.cep.replace(/\D/g, '')
  if (digitos.length !== 8) return

  buscandoCep.value = true

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
    const dados = await res.json()

    if (!res.ok || dados.erro) throw new Error('CEP não encontrado')

    form.value.cidade = dados.localidade ?? ''
    form.value.bairro = dados.bairro ?? ''
    // CEP de cidade pequena pode vir sem bairro: deixa a pessoa digitar
    bairroManual.value = !form.value.bairro
  } catch {
    form.value.cidade = ''
    form.value.bairro = ''
    bairroManual.value = false
    erroCep.value = 'CEP não encontrado. Verifique e tente novamente.'
  } finally {
    buscandoCep.value = false
  }
}

const form = ref({
  first_name: '',
  last_name: '',
  telefone: '',
  cpf: '',
  cep: '',
  cidade: '',
  bairro: '',
  experiencia_anos: 0,
  descricao: '',
  disponivel: true,
  valor_hora: '',
  chave_pix: '',
  habilidades: '',
  dtnasc: '',
  formacao: '',
  sobre: '',
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
        const { data } = await meRequest()
        authStore.setUsuario(data)
        usuario = data
      } catch {
        erro.value = 'Usuário não encontrado. Faça login novamente.'
        return
      }
    }

    if (!form.value.cidade) {
      await buscarCep()
    }

    if (!form.value.cidade || !form.value.bairro) {
      erro.value = erroCep.value || 'Informe um CEP válido para preencher cidade e bairro.'
      return
    }

    let foto_attachment_key = null

    if (fotoFile.value) {
      const fdImg = new FormData()
      fdImg.append('file', fotoFile.value)
      // `api` já tem a baseURL com /api e coloca o token sozinha.
      // Não definir Content-Type: o axios monta o boundary do multipart.
      const imgRes = await api.post('/media/images/', fdImg)
      foto_attachment_key = imgRes.data.attachment_key
    }

    const payloadUsuario: any = {
      primeiro_nome: form.value.first_name,
      ultimo_nome: form.value.last_name,
      telefone: form.value.telefone,
      cpf: form.value.cpf,
      cep: form.value.cep,
      cidade: form.value.cidade,
      bairro: form.value.bairro,
    }

    if (foto_attachment_key) {
      payloadUsuario.foto_attachment_key = foto_attachment_key
    }

    await api.patch(`/usuarios/${usuario.id}/`, payloadUsuario)

    // O PerfilBaba já é criado automaticamente pelo signal no backend,
    // portanto atualizamos em vez de criar um novo.
    await api.patch('/perfil-baba/me/', {
      experiencia_anos: form.value.experiencia_anos,
      descricao: form.value.descricao,
      disponivel: form.value.disponivel,
      valor_hora: form.value.valor_hora || null,
      chave_pix: form.value.chave_pix || null,
      habilidades: form.value.habilidades,
      dtnasc: form.value.dtnasc || null,
      formacao: form.value.formacao,
      sobre: form.value.sobre,
    })

    authStore.setUsuario({
      ...usuario,
      primeiro_nome: form.value.first_name,
      ultimo_nome: form.value.last_name,
      telefone: form.value.telefone,
      cpf: form.value.cpf,
      cep: form.value.cep,
      cidade: form.value.cidade,
      bairro: form.value.bairro,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/home-baba')
    }, 1500)
  } catch (e: any) {
    const data = e.response?.data
    console.error('COMPLETAR_ERRO:', e?.response?.status, data)
    let msg = 'Erro ao completar perfil. Tente novamente.'
    if (typeof data === 'string') {
      // Evita mostrar uma página HTML inteira (ex.: 404/500 do Django) no card de erro
      msg = data.trim().startsWith('<')
        ? 'Erro de comunicação com o servidor. Tente novamente.'
        : data.substring(0, 200)
    }
    else if (data?.detail) msg = data.detail
    else if (data?.usuario?.[0]) msg = data.usuario[0]
    else if (data?.non_field_errors?.[0]) msg = data.non_field_errors[0]
    else if (Object.keys(data || {}).length) {
      const k = Object.keys(data)[0] as string
      msg = Array.isArray(data[k]) ? data[k][0] : String(data[k])
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
        inputmode="numeric"
        placeholder="CEP"
        maxlength="9"
        required
        :disabled="buscandoCep"
        @change="buscarCep"
      />
      <p v-if="buscandoCep" class="dica-cep">Buscando endereço...</p>
      <p v-else-if="erroCep" class="dica-cep erro-cep">{{ erroCep }}</p>
      <p v-else-if="form.cidade" class="dica-cep">
        📍 {{ [form.cidade, form.bairro].filter(Boolean).join(', ') }}
      </p>
      <p v-else class="dica-cep">
        A cidade e o bairro são preenchidos automaticamente pelo CEP.
      </p>

      <input
        v-if="bairroManual"
        v-model="form.bairro"
        type="text"
        placeholder="Bairro (não encontrado pelo CEP)"
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
        v-model="form.chave_pix"
        type="text"
        placeholder="Chave Pix (CPF, e-mail, telefone ou aleatória)"
      />

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

.dica-cep {
  font-size: 12px;
  color: #6b7280;
  margin: -4px 0 0 4px;
}

.erro-cep {
  color: #b91c1c;
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
