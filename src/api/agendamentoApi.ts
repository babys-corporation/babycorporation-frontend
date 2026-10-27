import api from "./config";

export type StatusPagamento =
  | "PENDENTE"
  | "PAGO"
  | "EXPIRADO"
  | "CANCELADO"
  | "ERRO";

export interface PagamentoPix {
  id: number;
  agendamento: number;
  txid: string;
  e2e_id: string | null;
  valor: string;
  status: StatusPagamento;
  copia_e_cola: string;
  qr_code_base64: string;
  criado_em: string;
  atualizado_em: string;
  pago_em: string | null;
}

export interface Agendamento {
  id: number;
  baba: number;
  pai: number;
  nome_familia: string;
  cidade: string | null;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  preco: string;
  qtd_criancas: number;
  status: string;
  pagamento: PagamentoPix | null;
  criado_em: string;
}

export interface NovoAgendamento {
  baba: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  qtd_criancas: number;
  preco?: string;
}

export const getAgendamentos = () => api.get("/agendamentos/");

export const getAgendamento = (id: number) =>
  api.get<Agendamento>(`/agendamentos/${id}/`);

export const createAgendamento = (dados: NovoAgendamento) =>
  api.post<Agendamento>("/agendamentos/", dados);

export const criarPagamentoPix = (agendamentoId: number) =>
  api.post<PagamentoPix>(`/agendamentos/${agendamentoId}/pagar/`);

export const getPagamento = (agendamentoId: number) =>
  api.get<PagamentoPix>(`/agendamentos/${agendamentoId}/pagamento/`);
