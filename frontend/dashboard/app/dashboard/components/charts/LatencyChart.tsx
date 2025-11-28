"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { useTheme } from "next-themes";

export function LatencyChart() {
    const { theme } = useTheme();
    const { data, error, isLoading } = useSWR(
        "latency-metrics",
        metricsService.getLatencyMetrics,
        { refreshInterval: 30000 }
    );

    if (isLoading) return <div className="h-[300px] bg-secondary/20 animate-pulse rounded-xl" />;
    if (error) return <div className="h-[300px] flex items-center justify-center text-red-500">Ошибка загрузки данных</div>;

    const isDark = theme === "dark";

    return (
        <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Задержки API (ms)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
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
                            contentStyle={{
                                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                color: isDark ? "#f8fafc" : "#0f172a",
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="p99" />
                        <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={false} name="p95" />
                        <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={2} dot={false} name="p50" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
