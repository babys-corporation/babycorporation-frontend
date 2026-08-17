<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, X, Baby } from 'lucide-vue-next';

const router = useRouter();
const menuAberto = ref(false);

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
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo" @click="navegarPara('/')">
         <Baby :size="35" color="#F6339A" stroke-width="1.5" />
        <span>BabysCorporation</span>
      </div>

      <!-- Menu desktop -->
      <nav class="menu-desktop">
        <a @click="navegarPara('/')">Início</a>
        <a @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        <a @click="navegarPara('/Agendamento')">Agendamento</a>
        <a @click="navegarPara('/CalendarioView')">Calendario</a>
      </nav>

      <div class="acoes-desktop">
        <button class="btn-outline" @click="navegarPara('/login')">Entrar</button>
        <button class="btn-solido" @click="navegarPara('/cadastro-baba')">Cadastre-se</button>
      </div>

      <!-- Botão hamburguer (mobile) -->
      <button class="btn-hamburguer" @click="toggleMenu" :aria-expanded="menuAberto" aria-label="Abrir menu">
        <Menu v-if="!menuAberto" :size="28" color="#F6339A" />
        <X v-else :size="28" color="#F6339A" />
      </button>
    </div>

    <!-- Menu mobile (dropdown) -->
    <transition name="slide">
      <nav v-if="menuAberto" class="menu-mobile">
        <a @click="navegarPara('/')">Início</a>
        <a @click="navegarPara('/buscar-babas')">Buscar Babás</a>
        <a @click="navegarPara('/Agendamento')">Agendamento</a>
        <a @click="navegarPara('/CalendarioView')">Calendario</a>
        <hr />
        <button class="btn-outline" @click="navegarPara('/login')">Entrar</button>
        <button class="btn-solido" @click="navegarPara('/cadastro-baba')">Cadastre-se</button>
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
  background: #ffffff;
  border-bottom: 1px solid #eee;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #F6339A;
  cursor: pointer;
}

/* Menu desktop */
.menu-desktop {
  display: flex;
  gap: 28px;
}

.menu-desktop a {
  cursor: pointer;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.menu-desktop a:hover {
  color: #F6339A;
}

.acoes-desktop {
  display: flex;
  gap: 12px;
}

.acoes-desktop button,
.menu-mobile button {
  width: auto;
  height: auto;
  padding: 10px 22px;
  font-size: 14px;
  margin: 0;
}

/* Botão solido rosa */
.btn-solido {
  background-color: #F6339A;
  color: #fff;
  border-radius: 8px;
}

/* Botão outnile cinza */
.btn-outline {
  background-color: #fff;
  color: #f3d2e3;
  border: 1.5px solid #F6339A;
  border-radius: 8px;
}

/* Botão hamburguer escondido no desktop */
.btn-hamburguer {
  display: none;
  background: none;
  border: none;
  padding: 6px;
  width: auto;
  height: auto;
  margin: 0;
  cursor: pointer;
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
  .menu-desktop,
  .acoes-desktop {
    display: none;
  }

  .btn-hamburguer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1100;
  }

  .menu-mobile {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20px 30px 30px 30px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    z-index: 1050;
  }

  .menu-mobile a {
    padding: 14px 0;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    border-bottom: 1px solid #f2f2f2;
  }

  .menu-mobile hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 12px 0;
  }

  .menu-mobile button {
    width: 100%;
  }

  .menu-mobile .btn-solido {
    margin-top: 10px;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: 60px;
    background: rgba(0, 0, 0, 0.35);
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
</style>