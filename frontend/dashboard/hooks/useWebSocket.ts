import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";

interface WebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    reconnectInterval?: number;
}

export function useWebSocket({
    url,
    onMessage,
    reconnectInterval = 3000,
}: WebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const token = useAuthStore((state) => state.token);
    const addNotification = useNotificationStore((state) => state.addNotification);

    // Используем ref для onMessage, чтобы изменения функции не вызывали переподключение
    const onMessageRef = useRef(onMessage);
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!token) return;

        // Добавляем токен в query params для аутентификации при соединении
        // ws://localhost:8000/ws?token=...
        const wsUrl = new URL(url);
        wsUrl.searchParams.append("token", token);

        function connect() {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            const ws = new WebSocket(wsUrl.toString());
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Обработка системных уведомлений
                    if (data.type === "notification") {
                        addNotification("info", data.message);
                    }

                    // Пользовательский обработчик
                    if (onMessageRef.current) {
                        onMessageRef.current(data);
                    }
                } catch (error) {
                    console.error("WebSocket message parse error:", error);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
                // Попытка переподключения
                setTimeout(() => {
                    if (useAuthStore.getState().token) {
                        connect();
                    }
                }, reconnectInterval);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            };
        }

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [url, token, reconnectInterval, addNotification]);

    const sendMessage = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn("WebSocket is not connected");
        }
    };

    return { isConnected, sendMessage };
}
