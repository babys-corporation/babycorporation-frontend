<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, X, Baby } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { meRequest } from '@/api/auth';

const router = useRouter();
const authStore = useAuthStore();
const menuAberto = ref(false);

const usuario = computed(() => authStore.usuario);
const ehBaba = computed(() => usuario.value?.tipo === 'BABA');
const ehPai = computed(() => usuario.value?.tipo === 'PAI');
const estaAutenticado = computed(() => authStore.estaAutenticado);

const toggleMenu = () => {
  menuAberto.value = !menuAberto.value;
};

const fecharMenu = () => {
  menuAberto.value = false;
};

const navegarPara = (rota: string) => {
  router.push(rota);
  fecharMenu();
};

// "Início": quem está logado vai para a própria home; visitante, para a Welcome
const irParaInicio = async () => {
  if (!estaAutenticado.value) {
    navegarPara('/');
    return;
  }

  // ao recarregar a página o token continua salvo, mas o usuário não
  if (!usuario.value) {
    try {
      const { data } = await meRequest();
      authStore.setUsuario(data);
    } catch (e) {
      console.error('Erro ao buscar usuário:', e);
      navegarPara('/login');
      return;
    }
  }

  navegarPara(usuario.value?.tipo?.toUpperCase() === 'BABA' ? '/home-baba' : '/home-familia');
};

const sair = () => {
  authStore.logout();
  fecharMenu();
  router.push('/');
};
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo" @click="navegarPara('/')">
        <span class="logo-icone"><Baby :size="26" stroke-width="1.75" aria-hidden="true" /></span>
        <span>BabyCare</span>
      </div>

      <!-- Menu desktop -->
      <nav class="menu-desktop">
        <template v-if="estaAutenticado && ehBaba">
          <a :class="{ ativo: $route.path === '/home-baba' }" @click="navegarPara('/home-baba')">Home</a>
          <a :class="{ ativo: $route.path === '/agendamentos-baba' }" @click="navegarPara('/agendamentos-baba')">Agendamentos</a>
        </template>
        <template v-else-if="estaAutenticado && ehPai">
          <a :class="{ ativo: $route.path === '/home-familia' }" @click="navegarPara('/home-familia')">Home</a>
          <a :class="{ ativo: $route.path === '/buscar-babas' }" @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        </template>
        <template v-else>
          <a :class="{ ativo: $route.path === '/' }" @click="irParaInicio">Início</a>
          <a :class="{ ativo: $route.path === '/buscar-babas' }" @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        </template>
      </nav>

      <div class="acoes-desktop">
        <template v-if="estaAutenticado">
          <button class="btn-outline" @click="sair">Sair</button>
        </template>
        <template v-else>
          <button class="btn-outline" @click="navegarPara('/login')">Entrar</button>
          <button class="btn-solido" @click="navegarPara('/cadastro-baba')">Cadastre-se</button>
        </template>
      </div>

      <!-- Botão hamburguer (mobile) -->
      <button class="btn-hamburguer" @click="toggleMenu" :aria-expanded="menuAberto" aria-label="Abrir menu">
        <Menu v-if="!menuAberto" :size="24" />
        <X v-else :size="24" />
      </button>
    </div>

    <!-- Menu mobile (dropdown) -->
    <transition name="slide">
      <nav v-if="menuAberto" class="menu-mobile">
        <template v-if="estaAutenticado && ehBaba">
          <a :class="{ ativo: $route.path === '/home-baba' }" @click="navegarPara('/home-baba')">Home</a>
          <a :class="{ ativo: $route.path === '/agendamentos-baba' }" @click="navegarPara('/agendamentos-baba')">Agendamentos</a>
        </template>
        <template v-else-if="estaAutenticado && ehPai">
          <a :class="{ ativo: $route.path === '/home-familia' }" @click="navegarPara('/home-familia')">Home</a>
          <a :class="{ ativo: $route.path === '/buscar-babas' }" @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        </template>
        <template v-else>
          <a :class="{ ativo: $route.path === '/' }" @click="irParaInicio">Início</a>
          <a :class="{ ativo: $route.path === '/buscar-babas' }" @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        </template>
        <hr />
        <template v-if="estaAutenticado">
          <button class="btn-outline" @click="sair">Sair</button>
        </template>
        <template v-else>
          <button class="btn-outline" @click="navegarPara('/login')">Entrar</button>
          <button class="btn-solido" @click="navegarPara('/cadastro-baba')">Cadastre-se</button>
        </template>
      </nav>
    </transition>

    <!-- Overlay escuro atrás do menu mobile -->
    <div v-if="menuAberto" class="overlay" @click="fecharMenu"></div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(120deg, var(--rosa-fundo), var(--rosa-claro) 50%, var(--rosa-medio));
  box-shadow: 0 4px 20px rgba(70, 52, 60, 0.14);
}

.navbar-container {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 70px;
  padding: 0 30px;
  max-width: var(--largura-max);
  margin: 0 auto;
}

/* empurra o menu e os botões para a direita */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  font-family: var(--fonte-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--cor-texto);
  cursor: pointer;
}

.logo-icone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--degrade);
  color: #fff;
  box-shadow: 0 6px 14px rgba(70, 52, 60, 0.25);
  transition: transform var(--duracao) var(--easing);
}

.logo:hover .logo-icone {
  transform: rotate(-6deg) scale(1.05);
}

/* Menu desktop */
.menu-desktop {
  display: flex;
  gap: 4px;
}

.menu-desktop a {
  padding: 9px 16px;
  border-radius: var(--raio-full);
  color: var(--cor-texto);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-desktop a:hover {
  background: rgba(255, 255, 255, 0.4);
}

.menu-desktop a.ativo {
  background: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.acoes-desktop {
  display: flex;
  gap: 10px;
  padding-left: 20px;
  border-left: 1px solid rgba(70, 52, 60, 0.2);
}

.acoes-desktop button,
.menu-mobile button {
  width: auto;
  height: auto;
  margin: 0;
  padding: 9px 20px;
  border-radius: var(--raio-full);
  font-size: 14px;
}

/* Botão principal */
.btn-solido {
  border: 1.5px solid transparent;
  color: #fff;
  box-shadow: 0 6px 14px rgba(70, 52, 60, 0.22);
}

/* Botão discreto (Entrar / Sair) */
.btn-outline,
.btn-outline:hover {
  background: transparent;
  color: var(--cor-texto);
  border: 1.5px solid rgba(70, 52, 60, 0.35);
  box-shadow: none;
}

.btn-outline:hover {
  background: rgba(70, 52, 60, 0.08);
  transform: none;
}

/* Botão hamburguer escondido no desktop */
.btn-hamburguer,
.btn-hamburguer:hover {
  display: none;
  width: 42px;
  height: 42px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
  color: var(--cor-texto);
  box-shadow: none;
  transform: none;
}

/* Menu mobile escondido por padrão */
.menu-mobile {
  display: none;
}

.overlay {
  display: none;
}

/*====================
  Responsivo (mobile)
=====================*/
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
  }

  .menu-desktop,
  .acoes-desktop {
    display: none;
  }

  .btn-hamburguer,
  .btn-hamburguer:hover {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1100;
  }

  .menu-mobile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 16px 20px 24px;
    border-radius: 0 0 20px 20px;
    background: var(--cor-fundo);
    box-shadow: var(--sombra-card);
    z-index: 1050;
  }

  .menu-mobile a {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 16px;
    text-align: left;
    color: var(--cor-texto);
    cursor: pointer;
  }

  .menu-mobile a.ativo {
    background: var(--cor-suave);
    font-weight: 600;
  }

  .menu-mobile hr {
    width: 100%;
    border: none;
    border-top: 1px solid var(--cor-borda);
    margin: 8px 0;
  }

  .menu-mobile button {
    width: 100%;
    padding: 12px 20px;
  }

  .menu-mobile .btn-solido {
    margin-top: 6px;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: 70px;
    background: rgba(70, 52, 60, 0.35);
    z-index: 1000;
  }
}

/* Animação do dropdown mobile */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .logo-icone {
    transition: none;
  }
}
</style>
