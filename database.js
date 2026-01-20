const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
let db;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tasks table
      db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Habits table
      db.run(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        duration INTEGER DEFAULT 21,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Habit checks table
      db.run(`CREATE TABLE IF NOT EXISTS habit_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        checked INTEGER DEFAULT 0,
        FOREIGN KEY (habit_id) REFERENCES habits(id),
        UNIQUE(habit_id, date)
      )`);

      // Meditation tracks table
      db.run(`CREATE TABLE IF NOT EXISTS meditation_tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        duration INTEGER,
        favorite INTEGER DEFAULT 0
      )`);

      // Meditation sessions table
      db.run(`CREATE TABLE IF NOT EXISTS meditation_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id INTEGER,
        duration INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (track_id) REFERENCES meditation_tracks(id)
      )`);

      // Study sessions table
      db.run(`CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        technique TEXT NOT NULL,
        duration INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Stories table
      db.run(`CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        person_name TEXT NOT NULL,
        content TEXT NOT NULL,
        favorite INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_habit_checks_date ON habit_checks(date)`);

      // Insert default meditation tracks
      db.run(`INSERT OR IGNORE INTO meditation_tracks (name, url, duration) VALUES
        ('Nature Sounds', '/audio/nature.mp3', 600),
        ('Ocean Waves', '/audio/ocean.mp3', 600),
        ('Forest Ambience', '/audio/forest.mp3', 900),
        ('Rain Sounds', '/audio/rain.mp3', 600),
        ('Zen Garden', '/audio/zen.mp3', 1200),
        ('Mountain Stream', '/audio/stream.mp3', 600),
        ('Desert Wind', '/audio/wind.mp3', 900),
        ('Thunderstorm', '/audio/thunder.mp3', 600),
        ('Birds Chirping', '/audio/birds.mp3', 900),
        ('Waterfall', '/audio/waterfall.mp3', 600),
        ('Tibetan Bowls', '/audio/tibetan.mp3', 1200),
        ('Flute Meditation', '/audio/flute.mp3', 900),
        ('Piano Peace', '/audio/piano.mp3', 1200),
        ('Crystal Singing', '/audio/crystal.mp3', 900),
        ('Binaural Beats', '/audio/binaural.mp3', 1200),
        ('Chanting', '/audio/chanting.mp3', 900),
        ('Gong Bath', '/audio/gong.mp3', 1200),
        ('Singing Bowls', '/audio/singing-bowls.mp3', 1200),
        ('White Noise', '/audio/white-noise.mp3', 600),
        ('Brown Noise', '/audio/brown-noise.mp3', 600)
      `);

      // Insert default motivational stories
      db.run(`INSERT OR IGNORE INTO stories (title, person_name, content) VALUES
        ('The Inventor', 'Thomas Edison', 'Thomas Edison failed thousands of times before inventing the light bulb. When asked about his failures, he said, "I have not failed. I have just found 10,000 ways that won''t work." His persistence and refusal to give up led to one of the most transformative inventions in history.'),
        ('The Champion', 'Michael Jordan', 'Michael Jordan was cut from his high school basketball team. Instead of giving up, he used this rejection as motivation. He practiced harder than anyone else, eventually becoming one of the greatest basketball players of all time. His story teaches us that setbacks are setups for comebacks.'),
        ('The Leader', 'Nelson Mandela', 'Nelson Mandela spent 27 years in prison fighting against apartheid. After his release, he became South Africa''s first black president and worked to heal a divided nation. His unwavering commitment to justice and forgiveness changed the world forever.'),
        ('The Scientist', 'Marie Curie', 'Marie Curie was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences. Despite facing discrimination as a woman in science, she persisted in her research on radioactivity, saving countless lives through medical applications.'),
        ('The Entrepreneur', 'Steve Jobs', 'Steve Jobs was fired from Apple, the company he co-founded. Instead of giving up, he started NeXT and Pixar, then returned to Apple to lead it to become one of the most valuable companies in the world. His vision and persistence revolutionized technology.'),
        ('The Writer', 'J.K. Rowling', 'J.K. Rowling was a single mother living on welfare when she wrote the first Harry Potter book. It was rejected by 12 publishers before being accepted. Today, she is one of the wealthiest authors in the world, proving that persistence pays off.'),
        ('The Athlete', 'Wilma Rudolph', 'Wilma Rudolph was told she would never walk again after contracting polio as a child. Through determination and physical therapy, she not only learned to walk but became the fastest woman in the world, winning three gold medals at the 1960 Olympics.'),
        ('The Activist', 'Malala Yousafzai', 'Malala Yousafzai was shot by the Taliban for advocating girls'' education. She survived and continued her fight, becoming the youngest Nobel Prize laureate. Her courage and determination have inspired millions worldwide to stand up for education rights.')
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

// Task functions
const getTasks = (date, priority) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    } else {
      // Get latest day's tasks by default
      query += ' AND date = (SELECT MAX(date) FROM tasks)';
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY priority DESC, created_at ASC';

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const createTask = (task) => {
  return new Promise((resolve, reject) => {
    const { name, description, priority = 'Medium', date } = task;
    db.run(
      'INSERT INTO tasks (name, description, priority, date) VALUES (?, ?, ?, ?)',
      [name, description || '', priority, date || new Date().toISOString().split('T')[0]],
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

const updateTask = (id, updates) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.date !== undefined) {
      fields.push('date = ?');
      values.push(updates.date);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }

    values.push(id);
    db.run(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values,
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const replicateTask = (taskId, targetDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
      if (err) {
        reject(err);
        return;
      }

      const tasks = [];
      const startDate = new Date(targetDate);
      const end = endDate ? new Date(endDate) : new Date(targetDate);
      const currentDate = new Date(startDate);

      const insertPromises = [];
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        insertPromises.push(
          new Promise((res, rej) => {
            db.run(
              'INSERT INTO tasks (name, description, priority, date) VALUES (?, ?, ?, ?)',
              [task.name, task.description, task.priority, dateStr],
              function(insertErr) {
                if (insertErr) rej(insertErr);
                else {
                  db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (getErr, newTask) => {
                    if (getErr) rej(getErr);
                    else {
                      tasks.push(newTask);
                      res();
                    }
                  });
                }
              }
            );
          })
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }

      Promise.all(insertPromises).then(() => resolve(tasks)).catch(reject);
    });
  });
};

const getTaskStats = (date) => {
  return new Promise((resolve, reject) => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
      FROM tasks WHERE date = ?`,
      [queryDate],
      (err, row) => {
        if (err) reject(err);
        else {
          const stats = {
            total: row.total || 0,
            completed: row.completed || 0,
            pending: row.pending || 0,
            percentage: row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0
          };
          resolve(stats);
        }
      }
    );
  });
};

const getStreak = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT date, 
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        COUNT(*) as total
      FROM tasks 
      GROUP BY date 
      HAVING completed = total AND completed > 0
      ORDER BY date DESC`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (!rows || rows.length === 0) {
          resolve(0);
          return;
        }

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < rows.length; i++) {
          const rowDate = new Date(rows[i].date);
          rowDate.setHours(0, 0, 0, 0);
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - streak);

          if (rowDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }

        resolve(streak);
      }
    );
  });
};

// Habit functions
const getHabits = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM habits ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const createHabit = (habit) => {
  return new Promise((resolve, reject) => {
    const { name, start_date, duration = 21 } = habit;
    db.run(
      'INSERT INTO habits (name, start_date, duration) VALUES (?, ?, ?)',
      [name, start_date || new Date().toISOString().split('T')[0], duration],
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM habits WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

const checkHabit = (habitId, date, checked) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO habit_checks (habit_id, date, checked) VALUES (?, ?, ?)',
      [habitId, date, checked ? 1 : 0],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getHabitProgress = (habitId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
         h.duration AS duration,
         SUM(CASE WHEN hc.checked = 1 THEN 1 ELSE 0 END) AS checked_days
       FROM habits h
       LEFT JOIN habit_checks hc ON h.id = hc.habit_id
       WHERE h.id = ?
       GROUP BY h.duration`,
      [habitId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const duration = row?.duration || 0;
          const checked = row?.checked_days || 0;
          const percentage = duration > 0 ? Math.round((checked / duration) * 100) : 0;
          resolve({
            total: duration,
            checked,
            percentage
          });
        }
      }
    );
  });
};

const getHabitChecks = (habitId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT date, checked FROM habit_checks WHERE habit_id = ? AND checked = 1',
      [habitId],
      (err, rows) => {
        if (err) reject(err);
        else {
          const checkedDates = rows.map(row => row.date);
          resolve(checkedDates);
        }
      }
    );
  });
};

// Meditation functions
const getMeditationTracks = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM meditation_tracks ORDER BY favorite DESC, name ASC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const createMeditationSession = (session) => {
  return new Promise((resolve, reject) => {
    const { track_id, duration, completed = 0 } = session;
    db.run(
      'INSERT INTO meditation_sessions (track_id, duration, completed) VALUES (?, ?, ?)',
      [track_id, duration, completed ? 1 : 0],
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM meditation_sessions WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

// Study session functions
const getStudySessions = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM study_sessions ORDER BY created_at DESC LIMIT 50', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const createStudySession = (session) => {
  return new Promise((resolve, reject) => {
    const { technique, duration, completed = 0 } = session;
    db.run(
      'INSERT INTO study_sessions (technique, duration, completed) VALUES (?, ?, ?)',
      [technique, duration, completed ? 1 : 0],
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM study_sessions WHERE id = ?', [this.lastID], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

// Story functions
const getStories = (search) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM stories WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (person_name LIKE ? OR title LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY favorite DESC, created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const getStory = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM stories WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const toggleFavorite = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE stories SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getFavorites = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM stories WHERE favorite = 1 ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

module.exports = {
  init,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  replicateTask,
  getTaskStats,
  getStreak,
  getHabits,
  createHabit,
  checkHabit,
  getHabitProgress,
  getHabitChecks,
  getMeditationTracks,
  createMeditationSession,
  getStudySessions,
  createStudySession,
  getStories,
  getStory,
  toggleFavorite,
  getFavorites
};
