"use client";

import { useState, useEffect } from "react";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Modal } from "../components/ui/Modal";
import { ShapChart } from "../components/charts/ShapChart";
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function QueuePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");

    const addNotification = useNotificationStore((state) => state.addNotification);

    // Загрузка данных
    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.fetchPendingTransactions();
            setTransactions(data);
        } catch (error) {
            addNotification("error", "Не удалось загрузить транзакции");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // Фильтрация
    const filteredTransactions = transactions.filter((txn) => {
        const matchesSearch =
            txn.id.toLowerCase().includes(search.toLowerCase()) ||
            txn.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Обработка решений
    const handleDecision = async (decision: "approve" | "reject") => {
        if (!selectedTxn) return;

        try {
            if (decision === "approve") {
                await transactionService.approveTransaction(selectedTxn.id);
                addNotification("success", `Транзакция ${selectedTxn.id} одобрена`);
            } else {
                await transactionService.rejectTransaction(selectedTxn.id);
                addNotification("warning", `Транзакция ${selectedTxn.id} отклонена`);
            }

            // Обновляем список (удаляем обработанную)
            setTransactions((prev) => prev.filter((t) => t.id !== selectedTxn.id));
            setSelectedTxn(null);
        } catch (error) {
            addNotification("error", "Ошибка при обработке транзакции");
        }
    };

    return (
        <div className="space-y-6">
            {/* Заголовок и фильтры */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Очередь проверки</h1>
                    <p className="text-muted-foreground">
                        Транзакции, требующие ручного подтверждения
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Поиск по ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Все статусы</option>
                        <option value="pending">Ожидают</option>
                        <option value="approved">Одобрено</option>
                        <option value="rejected">Отклонено</option>
                    </select>
                </div>
            </div>

            {/* Таблица */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">ID Транзакции</th>
                                <th className="px-6 py-4">Сумма</th>
                                <th className="px-6 py-4">Риск</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4">Дата</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Загрузка данных...
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Транзакции не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <tr
                                        key={txn.id}
                                        onClick={() => setSelectedTxn(txn)}
                                        className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-medium text-foreground">{txn.id}</td>
                                        <td className="px-6 py-4 font-mono">
                                            {formatCurrency(txn.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${txn.riskScore > 80 ? "bg-red-500" :
                                                        txn.riskScore > 50 ? "bg-yellow-500" : "bg-green-500"
                                                    }`} />
                                                <span className={
                                                    txn.riskScore > 80 ? "text-red-500 font-medium" :
                                                        txn.riskScore > 50 ? "text-yellow-500" : "text-green-500"
                                                }>
                                                    {txn.riskScore}/100
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${txn.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                                    txn.status === "approved" ? "bg-green-500/10 text-green-500" :
                                                        "bg-red-500/10 text-red-500"
                                                }`}>
                                                {txn.status === "pending" ? "Ожидает" :
                                                    txn.status === "approved" ? "Одобрено" : "Отклонено"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDate(txn.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                Подробнее
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация (заглушка) */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <span>Показано {filteredTransactions.length} из {transactions.length}</span>
                    <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-secondary disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-secondary disabled:opacity-50" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно деталей */}
            <Modal
                isOpen={!!selectedTxn}
                onClose={() => setSelectedTxn(null)}
                title={`Транзакция ${selectedTxn?.id}`}
            >
                {selectedTxn && (
                    <div className="space-y-8">
                        {/* Основная информация */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Сумма</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatCurrency(selectedTxn.amount)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Статус</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedTxn.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                        selectedTxn.status === "approved" ? "bg-green-500/10 text-green-500" :
                                            "bg-red-500/10 text-red-500"
                                    }`}>
                                    {selectedTxn.status === "pending" ? "Ожидает проверки" :
                                        selectedTxn.status === "approved" ? "Одобрено" : "Отклонено"}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Описание</p>
                                <p className="text-foreground">{selectedTxn.description}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Дата</p>
                                <p className="text-foreground">{new Date(selectedTxn.timestamp).toLocaleString("ru-RU")}</p>
                            </div>
                        </div>

                        {/* Секция ML-объяснений */}
                        <div className="bg-secondary/30 rounded-xl p-6 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    Анализ рисков
                                </h3>
                                <span className={`text-lg font-bold ${selectedTxn.riskScore > 80 ? "text-red-500" : "text-yellow-500"
                                    }`}>
                                    Риск: {selectedTxn.riskScore}/100
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">
                                Влияние факторов на оценку риска (SHAP Values).
                                <span className="text-red-500 mx-1">Красный</span> повышает риск,
                                <span className="text-blue-500 mx-1">Синий</span> понижает.
                            </p>

                            {selectedTxn.shapValues ? (
                                <ShapChart data={selectedTxn.shapValues} />
                            ) : (
                                <p className="text-center text-muted-foreground py-8">Нет данных для объяснения</p>
                            )}
                            {/* ---- Cascade path explanation (multi-level) ---- */}
                            {selectedTxn.detection && (
                                <div className="bg-secondary/30 rounded-xl p-6 border border-border mt-6">
                                    <h4 className="text-md font-semibold mb-2">Путь каскада</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{selectedTxn.detection.level} — подробности этапов обработки</p>
                                    <div className="text-sm text-foreground space-y-1">
                                        {selectedTxn.detection.path?.map((p, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                                <div>
                                                    <div className="font-medium">{p.step}</div>
                                                    {p.detail && <div className="text-xs text-muted-foreground">{String(p.detail)}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedTxn.detection.operatorDecision && (
                                        <div className="mt-3 p-3 rounded border border-border bg-white/5">
                                            <strong>Решение оператора:</strong> {selectedTxn.detection.operatorDecision}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Панель действий */}
                        <div className="flex gap-4 pt-4 border-t border-border">
                            <button
                                onClick={() => handleDecision("approve")}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Одобрить
                            </button>
                            <button
                                onClick={() => handleDecision("reject")}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                                Отклонить
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
