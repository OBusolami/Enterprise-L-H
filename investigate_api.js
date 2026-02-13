const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function testApi() {
    const baseUrl = 'https://enterprise-l-h.onrender.com/api/resources';

    console.log('Fetching ?status=active...');
    const active = await get(`${baseUrl}?status=active`);
    console.log(`Results: ${active.data.length}`);
    if (active.data.length > 0) {
        console.log(`First item status: ${active.data[0].status}`);
    }

    console.log('\nFetching ?status=archived...');
    const archived = await get(`${baseUrl}?status=archived`);
    console.log(`Results: ${archived.data.length}`);
    if (archived.data.length > 0) {
        console.log(`First item status: ${archived.data[0].status}`);
    }
}

testApi();
