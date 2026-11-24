<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Home } from 'lucide-vue-next';

const router = useRouter();
const irParaInicio = () => {
  router.push('/');
};
</script>

<template>
  <section class="pagina-erro">
    <h1 class="codigo-erro">404</h1>
    <h2>Página não encontrada</h2>
    <p>Ops! A página que você está procurando não existe ou foi movida.</p>
    
    <button @click="irParaInicio">
      <Home :size="18" /> Voltar para o Início
    </button>
  </section>
</template>

<style scoped>
.pagina-erro {
  text-align: center;
  padding: 100px 20px;
  background-color: var(--cor-fundo);
  min-height: 100vh;
}
.codigo-erro {
  font-size: 96px;
  color: var(--cor-acento);
  margin-bottom: 10px;
  font-weight: 900;
}
.pagina-erro h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: var(--cor-texto);
}
.pagina-erro p {
  color: var(--cor-texto-suave);
  margin-bottom: 30px;
}
.pagina-erro button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>