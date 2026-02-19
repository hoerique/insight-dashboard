import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CityData } from "@/data/electionData";

interface VotesChartProps {
  data: CityData[];
  activeYears: Set<string>;
}

const DEFAULT_YEARS = new Set(["2018", "2022", "2026"]);

const VotesChart = ({ data, activeYears = DEFAULT_YEARS }: VotesChartProps) => {
  const chartData = data.slice(0, 15).map((city) => ({
    name: city.cidade,
    "Votos 2018": city.votos2018 ?? 0,
    "Votos 2022": city.votos2022 ?? 0,
    "Meta 2026": city.metaMax ?? city.metaMed ?? city.metaMin ?? 0,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Comparativo de Votos — Top 15 Cidades
      </h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 32% 17%)" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222 44% 9%)",
              border: "1px solid hsl(215 32% 17%)",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(210 40% 94%)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
          />
          {activeYears.has("2018") && (
            <Bar dataKey="Votos 2018" fill="hsl(210 70% 45%)" radius={[3, 3, 0, 0]} />
          )}
          {activeYears.has("2022") && (
            <Bar dataKey="Votos 2022" fill="hsl(160 60% 45%)" radius={[3, 3, 0, 0]} />
          )}
          {activeYears.has("2026") && (
            <Bar dataKey="Meta 2026" fill="hsl(45 93% 58%)" radius={[3, 3, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VotesChart;
