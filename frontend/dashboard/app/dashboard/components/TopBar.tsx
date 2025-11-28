"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, User } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Избегаем гидратационных ошибок
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-end">
                <div className="w-10 h-10 rounded-lg bg-secondary animate-pulse" />
            </header>
        );
    }

    return (
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    Добро пожаловать в систему мониторинга
                </h2>
                <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("ru-RU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* Переключатель темы */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    aria-label="Переключить тему"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-secondary-foreground" />
                    ) : (
                        <Moon className="w-5 h-5 text-secondary-foreground" />
                    )}
                </button>

                {/* Аватар пользователя (заглушка) */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Администратор</p>
                        <p className="text-xs text-muted-foreground">admin@monitor.ru</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
