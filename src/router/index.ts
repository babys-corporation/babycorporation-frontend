import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '@/views/WelcomeView\.vue'
import HomeFamiliaView from '@/views/HomeFamiliaView.vue'
import HomeBabaView from '@/views/HomeBabaView.vue'
import BrowserBabaView from '@/views/BrowserBabaView.vue'
import CadastroBabaView from '@/views/CadastroBabaView.vue'
import CadastroResponsavelView from '@/views/CadastroResponsavelView.vue'
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