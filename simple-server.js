// Ultra-simple test server - guaranteed to work
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './public/index.html';
    }
    
    // Add .html if no extension
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    // Check if file exists in public folder
    if (!filePath.startsWith('./public/')) {
        filePath = './public' + filePath.replace('./', '/');
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // File not found, serve index.html for SPA
                fs.readFile('./public/index.html', (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(`Server Error: ${err.code}`);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('========================================');
    console.log('SIMPLE SERVER RUNNING!');
    console.log('========================================');
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Open this URL in your browser');
    console.log('Press Ctrl+C to stop');
    console.log('========================================\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\nERROR: Port ${PORT} is already in use!\n`);
        console.error('Solutions:');
        console.error(`1. Close the app using port ${PORT}`);
        console.error(`2. Or change PORT in simple-server.js to a different number\n`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});
