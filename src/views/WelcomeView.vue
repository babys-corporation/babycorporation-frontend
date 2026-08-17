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
/*====================================================
    TOKENS — fontes, cores, raios, sombras
====================================================*/
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
    --fonte-display: 'Fredoka', sans-serif;
    --fonte-texto: 'Plus Jakarta Sans', sans-serif;

    --cor-fundo: #FFF9F5;
    --cor-superficie: #FFFFFF;
    --cor-superficie-suave: #FDF0F6;

    --cor-tinta: #2A2140;
    --cor-tinta-suave: #746C87;

    --rosa: #EC3F93;
    --rosa-claro: #FF6FB0;
    --rosa-escuro: #C6247A;
    --violeta: #7C4DFF;
    --dourado: #FFB258;
    --azul: #3E8AFF;

    --anel-rosa: rgba(236, 63, 147, 0.18);
    --borda-suave: rgba(42, 33, 64, 0.06);

    --raio-sm: 14px;
    --raio-md: 20px;
    --raio-lg: 32px;
    --raio-full: 999px;

    --sombra-card: 0 10px 30px rgba(42, 33, 64, 0.07);
    --sombra-card-hover: 0 20px 44px rgba(236, 63, 147, 0.22);
    --sombra-suave: 0 4px 14px rgba(42, 33, 64, 0.05);

    --duracao: 0.28s;
    --easing: cubic-bezier(0.22, 1, 0.36, 1);
}

* {
    box-sizing: border-box;
}

body {
    background: var(--cor-fundo);
    color: var(--cor-tinta);
    font-family: var(--fonte-texto);
    -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
    font-family: var(--fonte-display);
    color: var(--cor-tinta);
    line-height: 1.2;
    letter-spacing: -0.01em;
}

/*====================================================
    BOTÕES — base única
====================================================*/
button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 36px;
    width: fit-content;
    height: auto;
    margin: 0 auto;
    border: none;
    border-radius: var(--raio-full);
    background: linear-gradient(135deg, var(--rosa-claro), var(--rosa-escuro));
    background-size: 160% 160%;
    background-position: 0% 50%;
    color: #FFFFFF;
    font-family: var(--fonte-texto);
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
    cursor: pointer;
    box-shadow: 0 12px 26px var(--anel-rosa);
    transition: transform var(--duracao) var(--easing),
                box-shadow var(--duracao) var(--easing),
                background-position var(--duracao) var(--easing);
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 36px var(--anel-rosa);
    background-position: 100% 50%;
}

button:active {
    transform: translateY(-1px) scale(0.98);
}

button:focus-visible {
    outline: 3px solid rgba(236, 63, 147, 0.35);
    outline-offset: 3px;
}

.inverso {
    background: transparent;
    color: var(--rosa);
    border: 2px solid var(--rosa);
    box-shadow: none;
}

.inverso:hover {
    background: var(--cor-superficie-suave);
    box-shadow: 0 8px 20px rgba(236, 63, 147, 0.12);
}

/*====================================================
    Encontre a babá (hero)
====================================================*/
.encontreababa {
    position: relative;
    overflow: hidden;
    text-align: center;
    background: linear-gradient(180deg, #FFF0F7 0%, #FDF6FB 60%, var(--cor-fundo) 100%);
    padding: 100px 24px 76px;
    isolation: isolate;
}

.encontreababa::before,
.encontreababa::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(4px);
    z-index: -1;
    animation: flutuar 9s ease-in-out infinite;
}

.encontreababa::before {
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(124, 77, 255, 0.18), transparent 70%);
    top: -120px;
    left: -90px;
}

.encontreababa::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 178, 88, 0.2), transparent 70%);
    bottom: -170px;
    right: -110px;
    animation-delay: -4s;
    animation-direction: reverse;
}

@keyframes flutuar {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-18px) scale(1.04); }
}

.encontreababa h2 {
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 700;
    max-width: 660px;
    margin: 0 auto 18px;
}

.encontreababa p {
    max-width: 480px;
    margin: 0 auto;
    color: var(--cor-tinta-suave);
    font-size: 16.5px;
    line-height: 1.65;
}

.encontreababa img {
    max-width: 280px;
    width: 100%;
    height: auto;
    margin: 44px auto 12px;
    filter: drop-shadow(0 22px 32px rgba(124, 77, 255, 0.2));
    animation: flutuar 6s ease-in-out infinite;
}

.encontreababa div button {
    margin: 10px auto 0;
}

/*====================================================
    Por que escolher — cards em grid
====================================================*/
.porqueescolher {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 28px;
    max-width: 1080px;
    margin: 0 auto;
    padding: 76px 24px 96px;
    text-align: center;
}

.porqueescolher h1 {
    grid-column: 1 / -1;
    font-size: clamp(24px, 3vw, 33px);
}

.porqueescolher > p {
    grid-column: 1 / -1;
    color: var(--cor-tinta-suave);
    margin: -8px auto 22px;
}

.porqueescolher > div {
    background: var(--cor-superficie);
    border: 1px solid var(--borda-suave);
    border-radius: var(--raio-lg);
    padding: 40px 26px;
    box-shadow: var(--sombra-card);
    transition: transform var(--duracao) var(--easing),
                box-shadow var(--duracao) var(--easing),
                border-color var(--duracao) var(--easing);
}

.porqueescolher > div:hover {
    transform: translateY(-8px);
    box-shadow: var(--sombra-card-hover);
    border-color: transparent;
}

.porqueescolher > div p {
    color: var(--cor-tinta-suave);
    font-size: 14.5px;
    line-height: 1.65;
    width: auto;
    margin: 0;
}

.porqueescolher h2 {
    font-size: 18px;
    margin: 0 0 10px;
}

.icone-escudo,
.icone-estrela,
.icone-relogio {
    width: 70px;
    height: 70px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
    transition: transform var(--duracao) var(--easing);
}

.porqueescolher > div:hover .icone-escudo,
.porqueescolher > div:hover .icone-estrela,
.porqueescolher > div:hover .icone-relogio {
    transform: scale(1.08) rotate(-4deg);
}

.icone-escudo {
    background: linear-gradient(135deg, #FCE7F3, #FBD3E8);
}

.icone-estrela {
    background: linear-gradient(135deg, #F1E5FF, #E3CFFF);
}

.icone-relogio {
    background: linear-gradient(135deg, #DCEBFF, #C7DEFF);
}

/*====================================================
    Babás em destaque
====================================================*/
.babasdestaque {
    text-align: center;
    padding: 76px 24px 96px;
    background: var(--cor-superficie-suave);
}

.babasdestaque h1 {
    font-size: clamp(24px, 3vw, 33px);
}

.babasdestaque > p {
    color: var(--cor-tinta-suave);
    margin: 0 0 38px;
}

div.seta-rosa {
    padding: 30px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    width: fit-content;
    margin: 0 auto;
    transition: gap var(--duracao) var(--easing);
}

.ver-todas {
    margin: 0;
    color: var(--rosa);
    font-weight: 600;
    transition: gap var(--duracao) ease;
}

.seta-rosa:hover {
    gap: 10px;
}

.seta-rosa:hover .ver-todas {
    text-decoration: underline;
}

/*====================================================
    Como funciona
====================================================*/
.comofunciona {
    background: linear-gradient(180deg, var(--cor-fundo), #F6EEFB);
    padding: 96px 24px;
    text-align: center;
}

.comofunciona h1 {
    font-size: clamp(26px, 3.5vw, 35px);
    margin-bottom: 8px;
}

.subtitulo {
    color: var(--cor-tinta-suave);
    margin-bottom: 60px;
}

.passos {
    max-width: 560px;
    margin: 0 auto;
    position: relative;
}

.passos::before {
    content: '';
    position: absolute;
    left: 22px;
    top: 14px;
    bottom: 14px;
    width: 2px;
    background-image: linear-gradient(var(--anel-rosa) 60%, transparent 0%);
    background-size: 2px 12px;
    background-repeat: repeat-y;
}

.passo {
    display: flex;
    align-items: flex-start;
    gap: 22px;
    margin-bottom: 44px;
    text-align: left;
    position: relative;
}

.passo:last-child {
    margin-bottom: 0;
}

.numero {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--rosa), var(--violeta));
    color: white;
    font-family: var(--fonte-display);
    font-weight: 600;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 8px 18px var(--anel-rosa);
    margin: 0;
    position: relative;
    z-index: 1;
}

.texto {
    background: var(--cor-superficie);
    border: 1px solid var(--borda-suave);
    border-radius: var(--raio-md);
    padding: 20px 24px;
    box-shadow: var(--sombra-suave);
    flex: 1;
    transition: transform var(--duracao) var(--easing),
                box-shadow var(--duracao) var(--easing);
}

.passo:hover .texto {
    transform: translateX(4px);
    box-shadow: var(--sombra-card);
}

.texto h3 {
    margin: 0 0 6px;
    font-size: 17px;
}

.texto p {
    color: var(--cor-tinta-suave);
    font-size: 14px;
    margin: 0;
    line-height: 1.65;
}

/*====================================================
    Pronta para começar (CTA final)
====================================================*/
.prontacomecar {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, var(--rosa) 0%, var(--violeta) 100%);
    color: white;
    text-align: center;
    padding: 96px 24px;
    isolation: isolate;
}

.prontacomecar::before {
    content: '';
    position: absolute;
    width: 440px;
    height: 440px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 70%);
    top: -190px;
    right: -130px;
    z-index: -1;
}

.prontacomecar::after {
    content: '';
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 178, 88, 0.2), transparent 70%);
    bottom: -170px;
    left: -110px;
    z-index: -1;
}

.prontacomecar h1 {
    color: white;
    font-size: clamp(28px, 4vw, 41px);
    margin-bottom: 12px;
}

.prontacomecar > p {
    max-width: 420px;
    margin: 0 auto 38px;
    opacity: 0.94;
}

.prontacomecar button {
    background: #FFFFFF;
    background-image: none;
    color: var(--rosa);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
    display: inline-flex;
    margin: 0 8px 12px;
}

.prontacomecar button:hover {
    background: #FFF5FA;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.22);
}

.prontacomecar .inverso {
    background: transparent;
    color: #FFFFFF;
    border: 2px solid rgba(255, 255, 255, 0.7);
    box-shadow: none;
}

.prontacomecar .inverso:hover {
    background: rgba(255, 255, 255, 0.14);
    box-shadow: none;
}

@media (max-width: 560px) {
    .prontacomecar button {
        margin: 0 auto 12px;
    }
}
</style>