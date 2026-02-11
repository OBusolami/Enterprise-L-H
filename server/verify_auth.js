const http = require('http');

const data = JSON.stringify({
    email: 'test_user@example.com'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing Authentication Endpoint...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:');
        console.log(body);
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('SUCCESS: Auth flow working (assuming database is set up and server is running)');
        } else {
            console.log('FAILURE: Unexpected status code');
        }
    });
});

req.on('error', (error) => {
    console.error(`ERROR: Could not connect to server. Is it running? Error: ${error.message}`);
});

req.write(data);
req.end();
