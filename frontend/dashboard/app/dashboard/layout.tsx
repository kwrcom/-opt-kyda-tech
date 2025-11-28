import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Боковая панель */}
            <Sidebar />

            {/* Основная область */}
            <div className="flex-1 flex flex-col">
                {/* Верхний бар */}
                <TopBar />

                {/* Контент */}
                <main className="flex-1 p-6 bg-background overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
