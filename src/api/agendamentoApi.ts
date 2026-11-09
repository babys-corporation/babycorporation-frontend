import api from "./config";

export type StatusAgendamento = "PENDENTE" | "ACEITO" | "RECUSADO";

export type StatusPagamento = "AGUARDANDO" | "PAGO" | "NAO_EXIGIDO";

export interface Agendamento {
  id: number;
  baba: number;
  nome_baba: string;
  pai: number;
  nome_familia: string;
  cidade: string | null;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  preco: string;
  qtd_criancas: number;
  status: StatusAgendamento;
  status_pagamento: StatusPagamento;
  pix_brcode: string | null;
  pix_txid: string | null;
  pagamento_marcado_em: string | null;
  pagamento_confirmado_em: string | null;
  nivel_advertencia_aplicada: number;
  criado_em: string;
}

export interface NovoAgendamento {
  baba: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  qtd_criancas: number;
}

export interface PagamentoInfo {
  id: number;
  preco: string;
  status_pagamento: StatusPagamento;
  pix_brcode: string | null;
  pix_txid: string | null;
}

export const getAgendamentos = () => api.get("/agendamentos/");

export const getAgendamento = (id: number) =>
  api.get<Agendamento>(`/agendamentos/${id}/`);

export const createAgendamento = (dados: NovoAgendamento) =>
  api.post<Agendamento>("/agendamentos/", dados);

export const aceitarAgendamento = (id: number) =>
  api.post<Agendamento>(`/agendamentos/${id}/aceitar/`);

export const recusarAgendamento = (id: number) =>
  api.post<Agendamento>(`/agendamentos/${id}/recusar/`);

export const getPagamento = (id: number) =>
  api.get<PagamentoInfo>(`/agendamentos/${id}/pagamento/`);

export const getPagamentoQrcode = (id: number) =>
  api.get<Blob>(`/agendamentos/${id}/pagamento_qrcode/`, {
    responseType: "blob",
  });

export const marcarPago = (id: number) =>
  api.post<Agendamento>(`/agendamentos/${id}/marcar_pago/`);

export const confirmarPagamento = (id: number) =>
  api.post<Agendamento>(`/agendamentos/${id}/confirmar_pagamento/`);
