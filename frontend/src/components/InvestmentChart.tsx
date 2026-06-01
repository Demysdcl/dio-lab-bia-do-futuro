import type { InvestmentPoint } from "../types";

type InvestmentChartProps = {
  data: InvestmentPoint[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

export function InvestmentChart({ data }: InvestmentChartProps) {
  const width = 420;
  const height = 150;
  const padding = 26;
  const values = data.map((point) => point.valor_acumulado);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((point, index) => {
    const x = padding + index * step;
    const y = height - padding - ((point.valor_acumulado - min) / range) * (height - padding * 2);

    return { ...point, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points.at(-1)?.x ?? padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolucao em seis meses">
      <path className="chart-grid" d={`M ${padding} ${height - padding} H ${width - padding}`} />
      <path className="chart-area" d={area} />
      <path className="chart-line" d={path} />
      {points.map((point, index) => {
        const textAnchor = index === 0 ? "start" : index === points.length - 1 ? "end" : "middle";
        const valueY = point.y < 24 ? point.y + 20 : point.y - 10;

        return (
          <g key={point.mes}>
            <circle className="chart-dot" cx={point.x} cy={point.y} r="4" />
            <text className="chart-value" x={point.x} y={valueY} textAnchor={textAnchor}>
              {currencyFormatter.format(point.valor_acumulado)}
            </text>
            <text className="chart-label" x={point.x} y={height - 4} textAnchor="middle">
              {point.mes.replace("Mes", "M")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
