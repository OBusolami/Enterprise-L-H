const ogs = require('open-graph-scraper');

async function fetchMetadata(url) {
    try {
        const { result } = await ogs({ url });

        // Construct simplified metadata object
        return {
            title: result.ogTitle || result.twitterTitle || result.dcTitle || '',
            description: result.ogDescription || result.twitterDescription || result.dcDescription || '',
            image_url: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null,
            site_name: result.ogSiteName || '',
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null; // Return null on failure, don't crash
    }
}

module.exports = { fetchMetadata };
