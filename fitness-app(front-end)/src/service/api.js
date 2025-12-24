import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token) {    
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;    
    }
    if (userId) {
        config.headers['X-User-ID'] = JSON.parse(userId);
    }
    return config;
});

export const getActivities = () => api.get('/activities/user');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetails = (id) => api.get(`/recommendations/activity/${id}`);