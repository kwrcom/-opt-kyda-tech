"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { User } from "@/types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Trash2, UserCog, UserPlus } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            addNotification("error", "Ошибка загрузки пользователей");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "operator" : "admin";
        if (!confirm(`Изменить роль пользователя на ${newRole}?`)) return;

        try {
            await adminService.updateUserRole(userId, newRole);
            addNotification("success", "Роль обновлена");
            loadUsers();
        } catch (error) {
            addNotification("error", "Ошибка обновления роли");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Вы уверены? Это действие необратимо.")) return;

        try {
            await adminService.deleteUser(userId);
            addNotification("success", "Пользователь удален");
            loadUsers();
        } catch (error) {
            addNotification("error", "Ошибка удаления");
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    <UserPlus className="w-4 h-4" />
                    Добавить пользователя
                </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Имя</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Роль</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-secondary/20">
                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleChangeRole(user.id, user.role)}
                                        className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                        title="Изменить роль"
                                    >
                                        <UserCog className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                        title="Удалить"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
