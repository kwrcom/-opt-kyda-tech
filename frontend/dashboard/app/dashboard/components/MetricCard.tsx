import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string | number;
    delta?: string;
    trend?: "up" | "down" | "neutral";
    icon?: LucideIcon;
    className?: string;
}

export function MetricCard({
    title,
    value,
    delta,
    trend,
    icon: Icon,
    className,
}: MetricCardProps) {
    return (
        <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            </div>

            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-foreground">{value}</div>

                {delta && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                        trend === "up" && "text-green-500 bg-green-500/10",
                        trend === "down" && "text-red-500 bg-red-500/10",
                        trend === "neutral" && "text-muted-foreground bg-secondary"
                    )}>
                        {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                        {trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                        {trend === "neutral" && <Minus className="w-3 h-3 mr-1" />}
                        {delta}
                    </div>
                )}
            </div>
        </div>
    );
}
