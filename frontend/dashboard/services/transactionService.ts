import { api } from "../lib/api";
import { Transaction } from "../types";

export const transactionService = {
    async fetchPendingTransactions(): Promise<Transaction[]> {
        // TODO: Заменить на реальный вызов API
        // const response = await api.get<Transaction[]>("/transactions/pending");
        // return response.data;

        // Мок данных для демонстрации
        return Array.from({ length: 15 }, (_, i) => {
            // create a realistic pseudo cascade for demo
            const roll = Math.random();
            // level selection: manual if very high, level2 if high, level1 if mid, level0 otherwise
            const level = roll > 0.85 ? "Manual" : roll > 0.6 ? "Level 2" : roll > 0.3 ? "Level 1" : "Level 0";
            const risk = Math.floor(Math.random() * 100);
            const urgency = risk > 85 ? "high" : risk > 60 ? "medium" : "low";
            const path = [] as { step: string; detail?: string | number }[];
            // sample cascade path
            path.push({ step: "Gatekeeping Ур.0", detail: level === "Level 0" ? "passed" : "passed" });
            if (level !== "Level 0") path.push({ step: "Fast scorer Ур.1", detail: Number((Math.random() * 0.8).toFixed(2)) });
            if (level === "Level 2" || level === "Manual") path.push({ step: "Heavy scorer Ур.2", detail: Number((Math.random() * 0.98 + 0.02).toFixed(2)) });
            if (level === "Manual") path.push({ step: "Решение оператора", detail: Math.random() > 0.5 ? "Одобрить" : "Блок" });

            return {
            id: `txn_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.floor(Math.random() * 10000) + 100,
            currency: "KZT",
            status: "pending",
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
            description: `Транзакция #${i + 1}`,
            riskScore: risk,
            detection: {
                level: level as any,
                urgency: urgency as any,
                path,
                operatorDecision: level === "Manual" ? (path[path.length - 1]?.detail as string) : null,
            },
            shapValues: [
                { feature: "Сумма транзакции", value: Math.random() * 10 - 5 },
                { feature: "Страна IP", value: Math.random() * 10 - 5 },
                { feature: "Время суток", value: Math.random() * 10 - 5 },
                { feature: "Устройство", value: Math.random() * 10 - 5 },
                { feature: "История операций", value: Math.random() * 10 - 5 },
            ],
            };
        });
    },

    async approveTransaction(id: string): Promise<void> {
        await api.post(`/transactions/${id}/approve`);
    },

    async rejectTransaction(id: string): Promise<void> {
        await api.post(`/transactions/${id}/reject`);
    },

    async getTransactionHistory(page = 1, limit = 20): Promise<Transaction[]> {
        const response = await api.get<Transaction[]>("/transactions", {
            params: { page, limit },
        });
        return response.data;
    },
};
