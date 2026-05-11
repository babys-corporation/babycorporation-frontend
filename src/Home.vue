<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from './componentes/layout/AppHeader.vue';
const router = useRouter();


</script>

<template>
  <div class="app">
    <AppHeader />
        <router-view />
  </div>
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
