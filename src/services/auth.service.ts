import axios from 'axios';
import { API_URL } from '../config';

const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Để gửi cookies
});

// Request interceptor
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                const response = await authApi.post('/auth/refresh-token');
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);

                // Retry request cũ với token mới
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return authApi(originalRequest);
            } catch (error) {
                // Nếu refresh token failed, logout
                this.clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    username: string;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
}

export interface AuthResponse {
    user: UserResponse;
    accessToken: string;
    message: string;
}

class AuthService {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/user/login', data);
        this.setTokens(response.data.accessToken);
        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await authApi.post<AuthResponse>('/user/register', data);
        this.setTokens(response.data.accessToken);
        return response.data;
    }

    async logout(): Promise<void> {
        await authApi.post('/user/logout');
        this.clearTokens();
    }

    async getCurrentUser(): Promise<UserResponse> {
        const response = await authApi.get<{ user: UserResponse }>('/user/me');
        return response.data.user;
    }

    async updateProfile(data: {
        username?: string;
        bio?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<UserResponse> {
        const response = await authApi.put<{ user: UserResponse }>('/user/profile', data);
        return response.data.user;
    }

    setTokens(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }
}

export const authService = new AuthService();
export default authService;