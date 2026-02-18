import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useElectionData } from "@/hooks/useElectionData";
import KpiCard from "@/components/KpiCard";
import CityTable from "@/components/CityTable";
import VotesChart from "@/components/VotesChart";
import ElectorateChart from "@/components/ElectorateChart";
import PerformanceCards from "@/components/PerformanceCards";
import { Users, Vote, Target, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ELEITOR_FILTERS = [
  { label: "Todas", value: "all" },
  { label: "Até 50 mil", value: "0-50000" },
  { label: "50 mil – 200 mil", value: "50000-200000" },
  { label: "200 mil – 500 mil", value: "200000-500000" },
  { label: "Acima de 500 mil", value: "500000+" },
] as const;

const YEAR_OPTIONS = [
  { key: "2018", label: "2018", color: "hsl(210 70% 45%)" },
  { key: "2022", label: "2022", color: "hsl(160 60% 45%)" },
  { key: "2026", label: "Meta 2026", color: "hsl(45 93% 58%)" },
] as const;

type YearKey = "2018" | "2022" | "2026";

const Index = () => {
  const { data: electionData = [], isLoading, isError } = useElectionData();
  const [search, setSearch] = useState("");
  const [faixaEleitores, setFaixaEleitores] = useState("all");
  const [activeYears, setActiveYears] = useState<Set<YearKey>>(new Set(["2018", "2022", "2026"]));

  const toggleYear = (key: YearKey) => {
    setActiveYears((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // manter pelo menos 1 ativo
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return electionData.filter((city) => {
      const matchSearch = city.cidade.toLowerCase().includes(search.toLowerCase());
      let matchFaixa = true;
      if (faixaEleitores !== "all") {
        if (faixaEleitores === "500000+") {
          matchFaixa = city.eleitores >= 500000;
        } else {
          const [min, max] = faixaEleitores.split("-").map(Number);
          matchFaixa = city.eleitores >= min && city.eleitores < max;
        }
      }
      return matchSearch && matchFaixa;
    });
  }, [search, faixaEleitores, electionData]);

  const totalEleitores = electionData.reduce((s, c) => s + c.eleitores, 0);
  const totalCidades = electionData.length;
  const totalVotos2022 = electionData.reduce((s, c) => s + (c.votos2022 ?? 0), 0);
  const totalVotos2018 = electionData.reduce((s, c) => s + (c.votos2018 ?? 0), 0);
  const totalAlvo2026 = electionData.reduce((s, c) => s + (c.metaMax ?? c.metaMed ?? c.metaMin ?? 0), 0);
  const totalMinimo2026 = electionData.reduce((s, c) => s + (c.metaMin ?? c.metaMed ?? c.metaMax ?? 0), 0);

  const crescimentoVs2018 = totalVotos2018 > 0
    ? (((totalVotos2022 - totalVotos2018) / totalVotos2018) * 100).toFixed(1)
    : "0.0";
  const crescimentoVs2022 = totalVotos2022 > 0
    ? (((totalAlvo2026 - totalVotos2022) / totalVotos2022) * 100).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Carregando dados eleitorais…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="rounded-lg border border-destructive/50 bg-card p-8 text-center max-w-md">
          <p className="text-destructive font-semibold text-lg mb-2">Erro ao carregar dados</p>
          <p className="text-muted-foreground text-sm">Verifique a conexão com o Supabase e tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Eleições 2026 <span className="text-primary">— Dep. Estadual RJ</span>
            </h1>
            <p className="text-xs text-muted-foreground">Painel de Metas e Análise Eleitoral</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filtro Global de Anos */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2 py-1.5">
              <span className="text-xs text-muted-foreground font-medium mr-1">Ano:</span>
              {YEAR_OPTIONS.map(({ key, label, color }) => {
                const active = activeYears.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleYear(key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-200",
                      active
                        ? "border-transparent text-background shadow-sm"
                        : "border-border text-muted-foreground bg-transparent hover:border-primary/40"
                    )}
                    style={active ? { backgroundColor: color, borderColor: color } : {}}
                    title={active ? `Ocultar ${label}` : `Mostrar ${label}`}
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: active ? "rgba(255,255,255,0.8)" : color }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {totalCidades} cidades
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="flex flex-wrap gap-4">
          <KpiCard
            className="flex-1 min-w-[180px]"
            title="Total de Eleitores"
            value={totalEleitores}
            icon={<Users className="h-5 w-5" />}
            subtitle={`${totalCidades} cidades`}
          />
          {activeYears.has("2018") && (
            <KpiCard
              className="flex-1 min-w-[180px]"
              title="Votos 2018"
              value={totalVotos2018}
              icon={<Vote className="h-5 w-5" />}
            />
          )}
          {activeYears.has("2022") && (
            <KpiCard
              className="flex-1 min-w-[180px]"
              title="Votos 2022"
              value={totalVotos2022}
              icon={<Vote className="h-5 w-5" />}
              trend={activeYears.has("2018") ? (Number(crescimentoVs2018) >= 0 ? "up" : "down") : undefined}
              trendValue={activeYears.has("2018") ? `${crescimentoVs2018}% vs 2018` : undefined}
            />
          )}
          {activeYears.has("2026") && (
            <>
              <KpiCard
                className="flex-1 min-w-[180px]"
                title="Meta Alvo 2026"
                value={totalAlvo2026}
                icon={<Target className="h-5 w-5" />}
                trend={activeYears.has("2022") ? "up" : undefined}
                trendValue={activeYears.has("2022") ? `${crescimentoVs2022}% vs 2022` : undefined}
              />
              <KpiCard
                className="flex-1 min-w-[180px]"
                title="Meta Mínima 2026"
                value={totalMinimo2026}
                icon={<TrendingUp className="h-5 w-5" />}
                subtitle="Cenário conservador"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <VotesChart data={filtered} activeYears={activeYears} />
          </div>
          <ElectorateChart data={filtered} />
        </div>

        {/* Performance Cards */}
        <PerformanceCards data={filtered} activeYears={activeYears} />

        {/* Filters + Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Buscar cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs bg-card border-border"
            />
            <Select value={faixaEleitores} onValueChange={setFaixaEleitores}>
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder="Faixa de eleitores" />
              </SelectTrigger>
              <SelectContent>
                {ELEITOR_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="self-center text-xs text-muted-foreground">
              {filtered.length} cidade{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <CityTable data={filtered} activeYears={activeYears} />
        </div>
      </main>
    </div>
  );
};

export default Index;
