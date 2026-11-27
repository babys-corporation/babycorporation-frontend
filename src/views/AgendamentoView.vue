<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBaba, getBabas } from "@/api/babaApi";
import {
  createAgendamento,
  getAgendamento,
  type Agendamento,
} from "@/api/agendamentoApi";
import PagamentoPix from "@/componentes/cards/PagamentoPix.vue";
import { mensagemDeErro } from "@/api/erros";

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
const agendamento = ref<Agendamento | null>(null);
const modalAberto = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

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

const idadeBaba = computed(() => {
  const nascimento = new Date(baba.value?.dtnasc ?? "");
  if (Number.isNaN(nascimento.getTime())) return null;

  const agora = new Date();
  let idade = agora.getFullYear() - nascimento.getFullYear();
  const mes = agora.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && agora.getDate() < nascimento.getDate())) idade--;
  return idade;
});

const localizacaoBaba = computed(
  () =>
    [baba.value?.usuario?.cidade, baba.value?.usuario?.bairro]
      .filter(Boolean)
      .join(", ") || "Localização não informada"
);

function voltarParaBusca() {
  router.push("/buscar-babas");
}

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

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

// Dias sem valor salvo contam como disponíveis (padrão do backend)
const disponibilidade = computed<Record<string, boolean>>(() =>
  Object.fromEntries(
    DIAS_SEMANA.map((dia) => [dia, baba.value?.disponibilidade?.[dia] !== false])
  )
);

const diaEscolhido = computed(() => {
  const [ano, mes, dia] = String(data.value).split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  // getDay(): 0 = domingo; DIAS_SEMANA começa na segunda
  return DIAS_SEMANA[(new Date(ano, mes - 1, dia).getDay() + 6) % 7] ?? null;
});

const diaIndisponivel = computed(
  () => !!diaEscolhido.value && disponibilidade.value[diaEscolhido.value] === false
);

const podeSolicitar = computed(
  () =>
    Boolean(baba.value) &&
    valorHora.value > 0 &&
    horas.value > 0 &&
    !diaIndisponivel.value
);

const statusAgendamentoLabel = computed(() => {
  const status = agendamento.value?.status;

  if (status === "ACEITO") return "Agendamento aceito pela babá";
  if (status === "RECUSADO") return "Agendamento recusado pela babá";
  if (status === "PENDENTE") {
    return "Aguardando a babá receber o Pix e aceitar";
  }

  return "Solicitação enviada";
});

const statusPagamentoLabel = computed(() => {
  const status = agendamento.value?.status_pagamento;

  if (status === "PAGO") return "Pagamento confirmado";
  if (status === "NAO_EXIGIDO") return "Pagamento não exigido";
  if (status === "AGUARDANDO") {
    return agendamento.value?.pagamento_marcado_em
      ? "Aguardando a babá confirmar o recebimento"
      : "Aguardando pagamento via PIX";
  }

  return "";
});

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

function pararPolling() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

async function verificarStatus() {
  if (!agendamentoId.value) return;

  try {
    const { data } = await getAgendamento(agendamentoId.value);
    agendamento.value = data;

    if (data.status === "ACEITO") {
      pararPolling();
      mensagem.value = "A babá confirmou o Pix e aceitou o agendamento!";
    } else if (data.status === "RECUSADO") {
      pararPolling();
      erro.value = "A babá recusou esta solicitação de agendamento.";
    }
  } catch {
    // mantém a tela atual e tenta novamente no próximo ciclo
  }
}

function iniciarPolling() {
  if (timer) return;
  timer = setInterval(verificarStatus, 5000);
}

async function solicitarAgendamento() {
  if (processando.value || agendamentoId.value) return;

  processando.value = true;
  erro.value = "";
  mensagem.value = "";

  try {
    if (!localStorage.getItem("access_token")) {
      irParaLogin();
      return;
    }

    if (!baba.value) {
      erro.value = "Selecione uma babá antes de continuar.";
      return;
    }

    if (!podeSolicitar.value) {
      erro.value =
        "A babá ainda não cadastrou o valor/hora. Não é possível agendar.";
      return;
    }

    const { data: criado } = await createAgendamento({
      baba: baba.value.id,
      data: data.value,
      hora_inicio: `${horaInicio.value}:00`,
      hora_fim: `${horaFim.value}:00`,
      qtd_criancas: Number(qtdCriancas.value),
    });

    agendamento.value = criado;
    agendamentoId.value = criado.id;
    mensagem.value =
      "Solicitação enviada! Pague o Pix para a babá aceitar o agendamento.";

    // O Pix (com o valor do atendimento) já vem junto com a solicitação.
    if (criado.pix_brcode) modalAberto.value = true;

    iniciarPolling();
  } catch (e: any) {
    erro.value = mensagemDeErro(
      e,
      "Não foi possível solicitar o agendamento. Tente novamente."
    );
  } finally {
    processando.value = false;
  }
}

function aoConfirmarPagamento() {
  mensagem.value = "Pagamento confirmado! Agendamento concluído.";
}

function fecharPagamento() {
  modalAberto.value = false;

  if (agendamento.value?.status_pagamento === "PAGO") {
    router.push("/home-familia");
  }
}

onMounted(() => {
  if (!localStorage.getItem("access_token")) {
    irParaLogin();
    return;
  }

  carregarBaba();
});

onBeforeUnmount(pararPolling);
</script>

<template>
  <div class="pagina">
    <div class="voltar" @click="voltarParaBusca">← Voltar para a busca</div>

    <div v-if="carregando" class="card">Carregando perfil...</div>

    <div v-else-if="erro && !baba" class="card erro-card">
      {{ erro }}
    </div>

    <template v-else-if="baba">
      <!-- Cabeçalho do perfil -->
      <div class="card cabecalho">
        <img v-if="fotoBaba" :src="fotoBaba" :alt="`Foto de ${nomeBaba}`" class="foto" />
        <div v-else class="foto foto-vazia">👤</div>

        <div class="identidade">
          <h1>{{ nomeBaba }}</h1>

          <span class="disponivel" :class="{ indisponivel: !baba.disponivel }">
            {{ baba.disponivel ? "Disponível" : "Indisponível" }}
          </span>

          <p v-if="idadeBaba" class="linha-info">{{ idadeBaba }} Anos</p>
          <p class="linha-info">
            {{ baba.experiencia_anos ?? 0 }} ano(s) de experiência
          </p>
          <p class="linha-info">{{ localizacaoBaba }}</p>
        </div>
      </div>

      <!-- Sobre -->
      <div v-if="baba.descricao" class="card">
        <h2>Sobre mim</h2>
        <p>{{ baba.descricao }}</p>
      </div>

      <!-- Informações -->
      <div class="card">
        <h2>Informações</h2>
        <div class="grade">
          <div class="item">
            <span class="rotulo">Formação</span>
            <span>{{ baba.formacao || "Não informada" }}</span>
          </div>
          <div class="item">
            <span class="rotulo">Habilidades</span>
            <span>{{ baba.habilidades || "Não informadas" }}</span>
          </div>
          <div class="item">
            <span class="rotulo">E-mail</span>
            <span>{{ baba.usuario?.email || "Não informado" }}</span>
          </div>
          <div class="item">
            <span class="rotulo">Telefone</span>
            <span>{{ baba.usuario?.telefone || "Não informado" }}</span>
          </div>
        </div>

        <p class="preco">R$ {{ valorHora.toFixed(2) }}/hora</p>
      </div>

      <!-- Agendamento -->
      <div class="card">
        <h2>Agendar um cuidado</h2>

        <div class="formulario">
          <div class="dias">
            <span
              v-for="dia in DIAS_SEMANA"
              :key="dia"
              class="dia"
              :class="[
                disponibilidade[dia] ? 'livre' : 'ocupado',
                { escolhido: dia === diaEscolhido },
              ]"
            >
              {{ dia }}
            </span>
          </div>

          <label class="campo">
            <span>Data</span>
            <input v-model="data" type="date" :min="data" :disabled="!!agendamentoId" />
          </label>

          <div class="linha-campos">
            <label class="campo">
              <span>Início</span>
              <input v-model="horaInicio" type="time" :disabled="!!agendamentoId" />
            </label>

            <label class="campo">
              <span>Fim</span>
              <input v-model="horaFim" type="time" :disabled="!!agendamentoId" />
            </label>
          </div>

          <label class="campo">
            <span>Quantidade de crianças</span>
            <input
              v-model.number="qtdCriancas"
              type="number"
              min="1"
              max="20"
              :disabled="!!agendamentoId"
            />
          </label>

          <div class="total">
            <span class="duracao">
              {{ horas.toFixed(1) }} hora(s) × R$ {{ valorHora.toFixed(2) }}
            </span>
            <strong class="preco-total">{{ totalFormatado }}</strong>
          </div>

          <button
            class="btn-principal"
            type="button"
            :disabled="processando || !podeSolicitar || !!agendamentoId"
            @click="solicitarAgendamento"
          >
            {{
              processando
                ? "Enviando solicitação..."
                : agendamentoId
                  ? "Solicitação enviada"
                  : "Agendar cuidado"
            }}
          </button>

          <p v-if="diaIndisponivel" class="aviso">
            A babá não atende neste dia da semana ({{ diaEscolhido }}).
            Escolha outra data.
          </p>
          <p v-else-if="!podeSolicitar && valorHora <= 0" class="aviso">
            Esta babá ainda não cadastrou valor/hora.
          </p>

          <p v-if="erro" class="erro">{{ erro }}</p>
          <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>

          <div v-if="agendamento" class="status-box">
            <p class="titulo">{{ statusAgendamentoLabel }}</p>
            <p v-if="statusPagamentoLabel" class="status-pagamento">
              {{ statusPagamentoLabel }}
            </p>
            <button
              v-if="
                agendamento.pix_brcode &&
                agendamento.status !== 'RECUSADO' &&
                agendamento.status_pagamento === 'AGUARDANDO'
              "
              class="btn-principal"
              type="button"
              @click="modalAberto = true"
            >
              Ver QR Code Pix
            </button>
          </div>

          <p class="info">
            Ao agendar, você recebe o QR Code Pix da babá com o valor do
            atendimento. Ela aceita o agendamento depois de receber o Pix.
          </p>
        </div>
      </div>
    </template>

    <PagamentoPix
      v-if="modalAberto && agendamento"
      :agendamento="agendamento"
      @pago="aoConfirmarPagamento"
      @fechar="fecharPagamento"
    />
  </div>
</template>

<style scoped>
.pagina {
  padding: 16px;
  background: var(--cor-fundo);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.voltar {
  align-self: flex-start;
  color: var(--cor-acento);
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(70, 52, 60, 0.06);
}

.cabecalho {
  display: flex;
  gap: 28px;
  align-items: center;
  padding: 28px 32px;
}

.identidade {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  text-align: left;
}

.foto {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.foto-vazia {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: var(--cor-campo);
}

.identidade h1 {
  margin: 0;
  font-size: 24px;
  overflow-wrap: anywhere;
}

.disponivel {
  display: inline-block;
  background: #22c55e;
  color: white;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: bold;
  margin-bottom: 6px;
}

.disponivel.indisponivel {
  background: var(--cor-acento);
}

.linha-info {
  margin: 0;
  font-size: 14px;
  color: var(--cor-texto-suave);
}

.card h2 {
  font-size: 17px;
  margin: 0 0 10px;
  text-align: center;
}

.card > p {
  font-size: 14px;
  color: var(--cor-texto-suave);
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.item {
  background: var(--cor-campo);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: var(--cor-texto);
  overflow-wrap: anywhere;
}

.rotulo {
  font-size: 12px;
  font-weight: bold;
  color: var(--cor-acento);
}

.card > p.preco {
  color: var(--cor-texto-suave);
  font-size: 15px;
  font-weight: bold;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dias {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.dia {
  border-radius: 10px;
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  border: 2px solid transparent;
}

.dia.livre {
  background: #dcfce7;
  color: #15803d;
}

.dia.ocupado {
  background: #fee2e2;
  color: #b91c1c;
}

.dia.escolhido {
  border-color: currentColor;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--cor-texto-suave);
  font-weight: 600;
  text-align: center;
}

.campo input {
  border: 1px solid var(--cor-borda);
  border-radius: 10px;
  padding: 11px 12px;
  font-size: 14px;
  color: var(--cor-texto);
  background: var(--cor-fundo);
}

.campo input:disabled {
  background: var(--cor-campo);
  color: var(--cor-texto-suave);
}

.linha-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.total {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.duracao {
  font-size: 13px;
  color: var(--cor-texto-suave);
}

.preco-total {
  font-size: 28px;
  color: var(--cor-acento);
}

.btn-principal {
  background: var(--degrade);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 6px 16px rgba(70, 52, 60, 0.25);
}

.btn-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info {
  font-size: 12px;
  color: var(--cor-texto-suave);
  text-align: center;
}

.status-box {
  background: var(--cor-campo);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-pagamento {
  font-size: 13px;
  color: #b45309;
}

.titulo {
  font-weight: bold;
}

.aviso {
  font-size: 12px;
  color: #b45309;
  text-align: center;
}

.erro {
  font-size: 13px;
  color: #b91c1c;
  text-align: center;
}

.erro-card {
  text-align: center;
  color: #b91c1c;
  background: #fee2e2;
}

.sucesso {
  font-size: 13px;
  color: #15803d;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 480px) {
  .cabecalho {
    flex-direction: column;
    gap: 18px;
    padding: 24px 20px;
  }

  .identidade {
    align-items: center;
    text-align: center;
  }
}
</style>
