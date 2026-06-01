import { describe, expect, it } from "vitest";
import { extractJsonArray } from "./investments";

describe("extractJsonArray", () => {
  it("extracts investments from a fenced json response", () => {
    const result = extractJsonArray(`\`\`\`json
[
  {
    "categoria": "Renda Fixa",
    "ativo": "Tesouro Selic",
    "prazo": "Diario",
    "liquidez": "D+1",
    "valor_minimo": 100,
    "descricao": "Opcao de baixa volatilidade.",
    "dataset_6_meses": [
      {"mes": "Aporte", "valor_acumulado": 100.5},
      {"mes": "Mes 2", "valor_acumulado": 201},
      {"mes": "Mes 3", "valor_acumulado": 302},
      {"mes": "Mes 4", "valor_acumulado": 403},
      {"mes": "Mes 5", "valor_acumulado": 504},
      {"mes": "Mes 6", "valor_acumulado": 605}
    ]
  }
]
\`\`\``);

    expect(result).toHaveLength(1);
    expect(result[0].ativo).toBe("Tesouro Selic");
    expect(result[0].dataset_6_meses[5].valor_acumulado).toBe(605);
  });

  it("throws when the response does not include a json array", () => {
    expect(() => extractJsonArray("sem json")).toThrow("array JSON");
  });
});
