import { create } from "zustand";

export interface Notification {
    id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    timestamp: number;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (type: Notification["type"], message: string) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (type, message) =>
        set((state) => ({
            notifications: [
                {
                    id: Math.random().toString(36).substring(7),
                    type,
                    message,
                    timestamp: Date.now(),
                },
                ...state.notifications,
            ],
        })),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    clearNotifications: () => set({ notifications: [] }),
}));
