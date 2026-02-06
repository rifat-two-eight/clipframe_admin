import api from '@/lib/axios';

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    verified: boolean;
    subscribe: boolean;
    createdAt: string;
    // Add other fields as needed based on the response
}

export interface UserResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        data: User[];
    };
}

export const userService = {
    getAllUsers: async (page: number = 1, limit: number = 10): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/user/?page=${page}&limit=${limit}`);
        return response.data;
    },
};
