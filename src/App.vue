<script setup>
import AppHeader from './componentes/layout/AppHeader.vue';
</script>

<template>
 
    <AppHeader/>
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
          <button class="inverso">
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

  <h1>Babás em Destaque</h1>
  <p>Conheça algumas de nossas profissionais mais bem avaliadas</p>

  <div class="cards">

    <div class="card">
      <div class="img-container">
        <img src="/julianasantos.png" alt="Juliana Santos">
        <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Juliana Santos</h3>

        <div class="linha">
          <img src="/map-pin.png" alt="">
          <span>Belo Horizonte, MG</span>
        </div>

        <p>
          Sou estudante de psicologia infantil e amo criar brincadeiras criativas para os...
        </p>

        <div class="linha">
          <img src="/clock.png" alt="">
          <span>3 anos de experiência</span>
        </div>

        <div class="tags">
          <span>Psicologia Infantil</span>
          <span>+1</span>
        </div>
      </div>
    </div>


    <div class="card">
      <div class="img-container">
        <img src="/Ana Paula Costa.png" alt="">
         <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Ana Paula Costa</h3>

        <div class="linha">
          <img src="/map-pin.png" alt="">
          <span>Rio de Janeiro, RJ</span>
        </div>

        <p>
          Experiência com gêmeos e bebês. Formação em enfermagem pediátrica e muita paciência!
        </p>

        <div class="linha">
          <img src="/clock.png" alt="">
          <span>Experiência comprovada</span>
        </div>

        <div class="tags">
          <span>Enfermagem</span>
          <span>Bebês</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="img-container">
        <img src="/mariasilva.png" alt="Maria Silva">
         <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Maria Silva</h3>

        <div class="linha">
          <img src="/map-pin.png" alt="">
          <span>São Paulo, SP</span>
        </div>

        <p>
          Adoro crianças e tenho experiência com todas as idades. Sou formada em pedagogia...
        </p>

        <div class="linha">
          <img src="/clock.png" alt="">
          <span>5 anos de experiência</span>
        </div>

        <div class="tags">
          <span>Primeiros Socorros</span>
        </div>
      </div>
    </div>

  </div>
  <div class="seta-rosa">
  <h4 class="ver-todas">Ver todas</h4>
  <img src="/seta-esquerda.png" alt="seta">
</div>
</section>
    <section class="comofunciona">
  <h1>Como funciona</h1>
  <p class="subtitulo">Encontre sua babá ideal em 3 passos simples</p>

  <div class="passos">

    <div class="passo">
      <div class="numero">1</div>
      <div class="texto">
        <h3>Busque e Filtre</h3>
        <p>
          Navegue por perfis de babás, filtre por localização, experiência e disponibilidade.
        </p>
      </div>
    </div>

    <div class="passo">
      <div class="numero">2</div>
      <div class="texto">
        <h3>Conheça e Entreviste</h3>
        <p>
          Entre em contato com as babás que mais combinam com você e agende uma entrevista.
        </p>
      </div>
    </div>

    <div class="passo">
      <div class="numero">3</div>
      <div class="texto">
        <h3>Contrate com Confiança</h3>
        <p>
          Escolha a babá perfeita e tenha tranquilidade sabendo que seus filhos estão em boas mãos.
        </p>
      </div>
    </div>

  </div>
</section>
      <section class="prontacomecar">
        <h1>Pronta para começar?</h1>
        <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
        <button>Encontrar Babás</button>
        <button class="inverso">Cadastrar como Usuario</button>
      </section>
    </main>
  <footer>
  <div class="footerbaby">
    <img src="/baby.png" alt="baby">
    <h1>BabyCare</h1>
    </div>
    Conectando famílias com babás qualificadas e confiáveis.
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
      <div class="copyright">
        © 2026 BabyCare. Todos os direitos reservados.
      </div>
    </div>

  </footer>

</template>

<style scoped>
/*====================
         body
=====================*/
body {
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: #FBF3FB;
}

/*====================
        header        
=====================*/
header {
  display: flex;
  align-items: center;
  color: FFFFFF;
}

header h1 {
  font-size: 1.2rem;
}

header img {
  width: 10%;
  height: 10%;
}

/*====================
        main
=====================*/
main {
  background-color: #F9FAFB;
  text-align: center;
}

/*====================
    encontre a baba
=====================*/
.encontreababa {
  align-items: center;
  border-top: solid#E5E5E5;
  background-color: #FBF3FB;
  padding: 40px 0px;
}

.encontreababa div button {
  justify-content: center;
  align-items: center;
}

.encontreababa button {
  padding: 20px 30px;
  display: flex;
  border-radius: 10px 10px;
  border: #F6339A;
  margin: 10px auto;
  background-color: #F6339A;
  color: aliceblue;
  font-size: 15px;
  width: 220px;
  height: 60px;
}

.encontreababa .inverso {
  color: #F6339A;
  background-color: #FBF3FB;
  border: solid #F6339A;
}

/*====================
    porque escolher
=====================*/
.porqueescolher {
  padding: 40px 0px;
}

.porqueescolher p {
  width: 300px;
  margin: 20px auto;
}

/*====================
    babasdestaque
=====================*/
.babasdestaque {
  text-align: center;
  padding: 40px;
  background: #f5f5f5;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.card {
  background: white;
  border-radius: 12px;
  width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  text-align: left;
}

.img-container {
  position: relative;
}

.img-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.verificado {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #22c55e;
  color: white;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 8px;
}

.info {
  padding: 15px;
}

.linha {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 14px;
  color: #555;
}

.linha img {
  width: 16px;
}

.info p {
  font-size: 14px;
  color: #666;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tags span {
  background: #e5e7eb;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.ver-todas {
  margin-top: 20px;
  color: #F6339A;
  cursor: pointer;
}
/*====================
    como funciona
=====================*/

.comofunciona {
  background: #eee9ee;
  padding: 50px 20px;
  text-align: center;
}

.comofunciona h1 {
  font-size: 28px;
  margin-bottom: 5px;
}

.subtitulo {
  color: #555;
  margin-bottom: 40px;
}

.passos {
  max-width: 600px;
  margin: 0 auto;
}

.passo {
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 40px;
  text-align: left;
}

.numero {
  max-width: 30px;
  height: 30px;
  background: #ec4899;
  color: white;
  font-weight: bold;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 20px;
  margin: 0px 0px 10px 30px;
}

.texto h3 {
  margin: 0;
  font-size: 18px;
  margin: 0px 0px 10px 30px;
}

.texto p {
  margin-top: 5px;
  color: #000000;
  font-size: 14px;
  margin: 0px 0px 0px 30px;
}
/*====================
    Pronta comecar
=====================*/

.prontacomecar {
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  color: white;
  text-align: center;
  padding: 80px 20px;
}
.prontacomecar  h1 {
  font-size: 40px;
  margin-bottom: 15px;
}
.prontacomecar button{
  background-color: #FFFFFF;
  color:#F6339A;
  font-weight: bold;
}
.prontacomecar .inverso{
  color: #FFFFFF;
  border: solid #FFFFFF;
  background: linear-gradient(135deg, #ff2f92, #8b5cf6);
  font-weight: bold;
  border-width: 2.5px
}
/*====================
        footer
=====================*/
footer{
  background-color: #101828;
  color: #FFFFFF;
  padding: 20px 40px;
}
.footerbaby{
  display: flex;
  text-align: center;
  align-items: center;
}
footer div img{
  width: 50px;
  height: 50px;
  margin: 0px 10px 0px 0px;
}
.copyright{
  text-align: center;
 border-top: solid #E5E5E5;
 margin:10px -40px;
 align-items: center;
 padding: 20px
}
/*====================
        button
=====================*/

 button {
  padding: 20px 30px;
  display: flex;
  border-radius: 10px 10px;
  border: #F6339A;
  margin: 10px auto;
  background-color: #F6339A;
  color: aliceblue;
  font-size: 15px;
  width: 220px;
  height: 60px;
}
div button {
  justify-content: center;
  align-items: center;
}.inverso {
  color: #F6339A;
  background-color: #FBF3FB;
  border: solid #F6339A;
}



</style>
