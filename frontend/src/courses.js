// ============================================================
// DTU MSc Computer Science & Engineering — Study Plan Data
// Specialization: Cybersecurity · Profile: AI/Data + Security
// 120 ECTS · 2 years
// ============================================================

// ---------- BACKWARD-COMPAT EXPORTS (CustomPlan uses these) ----------

export const COURSE_CATALOG = {
  "12100": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], slot: 'F1A', programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "12101": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], slot: 'F1B', programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "12105": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], slot: 'E1A', programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification (Evening slot)." },
  "12106": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], slot: 'E1B', programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "42500": { name: "Innovation in Engineering", ects: 5, sem: ["January"], cat: "mandatory", specs: [], slot: 'Jan', programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42501": { name: "Innovation in Engineering", ects: 5, sem: ["June"], cat: "mandatory", specs: [], slot: 'Jun', programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42504": { name: "Innovation in Engineering", ects: 5, sem: ["August"], cat: "mandatory", specs: [], slot: 'Aug', programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42502": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["January"], cat: "mandatory", specs: [], slot: 'Jan', programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "42503": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["June"], cat: "mandatory", specs: [], slot: 'Jun', programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "42505": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["August"], cat: "mandatory", specs: [], slot: 'Aug', programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "thesis": { name: "Master's Thesis", ects: 30, sem: ["Spring", "Autumn"], cat: "thesis", specs: [], slot: 'E3B', desc: "Standalone independent project, typically done in Semester 4." },
  "02266": { name: "User Experience Engineering", ects: 5, sem: ["January"], cat: "innov2", specs: ["software"], slot: 'Jan', programs: ["hcai"], desc: "UI/UX methods, user research, prototyping, usability testing." },
  "38102": { name: "Technology Entrepreneurship", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], slot: 'E2A', programs: ["hcai","autonomous"], desc: "Business modeling, startup creation, commercialization strategies." },
  "38103": { name: "X-Tech Entrepreneurship", ects: 10, sem: ["Autumn", "Spring"], cat: "innov2", specs: [], slot: 'E3B', programs: ["hcai"], desc: "Project incubator connecting researchers and students to build startups." },
  "38106": { name: "Developing an Entrepreneurial Mindset", ects: 5, sem: ["Spring", "Autumn"], cat: "innov2", specs: [], slot: 'E3B', programs: ["autonomous"], desc: "Creativity, mindset building, startup exploration." },
  "38113": { name: "Applied AI for Entrepreneurs", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], slot: 'E2B', programs: ["autonomous"], desc: "Leveraging AI/ML systems to build new commercial platforms." },
  "02201": { name: "Agile Hardware Design", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: 'E3A', desc: "Modern agile workflows for digital systems, rapid prototyping." },
  "02203": { name: "Design of Digital Systems", ects: 5, sem: ["Autumn"], cat: "core", specs: ["digital", "embedded"], slot: 'E4A', desc: "FPGA hardware design, CAD tools, digital circuit implementation." },
  "02205": { name: "VLSI Design", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital"], slot: 'F2A', desc: "Very Large Scale Integration, CMOS technology, transistor-level layout." },
  "02207": { name: "Verification of Digital Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: 'E4B', desc: "Formal verification, model checking, assertion-based testing." },
  "02209": { name: "Test of Digital Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: 'E5A', desc: "Fault modeling, automatic test pattern generation, design-for-testability." },
  "02211": { name: "Research Topics in Computer Architecture", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital", "embedded"], slot: 'F2B', desc: "Advanced processor design, memory hierarchies, research directions." },
  "02214": { name: "Hardware/Software Codesign", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital", "embedded"], slot: 'F3A', desc: "FPGA-software interfaces, firmware-hardware boundary, co-simulation." },
  "02225": { name: "Distributed Real-Time Systems", ects: 5, sem: ["Spring"], cat: "core", specs: ["digital", "embedded"], slot: 'F4A', programs: ["autonomous"], desc: "Real-time scheduling, fault tolerance, distributed protocols." },
  "02226": { name: "Networked Embedded Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], slot: 'E5B', desc: "Communication protocols, IoT architectures, real-world embedded labs." },
  "02231": { name: "Cryptography Fundamentals", ects: 5, sem: ["Autumn", "Spring"], cat: "prog", specs: ["cyber", "safe"], slot: 'E3B', desc: "Symmetric/asymmetric crypto, protocols, mathematical foundations." },
  "02232": { name: "Applied Cryptography", ects: 5, sem: ["Autumn", "Spring"], cat: "prog", specs: ["cyber", "safe"], slot: 'E3B', desc: "Implementation of crypto algorithms, secure communication protocols." },
  "02234": { name: "Research Topics in Cybersecurity", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], slot: 'E7', desc: "Keeps you current on emerging threats and OT/ICS security." },
  "02242": { name: "Program Analysis", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["safe", "software"], slot: 'E1A', desc: "Static analysis, dataflow, type systems, software reliability." },
  "02244": { name: "Logic for Security", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["safe"], slot: 'F4B', desc: "Mathematical logic, formal models of security protocols." },
  "02245": { name: "Program Verification", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["safe", "software"], slot: 'E1B', desc: "Formal verification tools, Hoare logic, proving program correctness." },
  "02246": { name: "Model Checking", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["safe"], slot: 'E2A', desc: "Automated verification of finite-state concurrent systems." },
  "02247": { name: "Compiler Construction", ects: 5, sem: ["Spring"], cat: "prog", specs: ["safe"], slot: 'F5A', desc: "Parsing, lexing, semantic analysis, compiler design." },
  "02249": { name: "Computationally Hard Problems", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["ai", "embedded"], slot: 'E2B', desc: "NP-completeness, approximation algorithms, exact algorithms." },
  "02256": { name: "Automated Reasoning", ects: 5, sem: ["Spring"], cat: "prog", specs: ["ai", "safe"], slot: 'F5B', desc: "Theorem proving, SAT/SMT solvers, logical frameworks." },
  "02258": { name: "Parallel Computer Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], slot: 'E3A', desc: "Concurrent programming, parallel architectures, performance models." },
  "02262": { name: "Formal Aspects of Process Science", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["safe", "software"], slot: 'E4A', desc: "Concurrency theory, Petri nets, process algebra." },
  "02267": { name: "Software Development of Web Services", ects: 5, sem: ["January"], cat: "prog", specs: ["software"], slot: 'Jan', desc: "Cloud/API layer and IoT cloud connectivity." },
  "02268": { name: "Process-Oriented and Event-Driven Software Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["software"], slot: 'E4B', desc: "Industrial automation and IoT event pipelines." },
  "02269": { name: "Process Mining", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["software"], slot: 'E5A', desc: "Discovering, monitoring, and improving processes from event logs." },
  "02270": { name: "Cybersecurity Fundamentals", ects: 5, sem: ["Autumn"], cat: "core", specs: ["cyber", "software"], slot: 'E5B', desc: "Network security, threat modeling, secure systems design." },
  "02271": { name: "Advanced Cybersecurity", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: 'F7', desc: "Advanced threat defense, secure architecture design." },
  "02275": { name: "Ethical Hacking", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], slot: 'E7', desc: "Penetration testing, vulnerability assessment, exploitation." },
  "02276": { name: "Usable Security and Privacy", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: 'F1A', desc: "Human factors in security, interface design for security." },
  "02277": { name: "Cyber Risk Management and Incident Response", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: 'F1B', desc: "NIS2 compliance, risk frameworks, incident handling." },
  "02278": { name: "Post-Quantum Cryptography", ects: 5, sem: ["June"], cat: "prog", specs: ["cyber"], slot: 'Jun', desc: "Forward bet on quantum-resistant cryptographic algorithms." },
  "02280": { name: "Artificial Intelligence and Multi-Agent Systems", ects: 10, sem: ["Spring"], cat: "prog", specs: ["ai"], slot: 'F2A', desc: "Robotics and autonomous agent decision-making models." },
  "02282": { name: "Algorithms for Massive Data Sets", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["ai"], slot: 'F2B', programs: ["hcai"], desc: "Streaming algorithms, hashing, handling giant data collections." },
  "02287": { name: "Logical Theories for Uncertainty and Learning", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: 'E1A', desc: "Probabilistic logic and foundations of machine learning." },
  "02289": { name: "Algorithmic Techniques for Modern Data Models", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: 'E1B', programs: ["hcai"], desc: "Advanced graph algorithms, data structures, metric spaces." },
  "02291": { name: "System Integration", ects: 5, sem: ["Spring"], cat: "core", specs: ["ai", "cyber", "digital", "embedded", "safe", "software"], slot: 'F3A', programs: ["autonomous"], desc: "Heterogeneous systems, APIs, middleware, SOA." },
  "02417": { name: "Time Series Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["hcai"], desc: "Statistical modeling of sequential data, forecasting, ARIMA, state-space models." },
  "02452": { name: "Machine Learning", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: 'E2A', programs: ["hcai","autonomous"], desc: "Supervised/unsupervised learning, neural networks, model selection, evaluation." },
  "02456": { name: "Deep Learning", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: 'E2B', programs: ["hcai","autonomous"], desc: "CNNs, RNNs, transformers, generative models, practical deep learning." },
  "02471": { name: "Machine Learning for Signal Processing", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: 'E3A', programs: ["hcai","autonomous"], desc: "Advanced understanding of machine learning techniques applied to signal processing." },
  "02476": { name: "MLOps", ects: 5, sem: ["January"], cat: "elective", specs: ["ai"], slot: 'Jan', programs: ["hcai","autonomous"], desc: "ML deployment pipelines, monitoring, CI/CD for ML, containerization." },
  "02517": { name: "Responsible AI", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: 'E4A', programs: ["hcai"], desc: "Fairness, accountability, transparency, ethics in AI systems." },
  "02807": { name: "Computational Tools for Data Science", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: 'E4B', programs: ["hcai"], desc: "Python data stack, visualization, big-data tools, reproducible workflows." }
,
  "30554": { name: "Global Navigation Satellite Systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34241": { name: "Digital video technology", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34366": { name: "Intelligent systems", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E7', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34367": { name: "Project in Intelligent Systems", ects: 5, sem: ["January"], cat: "elective", specs: [], slot: 'Jan', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34745": { name: "Linear control design 2", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E3', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34746": { name: "Robust and fault-tolerant control", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: 'F1', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34752": { name: "Bio-inspired control for robots", ects: 5, sem: ["August"], cat: "elective", specs: [], slot: 'Aug', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34753": { name: "Robotics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E4A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34755": { name: "Building dependable robot systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F3B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34757": { name: "Unmanned autonomous systems", ects: 5, sem: ["June"], cat: "elective", specs: [], slot: 'Jun', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34759": { name: "Perception for Autonomous Systems", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E1', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34760": { name: "Safety and Reliability in Robotic and Automation Systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34761": { name: "Robot Autonomy", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34763": { name: "Autonomous Marine Robotics", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "34764": { name: "Robotics and Automation in Pharmaceutical Manufacturing", ects: 5, sem: ["January"], cat: "elective", specs: [], slot: 'Jan', programs: ["autonomous"], desc: "Added from autonomous program." },
  "38110": { name: "Staging co-creation and creativity", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E1B', programs: ["hcai"], desc: "Added from hcai program." },
  "42136": { name: "Large Scale Optimization using Decomposition", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "42137": { name: "Optimization using metaheuristics", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "42186": { name: "Model-based machine learning", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "02810": { name: "UX Design Prototyping", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E1A', programs: ["hcai"], desc: "Added from hcai program." },
  "02504": { name: "Computer Vision", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F3B', programs: ["hcai"], desc: "Added from hcai program." },
  "02561": { name: "Computer Graphics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5A', programs: ["hcai"], desc: "Added from hcai program." },
  "02582": { name: "Computational Data Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2B', programs: ["hcai"], desc: "Added from hcai program." },
  "02805": { name: "Social graphs and interactions", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5', programs: ["hcai"], desc: "Added from hcai program." },
  "02806": { name: "Social data analysis and visualization", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F3A', programs: ["hcai"], desc: "Added from hcai program." },
  "02180": { name: "Introduction to Artificial Intelligence", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F3A', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02285": { name: "Artificial Intelligence and Multi-Agent Systems", ects: 7.5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02409": { name: "Multivariate Statistics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E1A', programs: ["hcai"], desc: "Added from hcai program." },
  "02443": { name: "Stochastic Simulation", ects: 5, sem: ["June"], cat: "elective", specs: [], slot: 'Jun', programs: ["hcai"], desc: "Added from hcai program." },
  "02455": { name: "Experiment in Cognitive Science", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5B', programs: ["hcai"], desc: "Added from hcai program." },
  "02458": { name: "Cognitive Modelling", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E2B', programs: ["hcai"], desc: "Added from hcai program." },
  "02460": { name: "Advanced Machine Learning", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F1B', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02477": { name: "Bayesian machine learning", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2A', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02501": { name: "Advanced Deep Learning in Computer Vision", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02506": { name: "Advanced Image Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["hcai"], desc: "Added from hcai program." },
  "02516": { name: "Introduction to Deep Learning in Computer Vision", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5B', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02562": { name: "Rendering - Introduction", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5B', programs: ["hcai"], desc: "Added from hcai program." },
  "02563": { name: "Generative Methods for Computer Graphics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5B', programs: ["hcai"], desc: "Added from hcai program." },
  "02566": { name: "Creating Digital Visual Experiences", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: 'F2A', programs: ["hcai"], desc: "Added from hcai program." },
  "02581": { name: "Geometric Data Analysis and Processing", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E1B', programs: ["hcai"], desc: "Added from hcai program." },
  "02613": { name: "Python and High-Performance Computing", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5A', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02614": { name: "High-Performance Computing", ects: 5, sem: ["January"], cat: "elective", specs: [], slot: 'Jan', programs: ["hcai","autonomous"], desc: "Added from hcai and autonomous program." },
  "02808": { name: "Personal Data Interaction for Mobile and Wearables", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5', programs: ["hcai"], desc: "Added from hcai program." },
  "02830": { name: "Advanced Project in Digital Media Engineering", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E5B', programs: ["hcai"], desc: "Added from hcai program." },
  "02840": { name: "Computer Game Programming Fundamentals (DADIU)", ects: 15, sem: ["Autumn"], cat: "elective", specs: [], slot: 'Autumn', programs: ["hcai"], desc: "Added from hcai program." },
  "02841": { name: "Computer Game Programming in a Production (DADIU)", ects: 15, sem: ["Autumn"], cat: "elective", specs: [], slot: 'Autumn', programs: ["hcai"], desc: "Added from hcai program." },
  "02510": { name: "Deep learning and data engineering for image analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "02518": { name: "Computational 3D Imaging and Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "02611": { name: "Optimization for Data Science", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F5B', programs: ["autonomous"], desc: "Added from autonomous program." },
  "02612": { name: "Constrained Optimization", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: 'F4A', programs: ["autonomous"], desc: "Added from autonomous program." },
  "02619": { name: "Model Predictive Control", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: 'E2B', programs: ["autonomous"], desc: "Added from autonomous program." }
};

export const EMBEDDED_COURSES = ['02203', '02211', '02214', '02225', '02226', '02249', '02258', '02291'];
export const CYBER_COURSES = ['02231', '02232', '02234', '02270', '02271', '02275', '02276', '02277', '02278', '02291'];

export const getCategoryClass = (cat) => {
  switch (cat) {
    case 'mandatory': return 'cat-mandatory';
    case 'core': return 'cat-core';
    case 'prog': return 'cat-prog';
    case 'innov':
    case 'innov2': return 'cat-innov';
    case 'elective': return 'cat-elective';
    case 'thesis': return 'cat-thesis';
    default: return 'cat-elective';
  }
};

export const getCategoryLabel = (cat) => {
  switch (cat) {
    case 'mandatory': return 'Mandatory foundation';
    case 'core': return 'Core competence';
    case 'prog': return 'Programme-specific';
    case 'innov':
    case 'innov2': return 'Innovation II';
    case 'elective': return 'Free elective';
    case 'thesis': return 'Thesis';
    default: return 'Free elective';
  }
};

export const getTimingLabel = (timingStr) => {
  if (!timingStr) return 'varies';
  if (timingStr.includes('Autumn') || timingStr.includes('autumn')) return 'E — Autumn';
  if (timingStr.includes('Spring') || timingStr.includes('spring')) return 'F — Spring';
  if (timingStr.includes('January') || timingStr.includes('january')) return 'January';
  if (timingStr.includes('June') || timingStr.includes('june')) return 'June';
  if (timingStr.includes('August') || timingStr.includes('august')) return 'August';
  return 'varies';
};

export const getTimingClass = (timingStr) => {
  if (!timingStr) return 'timing-both';
  if (timingStr.includes('Autumn') || timingStr.includes('August') || timingStr.includes('autumn') || timingStr.includes('august')) return 'timing-autumn';
  if (timingStr.includes('Spring') || timingStr.includes('June') || timingStr.includes('spring') || timingStr.includes('june')) return 'timing-spring';
  if (timingStr.includes('January') || timingStr.includes('january')) return 'timing-jan';
  return 'timing-both';
};

// ---------- NEW RECOMMENDED PLAN DATA (Cybersecurity + AI/Data) ----------

// Courses that count toward the Cybersecurity specialization (must = 25 ECTS)
export const CYBER_SPEC_COURSES = ['02231', '02232', '02270', '02277', '02291'];

// Courses that count toward Programme-specific (must = 50 ECTS)
export const PS_COURSES = ['38113', '02270', '02231', '02289', '02267', '02280', '02291', '02277', '02232'];

// The full recommended plan — each semester with all course details
export const PLAN_SEMESTERS = [
  {
    id: 'sem1',
    title: 'Semester 1 — Autumn Y1',
    period: 'September – December',
    year: 1,
    targetEcts: 25,
    note: '5 courses — build the security + algorithms foundation',
    courses: [
      { code: '38113', name: 'Applied AI for Entrepreneurs', ects: 5, slot: 'E2B', exam: 'Oral + assignments', role: 'Innovation II', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: true },
      { code: '02270', name: 'Cybersecurity Fundamentals', ects: 5, slot: 'E5B', exam: 'Written 2 h', role: 'Core Competence #1', status: 'LOCKED', grading: '7-point', cyberSpec: true, ps: true },
      { code: '02231', name: 'Cryptography Fundamentals', ects: 5, slot: 'E1A', exam: 'Written + exercises', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: true, ps: true },
      { code: '02289', name: 'Algorithmic Techniques for Modern Data', ects: 5, slot: 'E4B', exam: 'Oral', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: true },
      { code: '12105', name: 'Quant. Methods to Assess Sustainability', ects: 5, slot: 'E7', exam: 'Written + reports 2 h', role: 'Foundation', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: false }
    ]
  },
  {
    id: 'jan1',
    title: 'January Y1',
    period: '3-week block',
    year: 1,
    targetEcts: 5,
    mini: true,
    note: 'Intensive project-based block',
    courses: [
      { code: '02267', name: 'Software Development of Web Services', ects: 5, slot: 'Jan', exam: 'Project + report', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: true }
    ]
  },
  {
    id: 'sem2',
    title: 'Semester 2 — Spring Y1',
    period: 'February – May',
    year: 1,
    targetEcts: 25,
    note: 'AI depth + system integration + cyber risk',
    courses: [
      { code: '02280', name: 'AI & Multi-Agent Systems', ects: 10, slot: 'F4A', exam: 'Project (group programming)', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: true },
      { code: '02291', name: 'System Integration', ects: 5, slot: 'F5A', exam: 'Written 4 h + project', role: 'Core Competence #2', status: 'LOCKED', grading: '7-point', cyberSpec: true, ps: true },
      { code: '02417', name: 'Time Series Analysis', ects: 5, slot: 'F4B', exam: 'Report', role: 'Elective', status: 'FLEX', grading: '7-point', cyberSpec: false, ps: false, flexId: 'sem2_flex' },
      { code: '02277', name: 'Cyber Risk Management & Incident Response', ects: 5, slot: 'F3B', exam: 'Report', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: true, ps: true }
    ]
  },
  {
    id: 'jun1',
    title: 'June Y1',
    period: '3-week block',
    year: 1,
    targetEcts: 5,
    mini: true,
    note: 'Foundation course (Pass/Fail)',
    courses: [
      { code: '42501', name: 'Innovation in Engineering', ects: 5, slot: 'Jun', exam: 'Report', role: 'Foundation', status: 'LOCKED', grading: 'P/F', cyberSpec: false, ps: false }
    ]
  },
  {
    id: 'summer',
    title: 'Summer Y1',
    period: 'July – August',
    year: 1,
    targetEcts: 0,
    break: true,
    note: 'FREE for internship / student job — this is your thesis audition',
    courses: []
  },
  {
    id: 'sem3',
    title: 'Semester 3 — Autumn Y2',
    period: 'September – December',
    year: 2,
    targetEcts: 25,
    note: 'Core AI semester (ML / DL / Responsible AI) + applied crypto',
    courses: [
      { code: '02452', name: 'Machine Learning', ects: 5, slot: 'E4A', exam: 'Written 4 h + exercises', role: 'Elective', status: 'KEEP', grading: '7-point', cyberSpec: false, ps: false },
      { code: '02456', name: 'Deep Learning', ects: 5, slot: 'E2A', exam: 'Written 2 h + reports', role: 'Elective', status: 'KEEP', grading: '7-point', cyberSpec: false, ps: false },
      { code: '02232', name: 'Applied Cryptography', ects: 5, slot: 'E1B', exam: 'Oral + project', role: 'Programme-specific', status: 'LOCKED', grading: '7-point', cyberSpec: true, ps: true },
      { code: '02517', name: 'Responsible AI', ects: 5, slot: 'E2B', exam: 'Written 3 h + reports', role: 'Elective', status: 'FLEX', grading: '7-point', cyberSpec: false, ps: false, flexId: 'sem3_flex1' },
      { code: '02807', name: 'Computational Tools for Data Science', ects: 5, slot: 'E7', exam: 'Report + experiments', role: 'Elective', status: 'FLEX', grading: '7-point', cyberSpec: false, ps: false, flexId: 'sem3_flex2' }
    ]
  },
  {
    id: 'jan2',
    title: 'January Y2',
    period: '3-week block',
    year: 2,
    targetEcts: 5,
    mini: true,
    note: 'Deploy your thesis model',
    courses: [
      { code: '02476', name: 'MLOps', ects: 5, slot: 'Jan', exam: 'Project', role: 'Elective (after DL)', status: 'KEEP', grading: 'P/F', cyberSpec: false, ps: false }
    ]
  },
  {
    id: 'sem4',
    title: 'Semester 4 — Spring Y2',
    period: 'February – June',
    year: 2,
    targetEcts: 30,
    thesis: true,
    note: 'Industry-partnered thesis — your single most important career asset',
    courses: [
      { code: 'thesis', name: "Master's Thesis", ects: 30, slot: '—', exam: 'Thesis + oral defense', role: 'Thesis', status: 'LOCKED', grading: '7-point', cyberSpec: false, ps: false }
    ]
  }
];

// Dropdown alternatives for FLEX slots (avoid E4A where ML lives)
export const FLEX_ALTERNATIVES = {
  sem2_flex: {
    label: 'Spring Elective',
    semester: 'Spring',
    options: [
      { code: '02417', name: 'Time Series Analysis', ects: 5, slot: 'F4B', exam: 'Report', grading: '7-point' },
      { code: '02271', name: 'Advanced Cybersecurity', ects: 5, slot: 'F1A', exam: 'Written 4 h', grading: '7-point' },
      { code: '02276', name: 'Usable Security and Privacy', ects: 5, slot: 'F2B', exam: 'Oral', grading: '7-point' },
      { code: '02256', name: 'Automated Reasoning', ects: 5, slot: 'F3A', exam: 'Project + report', grading: '7-point' }
    ]
  },
  sem3_flex1: {
    label: 'Autumn Elective (avoid E4A)',
    semester: 'Autumn',
    options: [
      { code: '02517', name: 'Responsible AI', ects: 5, slot: 'E2B', exam: 'Written 3 h + reports', grading: '7-point' },
      { code: '02275', name: 'Ethical Hacking', ects: 5, slot: 'E1B', exam: 'Written 2 h', grading: '7-point' },
      { code: '02234', name: 'Research Topics in Cybersecurity', ects: 5, slot: 'E5A', exam: 'Report', grading: '7-point' },
      { code: '02287', name: 'Logical Theories for Uncertainty', ects: 5, slot: 'E3B', exam: 'Oral', grading: '7-point' }
    ]
  },
  sem3_flex2: {
    label: 'Autumn Elective (avoid E4A)',
    semester: 'Autumn',
    options: [
      { code: '02807', name: 'Computational Tools for Data Science', ects: 5, slot: 'E7', exam: 'Report + experiments', grading: '7-point' },
      { code: '02269', name: 'Process Mining', ects: 5, slot: 'E4A', exam: 'Project', grading: '7-point' },
      { code: '02471', name: 'ML for Signal Processing', ects: 5, slot: 'E2A', exam: 'Written 4 h', grading: '7-point' },
      { code: '02268', name: 'Process-Oriented & Event-Driven Systems', ects: 5, slot: 'E1A', exam: 'Oral', grading: '7-point' }
    ]
  }
};

// Prerequisite chains (order-locked)
export const PREREQ_CHAINS = [
  { from: '02231', to: '02232', label: 'Crypto Fundamentals → Applied Crypto' },
  { from: '02270', to: '02277', label: 'Cyber Fundamentals → Cyber Risk Mgmt' },
  { from: '02456', to: '02476', label: 'Deep Learning → MLOps' },
  { from: '02452', to: '02517', label: 'ML/DL → Responsible AI', note: 'concurrent OK in practice' }
];

// Career roadmap phases
export const CAREER_ROADMAP = [
  {
    phase: 'Now → First Weeks',
    items: [
      'English 1-page CV (lead with your AI/data internship)',
      'LinkedIn + GitHub profiles polished',
      '~15 target companies shortlisted',
      'One finished, deployed ML project',
      'Start Danish A1'
    ]
  },
  {
    phase: 'Sem 1 (Autumn Y1)',
    items: [
      'DTU autumn career fair — make contacts',
      'Apply for part-time studiejob (10–15 h/wk)',
      'Summer internship listings start opening'
    ]
  },
  {
    phase: 'Jan + Sem 2 (Y1)',
    items: [
      'Jan–Mar = internship deadline season, apply broadly',
      'Portfolio from 02280 + System Integration',
      'Goal: secure internship by April'
    ]
  },
  {
    phase: 'Summer Y1 (PIVOT)',
    items: [
      'Internship = thesis audition',
      'Float a thesis collaboration before you leave',
      'Build company relationships for Year 2'
    ]
  },
  {
    phase: 'Sem 3 (Autumn Y2)',
    items: [
      'Core AI semester — ML / DL / Responsible AI',
      'Lock thesis by Nov–Dec (project + company + DTU supervisor)',
      'Build capstone project for portfolio'
    ]
  },
  {
    phase: 'Jan + Sem 4 (Y2)',
    items: [
      'MLOps → deploy your thesis model',
      'Thesis at the company',
      'Apply for grad roles Feb–Apr — thesis company is target #1'
    ]
  }
];

// Four parallel career threads
export const CAREER_THREADS = [
  { name: 'Portfolio', desc: '2 finished projects, 1 = thesis' },
  { name: 'Network', desc: 'Fairs, studiejob, LinkedIn, supervisors' },
  { name: 'Internship → Thesis → Job', desc: 'The spine — each step a referral into the next' },
  { name: 'Danish', desc: 'Conversational by Year 2' }
];

// Confirm before registration checklist
export const CONFIRM_ITEMS = [
  { id: 'prereq-bsc', text: 'BSc prereqs from your degree: 02110 (→02289), 02141/02161/02170 (→02291), intro programming (02270, 02267), 02402 statistics (→02417)' },
  { id: 'confirm-02280', text: '02280 runs at 10 ECTS (replaces terminated 7.5-ECTS 02285) — confirm slot' },
  { id: 'confirm-02517', text: '02517 prereq is recommended, not hard-gated — if blocked, swap a FLEX slot' },
  { id: 'verify-exams', text: 'Verify all exam formats / ECTS on kurser.dtu.dk before registration' }
];
