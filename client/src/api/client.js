import axios from 'axios';
import { getApiUrl } from './config';

const api = axios.create({
    baseURL: `${getApiUrl()}/api`,
});

export default api;
