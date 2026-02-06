import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        // Check if we are in the browser
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // You can handle 401 errors here (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            // Optional: Setup logic to clear storage and redirect if needed
            // localStorage.removeItem('accessToken');
            // localStorage.removeItem('refreshToken');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
