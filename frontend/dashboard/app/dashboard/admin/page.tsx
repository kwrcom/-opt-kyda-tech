import { Settings, Shield, Bell, Database, Users } from "lucide-react";

const settingsCategories = [
    {
        title: "Безопасность",
        icon: Shield,
        description: "Управление правами доступа и безопасностью",
        items: [
            { label: "Двухфакторная аутентификация", enabled: true },
            { label: "Автоматический выход", enabled: false },
            { label: "Журнал безопасности", enabled: true },
        ],
    },
    {
        title: "Уведомления",
        icon: Bell,
        description: "Настройка системных уведомлений",
        items: [
            { label: "Email уведомления", enabled: true },
            { label: "Push уведомления", enabled: false },
            { label: "SMS уведомления", enabled: false },
        ],
    },
    {
        title: "База данных",
        icon: Database,
        description: "Конфигурация и обслуживание БД",
        items: [
            { label: "Автоматическое резервное копирование", enabled: true },
            { label: "Сжатие данных", enabled: true },
            { label: "Кеширование запросов", enabled: true },
        ],
    },
    {
        title: "Пользователи",
        icon: Users,
        description: "Управление пользователями системы",
        items: [
            { label: "Автоматическая регистрация", enabled: false },
            { label: "Требовать подтверждение email", enabled: true },
            { label: "Ограничение попыток входа", enabled: true },
        ],
    },
];

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Settings className="w-8 h-8" />
                    Администрирование
                </h1>
                <p className="text-muted-foreground mt-1">
                    Настройки системы и управление конфигурацией
                </p>
            </div>

            {/* Общая информация */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            Системная информация
                        </h3>
                        <p className="text-muted-foreground mb-3">
                            Версия: 1.0.0 | Последнее обновление: 27 ноября 2024
                        </p>
                        <div className="flex gap-4 text-sm">
                            <span className="text-foreground">
                                <strong>Пользователей:</strong> 1,234
                            </span>
                            <span className="text-foreground">
                                <strong>Активных сессий:</strong> 567
                            </span>
                            <span className="text-foreground">
                                <strong>Время работы:</strong> 45 дней
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Категории настроек */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingsCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <div key={category.title} className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {category.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                                        <div
                                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? "bg-primary" : "bg-border"
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${item.enabled ? "translate-x-6" : "translate-x-0.5"
                                                    } mt-0.5`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Опасная зона */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-500 mb-2">Опасная зона</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Эти действия необратимы. Будьте осторожны.
                </p>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                        Сбросить все настройки
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
                        Очистить базу данных
                    </button>
                </div>
            </div>
        </div>
    );
}
