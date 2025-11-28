import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
            <div className="text-center space-y-8 p-8">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Система мониторинга
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Современный дашборд для управления и мониторинга ваших данных
                </p>
                <Link
                    href="/dashboard"
                    className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                >
                    Перейти к дашборду
                </Link>
            </div>
        </div>
    );
}
