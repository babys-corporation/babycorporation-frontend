<script setup lang="ts">
import { MapPin, Clock } from 'lucide-vue-next';
</script>

<template>
  <div class="cards">
    <div class="card">
      <div class="img-container">
        <img src="../assets/images/julianasantos.png" alt="Juliana Santos" />
        <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Juliana Santos</h3>

        <div class="linha">
          <MapPin :size="16" color="#F6339A" />
          <span>Belo Horizonte, MG</span>
        </div>

        <p>
          Sou estudante de psicologia infantil e amo criar brincadeiras
          criativas para os...
        </p>

        <div class="linha">
          <Clock :size="16" color="#F6339A" />
          <span>3 anos de experiência</span>
        </div>

        <div class="tags">
          <span>Psicologia Infantil</span>
          <span>+1</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="img-container">
        <img src="../assets/images/AnaPaulaCosta.png" alt="Ana Paula Costa" />
        <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Ana Paula Costa</h3>

        <div class="linha">
          <MapPin :size="16" color="#F6339A" />
          <span>Rio de Janeiro, RJ</span>
        </div>

        <p>
          Experiência com gêmeos e bebês. Formação em enfermagem pediátrica e
          muita paciência!
        </p>

        <div class="linha">
          <Clock :size="16" color="#F6339A" />
          <span>Experiência comprovada</span>
        </div>

        <div class="tags">
          <span>Enfermagem</span>
          <span>Bebês</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="img-container">
        <img src="../assets/images/MariaSilva.png" alt="Maria Silva" />
        <span class="verificado">✔ Verificado</span>
      </div>

      <div class="info">
        <h3>Maria Silva</h3>

        <div class="linha">
          <MapPin :size="16" color="#F6339A" />
          <span>São Paulo, SP</span>
        </div>

        <p>
          Adoro crianças e tenho experiência com todas as idades. Sou formada em
          pedagogia...
        </p>

        <div class="linha">
          <Clock :size="16" color="#F6339A" />
          <span>5 anos de experiência</span>
        </div>

        <div class="tags">
          <span>Primeiros Socorros</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
</style>
