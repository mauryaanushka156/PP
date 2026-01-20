# Setup Instructions - Fix "Site Can't Be Reached" Error

## Problem
The "site can't be reached" error means the server isn't running. This is because Node.js needs to be installed first.

## Solution

### Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation
   - Complete the installation

3. **Verify Installation:**
   - Open a NEW PowerShell or Command Prompt window
   - Run these commands to verify:
   ```bash
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., v18.17.0 and 9.6.7)

### Step 2: Install Project Dependencies

1. **Open Terminal in Project Folder:**
   - Navigate to: `C:\Users\ADMIN\Desktop\java`
   - Right-click in the folder → "Open in Terminal" or "Open PowerShell here"

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   - This will install all required packages (express, sqlite3, etc.)
   - Wait for it to complete (may take 1-2 minutes)

### Step 3: Start the Server

1. **Start the Server:**
   ```bash
   npm start
   ```
   
2. **You should see:**
   ```
   Database initialized successfully
   Server running on port 3000
   ```

3. **Open Browser:**
   - Go to: `http://localhost:3000`
   - The app should now load!

### Step 4: Verify It's Working

- You should see the "Progress Point" homepage
- Navigation buttons should work
- Motivational quotes should be rotating

## Troubleshooting

### Error: "npm is not recognized"
- **Solution:** Node.js is not installed or not in PATH
- Restart your terminal after installing Node.js
- Or reinstall Node.js and make sure "Add to PATH" is checked

### Error: "Port 3000 already in use"
- **Solution:** Another application is using port 3000
- Change the port in `server/index.js`:
  ```javascript
  const PORT = process.env.PORT || 3001; // Change 3000 to 3001
  ```
- Then access at `http://localhost:3001`

### Error: "Cannot find module"
- **Solution:** Dependencies not installed
- Run `npm install` again

### Error: "Database initialization failed"
- **Solution:** SQLite might have permission issues
- Make sure you have write permissions in the project folder
- Try running terminal as Administrator

### Server starts but page is blank
- **Solution:** Check browser console (F12) for errors
- Make sure you're accessing `http://localhost:3000` (not `file://`)
- Service worker needs HTTP, not file protocol

## Alternative: Use Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

**Note:** This requires `nodemon` which is already in devDependencies.

## Still Having Issues?

1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the correct folder: `cd C:\Users\ADMIN\Desktop\java`
3. Make sure dependencies are installed: `npm install`
4. Check for error messages when running `npm start`
5. Try a different port if 3000 is busy

## Quick Test

After installing Node.js, test with:
```bash
node --version
npm --version
cd C:\Users\ADMIN\Desktop\java
npm install
npm start
```

Then open: http://localhost:3000
