import { api } from "@/lib/api";

export interface TrafficData {
    time: string;
    requests: number;
}

export interface LatencyData {
    time: string;
    p50: number;
    p95: number;
    p99: number;
}

export interface QueueData {
    time: string;
    size: number;
}

export const metricsService = {
    async getTrafficMetrics(period: "24h" | "7d" = "24h"): Promise<TrafficData[]> {
        // TODO: Заменить на реальный вызов API
        // const response = await api.get('/metrics/traffic', { params: { period } });
        // return response.data;

        // Мок данных
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            requests: Math.floor(Math.random() * 5000) + 1000,
        }));
    },

    async getLatencyMetrics(): Promise<LatencyData[]> {
        // TODO: Заменить на реальный вызов API
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            p50: Math.floor(Math.random() * 50) + 20,
            p95: Math.floor(Math.random() * 100) + 50,
            p99: Math.floor(Math.random() * 200) + 100,
        }));
    },

    async getQueueMetrics(): Promise<QueueData[]> {
        // TODO: Заменить на реальный вызов API
        return Array.from({ length: 12 }, (_, i) => ({
            time: `${i * 2}:00`,
            size: Math.floor(Math.random() * 50),
        }));
    },
};
