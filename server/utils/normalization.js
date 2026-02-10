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
        // We lowercase the protocol and host, but PRESERVE case for pathname and search
        const protocol = urlObj.protocol.toLowerCase();
        const host = urlObj.hostname.toLowerCase();

        let canonical = `${protocol}//${host}${pathname}${urlObj.search}`;

        return canonical.trim();
    } catch (e) {
        // Fallback: trim but don't lowercase everything, as it might be a valid but unusual URL
        return url.trim();
    }
}

module.exports = { normalizeUrl };
