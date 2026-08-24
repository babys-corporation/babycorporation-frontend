import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { meRequest } from '@/api/auth'

import WelcomeView from '@/views/WelcomeView\.vue'
import HomeFamiliaView from '@/views/HomeFamiliaView.vue'
import HomeBabaView from '@/views/HomeBabaView.vue'
import BrowserBabaView from '@/views/BrowserBabaView.vue'
import CadastroBabaView from '@/views/CadastroBabaView.vue'
import CadastroResponsavelView from '@/views/CadastroResponsavelView.vue'
import CompletarPerfilBabaView from '@/views/CompletarPerfilBabaView.vue'
import CompletarPerfilResponsavelView from '@/views/CompletarPerfilResponsavelView.vue'
import CalendarioView from '@/views/CalendarioView.vue'
import AgendamentoView from '@/views/AgendamentoView.vue'
import BabasDetalhesView from '@/views/BabasDetalhesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/LoginView.vue'


const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView,
    // Já logado? Vai direto para a home definitiva do tipo de usuário
    beforeEnter: async () => {
      const auth = useAuthStore()

      if (!auth.estaAutenticado) return true

      try {
        if (!auth.usuario) {
          const { data } = await meRequest()
          auth.setUsuario(data)
        }

        return auth.usuario?.tipo?.toUpperCase() === 'BABA'
          ? '/home-baba'
          : '/home-familia'
      } catch {
        // Token inválido/expirado — desloga e mostra o welcome
        auth.logout()
        return true
      }
    },
  },

  {
    path: '/home-familia',
    name: 'homeFamilia',
    component: HomeFamiliaView,
  },

  {
    path: '/home-baba',
    name: 'homeBaba',
    component: HomeBabaView,
  },

  {
    path: '/buscar-babas',
    name: 'buscarBabas',
    component: BrowserBabaView,
  },

  {
    path: '/cadastro-baba',
    name: 'cadastroBaba',
    component: CadastroBabaView,
  },

  {
    path: '/cadastro-responsavel',
    name: 'cadastroResponsavel',
    component: CadastroResponsavelView,
  },

  {
    path: '/completar-perfil-baba',
    name: 'completarPerfilBaba',
    component: CompletarPerfilBabaView,
  },

  {
    path: '/completar-perfil-responsavel',
    name: 'completarPerfilResponsavel',
    component: CompletarPerfilResponsavelView,
  },

  {
    path: '/calendario',
    name: 'calendario',
    component: CalendarioView,
  },

  {
    path: '/agendamento',
    name: 'agendamento',
    component: AgendamentoView,
  },

  {
    path: '/detalhes-baba',
    name: 'detalhesBaba',
    component: BabasDetalhesView,
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFoundView,
  },
  
  {
  path: '/login',
  component: LoginView
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router