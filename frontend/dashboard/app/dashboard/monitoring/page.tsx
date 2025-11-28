import { Activity, Server, Database, Wifi } from "lucide-react";

const systemMetrics = [
    {
        category: "Серверы",
        icon: Server,
        items: [
            { name: "Server-01", status: "Онлайн", load: "45%", color: "green" },
            { name: "Server-02", status: "Онлайн", load: "67%", color: "green" },
            { name: "Server-03", status: "Предупреждение", load: "89%", color: "yellow" },
            { name: "Server-04", status: "Офлайн", load: "0%", color: "red" },
        ],
    },
    {
        category: "Базы данных",
        icon: Database,
        items: [
            { name: "PostgreSQL", status: "Онлайн", load: "32%", color: "green" },
            { name: "MongoDB", status: "Онлайн", load: "54%", color: "green" },
            { name: "Redis", status: "Онлайн", load: "12%", color: "green" },
        ],
    },
    {
        category: "Сетевые ресурсы",
        icon: Wifi,
        items: [
            { name: "API Gateway", status: "Онлайн", load: "23%", color: "green" },
            { name: "Load Balancer", status: "Онлайн", load: "45%", color: "green" },
        ],
    },
];

const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
};

export default function MonitoringPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Activity className="w-8 h-8" />
                    Мониторинг системы
                </h1>
                <p className="text-muted-foreground mt-1">
                    Реальное состояние всех сервисов и ресурсов
                </p>
            </div>

            <div className="space-y-6">
                {systemMetrics.map((category) => {
                    const Icon = category.icon;
                    return (
                        <div key={category.category} className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Icon className="w-6 h-6 text-primary" />
                                <h2 className="text-xl font-semibold text-foreground">{category.category}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="bg-secondary/50 rounded-lg p-4 border border-border hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-foreground">{item.name}</span>
                                            <div className={`w-3 h-3 rounded-full ${statusColors[item.color as keyof typeof statusColors]}`} />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{item.status}</p>
                                        <p className="text-lg font-bold text-foreground">Загрузка: {item.load}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
