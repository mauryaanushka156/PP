# Progress Point - PWA

A comprehensive Progressive Web App for productivity management featuring Todo Lists, Habit Tracking, Meditation, Study Timer, and Motivational Stories.

## Features

### 🏠 Home Page
- Clean navigation to all features
- Motivational quotes bar with auto-rotation
- Feature cards for quick access

### ✓ Todo List Maker
- **Dashboard/KPI**: Total tasks, completed, pending, day streak
- **Progress Bar**: Visual completion percentage
- **Task Management**: Create, update, delete tasks
- **Priority Levels**: Low, Medium, High
- **Date Filtering**: Filter tasks by date
- **Task Replication**: Replicate tasks for single day or date range
- **Auto-display**: Shows latest day's tasks by default

### 📊 Habit Tracker
- 21-day challenge default (customizable)
- Daily habit checking
- Progress tracking with percentage
- Visual progress bar

### 🧘 Meditation
- 20 preloaded meditation tracks
- Customizable timer (5-20 minutes)
- Session tracking

### ⏱️ Study Timer
- Multiple techniques:
  - **Pomodoro**: 25 min work, 5 min break
  - **52/17**: 52 min work, 17 min break
  - **Custom**: Set your own intervals
- Session history tracking
- Visual timer display

### 📖 Motivational Stories
- Preloaded stories about great achievers
- Search functionality by person name
- Favorite stories feature
- Inspiring content

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite (can be migrated to PostgreSQL)
- **Offline Storage**: IndexedDB
- **PWA**: Service Worker for offline capabilities
- **Styling**: Sharp borders, mature color palette, dark/light mode

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Generate icons (optional - for PWA):
```bash
node generate-icons.js
```
Note: The SVG icons will be generated. For better PWA support, convert them to PNG format using an online converter or ImageMagick.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## Icon Generation

The app includes SVG icons that work for most browsers. For full PWA support, you may want to convert them to PNG:
- Use the `generate-icons.js` script to create SVG files
- Convert SVG to PNG using online tools or ImageMagick
- Update `manifest.json` to reference PNG files if needed

## Project Structure

```
.
├── server/
│   ├── index.js          # Express server and API routes
│   └── database.js       # SQLite database setup and queries
├── public/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # All styles with dark/light mode
│   ├── app.js            # Main application logic
│   ├── indexeddb.js      # Offline storage implementation
│   ├── sw.js             # Service worker
│   └── manifest.json     # PWA manifest
├── package.json
└── README.md
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get tasks (supports ?date= and ?priority= query params)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/replicate` - Replicate task
- `GET /api/tasks/stats/:date` - Get task statistics
- `GET /api/tasks/streak` - Get day streak

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id/check` - Check/uncheck habit day
- `GET /api/habits/:id/progress` - Get habit progress

### Meditation
- `GET /api/meditation/tracks` - Get meditation tracks
- `POST /api/meditation/sessions` - Create meditation session

### Study Timer
- `GET /api/study/sessions` - Get study sessions
- `POST /api/study/sessions` - Create study session

### Stories
- `GET /api/stories` - Get stories (supports ?search= query param)
- `GET /api/stories/:id` - Get single story
- `POST /api/stories/:id/favorite` - Toggle favorite
- `GET /api/stories/favorites` - Get favorite stories

## PWA Features

- ✅ Service Worker for offline functionality
- ✅ IndexedDB for offline data storage
- ✅ Manifest.json for installability
- ✅ Responsive design
- ✅ Dark/Light mode toggle

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Follow prompts

### Render
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
