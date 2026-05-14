<script setup lang="ts">
import { Baby } from 'lucide-vue-next';
</script>

<template>
<footer>
  <div class="footerbaby">
    <Baby :size="35" color="#F6339A" stroke-width="1.5" />
    <h2>BabyCare</h2>
  </div>
  <div class="informacoes">
    <div class="embaixo">Conectando famílias com babás qualificadas e confiáveis.</div>
    <h2>Links Rápidos</h2>
    <p>Início</p>
    <p>Encontrar Babás</p>
    <p>Sobre</p>
    
    <h2>Para Babás</h2>
    <p>Cadastrar-se</p>
    <p>Como Funciona</p>
    <p>Dicas e Recursos</p>
    
    <h2>Contato</h2>
    <p>contato@babycare.com</p>
    <p>(11) 9999-9999 </p>
    <p>São Paulo, Brasil </p>
  </div>

  <div class="copyright">
    © 2026 BabyCare. Todos os direitos reservados.
  </div>
</footer>
</template>

<style>
/*====================
        footer
=====================*/
footer{
  background-color: #101828;
  color: #FFFFFF;
  padding: 0 20px 0 40px;
}
.footerbaby{
  display: flex;
  text-align: center;
  align-items: center;
  padding: 20px 0 0 0;
}

footer div.embaixo {
   margin: -10px 0 30px 0;
}
footer div.informacoes {
 text-align: left;
 margin:10px -40px;
 padding: 0 0 0 40px;
}
.copyright{
 text-align: center;
 border-top: solid #E5E5E5;
 margin: 10px -40px;
 align-items: center;
 padding: 10px;
}
</style>
