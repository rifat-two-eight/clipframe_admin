import api from '@/lib/axios';

export interface LoginResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        role: string;
    };
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/custom-login', {
            email,
            password,
        });
        return response.data;
    },
};
