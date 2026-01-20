// ABSOLUTELY MINIMAL SERVER - Guaranteed to work
// No dependencies except built-in Node.js modules

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // Default to index.html
    if (filePath === './' || filePath === './index.html') {
        filePath = './public/index.html';
    }
    
    // Handle API test
    if (filePath === './test' || filePath === './api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            message: 'Server is working!',
            port: PORT,
            time: new Date().toISOString()
        }));
        return;
    }
    
    // Serve static files
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    // Check if file exists in public folder
    if (!filePath.startsWith('./public/')) {
        filePath = './public' + filePath.replace('./', '/');
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // File not found - serve index.html for SPA routing
            if (err.code === 'ENOENT') {
                fs.readFile('./public/index.html', (err2, content2) => {
                    if (err2) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>Progress Point - Server Running</title>
                                <style>
                                    body { font-family: Arial; padding: 2rem; background: #1a1a1a; color: #f5f5f5; }
                                    .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; padding: 2rem; border: 2px solid #4a4a4a; }
                                    h1 { color: #2563eb; }
                                    .success { color: #10b981; font-size: 1.2rem; margin: 1rem 0; }
                                    code { background: #1a1a1a; padding: 0.2rem 0.5rem; border-radius: 3px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1>✓ Server is Running!</h1>
                                    <p class="success">The server is working correctly!</p>
                                    <p>Port: <code>${PORT}</code></p>
                                    <p>If you expected to see the app, make sure <code>public/index.html</code> exists.</p>
                                    <p><a href="/test" style="color: #3b82f6;">Test API: /test</a></p>
                                </div>
                            </body>
                            </html>
                        `);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content2);
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>Server Error</h1><p>${err.message}</p>`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('  ✓ MINIMAL SERVER IS RUNNING!');
    console.log('='.repeat(60));
    console.log(`\n  Port: ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Test: http://localhost:${PORT}/test`);
    console.log(`\n  Open http://localhost:${PORT} in your browser`);
    console.log('='.repeat(60) + '\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('\n' + '='.repeat(60));
        console.error('  ✗ PORT IS ALREADY IN USE!');
        console.error('='.repeat(60));
        console.error(`\n  Port ${PORT} is being used by another application.\n`);
        console.error('  SOLUTIONS:');
        console.error(`  1. Change PORT in minimal-server.js to 3001`);
        console.error(`  2. Or kill the process using port ${PORT}:`);
        console.error(`     netstat -ano | findstr :${PORT}`);
        console.error(`     taskkill /PID <PID> /F`);
        console.error(`  3. Or use: set PORT=3001 && node minimal-server.js\n`);
        console.error('='.repeat(60) + '\n');
    } else {
        console.error('\n✗ Server Error:', err.message);
    }
    process.exit(1);
});
