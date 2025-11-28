import { Transaction } from "@/types";
import { transactionService } from "./transactionService";

export const alertService = {
    async fetchAlerts(): Promise<Transaction[]> {
        // For now reuse transaction mock data but treat them as alerts (pending manual reviews)
        const transactions = await transactionService.fetchPendingTransactions();

        // Keep only those that require additional attention (Level1/Level2/Manual or high risk)
        return transactions.filter((t) => t.detection && (t.detection.level !== "Level 0" || t.riskScore > 75));
    },

    async getAlertById(id: string): Promise<Transaction | null> {
        const all = await this.fetchAlerts();
        return all.find((t) => t.id === id) ?? null;
    },
};
