<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useResponsavelStore } from '@/stores/responsavel'
import api from '@/api/config'
import { meRequest } from '@/api/auth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const responsavelStore = useResponsavelStore()

// ─── Formulário: informações do usuário comum ────────────
const form = ref({
  primeiro_nome: '',
  ultimo_nome: '',
  cpf: '',
  telefone: '',
  cep: '',
})

// ─── Foto ────────────────────────────────────────────────
const fotoAtual = ref('')
const fotoPreview = ref('')
const arquivoFoto = ref<File | null>(null)

function aoEscolherFoto(evento: Event) {
  const input = evento.target as HTMLInputElement
  const arquivo = input.files?.[0] ?? null

  if (arquivoFoto.value && fotoPreview.value !== fotoAtual.value) {
    URL.revokeObjectURL(fotoPreview.value)
  }

  arquivoFoto.value = arquivo
  fotoPreview.value = arquivo ? URL.createObjectURL(arquivo) : fotoAtual.value
}

// ─── Formulário: quantidade de filhos ────────────────────
const numeroFilhos = ref(1)
const perfilId = ref<number | null>(null)

const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)
const carregandoDados = ref(true)

// Carrega dados existentes do usuário/perfil/filhos para preencher o formulário
onMounted(async () => {
  try {
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    form.value.primeiro_nome = usuario.primeiro_nome || ''
    form.value.ultimo_nome = usuario.ultimo_nome || ''
    form.value.cpf = usuario.cpf || ''
    form.value.telefone = usuario.telefone || ''
    form.value.cep = usuario.cep || ''
    fotoAtual.value = usuario.foto?.url || ''
    fotoPreview.value = fotoAtual.value

    // Perfil já existente? (404 => ainda não tem)
    try {
      const { data: perfil } = await api.get('/perfil-pai/me/')
      perfilId.value = perfil.id
      numeroFilhos.value = perfil.numero_filhos ?? 1
    } catch {
      perfilId.value = null
    }
  } catch (e) {
    console.error(e)
    erro.value = 'Não foi possível carregar seus dados.'
  } finally {
    carregandoDados.value = false
  }
})

// ─── Validações ──────────────────────────────────────────
function cpfValido(valor: string): boolean {
  const cpf = valor.replace(/\D/g, '')

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const digito = (trecho: string, pesoInicial: number): number => {
    let soma = 0
    for (let i = 0; i < trecho.length; i++) {
      soma += Number(trecho[i]) * (pesoInicial - i)
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const dv1 = digito(cpf.slice(0, 9), 10)
  const dv2 = digito(cpf.slice(0, 10), 11)

  return dv1 === Number(cpf[9]) && dv2 === Number(cpf[10])
}

// ─── Envio ───────────────────────────────────────────────
const completar = async () => {
  erro.value = ''
  carregando.value = true

  try {
    const usuario = authStore.usuario
    if (!usuario) {
      erro.value = 'Usuário não encontrado. Faça login novamente.'
      return
    }

    // Foto é obrigatória (a menos que já tenha uma)
    if (!arquivoFoto.value && !fotoAtual.value) {
      erro.value = 'Envie uma foto de perfil.'
      return
    }

    // CPF: se preenchido, precisa ser válido
    const cpfDigitos = form.value.cpf.replace(/\D/g, '')
    if (cpfDigitos && !cpfValido(cpfDigitos)) {
      erro.value = 'CPF inválido — confira os números digitados.'
      return
    }

    // Telefone: DDD + número (10 ou 11 dígitos, com ou sem +55)
    let telefoneDigitos = form.value.telefone.replace(/\D/g, '')
    if (telefoneDigitos.startsWith('55')) telefoneDigitos = telefoneDigitos.slice(2)
    if (telefoneDigitos && ![10, 11].includes(telefoneDigitos.length)) {
      erro.value = 'Telefone inválido — use o formato (DD) 9XXXX-XXXX.'
      return
    }

    // 1. Upload da foto, se uma nova foi escolhida
    let fotoAttachmentKey: string | undefined
    if (arquivoFoto.value) {
      const formData = new FormData()
      formData.append('file', arquivoFoto.value)

      const { data: imagem } = await api.post('/media/images/', formData)
      fotoAttachmentKey = imagem.attachment_key
    }

    // 2. Informações do usuário comum (CPF/CEP vão só com dígitos,
    //    para nunca estourar o max_length do backend)
    const { data: usuarioAtualizado } = await api.patch(`/usuarios/${usuario.id}/`, {
      primeiro_nome: form.value.primeiro_nome,
      ultimo_nome: form.value.ultimo_nome,
      cpf: cpfDigitos || null,
      telefone: form.value.telefone,
      cep: form.value.cep.replace(/\D/g, '') || null,
      ...(fotoAttachmentKey ? { foto_attachment_key: fotoAttachmentKey } : {}),
    })

    // 3. Perfil do pai (cria ou atualiza)
    let perfil
    if (perfilId.value) {
      const response = await api.patch(`/perfil-pai/${perfilId.value}/`, {
        numero_filhos: numeroFilhos.value,
      })
      perfil = response.data
    } else {
      perfil = await responsavelStore.createResponsavel({
        usuario: usuario.id,
        numero_filhos: numeroFilhos.value,
      })
    }

    // Sincroniza o store para a home reagir (criação OU atualização)
    responsavelStore.responsavel = perfil

    // 4. Atualiza o usuário no store (a home detecta e vira modo completo)
    authStore.setUsuario(usuarioAtualizado ?? { ...usuario, ...form.value })

    sucesso.value = true

    setTimeout(() => {
      // Se o formulário está embutido na própria /home-familia, nada a redirecionar
      if (router.currentRoute.value.path !== '/home-familia') {
        router.push('/home-familia')
      }
    }, 1500)
  } catch (e: any) {
    const dados = e.response?.data
    let mensagem: string = dados?.detail || ''

    if (!mensagem && dados && typeof dados === 'object') {
      const primeiro = Object.values(dados)[0]
      mensagem = Array.isArray(primeiro) ? String(primeiro[0]) : String(primeiro ?? '')
    }

    erro.value = mensagem || 'Erro ao completar perfil. Tente novamente.'
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

    <div v-if="carregandoDados" class="card">
      Carregando seus dados...
    </div>

    <template v-else>
      <div v-if="sucesso" class="card sucesso">
        ✅ Perfil completado! Redirecionando...
      </div>

      <div v-if="erro" class="card erro">
        ⚠️ {{ erro }}
      </div>

      <form class="card" @submit.prevent="completar">

        <!-- Informações do usuário comum -->
        <p class="titulo">Dados pessoais</p>

        <div class="campo-foto">
          <label class="label-foto">Foto de perfil *</label>
          <img
            v-if="fotoPreview"
            :src="fotoPreview"
            alt="Foto de perfil"
            class="preview-foto"
          />
          <div v-else class="preview-foto preview-vazio">👤</div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="aoEscolherFoto"
          />
        </div>

        <div class="linha">
          <input
            v-model="form.primeiro_nome"
            type="text"
            placeholder="Nome"
            required
          />
          <input
            v-model="form.ultimo_nome"
            type="text"
            placeholder="Sobrenome"
            required
          />
        </div>

        <input
          v-model="form.cpf"
          type="text"
          maxlength="14"
          placeholder="CPF (000.000.000-00)"
        />

        <input
          v-model="form.telefone"
          type="tel"
          placeholder="Telefone"
          required
        />

        <input
          v-model="form.cep"
          type="text"
          placeholder="CEP"
        />

        <!-- Filhos -->
        <p class="titulo">Sua família</p>

        <div class="campo-filhos">
          <label class="label-filhos">Quantos filhos você tem?</label>
          <div class="controles-numero">
            <button
              type="button"
              class="btn-numero"
              @click="numeroFilhos = Math.max(0, numeroFilhos - 1)"
            >
              −
            </button>
            <span class="valor-numero">{{ numeroFilhos }}</span>
            <button
              type="button"
              class="btn-numero"
              @click="numeroFilhos++"
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
    </template>
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

.campo-foto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.label-foto {
  color: #6B7280;
  font-size: 14px;
}

.preview-foto {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
}

.preview-vazio {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  background: #F3F4F6;
}

.linha {
  display: flex;
  gap: 10px;
}

.linha input,
.linha select {
  flex: 1;
  min-width: 0;
}

input,
.select-genero {
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
