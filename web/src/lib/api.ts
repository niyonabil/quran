import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.101:3000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const authApi = {
    register: (data: { email: string; password: string; name?: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Quran
export const quranApi = {
    getSurahs: () => api.get('/quran/surahs'),
    getSurah: (id: number) => api.get(`/quran/surahs/${id}`),
    getSurahInfo: (id: number) => api.get(`/quran/surahs/${id}/info`),
    getVerses: (surah: number, translation?: string) =>
        api.get('/quran/verses', { params: { surah, translation } }),
    search: (query: string, type?: string) =>
        api.get('/quran/search', { params: { query, type } }),
    getMushafs: () => api.get('/quran/mushafs'),
    getMushaf: (id: number) => api.get(`/quran/mushafs/${id}`),
    getAyah: (surah: number, ayah: number, edition: string) =>
        api.get('/quran/ayah', { params: { surah, ayah, edition } }),
};

// Prayer
export const prayerApi = {
    getByCity: (city: string, country: string, method?: number) =>
        api.get('/prayer/times/city', { params: { city, country, method } }),
    getByCoordinates: (latitude: number, longitude: number, method?: number) =>
        api.get('/prayer/times/coordinates', { params: { latitude, longitude, method } }),
    getCalendar: (city: string, country: string, month: number, year: number, method?: number) =>
        api.get('/prayer/calendar', { params: { city, country, month, year, method } }),
};

// User
export const userApi = {
    addFavorite: (surahNumber: number, ayahNumber: number) =>
        api.post('/user/favorites', { surahNumber, ayahNumber }),
    getFavorites: () => api.get('/user/favorites'),
    removeFavorite: (id: string) => api.delete(`/user/favorites/${id}`),
    updateReadingHistory: (surahNumber: number, ayahNumber: number) =>
        api.post('/user/reading-history', { surahNumber, ayahNumber }),
    getReadingHistory: () => api.get('/user/reading-history'),
    updatePrayerSettings: (settings: {
        calculationMethod?: string;
        madhab?: string;
        latitude?: number;
        longitude?: number;
    }) => api.post('/user/prayer-settings', settings),
    getPrayerSettings: () => api.get('/user/prayer-settings'),
};

export default api;
