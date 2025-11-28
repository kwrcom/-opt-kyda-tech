import { Activity, TrendingUp, Users, AlertCircle } from "lucide-react";
import { MetricCard } from "./components/MetricCard";
import { TrafficChart } from "./components/charts/TrafficChart";
import { LatencyChart } from "./components/charts/LatencyChart";
import { QueueSizeChart } from "./components/charts/QueueSizeChart";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Обзор системы
                </h1>
                <p className="text-muted-foreground mt-1">
                    Общая статистика и ключевые метрики в реальном времени
                </p>
            </div>

            {/* Сетка карточек метрик */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Активные сессии"
                    value="1,234"
                    delta="+12.5%"
                    trend="up"
                    icon={Users}
                />
                <MetricCard
                    title="Загрузка CPU"
                    value="67%"
                    delta="-5.2%"
                    trend="down"
                    icon={Activity}
                />
                <MetricCard
                    title="Трафик (24ч)"
                    value="45.2 GB"
                    delta="+23.1%"
                    trend="up"
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Ошибки"
                    value="12"
                    delta="+2"
                    trend="up"
                    icon={AlertCircle}
                />
            </div>

            {/* Графики */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrafficChart />
                <LatencyChart />
            </div>

            {/* Дополнительные графики */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Здесь можно добавить еще один широкий график, например карту или лог событий */}
                    <div className="bg-card border border-border rounded-xl p-6 h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">Карта активности (в разработке)</p>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <QueueSizeChart />
                </div>
            </div>
        </div>
    );
}
