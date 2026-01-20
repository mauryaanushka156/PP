// IndexedDB for offline storage
const DB_NAME = 'ProgressPointDB';
const DB_VERSION = 1;

let db = null;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        taskStore.createIndex('date', 'date', { unique: false });
        taskStore.createIndex('priority', 'priority', { unique: false });
      }

      // Habits store
      if (!db.objectStoreNames.contains('habits')) {
        const habitStore = db.createObjectStore('habits', { keyPath: 'id', autoIncrement: true });
        habitStore.createIndex('start_date', 'start_date', { unique: false });
      }

      // Habit checks store
      if (!db.objectStoreNames.contains('habit_checks')) {
        const checkStore = db.createObjectStore('habit_checks', { keyPath: ['habit_id', 'date'] });
        checkStore.createIndex('habit_id', 'habit_id', { unique: false });
        checkStore.createIndex('date', 'date', { unique: false });
      }

      // Meditation sessions store
      if (!db.objectStoreNames.contains('meditation_sessions')) {
        db.createObjectStore('meditation_sessions', { keyPath: 'id', autoIncrement: true });
      }

      // Study sessions store
      if (!db.objectStoreNames.contains('study_sessions')) {
        db.createObjectStore('study_sessions', { keyPath: 'id', autoIncrement: true });
      }

      // Stories favorites store
      if (!db.objectStoreNames.contains('story_favorites')) {
        db.createObjectStore('story_favorites', { keyPath: 'story_id' });
      }
    };
  });
};

const getDB = () => {
  if (db) return Promise.resolve(db);
  return initDB();
};

// Tasks
const saveTaskOffline = async (task) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.add(task);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getTasksOffline = async (date, priority) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['tasks'], 'readonly');
    const store = transaction.objectStore('tasks');
    const request = store.getAll();

    request.onsuccess = () => {
      let tasks = request.result;
      if (date) {
        tasks = tasks.filter(t => t.date === date);
      }
      if (priority) {
        tasks = tasks.filter(t => t.priority === priority);
      }
      resolve(tasks);
    };
    request.onerror = () => reject(request.error);
  });
};

const updateTaskOffline = async (id, updates) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const task = getRequest.result;
      if (task) {
        Object.assign(task, updates);
        const putRequest = store.put(task);
        putRequest.onsuccess = () => resolve(task);
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        reject(new Error('Task not found'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

const deleteTaskOffline = async (id) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['tasks'], 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Habits
const saveHabitOffline = async (habit) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['habits'], 'readwrite');
    const store = transaction.objectStore('habits');
    const request = store.add(habit);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getHabitsOffline = async () => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['habits'], 'readonly');
    const store = transaction.objectStore('habits');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const checkHabitOffline = async (habitId, date, checked) => {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['habit_checks'], 'readwrite');
    const store = transaction.objectStore('habit_checks');
    const request = store.put({ habit_id: habitId, date, checked });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Sync functions
const syncTasksToServer = async () => {
  try {
    const database = await getDB();
    const transaction = database.transaction(['tasks'], 'readonly');
    const store = transaction.objectStore('tasks');
    const request = store.getAll();

    request.onsuccess = async () => {
      const tasks = request.result;
      for (const task of tasks) {
        if (!task.synced) {
          try {
            await fetch('/api/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(task)
            });
            await updateTaskOffline(task.id, { synced: true });
          } catch (error) {
            console.error('Failed to sync task:', error);
          }
        }
      }
    };
  } catch (error) {
    console.error('Sync error:', error);
  }
};

// Initialize DB on load
if (typeof window !== 'undefined') {
  initDB().catch(console.error);
}

// Export for use in app.js (make available globally)
window.IndexedDBHelper = {
  initDB,
  getDB,
  saveTaskOffline,
  getTasksOffline,
  updateTaskOffline,
  deleteTaskOffline,
  saveHabitOffline,
  getHabitsOffline,
  checkHabitOffline,
  syncTasksToServer
};

// Also make functions available globally for easier access
window.getTasksOffline = getTasksOffline;
window.syncTasksToServer = syncTasksToServer;
