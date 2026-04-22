<script setup lang="ts"></script>

<template>

  <body>
    <header>
      <img src="/baby.png" alt="baby">
      <h1>BabyCorporation</h1>
    </header>
    <main>
    <section class="encontreababa">
      <h2>Encontre a babá perfeita para sua família</h2>
      <p>Conectamos você com babás qualificadas, verificadas e de confiança.
        Cuidado profissional para seus pequenos.</p>
      <img src="/menina-balanco.png" alt="menina-balanco">
      <div>
      <button>
        Encontrar Babás
      </button>
      <button>
        Cadastrar como Babá
      </button>
      </div>
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
    <img src="/julianasantos.png" alt="Juliana Santos">
    <h3>Juliana Santos</h3>
    <img src="/map-pin.png" alt="mapa pin">
    <p>Belo Horizonte, MG</p>
    <p>Sou estudante de psicologia infantil e amo criar brincadeiras criativas para os...</p>
    <img src="/clock.png" alt="clock">
    <p>3 anos de experiência</p>
    <p>Psicologia Infantil</p> <p>+1</p>
    </div>
    <div>
        <img src="/Ana Paula Costa.png" alt="">
        <h3>Ana Paula Costa</h3>
        <img src="/map-pin.png" alt="mapa pin">
        <p>Rio de Janeiro, RJ</p>
        <p>Experiência com gêmeos e bebês. Formação em enfermagem pediátrica e muita paciência!</p>
        <img src="/clock.png" alt="clock">
        <p>Enfermagem</p> <p>Bebês</p>
    </div>
    <div>
      <img src="/mariasilva.png" alt="Maria Silva">
      <h3>Maria Silva</h3>
      <img src="/map-pin.png" alt="mapa pin">
      <p>São Paulo, SP</p>
      <p>Adoro crianças e tenho experiência com todas as idades. Sou formada em pedagogia e possuo...</p>
      <img src="/clock.png" alt="clock">
      <p>5 anos de experiência</p>
      <p>Primeiros Socorros</p>
      <h4>Ver todas</h4>
      <img src="/seta-esquerda.png" alt="seta esquerda">
    </div>
    </section>
    <section class="comofunciona">
<h1>Como funciona </h1>
<p>Encontre sua babá ideal em 3 passos simples</p>
<div>
<p>1</p>
<h5>Busque e Filtre</h5>
<p>Navegue por perfis de babás, filtre por localização, experiência e disponibilidade.</p>
</div>
<div>
<p>2</p>
<h5>Conheça e Entreviste</h5>
<p>Entre em contato com as babás que mais combinam com você e agende uma entrevista.</p>
</div>
<div>
<p>3</p>
<h5>Contrate com Confiança</h5>
<p>Escolha a babá perfeita e tenha tranquilidade sabendo que seus filhos estão em boas mãos.</p>
</div>
    </section>
    <section class="protacomecar">
    <h1>Pronta para começar?</h1>
    <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
    <button>Encontrar Babás</button>
    <button>Cadastrar como Usuario</button>
    </section>
    </main>
  </body>
  <footer>
  <img src="/baby.png" alt="baby">
  <h1>BabyCare</h1>
  <div>
  <h2>Links Rápidos</h2>
  <p>Início</p>
  <p>Encontrar Babás</p>
  <p>Sobre</p>
  </div>
  <div>
  <h2>Para Babás</h2>
  <p>Cadastrar-se</p>
  <p>Como Funciona</p>
  <p>Dicas e Recursos</p>
  </div>
  <div>
  <h2>Contato</h2>
  <p>contato@babycare.com</p>
  <p>(11) 9999-9999 </p>
  <p>São Paulo, Brasil </p>
  <div>
 © 2026 BabyCare. Todos os direitos reservados.
  </div>
  </div>
  
  </footer>
  
</template>

<style scoped>
/*====================
         body
=====================*/     
body{
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color:#FBF3FB;
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
/*====================
        main
=====================*/
main{
  background-color: #FBF3FB;
}

/*====================
    encontre a baba
=====================*/
.encontreababa{
  text-align: center;
  align-items: center;
  border-top: solid#E5E5E5;
}
.encontreababa div button{
justify-content: center;
align-items: center;
}
.encontreababa button{
  padding:20px 30px;
  display: flex;
  border-radius: 10px;
  border:#F6339A;
  margin:20px auto;
  background-color:#F6339A;
  color: aliceblue;
  font-size: 20px;
}

</style>
