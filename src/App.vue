<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from './componentes/layout/AppHeader.vue';
import AppFooter from './componentes/layout/AppFooter.vue';
const router = useRouter();
</script>

<template>
  <div class="app">
    
    <AppHeader title="Header" />
    
    <main>
      <router-view />      
    </main>

    <AppFooter title="Footer" />

  </div>
</template>

<style>
/*====================
         body
=====================*/
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
}
body {
  align-items: center;
  text-align: center;
  justify-content: center;
}

/*====================
        main
=====================*/
main {
  background-color: #F9FAFB;
  text-align: center;
}
</style>
