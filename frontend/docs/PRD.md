# Consultor de investimentos

## Definition

Front-end project to consume a Gemini LLM response.
The project will have just one screen where the user will select a investor profile.
The profile are:

| Profile | Description |
| -------- | ----------- |
| Conservador | Este investidor busca um meio-termo saudável. Ele já entende que para ganhar um pouco mais é preciso correr algum risco, por isso aceita pequenas oscilações no curto prazo em troca de um rendimento melhor no médio prazo. Ele não quer ver seu patrimônio despencar, mas aceita ver uma variação leve se a perspectiva futura for boa. |
| Moderado | O investidor arrojado possui bom conhecimento do mercado financeiro e entende que a volatilidade é parte do processo. Ele tolera ver seu patrimônio oscilar significativamente para baixo no curto prazo porque está mirando em retornos robustos no longo prazo. A segurança extrema é deixada de lado em prol do crescimento patrimonial. |
| Arrojado | É uma evolução do perfil arrojado. O investidor agressivo não apenas tolera o risco, mas busca ativamente por ele onde enxerga oportunidades de lucros exponenciais. Ele tem estômago para suportar perdas severas de capital e, muitas vezes, utiliza estratégias complexas de alavancagem ou aloca em ativos extremamente voláteis e desregulados. |

After the selection, the system will sent the prompt and the user selection to the LLM.

After the LLM response, the user can interect with the system, sending question about investiments.

## Prompt:

```
Você é um agente financeiro inteligente especializado em investimentos.
Seu objetivo é identificar o perfil de investidor do usuário e fornece um lista investimentos para ele, a lista de conter prazo, valor mínimo, liquidez do investimento e um dataset simulando as transações do cliente em seis meses, considerando o valor mínimo e caso não haja um mínimo utilize 100 reais por mês, gere um JSON com as informações.
O JSON deve ser um array de objetos, cada objeto deve conter as seguintes informações, exemplo:

{
    "categoria": "Renda Fixa (Banco)",
    "ativo": "CDB Pós-Fixado 110% do CDI",
    "prazo": "3 anos",
    "liquidez": "Diária",
    "valor_minimo": 100.00,
    "descricao": "Ideal para a reserva de emergência do perfil moderado, garantindo segurança com rentabilidade um pouco acima da média de mercado e liquidez imediata.",
    "dataset_6_meses": [
        {"mes": "Aporte", "valor_acumulado": 100.82},
        {"mes": "Mês 2", "valor_acumulado": 101.65},
        {"mes": "Mês 3", "valor_acumulado": 102.48},
        {"mes": "Mês 4", "valor_acumulado": 103.32},
        {"mes": "Mês 5", "valor_acumulado": 104.17},
        {"mes": "Mês 6", "valor_acumulado": 105.02}
    ]
}

REGRAS:
1. Sempre baseie suas respostas em dados confiáveis fornecidos por bancos e sites de economia ou finanças.
2. Nunca invente informações financeiras.
3. Se não souber algo, admita e ofereça alternativas.
4. Não responda questões fora do contexto.
```

## Visual

The page must have:

* the options of the profiles to user select
* the list of investments with a chart to each dataset in the list based in the JSON
* A input above the this where the user can interect with the LLM
