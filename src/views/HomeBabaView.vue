<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BabaDisponibilidade from '../componentes/cards/BabaDisponibilidade.vue'
import { useAuthStore } from '@/stores/auth'
import { useBabaStore } from '@/stores/baba'
import { meRequest } from '@/api/auth'
import api from '@/api/config'

const authStore = useAuthStore()
const babaStore = useBabaStore()

const carregando = ref(true)
const erro = ref('')

const baba = ref<any>(null)
const solicitacoes = ref<any[]>([])

const disponibilidade = {
  Segunda: true,
  Terça: true,
  Quarta: true,
  Quinta: true,
  Sexta: false,
  Sábado: false,
  Domingo: false,
}

async function carregarDados() {
  try {
    carregando.value = true
    erro.value = ''

    // Busca o usuário logado
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    // Busca todas as babás
    await babaStore.getBabas()

    // Procura a babá correspondente ao usuário
    baba.value = babaStore.babas.find(
      (b: any) => b.usuario.id === usuario.id
    )

    if (!baba.value) {
      erro.value = 'Perfil de babá não encontrado.'
      return
    }

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

    <template v-else>

      <div class="card perfil">
        <div class="topo">

          <div>
            <h2>{{ baba?.usuario.username }}</h2>

            <div class="info-linha">
              <span>
                📍 {{ baba?.usuario.cidade || 'Cidade não informada' }}
              </span>

              <span>
                🕐 {{ baba?.experiencia_anos }} anos de experiência
              </span>
            </div>
          </div>

          <span class="editar">
            ✏️
          </span>

        </div>

        <BabaDisponibilidade
          :disponibilidade="disponibilidade"
        />

        <div class="select-grupo">

          <div class="select-item">
            <span>Data</span>
            <span>⌄</span>
          </div>

          <div class="select-item">
            <span>Horário</span>
            <span>⌄</span>
          </div>

        </div>

        <p class="preco">
          R$
          {{ baba?.valor_hora ?? '0,00' }}
          /hora
        </p>

        <div
          v-if="baba?.descricao"
          class="descricao"
        >
          {{ baba.descricao }}
        </div>

      </div>

      <div class="solicitacoes">

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
  gap: 16px;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}

.info-linha {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
  font-size: 13px;
  color: #666;
}

.editar {
  font-size: 20px;
  cursor: pointer;
}

.select-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #DDD;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
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

.erro {
  text-align: center;
  color: #B91C1C;
  background: #FEE2E2;
}
</style>