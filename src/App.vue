<script setup lang="ts"></script>

<template>

  <body>
    <header>
      <img src="/public/baby.png" alt="baby">
      <h1>BabyCorporation</h1>
    </header>
    <section class="encontreababa">
      <h2>Encontre a babá perfeita para sua família</h2>
      <p>Conectamos você com babás qualificadas, verificadas e de confiança.
        Cuidado profissional para seus pequenos.</p>
      <img src="/menina-balanco.png" alt="menina-balanco">
      <button>
        Encontrar Babás
      </button>
      <button>
        Cadastrar como Babá
      </button>
    </section>
  </body>

</template>

<style scoped>
/*====================
         body
=====================*/     
body{
  align-items: center;
  text-align: center;
} 
/*====================
        header        
=====================*/
header{
  display: flex;
  align-items: center;
  color: FFFFFF;
}
header h1{
  font-size: 1.2rem;
}
header img{
width: 10%;
height: 10%;
}
</style>
