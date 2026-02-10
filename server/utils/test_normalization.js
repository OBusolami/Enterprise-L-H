const { normalizeUrl } = require('./normalization');

const testUrls = [
    {
        name: 'YouTube URL with Mixed Case ID',
        input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        expected: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
        name: 'URL with Trailing Slash',
        input: 'https://Example.com/Path/',
        expected: 'https://example.com/Path'
    },
    {
        name: 'URL with Uppercase Host',
        input: 'HTTP://WEBSITE.COM/index.html?ID=123',
        expected: 'http://website.com/index.html?ID=123'
    }
];

testUrls.forEach(test => {
    const result = normalizeUrl(test.input);
    console.log(`Test: ${test.name}`);
    console.log(`Input:  ${test.input}`);
    console.log(`Result: ${result}`);
    console.log(`Status: ${result === test.expected ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('---');
});
