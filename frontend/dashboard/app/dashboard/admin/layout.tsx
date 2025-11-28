"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Shield, Users, Settings, Box } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // В реальном приложении раскомментировать проверку
        // if (!isAuthenticated || user?.role !== "admin") {
        //   router.push("/dashboard");
        // } else {
        //   setIsAuthorized(true);
        // }

        // Для демо разрешаем доступ
        setIsAuthorized(true);
    }, [isAuthenticated, user, router]);

    if (!isAuthorized) {
        return null; // Или лоадер
    }

    const tabs = [
        { name: "ML Модели", href: "/dashboard/admin/models", icon: Box },
        { name: "Пользователи", href: "/dashboard/admin/users", icon: Users },
        { name: "Конфигурация", href: "/dashboard/admin/config", icon: Settings },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Панель администратора</h1>
                    <p className="text-sm text-muted-foreground">Управление системой и моделями</p>
                </div>
            </div>

            {/* Навигация по вкладкам */}
            <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${isActive
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"}
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 min-h-[500px]">
                {children}
            </div>
        </div>
    );
}
