import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const { access_token } = response.data;
                    localStorage.setItem('token', access_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// API Service functions
export const authAPI = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    getUsers: () => api.get('/auth/users'),
    updateUser: (userId, data) => api.put(`/auth/users/${userId}`, data),
};

export const mediaAPI = {
    upload: (formData) => api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    list: () => api.get('/media/list'),
    get: (id) => api.get(`/media/${id}`),
    delete: (id) => api.delete(`/media/${id}`),
};

export const detectionAPI = {
    analyzeAudio: (mediaId) => api.post('/detect/audio', { media_id: mediaId }),
    analyzeVideo: (mediaId) => api.post('/detect/video', { media_id: mediaId }),
    getResults: () => api.get('/detect/results'),
    getResult: (id) => api.get(`/detect/results/${id}`),
    getStats: () => api.get('/detect/stats'),
};

export const incidentsAPI = {
    getAll: (params) => api.get('/incidents', { params }),
    get: (id) => api.get(`/incidents/${id}`),
    getSummary: () => api.get('/incidents/summary'),
};

export const ledgerAPI = {
    log: (analysisId, notes) => api.post('/ledger/log', { analysis_id: analysisId, notes }),
    getEntries: () => api.get('/ledger/entries'),
    verify: () => api.post('/ledger/verify'),
    export: () => api.get('/ledger/export'),
};
