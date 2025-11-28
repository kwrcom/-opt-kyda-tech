"use client";

import { useNotificationStore } from "@/store/useNotificationStore";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const colors = {
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ToastContainer() {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map((notification) => {
                const Icon = icons[notification.type];
                return (
                    <ToastItem
                        key={notification.id}
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                        Icon={Icon}
                    />
                );
            })}
        </div>
    );
}

function ToastItem({ notification, onClose, Icon }: any) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md
        animate-in slide-in-from-right-full duration-300
        ${colors[notification.type as keyof typeof colors]}
        bg-background
      `}
        >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{notification.message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-black/5 transition-colors"
            >
                <X className="w-4 h-4 opacity-50" />
            </button>
        </div>
    );
}
