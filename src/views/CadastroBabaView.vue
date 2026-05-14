<script setup>
import { ref } from 'vue'

const form = ref({
  nome: '', nascimento: '', experiencia: '', preco: '',
  educacao: '', diasDisponiveis: '', habilidades: '',
  sobre: '', cpf: '', telefone: '', endereco: '',
  alergias: '', condicoesMedicas: ''
})
</script>

<template>
  <div class="pagina">
    <div class="hero">
      <h1>Pronta para começar?</h1>
      <p>Cadastre-se agora e seja a babá perfeita para uma família</p>
    </div>

    <div class="card">
      <p class="titulo">Cadastrar responsaveis</p>
      <div class="icone">👤</div>

      <input v-model="form.nome" placeholder="Nome da babá" />
      <input v-model="form.nascimento" placeholder="Data de nascimento" />
      <input v-model="form.experiencia" placeholder="Experiência" />
      <input v-model="form.preco" placeholder="Preço" />
      <input v-model="form.educacao" placeholder="Educação" />
      <input v-model="form.diasDisponiveis" placeholder="Dias disponíveis" />
      <input v-model="form.habilidades" placeholder="Habilidades" />
      <input v-model="form.sobre" placeholder="Sobre você" />
      <input v-model="form.cpf" placeholder="CPF" />
      <input v-model="form.telefone" placeholder="Número de telefone" />
      <input v-model="form.endereco" placeholder="Endereço" />
      <input v-model="form.alergias" placeholder="Alergias" />
      <input v-model="form.condicoesMedicas" placeholder="Condições medicas" />
    </div>

    <button class="btn-cadastrar">Cadastrar babá</button>
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
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.hero p {
  font-size: 14px;
  opacity: 0.9;
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
  font-weight: bold;
  color: #F6339A;
  text-align: center;
  font-size: 16px;
}

.icone {
  font-size: 32px;
  text-align: center;
  margin-bottom: 4px;
}

input {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
}

.btn-cadastrar {
  background: white;
  color: #F6339A;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  height: auto;
}
</style>