export const getApiUrl = () => {
    // Point to the live Render backend for global access
    const renderUrl = 'https://enterprise-l-h.onrender.com';

    // In local development, we can still use localhost if needed, 
    // but the Render URL works everywhere now.
    return import.meta.env.PROD ? renderUrl : 'http://localhost:5000';
};
