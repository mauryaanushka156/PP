# SIMPLE START GUIDE - If Nothing Works

## 🚨 Emergency: Start from Scratch

### Step 1: Verify Node.js is Installed

Open PowerShell or Command Prompt and type:
```bash
node --version
```

**If you see an error:**
- Download Node.js from: https://nodejs.org/
- Install it
- **RESTART your computer**
- Open a NEW terminal window
- Try `node --version` again

**If you see a version number (like v18.17.0):**
- ✅ Node.js is installed, continue to Step 2

---

### Step 2: Open Terminal in Project Folder

**Method 1:**
1. Press `Windows Key + E` to open File Explorer
2. Navigate to: `C:\Users\ADMIN\Desktop\java`
3. Click in the address bar, type `powershell`, press Enter

**Method 2:**
1. Right-click on the `java` folder
2. Select "Open in Terminal" or "Open PowerShell here"

**Method 3:**
1. Open PowerShell
2. Type: `cd C:\Users\ADMIN\Desktop\java`
3. Press Enter

---

### Step 3: Install Dependencies

In the terminal, type:
```bash
npm install
```

**Wait for it to finish** (may take 2-5 minutes)

**If you see errors:**
- Make sure you're connected to the internet
- Try: `npm install --verbose` to see detailed errors
- If it says "permission denied", run PowerShell as Administrator

---

### Step 4: Start the Server

Type:
```bash
npm start
```

**You should see:**
```
Database initialized successfully
✓ Server running on port 3000
✓ Open http://localhost:3000 in your browser
```

**If you see errors, note them down!**

---

### Step 5: Open Browser

1. Open Chrome, Firefox, or Edge
2. Type in address bar: `http://localhost:3000`
3. Press Enter

---

## 🔧 Common Problems

### Problem: "npm is not recognized"

**Solution:**
1. Node.js is not installed OR not in PATH
2. Install Node.js from https://nodejs.org/
3. **IMPORTANT:** During installation, check "Add to PATH"
4. Restart your computer
5. Open a NEW terminal window

---

### Problem: "Port 3000 already in use"

**Solution:**
1. Close any other programs that might be using port 3000
2. Or change the port:
   - Open `server/index.js`
   - Find line 8: `const PORT = process.env.PORT || 3000;`
   - Change to: `const PORT = process.env.PORT || 3001;`
   - Save the file
   - Access at `http://localhost:3001`

---

### Problem: "Cannot find module"

**Solution:**
```bash
npm install
```

If that doesn't work:
```bash
rm -rf node_modules
npm install
```

(On Windows, delete `node_modules` folder manually, then run `npm install`)

---

### Problem: "Database initialization failed"

**Solution:**
1. Make sure you have write permissions
2. Try running terminal as Administrator
3. Delete `server/database.sqlite` if it exists
4. Run `npm start` again

---

### Problem: Server starts but browser shows "Can't connect"

**Check:**
1. Is the server actually running? Look for the success message
2. Are you using `http://localhost:3000` (NOT `https://`)
3. Try `http://127.0.0.1:3000` instead
4. Check Windows Firewall - allow Node.js through firewall

---

## 🆘 Still Not Working?

### Get Help - Provide This Info:

1. **Node.js version:**
   ```bash
   node --version
   ```

2. **npm version:**
   ```bash
   npm --version
   ```

3. **What happens when you run `npm start`?**
   - Copy the FULL error message

4. **What happens in browser?**
   - What error do you see?
   - Press F12, check Console tab for errors

5. **Test browser:**
   - Open `STANDALONE-TEST.html` in your browser
   - Do the tests pass?

---

## 🎯 Alternative: Use a Different Port

If port 3000 is causing issues:

1. Edit `server/index.js`
2. Change line 8 to:
   ```javascript
   const PORT = process.env.PORT || 8080;
   ```
3. Save
4. Run `npm start`
5. Access at `http://localhost:8080`

---

## 📋 Checklist

Before asking for help, make sure:

- [ ] Node.js is installed (`node --version` works)
- [ ] npm is installed (`npm --version` works)
- [ ] You're in the correct folder (`C:\Users\ADMIN\Desktop\java`)
- [ ] Dependencies are installed (`node_modules` folder exists)
- [ ] No other app is using port 3000
- [ ] You're using `http://` not `https://`
- [ ] Browser console (F12) shows no blocking errors

---

## 🚀 Quick Test Without Server

1. Open `STANDALONE-TEST.html` in your browser
2. If tests pass, your browser is fine - the issue is with the server
3. If tests fail, update your browser

---

## 💡 Last Resort: Use a Different Computer

If nothing works on this computer:
1. Copy the entire `java` folder to another computer
2. Install Node.js on that computer
3. Run `npm install` then `npm start`
4. This will tell us if it's a computer-specific issue
