/**
 * Normalizes a URL for consistent storage and duplicate checking.
 * Removes trailing slashes, protocol (optional, but keep for now), and standardizes casing.
 */
function normalizeUrl(url) {
    if (!url) return '';

    try {
        const urlObj = new URL(url);

        // Remove trailing slash from pathname
        let pathname = urlObj.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.substring(0, pathname.length - 1);
        }

        // Construct canonical URL
        // We keep protocol and host, but simplify the rest
        let canonical = `${urlObj.protocol}//${urlObj.hostname}${pathname}${urlObj.search}`;

        return canonical.toLowerCase().trim();
    } catch (e) {
        return url.toLowerCase().trim();
    }
}

module.exports = { normalizeUrl };
