// Diagnostic script to test server setup
console.log('Progress Point - Server Diagnostic Tool\n');
console.log('========================================\n');

// Test 1: Check Node.js version
console.log('1. Checking Node.js...');
try {
  const nodeVersion = process.version;
  console.log(`   ✓ Node.js version: ${nodeVersion}`);
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 14) {
    console.log('   ⚠ Warning: Node.js 14+ recommended');
  }
} catch (e) {
  console.log('   ✗ Node.js not found');
  process.exit(1);
}

// Test 2: Check if dependencies are installed
console.log('\n2. Checking dependencies...');
try {
  require('express');
  console.log('   ✓ express');
} catch (e) {
  console.log('   ✗ express not found - run: npm install');
  process.exit(1);
}

try {
  require('sqlite3');
  console.log('   ✓ sqlite3');
} catch (e) {
  console.log('   ✗ sqlite3 not found - run: npm install');
  process.exit(1);
}

try {
  require('cors');
  console.log('   ✓ cors');
} catch (e) {
  console.log('   ✗ cors not found - run: npm install');
  process.exit(1);
}

// Test 3: Check if port is available
console.log('\n3. Checking port availability...');
const net = require('net');
const PORT = process.env.PORT || 3000;

const server = net.createServer();
server.listen(PORT, () => {
  server.once('close', () => {
    console.log(`   ✓ Port ${PORT} is available`);
    console.log('\n========================================');
    console.log('All checks passed! Server should start.');
    console.log('Run: npm start\n');
  });
  server.close();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`   ✗ Port ${PORT} is already in use!`);
    console.log(`   Solution: Change PORT in server/index.js or stop the app using port ${PORT}`);
  } else {
    console.log(`   ✗ Error: ${err.message}`);
  }
  console.log('\n========================================');
  process.exit(1);
});

// Test 4: Check file structure
console.log('\n4. Checking file structure...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server/index.js',
  'server/database.js',
  'public/index.html',
  'public/app.js',
  'public/styles.css'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n========================================');
  console.log('Some required files are missing!');
  process.exit(1);
}
