<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'
import api from '@/api/config'

const router = useRouter()
const authStore = useAuthStore()

const carregando = ref(true)
const erro = ref('')

const baba = ref<any>(null)
const solicitacoes = ref<any[]>([])

const ano = new Date().getFullYear()

// Espelha os critérios de completude do backend (core/signals.py)
const perfilCompleto = computed(() => {
  if (!baba.value) return false

  const u = baba.value.usuario ?? {}
  const p = baba.value

  const campos = [
    u.foto,
    u.cpf,
    u.telefone,
    u.cep,
    u.cidade,
    u.bairro,
    p.descricao,
    p.valor_hora,
    p.habilidades,
    p.dtnasc,
    p.formacao,
  ]

  return campos.every(
    (v) => v !== null && v !== undefined && String(v).trim() !== ''
  )
})

// Completa: primeiro nome + último nome | Incompleta: e-mail sem o @...
const nomeExibido = computed(() => {
  const u = baba.value?.usuario ?? {}

  if (perfilCompleto.value) {
    return [u.primeiro_nome, u.ultimo_nome]
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  return String(u.email || '').split('@')[0] || 'Babá'
})

const localizacao = computed(() => {
  const u = baba.value?.usuario ?? {}
  return [u.bairro, u.cidade].filter(Boolean).join(', ')
})

function irParaFormulario() {
  router.push('/completar-perfil-baba')
}

async function carregarDados() {
  try {
    carregando.value = true
    erro.value = ''

    // Busca o usuário logado
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    // Busca o perfil da babá logada (independe de completude)
    const { data: perfil } = await api.get('/perfil-baba/me/')
    baba.value = perfil

    // Busca todos os agendamentos
    const { data } = await api.get('/agendamentos/')

    const lista = data.results || data

    // Filtra somente os da babá logada
    solicitacoes.value = lista.filter(
      (ag: any) => ag.baba === baba.value.id
    )

  } catch (err) {
    console.error(err)
    erro.value = 'Erro ao carregar os dados.'
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

    <template v-else-if="baba">

      <!-- Cabeçalho -->
      <div class="card perfil">

        <div class="identidade">

          <img
            v-if="perfilCompleto && baba.usuario?.foto?.url"
            :src="baba.usuario.foto.url"
            alt="Foto da babá"
            class="foto"
          />
          <div v-else class="foto foto-vazia">
            👤
          </div>

          <div>
            <h2>{{ nomeExibido }}</h2>

            <span v-if="!perfilCompleto" class="aviso">
              Perfil incompleto
            </span>

            <p v-if="perfilCompleto && localizacao" class="localizacao">
              📍 {{ localizacao }}
            </p>
          </div>

        </div>

        <template v-if="perfilCompleto">

          <p v-if="baba.descricao" class="descricao">
            {{ baba.descricao }}
          </p>

          <div class="info-linha">
            <span>
              🕐 {{ baba.experiencia_anos }}
              {{ baba.experiencia_anos === 1 ? 'ano' : 'anos' }} de experiência
            </span>

            <span v-if="baba.habilidades" class="habilidades">
              🎯 {{ baba.habilidades }}
            </span>
          </div>

          <p class="preco">
            R$ {{ baba.valor_hora ?? '0,00' }}
            /hora
          </p>

        </template>

      </div>

      <!-- Formulário (perfil incompleto) -->
      <div v-if="!perfilCompleto" class="card formulario">
        <h3>Complete seu perfil</h3>
        <p>
          Falta pouco! Preencha o formulário para que as famílias
          possam encontrar você.
        </p>

        <button
          class="btn-formulario"
          @click="irParaFormulario"
        >
          Abrir formulário
        </button>
      </div>

      <!-- Solicitações (perfil completo) -->
      <div v-if="perfilCompleto" class="solicitacoes">

        <h3>
          Solicitações de agendamento
        </h3>

        <div
          v-if="solicitacoes.length === 0"
          class="card"
        >
          <p>
            Nenhuma solicitação encontrada.
          </p>
        </div>

        <div
          class="card"
          v-for="s in solicitacoes"
          :key="s.id"
        >

          <div class="sol-topo">

            <span class="familia">
              {{ s.nome_pai || 'Família' }}
            </span>

            <span class="tempo">
              {{ s.data }}
            </span>

          </div>

          <p>
            {{ s.qtd_criancas }}
            criança(s)
          </p>

          <p>
            {{ s.hora_inicio }}
            às
            {{ s.hora_fim }}
          </p>

          <p>
            Valor:
            R$ {{ s.preco }}
          </p>

        </div>

      </div>

      <!-- Rodapé -->
      <footer class="rodape">
        <span>BabyCorporation © {{ ano }}</span>

        <div v-if="perfilCompleto" class="contato">
          <span>📧 {{ baba.usuario?.email }}</span>
          <span v-if="baba.usuario?.telefone">
            📞 {{ baba.usuario.telefone }}
          </span>
          <span v-if="localizacao">
            📍 {{ localizacao }}
          </span>
        </div>

      </footer>

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

.localizacao {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.habilidades {
  background: #F3F4F6;
  padding: 4px 10px;
  border-radius: 10px;
}

.preco {
  color: #F6339A;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.descricao {
  background: #F3F4F6;
  border-radius: 8px;
  padding: 12px;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.formulario h3 {
  margin: 0 0 6px;
  font-size: 18px;
}

.formulario p {
  margin: 0 0 12px;
  color: #666;
  font-size: 14px;
}

.btn-formulario {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.solicitacoes h3 {
  margin-bottom: 12px;
  font-size: 18px;
}

.sol-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.familia {
  font-weight: bold;
  font-size: 15px;
}

.tempo {
  color: #F6339A;
  font-size: 13px;
}

.solicitacoes p {
  margin: 4px 0;
  color: #666;
}

.rodape {
  margin-top: auto;
  padding: 14px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #888;
}

.contato {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>
