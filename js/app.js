/**
 * Student ERP: Placement & Peer Skill-Sharing Platform
 * Main Controller Script
 */

let activeView = 'home';
let activePlacementType = 'Summer Internship';
let activePlacementDomain = 'All';
let activeSkillCategory = 'KEY SKILLS'; // KEY SKILLS, Marketing, Finance, Operations, IT, HR
let activeRequestsTab = 'received';
let currentActiveSkillId = null;
let currentActiveRequestId = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  window.erpStore.subscribe(() => {
    updateUI();
  });

  // Always bypass login and show main app
  showMainApp();

  setupEventListeners();
}

function setupEventListeners() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      
      const res = window.erpStore.login(username, password);
      if (res.success) {
        showToast(`Welcome, ${res.user.name}!`, 'success');
        showMainApp();
      } else {
        showToast('Invalid username or password', 'error');
      }
    });
  }
}

// --- AUTHENTICATION & LOGIN PAGE LOGIC ---

function togglePasswordVisibility() {
  const passInput = document.getElementById('login-password');
  const btn = document.getElementById('toggle-pwd-btn');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    passInput.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
}

function handlePublicSearch(query) {
  const dropdown = document.getElementById('public-search-dropdown');
  if (!dropdown) return;

  const q = query.trim().toLowerCase();
  if (!q) {
    dropdown.classList.add('hidden');
    return;
  }

  const companies = window.erpStore.getCompanies(null, null, q).slice(0, 3);
  const skills = window.erpStore.getSkills(null, null, q).slice(0, 3);

  if (companies.length === 0 && skills.length === 0) {
    dropdown.innerHTML = `<div style="padding: 0.6rem; font-size: 0.8rem; color: #94a3b8; text-align: center;">No campus records found matching "${query}"</div>`;
    dropdown.classList.remove('hidden');
    return;
  }

  let html = '';
  if (companies.length > 0) {
    html += `<div style="font-size: 0.7rem; font-weight: 700; color: #60a5fa; padding: 0.3rem 0.6rem; text-transform: uppercase;">Recruiting Companies:</div>`;
    companies.forEach(c => {
      html += `
        <div class="public-search-item" onclick="alert('Please login to view full recruitment analytics for ${c.name}')">
          🏢 <strong>${c.name}</strong> (${c.domain}) • Avg: ${c.averageSalary}
        </div>
      `;
    });
  }

  if (skills.length > 0) {
    html += `<div style="font-size: 0.7rem; font-weight: 700; color: #34d399; padding: 0.3rem 0.6rem; text-transform: uppercase; margin-top: 0.4rem;">Domain Skills:</div>`;
    skills.forEach(s => {
      html += `
        <div class="public-search-item" onclick="alert('Please login to request peer mentorship for ${s.name}')">
          💡 <strong>${s.name}</strong> (${s.domain}) • ${s.teachersCount} Mentors Available
        </div>
      `;
    });
  }

  dropdown.innerHTML = html;
  dropdown.classList.remove('hidden');
}

// --- GLOBAL HEADER SEARCH FOR AUTHENTICATED USERS ---

function handleGlobalHeaderSearch(query) {
  const dropdown = document.getElementById('global-search-results-dropdown');
  if (!dropdown) return;

  const q = query.trim().toLowerCase();
  if (!q) {
    dropdown.classList.add('hidden');
    return;
  }

  const companies = window.erpStore.getCompanies(null, null, q).slice(0, 3);
  const skills = window.erpStore.getSkills(null, null, q).slice(0, 3);
  const users = window.erpStore.getUsers().filter(u => 
    u.name.toLowerCase().includes(q) || 
    u.domain.toLowerCase().includes(q) ||
    u.teachSkills.some(s => s.toLowerCase().includes(q))
  ).slice(0, 3);

  if (companies.length === 0 && skills.length === 0 && users.length === 0) {
    dropdown.innerHTML = `<div style="padding: 0.75rem; font-size: 0.8rem; color: #64748b; text-align: center;">No matching ERP records for "${query}"</div>`;
    dropdown.classList.remove('hidden');
    return;
  }

  let html = '';
  if (companies.length > 0) {
    html += `<div style="font-size: 0.7rem; font-weight: 700; color: #1e40af; padding: 0.4rem 0.75rem; background: #f1f5f9; text-transform: uppercase;">Companies:</div>`;
    companies.forEach(c => {
      html += `
        <div class="public-search-item" style="color: #0f172a;" onclick="selectGlobalSearchResult('company', '${c.id}')">
          🏢 <strong>${c.name}</strong> • ${c.domain} (${c.placementType})
        </div>
      `;
    });
  }

  if (skills.length > 0) {
    html += `<div style="font-size: 0.7rem; font-weight: 700; color: #065f46; padding: 0.4rem 0.75rem; background: #f1f5f9; text-transform: uppercase;">Skills:</div>`;
    skills.forEach(s => {
      html += `
        <div class="public-search-item" style="color: #0f172a;" onclick="selectGlobalSearchResult('skill', '${s.id}')">
          💡 <strong>${s.name}</strong> • ${s.domain} (${s.difficulty})
        </div>
      `;
    });
  }

  if (users.length > 0) {
    html += `<div style="font-size: 0.7rem; font-weight: 700; color: #92400e; padding: 0.4rem 0.75rem; background: #f1f5f9; text-transform: uppercase;">Peer Mentors:</div>`;
    users.forEach(u => {
      html += `
        <div class="public-search-item" style="color: #0f172a;" onclick="selectGlobalSearchResult('mentor', '${u.id}')">
          👤 <strong>${u.name}</strong> • ${u.domain} (${u.programme})
        </div>
      `;
    });
  }

  dropdown.innerHTML = html;
  dropdown.classList.remove('hidden');
}

function selectGlobalSearchResult(type, id) {
  const dropdown = document.getElementById('global-search-results-dropdown');
  const input = document.getElementById('global-header-search');
  if (dropdown) dropdown.classList.add('hidden');
  if (input) input.value = '';

  if (type === 'company') {
    switchView('placement');
    showCompanyDetail(id);
  } else if (type === 'skill') {
    const skill = window.erpStore.getSkillById(id);
    if (skill) {
      handleSkillClickByName(skill.name);
    }
  } else if (type === 'mentor') {
    switchView('requests');
  }
}

function handleLogout() {
  window.erpStore.logout();
  showToast('Profile reset to default student!', 'success');
  switchView('home');
}

function showLoginView() {
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('app-view').classList.add('hidden');
}

function showMainApp() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('app-view').classList.remove('hidden');
  switchView('home');
}

function resetDataToDefaults() {
  window.erpStore.resetToDefaults();
  showToast('Demo data reset to default state!', 'success');
  updateUI();
}

// --- NAVIGATION & VIEW ROUTING ---

function switchView(viewName) {
  activeView = viewName;

  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }

  const titles = {
    home: 'Student Dashboard',
    placement: 'Placement Portal',
    skills: 'Skill Repository & Peer Learning Hub',
    requests: 'Skill Peer Requests',
    profile: 'Student Profile Management'
  };
  document.getElementById('header-page-title').textContent = titles[viewName] || 'Dashboard';

  updateUI();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateUI() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  // Update Sidebar user info
  document.getElementById('sidebar-user-avatar').src = user.avatar;
  document.getElementById('sidebar-user-name').textContent = user.name;
  document.getElementById('sidebar-user-domain').textContent = `${user.domain} • ${user.programme}`;

  updateNotificationsUI();

  if (activeView === 'home') renderHomeDashboard();
  else if (activeView === 'placement') renderPlacementModule();
  else if (activeView === 'skills') renderSkillsModule();
  else if (activeView === 'requests') renderRequestsModule();
  else if (activeView === 'profile') renderProfileModule();
}

// --- 1. HOME / DASHBOARD RENDERER ---

function renderHomeDashboard() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  document.getElementById('welcome-heading').textContent = `Good day, ${user.name}!`;

  const sentRequests = window.erpStore.getRequestsSent();
  const receivedRequests = window.erpStore.getRequestsReceived();
  const sessions = window.erpStore.getUpcomingSessions();

  document.getElementById('kpi-sent-count').textContent = sentRequests.length;
  document.getElementById('kpi-received-count').textContent = receivedRequests.length;
  document.getElementById('kpi-sessions-count').textContent = sessions.length;

  const companies = window.erpStore.getCompanies(null, null).slice(0, 3);
  const placementContainer = document.getElementById('dash-placement-list');
  if (placementContainer) {
    placementContainer.innerHTML = companies.map(c => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div class="company-logo" style="width: 32px; height: 32px; font-size: 0.7rem;">${c.logo}</div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 700;">${c.name}</div>
            <div style="font-size: 0.7rem; color: #64748b;">${c.domain} • ${c.placementType}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #10b981;">${c.averageSalary}</div>
          <span class="badge badge-blue" style="font-size: 0.65rem;">${c.status}</span>
        </div>
      </div>
    `).join('');
  }

  const teachContainer = document.getElementById('dash-teach-tags');
  if (teachContainer) {
    teachContainer.innerHTML = user.teachSkills.map(s => `<span class="tag" style="background: #d1fae5; color: #065f46; font-weight: 600;">✓ ${s}</span>`).join('');
  }

  const sessionsContainer = document.getElementById('dash-upcoming-sessions');
  if (sessionsContainer) {
    if (sessions.length === 0) {
      sessionsContainer.innerHTML = `
        <div style="font-size: 0.8rem; color: #64748b; font-style: italic; background: #f8fafc; padding: 0.75rem; border-radius: var(--radius-sm);">
          No upcoming peer learning sessions scheduled yet. Accept a request or coordinate via chat to schedule one!
        </div>
      `;
    } else {
      sessionsContainer.innerHTML = sessions.map(s => {
        const isTeacher = s.teacherId === user.id;
        return `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.75rem; border-radius: var(--radius-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <span style="font-size: 0.85rem; font-weight: 700; color: #166534;">${s.skillName} (${s.domain})</span>
              <span class="badge badge-green">${s.date} @ ${s.time}</span>
            </div>
            <div style="font-size: 0.775rem; color: #15803d;">
              📍 <strong>Venue:</strong> ${s.venue} • 👤 <strong>${isTeacher ? 'Student Mentored' : 'Peer Mentor'}:</strong> ${isTeacher ? s.requesterName : s.teacherName}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const timeline = window.erpStore.getRecentActivityTimeline();
  const timelineContainer = document.getElementById('dash-activity-timeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = timeline.map(item => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-detail">${item.detail}</div>
        </div>
      </div>
    `).join('');
  }
}

// --- 2. PLACEMENT MODULE RENDERER ---

function selectPlacementType(type) {
  activePlacementType = type;
  document.getElementById('type-card-internship').classList.toggle('active', type === 'Summer Internship');
  document.getElementById('type-card-final').classList.toggle('active', type === 'Final Placement');
  renderPlacementCompanies();
}

function filterPlacementDomain(domain) {
  activePlacementDomain = domain;
  document.querySelectorAll('.domain-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-domain') === domain);
  });
  renderPlacementCompanies();
}

function renderPlacementModule() {
  renderPlacementCompanies();
}

function renderPlacementCompanies() {
  const searchQuery = document.getElementById('placement-search-input')?.value || '';
  const companies = window.erpStore.getCompanies(activePlacementDomain, activePlacementType, searchQuery);
  
  const grid = document.getElementById('placement-companies-grid');
  document.getElementById('company-detail-panel').classList.add('hidden');
  grid.classList.remove('hidden');

  if (companies.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <p style="font-size: 1rem; color: #64748b;">No companies found matching your filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = companies.map(c => `
    <div class="card company-card card-hover" onclick="showCompanyDetail('${c.id}')">
      <div>
        <div class="company-header">
          <div class="company-logo">${c.logo}</div>
          <div class="company-title-box">
            <h3>${c.name}</h3>
            <span class="badge badge-indigo" style="font-size: 0.65rem; margin-top: 0.2rem;">${c.domain}</span>
          </div>
        </div>

        <div class="company-meta-row">
          <span class="company-meta-label">Average Package / Stipend</span>
          <span class="company-meta-val" style="color: #10b981;">${c.averageSalary}</span>
        </div>

        <div class="company-meta-row">
          <span class="company-meta-label">Selected Previously</span>
          <span class="company-meta-val">${c.selectedCount} Students</span>
        </div>

        <div class="company-meta-row">
          <span class="company-meta-label">Drive Status</span>
          <span class="badge badge-blue">${c.status}</span>
        </div>

        <div style="margin-top: 0.75rem;">
          <div style="font-size: 0.725rem; font-weight: 700; color: #64748b; margin-bottom: 0.25rem;">Required Skills:</div>
          <div class="tag-cloud">
            ${c.skillsRequired.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
      </div>

      <button class="btn btn-outline w-full btn-sm" style="margin-top: 1rem;">
        View Company Overview & Interview Questions →
      </button>
    </div>
  `).join('');
}

function showCompanyDetail(companyId) {
  const company = window.erpStore.getCompanyById(companyId);
  if (!company) return;

  const grid = document.getElementById('placement-companies-grid');
  const panel = document.getElementById('company-detail-panel');
  grid.classList.add('hidden');
  panel.classList.remove('hidden');

  panel.innerHTML = `
    <div class="card" style="margin-bottom: 1rem;">
      <button class="btn btn-secondary btn-sm" onclick="renderPlacementCompanies()" style="margin-bottom: 1rem;">
        ← Back to Companies List
      </button>

      <div class="company-detail-header" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.5rem;">
        <div class="company-logo" style="width: 64px; height: 64px; font-size: 1.2rem;">${company.logo}</div>
        <div style="flex: 1;">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <h1 style="font-size: 1.5rem; font-weight: 800;">${company.name}</h1>
            <span class="badge badge-indigo">${company.domain}</span>
            <span class="badge badge-blue">${company.placementType}</span>
          </div>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">Industry: ${company.industry} • Stage: ${company.hiringStage}</p>
          
          <div style="display: flex; gap: 2rem; margin-top: 1rem;">
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Average Package</div>
              <div style="font-size: 1.2rem; font-weight: 800; color: #10b981;">${company.averageSalary}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Alumni Selected</div>
              <div style="font-size: 1.2rem; font-weight: 800; color: #1e40af;">${company.selectedCount} Students</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROLES OFFERED -->
      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Roles Offered</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${company.roles.map(r => `<span class="badge badge-indigo" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">💼 ${r}</span>`).join('')}
        </div>
      </div>

      <!-- SKILLS REQUIRED -->
      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Skills Required by ${company.name}</h3>
        <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">Click any skill to view peer mentors or request a learning session:</p>
        <div class="tag-cloud">
          ${company.skillsRequired.map(s => `<span class="tag" style="font-size: 0.85rem; padding: 0.35rem 0.75rem; cursor: pointer; background: #e0e7ff; color: #3730a3;" onclick="handleSkillClickByName('${s}')">💡 ${s} →</span>`).join('')}
        </div>
      </div>

      <!-- INTERVIEW QUESTIONS PREVIOUSLY ASKED -->
      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.85rem;">Questions Asked Previously in Campus Drives</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #1e40af; margin-bottom: 0.35rem;">HR & Personal Questions</div>
            ${company.interviewQuestions.hr.map(q => `<div class="question-card">" ${q} "</div>`).join('')}
          </div>

          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #065f46; margin-bottom: 0.35rem;">Technical & Domain Questions</div>
            ${company.interviewQuestions.technical.map(q => `<div class="question-card">" ${q} "</div>`).join('')}
          </div>

          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #92400e; margin-bottom: 0.35rem;">Case Questions & Market Estimates</div>
            ${company.interviewQuestions.case.map(q => `<div class="question-card">" ${q} "</div>`).join('')}
          </div>

          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #3730a3; margin-bottom: 0.35rem;">Group Discussion (GD) Topics</div>
            ${company.interviewQuestions.gd.map(q => `<div class="question-card">" ${q} "</div>`).join('')}
          </div>
        </div>
      </div>

      <!-- SELECTION PROCESS -->
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Selection Process & Hiring Rounds</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${company.selectionProcess.map((step, idx) => `
            <div style="display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid #e2e8f0;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">${idx + 1}</div>
              <div style="font-size: 0.875rem; font-weight: 600;">${step}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function handleSkillClickByName(skillName) {
  switchView('skills');
  const searchInput = document.getElementById('skills-search-input');
  if (searchInput) {
    searchInput.value = skillName;
    renderSkillsModule();
  }
}

// --- 3. SKILLS MODULE RENDERER (CATEGORY BOXES ENGINE) ---

function selectSkillCategory(category) {
  activeSkillCategory = category;

  const categoryMap = {
    'KEY SKILLS': 'sbox-key',
    'Marketing': 'sbox-mkt',
    'Finance': 'sbox-fin',
    'Operations': 'sbox-ops',
    'IT': 'sbox-it',
    'HR': 'sbox-hr'
  };

  Object.keys(categoryMap).forEach(cat => {
    const el = document.getElementById(categoryMap[cat]);
    if (el) {
      el.classList.toggle('active', cat === category);
    }
  });

  const headerTitle = document.getElementById('skill-category-header-title');
  if (headerTitle) {
    headerTitle.textContent = category === 'KEY SKILLS' ? 'KEY CROSS-DOMAIN SKILLS' : `${category.toUpperCase()} DOMAIN SKILLS`;
  }

  renderSkillsModule();
}

function renderSkillsModule() {
  const searchQuery = document.getElementById('skills-search-input')?.value || '';
  
  let skills = [];
  if (activeSkillCategory === 'KEY SKILLS') {
    skills = window.erpStore.getSkills(null, 'key', searchQuery);
  } else {
    skills = window.erpStore.getSkills(activeSkillCategory, null, searchQuery);
  }

  const grid = document.getElementById('active-skills-grid');
  if (grid) {
    if (skills.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <p style="font-size: 1rem; color: #64748b;">No skills found for "${activeSkillCategory}" matching your search.</p>
        </div>
      `;
      return;
    }
    grid.innerHTML = skills.map(s => renderSkillCardHTML(s)).join('');
  }
}

function renderSkillCardHTML(skill) {
  return `
    <div class="card skill-card card-hover">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h4 class="skill-name">${skill.name}</h4>
          <span class="badge badge-indigo" style="font-size: 0.65rem;">${skill.domain}</span>
        </div>
        <p class="skill-desc">${skill.description}</p>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; margin-top: 0.75rem; margin-bottom: 0.75rem;">
          <span>Difficulty: <strong>${skill.difficulty}</strong></span>
          <span>👥 ${skill.teachersCount} Peer Mentors</span>
        </div>

        <button class="btn btn-primary w-full btn-sm" onclick="openRequestLearnModal('${skill.id}')">
          REQUEST TO LEARN →
        </button>
      </div>
    </div>
  `;
}

function openRequestLearnModal(skillId) {
  currentActiveSkillId = skillId;
  const skill = window.erpStore.getSkillById(skillId);
  if (!skill) return;

  document.getElementById('modal-req-skill-name').textContent = skill.name;
  document.getElementById('modal-req-skill-meta').textContent = `Domain: ${skill.domain} • Difficulty: ${skill.difficulty}`;
  document.getElementById('modal-req-domain-highlight').textContent = skill.domain;
  document.getElementById('modal-req-note').value = '';

  openModal('modal-request-learn');
}

function submitSkillRequest() {
  if (!currentActiveSkillId) return;

  const note = document.getElementById('modal-req-note').value;
  const res = window.erpStore.createSkillRequest(currentActiveSkillId, note);

  if (res.success) {
    showToast(`Skill request sent! Notified ${res.notifiedCount} peers in ${res.request.domain}.`, 'success');
    closeModal('modal-request-learn');
    switchView('requests');
    switchRequestsTab('sent');
  } else {
    showToast(res.message, 'error');
  }
}

// --- 4. REQUESTS MODULE RENDERER (RECEIVED & SENT) ---

function switchRequestsTab(tab) {
  activeRequestsTab = tab;
  document.getElementById('tab-received-btn').classList.toggle('active', tab === 'received');
  document.getElementById('tab-sent-btn').classList.toggle('active', tab === 'sent');
  
  document.getElementById('requests-received-panel').classList.toggle('hidden', tab !== 'received');
  document.getElementById('requests-sent-panel').classList.toggle('hidden', tab !== 'sent');
  
  renderRequestsModule();
}

function renderRequestsModule() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  const received = window.erpStore.getRequestsReceived();
  const sent = window.erpStore.getRequestsSent();

  document.getElementById('tab-received-count-badge').textContent = received.length;
  document.getElementById('tab-sent-count-badge').textContent = sent.length;

  if (activeRequestsTab === 'received') {
    const grid = document.getElementById('requests-received-grid');
    if (received.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <p style="font-size: 1rem; color: #64748b;">No incoming skill requests in your domain (${user.domain}) right now.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = received.map(req => {
      const isAcceptedByMe = req.status === 'ACCEPTED' && req.acceptedBy === user.id;
      const isAcceptedByOther = req.status === 'ACCEPTED' && req.acceptedBy !== user.id;

      return `
        <div class="card request-card">
          <div>
            <div class="request-user-info">
              <img src="${req.requesterAvatar}" alt="${req.requesterName}" class="avatar">
              <div>
                <div style="font-size: 0.95rem; font-weight: 700;">${req.requesterName}</div>
                <div style="font-size: 0.725rem; color: #64748b;">Requested on ${new Date(req.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
              <span class="badge badge-indigo">Skill: ${req.skillName}</span>
              <span class="badge badge-blue">${req.domain}</span>
            </div>

            <div class="request-msg-box">
              "${req.message}"
            </div>
          </div>

          <div>
            ${isAcceptedByOther ? `
              <div style="font-size: 0.8rem; color: #991b1b; background: #fee2e2; padding: 0.6rem; border-radius: var(--radius-sm); font-weight: 600; text-align: center;">
                🔒 Request already accepted by another student (${req.acceptedByName})
              </div>
            ` : isAcceptedByMe ? `
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary w-full btn-sm" onclick="openChatModal('${req.id}')">
                  💬 Open Chat Thread
                </button>
                <button class="btn btn-outline w-full btn-sm" onclick="openScheduleModal('${req.id}')">
                  📅 Schedule Session
                </button>
              </div>
            ` : `
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-success w-full" onclick="handleAcceptRequest('${req.id}')">
                  ✓ ACCEPT
                </button>
                <button class="btn btn-danger w-full" onclick="handleDeclineRequest('${req.id}')">
                  ✕ DECLINE
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  } else {
    // REQUESTS SENT
    const grid = document.getElementById('requests-sent-grid');
    if (sent.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <p style="font-size: 1rem; color: #64748b;">You haven't sent any skill requests yet.</p>
          <button class="btn btn-primary" onclick="switchView('skills')" style="margin-top: 1rem;">Browse Skills →</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = sent.map(req => `
      <div class="card request-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700;">${req.skillName}</h3>
              <div style="font-size: 0.75rem; color: #64748b;">Sent on ${new Date(req.createdAt).toLocaleDateString()}</div>
            </div>
            <span class="badge ${req.status === 'ACCEPTED' ? 'badge-green' : 'badge-amber'}">${req.status}</span>
          </div>

          <div style="font-size: 0.8rem; color: #334155; margin-bottom: 0.75rem;">
            Target Domain: <strong>${req.domain}</strong>
          </div>

          <div class="request-msg-box">
            "${req.message}"
          </div>

          ${req.status === 'ACCEPTED' ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.65rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
              <div style="font-size: 0.75rem; color: #166534; font-weight: 700;">Accepted by Assigned Peer Mentor:</div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                <img src="${req.acceptedByAvatar}" class="avatar" style="width: 28px; height: 28px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: #14532d;">${req.acceptedByName}</span>
              </div>
            </div>
          ` : `
            <div style="font-size: 0.775rem; color: #64748b; font-style: italic;">
              Notified all peer mentors in ${req.domain} domain. Waiting for acceptance...
            </div>
          `}
        </div>

        <div>
          ${req.status === 'ACCEPTED' ? `
            <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
              <button class="btn btn-primary w-full btn-sm" onclick="openChatModal('${req.id}')">
                💬 CHAT
              </button>
              <button class="btn btn-outline w-full btn-sm" onclick="openScheduleModal('${req.id}')">
                📅 SCHEDULE SESSION
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
}

function handleAcceptRequest(requestId) {
  const res = window.erpStore.acceptSkillRequest(requestId);
  if (res.success) {
    showToast(`Request accepted! You are now assigned mentor for ${res.request.skillName}.`, 'success');
    renderRequestsModule();
    openChatModal(requestId);
  } else {
    showToast(res.message, 'error');
  }
}

function handleDeclineRequest(requestId) {
  window.erpStore.declineSkillRequest(requestId);
  showToast('Request declined', 'success');
  renderRequestsModule();
}

// --- 5. CHAT MODAL LOGIC ---

function openChatModal(requestId) {
  currentActiveRequestId = requestId;
  const request = window.erpStore.state.skillRequests.find(r => r.id === requestId);
  if (!request) return;

  document.getElementById('chat-modal-title').textContent = `Chat: ${request.skillName} Session`;
  document.getElementById('chat-modal-subtitle').textContent = `Between ${request.requesterName} & ${request.acceptedByName || 'Peer'}`;
  
  renderChatMessages();
  openModal('modal-chat');
}

function renderChatMessages() {
  if (!currentActiveRequestId) return;
  const messages = window.erpStore.getMessagesForRequest(currentActiveRequestId);
  const currentUser = window.erpStore.getCurrentUser();
  const container = document.getElementById('chat-messages-container');

  if (messages.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #64748b; font-size: 0.8rem; padding: 2rem;">No messages yet. Start the conversation below!</div>`;
    return;
  }

  container.innerHTML = messages.map(m => {
    const isMine = m.senderId === currentUser.id;
    return `
      <div class="chat-bubble ${isMine ? 'mine' : 'other'}">
        <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.15rem; opacity: 0.9;">${m.senderName}</div>
        <div>${m.message}</div>
        <div class="chat-meta">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function submitChatMessage() {
  const input = document.getElementById('chat-input-text');
  const text = input.value.trim();
  if (!text || !currentActiveRequestId) return;

  window.erpStore.sendMessage(currentActiveRequestId, text);
  input.value = '';
  renderChatMessages();
}

function openScheduleModalFromChat() {
  closeModal('modal-chat');
  if (currentActiveRequestId) {
    openScheduleModal(currentActiveRequestId);
  }
}

// --- 6. SESSION SCHEDULING LOGIC ---

function openScheduleModal(requestId) {
  currentActiveRequestId = requestId;
  document.getElementById('schedule-request-id').value = requestId;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('schedule-date').value = tomorrow.toISOString().split('T')[0];

  openModal('modal-schedule');
}

function submitScheduleSession() {
  const requestId = document.getElementById('schedule-request-id').value;
  const date = document.getElementById('schedule-date').value;
  const time = document.getElementById('schedule-time').value;
  const venue = document.getElementById('schedule-venue').value;
  const notes = document.getElementById('schedule-notes').value;

  if (!date || !time || !venue) {
    showToast('Please fill in Date, Time, and Venue', 'error');
    return;
  }

  const res = window.erpStore.createSession({ requestId, date, time, venue, notes });
  if (res.success) {
    showToast(`Session scheduled for ${date} @ ${time} at ${venue}!`, 'success');
    closeModal('modal-schedule');
    switchView('home');
  } else {
    showToast(res.message, 'error');
  }
}

// --- 7. PROFILE MODULE & EDIT LOGIC ---

function renderProfileModule() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  document.getElementById('profile-view-avatar').src = user.avatar;
  document.getElementById('profile-view-name').textContent = user.name;
  document.getElementById('profile-view-id').textContent = user.studentId;
  document.getElementById('profile-view-programme').textContent = user.programme;
  document.getElementById('profile-view-year').textContent = user.year;
  document.getElementById('profile-view-email').textContent = user.email;
  document.getElementById('profile-view-domain-title').textContent = user.domain;
  document.getElementById('profile-view-bio').textContent = user.bio || 'No bio specified.';

  document.getElementById('profile-view-teach-tags').innerHTML = user.teachSkills.map(s => `<span class="tag" style="background: #d1fae5; color: #065f46;">✓ ${s}</span>`).join('');
  document.getElementById('profile-view-learn-tags').innerHTML = user.learnSkills.map(s => `<span class="tag" style="background: #dbeafe; color: #1e40af;">🎓 ${s}</span>`).join('');
}

function openProfileEditModal() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  document.getElementById('edit-profile-name').value = user.name;
  document.getElementById('edit-profile-programme').value = user.programme;
  document.getElementById('edit-profile-domain').value = user.domain;
  document.getElementById('edit-profile-teach').value = user.teachSkills.join(', ');
  document.getElementById('edit-profile-learn').value = user.learnSkills.join(', ');
  document.getElementById('edit-profile-bio').value = user.bio;

  openModal('modal-profile-edit');
}

function submitProfileEdit() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  const profileData = {
    name: document.getElementById('edit-profile-name').value,
    programme: document.getElementById('edit-profile-programme').value,
    domain: document.getElementById('edit-profile-domain').value,
    teachSkills: document.getElementById('edit-profile-teach').value.split(',').map(s => s.trim()).filter(Boolean),
    learnSkills: document.getElementById('edit-profile-learn').value.split(',').map(s => s.trim()).filter(Boolean),
    bio: document.getElementById('edit-profile-bio').value
  };

  window.erpStore.updateProfile(user.id, profileData);
  showToast('Profile updated successfully!', 'success');
  closeModal('modal-profile-edit');
  renderProfileModule();
}

// --- 8. NOTIFICATION BELL & DROPDOWN ---

function updateNotificationsUI() {
  const user = window.erpStore.getCurrentUser();
  if (!user) return;

  const unreadCount = window.erpStore.getUnreadNotificationCount();
  const badge = document.getElementById('notif-badge');
  
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  const notifications = window.erpStore.getNotifications();
  const list = document.getElementById('notif-list');
  if (notifications.length === 0) {
    list.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.8rem;">No notifications.</div>`;
    return;
  }

  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div>${n.text}</div>
      <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem;">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `).join('');
}

function toggleNotificationDropdown() {
  document.getElementById('notif-dropdown').classList.toggle('show');
}

function markAllNotificationsRead() {
  window.erpStore.markNotificationsRead();
  updateNotificationsUI();
  showToast('Notifications marked as read', 'success');
}

// --- UTILITY FUNCTIONS & TOASTS ---

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// EXPLICIT GLOBAL BINDINGS FOR HTML INLINE EVENT HANDLERS
window.togglePasswordVisibility = togglePasswordVisibility;
window.handlePublicSearch = handlePublicSearch;
window.handleGlobalHeaderSearch = handleGlobalHeaderSearch;
window.selectGlobalSearchResult = selectGlobalSearchResult;
window.handleLogout = handleLogout;
window.showLoginView = showLoginView;
window.showMainApp = showMainApp;
window.resetDataToDefaults = resetDataToDefaults;
window.switchView = switchView;
window.selectPlacementType = selectPlacementType;
window.filterPlacementDomain = filterPlacementDomain;
window.renderPlacementCompanies = renderPlacementCompanies;
window.showCompanyDetail = showCompanyDetail;
window.handleSkillClickByName = handleSkillClickByName;
window.selectSkillCategory = selectSkillCategory;
window.renderSkillsModule = renderSkillsModule;
window.openRequestLearnModal = openRequestLearnModal;
window.submitSkillRequest = submitSkillRequest;
window.switchRequestsTab = switchRequestsTab;
window.renderRequestsModule = renderRequestsModule;
window.handleAcceptRequest = handleAcceptRequest;
window.handleDeclineRequest = handleDeclineRequest;
window.openChatModal = openChatModal;
window.submitChatMessage = submitChatMessage;
window.openScheduleModalFromChat = openScheduleModalFromChat;
window.openScheduleModal = openScheduleModal;
window.submitScheduleSession = submitScheduleSession;
window.openProfileEditModal = openProfileEditModal;
window.submitProfileEdit = submitProfileEdit;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.markAllNotificationsRead = markAllNotificationsRead;
window.openModal = openModal;
window.closeModal = closeModal;
