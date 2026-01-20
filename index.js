const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { date, priority } = req.query;
    const tasks = await db.getTasks(date, priority);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await db.createTask(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await db.deleteTask(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/replicate', async (req, res) => {
  try {
    const { taskId, targetDate, endDate } = req.body;
    const tasks = await db.replicateTask(taskId, targetDate, endDate);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/stats/:date', async (req, res) => {
  try {
    const stats = await db.getTaskStats(req.params.date);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/streak', async (req, res) => {
  try {
    const streak = await db.getStreak();
    res.json({ streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Habits
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await db.getHabits();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/habits', async (req, res) => {
  try {
    const habit = await db.createHabit(req.body);
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/habits/:id/check', async (req, res) => {
  try {
    const { date, checked } = req.body;
    await db.checkHabit(req.params.id, date, checked);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/habits/:id/progress', async (req, res) => {
  try {
    const progress = await db.getHabitProgress(req.params.id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/habits/:id/checks', async (req, res) => {
  try {
    const checks = await db.getHabitChecks(req.params.id);
    res.json(checks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Meditation
app.get('/api/meditation/tracks', async (req, res) => {
  try {
    const tracks = await db.getMeditationTracks();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/meditation/sessions', async (req, res) => {
  try {
    const session = await db.createMeditationSession(req.body);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Study Timer
app.get('/api/study/sessions', async (req, res) => {
  try {
    const sessions = await db.getStudySessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/study/sessions', async (req, res) => {
  try {
    const session = await db.createStudySession(req.body);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stories
app.get('/api/stories', async (req, res) => {
  try {
    const { search } = req.query;
    const stories = await db.getStories(search);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    const story = await db.getStory(req.params.id);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stories/:id/favorite', async (req, res) => {
  try {
    await db.toggleFavorite(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stories/favorites', async (req, res) => {
  try {
    const favorites = await db.getFavorites();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server immediately, initialize database in background
app.listen(PORT, (err) => {
  if (err) {
    console.error('\n✗ FAILED TO START SERVER!');
    console.error('Error:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use!`);
      console.error('\nSOLUTIONS:');
      console.error(`1. Change PORT in server/index.js (line 8) to 3001`);
      console.error(`2. Or kill the process: netstat -ano | findstr :${PORT}`);
      console.error(`3. Or set: set PORT=3001 && npm start\n`);
    }
    process.exit(1);
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✓ SERVER IS RUNNING!');
  console.log('='.repeat(50));
  console.log(`\n✓ Port: ${PORT}`);
  console.log(`✓ URL: http://localhost:${PORT}`);
  console.log(`✓ Test: http://localhost:${PORT}/test`);
  console.log('\n✓ Open the URL above in your browser!');
  console.log('='.repeat(50) + '\n');
  
  // Initialize database in background (non-blocking)
  db.init()
    .then(() => {
      console.log('✓ Database initialized successfully\n');
    })
    .catch((error) => {
      console.warn('⚠ Database initialization failed (app still works):', error.message);
      console.warn('  Some features may not work until database is fixed.\n');
    });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is working!', port: PORT });
});
