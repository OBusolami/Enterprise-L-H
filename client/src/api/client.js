import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
    baseURL: `${apiUrl}/api`,
});

export default api;
