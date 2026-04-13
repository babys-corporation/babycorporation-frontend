<script setup lang="ts"></script>

<template>

  <body>
    <header>
      <img src="/baby.png" alt="baby">
      <h1>BabyCorporation</h1>
    </header>
    <section class="encontreababa">
      <h2>Encontre a babá perfeita para sua família</h2>
      <p>Conectamos você com babás qualificadas, verificadas e de confiança.
        Cuidado profissional para seus pequenos.</p>
      <img src="/menina-balanco.png" alt="menina-balanco">
      <button>
        Encontrar Babás
      </button>
      <button>
        Cadastrar como Babá
      </button>
    </section>
    <section class="porqueescolher">
    <h1>Por que escolher a BabyCare?</h1>
    <p>Segurança e qualidade para o que mais importa</p>
    <div>
    <img src="/escudo.png" alt="escudo">
    <h2>100% Verificadas</h2>
    <p>Todas as babás passam por verificação de documentos e checagem de referências.</p>
    </div>
    <div>
    <img src="/estrela.png" alt="estrela">
    <h2>Avaliações Reais</h2>
    <p>Leia avaliações de outras famílias e escolha com confiança.</p>
    </div>
    <div>
    <img src="/relogio.png" alt="relogio">
    <h2>Disponibilidade Flexível</h2>
    <p>Encontre babás disponíveis para horários que funcionam para você.</p>
    </div>
    </section>
    <section class="babasdestaque">
    <p>Conheça algumas de nossas profissionais mais bem avaliadas</p>
    <div>
    <img src="/mariasilva" alt="Maria Silva">
    </div>
    </section>
  </body>
  
</template>

<style scoped>
/*====================
         body
=====================*/     
body{
  align-items: center;
  text-align: center;
} 
/*====================
        header        
=====================*/
header{
  display: flex;
  align-items: center;
  color: FFFFFF;
}
header h1{
  font-size: 1.2rem;
}
header img{
width: 10%;
height: 10%;
}
</style>
