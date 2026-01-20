# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`
   - The PWA will automatically register the service worker
   - You can install it as an app on your device

## Features Overview

### 🏠 Home Page
- Navigate between all features
- Motivational quotes rotate automatically
- Click feature cards to navigate

### ✓ Todo List
- Click "Add Task" to create new tasks
- Set priority (Low/Medium/High)
- Filter by date or priority
- Replicate tasks for multiple days
- View dashboard with stats and streak

### 📊 Habit Tracker
- Create habits with 21-day challenges
- Click on day numbers to mark as complete
- View progress percentage

### 🧘 Meditation
- Select from 20 meditation tracks
- Set timer (5-20 minutes)
- Start meditation session

### ⏱️ Study Timer
- Choose technique (Pomodoro, 52/17, Custom)
- Start/pause/reset timer
- View session history

### 📖 Motivational Stories
- Browse preloaded stories
- Search by person name
- Mark favorites
- Click stories to read full content

## Dark/Light Mode
- Click the theme toggle button in the header
- Preference is saved in localStorage

## Offline Support
- The app works offline using IndexedDB
- Data syncs when connection is restored
- Service worker caches static assets

## Database
- SQLite database is created automatically on first run
- Database file: `server/database.sqlite`
- Preloaded with meditation tracks and motivational stories

## Troubleshooting

**Port already in use:**
- Change PORT in `server/index.js` or set environment variable

**Service worker not registering:**
- Make sure you're accessing via `http://localhost` (not file://)
- Check browser console for errors

**Database errors:**
- Delete `server/database.sqlite` to reset
- Restart the server

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Render
1. Connect GitHub repository
2. Build command: `npm install`
3. Start command: `npm start`

## Next Steps
- Customize colors in `public/styles.css`
- Add more meditation tracks in database
- Add more motivational stories
- Customize PWA manifest in `public/manifest.json`
