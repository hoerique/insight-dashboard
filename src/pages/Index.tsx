import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { electionData, totals } from "@/data/electionData";
import KpiCard from "@/components/KpiCard";
import CityTable from "@/components/CityTable";
import VotesChart from "@/components/VotesChart";
import ElectorateChart from "@/components/ElectorateChart";
import { Users, Vote, Target, TrendingUp } from "lucide-react";

const ELEITOR_FILTERS = [
  { label: "Todas", value: "all" },
  { label: "Até 50 mil", value: "0-50000" },
  { label: "50 mil – 200 mil", value: "50000-200000" },
  { label: "200 mil – 500 mil", value: "200000-500000" },
  { label: "Acima de 500 mil", value: "500000+" },
] as const;

const Index = () => {
  const [search, setSearch] = useState("");
  const [faixaEleitores, setFaixaEleitores] = useState("all");

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
  }, [search, faixaEleitores]);

  const totalEleitores = electionData.reduce((s, c) => s + c.eleitores, 0);
  const totalCidades = electionData.length;
  const crescimento = (((totals.alvo2026 - totals.votos2022) / totals.votos2022) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Eleições 2026 <span className="text-primary">— Dep. Estadual RJ</span>
            </h1>
            <p className="text-xs text-muted-foreground">Painel de Metas e Análise Eleitoral</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {totalCidades} cidades monitoradas
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total de Eleitores"
            value={totalEleitores}
            icon={<Users className="h-5 w-5" />}
            subtitle={`${totalCidades} cidades`}
          />
          <KpiCard
            title="Votos 2022"
            value={totals.votos2022}
            icon={<Vote className="h-5 w-5" />}
            trend="down"
            trendValue="21,7% vs 2018"
          />
          <KpiCard
            title="Meta Alvo 2026"
            value={totals.alvo2026}
            icon={<Target className="h-5 w-5" />}
            trend="up"
            trendValue={`${crescimento}% vs 2022`}
          />
          <KpiCard
            title="Meta Mínima 2026"
            value={totals.minimo2026}
            icon={<TrendingUp className="h-5 w-5" />}
            subtitle="Cenário conservador"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <VotesChart data={filtered} />
          </div>
          <ElectorateChart data={filtered} />
        </div>

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
          <CityTable data={filtered} />
        </div>
      </main>
    </div>
  );
};

export default Index;
