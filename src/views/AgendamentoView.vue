<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBaba, getBabas } from "@/api/babaApi";
import {
  createAgendamento,
  criarPagamentoPix,
  type PagamentoPix as PagamentoPixData,
} from "@/api/agendamentoApi";
import PagamentoPix from "@/componentes/cards/PagamentoPix.vue";

const route = useRoute();
const router = useRouter();

const baba = ref<any>(null);
const carregando = ref(true);
const processando = ref(false);
const erro = ref("");
const mensagem = ref("");

const hoje = new Date();
const data = ref(
  `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate()
  ).padStart(2, "0")}`
);
const horaInicio = ref("08:00");
const horaFim = ref("18:00");
const qtdCriancas = ref(1);

const agendamentoId = ref<number | null>(null);
const pagamento = ref<PagamentoPixData | null>(null);

function idDaRota(): number | null {
  const bruto = route.params.id ?? route.query.baba;
  const valor = Array.isArray(bruto) ? bruto[0] : bruto;

  if (!valor) return null;

  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

const nomeBaba = computed(() => {
  const usuario = baba.value?.usuario;
  const nome = [usuario?.primeiro_nome, usuario?.ultimo_nome]
    .filter(Boolean)
    .join(" ");

  return nome || usuario?.email || "Babá";
});

const fotoBaba = computed(() => baba.value?.usuario?.foto?.url || "");

const valorHora = computed(() => Number(baba.value?.valor_hora ?? 0));

const horas = computed(() => {
  const [horaI, minutoI] = String(horaInicio.value).split(":").map(Number);
  const [horaF, minutoF] = String(horaFim.value).split(":").map(Number);

  if (
    horaI === undefined ||
    minutoI === undefined ||
    horaF === undefined ||
    minutoF === undefined ||
    Number.isNaN(horaI) ||
    Number.isNaN(minutoI) ||
    Number.isNaN(horaF) ||
    Number.isNaN(minutoF)
  ) {
    return 0;
  }

  let minutos = horaF * 60 + minutoF - (horaI * 60 + minutoI);
  if (minutos <= 0) minutos += 24 * 60;

  return minutos / 60;
});

const total = computed(() => valorHora.value * horas.value);

const totalFormatado = computed(() =>
  total.value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
);

const podePagar = computed(
  () => Boolean(baba.value) && valorHora.value > 0 && horas.value > 0
);

async function carregarBaba() {
  carregando.value = true;
  erro.value = "";

  try {
    const id = idDaRota();

    if (id) {
      const { data: encontrada } = await getBaba(id);
      baba.value = encontrada;
    } else {
      const { data } = await getBabas();
      const lista = Array.isArray(data) ? data : data.results || [];
      baba.value = lista[0] ?? null;
    }

    if (!baba.value) {
      erro.value = "Nenhuma babá encontrada para agendar.";
    }
  } catch {
    erro.value = "Não foi possível carregar os dados da babá.";
  } finally {
    carregando.value = false;
  }
}

function irParaLogin() {
  router.push({
    name: "login",
    query: { redirect: route.fullPath },
  });
}

async function criarAgendamentoBase() {
  if (!localStorage.getItem("access_token")) {
    irParaLogin();
    return null;
  }

  if (!baba.value) {
    erro.value = "Selecione uma babá antes de continuar.";
    return null;
  }

  if (!podePagar.value) {
    erro.value =
      "A babá ainda não cadastrou o valor/hora. Não é possível gerar o PIX.";
    return null;
  }

  const { data: criado } = await createAgendamento({
    baba: baba.value.id,
    data: data.value,
    hora_inicio: `${horaInicio.value}:00`,
    hora_fim: `${horaFim.value}:00`,
    qtd_criancas: Number(qtdCriancas.value),
  });

  agendamentoId.value = criado.id;
  return criado;
}

async function efetuarPagamento() {
  processando.value = true;
  erro.value = "";
  mensagem.value = "";

  try {
    const agendamento = await criarAgendamentoBase();
    if (!agendamento) return;

    const { data: pagamentoCriado } = await criarPagamentoPix(agendamento.id);
    pagamento.value = pagamentoCriado;
  } catch (e: any) {
    erro.value =
      e?.response?.data?.detail ||
      e?.response?.data?.preco?.[0] ||
      "Não foi possível gerar o PIX. Tente novamente.";
  } finally {
    processando.value = false;
  }
}

function aoConfirmarPagamento() {
  mensagem.value = "Pagamento confirmado! Agendamento marcado como pago.";
}

function fecharPagamento() {
  pagamento.value = null;
  router.push("/home-familia");
}

onMounted(() => {
  if (!localStorage.getItem("access_token")) {
    irParaLogin();
    return;
  }

  carregarBaba();
});
</script>

<template>
  <div class="pagina">
    <h1>Agendamento</h1>

    <div v-if="carregando" class="card">
      <p>Carregando babá...</p>
    </div>

    <div v-else-if="erro && !baba" class="card erro">
      {{ erro }}
      <button class="btn-secundario" type="button" @click="router.back()">
        Voltar
      </button>
    </div>

    <template v-else>
      <div class="card">
        <img v-if="fotoBaba" :src="fotoBaba" :alt="nomeBaba" class="foto" />
        <div v-else class="foto-vazia">👶</div>

        <h2>{{ nomeBaba }}</h2>

        <div class="info-linha">
          <span>📍 {{ baba.usuario?.cidade || "Cidade não informada" }}</span>
          <span>🕐 {{ baba.experiencia_anos || 0 }} anos de experiência</span>
        </div>

        <p v-if="baba.descricao" class="descricao">{{ baba.descricao }}</p>

        <p class="preco">R$ {{ Number(baba.valor_hora || 0).toFixed(2) }}/hora</p>
      </div>

      <div class="card">
        <h3>Dados do cuidado</h3>

        <label class="campo">
          <span>Data</span>
          <input v-model="data" type="date" :min="data" />
        </label>

        <div class="linha-campos">
          <label class="campo">
            <span>Início</span>
            <input v-model="horaInicio" type="time" />
          </label>

          <label class="campo">
            <span>Fim</span>
            <input v-model="horaFim" type="time" />
          </label>
        </div>

        <label class="campo">
          <span>Quantidade de crianças</span>
          <input v-model.number="qtdCriancas" type="number" min="1" max="20" />
        </label>

        <p class="duracao">
          {{ horas.toFixed(1) }} hora(s) × R$ {{ valorHora.toFixed(2) }}
        </p>
      </div>

      <div class="card acoes">
        <p class="preco-grande">{{ totalFormatado }}</p>
        <p class="label">Valor total estimado</p>

        <button
          class="btn-principal"
          type="button"
          :disabled="processando || !podePagar"
          @click="efetuarPagamento"
        >
          {{
            processando
              ? "Gerando PIX..."
              : "💰 Gerar PIX e agendar"
          }}
        </button>

        <button class="btn-secundario" type="button" @click="router.back()">
          Voltar
        </button>

        <p v-if="!podePagar" class="aviso">
          Esta babá ainda não cadastrou valor/hora.
        </p>

        <p v-if="erro" class="erro">{{ erro }}</p>
        <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>

        <div class="info">
          <p class="titulo">Pagamento seguro</p>
          <p>
            O QR Code PIX é gerado pela Efí e o agendamento só é marcado
            como pago após a confirmação do banco.
          </p>
        </div>
      </div>
    </template>

    <PagamentoPix
      v-if="pagamento && agendamentoId"
      :agendamento-id="agendamentoId"
      :pagamento-inicial="pagamento"
      @pago="aoConfirmarPagamento"
      @fechar="fecharPagamento"
    />
  </div>
</template>

<style scoped>
.pagina {
  padding: 16px;
  background: #f9fafb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.foto {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.foto-vazia {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
}

h3 {
  font-size: 16px;
  font-weight: 700;
}

.info-linha {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.descricao {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.preco {
  font-size: 20px;
  font-weight: bold;
  color: #f6339a;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
}

.campo input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 11px 12px;
  font-size: 14px;
  color: #111;
  background: #fff;
}

.linha-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.duracao {
  font-size: 13px;
  color: #777;
}

.acoes {
  text-align: center;
}

.preco-grande {
  font-size: 32px;
  font-weight: bold;
  color: #f6339a;
}

.label {
  font-size: 13px;
  color: #888;
  margin-top: -8px;
}

.btn-principal {
  background: #f6339a;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
}

.btn-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secundario {
  background: white;
  color: #333;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
}

.info {
  border-top: 1px solid #eee;
  padding-top: 12px;
  font-size: 13px;
  color: #555;
  text-align: left;
}

.titulo {
  font-weight: bold;
  margin-bottom: 4px;
}

.aviso {
  font-size: 12px;
  color: #b45309;
}

.erro {
  font-size: 13px;
  color: #b91c1c;
}

.sucesso {
  font-size: 13px;
  color: #15803d;
  font-weight: 600;
}
</style>
