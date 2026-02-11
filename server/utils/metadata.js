const ogs = require('open-graph-scraper');

async function fetchMetadata(url) {
    try {
        console.log(`Fetching metadata for: ${url}`);
        const { result } = await ogs({ url, timeout: 5000 }); // Add timeout

        // Construct simplified metadata object
        return {
            title: result.ogTitle || result.twitterTitle || result.dcTitle || '',
            description: result.ogDescription || result.twitterDescription || result.dcDescription || '',
            image_url: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null,
            site_name: result.ogSiteName || '',
        };
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error.message);
        // Return structured but empty metadata on failure to prevent crashes
        return {
            title: '',
            description: '',
            image_url: null,
            site_name: ''
        };
    }
}

module.exports = { fetchMetadata };
