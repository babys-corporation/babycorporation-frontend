<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Star, MapPin, Clock, Shield, Calendar, MessageCircle, Languages } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// Mock para simular o detalhe encontrado pelo ID da rota
const babysitter = ref({
  id: route.params.id,
  name: 'Maria Souza',
  location: 'São Paulo, SP',
  experience: 5,
  hourlyRate: 35,
  rating: 4.9,
  reviewsCount: 12,
  verified: true,
  bio: 'Olá! Sou profissional da área de educação infantil apaixonada por cuidar de crianças. Tenho ampla experiência com recém-nascidos e atividades de desenvolvimento motor.',
  skills: ['Primeiros Socorros', 'Recém-nascidos', 'Ajuda no dever de casa'],
  languages: ['Português (Nativo)', 'Inglês (Básico)'],
  availability: ['Segunda', 'Quarta', 'Sexta']
});

const voltar = () => {
  router.push('/babysitters');
};
</script>

<template>
  <section class="barra-voltar">
    <div class="link-voltar" @click="voltar">
      <ArrowLeft :size="16" />
      <span>Voltar para a lista</span>
    </div>
  </section>

  <div class="detalhe-container" v-if="babysitter">
    <section class="perfil-card">
      <div class="avatar-container">
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" alt="Foto da Babá">
        <div v-if="babysitter.verified" class="selo-verificado">
          <Shield :size="12" color="#fff" /> Verificada
        </div>
      </div>

      <div class="info-basica">
        <h1>{{ babysitter.name }}</h1>
        <div class="linhas-meta">
          <p><MapPin :size="14" /> {{ babysitter.location }}</p>
          <p><Clock :size="14" /> {{ babysitter.experience }} anos de experiência</p>
        </div>
        <div class="avaliacao-linha">
          <Star :size="16" color="#FBBF24" fill="#FBBF24" />
          <strong>{{ babysitter.rating }}</strong>
          <span>({{ babysitter.reviewsCount }} avaliações)</span>
        </div>
        <h2 class="preco-hora">R$ {{ babysitter.hourlyRate }}/hora</h2>
      </div>
    </section>

    <section class="secao-info">
      <h3>Sobre</h3>
      <p>{{ babysitter.bio }}</p>
    </section>

    <section class="secao-info">
      <h3>Habilidades e Qualificações</h3>
      <div class="tags-lista">
        <span v-for="skill in babysitter.skills" :key="skill" class="tag-badge">{{ skill }}</span>
      </div>
    </section>

    <section class="secao-info">
      <h3>Disponibilidade</h3>
      <div class="dias-semana">
        <div v-for="dia in ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']" 
             :key="dia" 
             :class="['dia-box', { ativo: babysitter.availability.includes(dia) }]">
          {{ dia }}
        </div>
      </div>
    </section>

    <section class="acoes-lateral">
      <button><MessageCircle :size="18" /> Enviar Mensagem</button>
      <button class="inverso"><Calendar :size="18" /> Agendar Entrevista</button>
    </section>
  </div>
</template>

<style scoped>
.barra-voltar {
  background-color: #fff;
  padding: 15px 20px;
  border-bottom: solid #E5E5E5;
}
.link-voltar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #555;
}

.detalhe-container { padding: 20px; }

.perfil-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #E5E5E5;
}
.avatar-container { position: relative; width: 120px; margin: 0 auto 15px auto; }
.avatar-container img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
.selo-verificado {
  position: absolute; bottom: 0; right: -10px;
  background-color: #10B981; color: white;
  font-size: 10px; padding: 4px 8px; border-radius: 20px;
  display: flex; align-items: center; gap: 3px;
}

.linhas-meta p { color: #666; font-size: 14px; margin: 5px 0; }
.avaliacao-linha {
  display: flex; align-items: center; justify-content: center; gap: 5px; margin: 10px 0;
}
.preco-hora { color: #F6339A; font-size: 24px; margin-top: 10px; }

.secao-info { background: white; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #E5E5E5; }
.secao-info h3 { margin-bottom: 10px; font-size: 18px; }

.tags-lista { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-badge { background: #f3f4f6; padding: 6px 12px; border-radius: 20px; font-size: 13px; }

.dias-semana { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.dia-box { background: #f3f4f6; color: #aaa; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px; }
.dia-box.ativo { background: #D1FAE5; color: #065F46; font-weight: bold; }

.acoes-lateral { margin-top: 30px; }
.acoes-lateral button { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; }
</style>