export const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    // If set to '/' or empty, use empty string for relative paths
    if (envUrl === '/' || !envUrl) {
        return import.meta.env.PROD ? '' : 'http://localhost:5000';
    }
    return envUrl;
};
