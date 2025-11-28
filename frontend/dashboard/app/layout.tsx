import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ToastContainer } from "./dashboard/components/ui/ToastContainer";

export const metadata: Metadata = {
    title: "Система мониторинга | Dashboard",
    description: "Дашборд системы мониторинга с темной темой",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <ToastContainer />
                </ThemeProvider>
            </body>
        </html>
    );
}
