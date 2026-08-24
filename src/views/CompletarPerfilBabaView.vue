<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  primeiro_nome: '',
  ultimo_nome: '',
  cpf: '',
  telefone: '',
  cep: '',
  cidade: '',
  bairro: '',
  experiencia_anos: null as number | null,
  descricao: '',
  disponivel: true,
  valor_hora: '' as string | number,
  habilidades: '',
  dtnasc: '',
  formacao: '',
})

const fotoAtual = ref<string>('')
const novaFoto = ref<File | null>(null)
const carregandoDados = ref(true)
const buscandoCep = ref(false)
const erroCep = ref('')
const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)

const nomeFotoNova = computed(() => novaFoto.value?.name ?? '')

function aoSelecionarFoto(e: Event) {
  const alvo = e.target as HTMLInputElement
  novaFoto.value = alvo.files?.[0] ?? null
}

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
  } catch {
    form.value.cidade = ''
    form.value.bairro = ''
    erroCep.value = 'CEP não encontrado. Verifique e tente novamente.'
  } finally {
    buscandoCep.value = false
  }
}

async function carregarDadosExistentes() {
  try {
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    form.value.primeiro_nome = usuario.primeiro_nome ?? ''
    form.value.ultimo_nome = usuario.ultimo_nome ?? ''
    form.value.cpf = usuario.cpf ?? ''
    form.value.telefone = usuario.telefone ?? ''
    form.value.cep = usuario.cep ?? ''
    form.value.cidade = usuario.cidade ?? ''
    form.value.bairro = usuario.bairro ?? ''
    fotoAtual.value = usuario.foto?.url ?? ''

    const { data: perfil } = await api.get('/perfil-baba/me/')
    form.value.experiencia_anos = perfil.experiencia_anos ?? null
    form.value.descricao = perfil.descricao ?? ''
    form.value.disponivel = perfil.disponivel ?? true
    form.value.valor_hora = perfil.valor_hora ?? ''
    form.value.habilidades = perfil.habilidades ?? ''
    form.value.dtnasc = perfil.dtnasc ?? ''
    form.value.formacao = perfil.formacao ?? ''
  } catch (e) {
    console.error(e)
    erro.value = 'Erro ao carregar seus dados.'
  } finally {
    carregandoDados.value = false
  }
}

onMounted(carregarDadosExistentes)

async function enviarFoto(): Promise<string | undefined> {
  if (!novaFoto.value) return undefined

  const fd = new FormData()
  fd.append('file', novaFoto.value)

  const { data } = await api.post('/media/images/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.attachment_key
}

function mensagemDeErro(data: any): string {
  if (!data) return 'Erro ao salvar. Tente novamente.'

  if (data.cpf) return Array.isArray(data.cpf) ? data.cpf[0] : String(data.cpf)
  if (data.telefone)
    return Array.isArray(data.telefone) ? data.telefone[0] : String(data.telefone)

  for (const campo of Object.keys(data)) {
    const valor = data[campo]
    if (Array.isArray(valor) && valor.length) return `${campo}: ${valor[0]}`
    if (typeof valor === 'string') return valor
  }

  return 'Erro ao salvar. Tente novamente.'
}

const salvar = async () => {
  erro.value = ''

  const cpfDigitos = form.value.cpf.replace(/\D/g, '')
  if (cpfDigitos && cpfDigitos.length !== 11) {
    erro.value = 'CPF deve conter 11 dígitos.'
    return
  }

  const usuario = authStore.usuario
  if (!usuario) {
    erro.value = 'Usuário não encontrado. Faça login novamente.'
    return
  }

  carregando.value = true

  try {
    const foto_attachment_key = await enviarFoto()

    await api.patch(`/usuarios/${usuario.id}/`, {
      primeiro_nome: form.value.primeiro_nome || null,
      ultimo_nome: form.value.ultimo_nome || null,
      cpf: cpfDigitos || null,
      telefone: form.value.telefone || null,
      cep: form.value.cep || null,
      cidade: form.value.cidade || null,
      bairro: form.value.bairro || null,
      ...(foto_attachment_key ? { foto_attachment_key } : {}),
    })

    await api.patch('/perfil-baba/me/', {
      experiencia_anos: form.value.experiencia_anos,
      descricao: form.value.descricao || null,
      disponivel: form.value.disponivel,
      valor_hora: form.value.valor_hora === '' ? null : String(form.value.valor_hora),
      habilidades: form.value.habilidades || null,
      dtnasc: form.value.dtnasc || null,
      formacao: form.value.formacao || null,
    })

    authStore.setUsuario({
      ...usuario,
      primeiro_nome: form.value.primeiro_nome,
      ultimo_nome: form.value.ultimo_nome,
      telefone: form.value.telefone,
    })

    sucesso.value = true

    setTimeout(() => {
      router.push('/home-baba')
    }, 1500)
  } catch (e: any) {
    console.error(e)
    erro.value = mensagemDeErro(e.response?.data)
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
      ✅ Perfil salvo! Redirecionando...
    </div>

    <div v-if="erro" class="card erro">
      ⚠️ {{ erro }}
    </div>

    <div v-if="carregandoDados" class="card">
      <p class="titulo">Carregando...</p>
    </div>

    <form v-else class="card" @submit.prevent="salvar">
      <p class="titulo">Foto e dados pessoais</p>

      <label class="campo-label" for="foto">Foto de perfil</label>
      <input
        id="foto"
        type="file"
        accept="image/jpeg,image/png"
        @change="aoSelecionarFoto"
      />
      <p v-if="nomeFotoNova" class="dica-arquivo">Nova foto: {{ nomeFotoNova }}</p>
      <img
        v-else-if="fotoAtual"
        :src="fotoAtual"
        alt="Foto atual"
        class="foto-atual"
      />

      <div class="linha">
        <input v-model="form.primeiro_nome" type="text" placeholder="Nome *" maxlength="30" required />
        <input v-model="form.ultimo_nome" type="text" placeholder="Sobrenome *" maxlength="30" required />
      </div>

      <input
        v-model="form.cpf"
        type="text"
        inputmode="numeric"
        placeholder="CPF (somente números) *"
        maxlength="14"
        required
      />

      <input v-model="form.telefone" type="tel" placeholder="Telefone (DD) 9XXXX-XXXX *" required />

      <input v-model="form.dtnasc" type="date" required />

      <input
        v-model="form.cep"
        type="text"
        inputmode="numeric"
        placeholder="CEP *"
        maxlength="9"
        required
        :disabled="buscandoCep"
        @change="buscarCep"
      />
      <p v-if="buscandoCep" class="dica-arquivo">Buscando endereço...</p>
      <p v-else-if="erroCep" class="dica-cep-erro">{{ erroCep }}</p>
      <p v-else class="dica-arquivo">A cidade e o bairro são preenchidos automaticamente pelo CEP.</p>

      <p class="titulo">Sobre sua experiência</p>

      <input
        v-model="form.formacao"
        type="text"
        placeholder="Formação (ex: Pedagogia, Enfermagem...) *"
        required
      />

      <div class="linha">
        <input
          v-model.number="form.experiencia_anos"
          type="number"
          placeholder="Anos de experiência"
          min="0"
          required
        />
        <input
          v-model="form.valor_hora"
          type="number"
          placeholder="Valor/hora (R$)"
          min="0"
          step="0.50"
          required
        />
      </div>

      <input
        v-model="form.habilidades"
        type="text"
        placeholder="Habilidades (ex: Primeiros socorros, Música...) *"
        required
      />

      <textarea
        v-model="form.descricao"
        placeholder="Breve descrição sobre você e sua experiência com crianças *"
        rows="3"
        required
      ></textarea>

      <label class="checkbox-label">
        <input type="checkbox" v-model="form.disponivel" />
        Disponível para novos agendamentos
      </label>

      <button class="btn-salvar" type="submit" :disabled="carregando">
        {{ carregando ? 'Salvando...' : 'Salvar perfil' }}
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

.campo-label {
  color: #F6339A;
  font-weight: bold;
  font-size: 13px;
}

.linha {
  display: flex;
  gap: 10px;
}

.linha input {
  flex: 1;
  min-width: 0;
}

.dica-arquivo {
  font-size: 12px;
  color: #6b7280;
}

.dica-cep-erro {
  font-size: 12px;
  color: #B91C1C;
}

.foto-atual {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
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

.btn-salvar:hover:not(:disabled) {
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
