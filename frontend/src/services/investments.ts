import type { Investment } from "../types";

export function extractJsonArray(rawText: string): Investment[] {
  const normalized = rawText.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = normalized.indexOf("[");
  const end = normalized.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("A resposta da IA nao contem um array JSON valido.");
  }

  const parsed: unknown = JSON.parse(normalized.slice(start, end + 1));

  if (!Array.isArray(parsed)) {
    throw new Error("A resposta da IA precisa ser uma lista de investimentos.");
  }

  return parsed.map(validateInvestment);
}

function validateInvestment(item: unknown): Investment {
  if (!isRecord(item)) {
    throw new Error("Item de investimento invalido.");
  }

  const dataset = item.dataset_6_meses;

  if (!Array.isArray(dataset)) {
    throw new Error("Dataset de seis meses ausente.");
  }

  return {
    categoria: readString(item, "categoria"),
    ativo: readString(item, "ativo"),
    prazo: readString(item, "prazo"),
    liquidez: readString(item, "liquidez"),
    valor_minimo: readNumber(item, "valor_minimo"),
    descricao: readString(item, "descricao"),
    dataset_6_meses: dataset.map((point) => {
      if (!isRecord(point)) {
        throw new Error("Ponto do dataset invalido.");
      }

      return {
        mes: readString(point, "mes"),
        valor_acumulado: readNumber(point, "valor_acumulado"),
      };
    }),
  };
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Campo textual invalido: ${key}.`);
  }

  return value;
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Campo numerico invalido: ${key}.`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
