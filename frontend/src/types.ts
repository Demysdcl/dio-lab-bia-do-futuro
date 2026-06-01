export type InvestorProfile = "Conservador" | "Moderado" | "Arrojado";

export type InvestmentPoint = {
  mes: string;
  valor_acumulado: number;
};

export type Investment = {
  categoria: string;
  ativo: string;
  prazo: string;
  liquidez: string;
  valor_minimo: number;
  descricao: string;
  dataset_6_meses: InvestmentPoint[];
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
