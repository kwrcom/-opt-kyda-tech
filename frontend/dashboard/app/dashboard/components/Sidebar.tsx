"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, ListOrdered, Settings } from "lucide-react";

const menuItems = [
    { name: "Главная", href: "/dashboard", icon: Home },
    { name: "Мониторинг", href: "/dashboard/monitoring", icon: Activity },
    { name: "Очередь", href: "/dashboard/queue", icon: ListOrdered },
    { name: "Alerts", href: "/dashboard/alerts", icon: Activity },
    { name: "Админка", href: "/dashboard/admin", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
            {/* Логотип */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Monitor</h1>
                        <p className="text-xs text-muted-foreground">v1.0.0</p>
                    </div>
                </div>
            </div>

            {/* Меню навигации */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Футер */}
            <div className="p-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                    © 2024 Monitoring System
                </p>
            </div>
        </aside>
    );
}
