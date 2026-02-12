export const getApiUrl = () => {
    // We now use a proxy in vite.config.js for local dev, 
    // and Vercel routing for production. Both use relative paths.
    const url = '';
    console.log('Using API Base URL:', url || '(relative)');
    return url;
};
