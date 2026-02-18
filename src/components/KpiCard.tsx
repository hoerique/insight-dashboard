import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const KpiCard = ({ title, value, subtitle, icon, trend, trendValue, className }: KpiCardProps) => {
  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString("pt-BR") : value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn(
            "text-xs font-semibold",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
