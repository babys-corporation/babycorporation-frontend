<script setup>
import { ref } from 'vue'

const form = ref({
  nome: '', cpf: '', telefone: '', endereco: ''
})

const quantidadeCriancas = ref(1)

const criancas = ref([
  { nome: '', genero: '', idade: '', alergias: '', condicoes: '' }
])
</script>

<template>
  <div class="pagina">
    <div class="hero">
      <h1>Pronta para começar?</h1>
      <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
    </div>

    <div class="card">
      <p class="titulo">Cadastrar responsaveis</p>
      <div class="icone">👤</div>
      <input v-model="form.nome" placeholder="Nome de responsavel" />
      <input v-model="form.cpf" placeholder="CPF" />
      <input v-model="form.telefone" placeholder="Número de telefone" />
      <input v-model="form.endereco" placeholder="Endereço" />
    </div>

    <div class="card quantidade">
      <span>Cuantas crianças você tem?</span>
      <div class="contador">
        <span>{{ quantidadeCriancas }}</span>
        <div class="setas">
          <button @click="quantidadeCriancas++">▲</button>
          <button @click="if(quantidadeCriancas > 1) quantidadeCriancas--">▼</button>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="titulo">Cadastrar crianças</p>
      <div class="icone">👶</div>
      <input placeholder="Nome da criança" />
      <input placeholder="Genero" />
      <input placeholder="Idade" />
      <input placeholder="Alergias" />
      <input placeholder="Condições físicas/mentais" />
    </div>

    <button class="btn-cadastrar">Cadastrar responsavel</button>
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

.hero p { font-size: 14px; opacity: 0.9; }

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
}

input {
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: #F3F4F6;
  font-size: 14px;
  outline: none;
}

.quantidade {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.quantidade span { font-size: 14px; }

.contador {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setas {
  display: flex;
  flex-direction: column;
}

.setas button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  width: auto;
  height: auto;
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