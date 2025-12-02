import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin Auth
export const adminAuthApi = {
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Admin Users Management
export const adminUsersApi = {
    getAllUsers: () => api.get('/admin/users'),
    getUserById: (id: string) => api.get(`/admin/users/${id}`),
    updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    getStats: () => api.get('/admin/stats'),
};

// Re-export public APIs for admin use
export const quranApi = {
    getSurahs: () => api.get('/quran/surahs'),
    getSurah: (id: number) => api.get(`/quran/surahs/${id}`),
    getVerses: (surah: number, translation?: string) =>
        api.get('/quran/verses', { params: { surah, translation } }),
};

export const prayerApi = {
    getByCity: (city: string, country: string, method?: number) =>
        api.get('/prayer/times/city', { params: { city, country, method } }),
};

export default api;
