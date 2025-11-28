"use client";

import { useEffect, useState } from "react";
import { alertService } from "@/services/alertService";
import { Transaction } from "@/types";
import { Modal } from "../components/ui/Modal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Search, Filter } from "lucide-react";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Transaction | null>(null);
    const [levelFilter, setLevelFilter] = useState<"all" | "Level 0" | "Level 1" | "Level 2" | "Manual">("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await alertService.fetchAlerts();
            setAlerts(data);
        } finally {
            setLoading(false);
        }
    };

    const filtered = alerts.filter((a) => {
        const matchesLevel = levelFilter === "all" || a.detection?.level === levelFilter;
        const matchesSearch = a.id.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    function rowClasses(a: Transaction) {
        const level = a.detection?.level ?? "Level 0";
        const urgency = a.detection?.urgency ?? "low";
        // base color by level
        const levelColor = level === "Level 0" ? "bg-white" : level === "Level 1" ? "bg-yellow-50" : level === "Level 2" ? "bg-red-50" : "bg-purple-50";
        // urgency adds a left border accent
        const urgencyBorder = urgency === "high" ? "border-l-4 border-red-500" : urgency === "medium" ? "border-l-4 border-yellow-400" : "border-l-4 border-transparent";
        return `${levelColor} ${urgencyBorder} hover:shadow-sm transition-shadow`;
    }

    function buildCascadeText(a: Transaction) {
        if (!a.detection?.path) return "Нет детальной информации каскада";
        // example format: "Пройдена валидация Ур.0 -> Скор Ур.1: 0.75 -> Ур.2: 0.94 -> Решение оператора: Блок"
        return a.detection.path.map((p, idx) => {
            if (typeof p.detail === "number") return `${p.step}: ${p.detail}`;
            return `${p.step}: ${p.detail}`;
        }).join(" → ");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Alerts / Оповещения</h1>
                <p className="text-muted-foreground mt-1">Инструмент для обзора оповещений и детальной трассировки каскада принятия решения</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по ID или описанию" className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-full" />
                </div>

                <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as any)} className="px-4 py-2 bg-card border border-border rounded-lg text-sm">
                    <option value="all">Все уровни</option>
                    <option value="Level 0">Level 0 — Gatekeeping</option>
                    <option value="Level 1">Level 1 — Fast scorer</option>
                    <option value="Level 2">Level 2 — Heavy scorer</option>
                    <option value="Manual">Manual — Operator</option>
                </select>

                <button onClick={load} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Обновить</button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Сумма</th>
                                <th className="px-6 py-4">Уровень детекции</th>
                                <th className="px-6 py-4">Риск</th>
                                <th className="px-6 py-4">Дата</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Загрузка...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Нет оповещений</td></tr>
                            ) : (
                                filtered.map((a) => (
                                    <tr key={a.id} onClick={() => setSelected(a)} className={`${rowClasses(a)} cursor-pointer`}>
                                        <td className="px-6 py-4 font-medium">{a.id}</td>
                                        <td className="px-6 py-4 font-mono">{formatCurrency(a.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.detection?.level === "Manual" ? "bg-purple-500/10 text-purple-500" : a.detection?.level === "Level 2" ? "bg-red-500/10 text-red-500" : a.detection?.level === "Level 1" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
                                                {a.detection?.level ?? "Level 0"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${a.riskScore > 80 ? "bg-red-500" : a.riskScore > 50 ? "bg-yellow-500" : "bg-green-500"}`} />
                                                <span className={a.riskScore > 80 ? "text-red-500 font-medium" : a.riskScore > 50 ? "text-yellow-500" : "text-green-500"}>{a.riskScore}/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(a.timestamp)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-medium text-xs">Открыть</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Оповещение ${selected?.id}`}>
                {selected && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Сумма</p>
                                <p className="text-2xl font-bold text-foreground">{formatCurrency(selected.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Уровень</p>
                                <p className="text-foreground font-semibold">{selected.detection?.level ?? "Level 0"} — {selected.detection?.urgency ?? "low"}</p>
                            </div>
                        </div>

                        <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                            <h3 className="text-lg font-semibold mb-2">Полный путь каскада</h3>
                            <p className="text-sm text-muted-foreground mb-3">Это объяснение шага за шагом, почему транзакция была остановлена или переведена на следующий уровень.</p>
                            <div className="bg-white/5 p-4 rounded-md border border-border text-sm">
                                {buildCascadeText(selected)}
                            </div>
                        </div>

                        {/* show operator decision if present */}
                        {selected.detection?.operatorDecision && (
                            <div className="p-4 rounded-lg border border-border bg-red-50 text-foreground">
                                <strong>Решение оператора:</strong> {selected.detection.operatorDecision}
                            </div>
                        )}

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setSelected(null)} className="px-4 py-2 bg-card border border-border rounded-lg">Закрыть</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
