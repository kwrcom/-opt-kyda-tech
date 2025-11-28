import { api } from "@/lib/api";
import { AuthResponse } from "@/types";

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append("username", email); // FastAPI OAuth2PasswordRequestForm ожидает username
        formData.append("password", password);

        const response = await api.post<AuthResponse>("/auth/login", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    },

    async logout() {
        // Если есть эндпоинт для логаута на бэкенде
        // await api.post("/auth/logout");
    },

    async getMe() {
        const response = await api.get("/users/me");
        return response.data;
    },
};
