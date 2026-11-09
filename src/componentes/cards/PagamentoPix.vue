<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  getAgendamento,
  getPagamentoQrcode,
  marcarPago,
  type Agendamento,
} from "@/api/agendamentoApi";

const props = defineProps<{
  agendamento: Agendamento;
}>();

const emit = defineEmits<{
  (e: "pago"): void;
  (e: "fechar"): void;
}>();

const agendamento = ref<Agendamento>({ ...props.agendamento });
const copiado = ref(false);
const verificando = ref(false);
const avisando = ref(false);
const erro = ref("");
const qrSrc = ref("");
let timer: ReturnType<typeof setInterval> | undefined;
let qrUrl: string | undefined;

const pago = computed(
  () => agendamento.value.status_pagamento === "PAGO"
);

const recusado = computed(() => agendamento.value.status === "RECUSADO");

const semChave = computed(
  () => agendamento.value.status_pagamento === "NAO_EXIGIDO"
);

const pagamentoAvisado = computed(() =>
  Boolean(agendamento.value.pagamento_marcado_em)
);

const valorFormatado = computed(() => {
  const valor = Number(agendamento.value.preco ?? 0);
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
});

const statusLabel = computed(() => {
  if (pago.value) return "Pagamento confirmado";
  if (semChave.value) return "Pagamento não exigido";

  if (pagamentoAvisado.value) {
    return "Aguardando a babá confirmar o recebimento";
  }

  return "Aguardando pagamento";
});

function pararPolling() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

function liberarQrCode() {
  if (qrUrl) {
    URL.revokeObjectURL(qrUrl);
    qrUrl = undefined;
  }
}

async function copiarCodigo() {
  const codigo = agendamento.value.pix_brcode;
  if (!codigo) return;

  try {
    await navigator.clipboard.writeText(codigo);
    copiado.value = true;
    setTimeout(() => (copiado.value = false), 2000);
  } catch {
    erro.value = "Não foi possível copiar. Selecione o código manualmente.";
  }
}

async function carregarQrCode() {
  if (!agendamento.value.pix_brcode) return;

  try {
    const { data } = await getPagamentoQrcode(agendamento.value.id);
    liberarQrCode();
    qrUrl = URL.createObjectURL(data);
    qrSrc.value = qrUrl;
  } catch {
    qrSrc.value = "";
  }
}

async function verificarPagamento() {
  verificando.value = true;
  erro.value = "";

  try {
    const { data } = await getAgendamento(agendamento.value.id);
    agendamento.value = data;

    if (data.status_pagamento === "PAGO") {
      pararPolling();
      emit("pago");
    } else if (data.status === "RECUSADO") {
      pararPolling();
    }
  } catch {
    erro.value = "Não foi possível consultar o agendamento agora.";
  } finally {
    verificando.value = false;
  }
}

async function avisarPagamento() {
  avisando.value = true;
  erro.value = "";

  try {
    const { data } = await marcarPago(agendamento.value.id);
    agendamento.value = data;
  } catch (e: any) {
    erro.value =
      e?.response?.data?.detail ||
      "Não foi possível avisar o pagamento. Tente novamente.";
  } finally {
    avisando.value = false;
  }
}

function iniciarPolling() {
  if (pago.value || recusado.value) return;
  timer = setInterval(verificarPagamento, 5000);
}

onMounted(async () => {
  await carregarQrCode();
  iniciarPolling();
});

onBeforeUnmount(() => {
  pararPolling();
  liberarQrCode();
});
</script>

<template>
  <div class="overlay" @click.self="emit('fechar')">
    <div class="modal">
      <button class="fechar" type="button" aria-label="Fechar" @click="emit('fechar')">
        ×
      </button>

      <div v-if="pago" class="sucesso">
        <div class="icone">✓</div>
        <h2>Pagamento confirmado!</h2>
        <p>
          A babá confirmou o recebimento do Pix e aceitou o agendamento.
        </p>
        <button class="btn-principal" type="button" @click="emit('fechar')">
          Concluir
        </button>
      </div>

      <div v-else-if="recusado" class="sucesso">
        <div class="icone aviso">!</div>
        <h2>Agendamento recusado</h2>
        <p>
          A babá recusou este agendamento. Se você já pagou o Pix, combine a
          devolução diretamente com ela.
        </p>
        <button class="btn-principal" type="button" @click="emit('fechar')">
          Entendi
        </button>
      </div>

      <div v-else-if="semChave" class="sucesso">
        <div class="icone aviso">!</div>
        <h2>Agendamento aceito</h2>
        <p>
          A babá aceitou o agendamento, mas ainda não cadastrou uma chave Pix.
          Combine o pagamento diretamente com ela.
        </p>
        <button class="btn-principal" type="button" @click="emit('fechar')">
          Entendi
        </button>
      </div>

      <template v-else>
        <h2>Pagamento via PIX</h2>
        <p class="subtitulo">
          Escaneie o QR Code no app do seu banco ou use o copia e cola.
        </p>

        <p class="valor">{{ valorFormatado }}</p>

        <img v-if="qrSrc" :src="qrSrc" alt="QR Code PIX" class="qrcode" />
        <div v-else class="qr-vazio">QR Code indisponível</div>

        <textarea
          v-if="agendamento.pix_brcode"
          class="copia-cola"
          readonly
          :value="agendamento.pix_brcode"
          @focus="($event.target as HTMLTextAreaElement).select()"
        />

        <button
          v-if="agendamento.pix_brcode"
          class="btn-secundario"
          type="button"
          @click="copiarCodigo"
        >
          {{ copiado ? "Código copiado!" : "Copiar código PIX" }}
        </button>

        <p class="status" :class="{ pago: pago }">{{ statusLabel }}</p>

        <button
          class="btn-principal"
          type="button"
          :disabled="avisando || pagamentoAvisado"
          @click="avisarPagamento"
        >
          {{
            avisando
              ? "Avisando..."
              : pagamentoAvisado
                ? "Pagamento avisado"
                : "Já paguei / Avisar a babá"
          }}
        </button>

        <button
          class="btn-secundario"
          type="button"
          :disabled="verificando"
          @click="verificarPagamento"
        >
          {{ verificando ? "Verificando..." : "Verificar agora" }}
        </button>

        <p class="aviso">
          A babá aceita o agendamento depois de receber o Pix. Esta tela
          verifica o status a cada 5 segundos.
        </p>
      </template>

      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 92vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}

.fechar {
  position: absolute;
  top: 10px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  color: #888;
  cursor: pointer;
}

h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111;
}

.subtitulo {
  font-size: 13px;
  color: #666;
}

.valor {
  font-size: 30px;
  font-weight: 800;
  color: #f6339a;
}

.qrcode {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 12px;
  object-fit: contain;
}

.qr-vazio {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 12px;
  color: #888;
  font-size: 13px;
}

.copia-cola {
  width: 100%;
  height: 76px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 11px;
  color: #444;
  word-break: break-all;
}

.status {
  font-size: 13px;
  font-weight: 700;
  color: #b45309;
}

.status.pago {
  color: #15803d;
}

.btn-principal,
.btn-secundario {
  width: 100%;
  border-radius: 10px;
  padding: 13px;
  font-size: 15px;
  cursor: pointer;
}

.btn-principal {
  background: #f6339a;
  color: #fff;
  border: none;
}

.btn-principal:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secundario {
  background: #fff;
  color: #333;
  border: 1.5px solid #ddd;
}

.aviso {
  font-size: 11px;
  color: #999;
}

.erro {
  font-size: 12px;
  color: #b91c1c;
}

.sucesso {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
}

.icone {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  font-size: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone.aviso {
  background: #f59e0b;
}
</style>
