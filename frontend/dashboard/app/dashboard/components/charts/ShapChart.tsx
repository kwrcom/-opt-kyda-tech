"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from "recharts";
import { useTheme } from "next-themes";

interface ShapValue {
    feature: string;
    value: number;
}

interface ShapChartProps {
    data: ShapValue[];
}

export function ShapChart({ data }: ShapChartProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Сортируем по абсолютному значению влияния
    const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={sortedData}
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} horizontal={true} vertical={false} />
                    <XAxis
                        type="number"
                        stroke={isDark ? "#94a3b8" : "#64748b"}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        dataKey="feature"
                        type="category"
                        stroke={isDark ? "#94a3b8" : "#64748b"}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: isDark ? "#334155" : "#f1f5f9", opacity: 0.4 }}
                        contentStyle={{
                            backgroundColor: isDark ? "#1e293b" : "#ffffff",
                            borderColor: isDark ? "#334155" : "#e2e8f0",
                            color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                        formatter={(value: number) => [value.toFixed(4), "Влияние"]}
                    />
                    <ReferenceLine x={0} stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.value > 0 ? "#ef4444" : "#3b82f6"} // Красный - повышает риск, Синий - понижает
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
