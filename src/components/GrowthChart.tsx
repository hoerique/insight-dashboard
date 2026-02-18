import { CityData } from "@/data/electionData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

interface GrowthChartProps {
  data: CityData[];
}

const GrowthChart = ({ data }: GrowthChartProps) => {
  const chartData = data
    .filter((c) => c.votos2018 && c.votos2022 && c.votos2018 > 0)
    .map((c) => {
      const growth = ((c.votos2022! - c.votos2018!) / c.votos2018!) * 100;
      return {
        name: c.cidade.length > 14 ? c.cidade.slice(0, 14) + "…" : c.cidade,
        crescimento: parseFloat(growth.toFixed(1)),
      };
    })
    .sort((a, b) => b.crescimento - a.crescimento)
    .slice(0, 20);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Crescimento 2018 → 2022 (%)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 90, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 32% 17%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} unit="%" />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} width={85} />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: "hsl(222 44% 9%)",
              border: "1px solid hsl(215 32% 17%)",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(210 40% 94%)",
            }}
          />
          <ReferenceLine x={0} stroke="hsl(215 20% 55%)" strokeDasharray="3 3" />
          <Bar dataKey="crescimento" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.crescimento >= 0 ? "hsl(160 60% 45%)" : "hsl(0 72% 51%)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
