"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { SystemConfig } from "@/types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Save, RefreshCw } from "lucide-react";

export default function ConfigPage() {
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await adminService.getConfig();
            setConfig(data);
        } catch (error) {
            addNotification("error", "Ошибка загрузки настроек");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;

        if (!confirm("Сохранить изменения конфигурации?")) return;

        setSaving(true);
        try {
            await adminService.updateConfig(config);
            addNotification("success", "Настройки сохранены");
        } catch (error) {
            addNotification("error", "Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !config) return <div>Загрузка...</div>;

    return (
        <form onSubmit={handleSave} className="max-w-2xl space-y-8">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b border-border pb-2">Основные настройки</h2>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Порог риска для авто-одобрения</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={config.riskThreshold}
                        onChange={(e) => setConfig({ ...config, riskThreshold: Number(e.target.value) })}
                        className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <p className="text-xs text-muted-foreground">Транзакции с риском ниже этого значения будут одобрены автоматически.</p>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/20">
                    <div>
                        <label className="font-medium block">Режим обслуживания</label>
                        <p className="text-xs text-muted-foreground">Временно приостановить обработку новых транзакций</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                        className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${config.maintenanceMode ? "bg-primary" : "bg-muted"}
            `}
                    >
                        <span
                            className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${config.maintenanceMode ? "translate-x-6" : "translate-x-1"}
              `}
                        />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b border-border pb-2">Интеграции</h2>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">URL MLflow Tracking Server</label>
                    <input
                        type="url"
                        value={config.mlflowUrl}
                        onChange={(e) => setConfig({ ...config, mlflowUrl: e.target.value })}
                        className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="http://localhost:5000"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Сохранить изменения
                </button>
            </div>
        </form>
    );
}
