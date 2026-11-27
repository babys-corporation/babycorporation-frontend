// Extrai a primeira mensagem de erro que o backend (DRF) devolveu,
// seja qual for o campo: { detail: "..." }, { campo: ["..."] }, ["..."]...
function primeiraMensagem(valor: unknown): string | null {
  if (typeof valor === "string") return valor.trim() || null;

  if (Array.isArray(valor)) {
    for (const item of valor) {
      const msg = primeiraMensagem(item);
      if (msg) return msg;
    }
    return null;
  }

  if (valor && typeof valor === "object") {
    const obj = valor as Record<string, unknown>;
    if ("detail" in obj) {
      const msg = primeiraMensagem(obj.detail);
      if (msg) return msg;
    }
    for (const item of Object.values(obj)) {
      const msg = primeiraMensagem(item);
      if (msg) return msg;
    }
  }

  return null;
}

export function mensagemDeErro(e: any, padrao: string): string {
  const data = e?.response?.data;
  // Respostas HTML (ex.: página de erro 500) não são mensagens para o usuário
  if (typeof data === "string" && data.trim().startsWith("<")) return padrao;
  return primeiraMensagem(data) || padrao;
}
