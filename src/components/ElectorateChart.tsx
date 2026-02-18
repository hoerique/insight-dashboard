import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CityData } from "@/data/electionData";

interface ElectorateChartProps {
  data: CityData[];
}

const COLORS = [
  "hsl(45 93% 58%)",
  "hsl(210 70% 45%)",
  "hsl(160 60% 45%)",
  "hsl(340 65% 55%)",
  "hsl(270 60% 55%)",
];

const ElectorateChart = ({ data }: ElectorateChartProps) => {
  const top5 = [...data].sort((a, b) => b.eleitores - a.eleitores).slice(0, 5);
  const othersTotal = data
    .filter((c) => !top5.includes(c))
    .reduce((sum, c) => sum + c.eleitores, 0);

  const chartData = [
    ...top5.map((c) => ({ name: c.cidade, value: c.eleitores })),
    { name: "Outras", value: othersTotal },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Distribuição de Eleitores
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString("pt-BR")}
            contentStyle={{
              backgroundColor: "hsl(222 44% 9%)",
              border: "1px solid hsl(215 32% 17%)",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(210 40% 94%)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectorateChart;
