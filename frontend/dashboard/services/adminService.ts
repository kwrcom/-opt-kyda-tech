import { api } from "@/lib/api";
import { MLModel, SystemConfig, User } from "@/types";

export const adminService = {
    // --- MLflow Models ---
    async getModels(): Promise<MLModel[]> {
        // TODO: Реальный API
        // const response = await api.get("/admin/models");
        // return response.data;

        return [
            {
                name: "fraud-detection-model",
                versions: [
                    {
                        version: "v2.1.0",
                        stage: "Production",
                        metrics: { accuracy: 0.98, precision: 0.97, recall: 0.96, f1: 0.965 },
                        lastUpdated: new Date().toISOString(),
                    },
                    {
                        version: "v2.2.0-rc1",
                        stage: "Staging",
                        metrics: { accuracy: 0.99, precision: 0.98, recall: 0.97, f1: 0.975 },
                        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
                    },
                ],
            },
        ];
    },

    async updateModelStage(modelName: string, version: string, stage: string): Promise<void> {
        await api.post(`/admin/models/${modelName}/versions/${version}/stage`, { stage });
    },

    // --- Users ---
    async getUsers(): Promise<User[]> {
        return [
            { id: "1", name: "Администратор", email: "admin@monitor.ru", role: "admin" },
            { id: "2", name: "Оператор 1", email: "op1@monitor.ru", role: "operator" },
            { id: "3", name: "Оператор 2", email: "op2@monitor.ru", role: "operator" },
        ];
    },

    async updateUserRole(userId: string, role: "admin" | "operator"): Promise<void> {
        await api.patch(`/admin/users/${userId}`, { role });
    },

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/admin/users/${userId}`);
    },

    // --- System Config ---
    async getConfig(): Promise<SystemConfig> {
        return {
            riskThreshold: 85,
            maintenanceMode: false,
            mlflowUrl: "http://mlflow.internal:5000",
        };
    },

    async updateConfig(config: SystemConfig): Promise<void> {
        await api.put("/admin/config", config);
    },
};
