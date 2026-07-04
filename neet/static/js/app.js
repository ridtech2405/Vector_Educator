// app.js - State, Event Handlers and Mock Engine for NEET Edge Dashboard
// 1. App State & Local Storage
const DEFAULT_STATE = {
  activeTab: 'dashboard',
  streak: 12,
  userProfile: { name: 'Dinesh Kumar', targetHours: 4.5, currentProgress: 86 },
  planner: [
    { id: '1', title: 'Physics Electrostatics Problems', duration: '2h', status: 'done', priority: 'high', subject: 'Physics' },
    { id: '2', title: 'Organic Chemistry Alkyl Halides', duration: '1.5h', status: 'now', priority: 'medium', subject: 'Chemistry' },
    { id: '3', title: 'Biology Genetics Review', duration: '1h', status: 'next', priority: 'high', subject: 'Biology' },
    { id: '4', title: 'Mock Test Full Syllabus #3', duration: '3h', status: 'later', priority: 'high', subject: 'All' }
  ],
  notes: [
    { id: '1', title: 'Physics: Formula Sheet Mechanics', content: '1. Work = F.d.cos(theta)\n2. Kinetic Energy = 0.5 * m * v^2\n3. Angular Momentum L = r x p = I * omega\n4. Escape velocity = sqrt(2 * G * M / R)\nNCERT Highlights: Focus on rolling motion equations and moment of inertia of ring vs cylinder.', date: '2h ago' },
    { id: '2', title: 'Chemistry: SN1 vs SN2 Reactions', content: 'SN1: Two-step mechanism, carbocation intermediate, polar protic solvent, racemic mixture.\nSN2: One-step concerted process, pentavalent transition state, polar aprotic solvent, Walden inversion of configuration.', date: '1d ago' },
    { id: '3', title: 'Biology: Genetics High-Yield NCERT', content: 'Mendel\'s Laws:\n1. Law of Dominance\n2. Law of Segregation\n3. Law of Independent Assortment\nImportant Cross ratios:\n- Monohybrid Genotypic: 1:2:1\n- Dihybrid Phenotypic: 9:3:3:1\nPedigree Analysis tips: Dominant traits never skip generations.', date: '3d ago' }
  ],
  activities: [
    { id: 'a1', date: '29-06-2026', activity: 'Mock Test Biology Section', subject: 'Biology', status: 'Completed', score: '95%' },
    { id: 'a2', date: '28-06-2026', activity: 'Organic Chemistry Revision', subject: 'Chemistry', status: 'Completed', score: 'N/A' },
    { id: 'a3', date: '27-06-2026', activity: 'Electrostatics Practice Set', subject: 'Physics', status: 'Completed', score: '78%' }
  ],
  stats: {
    courses: 12,
    tests: 25,
    performance: '89%',
    rank: 145
  },
  settings: {
    notifications: true,
    darkMode: true
  }
};
let state = JSON.parse(localStorage.getItem('neet_edge_state')) || DEFAULT_STATE;
function saveState() {
  localStorage.setItem('neet_edge_state', JSON.stringify(state));
}
// 2. Mock Test Database
const MOCK_QUESTIONS = {
  physics: [
    { q: "A particle is moving in a circle of radius R with constant speed v. What is the magnitude of average acceleration during passage through a semi-circle?", options: ["a) Zero", "b) v²/R", "c) 2v²/πR", "d) v²/2πR"], correct: 2 },
    { q: "The dimensional formula of self-inductance is:", options: ["a) [M L² T⁻² A⁻²]", "b) [M L T⁻² A⁻²]", "c) [M L² T⁻¹ A⁻²]", "d) [M L² T⁻² A⁻¹]"], correct: 0 },
    { q: "In a photoelectric effect experiment, when the intensity of incident light is doubled, what happens to the maximum kinetic energy of emitted photoelectrons?", options: ["a) Doubled", "b) Halved", "c) Remains unchanged", "d) Quadrupled"], correct: 2 }
  ],
  chemistry: [
    { q: "Which of the following has the highest nucleophilicity in polar protic solvent?", options: ["a) F⁻", "b) Cl⁻", "c) Br⁻", "d) I⁻"], correct: 3 },
    { q: "The coordination number of cobalt in [Co(ethylenediamine)₂Cl₂]⁺ is:", options: ["a) 4", "b) 6", "c) 5", "d) 2"], correct: 1 },
    { q: "Which gas is released when copper reacts with dilute HNO₃?", options: ["a) NO", "b) NO₂", "c) N₂O", "d) NH₃"], correct: 0 }
  ],
  biology: [
    { q: "Which of the following plant hormones is responsible for apical dominance?", options: ["a) Auxin", "b) Gibberellin", "c) Cytokinin", "d) Ethylene"], correct: 0 },
    { q: "The process of translation refers to the synthesis of:", options: ["a) DNA from DNA", "b) RNA from DNA", "c) Protein from RNA", "d) RNA from RNA"], correct: 2 },
    { q: "Which layer of the microsporangium wall provides nourishment to the developing pollen grains?", options: ["a) Epidermis", "b) Endothecium", "c) Middle layers", "d) Tapetum"], correct: 3 }
  ]
};
// 3. Simulated AI Knowledge Base
const AI_KNOWLEDGE = [
  { keywords: ['photosynthesis', 'light reaction', 'dark reaction'], response: "Photosynthesis consists of Light Reactions (occurring in thylakoid membranes, producing ATP & NADPH via photophosphorylation) and Dark Reactions (Calvin Cycle, occurring in stroma, using ATP & NADPH to fix CO₂ into glucose via RuBisCO)." },
  { keywords: ['sn1', 'sn2', 'nucleophilic substitution'], response: "SN1 is unimolecular, prefers tertiary substrates, forms a carbocation, and leads to racemization. SN2 is bimolecular, prefers primary substrates, proceeds via a concerted transition state with inversion of configuration." },
  { keywords: ['ohms law', 'resistance', 'resistivity'], response: "Ohm's Law: V = IR. Resistance R = ρ(L/A). Resistivity (ρ) depends only on the nature of the material and temperature, whereas Resistance (R) depends on physical dimensions (length and cross-sectional area) as well." },
  { keywords: ['mitosis', 'meiosis', 'cell cycle'], response: "Mitosis produces 2 diploid genetically identical daughter cells. Meiosis produces 4 haploid genetically distinct daughter cells due to crossing over in Prophase I (specifically Pachytene stage)." }
];
// 4. Global Focus Timer Variables
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;
// 5. Active Test Variables
let currentTestSubject = '';
let currentQuestionIndex = 0;
let testAnswers = [];
let testQuestions = [];
// 6. Active Notes Editing
let activeNoteId = null;
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderDashboard();
  renderPlanner();
  renderNotes();
  renderActivities();
  setupTimerControls();
  
  // Show active view
  showView(state.activeTab || 'dashboard');
});
// Navigation Router
function showView(name) {
  state.activeTab = name;
  saveState();
  // Hide all view sections
  const viewSections = ['dashboardView', 'coursesView', 'testsView', 'notesView', 'rankView', 'aiView', 'plannerView', 'settingsView'];
  viewSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  // Show selected section
  const targetView = document.getElementById(`${name}View`);
  if (targetView) targetView.classList.remove('hidden');
  // Update Page Title in Topbar
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    const titles = {
      dashboard: 'Dashboard',
      courses: 'My Courses',
      tests: 'Mock Test Center',
      notes: 'Study Notes',
      rank: 'Rankings & Leaderboard',
      ai: 'AI Doubt Solver',
      planner: 'Study Planner',
      settings: 'Settings'
    };
    pageTitle.textContent = titles[name] || 'NEET Edge';
  }
  // Update nav buttons active status
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.classList.remove('active');
    // Check match
    if (btn.getAttribute('data-view') === name) {
      btn.classList.add('active');
    }
  });
  // Tab-specific loading
  if (name === 'dashboard') renderDashboard();
  if (name === 'planner') renderPlanner();
  if (name === 'notes') renderNotes();
}
// Render Sidebar
function renderSidebar() {
  const element = document.querySelector('.streak');
  if (element) {
    element.innerHTML = `<i class="fa-solid fa-fire"></i> ${state.streak}-day streak`;
  }
  const topStreak = document.getElementById('topStreak');
  if (topStreak) {
    topStreak.innerHTML = `<i class="fa-solid fa-fire"></i> ${state.streak}-day streak`;
  }
}
// Render Dashboard stats
function renderDashboard() {
  const cardsGrid = document.querySelector('.stats');
  if (!cardsGrid) return;
  
  // Update stats in state
  cardsGrid.innerHTML = `
    <div class="stat">
      <div class="icon"><i class="fa-solid fa-book"></i></div>
      <h3>${state.stats.courses}</h3>
      <p>Active Courses</p>
    </div>
    <div class="stat">
      <div class="icon"><i class="fa-solid fa-clipboard-question"></i></div>
      <h3>${state.stats.tests}</h3>
      <p>Mock Tests Done</p>
    </div>
    <div class="stat">
      <div class="icon"><i class="fa-solid fa-chart-line"></i></div>
      <h3>${state.stats.performance}</h3>
      <p>Avg Performance</p>
    </div>
    <div class="stat">
      <div class="icon"><i class="fa-solid fa-ranking-star"></i></div>
      <h3>${state.stats.rank}</h3>
      <p>Current Rank</p>
    </div>
  `;
  // Sync progress fill bar in Pomodoro card
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  if (progressText && progressFill) {
    progressText.textContent = `${state.userProfile.currentProgress}%`;
    progressFill.style.width = `${state.userProfile.currentProgress}%`;
  }
}
// Set Daily Goal action
function handleSetDailyGoal() {
  const goal = prompt("Enter your new daily focus hours target (e.g. 5.5):", state.userProfile.targetHours);
  if (goal && !isNaN(goal)) {
    state.userProfile.targetHours = parseFloat(goal);
    const targetTag = document.getElementById('targetHoursTag');
    if (targetTag) {
      targetTag.textContent = `Today target: ${state.userProfile.targetHours}h`;
    }
    saveState();
    alert(`Daily goal updated to ${state.userProfile.targetHours} hours!`);
  }
}
// Timer Controls
function setupTimerControls() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('timerStart');
  const pauseBtn = document.getElementById('timerPause');
  const resetBtn = document.getElementById('timerReset');
  if (!display) return;
  function updateDisplay() {
    const h = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    display.textContent = `${h}:${m}:${s}`;
  }
  startBtn.addEventListener('click', () => {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateDisplay();
      // Dynamically add a tiny amount of progress
      if (timerSeconds % 60 === 0 && state.userProfile.currentProgress < 100) {
        state.userProfile.currentProgress = Math.min(100, state.userProfile.currentProgress + 1);
        renderDashboard();
        saveState();
      }
    }, 1000);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    startBtn.textContent = 'Running';
    startBtn.style.opacity = '0.7';
  });
  pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Resume';
    startBtn.style.opacity = '1';
  });
  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerRunning = false;
    
    // Log activity if they focused for at least 10 seconds
    if (timerSeconds >= 10) {
      const minutesStr = (timerSeconds / 60).toFixed(1);
      addActivity(`Focus Session: Studied for ${minutesStr} min`, 'All', 'Completed', 'N/A');
    }
    timerSeconds = 0;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';
    startBtn.style.opacity = '1';
  });
  updateDisplay();
}
// 7. Planner CRUD
function renderPlanner() {
  const container = document.getElementById('plannerListContainer');
  if (!container) return;
  container.innerHTML = '';
  
  state.planner.forEach(task => {
    const item = document.createElement('div');
    item.className = 'item';
    
    let statusClass = 's-blue';
    if (task.status === 'done') statusClass = 's-good';
    else if (task.status === 'now') statusClass = 's-warn';
    else if (task.status === 'later') statusClass = 's-purple';
    item.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <span>${task.duration} • ${task.subject} • Priority: ${task.priority}</span>
      </div>
      <div class="note-actions">
        <button class="status ${statusClass}" onclick="toggleTaskStatus('${task.id}')" style="cursor:pointer; border:none;">
          ${task.status.toUpperCase()}
        </button>
        <button class="btn btn-ghost" onclick="deleteTask('${task.id}')" style="padding:6px 10px; border-radius:8px;">
          <i class="fa-solid fa-trash" style="color:var(--error);"></i>
        </button>
      </div>
    `;
    container.appendChild(item);
  });
}
function handleAddTask(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const duration = document.getElementById('taskDuration').value;
  const subject = document.getElementById('taskSubject').value;
  const priority = document.getElementById('taskPriority').value;
  if (!title || !duration) return;
  const newTask = {
    id: Date.now().toString(),
    title,
    duration,
    status: 'next',
    priority,
    subject
  };
  state.planner.push(newTask);
  saveState();
  renderPlanner();
  // Reset inputs
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDuration').value = '';
}
function toggleTaskStatus(id) {
  const task = state.planner.find(t => t.id === id);
  if (task) {
    const statuses = ['next', 'now', 'done', 'later'];
    const currIndex = statuses.indexOf(task.status);
    task.status = statuses[(currIndex + 1) % statuses.length];
    
    if (task.status === 'done') {
      addActivity(`Task Completed: ${task.title}`, task.subject, 'Completed', 'N/A');
    }
    
    saveState();
    renderPlanner();
  }
}
function deleteTask(id) {
  state.planner = state.planner.filter(t => t.id !== id);
  saveState();
  renderPlanner();
}
// 8. Notes CRUD
function renderNotes() {
  const container = document.getElementById('notesListContainer');
  if (!container) return;
  container.innerHTML = '';
  state.notes.forEach(note => {
    const el = document.createElement('div');
    el.className = `note-item ${activeNoteId === note.id ? 'active' : ''}`;
    el.onclick = () => selectNote(note.id);
    el.innerHTML = `
      <div>
        <strong style="color:#fff;">${note.title}</strong>
        <span style="font-size:11px; color:var(--text-muted);">${note.date}</span>
      </div>
      <button class="btn btn-ghost" onclick="event.stopPropagation(); deleteNote('${note.id}')" style="padding:6px; border-radius:6px; border:none; background:transparent;">
        <i class="fa-solid fa-trash" style="color:var(--error);"></i>
      </button>
    `;
    container.appendChild(el);
  });
}
function selectNote(id) {
  activeNoteId = id;
  const note = state.notes.find(n => n.id === id);
  if (note) {
    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteContentTextarea').value = note.content;
  }
  renderNotes();
}
function handleCreateNewNote() {
  const newNote = {
    id: Date.now().toString(),
    title: 'New Study Note',
    content: '',
    date: 'Just now'
  };
  state.notes.unshift(newNote);
  activeNoteId = newNote.id;
  saveState();
  renderNotes();
  selectNote(newNote.id);
}
function handleSaveNote() {
  if (!activeNoteId) {
    alert("Please select or create a note first.");
    return;
  }
  const title = document.getElementById('noteTitleInput').value;
  const content = document.getElementById('noteContentTextarea').value;
  const note = state.notes.find(n => n.id === activeNoteId);
  if (note) {
    note.title = title || 'Untitled Note';
    note.content = content;
    note.date = 'Just now';
    saveState();
    renderNotes();
    alert("Note saved successfully!");
  }
}
function deleteNote(id) {
  state.notes = state.notes.filter(n => n.id !== id);
  if (activeNoteId === id) {
    activeNoteId = null;
    document.getElementById('noteTitleInput').value = '';
    document.getElementById('noteContentTextarea').value = '';
  }
  saveState();
  renderNotes();
}
// 9. Interactive Mock Test Engine
function startMockTest(subject) {
  currentTestSubject = subject;
  testQuestions = MOCK_QUESTIONS[subject];
  currentQuestionIndex = 0;
  testAnswers = new Array(testQuestions.length).fill(null);
  // Toggle View inside the Mock Test section
  document.getElementById('testSelectionCard').classList.add('hidden');
  document.getElementById('testPlayerCard').classList.remove('hidden');
  document.getElementById('testScoreReportCard').classList.add('hidden');
  renderMockQuestion();
}
function renderMockQuestion() {
  const qObj = testQuestions[currentQuestionIndex];
  document.getElementById('testSubjectTitle').textContent = `${currentTestSubject.toUpperCase()} PRACTICE DRILL`;
  document.getElementById('testProgressLabel').textContent = `Question ${currentQuestionIndex + 1} of ${testQuestions.length}`;
  
  const box = document.getElementById('testQuestionContainer');
  box.innerHTML = `
    <div class="question-text">${qObj.q}</div>
    <div class="options-list">
      ${qObj.options.map((opt, idx) => `
        <button class="option-btn ${testAnswers[currentQuestionIndex] === idx ? 'selected' : ''}" onclick="selectMockAnswer(${idx})">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
  // Update controls
  document.getElementById('prevQuestionBtn').disabled = currentQuestionIndex === 0;
  
  const nextBtn = document.getElementById('nextQuestionBtn');
  if (currentQuestionIndex === testQuestions.length - 1) {
    nextBtn.textContent = 'Submit Test';
    nextBtn.onclick = submitMockTest;
  } else {
    nextBtn.textContent = 'Next Question';
    nextBtn.onclick = nextMockQuestion;
  }
}
function selectMockAnswer(optionIdx) {
  testAnswers[currentQuestionIndex] = optionIdx;
  renderMockQuestion();
}
function nextMockQuestion() {
  if (currentQuestionIndex < testQuestions.length - 1) {
    currentQuestionIndex++;
    renderMockQuestion();
  }
}
function prevMockQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderMockQuestion();
  }
}
function submitMockTest() {
  let score = 0;
  testQuestions.forEach((qObj, idx) => {
    if (testAnswers[idx] === qObj.correct) {
      score++;
    }
  });
  const percentage = Math.round((score / testQuestions.length) * 100);
  
  // Show report card
  document.getElementById('testPlayerCard').classList.add('hidden');
  document.getElementById('testScoreReportCard').classList.remove('hidden');
  
  document.getElementById('scoreResultText').textContent = `${score} / ${testQuestions.length} Correct (${percentage}%)`;
  // Log activity
  addActivity(`${currentTestSubject.toUpperCase()} Practice Drill`, currentTestSubject, 'Completed', `${percentage}%`);
  
  // Update dashboard stats
  state.stats.tests += 1;
  state.stats.performance = `${Math.round((parseInt(state.stats.performance) + percentage) / 2)}%`;
  
  // Rank simulation: complete a test, improve rank by 1-5 places!
  const rankImprovement = Math.max(1, Math.floor(Math.random() * 5));
  state.stats.rank = Math.max(1, state.stats.rank - rankImprovement);
  saveState();
  renderDashboard();
}
function exitMockTest() {
  document.getElementById('testSelectionCard').classList.remove('hidden');
  document.getElementById('testPlayerCard').classList.add('hidden');
  document.getElementById('testScoreReportCard').classList.add('hidden');
}
// 10. AI Doubt Solver chatbot simulation
function handleSendAiMessage() {
  const input = document.getElementById('aiQueryInput');
  const query = input.value.trim();
  if (!query) return;
  appendChatMessage('User', query, 'user');
  input.value = '';
  // Processing simulated reply
  setTimeout(() => {
    let reply = "I couldn't find a direct match in my local NCERT database. Try asking about 'photosynthesis', 'mitosis', 'SN1', 'SN2', or 'resistance' to see high-yield NEET explanations!";
    
    const lowercaseQuery = query.toLowerCase();
    for (const entry of AI_KNOWLEDGE) {
      if (entry.keywords.some(kw => lowercaseQuery.includes(kw))) {
        reply = entry.response;
        break;
      }
    }
    appendChatMessage('NEET Edge AI', reply, 'bot');
  }, 800);
}
function appendChatMessage(sender, text, type) {
  const container = document.getElementById('aiChatContainer');
  if (!container) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.innerHTML = `
    <span class="sender">${sender}</span>
    <div>${text}</div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}
// 11. Activities Logs
function renderActivities() {
  const tbody = document.getElementById('activitiesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  state.activities.forEach(act => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${act.date}</td>
      <td>${act.activity}</td>
      <td>${act.subject}</td>
      <td><span class="status s-good">${act.status}</span></td>
      <td>${act.score !== 'N/A' ? `<span class="status s-blue">${act.score}</span>` : '<span style="color:var(--text-muted)">-</span>'}</td>
    `;
    tbody.appendChild(tr);
  });
}
function addActivity(name, subject, status, score) {
  const date = new Date();
  const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  
  const act = {
    id: Date.now().toString(),
    date: dateStr,
    activity: name,
    subject,
    status,
    score
  };
  state.activities.unshift(act);
  // Keep last 6 logs
  if (state.activities.length > 6) {
    state.activities.pop();
  }
  saveState();
  renderActivities();
}
// Simulated Settings toggles
function toggleSetting(key) {
  state.settings[key] = !state.settings[key];
  saveState();
  alert(`${key.toUpperCase()} setting toggled to: ${state.settings[key]}`);
}
function handleProgressSimulate() {
  state.userProfile.currentProgress = Math.min(100, state.userProfile.currentProgress + 2);
  saveState();
  renderDashboard();
}
