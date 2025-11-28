"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { useTheme } from "next-themes";

export function QueueSizeChart() {
    const { theme } = useTheme();
    const { data, error, isLoading } = useSWR(
        "queue-metrics",
        metricsService.getQueueMetrics,
        { refreshInterval: 30000 }
    );

    if (isLoading) return <div className="h-[300px] bg-secondary/20 animate-pulse rounded-xl" />;
    if (error) return <div className="h-[300px] flex items-center justify-center text-red-500">Ошибка загрузки данных</div>;

    const isDark = theme === "dark";

    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Размер очереди проверки</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke={isDark ? "#94a3b8" : "#64748b"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={isDark ? "#94a3b8" : "#64748b"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: isDark ? "#334155" : "#f1f5f9", opacity: 0.4 }}
                            contentStyle={{
                                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                color: isDark ? "#f8fafc" : "#0f172a",
                            }}
                        />
                        <Bar dataKey="size" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
