// Motivational Quotes
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "The only impossible journey is the one you never begin. - Tony Robbins",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis"
];

let currentQuoteIndex = 0;
let isOnline = navigator.onLine;

// Theme Management
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

const updateThemeIcon = (theme) => {
    const icon = document.getElementById('themeIcon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
};

// Navigation
const initNavigation = () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            showPage(page);
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            showPage(page);
            navButtons.forEach(b => {
                if (b.dataset.page === page) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        });
    });
};

const showPage = (pageName) => {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        // Load page-specific data
        if (pageName === 'todo') loadTasks();
        else if (pageName === 'habits') loadHabits();
        else if (pageName === 'meditation') loadMeditationTracks();
        else if (pageName === 'study') loadStudySessions();
        else if (pageName === 'stories') loadStories();
    }
};

// Quotes
const initQuotes = () => {
    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    updateQuote();
    
    document.getElementById('nextQuote').addEventListener('click', () => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        updateQuote();
    });

    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        updateQuote();
    }, 10000);
};

const updateQuote = () => {
    document.getElementById('quoteText').textContent = quotes[currentQuoteIndex];
};

// API Helper
const apiCall = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        // Try offline storage if available
        throw error;
    }
};

// Tasks
let currentFilter = { date: null, priority: null };

const loadTasks = async () => {
    try {
        const date = currentFilter.date || new Date().toISOString().split('T')[0];
        let url = `/api/tasks?date=${date}`;
        if (currentFilter.priority) url += `&priority=${currentFilter.priority}`;
        
        const tasks = await apiCall(url);
        displayTasks(tasks);
        await updateTaskStats(date);
        await updateStreak();
    } catch (error) {
        console.error('Failed to load tasks:', error);
        // Try offline
        try {
            const tasks = await getTasksOffline(currentFilter.date, currentFilter.priority);
            displayTasks(tasks);
        } catch (offlineError) {
            console.error('Offline load failed:', offlineError);
        }
    }
};

const displayTasks = (tasks) => {
    const taskList = document.getElementById('taskList');
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">No tasks found</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id}, this.checked)">
                    <span class="task-name ${task.completed ? 'completed' : ''}">${escapeHtml(task.name)}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-date">${task.date}</div>
            </div>
            <div class="task-actions">
                <button class="btn btn-small" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
};

const toggleTask = async (id, completed) => {
    try {
        await apiCall(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ completed })
        });
        await loadTasks();
    } catch (error) {
        console.error('Failed to toggle task:', error);
    }
};

const editTask = async (id) => {
    try {
        const tasks = await apiCall(`/api/tasks`);
        const task = tasks.find(t => t.id === id);
        if (task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskName').value = task.name;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDate').value = task.date;
            document.getElementById('taskModalTitle').textContent = 'Edit Task';
            document.getElementById('taskModal').classList.add('active');
        }
    } catch (error) {
        console.error('Failed to load task:', error);
    }
};

const deleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await apiCall(`/api/tasks/${id}`, { method: 'DELETE' });
        await loadTasks();
    } catch (error) {
        console.error('Failed to delete task:', error);
    }
};

const updateTaskStats = async (date) => {
    try {
        const stats = await apiCall(`/api/tasks/stats/${date}`);
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('pendingTasks').textContent = stats.pending;
        
        const percentage = stats.percentage;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${percentage}%`;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
};

const updateStreak = async () => {
    try {
        const result = await apiCall('/api/tasks/streak');
        document.getElementById('dayStreak').textContent = result.streak;
    } catch (error) {
        console.error('Failed to load streak:', error);
    }
};

// Task Form
const initTaskForm = () => {
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        document.getElementById('taskId').value = '';
        document.getElementById('taskForm').reset();
        document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('taskModalTitle').textContent = 'Add Task';
        document.getElementById('taskModal').classList.add('active');
    });

    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskData = {
            name: document.getElementById('taskName').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            date: document.getElementById('taskDate').value
        };

        const taskId = document.getElementById('taskId').value;
        try {
            if (taskId) {
                await apiCall(`/api/tasks/${taskId}`, {
                    method: 'PUT',
                    body: JSON.stringify(taskData)
                });
            } else {
                await apiCall('/api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(taskData)
                });
            }
            document.getElementById('taskModal').classList.remove('active');
            await loadTasks();
        } catch (error) {
            alert('Failed to save task. Please try again.');
            console.error('Failed to save task:', error);
        }
    });

    document.getElementById('cancelTask').addEventListener('click', () => {
        document.getElementById('taskModal').classList.remove('active');
    });
};

// Filter
const initFilter = () => {
    document.getElementById('filterTaskBtn').addEventListener('click', () => {
        document.getElementById('filterModal').classList.add('active');
    });

    document.getElementById('applyFilter').addEventListener('click', async () => {
        currentFilter.date = document.getElementById('filterDate').value || null;
        currentFilter.priority = document.getElementById('filterPriority').value || null;
        document.getElementById('filterModal').classList.remove('active');
        await loadTasks();
    });

    document.getElementById('clearFilter').addEventListener('click', async () => {
        currentFilter = { date: null, priority: null };
        document.getElementById('filterDate').value = '';
        document.getElementById('filterPriority').value = '';
        document.getElementById('filterModal').classList.remove('active');
        await loadTasks();
    });
};

// Replicate
const initReplicate = () => {
    document.getElementById('replicateTaskBtn').addEventListener('click', async () => {
        try {
            const tasks = await apiCall('/api/tasks');
            const select = document.getElementById('replicateTaskSelect');
            select.innerHTML = '<option value="">Select a task...</option>' +
                tasks.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
            document.getElementById('replicateTargetDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('replicateEndDate').value = '';
            document.getElementById('replicateModal').classList.add('active');
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    });

    document.getElementById('applyReplicate').addEventListener('click', async () => {
        const taskId = document.getElementById('replicateTaskSelect').value;
        const targetDate = document.getElementById('replicateTargetDate').value;
        const endDate = document.getElementById('replicateEndDate').value;

        if (!taskId || !targetDate) {
            alert('Please select a task and target date');
            return;
        }

        try {
            await apiCall('/api/tasks/replicate', {
                method: 'POST',
                body: JSON.stringify({ taskId: parseInt(taskId), targetDate, endDate: endDate || null })
            });
            document.getElementById('replicateModal').classList.remove('active');
            await loadTasks();
        } catch (error) {
            alert('Failed to replicate task. Please try again.');
            console.error('Failed to replicate:', error);
        }
    });

    document.getElementById('cancelReplicate').addEventListener('click', () => {
        document.getElementById('replicateModal').classList.remove('active');
    });
};

// Habits
const loadHabits = async () => {
    try {
        const habits = await apiCall('/api/habits');
        displayHabits(habits);
    } catch (error) {
        console.error('Failed to load habits:', error);
    }
};

const displayHabits = async (habits) => {
    const container = document.getElementById('habitsContainer');
    if (habits.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">No habits yet. Create your first habit!</p>';
        return;
    }

    container.innerHTML = await Promise.all(habits.map(async (habit) => {
        const progress = await apiCall(`/api/habits/${habit.id}/progress`);
        const checkedDates = await apiCall(`/api/habits/${habit.id}/checks`).catch(() => []);
        const startDate = new Date(habit.start_date);
        const days = [];
        
        for (let i = 0; i < habit.duration; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isChecked = checkedDates.includes(dateStr);
            days.push({ date: dateStr, day: i + 1, checked: isChecked });
        }

        const checkedCount = checkedDates.length;
        const percentage = habit.duration > 0 ? Math.round((checkedCount / habit.duration) * 100) : 0;

        const daysHtml = days.map(d => `
            <div class="habit-day ${d.checked ? 'checked' : ''}" data-habit="${habit.id}" data-date="${d.date}" data-day="${d.day}" 
                 onclick="toggleHabitDay(${habit.id}, '${d.date}', ${d.day})" title="${d.date}">
                ${d.day}
            </div>
        `).join('');

        return `
            <div class="habit-card">
                <div class="habit-header">
                    <div class="habit-name">${escapeHtml(habit.name)}</div>
                    <div class="habit-progress">
                        <strong>${checkedCount}/${habit.duration} days</strong> (${percentage}%)
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="habit-days">${daysHtml}</div>
            </div>
        `;
    })).then(html => html.join(''));
};

const toggleHabitDay = async (habitId, date, dayNumber) => {
    const dayElement = document.querySelector(`[data-habit="${habitId}"][data-date="${date}"]`);
    const isChecked = dayElement.classList.contains('checked');
    const today = new Date();
    const target = new Date(date);
    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    if (target > today) {
        alert('You can only mark days up to today.');
        return;
    }

    // Enforce sequential completion: all previous days must be checked
    const allDays = Array.from(document.querySelectorAll(`.habit-day[data-habit="${habitId}"]`));
    const currentIndex = dayNumber - 1;
    const hasMissingPrevious = allDays
        .filter(el => parseInt(el.dataset.day, 10) < dayNumber)
        .some(el => !el.classList.contains('checked'));
    if (hasMissingPrevious) {
        alert('Please complete previous days first.');
        return;
    }
    
    try {
        await apiCall(`/api/habits/${habitId}/check`, {
            method: 'PUT',
            body: JSON.stringify({ date, checked: !isChecked })
        });
        dayElement.classList.toggle('checked');
        await loadHabits(); // Reload to update progress
    } catch (error) {
        console.error('Failed to toggle habit:', error);
    }
};

const initHabitForm = () => {
    document.getElementById('addHabitBtn').addEventListener('click', () => {
        document.getElementById('habitForm').reset();
        document.getElementById('habitStartDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('habitDuration').value = 21;
        document.getElementById('habitModal').classList.add('active');
    });

    document.getElementById('habitForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const habitData = {
            name: document.getElementById('habitName').value,
            start_date: document.getElementById('habitStartDate').value,
            duration: parseInt(document.getElementById('habitDuration').value)
        };

        try {
            await apiCall('/api/habits', {
                method: 'POST',
                body: JSON.stringify(habitData)
            });
            document.getElementById('habitModal').classList.remove('active');
            await loadHabits();
        } catch (error) {
            alert('Failed to create habit. Please try again.');
            console.error('Failed to create habit:', error);
        }
    });

    document.getElementById('cancelHabit').addEventListener('click', () => {
        document.getElementById('habitModal').classList.remove('active');
    });
};

// Meditation
let selectedTrack = null;
let meditationTimer = null;
let meditationTimeLeft = 0;
const meditationFallbacks = {
    'Nature Sounds': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0097e2d92d.mp3?filename=nature-sounds-ambient-110397.mp3',
    'Ocean Waves': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_7fb0832e8b.mp3?filename=ocean-waves-110398.mp3',
    'Forest Ambience': 'https://cdn.pixabay.com/download/audio/2021/11/16/audio_4ec8ba31a2.mp3?filename=forest-lullaby-110624.mp3',
    'Rain Sounds': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f33a7660e.mp3?filename=light-rain-ambient-110392.mp3',
    'Zen Garden': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_4cce9a603f.mp3?filename=relaxing-ambience-116199.mp3'
};

const loadMeditationTracks = async () => {
    try {
        const tracks = await apiCall('/api/meditation/tracks');
        const enriched = tracks.map(t => ({
            ...t,
            url: t.url?.startsWith('http') ? t.url : (meditationFallbacks[t.name] || t.url)
        }));
        displayTracks(enriched);
    } catch (error) {
        console.error('Failed to load tracks:', error);
    }
};

const displayTracks = (tracks) => {
    const container = document.getElementById('tracksList');
    container.innerHTML = tracks.map(track => `
        <div class="track-item ${selectedTrack?.id === track.id ? 'selected' : ''}" 
             onclick="selectTrack('${encodeURIComponent(JSON.stringify(track))}')" data-track-id="${track.id}">
            <div>
                <span>${escapeHtml(track.name)}</span>
                ${track.duration ? `<span style="font-size:0.85rem; color:var(--text-muted); margin-left:6px;">(${Math.round(track.duration/60)}m)</span>` : ''}
            </div>
            <div>
                ${track.favorite ? '⭐' : ''}
                <button class="btn btn-small" onclick="event.stopPropagation(); previewTrack('${encodeURIComponent(JSON.stringify(track))}')">Play</button>
            </div>
        </div>
    `).join('');
};

const selectTrack = (trackData) => {
    const parsed = JSON.parse(decodeURIComponent(trackData));
    selectedTrack = parsed;
    document.querySelectorAll('.track-item').forEach(item => {
        if (parseInt(item.dataset.trackId) === parsed.id) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
};

const previewTrack = (trackData) => {
    const parsed = JSON.parse(decodeURIComponent(trackData));
    const audio = document.getElementById('meditationAudio');
    if (parsed.url) {
        audio.src = parsed.url;
        audio.loop = false;
        audio.play().catch(() => {
            console.warn('Audio playback blocked; click Play again and ensure the tab is unmuted.');
        });
    } else {
        alert('No audio URL available for this track.');
    }
};

const initMeditation = () => {
    const durationSlider = document.getElementById('timerDuration');
    const durationDisplay = document.getElementById('selectedDuration');
    
    durationSlider.addEventListener('input', (e) => {
        const minutes = e.target.value;
        durationDisplay.textContent = `${minutes} min`;
    });

    document.getElementById('startMeditation').addEventListener('click', () => {
        const minutes = parseInt(durationSlider.value);
        startMeditationSession(minutes);
    });

    document.getElementById('stopMeditation').addEventListener('click', () => {
        stopMeditationSession();
    });
};

const startMeditationSession = (minutes) => {
    if (!selectedTrack) {
        alert('Please select a track first.');
        return;
    }
    meditationTimeLeft = minutes * 60;
    document.getElementById('startMeditation').style.display = 'none';
    document.getElementById('stopMeditation').style.display = 'inline-block';

    const audio = document.getElementById('meditationAudio');
    if (selectedTrack.url) {
        audio.src = selectedTrack.url;
        audio.loop = true;
        audio.play().catch(() => {
            console.warn('Audio playback blocked; interaction required.');
        });
    }
    
    meditationTimer = setInterval(() => {
        meditationTimeLeft--;
        updateMeditationDisplay();
        
        if (meditationTimeLeft <= 0) {
            stopMeditationSession();
            alert('Meditation session complete!');
        }
    }, 1000);
    
    updateMeditationDisplay();
};

const stopMeditationSession = () => {
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    const audio = document.getElementById('meditationAudio');
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('startMeditation').style.display = 'inline-block';
    document.getElementById('stopMeditation').style.display = 'none';
    meditationTimeLeft = 0;
    updateMeditationDisplay();
    
    // Save session
    if (selectedTrack) {
        apiCall('/api/meditation/sessions', {
            method: 'POST',
            body: JSON.stringify({
                track_id: selectedTrack.id,
                duration: meditationTimeLeft,
                completed: meditationTimeLeft === 0
            })
        }).catch(console.error);
    }
};

const updateMeditationDisplay = () => {
    const minutes = Math.floor(meditationTimeLeft / 60);
    const seconds = meditationTimeLeft % 60;
    document.getElementById('meditationTimer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Study Techniques
let studyTimer = null;
let studyTimeLeft = 0;
let isBreak = false;
let completedCycles = 0;
let selectedTechnique = null;

const studyTechniques = [
    {
        id: 'pomodoro',
        title: 'Pomodoro Technique',
        summary: '25 min focus + 5 min break, 4 rounds then long break',
        tags: ['Timer', 'Anti-procrastination'],
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 25 * 60, break: 5 * 60, cycles: 4, longBreak: 20 * 60 },
        why: ['Low starting resistance: “just 25 minutes”', 'Trains sustained attention', 'Prevents mental exhaustion'],
        how: ['Pick one task only', 'Work for 25 minutes, no multitasking', 'Stop immediately when timer ends'],
        best: ['Starting something difficult', 'Fighting procrastination', 'Daily routine study']
    },
    {
        id: 'extended-pomodoro',
        title: 'Extended Pomodoro',
        summary: '40–50 min focus + 10 min break',
        tags: ['Timer', 'Deep work'],
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 45 * 60, break: 10 * 60 },
        why: ['Longer uninterrupted focus', 'Fewer breaks → deeper immersion', 'Reduces context switching'],
        how: ['Focus 40–50 minutes straight', 'Short 10 minute reset', 'Repeat while energy is good'],
        best: ['Already have momentum', 'Deep thinking tasks', 'When 25 minutes feels short']
    },
    {
        id: 'time-boxing',
        title: 'Time Boxing',
        summary: 'Fixed time per task',
        tags: ['Timer', 'Planning'],
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 30 * 60 },
        why: ['Prevents perfectionism', 'Forces prioritization', 'Improves estimation'],
        how: ['Decide time before starting', 'Work only within that limit', 'Stop when time ends'],
        best: ['Too many tasks', 'Limited time windows', 'Overthinking details']
    },
    {
        id: 'flowtime',
        title: 'Flowtime Technique',
        summary: 'Follow your natural focus span',
        tags: ['Timer', 'Flexible'],
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 25 * 60, flexible: true },
        why: ['Respects your brain’s rhythm', 'Builds awareness of attention limits'],
        how: ['Start timer, stop when focus breaks', 'Log how long you stayed focused', 'Rest, then repeat'],
        best: ['Pomodoro feels restrictive', 'Creative/complex tasks', 'Training longer focus gradually']
    },
    {
        id: 'focus-90',
        title: '90-Minute Focus Cycle',
        summary: '90 min work + 20–30 min break',
        tags: ['Timer', 'Deep focus'],
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 90 * 60, break: 25 * 60 },
        why: ['Matches natural energy cycles', 'Enables deep thinking'],
        how: ['One long, uninterrupted block', 'Followed by proper recovery'],
        best: ['One important task', 'No interruptions', 'High energy levels'],
        note: 'Not ideal for beginners or distracting environments.'
    },
    {
        id: '52-17',
        title: '52–17 Rule',
        summary: '52 min focus + 17 min break',
        tags: ['Timer', 'Balance'],
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 52 * 60, break: 17 * 60 },
        why: ['Balanced focus and recovery', 'Avoids burnout', 'Steady productivity'],
        how: ['Focus for 52 minutes', 'Step away for 17 minutes', 'Repeat'],
        best: ['Long study days', 'Repetitive tasks', 'Maintaining consistency']
    },
    {
        id: 'countdown',
        title: 'Countdown Method',
        summary: 'Race against the clock',
        tags: ['Timer', 'Urgency'],
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 40 * 60 },
        why: ['Creates urgency', 'Reduces distraction'],
        how: ['Set a countdown (30–60 min)', 'Work until it hits zero'],
        best: ['Low motivation', 'Easy distraction']
    },
    {
        id: 'short-burst',
        title: 'Short-Burst (Sprint) Method',
        summary: '10–20 min bursts + short breaks',
        tags: ['Timer', 'Low energy'],
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=60',
        hasTimer: true,
        timer: { work: 15 * 60, break: 3 * 60 },
        why: ['Minimal mental resistance', 'Builds momentum', 'Great for tired days'],
        how: ['Work 10–15 min, break 2–5 min', 'Repeat to regain momentum'],
        best: ['Low energy', 'Burnout recovery', 'Restarting after a break']
    },
    // Techniques without timers
    {
        id: 'active-recall',
        title: 'Active Recall',
        summary: 'Answer from memory, not notes',
        tags: ['No timer', 'Memory'],
        hasTimer: false,
        why: ['Strengthens memory', 'Exposes weak areas'],
        how: ['Study once, close notes', 'Ask yourself questions', 'Answer without looking'],
        best: ['Concept learning', 'Exam prep']
    },
    {
        id: 'feynman',
        title: 'Feynman Technique',
        summary: 'Explain it simply to reveal gaps',
        tags: ['No timer', 'Clarity'],
        hasTimer: false,
        why: ['Forces clarity', 'Reveals confusion'],
        how: ['Explain out loud in simple words', 'Note where you get stuck', 'Fix gaps, simplify again'],
        best: ['Confusing concepts', 'Validate understanding']
    },
    {
        id: 'spaced-repetition',
        title: 'Spaced Repetition',
        summary: 'Review at increasing intervals',
        tags: ['No timer', 'Memory'],
        hasTimer: false,
        why: ['Moves info to long-term memory', 'Reduces forgetting'],
        how: ['Review after 1 day, 3–4 days, 1 week', 'Use flashcards or quick quizzes'],
        best: ['Facts, formulas, vocab']
    },
    {
        id: 'blurting',
        title: 'Blurting Method',
        summary: 'Write everything you recall',
        tags: ['No timer', 'Recall'],
        hasTimer: false,
        why: ['Combines recall + revision', 'Shows weak points fast'],
        how: ['Study, close notes, write all you know', 'Compare, fill gaps'],
        best: ['Revision', 'Self-testing']
    },
    {
        id: 'interleaving',
        title: 'Interleaving',
        summary: 'Mix related topics',
        tags: ['No timer', 'Problem solving'],
        hasTimer: false,
        why: ['Improves flexible thinking', 'Better problem-solving'],
        how: ['Mix topics instead of finishing one fully', 'Switch naturally while studying'],
        best: ['Multiple related subjects']
    },
    {
        id: 'retrieval',
        title: 'Retrieval Practice',
        summary: 'Test yourself regularly',
        tags: ['No timer', 'Practice'],
        hasTimer: false,
        why: ['Failure strengthens learning', 'Speeds up recall'],
        how: ['Practice questions', 'Flashcards', 'Explain answers from memory'],
        best: ['Exam prep', 'Concept-heavy subjects']
    },
    {
        id: 'cornell',
        title: 'Cornell Note-Taking',
        summary: 'Structured notes with prompts',
        tags: ['No timer', 'Notes'],
        hasTimer: false,
        why: ['Organizes information', 'Encourages active review'],
        how: ['Notes on right, questions on left', 'Summary at bottom', 'Review regularly'],
        best: ['Lectures', 'Reading-heavy study']
    },
    {
        id: 'elaboration',
        title: 'Elaboration Technique',
        summary: 'Ask “why” and “how” for everything',
        tags: ['No timer', 'Understanding'],
        hasTimer: false,
        why: ['Deepens understanding', 'Makes learning meaningful'],
        how: ['Connect to what you know', 'Create examples in your words'],
        best: ['New concepts', 'Avoiding rote memorization']
    },
    {
        id: 'teaching',
        title: 'Teaching Method',
        summary: 'Teach someone else',
        tags: ['No timer', 'Mastery'],
        hasTimer: false,
        why: ['Exposes gaps instantly', 'Builds confidence'],
        how: ['Explain aloud with simple language', 'Answer imaginary questions'],
        best: ['Before exams', 'Final revision']
    }
];

const renderStudyTechniqueCards = () => {
    const container = document.getElementById('studyTechniqueCards');
    container.innerHTML = studyTechniques.map(t => `
        <div class="technique-card" data-technique="${t.id}">
            <div class="tag">${t.hasTimer ? '⏱️ Timer' : '📘 Guide'}</div>
            <h4>${t.title}</h4>
            <p>${t.summary}</p>
        </div>
    `).join('');

    document.querySelectorAll('.technique-card').forEach(card => {
        card.addEventListener('click', () => selectStudyTechnique(card.dataset.technique));
    });
};

const selectStudyTechnique = (id) => {
    document.querySelectorAll('.technique-card').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`.technique-card[data-technique="${id}"]`);
    if (card) card.classList.add('selected');
    selectedTechnique = studyTechniques.find(t => t.id === id);
    renderTechniqueDetails();
    resetStudyTimer();
};

const renderTechniqueDetails = () => {
    const title = document.getElementById('techniqueTitle');
    const summary = document.getElementById('techniqueSummary');
    const tags = document.getElementById('techniqueTags');
    const why = document.getElementById('techniqueWhy');
    const how = document.getElementById('techniqueHow');
    const best = document.getElementById('techniqueBest');
    const image = document.getElementById('techniqueImage');
    const noTimer = document.getElementById('noTimerNote');
    const timerSection = document.getElementById('studyTimerSection');
    const timerNote = document.getElementById('timerNote');

    if (!selectedTechnique) {
        title.textContent = 'Pick a technique';
        summary.textContent = 'Choose a technique to see how it works.';
        tags.innerHTML = '';
        why.innerHTML = '';
        how.innerHTML = '';
        best.innerHTML = '';
        image.style.display = 'none';
        timerSection.style.display = 'none';
        noTimer.style.display = 'none';
        return;
    }

    title.textContent = selectedTechnique.title;
    summary.textContent = selectedTechnique.summary;
    tags.innerHTML = selectedTechnique.tags.map(t => `<span class="tag">${t}</span>`).join('');
    why.innerHTML = `<strong>Why it works</strong><ul>${selectedTechnique.why.map(w => `<li>${w}</li>`).join('')}</ul>`;
    how.innerHTML = `<strong>How to do it</strong><ul>${selectedTechnique.how.map(w => `<li>${w}</li>`).join('')}</ul>`;
    best.innerHTML = `<strong>Best used when</strong><ul>${selectedTechnique.best.map(w => `<li>${w}</li>`).join('')}</ul>`;
    if (selectedTechnique.note) {
        best.innerHTML += `<p style="color: var(--accent-warning); margin-top: 0.5rem;">${selectedTechnique.note}</p>`;
    }
    if (selectedTechnique.image) {
        image.src = selectedTechnique.image;
        image.style.display = 'block';
    } else {
        image.style.display = 'none';
    }

    if (selectedTechnique.hasTimer) {
        timerSection.style.display = 'block';
        noTimer.style.display = 'none';
        document.getElementById('startStudy').disabled = false;
        timerNote.textContent = selectedTechnique.timer.flexible
            ? 'Flowtime: start and pause based on your natural focus. Stop whenever focus drops.'
            : 'Start to begin the focus timer.';
    } else {
        timerSection.style.display = 'none';
        noTimer.style.display = 'block';
        document.getElementById('startStudy').disabled = true;
    }
};

const initStudyTimer = () => {
    renderStudyTechniqueCards();
    renderTechniqueDetails();

    document.getElementById('startStudy').addEventListener('click', () => {
        if (!selectedTechnique || !selectedTechnique.hasTimer) return;
        startStudySession();
    });
    document.getElementById('pauseStudy').addEventListener('click', () => pauseStudySession());
    document.getElementById('resetStudy').addEventListener('click', () => resetStudyTimer());
};

const startStudySession = () => {
    if (!selectedTechnique || !selectedTechnique.hasTimer || studyTimer) return;

    const config = selectedTechnique.timer;
    const isInterval = config.break || config.longBreak;

    if (config.flexible) {
        // Flowtime style: start counting up until pause/reset
        studyTimeLeft = config.work;
    } else {
        studyTimeLeft = isBreak ? (config.break || config.longBreak || config.work) : config.work;
    }

    document.getElementById('startStudy').style.display = 'none';
    document.getElementById('pauseStudy').style.display = 'inline-block';
    document.getElementById('timerStatus').textContent = isBreak ? 'Break Time' : 'Focus Time';

    studyTimer = setInterval(() => {
        studyTimeLeft--;
        updateStudyDisplay();

        if (studyTimeLeft <= 0) {
            if (!isInterval) {
                completeStudySession();
                resetStudyTimer();
                alert('Session complete!');
                return;
            }

            isBreak = !isBreak;
            if (isBreak) {
                alert('Break time!');
            } else {
                completedCycles += 1;
                alert('Back to work!');
                completeStudySession();
            }

            const useLongBreak = config.longBreak && config.cycles && (completedCycles % config.cycles === 0);
            studyTimeLeft = isBreak ? (useLongBreak ? config.longBreak : config.break) : config.work;
            updateStudyDisplay();
        }
    }, 1000);

    updateStudyDisplay();
};

const completeStudySession = () => {
    apiCall('/api/study/sessions', {
        method: 'POST',
        body: JSON.stringify({
            technique: selectedTechnique?.title || 'Unknown',
            duration: selectedTechnique?.timer?.work || 0,
            completed: true
        })
    }).then(() => loadStudySessions()).catch(console.error);
};

const pauseStudySession = () => {
    if (studyTimer) {
        clearInterval(studyTimer);
        studyTimer = null;
        document.getElementById('startStudy').style.display = 'inline-block';
        document.getElementById('pauseStudy').style.display = 'none';
        document.getElementById('timerStatus').textContent = 'Paused';
    }
};

const resetStudyTimer = () => {
    if (studyTimer) {
        clearInterval(studyTimer);
        studyTimer = null;
    }
    isBreak = false;
    completedCycles = 0;
    studyTimeLeft = selectedTechnique?.hasTimer ? (selectedTechnique.timer?.work || 0) : 0;
    document.getElementById('startStudy').style.display = selectedTechnique?.hasTimer ? 'inline-block' : 'inline-block';
    document.getElementById('pauseStudy').style.display = 'none';
    document.getElementById('timerStatus').textContent = 'Ready to start';
    updateStudyDisplay();
};

const updateStudyDisplay = () => {
    const safeTime = Number.isFinite(studyTimeLeft) ? Math.max(studyTimeLeft, 0) : 0;
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;
    document.getElementById('studyTimer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const loadStudySessions = async () => {
    try {
        const sessions = await apiCall('/api/study/sessions');
        displayStudySessions(sessions);
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
};

const displayStudySessions = (sessions) => {
    const container = document.getElementById('sessionHistory');
    if (sessions.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No sessions yet</p>';
        return;
    }
    
    container.innerHTML = sessions.slice(0, 10).map(session => `
        <div class="session-item">
            <div>
                <strong>${escapeHtml(session.technique)}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    ${Math.floor(session.duration / 60)} minutes - ${new Date(session.created_at).toLocaleDateString()}
                </div>
            </div>
            <div>${session.completed ? '✓' : '○'}</div>
        </div>
    `).join('');
};

// Stories
let showingFavorites = false;

const loadStories = async (search = '') => {
    try {
        if (showingFavorites) {
            const favorites = await apiCall('/api/stories/favorites');
            displayStories(favorites);
            return;
        }
        const url = search ? `/api/stories?search=${encodeURIComponent(search)}` : '/api/stories';
        const stories = await apiCall(url);
        displayStories(stories);
    } catch (error) {
        console.error('Failed to load stories:', error);
    }
};

const displayStories = (stories) => {
    const container = document.getElementById('storiesContainer');
    if (stories.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">No stories found</p>';
        return;
    }
    
    container.innerHTML = stories.map(story => `
        <div class="story-card" onclick="showStory(${story.id})">
            <div class="story-header">
                <div>
                    <div class="story-title">${escapeHtml(story.title)}</div>
                    <div class="story-person">${escapeHtml(story.person_name)}</div>
                </div>
                <button class="favorite-btn ${story.favorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${story.id})">
                    ${story.favorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="story-content">${escapeHtml(story.content)}</div>
        </div>
    `).join('');
};

const showStory = async (id) => {
    try {
        const story = await apiCall(`/api/stories/${id}`);
        document.getElementById('storyModalTitle').textContent = story.title;
        document.getElementById('storyModalPerson').textContent = `By ${story.person_name}`;
        document.getElementById('storyModalBody').textContent = story.content;
        document.getElementById('storyModal').classList.add('active');
    } catch (error) {
        console.error('Failed to load story:', error);
    }
};

const toggleFavorite = async (id) => {
    try {
        await apiCall(`/api/stories/${id}/favorite`, { method: 'POST' });
        await loadStories(document.getElementById('storySearch').value);
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
    }
};

const initStories = () => {
    document.getElementById('showFavorites').textContent = 'Show Favorites';

    document.getElementById('storySearch').addEventListener('input', (e) => {
        if (showingFavorites) {
            loadStories('');
            return;
        }
        loadStories(e.target.value);
    });

    document.getElementById('showFavorites').addEventListener('click', async () => {
        showingFavorites = !showingFavorites;
        document.getElementById('showFavorites').textContent = showingFavorites ? 'Show All' : 'Show Favorites';
        if (showingFavorites) {
            document.getElementById('storySearch').value = '';
            const favorites = await apiCall('/api/stories/favorites').catch(() => []);
            displayStories(favorites || []);
        } else {
            loadStories(document.getElementById('storySearch').value);
        }
    });

    document.getElementById('closeStoryModal').addEventListener('click', () => {
        document.getElementById('storyModal').classList.remove('active');
    });
};

// Utility
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initQuotes();
    initTaskForm();
    initFilter();
    initReplicate();
    initHabitForm();
    initMeditation();
    initStudyTimer();
    initStories();
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Set default page
    showPage('home');
    document.querySelector('[data-page="home"]').classList.add('active');
    
    // Online/offline handling
    window.addEventListener('online', () => {
        isOnline = true;
        syncTasksToServer().catch(console.error);
    });
    
    window.addEventListener('offline', () => {
        isOnline = false;
    });
});
