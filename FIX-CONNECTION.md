# Fix "Connection Failed" Error

## Quick Diagnosis

Run this command to check what's wrong:
```bash
node test-server.js
```

This will tell you:
- ✓ If Node.js is installed correctly
- ✓ If all dependencies are installed
- ✓ If the port is available
- ✓ If all files are present

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
1. **Option A - Change Port:**
   - Edit `server/index.js`
   - Change line 8: `const PORT = process.env.PORT || 3001;`
   - Access at `http://localhost:3001`

2. **Option B - Stop Other App:**
   - Find what's using port 3000:
     ```bash
     netstat -ano | findstr :3000
     ```
   - Kill the process (replace PID with the number shown):
     ```bash
     taskkill /PID <PID> /F
     ```

### Issue 2: Dependencies Not Installed

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
npm install
```

Wait for it to complete, then try again.

### Issue 3: Database Permission Error

**Error:** `Database initialization failed`

**Solution:**
1. Make sure you have write permissions in the project folder
2. Try running PowerShell/CMD as Administrator
3. Delete `server/database.sqlite` if it exists and restart

### Issue 4: SQLite3 Build Failed

**Error:** `node-gyp` or `sqlite3` installation errors

**Solution:**
1. Install Windows Build Tools:
   ```bash
   npm install --global windows-build-tools
   ```
2. Or use prebuilt binary:
   ```bash
   npm install sqlite3 --build-from-source=sqlite3
   ```

### Issue 5: Server Starts But Browser Can't Connect

**Check:**
1. Is the server actually running? Look for:
   ```
   ✓ Server running on port 3000
   ```
2. Are you using the correct URL?
   - Use: `http://localhost:3000`
   - NOT: `file:///C:/...`
   - NOT: `https://localhost:3000`
3. Check Windows Firewall:
   - Allow Node.js through firewall
   - Or temporarily disable firewall to test

### Issue 6: "Cannot GET /" Error

**Solution:**
- Make sure `public/index.html` exists
- Check that `express.static` path is correct in `server/index.js`

## Step-by-Step Fix

1. **Run Diagnostic:**
   ```bash
   node test-server.js
   ```

2. **If dependencies missing:**
   ```bash
   npm install
   ```

3. **If port busy, change it:**
   - Edit `server/index.js`, line 8
   - Change `3000` to `3001` or `8080`

4. **Start server:**
   ```bash
   npm start
   ```

5. **Check output:**
   - Should see: `✓ Server running on port XXXX`
   - Should see: `✓ Database initialized successfully`

6. **Open browser:**
   - Go to: `http://localhost:XXXX` (replace XXXX with your port)

## Still Not Working?

### Check Server Logs

When you run `npm start`, you should see:
```
Database initialized successfully
✓ Server running on port 3000
✓ Open http://localhost:3000 in your browser
```

If you see errors, they will tell you what's wrong.

### Manual Test

1. **Test if server responds:**
   ```bash
   curl http://localhost:3000
   ```
   Or open browser to `http://localhost:3000`

2. **Test API:**
   ```bash
   curl http://localhost:3000/api/tasks
   ```
   Should return: `[]` (empty array)

3. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

### Alternative: Use Different Port

Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 8080; // Changed from 3000
```

Then access: `http://localhost:8080`

## Emergency Fix: Reset Everything

1. Delete `node_modules` folder
2. Delete `server/database.sqlite`
3. Run: `npm install`
4. Run: `npm start`

## Get Help

If nothing works, provide:
1. Output of `node test-server.js`
2. Output of `npm start`
3. Any error messages from browser console (F12)
4. Your Node.js version: `node --version`
