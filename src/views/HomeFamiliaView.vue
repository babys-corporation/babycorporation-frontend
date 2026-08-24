<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useResponsavelStore } from '@/stores/responsavel'
import { meRequest } from '@/api/auth'
import api from '@/api/config'
import CompletarPerfilResponsavel from './CompletarPerfilResponsavelView.vue'

const authStore = useAuthStore()
const responsavelStore = useResponsavelStore()

const carregando = ref(true)
const erro = ref('')

const usuario = ref<any>(null)
const perfilPai = ref<any>(null)

// Perfil completo: tem PerfilPai E os dados essenciais do usuário preenchidos
const perfilCompleto = computed(() => {
  const u = usuario.value
  if (!u || !perfilPai.value) return false

  return Boolean(
    String(u.primeiro_nome || '').trim() &&
    String(u.ultimo_nome || '').trim() &&
    String(u.telefone || '').trim() &&
    u.foto &&
    perfilPai.value.numero_filhos !== null &&
    perfilPai.value.numero_filhos !== undefined
  )
})

// Completo: primeiro nome + último nome | Incompleto: e-mail antes do @
const nomeExibido = computed(() => {
  const u = usuario.value ?? {}

  if (perfilCompleto.value) {
    return [u.primeiro_nome, u.ultimo_nome]
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  return String(u.email || '').split('@')[0] || 'Responsável'
})

const quantidadeFilhos = computed(() => perfilPai.value?.numero_filhos ?? 0)

// Quando o formulário embutido cria o perfil, troca para o modo completo na hora
watch(() => responsavelStore.responsavel, async (novo) => {
  if (!novo) return
  perfilPai.value = novo

  try {
    const { data } = await meRequest()
    usuario.value = data
    authStore.setUsuario(data)
  } catch {
    // mantém os dados atuais
  }
})

async function carregarDados() {
  try {
    carregando.value = true
    erro.value = ''

    // Busca o usuário logado
    const { data } = await meRequest()
    usuario.value = data
    authStore.setUsuario(data)

    // Busca o perfil do pai logado (404 => ainda não completou o perfil)
    const { data: perfil } = await api.get('/perfil-pai/me/')
    perfilPai.value = perfil
  } catch (err: any) {
    if (err?.response?.status === 404) {
      perfilPai.value = null
    } else {
      console.error(err)
      erro.value = 'Erro ao carregar os dados.'
    }
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <div class="pagina">

    <div v-if="carregando" class="card">
      <h3>Carregando...</h3>
    </div>

    <div v-else-if="erro" class="card erro">
      {{ erro }}
    </div>

    <template v-else-if="usuario">

      <!-- Cabeçalho -->
      <div class="card perfil">

        <div class="identidade">

          <img
            v-if="perfilCompleto && usuario?.foto?.url"
            :src="usuario.foto.url"
            alt="Foto do responsável"
            class="foto"
          />
          <div v-else-if="perfilCompleto" class="foto foto-vazia">
            👤
          </div>

          <div>
            <h2>{{ nomeExibido }}</h2>

            <span v-if="!perfilCompleto" class="aviso">
              Perfil incompleto
            </span>

            <div v-if="perfilCompleto" class="contato">
              <span>📧 {{ usuario?.email }}</span>
              <span v-if="usuario?.telefone">
                📞 {{ usuario.telefone }}
              </span>
            </div>

            <p v-if="perfilCompleto" class="filhos">
              🧒 {{ quantidadeFilhos }}
              {{ quantidadeFilhos === 1 ? 'filho' : 'filhos' }}
            </p>
          </div>

        </div>

      </div>

      <!-- Formulário (perfil incompleto): CompletarPerfilResponsavelView embutido -->
      <CompletarPerfilResponsavel v-if="!perfilCompleto" />

    </template>

  </div>
</template>

<style scoped>
.pagina {
  padding: 16px;
  background: #F9FAFB;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
}

.perfil {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.identidade {
  display: flex;
  align-items: center;
  gap: 14px;
}

.foto {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background: #F3F4F6;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

.aviso {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  color: #B45309;
  background: #FEF3C7;
  padding: 2px 10px;
  border-radius: 999px;
}

.filhos {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
}

.contato {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
