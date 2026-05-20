<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import BabaCard from '@/componentes/cards/BabaCard.vue';

// Mock de dados corrigido com os campos obrigatórios para o TypeScript
const babysitters = ref([
  { 
    id: 1, 
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 
    name: 'Maria Souza', 
    location: 'São Paulo', 
    experience: 5, 
    hourlyRate: 35, 
    rating: 4.9, 
    verified: true, 
    skills: ['Primeiros Socorros', 'Recém-nascidos'],
    reviewsCount: 12, // Adicionado para corrigir o erro TS239
    bio: 'Experiente com recém-nascidos e cuidados especiais.' // Adicionado para corrigir o erro TS239
  },
  { 
    id: 2, 
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 
    name: 'Ana Costa', 
    location: 'Rio de Janeiro', 
    experience: 2, 
    hourlyRate: 25, 
    rating: 4.5, 
    verified: false, 
    skills: ['Atividades Lúdicas'],
    reviewsCount: 5,  // Adicionado para corrigir o erro TS239
    bio: 'Focada em atividades lúdicas e pedagógicas para crianças.' // Adicionado para corrigir o erro TS239
  }
]);

const searchTerm = ref('');
const sortBy = ref('rating');
const filterExperience = ref('all');
const filterVerified = ref(false);

const filteredBabysitters = computed(() => {
  return babysitters.value
    .filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        b.location.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        b.skills.some((s) => s.toLowerCase().includes(searchTerm.value.toLowerCase()));

      const matchesExperience =
        filterExperience.value === 'all' ||
        (filterExperience.value === '0-3' && b.experience <= 3) ||
        (filterExperience.value === '4-6' && b.experience >= 4 && b.experience <= 6) ||
        (filterExperience.value === '7+' && b.experience >= 7);

      const matchesVerified = !filterVerified.value || b.verified;

      return matchesSearch && matchesExperience && matchesVerified;
    })
    .sort((a, b) => {
      if (sortBy.value === 'rating') return b.rating - a.rating;
      if (sortBy.value === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy.value === 'price-high') return b.hourlyRate - a.hourlyRate;
      if (sortBy.value === 'experience') return b.experience - a.experience;
      return 0;
    });
});

const limparFiltros = () => {
  searchTerm.value = '';
  filterExperience.value = 'all';
  filterVerified.value = false;
};
</script>

<template>
  <section class="topo-busca">
    <h1>Encontrar Babás</h1>
    <p>{{ filteredBabysitters.length }} babás disponíveis</p>
  </section>

  <div class="container-busca">
    <section class="filtros-lateral">
      <div class="titulo-filtro">
        <SlidersHorizontal :size="20" />
        <h2>Filtros</h2>
      </div>

      <div class="campo-filtro">
        <label>Buscar</label>
        <div class="busca-input-wrapper">
          <Search class="icone-busca" :size="16" />
          <input type="text" v-model="searchTerm" placeholder="Nome, cidade, habilidade...">
        </div>
      </div>

      <div class="campo-filtro">
        <label>Experiência</label>
        <select v-model="filterExperience">
          <option value="all">Todas</option>
          <option value="0-3">0-3 anos</option>
          <option value="4-6">4-6 anos</option>
          <option value="7+">7+ anos</option>
        </select>
      </div>

      <div class="campo-filtro checkbox-wrapper">
        <input type="checkbox" id="verified" v-model="filterVerified">
        <label for="verified">Apenas verificadas</label>
      </div>

      <button v-if="searchTerm || filterExperience !== 'all' || filterVerified" class="inverso" @click="limparFiltros">
        Limpar Filtros
      </button>
    </section>

    <section class="resultados-lista">
      <div class="ordenacao">
        <label>Ordenar por:</label>
        <select v-model="sortBy">
          <option value="rating">Melhor Avaliação</option>
          <option value="price-low">Menor Preço</option>
          <option value="price-high">Maior Preço</option>
          <option value="experience">Mais Experiência</option>
        </select>
      </div>

      <div v-if="filteredBabysitters.length > 0" class="grid-babas">
        <div v-for="baba in filteredBabysitters" :key="baba.id" class="item-baba">
          <BabaCard :babysitter="baba" />
        </div>
      </div>

      <div v-else class="sem-resultados">
        <p>Nenhuma babá encontrada com os filtros selecionados.</p>
        <button class="inverso" @click="limparFiltros">Resetar Filtros</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.topo-busca {
  padding: 40px 20px;
  background-color: #ffffff;
  border-bottom: solid #E5E5E5;
}
.topo-busca h1 { font-size: 32px; }

.container-busca {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.titulo-filtro {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.campo-filtro {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.campo-filtro label { font-weight: bold; font-size: 14px; }

.busca-input-wrapper { position: relative; }
.icone-busca { position: absolute; left: 10px; top: 14px; color: #888; }
.campo-filtro input[type="text"], select {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
select { padding-left: 10px; }

.checkbox-wrapper {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.checkbox-wrapper input { width: 18px; height: 18px; }

.ordenacao {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ordenacao select { width: 180px; }

.grid-babas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sem-resultados {
  text-align: center;
  padding: 40px 20px;
}
</style>