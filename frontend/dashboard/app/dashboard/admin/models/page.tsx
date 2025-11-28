"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { MLModel } from "@/types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { ArrowUpCircle, ArrowDownCircle, Box } from "lucide-react";

export default function ModelsPage() {
    const [models, setModels] = useState<MLModel[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        try {
            const data = await adminService.getModels();
            setModels(data);
        } catch (error) {
            addNotification("error", "Ошибка загрузки моделей");
        } finally {
            setLoading(false);
        }
    };

    const handleStageChange = async (modelName: string, version: string, newStage: string) => {
        if (!confirm(`Вы уверены, что хотите перевести версию ${version} в ${newStage}?`)) return;

        try {
            await adminService.updateModelStage(modelName, version, newStage);
            addNotification("success", `Версия ${version} переведена в ${newStage}`);
            loadModels(); // Обновляем список
        } catch (error) {
            addNotification("error", "Ошибка обновления стадии");
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="space-y-8">
            {models.map((model) => (
                <div key={model.name} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">{model.name}</h2>
                    </div>

                    <div className="overflow-x-auto border border-border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Версия</th>
                                    <th className="px-4 py-3">Стадия</th>
                                    <th className="px-4 py-3">Метрики (Acc / Prec / Rec / F1)</th>
                                    <th className="px-4 py-3">Обновлено</th>
                                    <th className="px-4 py-3 text-right">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {model.versions.map((ver) => (
                                    <tr key={ver.version} className="hover:bg-secondary/20">
                                        <td className="px-4 py-3 font-mono font-medium">{ver.version}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${ver.stage === "Production" ? "bg-green-500/10 text-green-500" :
                                                    ver.stage === "Staging" ? "bg-blue-500/10 text-blue-500" :
                                                        "bg-secondary text-muted-foreground"
                                                }`}>
                                                {ver.stage}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">
                                            {ver.metrics.accuracy} / {ver.metrics.precision} / {ver.metrics.recall} / {ver.metrics.f1}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(ver.lastUpdated).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            {ver.stage !== "Production" && (
                                                <button
                                                    onClick={() => handleStageChange(model.name, ver.version, "Production")}
                                                    className="text-green-500 hover:bg-green-500/10 p-1 rounded"
                                                    title="Promote to Production"
                                                >
                                                    <ArrowUpCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {ver.stage === "Production" && (
                                                <button
                                                    onClick={() => handleStageChange(model.name, ver.version, "Staging")}
                                                    className="text-yellow-500 hover:bg-yellow-500/10 p-1 rounded"
                                                    title="Demote to Staging"
                                                >
                                                    <ArrowDownCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
