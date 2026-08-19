<script setup>
import { ref, onMounted } from 'vue'
import PerfilFamilia from '../componentes/cards/PerfilFamilia.vue'
import NecessidadesFamilia from '../componentes/cards/NecessidadesFamilia.vue'
import InfoCriancas from '../componentes/cards/InfoCriancas.vue'
import OpcoesBaba from '../componentes/cards/OpcoesBaba.vue'
import { useAuthStore } from '@/stores/auth'
import { useBabaStore } from '@/stores/baba'
import { meRequest } from '@/api/auth'

const authStore = useAuthStore()
const babaStore = useBabaStore()

const carregando = ref(true)
const erro = ref('')

const familia = ref({
  nome: '',
  cidade: '',
  filhos: 0
})

const disponibilidade = {
  Segunda: true,
  Terça: true,
  Quarta: true,
  Quinta: true,
  Sexta: false,
  Sábado: false,
  Domingo: false
}

const criancas = ref([])

const babas = ref([])

onMounted(async () => {
  try {
    const { data: usuario } = await meRequest()
    authStore.setUsuario(usuario)

    familia.value = {
      nome: [usuario.primeiro_nome, usuario.ultimo_nome].filter(Boolean).join(' ') || usuario.email,
      cidade: usuario.cidade || 'Cidade não informada',
      filhos: 0
    }

    await babaStore.getBabas()

    babas.value = babaStore.babas.map((b) => ({
      nome: [b.usuario?.primeiro_nome, b.usuario?.ultimo_nome].filter(Boolean).join(' ') || b.usuario?.email,
      cidade: b.usuario?.cidade || 'Cidade não informada',
      status: b.disponivel ? 'Disponível' : 'Indisponível',
      foto: b.usuario?.foto?.url || '/placeholder.png'
    }))
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
    erro.value = 'Erro ao carregar dados.'
  } finally {
    carregando.value = false
  }
})
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
      <PerfilFamilia
        :nome="familia.nome"
        :cidade="familia.cidade"
        :filhos="familia.filhos"
      />

      <NecessidadesFamilia :disponibilidade="disponibilidade" />

      <OpcoesBaba :babas="babas" />
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
</style>


