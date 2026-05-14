import { createRouter, createWebHistory } from 'vue-router';
import WelcomeView from '@/views/WelcomeView.vue';
import BabaCard from "@/componentes/cards/BabaCard.vue";

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;