"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Здесь можно отправить ошибку в сервис аналитики
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
                Что-то пошло не так!
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Произошла ошибка при загрузке компонента. Попробуйте обновить страницу или повторить действие позже.
            </p>

            <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
                <RefreshCcw className="w-4 h-4" />
                Попробовать снова
            </button>
        </div>
    );
}
