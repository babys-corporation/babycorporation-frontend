<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BabaCard from '@/componentes/cards/BabaCard.vue';
import {
  ArrowRight,
  Clock,
  HeartHandshake,
  MessagesSquare,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  UserPlus,
} from 'lucide-vue-next';

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
                <Search :size="18" aria-hidden="true" />
                Encontrar Babás
            </button>
        </div>
    </section>

    <section class="porqueescolher">
        <h1>Por que escolher a BabyCare?</h1>
        <p>Segurança e qualidade para o que mais importa</p>
    
        <div class="icones">
            <div class="icone-escudo">
                <Shield :size="35" color="var(--icone-escudo)" stroke-width="1.5" />
            </div>
            <h2>100% Verificadas</h2>
            <p>Todas as babás passam por verificação de documentos e checagem de referências.</p>
        </div>

        <div>
            <div class="icone-estrela">
                <Star :size="35" color="var(--icone-estrela)" stroke-width="1.5" />
            </div>
            <h2>Avaliações Reais</h2>
            <p>Leia avaliações de outras famílias e escolha com confiança.</p>
        </div>

        <div>
            <div class="icone-relogio">
                <Clock :size="35" color="var(--icone-relogio)" stroke-width="1.5" />
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
            <ArrowRight color="var(--cor-primaria)" :size="20" />
        </div>
    </section>

    <section class="comofunciona">
        <h1>Como funciona</h1>
        <p class="subtitulo">Encontre sua babá ideal em 3 passos simples</p>

        <div class="passos">
            <div class="passo">
                <div class="numero">1</div>
                <div class="texto">
                    <h3><SlidersHorizontal :size="18" aria-hidden="true" /> Busque e Filtre</h3>
                    <p>Navegue por perfis de babás, filtre por localização, experiência e disponibilidade.</p>
                </div>
            </div>

            <div class="passo">
                <div class="numero">2</div>
                <div class="texto">
                    <h3><MessagesSquare :size="18" aria-hidden="true" /> Conheça e Entreviste</h3>
                    <p>Entre em contato com as babás que mais combinam com você e agende uma entrevista.</p>
                </div>
            </div>

            <div class="passo">
                <div class="numero">3</div>
                <div class="texto">
                    <h3><HeartHandshake :size="18" aria-hidden="true" /> Contrate com Confiança</h3>
                    <p>Escolha a babá perfeita e tenha tranquilidade sabendo que seus filhos estão em boas mãos.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="prontacomecar">
        <h1>Pronta para começar?</h1>
        <p>Cadastre-se agora e encontre a babá perfeita para sua família</p>
        <div class="cta-botoes">
            <button @click="navegarParaBusca">
                <Search :size="18" aria-hidden="true" />
                Encontrar Babás
            </button>
            <button class="inverso" @click="navegarParaCadastro">
                <UserPlus :size="18" aria-hidden="true" />
                Cadastrar como Usuário
            </button>
        </div>
    </section>
</template>

<style>
/*====================================================
    Fontes e títulos (as variáveis ficam no global.css)
====================================================*/
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

h1, h2, h3 {
    font-family: var(--fonte-display);
    color: var(--cor-texto);
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
    background: var(--degrade);
    background-size: 160% 160%;
    background-position: 0% 50%;
    color: #FFFFFF;
    font-family: var(--fonte-texto);
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
    cursor: pointer;
    box-shadow: 0 12px 26px var(--anel);
    transition: transform var(--duracao) var(--easing),
                box-shadow var(--duracao) var(--easing),
                background-position var(--duracao) var(--easing);
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 36px var(--anel);
    background-position: 100% 50%;
}

button:active {
    transform: translateY(-1px) scale(0.98);
}

button:focus-visible {
    outline: 3px solid rgba(70, 52, 60, 0.35);
    outline-offset: 3px;
}

.inverso {
    background: transparent;
    color: var(--cor-acento);
    border: 2px solid var(--cor-acento);
    box-shadow: none;
}

.inverso:hover {
    background: var(--cor-superficie-suave);
    box-shadow: 0 8px 20px rgba(70, 52, 60, 0.12);
}

/*====================================================
    Encontre a babá (hero)
====================================================*/
.encontreababa {
    position: relative;
    overflow: hidden;
    text-align: center;
    background: var(--degrade-fundo);
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
    background: radial-gradient(circle, rgba(155, 125, 138, 0.35), transparent 70%);
    top: -120px;
    left: -90px;
}

.encontreababa::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(215, 183, 195, 0.6), transparent 70%);
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
    color: var(--cor-texto);
    font-size: 16.5px;
    line-height: 1.65;
}

.encontreababa img {
    max-width: 280px;
    width: 100%;
    height: auto;
    margin: 44px auto 12px;
    filter: drop-shadow(0 22px 32px rgba(155, 125, 138, 0.2));
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
    color: var(--cor-texto-suave);
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
    color: var(--cor-texto-suave);
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
    background: var(--icone-escudo-fundo);
}

.icone-estrela {
    background: var(--icone-estrela-fundo);
}

.icone-relogio {
    background: var(--icone-relogio-fundo);
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
    color: var(--cor-texto);
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
    color: var(--cor-texto);
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
    background: var(--cor-fundo);
    padding: 96px 24px;
    text-align: center;
}

.comofunciona h1 {
    font-size: clamp(26px, 3.5vw, 35px);
    margin-bottom: 8px;
}

.subtitulo {
    color: var(--cor-texto-suave);
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
    background-image: linear-gradient(var(--anel) 60%, transparent 0%);
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
    background: var(--degrade);
    color: white;
    font-family: var(--fonte-display);
    font-weight: 600;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 8px 18px var(--anel);
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
    color: var(--cor-texto-suave);
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
    background: var(--degrade-suave);
    color: var(--cor-texto);
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
    background: radial-gradient(circle, rgba(215, 183, 195, 0.6), transparent 70%);
    bottom: -170px;
    left: -110px;
    z-index: -1;
}

.prontacomecar h1 {
    color: var(--cor-texto);
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
    color: var(--cor-acento);
    box-shadow: 0 12px 28px rgba(70, 52, 60, 0.18);
    display: inline-flex;
    margin: 0 8px 12px;
}

.prontacomecar button:hover {
    background: var(--cor-fundo);
    box-shadow: 0 16px 34px rgba(70, 52, 60, 0.22);
}

.prontacomecar .inverso {
    background: transparent;
    color: var(--cor-texto);
    border: 2px solid var(--cor-destaque);
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

<style scoped>
/*====================================================
    Refinamentos só desta página (o <style> global acima
    continua igual, pois define tokens/botões do site todo)
====================================================*/

/* ícones dentro dos botões */
button {
    gap: 8px;
}

/* ── Hero ───────────────────────────────────────── */
.encontreababa {
    background: var(--degrade-fundo);
    padding: 72px 20px 64px;
}

.encontreababa h2 {
    font-size: clamp(30px, 4.4vw, 50px);
    margin-bottom: 16px;
}

.encontreababa p {
    font-size: 17px;
}

.encontreababa img {
    max-width: 260px;
    margin: 36px auto 8px;
}

.encontreababa > div button {
    margin-top: 16px;
}

/* desktop: texto à esquerda, ilustração à direita */
@media (min-width: 900px) {
    .encontreababa {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        grid-template-rows: auto auto 1fr;
        column-gap: 48px;
        align-items: center;
        max-width: none;
        padding: 88px max(48px, calc((100vw - 1080px) / 2)) 80px;
        text-align: left;
    }

    .encontreababa h2 {
        grid-column: 1;
        grid-row: 1;
        margin: 0 0 18px;
        align-self: end;
    }

    .encontreababa p {
        grid-column: 1;
        grid-row: 2;
        margin: 0;
    }

    .encontreababa > div {
        grid-column: 1;
        grid-row: 3;
        align-self: start;
    }

    .encontreababa > div button {
        margin: 28px 0 0;
    }

    .encontreababa img {
        grid-column: 2;
        grid-row: 1 / span 3;
        max-width: 340px;
        margin: 0 auto;
    }
}

/* ── Por que escolher ───────────────────────────── */
.porqueescolher {
    gap: 20px;
    padding: 72px 20px 80px;
}

/* desktop: exatamente 3 cards por linha (sem coluna vazia à direita) */
@media (min-width: 900px) {
    .porqueescolher {
        grid-template-columns: repeat(3, 1fr);
    }
}

.porqueescolher > div {
    border-radius: 20px;
    padding: 32px 24px;
    box-shadow: 0 4px 18px rgba(70, 52, 60, .05);
}

.porqueescolher > div:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(70, 52, 60, .14);
}

.porqueescolher h2 {
    font-size: 19px;
}

.icone-escudo,
.icone-estrela,
.icone-relogio {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    margin-bottom: 18px;
}

.icone-escudo { background: var(--icone-escudo-fundo); }
.icone-estrela { background: var(--icone-estrela-fundo); }
.icone-relogio { background: var(--icone-relogio-fundo); }

/* ── Babás em destaque ──────────────────────────── */
.babasdestaque {
    padding: 72px 20px 80px;
    background: var(--cor-suave);
}

.babasdestaque > p {
    margin-bottom: 32px;
}

/* ── Como funciona ──────────────────────────────── */
.comofunciona {
    background: var(--cor-fundo);
    padding: 80px 20px;
}

.comofunciona .subtitulo {
    margin-bottom: 44px;
}

.comofunciona .numero {
    background: var(--cor-acento);
}

.comofunciona .texto {
    border-radius: 16px;
}

.comofunciona .texto h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--cor-texto);
}

.comofunciona .texto h3 svg {
    color: var(--cor-acento);
    flex-shrink: 0;
}

/* desktop: 3 passos lado a lado */
@media (min-width: 900px) {
    .passos {
        max-width: 1080px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .passos::before {
        left: 16%;
        right: 16%;
        top: 22px;
        bottom: auto;
        width: auto;
        height: 2px;
        background-image: linear-gradient(90deg, var(--anel) 60%, transparent 0%);
        background-size: 12px 2px;
        background-repeat: repeat-x;
    }

    .passo {
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 0;
        gap: 18px;
    }

    .passo .texto {
        width: 100%;
        height: 100%;
    }

    .passo:hover .texto {
        transform: translateY(-4px);
    }

    .comofunciona .texto h3 {
        justify-content: center;
    }
}

/* ── CTA final ──────────────────────────────────── */
.prontacomecar {
    padding: 80px 20px;
}

.cta-botoes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
}

.cta-botoes button {
    margin: 0;
}

@media (max-width: 560px) {
    .encontreababa {
        padding: 56px 16px 48px;
    }

    .porqueescolher,
    .babasdestaque,
    .comofunciona,
    .prontacomecar {
        padding-left: 16px;
        padding-right: 16px;
    }

    .cta-botoes {
        flex-direction: column;
        align-items: stretch;
    }

    .cta-botoes button {
        width: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .encontreababa::before,
    .encontreababa::after,
    .encontreababa img {
        animation: none;
    }
}
</style>
