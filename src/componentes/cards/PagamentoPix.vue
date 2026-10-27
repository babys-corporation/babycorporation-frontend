<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  getPagamento,
  type PagamentoPix,
  type StatusPagamento,
} from "@/api/agendamentoApi";

const props = defineProps<{
  agendamentoId: number;
  pagamentoInicial: PagamentoPix;
}>();

const emit = defineEmits<{
  (e: "pago", pagamento: PagamentoPix): void;
  (e: "fechar"): void;
}>();

const pagamento = ref<PagamentoPix>({ ...props.pagamentoInicial });
const copiado = ref(false);
const verificando = ref(false);
const erro = ref("");
let timer: ReturnType<typeof setInterval> | undefined;

const pago = computed(() => pagamento.value.status === "PAGO");

const qrSrc = computed(() => {
  const bruto = pagamento.value.qr_code_base64;

  if (!bruto) return "";
  if (bruto.startsWith("data:")) return bruto;

  return `data:image/png;base64,${bruto}`;
});

const rotulos: Record<StatusPagamento, string> = {
  PENDENTE: "Aguardando pagamento",
  PAGO: "Pagamento confirmado",
  EXPIRADO: "QR Code expirado",
  CANCELADO: "Pagamento cancelado",
  ERRO: "Erro ao gerar cobrança",
};

const statusLabel = computed(() => rotulos[pagamento.value.status] ?? pagamento.value.status);

const valorFormatado = computed(() => {
  const valor = Number(pagamento.value.valor ?? 0);
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
});

function pararPolling() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

async function copiarCodigo() {
  if (!pagamento.value.copia_e_cola) return;

  try {
    await navigator.clipboard.writeText(pagamento.value.copia_e_cola);
    copiado.value = true;
    setTimeout(() => (copiado.value = false), 2000);
  } catch {
    erro.value = "Não foi possível copiar. Selecione o código manualmente.";
  }
}

async function verificarPagamento() {
  verificando.value = true;
  erro.value = "";

  try {
    const { data } = await getPagamento(props.agendamentoId);
    pagamento.value = data;

    if (data.status === "PAGO") {
      pararPolling();
      emit("pago", data);
    }
  } catch {
    erro.value = "Não foi possível consultar o pagamento agora.";
  } finally {
    verificando.value = false;
  }
}

function iniciarPolling() {
  if (pago.value) return;
  timer = setInterval(verificarPagamento, 5000);
}

onMounted(iniciarPolling);
onBeforeUnmount(pararPolling);
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
        <p>O agendamento foi marcado como pago e já está disponível para a babá.</p>
        <button class="btn-principal" type="button" @click="emit('fechar')">
          Concluir
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
          v-if="pagamento.copia_e_cola"
          class="copia-cola"
          readonly
          :value="pagamento.copia_e_cola"
          @focus="($event.target as HTMLTextAreaElement).select()"
        />

        <button
          v-if="pagamento.copia_e_cola"
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
          :disabled="verificando"
          @click="verificarPagamento"
        >
          {{ verificando ? "Verificando..." : "Já paguei / Verificar agora" }}
        </button>

        <p class="aviso">
          A confirmação é automática pelo webhook da Efí. Esta tela também
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
</style>
