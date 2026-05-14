<script setup>
import PerfilFamilia from '../componentes/PerfilFamilia.vue'
import NecessidadesFamilia from '../componentes/NecessidadesFamilia.vue'
import InfoCriancas from '../componentes/InfoCriancas.vue'
import OpcoesBaba from '../componentes/OpcoesBaba.vue'

const familia = {
  nome: 'Isabela Souza',
  cidade: 'Porto Alegre, RS',
  filhos: 4
}

const disponibilidade = {
  Segunda: true,
  Terça: true,
  Quarta: true,
  Quinta: true,
  Sexta: false,
  Sábado: false,
  Domingo: false
}

const criancas = [
  { idade: 10, unidade: 'anos' },
  { idade: 2, unidade: 'meses' }
]

const babas = [
  { nome: 'Patrícia Alves', cidade: 'Brasília, DF', status: 'Disponível', foto: '/patricia.png' },
  { nome: 'Ana Paula Costa', cidade: 'Rio de Janeiro, RJ', status: 'Disponível', foto: '/Ana Paula Costa.png' }
]
</script>

<template>
  <div class="pagina">
    <PerfilFamilia
      :nome="familia.nome"
      :cidade="familia.cidade"
      :filhos="familia.filhos"
    />

    <NecessidadesFamilia :disponibilidade="disponibilidade" />

    <InfoCriancas
      :quantidade="2"
      :criancas="criancas"
      :habilidades="['Atividade física', 'Enfermaria', 'Ensino']"
      :condicoes="['Ansiedade', 'Leucemia', 'TDHA']"
    />

    <OpcoesBaba :babas="babas" />
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
