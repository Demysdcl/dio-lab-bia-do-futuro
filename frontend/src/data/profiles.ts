import type { InvestorProfile } from "../types";

export const profiles: Array<{
  name: InvestorProfile;
  shortDescription: string;
  risk: string;
}> = [
  {
    name: "Conservador",
    shortDescription:
      "Busca estabilidade, aceita pouca oscilacao e prioriza previsibilidade.",
    risk: "Baixo risco",
  },
  {
    name: "Moderado",
    shortDescription:
      "Aceita variacoes controladas em troca de melhor potencial no medio prazo.",
    risk: "Risco equilibrado",
  },
  {
    name: "Arrojado",
    shortDescription:
      "Tolera volatilidade relevante mirando crescimento patrimonial no longo prazo.",
    risk: "Maior risco",
  },
];
