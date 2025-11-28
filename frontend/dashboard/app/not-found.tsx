import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center animate-pulse">
                        <FileQuestion className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold">Страница не найдена</h1>
                <p className="text-muted-foreground text-lg">
                    К сожалению, запрашиваемая вами страница не существует или была перемещена.
                </p>

                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Вернуться в дашборд
                    </Link>
                </div>
            </div>
        </div>
    );
}
