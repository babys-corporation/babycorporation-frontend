<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BabaCard from '@/componentes/cards/BabaCard.vue';
import { Shield, Star, Clock, ArrowRight } from 'lucide-vue-next';

const router = useRouter();

const defaultBaba = ref({
  id: 1,
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  name: 'Maria Souza',
  location: 'São Paulo',
  experience: 5,
  hourlyRate: 35,
  rating: 4.9,
  verified: true,
  skills: ['Primeiros Socorros', 'Recém-nascidos'],
  reviewsCount: 12,
  bio: 'Experiente com recém-nascidos e cuidados especiais.'
});

// Funções para navegar entre as páginas
const navegarParaBusca = () => {
  router.push('/buscar-babas');
};

const navegarParaCadastro = () => {
  router.push('/cadastro-responsavel');
};
const navegarParaCadastrobaba =  () =>{
    router.push('/cadastro-baba');
};

</script>

<template>
    <section class="encontreababa">
        <h2>Encontre a babá perfeita para sua família</h2>
        <p>Conectamos você com babás qualificadas, verificadas e de confiança.
            Cuidado profissional para seus pequenos.</p>

        <img src="../assets/images/menina-balanco.png" alt="menina-balanco">
        <div>
            <button @click="navegarParaBusca">
                Encontrar Babás
            </button>
        </div>
    </section>

    <section class="porqueescolher">
        <h1>Por que escolher a BabyCare?</h1>
        <p>Segurança e qualidade para o que mais importa</p>
    
        <div class="icones">
            <div class="icone-escudo">
                <Shield :size="35" color="#F6339A" stroke-width="1.5" />
            </div>
            <h2>100% Verificadas</h2>
            <p>Todas as babás passam por verificação de documentos e checagem de referências.</p>
        </div>

        <div>
            <div class="icone-estrela">
                <Star :size="35" color="#AD46FF" stroke-width="1.5" />
            </div>
            <h2>Avaliações Reais</h2>
            <p>Leia avaliações de outras famílias e escolha com confiança.</p>
        </div>

        <div>
            <div class="icone-relogio">
                <Clock :size="35" color="#3E8AFF" stroke-width="1.5" />
            </div>
            <h2>Disponibilidade Flexível</h2>
            <p>Encontre babás disponíveis para horários que funcionam para você.</p>
        </div>
    </section>

    <section class="babasdestaque">
        <h1>Babás em Destaque</h1>
        <p>Conheça algumas de nossas profissionais mais bem avaliadas</p>

        <BabaCard :babysitter="defaultBaba" />

        <div class="seta-rosa" @click="navegarParaBusca">
            <p class="ver-todas">Ver todas</p>
            <ArrowRight color="#F6339A" :size="20" />
        </div>
    </section>

    <section class="comofunciona">
        <h1>Como funciona</h1>
        <p class="subtitulo">Encontre sua babá ideal in 3 passos simples</p>

        <div class="passos">
            <div class="passo">
                <div class="numero">1</div>
                <div class="texto">
                    <h3>Busque e Filtre</h3>
                    <p>Navegue por perfis de babás, filtre por localização, experiência e disponibilidade.</p>
                </div>
            </div>

            <div class="passo">
                <div class="numero">2</div>
                <div class="texto">
                    <h3>Conheça e Entreviste</h3>
                    <p>Entre em contato com as babás que mais combinam com você e agende uma entrevista.</p>
                </div>
            </div>

            <div class="passo">
                <div class="numero">3</div>
                <div class="texto">
                    <h3>Contrate com Confiança</h3>
                    <p>Escolha a babá perfeita e tenha tranquilidade sabendo que seus filhos estão em boas mãos.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="prontacomecar">
        <h1>Pronta para começar?</h1>
        <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
        <button @click="navegarParaBusca">Encontrar Babás</button>
        <button class="inverso" @click="navegarParaCadastro">Cadastrar como Usuario</button>
    </section>
</template>

<style>
/*====================
    encontre a baba
=====================*/
.encontreababa {
    align-items: center;
    border-top: solid #E5E5E5;
    background-color: #FBF3FB;
    padding: 0 30px 0 40px;
}

.encontreababa div button {
    justify-content: center;
    align-items: center;
}

.encontreababa button {
    padding: 20px 30px;
    display: flex;
    border-radius: 10px;
    border: #F6339A;
    margin: 10px auto;
    background-color: #F6339A;
    color: aliceblue;
    font-size: 15px;
    width: 220px;
    height: 60px;
}

.icone-escudo {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
    background-color: #FCE7F3;
}

.icone-estrela {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
    background-color: #F3E8FF;
}

.icone-relogio {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
    background-color: #DBEAFE;
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

div.seta-rosa {
    padding: 20px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ver-todas {
    margin: 20px 0 0 0;
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
    margin: 0px 0px 10px 30px;
    font-size: 18px;
}

.texto p {
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

.prontacomecar h1 {
    font-size: 40px;
    margin-bottom: 15px;
}

.prontacomecar button {
    background-color: #FFFFFF;
    color: #F6339A;
    font-weight: bold;
}

.prontacomecar .inverso {
    color: #FFFFFF;
    border: solid #FFFFFF;
    background: linear-gradient(135deg, #ff2f92, #8b5cf6);
    font-weight: bold;
    border-width: 2.5px;
}

/*====================
        button
=====================*/
button {
    padding: 20px 30px;
    display: flex;
    border-radius: 10px;
    border: #F6339A;
    margin: 10px auto;
    background-color: #F6339A;
    color: aliceblue;
    font-size: 15px;
    width: 220px;
    height: 60px;
    cursor: pointer;
}

div button {
    justify-content: center;
    align-items: center;
}

.inverso {
    color: #F6339A;
    background-color: #FBF3FB;
    border: solid #F6339A;
}
</style>