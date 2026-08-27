/**
 * Student ERP: Placement & Peer Skill-Sharing Platform
 * Initial Data Definitions & Demo Taxonomy
 */

const INITIAL_DATA = {
  // DEMO USERS (5 Standard + Lavisha Demo User)
  users: [
    {
      id: 'student_lavisha',
      username: 'lavisha',
      password: '1234',
      name: 'Lavisha Khandelwal',
      studentId: 'STU2025001',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'Marketing',
      email: 'lavisha.k@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'MBA Marketing Specialist at IMT Hyderabad. Passionate about Brand Strategy, Digital Marketing, and Peer Skill Development.',
      teachSkills: ['Brand Management', 'Consumer Behaviour', 'Digital Marketing & SEO', 'Public Speaking & Case Presentation'],
      learnSkills: ['Financial Modelling & Valuation', 'Python for Analytics', 'Power BI'],
      isLoggedIn: false
    },
    {
      id: 'student1',
      username: 'student1',
      password: 'Student@123',
      name: 'Rohan Sharma',
      studentId: 'STU2025012',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'Marketing',
      email: 'rohan.s@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Final year MBA student specializing in Digital Marketing, Brand Strategy, and Consumer Analytics.',
      teachSkills: ['Digital Marketing & SEO', 'Brand Management', 'Consumer Behaviour'],
      learnSkills: ['Financial Modelling & Valuation', 'Advanced Excel & Financial Functions'],
      isLoggedIn: false
    },
    {
      id: 'student2',
      username: 'student2',
      password: 'Student@456',
      name: 'Ananya Verma',
      studentId: 'STU2025045',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'Finance',
      email: 'ananya.v@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Finance enthusiast focusing on Equity Research, Corporate Valuation, and DCF Modelling.',
      teachSkills: ['Financial Modelling & Valuation', 'Corporate Finance', 'Accounting Principles'],
      learnSkills: ['Python for Analytics', 'Data Visualization with Power BI'],
      isLoggedIn: false
    },
    {
      id: 'student3',
      username: 'student3',
      password: 'Student@789',
      name: 'Vikramaditya Singh',
      studentId: 'STU2025089',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'IT',
      email: 'vikram.s@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Tech enthusiast with expertise in Data Analytics, SQL Database Design, and Product Management.',
      teachSkills: ['Python for Analytics', 'SQL & Database Queries', 'Machine Learning Basics'],
      learnSkills: ['Supply Chain Analytics', 'Negotiation Skills'],
      isLoggedIn: false
    },
    {
      id: 'student4',
      username: 'student4',
      password: 'Student@321',
      name: 'Priya Nair',
      studentId: 'STU2025102',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'HR',
      email: 'priya.n@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bio: 'Human Resources major passionate about Organizational Leadership, Talent Acquisition, and HR Analytics.',
      teachSkills: ['Talent Acquisition & Interviewing', 'Organizational Behaviour', 'HR Analytics'],
      learnSkills: ['Power BI', 'Digital Marketing & SEO'],
      isLoggedIn: false
    },
    {
      id: 'student5',
      username: 'student5',
      password: 'Student@654',
      name: 'Kabir Patel',
      studentId: 'STU2025144',
      programme: 'MBA',
      year: '2nd Year',
      domain: 'Operations',
      email: 'kabir.p@imthyderabad.edu.in',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Operations and Logistics specialist focusing on Lean Six Sigma, Supply Chain Management, and Logistics.',
      teachSkills: ['Supply Chain Analytics', 'Operations Research', 'Lean Six Sigma & Quality'],
      learnSkills: ['Financial Modelling & Valuation', 'SQL & Database Queries'],
      isLoggedIn: false
    }
  ],

  // 6 KEY SKILLS + 5 DOMAIN SKILL GROUPS (Total ~25 Campus Skills)
  skills: [
    // 🔑 KEY CROSS-DOMAIN SKILLS
    {
      id: 'sk_excel',
      name: 'Advanced Excel & Financial Functions',
      domain: 'Finance',
      category: 'key',
      description: 'Master VLOOKUP, INDEX/MATCH, Pivot Tables, Macro basics, and Data Analysis Toolpak.',
      difficulty: 'Intermediate',
      teachersCount: 18
    },
    {
      id: 'sk_ppt',
      name: 'Executive PowerPoint & Storytelling',
      domain: 'Marketing',
      category: 'key',
      description: 'Creating high-impact consulting decks, visual hierarchy, and executive pitch presentations.',
      difficulty: 'Beginner',
      teachersCount: 24
    },
    {
      id: 'sk_powerbi',
      name: 'Data Visualization with Power BI',
      domain: 'IT',
      category: 'key',
      description: 'Building interactive executive dashboards, DAX queries, and data model transformation.',
      difficulty: 'Advanced',
      teachersCount: 12
    },
    {
      id: 'sk_sql',
      name: 'SQL & Database Queries',
      domain: 'IT',
      category: 'key',
      description: 'Relational database queries, JOINs, GROUP BY aggregations, and window functions for analytics.',
      difficulty: 'Intermediate',
      teachersCount: 15
    },
    {
      id: 'sk_speaking',
      name: 'Public Speaking & Case Presentation',
      domain: 'HR',
      category: 'key',
      description: 'Articulating complex business cases under pressure, body language, and Q&A handling.',
      difficulty: 'Intermediate',
      teachersCount: 30
    },
    {
      id: 'sk_cases',
      name: 'Guesstimates & Business Case Solving',
      domain: 'Marketing',
      category: 'key',
      description: 'Structured case frameworks (MECE, 4P, Market Entry, Profitability) for consulting drives.',
      difficulty: 'Advanced',
      teachersCount: 21
    },

    // 📢 MARKETING DOMAIN SKILLS
    {
      id: 'sk_brand',
      name: 'Brand Management & Positioning',
      domain: 'Marketing',
      category: 'domain',
      description: 'Developing brand equity, perceptual mapping, target personas, and communication strategy.',
      difficulty: 'Intermediate',
      teachersCount: 14
    },
    {
      id: 'sk_seo',
      name: 'Digital Marketing & SEO',
      domain: 'Marketing',
      category: 'domain',
      description: 'Google Analytics 4, Meta Ads Manager, keyword strategy, and ROI conversion funnels.',
      difficulty: 'Intermediate',
      teachersCount: 16
    },
    {
      id: 'sk_consumer',
      name: 'Consumer Behaviour & Market Research',
      domain: 'Marketing',
      category: 'domain',
      description: 'Qualitative focus group design, survey methodology, SPSS statistical testing.',
      difficulty: 'Intermediate',
      teachersCount: 11
    },
    {
      id: 'sk_sales',
      name: 'B2B Sales & Key Account Management',
      domain: 'Marketing',
      category: 'domain',
      description: 'Enterprise sales pipeline, consultative selling, lead qualification, and CRM tracking.',
      difficulty: 'Advanced',
      teachersCount: 9
    },

    // 📈 FINANCE DOMAIN SKILLS
    {
      id: 'sk_finmod',
      name: 'Financial Modelling & Valuation',
      domain: 'Finance',
      category: 'domain',
      description: '3-statement financial models, Discounted Cash Flow (DCF), Comparable Company Analysis.',
      difficulty: 'Advanced',
      teachersCount: 19
    },
    {
      id: 'sk_corpfin',
      name: 'Corporate Finance & WACC',
      domain: 'Finance',
      category: 'domain',
      description: 'Capital budgeting, Cost of Capital (WACC), dividend policy, and capital structure optimization.',
      difficulty: 'Intermediate',
      teachersCount: 13
    },
    {
      id: 'sk_equity',
      name: 'Equity Research & Industry Analysis',
      domain: 'Finance',
      category: 'domain',
      description: 'Analyzing annual reports, SEC/SEBI filings, earnings call transcripts, and sector metrics.',
      difficulty: 'Advanced',
      teachersCount: 10
    },
    {
      id: 'sk_derivatives',
      name: 'Financial Derivatives & Risk Mgmt',
      domain: 'Finance',
      category: 'domain',
      description: 'Futures, Options pricing (Black-Scholes), hedging strategies, and portfolio VAR.',
      difficulty: 'Advanced',
      teachersCount: 7
    },

    // ⚙️ OPERATIONS DOMAIN SKILLS
    {
      id: 'sk_supply',
      name: 'Supply Chain Analytics',
      domain: 'Operations',
      category: 'domain',
      description: 'Inventory management (EOQ, Safety Stock), demand forecasting, and logistics routing.',
      difficulty: 'Intermediate',
      teachersCount: 12
    },
    {
      id: 'sk_sixsigma',
      name: 'Lean Six Sigma & Quality Control',
      domain: 'Operations',
      category: 'domain',
      description: 'DMAIC framework, Process Mapping, Kaizen, SPC control charts, and waste reduction.',
      difficulty: 'Intermediate',
      teachersCount: 15
    },
    {
      id: 'sk_procure',
      name: 'Procurement & Vendor Management',
      domain: 'Operations',
      category: 'domain',
      description: 'Strategic sourcing, contract negotiation, vendor evaluation scorecards, and SLA tracking.',
      difficulty: 'Intermediate',
      teachersCount: 8
    },

    // 💻 IT DOMAIN SKILLS
    {
      id: 'sk_python',
      name: 'Python for Analytics',
      domain: 'IT',
      category: 'domain',
      description: 'Pandas dataframes, NumPy vectorization, Matplotlib/Seaborn visualization, and automation.',
      difficulty: 'Intermediate',
      teachersCount: 22
    },
    {
      id: 'sk_prodmgm',
      name: 'Product Management & Wireframing',
      domain: 'IT',
      category: 'domain',
      description: 'PRD writing, user stories, Figma wireframing, Agile/Scrum sprint tracking.',
      difficulty: 'Intermediate',
      teachersCount: 17
    },
    {
      id: 'sk_ml',
      name: 'Machine Learning Basics',
      domain: 'IT',
      category: 'domain',
      description: 'Supervised regression & classification algorithms, Scikit-Learn pipelines, decision trees.',
      difficulty: 'Advanced',
      teachersCount: 9
    },

    // 👥 HR DOMAIN SKILLS
    {
      id: 'sk_hranalytics',
      name: 'HR Analytics & Metrics',
      domain: 'HR',
      category: 'domain',
      description: 'Attrition modeling, employee engagement metrics, compensation benchmarking, and ROI.',
      difficulty: 'Intermediate',
      teachersCount: 10
    },
    {
      id: 'sk_talent',
      name: 'Talent Acquisition & Interviewing',
      domain: 'HR',
      category: 'domain',
      description: 'Behavioral interviewing (STAR method), competency mapping, employer branding.',
      difficulty: 'Beginner',
      teachersCount: 20
    },
    {
      id: 'sk_labour',
      name: 'Labour Laws & HR Compliance',
      domain: 'HR',
      category: 'domain',
      description: 'Statutory compliance, Industrial Relations, POSH compliance, and employment contracts.',
      difficulty: 'Intermediate',
      teachersCount: 6
    }
  ],

  // 20 REALISTIC CAMPUS RECRUITING COMPANIES
  companies: [
    {
      id: 'comp_mckinsey',
      name: 'McKinsey & Company',
      logo: 'McK',
      placementType: 'Final Placement',
      domain: 'Marketing',
      industry: 'Management Consulting',
      averageSalary: '₹34.5 LPA',
      selectedCount: 4,
      status: 'Drive Scheduled (Oct 15)',
      hiringStage: 'Shortlisting Completed',
      skillsRequired: ['Guesstimates & Business Case Solving', 'Executive PowerPoint & Storytelling', 'Public Speaking & Case Presentation'],
      roles: ['Management Consultant', 'Business Analyst'],
      interviewQuestions: {
        hr: ['Walk us through a challenging project where you led a team under tight deadlines.', 'Why Consulting over Investment Banking or FMCG?'],
        technical: ['Structure a market entry framework for a US-based EV manufacturer entering India.', 'How would you analyze falling profitability for a national telecom operator?'],
        case: ['Estimate the total annual market size for commercial aviation jet fuel in India.', 'A retail chain faces 15% inventory shrinkage. What root causes will you inspect?'],
        gd: ['Artificial Intelligence: Impact on White-Collar Management Roles']
      },
      selectionProcess: ['Problem Solving Test (PST)', 'Case Round 1 (Operations & Strategy)', 'Case Round 2 (Partner Round)', 'Behavioral Fit Interview']
    },
    {
      id: 'comp_hdfc',
      name: 'HDFC Bank',
      logo: 'HDFC',
      placementType: 'Final Placement',
      domain: 'Finance',
      industry: 'Banking & Financial Services',
      averageSalary: '₹21.0 LPA',
      selectedCount: 14,
      status: 'Applications Open',
      hiringStage: 'Application Review',
      skillsRequired: ['Financial Modelling & Valuation', 'Corporate Finance & WACC', 'Advanced Excel & Financial Functions'],
      roles: ['Management Trainee - Wholesale Banking', 'Credit Risk Analyst'],
      interviewQuestions: {
        hr: ['What makes HDFC Bank stand out in the Indian private banking space?', 'Are you open to relocation across major commercial hubs?'],
        technical: ['Explain how working capital changes affect the cash flow statement.', 'What is the current Repo Rate and how does it impact retail lending margins?'],
        case: ['Assess the creditworthiness of a mid-sized textile exporter applying for a ₹50 Cr term loan.'],
        gd: ['Digital Banking vs Traditional Branch Banking in Tier 2/3 Cities']
      },
      selectionProcess: ['Aptitude & Technical Online Assessment', 'Group Discussion', 'Technical Interview', 'HR Interview']
    },
    {
      id: 'comp_huel',
      name: 'Hindustan Unilever (HUL)',
      logo: 'HUL',
      placementType: 'Summer Internship',
      domain: 'Marketing',
      industry: 'FMCG',
      averageSalary: '₹2.8 L/Month',
      selectedCount: 8,
      status: 'Drive Ongoing',
      hiringStage: 'GD Round Scheduled',
      skillsRequired: ['Brand Management & Positioning', 'Consumer Behaviour & Market Research', 'Digital Marketing & SEO'],
      roles: ['ULIP Summer Intern - Marketing', 'Sales & Category Management Intern'],
      interviewQuestions: {
        hr: ['Tell us about a time you launched a campaign or event from scratch.', 'Which HUL brand would you reposition and why?'],
        technical: ['Differentiate between Push vs Pull marketing strategy in rural distribution.', 'How do you measure Trade Promotion Effectiveness?'],
        case: ['Develop a launch campaign for a new organic laundry detergent in South India.'],
        gd: ['D2C Brands vs Legacy FMCG Giants: Survival Strategies']
      },
      selectionProcess: ['Unilever Change Makers Case Challenge', 'Group Discussion', 'Marketing Panel Interview']
    },
    {
      id: 'comp_amazon',
      name: 'Amazon India',
      logo: 'AMZN',
      placementType: 'Final Placement',
      domain: 'Operations',
      industry: 'E-Commerce & Technology',
      averageSalary: '₹28.0 LPA',
      selectedCount: 11,
      status: 'Shortlist Announced',
      hiringStage: 'Final Interview Round',
      skillsRequired: ['Supply Chain Analytics', 'Lean Six Sigma & Quality Control', 'Python for Analytics'],
      roles: ['Area Manager - Fulfilment Network', 'Program Manager - Operations'],
      interviewQuestions: {
        hr: ['Which Amazon Leadership Principle resonates most with you and why?', 'Describe a situation where you had to act with incomplete data (Bias for Action).'],
        technical: ['How do you optimize last-mile delivery cost during peak Diwali sales?', 'Explain the concept of Safety Stock in high-velocity warehouses.'],
        case: ['Design a returns processing workflow to cut reverse logistics turnaround time by 30%.'],
        gd: ['E-Commerce Quick Commerce (10-Min Delivery): Sustainable Model or Cash Burn?']
      },
      selectionProcess: ['Online Leadership Assessment', 'Operations Case Study', 'Bar Raiser Interview']
    },
    {
      id: 'comp_deloitte',
      name: 'Deloitte USI',
      logo: 'DEL',
      placementType: 'Final Placement',
      domain: 'IT',
      industry: 'IT & Management Consulting',
      averageSalary: '₹18.5 LPA',
      selectedCount: 19,
      status: 'Drive Completed',
      hiringStage: 'Offers Released',
      skillsRequired: ['Data Visualization with Power BI', 'SQL & Database Queries', 'Python for Analytics'],
      roles: ['Consultant - Technology Advisory', 'Business Technology Analyst'],
      interviewQuestions: {
        hr: ['Walk us through your resume highlights.', 'Why Deloitte over other Big 4 firms?'],
        technical: ['Write a SQL query to find the 2nd highest salary from an Employee table.', 'Explain the difference between Agile and Waterfall software development.'],
        case: ['A healthcare client wants to migrate from legacy servers to Cloud. Map the risk factors.'],
        gd: ['Data Privacy and Cloud Security in Modern Enterprise Applications']
      },
      selectionProcess: ['Cognitive Assessment', 'Technical Coding/SQL Assessment', 'Partner Interview']
    },
    {
      id: 'comp_tata',
      name: 'Tata Steel',
      logo: 'TATA',
      placementType: 'Summer Internship',
      domain: 'HR',
      industry: 'Industrial & Manufacturing',
      averageSalary: '₹1.5 L/Month',
      selectedCount: 6,
      status: 'Applications Open',
      hiringStage: 'Application Review',
      skillsRequired: ['Talent Acquisition & Interviewing', 'Labour Laws & HR Compliance', 'Public Speaking & Case Presentation'],
      roles: ['TAS Summer Intern - Human Resources', 'IR & Corporate HR Intern'],
      interviewQuestions: {
        hr: ['Why are Tata values and ethics central to industrial relations?', 'How do you handle conflict between plant union leaders and management?'],
        technical: ['What are the key provisions under the new Industrial Relations Code?', 'Explain the concept of Employee Value Proposition (EVP).'],
        case: ['Design a retention strategy for junior engineers in remote manufacturing plants.'],
        gd: ['Workplace Diversity & Inclusion: Metric or Mindset Change?']
      },
      selectionProcess: ['TAS Aptitude Test', 'Group Discussion', 'Personal Leadership Interview']
    }
  ],

  // INITIAL PEER SKILL REQUESTS
  skillRequests: [
    {
      id: 'req_101',
      skillId: 'sk_finmod',
      skillName: 'Financial Modelling & Valuation',
      domain: 'Finance',
      requesterId: 'student1',
      requesterName: 'Rohan Sharma',
      requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      message: 'Hi Ananya! I have an upcoming interview with HDFC Bank and need help understanding DCF valuation models and Excel shortcuts.',
      createdAt: '2026-08-25T14:30:00Z',
      status: 'ACCEPTED', // PENDING, ACCEPTED, DECLINED
      acceptedBy: 'student2',
      acceptedByName: 'Ananya Verma',
      acceptedByAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'req_102',
      skillId: 'sk_powerbi',
      skillName: 'Data Visualization with Power BI',
      domain: 'IT',
      requesterId: 'student2',
      requesterName: 'Ananya Verma',
      requesterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      message: 'Hey Vikram! Want to learn DAX queries to build financial dashboards before Deloitte USI drive.',
      createdAt: '2026-08-26T09:15:00Z',
      status: 'PENDING',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByAvatar: null
    },
    {
      id: 'req_103',
      skillId: 'sk_brand',
      skillName: 'Brand Management & Positioning',
      domain: 'Marketing',
      requesterId: 'student5',
      requesterName: 'Kabir Patel',
      requesterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      message: 'Need quick coaching on Perceptual Mapping and Brand Architecture frameworks for HUL case challenge.',
      createdAt: '2026-08-26T11:00:00Z',
      status: 'ACCEPTED',
      acceptedBy: 'student_lavisha',
      acceptedByName: 'Lavisha Khandelwal',
      acceptedByAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    }
  ],

  // SCHEDULED LEARNING SESSIONS
  sessions: [
    {
      id: 'sess_301',
      requestId: 'req_101',
      skillId: 'sk_finmod',
      skillName: 'Financial Modelling & Valuation',
      domain: 'Finance',
      requesterId: 'student1',
      requesterName: 'Rohan Sharma',
      teacherId: 'student2',
      teacherName: 'Ananya Verma',
      date: '2026-08-28',
      time: '16:30',
      venue: 'Management Computer Lab 2B',
      notes: 'Please bring your laptop with Excel Solver enabled. We will build a 3-statement model live.',
      status: 'SCHEDULED'
    }
  ],

  // CHAT MESSAGES
  messages: [
    {
      id: 'msg_1',
      requestId: 'req_101',
      senderId: 'student1',
      senderName: 'Rohan Sharma',
      message: 'Hey Ananya! Thanks for accepting my request. Are you free this Friday afternoon?',
      timestamp: '2026-08-25T15:00:00Z'
    },
    {
      id: 'msg_2',
      requestId: 'req_101',
      senderId: 'student2',
      senderName: 'Ananya Verma',
      message: 'Hi Rohan! Absolutely. Let us meet at the Management Computer Lab at 4:30 PM.',
      timestamp: '2026-08-25T15:05:00Z'
    }
  ],

  // NOTIFICATIONS
  notifications: [
    {
      id: 'notif_1',
      userId: 'student2',
      text: '🔔 New skill request received from Rohan Sharma for Financial Modelling.',
      read: false,
      timestamp: '2026-08-25T14:30:00Z'
    },
    {
      id: 'notif_2',
      userId: 'student1',
      text: '✅ Ananya Verma accepted your request for Financial Modelling session.',
      read: true,
      timestamp: '2026-08-25T14:45:00Z'
    },
    {
      id: 'notif_3',
      userId: 'student_lavisha',
      text: '🔔 New skill request received from Kabir Patel for Brand Management.',
      read: false,
      timestamp: '2026-08-26T11:00:00Z'
};

window.SEED_DATA = INITIAL_DATA;

