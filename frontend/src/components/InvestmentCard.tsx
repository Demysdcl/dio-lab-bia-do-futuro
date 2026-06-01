import type { Investment } from "../types";
import { InvestmentChart } from "./InvestmentChart";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type InvestmentCardProps = {
  investment: Investment;
};

export function InvestmentCard({ investment }: InvestmentCardProps) {
  return (
    <article className="investment-card">
      <div className="investment-header">
        <div>
          <span className="category">{investment.categoria}</span>
          <h3>{investment.ativo}</h3>
        </div>
        <strong>{brlFormatter.format(investment.valor_minimo)}</strong>
      </div>

      <p>{investment.descricao}</p>

      <dl className="investment-facts">
        <div>
          <dt>Prazo</dt>
          <dd>{investment.prazo}</dd>
        </div>
        <div>
          <dt>Liquidez</dt>
          <dd>{investment.liquidez}</dd>
        </div>
        <div>
          <dt>Valor minimo</dt>
          <dd>{brlFormatter.format(investment.valor_minimo)}</dd>
        </div>
      </dl>

      <InvestmentChart data={investment.dataset_6_meses} />
    </article>
  );
}
