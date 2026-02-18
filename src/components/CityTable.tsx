import { CityData } from "@/data/electionData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CityTableProps {
  data: CityData[];
}

const fmt = (v: number | null) => (v != null ? v.toLocaleString("pt-BR") : "—");

const CityTable = ({ data }: CityTableProps) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-secondary">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8">#</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cidade</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Eleitores</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">2018</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">2022</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-primary text-right">Meta Max</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-primary text-right">Meta Méd</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-primary text-right">Meta Mín</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-accent text-right">Liderança</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((city, i) => (
              <TableRow
                key={city.id}
                className="border-border/50 transition-colors hover:bg-secondary/50"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <TableCell className="text-muted-foreground text-xs">{city.id}</TableCell>
                <TableCell className="font-medium text-sm">{city.cidade}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{city.eleitores.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{fmt(city.votos2018)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{fmt(city.votos2022)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums text-primary font-medium">{fmt(city.metaMax)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums text-primary font-medium">{fmt(city.metaMed)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums text-primary font-medium">{fmt(city.metaMin)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums text-accent font-semibold">{fmt(city.lideranca)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CityTable;
