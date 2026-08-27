/**
 * Student ERP: Placement & Peer Skill-Sharing Platform
 * Central Application Store & Domain Matching Logic
 * Supports Backend REST API Sync + LocalStorage Fallback Persistence
 */

class ERPStore {
  constructor() {
    this.STORAGE_KEY = 'STUDENT_ERP_PLATFORM_V1';
    this.API_BASE = 'http://localhost:8080/api';
    this.state = this.loadState();
    this.listeners = [];
    this.initBackendSync();
  }

  async initBackendSync() {
    try {
      const res = await fetch(`${this.API_BASE}/state`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Merge backend state into local state
          this.state.users = json.data.users || this.state.users;
          this.state.skillRequests = json.data.skillRequests || this.state.skillRequests;
          this.state.messages = json.data.messages || this.state.messages;
          this.state.sessions = json.data.sessions || this.state.sessions;
          this.state.notifications = json.data.notifications || this.state.notifications;
          this.saveState();
        }
      }
    } catch (e) {
      console.log('Backend sync offline or running in standalone static mode:', e.message);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    // Fallback to initial seed data
    const seed = window.SEED_DATA;
    const initial = {
      currentUser: seed.users[0], // Default Rohan Sharma (student1)
      users: seed.users,
      skills: seed.skills,
      companies: seed.companies,
      skillRequests: seed.skillRequests,
      messages: seed.messages,
      sessions: seed.sessions,
      notifications: seed.notifications
    };
    this.saveState(initial);
    return initial;
  }

  saveState(stateToSave = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => l(this.state));
  }

  resetToDefaults() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = this.loadState();
    this.notifyListeners();
  }

  // --- AUTHENTICATION & DEMO SWITCHING ---

  login(username, password) {
    const user = this.state.users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (user) {
      this.state.currentUser = user;
      this.saveState();
      
      // Async notify backend
      fetch(`${this.API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).catch(() => {});

      return { success: true, user };
    }
    return { success: false, message: 'Invalid Student ID/Username or Password' };
  }

  switchDemoUser(username) {
    const user = this.state.users.find(u => u.username === username);
    if (user) {
      this.state.currentUser = user;
      this.saveState();
      return user;
    }
    return null;
  }

  logout() {
    this.state.currentUser = null;
    this.saveState();
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  getUsers() {
    return this.state.users;
  }

  getUserById(id) {
    return this.state.users.find(u => u.id === id);
  }

  updateProfile(userId, profileData) {
    const userIndex = this.state.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.state.users[userIndex] = {
        ...this.state.users[userIndex],
        ...profileData
      };
      if (this.state.currentUser && this.state.currentUser.id === userId) {
        this.state.currentUser = this.state.users[userIndex];
      }
      this.saveState();
      return this.state.users[userIndex];
    }
    return null;
  }

  // --- PLACEMENT MODULE ---

  getCompanies(filterDomain = null, filterType = null, searchQuery = '') {
    return this.state.companies.filter(c => {
      const matchDomain = !filterDomain || filterDomain === 'All' || c.domain.toLowerCase() === filterDomain.toLowerCase();
      const matchType = !filterType || filterType === 'All' || c.placementType.toLowerCase() === filterType.toLowerCase();
      const matchSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchDomain && matchType && matchSearch;
    });
  }

  getCompanyById(id) {
    return this.state.companies.find(c => c.id === id);
  }

  // --- SKILLS MODULE ---

  getSkills(filterDomain = null, filterType = null, searchQuery = '') {
    return this.state.skills.filter(s => {
      const matchDomain = !filterDomain || filterDomain === 'All' || s.domain.toLowerCase() === filterDomain.toLowerCase();
      const matchType = !filterType || filterType === 'All' || s.type === filterType;
      const matchSearch = !searchQuery || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchDomain && matchType && matchSearch;
    });
  }

  getSkillById(id) {
    return this.state.skills.find(s => s.id === id);
  }

  // --- SKILL REQUESTS & MATCHING ENGINE ---

  createSkillRequest(skillId, message = '') {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };

    const skill = this.getSkillById(skillId);
    if (!skill) return { success: false, message: 'Skill not found' };

    // Check if duplicate pending request exists for this user and skill
    const existing = this.state.skillRequests.find(
      r => r.requesterId === user.id && r.skillId === skillId && r.status === 'PENDING'
    );
    if (existing) {
      return { success: false, message: 'You already have an active pending request for this skill.' };
    }

    const newRequest = {
      id: 'req_' + Date.now(),
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      skillId: skill.id,
      skillName: skill.name,
      domain: skill.domain,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      message: message || `I would like to learn ${skill.name} from a peer in ${skill.domain}.`,
      acceptedBy: null,
      acceptedByName: null,
      acceptedByAvatar: null,
      acceptedAt: null
    };

    this.state.skillRequests.unshift(newRequest);

    // Notify all mentors whose domain matches skill domain
    const targetMentors = this.state.users.filter(u => u.domain === skill.domain && u.id !== user.id);
    targetMentors.forEach(m => {
      this.addNotification({
        userId: m.id,
        text: `New skill request: ${user.name} wants to learn ${skill.name} (${skill.domain}).`,
        type: 'REQUEST'
      });
    });

    skill.requestsCount = (skill.requestsCount || 0) + 1;

    this.saveState();
    return { success: true, request: newRequest, notifiedCount: targetMentors.length };
  }

  /**
   * IMPORTANT SINGLE ACCEPTANCE BUSINESS RULE:
   * If B accepts a request, status becomes ACCEPTED, B is assigned as mentor.
   * Locks request for all other potential domain peers.
   */
  acceptSkillRequest(requestId) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };

    const request = this.state.skillRequests.find(r => r.id === requestId);
    if (!request) return { success: false, message: 'Request not found' };

    if (request.status === 'ACCEPTED') {
      return {
        success: false,
        message: `This request was already accepted by ${request.acceptedByName || 'another student'}.`
      };
    }

    if (request.status === 'CLOSED' || request.status === 'CANCELLED') {
      return { success: false, message: 'This request is no longer available.' };
    }

    // Accept request locally
    request.status = 'ACCEPTED';
    request.acceptedBy = user.id;
    request.acceptedByName = user.name;
    request.acceptedByAvatar = user.avatar;
    request.acceptedAt = new Date().toISOString();

    // Notify requester
    this.addNotification({
      userId: request.requesterId,
      text: `${user.name} accepted your request to learn ${request.skillName}! You can now chat and schedule a session.`,
      type: 'ACCEPTANCE'
    });

    // Add initial automated chat message
    this.state.messages.push({
      id: 'msg_' + Date.now(),
      requestId: request.id,
      senderId: user.id,
      senderName: user.name,
      message: `Hi ${request.requesterName}! I have accepted your request for ${request.skillName}. Let's coordinate a session time!`,
      timestamp: new Date().toISOString()
    });

    this.saveState();

    // Sync with backend API
    fetch(`${this.API_BASE}/requests/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, userId: user.id })
    }).catch(() => {});

    return { success: true, request };
  }

  declineSkillRequest(requestId) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };

    const request = this.state.skillRequests.find(r => r.id === requestId);
    if (!request) return { success: false, message: 'Request not found' };

    request.declinedBy = request.declinedBy || [];
    if (!request.declinedBy.includes(user.id)) {
      request.declinedBy.push(user.id);
    }

    this.saveState();
    return { success: true };
  }

  getRequestsReceived(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return [];

    return this.state.skillRequests.filter(r => {
      const isRequester = r.requesterId === current.id;
      const matchDomain = r.domain === current.domain;
      const isDeclinedByUser = r.declinedBy && r.declinedBy.includes(current.id);
      
      return !isRequester && matchDomain && !isDeclinedByUser;
    });
  }

  getRequestsSent(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return [];

    return this.state.skillRequests.filter(r => r.requesterId === current.id);
  }

  // --- CHAT & MESSAGING MODULE ---

  getMessagesForRequest(requestId) {
    return this.state.messages.filter(m => m.requestId === requestId);
  }

  sendMessage(requestId, text) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const request = this.state.skillRequests.find(r => r.id === requestId);
    if (!request) return null;

    const newMsg = {
      id: 'msg_' + Date.now(),
      requestId: requestId,
      senderId: user.id,
      senderName: user.name,
      message: text,
      timestamp: new Date().toISOString()
    };

    this.state.messages.push(newMsg);

    const recipientId = request.requesterId === user.id ? request.acceptedBy : request.requesterId;
    if (recipientId) {
      this.addNotification({
        userId: recipientId,
        text: `New chat message from ${user.name} regarding ${request.skillName}.`,
        type: 'CHAT'
      });
    }

    this.saveState();

    // Sync with backend API
    fetch(`${this.API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, senderId: user.id, message: text })
    }).catch(() => {});

    return newMsg;
  }

  // --- SESSION SCHEDULING MODULE ---

  createSession({ requestId, date, time, venue, notes }) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };

    const request = this.state.skillRequests.find(r => r.id === requestId);
    if (!request) return { success: false, message: 'Request not found' };

    const newSession = {
      id: 'ses_' + Date.now(),
      requestId: requestId,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      teacherId: request.acceptedBy,
      teacherName: request.acceptedByName,
      skillId: request.skillId,
      skillName: request.skillName,
      domain: request.domain,
      date,
      time,
      venue,
      notes: notes || 'Peer skill exchange session.',
      status: 'SCHEDULED'
    };

    this.state.sessions.unshift(newSession);

    const otherPartyId = request.requesterId === user.id ? request.acceptedBy : request.requesterId;
    this.addNotification({
      userId: otherPartyId,
      text: `${user.name} scheduled a peer session for ${request.skillName} on ${date} at ${time} (${venue}).`,
      type: 'SESSION'
    });

    this.saveState();
    return { success: true, session: newSession };
  }

  getUpcomingSessions(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return [];

    return this.state.sessions.filter(
      s => s.requesterId === current.id || s.teacherId === current.id
    );
  }

  // --- NOTIFICATIONS MODULE ---

  addNotification({ userId, text, type }) {
    const notif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      userId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    this.state.notifications.unshift(notif);
  }

  getNotifications(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return [];

    return this.state.notifications.filter(n => n.userId === current.id);
  }

  getUnreadNotificationCount(userId = null) {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  markNotificationsRead(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return;

    this.state.notifications.forEach(n => {
      if (n.userId === current.id) n.read = true;
    });
    this.saveState();
  }

  // --- RECENT ACTIVITY TIMELINE ---

  getRecentActivityTimeline(userId = null) {
    const current = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!current) return [];

    const items = [];

    this.getRequestsSent(current.id).forEach(r => {
      items.push({
        type: 'SENT_REQUEST',
        title: `You sent a request for ${r.skillName}`,
        detail: `Domain: ${r.domain} • Status: ${r.status}`,
        timestamp: r.createdAt
      });
      if (r.status === 'ACCEPTED' && r.acceptedByName) {
        items.push({
          type: 'ACCEPTED_REQUEST',
          title: `${r.acceptedByName} accepted your ${r.skillName} request`,
          detail: `Peer session ready for scheduling`,
          timestamp: r.acceptedAt || r.createdAt
        });
      }
    });

    this.getRequestsReceived(current.id).forEach(r => {
      items.push({
        type: 'RECEIVED_REQUEST',
        title: `Received request for ${r.skillName} from ${r.requesterName}`,
        detail: `Requester Domain: ${r.domain}`,
        timestamp: r.createdAt
      });
    });

    this.getUpcomingSessions(current.id).forEach(s => {
      const isTeacher = s.teacherId === current.id;
      items.push({
        type: 'SESSION',
        title: `Peer Session scheduled: ${s.skillName}`,
        detail: `${isTeacher ? 'Teaching' : 'Learning from'} ${isTeacher ? s.requesterName : s.teacherName} at ${s.venue} (${s.date} ${s.time})`,
        timestamp: s.date
      });
    });

    items.push({
      type: 'PLACEMENT_UPDATE',
      title: 'Deloitte financial advisory placement round updated',
      detail: 'Written test date announced for Friday 10:00 AM',
      timestamp: '2026-08-26T07:00:00Z'
    });

    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);
  }
}

window.erpStore = new ERPStore();
