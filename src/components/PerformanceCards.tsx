import { CityData } from "@/data/electionData";
import { TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceCardsProps {
  data: CityData[];
}

const PerformanceCards = ({ data }: PerformanceCardsProps) => {
  const withGrowth = data
    .filter((c) => c.votos2018 != null && c.votos2022 != null && c.votos2018! > 0)
    .map((c) => ({
      ...c,
      growth: ((c.votos2022! - c.votos2018!) / c.votos2018!) * 100,
      meta: c.metaMax ?? c.metaMed ?? c.metaMin ?? 0,
    }));

  const growing = withGrowth.filter((c) => c.growth > 0).length;
  const declining = withGrowth.filter((c) => c.growth < 0).length;
  const stable = withGrowth.filter((c) => c.growth === 0).length;

  const topGrowth = [...withGrowth].sort((a, b) => b.growth - a.growth).slice(0, 5);
  const topDecline = [...withGrowth].sort((a, b) => a.growth - b.growth).slice(0, 5);

  const highMeta = [...data].sort((a, b) => {
    const metaA = a.metaMax ?? a.metaMed ?? a.metaMin ?? 0;
    const metaB = b.metaMax ?? b.metaMed ?? b.metaMin ?? 0;
    return metaB - metaA;
  }).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Resumo de Performance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm">Em crescimento</span>
            </div>
            <span className="font-display font-bold text-success">{growing}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm">Em queda</span>
            </div>
            <span className="font-display font-bold text-destructive">{declining}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Estável</span>
            </div>
            <span className="font-display font-bold text-muted-foreground">{stable}</span>
          </div>
        </div>
      </div>

      {/* Top Growth */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-success">
          🚀 Maior Crescimento
        </h3>
        {topGrowth.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="truncate">{c.cidade}</span>
            </div>
            <span className={cn("font-semibold tabular-nums shrink-0", c.growth >= 0 ? "text-success" : "text-destructive")}>
              {c.growth > 0 ? "+" : ""}{c.growth.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      {/* Top Decline */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-destructive">
          ⚠️ Maior Queda
        </h3>
        {topDecline.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="truncate">{c.cidade}</span>
            </div>
            <span className="font-semibold tabular-nums text-destructive shrink-0">
              {c.growth.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceCards;
