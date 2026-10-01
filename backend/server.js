import express from 'express'; // reload server
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json({ limit: '50kb' })); // Limit body size

// Rate limiting: max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Chatbot will run in mock mode.");
}

// Course Catalog database (exact replica from dtu_study_plan.html for context engineering)
const COURSE_CATALOG = {
  "02180": { name: "Introduction to Artificial Intelligence", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F3A", exam: "Written 4h", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02201": { name: "Agile Hardware Design", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: "E4A", exam: "Project + report", desc: "Modern agile workflows for digital systems, rapid prototyping." },
  "02203": { name: "Design of Digital Systems", ects: 5, sem: ["Autumn"], cat: "core", specs: ["digital", "embedded"], slot: "E2B", exam: "Oral", desc: "FPGA hardware design, CAD tools, digital circuit implementation." },
  "02205": { name: "VLSI Design", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital"], slot: "F3A", exam: "Oral", desc: "Very Large Scale Integration, CMOS technology, transistor-level layout." },
  "02207": { name: "Verification of Digital Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: "E1A", exam: "Oral", desc: "Formal verification, model checking, assertion-based testing." },
  "02209": { name: "Test of Digital Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], slot: "E1B", exam: "Oral", desc: "Fault modeling, automatic test pattern generation, design-for-testability." },
  "02211": { name: "Research Topics in Computer Architecture", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital", "embedded"], slot: "F4A", exam: "Oral", desc: "Advanced processor design, memory hierarchies, research directions." },
  "02214": { name: "Hardware/Software Codesign", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital", "embedded"], slot: "F1B", exam: "Oral", desc: "FPGA-software interfaces, firmware-hardware boundary, co-simulation." },
  "02225": { name: "Distributed Real-Time Systems", ects: 5, sem: ["Spring"], cat: "core", specs: ["digital", "embedded"], slot: "F4B", exam: "Written 4h", programs: ["autonomous"], desc: "Real-time scheduling, fault tolerance, distributed protocols." },
  "02226": { name: "Networked Embedded Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], slot: "E1B", exam: "Oral", desc: "Communication protocols, IoT architectures, real-world embedded labs." },
  "02231": { name: "Cryptography Fundamentals", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber", "safe"], slot: "E1A", exam: "Written 2h", desc: "Symmetric/asymmetric crypto, protocols, mathematical foundations." },
  "02232": { name: "Applied Cryptography", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber", "safe"], slot: "F1B", exam: "Written 4h", desc: "Implementation of crypto algorithms, secure communication protocols." },
  "02234": { name: "Research Topics in Cybersecurity", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], slot: "E4A", exam: "Report", desc: "Keeps you current on emerging threats and OT/ICS security." },
  "02242": { name: "Program Analysis", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["safe", "software"], slot: "E2A", exam: "Oral", desc: "Static analysis, dataflow, type systems, software reliability." },
  "02244": { name: "Logic for Security", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["safe"], slot: "F2A", exam: "Oral", desc: "Mathematical logic, formal models of security protocols." },
  "02245": { name: "Program Verification", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["safe", "software"], slot: "E1B", exam: "Oral", desc: "Formal verification tools, Hoare logic, proving program correctness." },
  "02246": { name: "Model Checking", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["safe"], slot: "E4B", exam: "Oral", desc: "Automated verification of finite-state concurrent systems." },
  "02247": { name: "Compiler Construction", ects: 5, sem: ["Spring"], cat: "prog", specs: ["safe"], slot: "F2B", exam: "Oral", desc: "Parsing, lexing, semantic analysis, compiler design." },
  "02249": { name: "Computationally Hard Problems", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["ai", "embedded"], slot: "E3A", exam: "Oral", desc: "NP-completeness, approximation algorithms, exact algorithms." },
  "02256": { name: "Automated Reasoning", ects: 5, sem: ["Spring"], cat: "prog", specs: ["ai", "safe"], slot: "F5B", exam: "Oral", desc: "Theorem proving, SAT/SMT solvers, logical frameworks." },
  "02258": { name: "Parallel Computer Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], slot: "E5A", exam: "Written 2h", desc: "Concurrent programming, parallel architectures, performance models." },
  "02262": { name: "Formal Aspects of Process Science", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["safe", "software"], slot: "E1A", exam: "Oral", desc: "Concurrency theory, Petri nets, process algebra." },
  "02266": { name: "User Experience Engineering", ects: 5, sem: ["January"], cat: "innov2", specs: ["software"], slot: "Jan", exam: "Project + report", programs: ["hcai"], desc: "UI/UX methods, user research, prototyping, usability testing." },
  "02267": { name: "Software Development of Web Services", ects: 5, sem: ["January"], cat: "prog", specs: ["software"], slot: "Jan", exam: "Project + report", desc: "Cloud/API layer and IoT cloud connectivity." },
  "02268": { name: "Process-Oriented and Event-Driven Software Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["software"], slot: "E4A", exam: "Oral + reports", desc: "Industrial automation and IoT event pipelines." },
  "02269": { name: "Process Mining", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["software"], slot: "E5A", exam: "Written 1h + reports", desc: "Discovering, monitoring, and improving processes from event logs." },
  "02270": { name: "Cybersecurity Fundamentals", ects: 5, sem: ["Autumn"], cat: "core", specs: ["cyber", "software"], slot: "E5B", exam: "Written 2h", desc: "Network security, threat modeling, secure systems design." },
  "02271": { name: "Advanced Cybersecurity", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: "F4A", exam: "Oral + project", desc: "Advanced threat defense, secure architecture design." },
  "02275": { name: "Ethical Hacking", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], slot: "E5B", exam: "Written 2h", desc: "Penetration testing, vulnerability assessment, exploitation." },
  "02276": { name: "Usable Security and Privacy", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: "F5B", exam: "Project + report", desc: "Human factors in security, interface design for security." },
  "02277": { name: "Cyber Risk Management and Incident Response", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], slot: "F3B", exam: "Written 2h", desc: "NIS2 compliance, risk frameworks, incident handling." },
  "02278": { name: "Post-Quantum Cryptography", ects: 5, sem: ["June"], cat: "prog", specs: ["cyber"], slot: "Jun", exam: "Oral", desc: "Forward bet on quantum-resistant cryptographic algorithms." },
  "02280": { name: "Artificial Intelligence and Multi-Agent Systems", ects: 10, sem: ["Spring"], cat: "prog", specs: ["ai"], slot: "F4A", exam: "Project (group)", desc: "Robotics and autonomous agent decision-making models." },
  "02282": { name: "Algorithms for Massive Data Sets", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["ai"], slot: "F1A", exam: "Oral", programs: ["hcai"], desc: "Streaming algorithms, hashing, handling giant data collections." },
  "02287": { name: "Logical Theories for Uncertainty and Learning", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: "E2B", exam: "Oral", desc: "Probabilistic logic and foundations of machine learning." },
  "02289": { name: "Algorithmic Techniques for Modern Data Models", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: "E4B", exam: "Oral", programs: ["hcai"], desc: "Advanced graph algorithms, data structures, metric spaces." },
  "02291": { name: "System Integration", ects: 5, sem: ["Spring"], cat: "core", specs: ["ai", "cyber", "digital", "embedded", "safe", "software"], slot: "F5A", exam: "Written 4h + project", programs: ["autonomous"], desc: "Heterogeneous systems, APIs, middleware, SOA." },
  "02409": { name: "Multivariate Statistics", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E1A", exam: "Written 4h", programs: ["hcai"], desc: "Added from hcai program." },
  "02417": { name: "Time Series Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F4B", exam: "Written 4h", programs: ["hcai"], desc: "Statistical modeling of sequential data, forecasting, ARIMA, state-space models." },
  "02443": { name: "Stochastic Simulation", ects: 5, sem: ["June"], cat: "elective", specs: [], slot: "Jun", exam: "Project + report", programs: ["hcai"], desc: "Added from hcai program." },
  "02452": { name: "Machine Learning", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E4A", exam: "Written 4h (MCQ)", programs: ["hcai", "autonomous"], desc: "Supervised/unsupervised learning, neural networks, model selection, evaluation." },
  "02455": { name: "Experiment in Cognitive Science", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E5B", exam: "Report", programs: ["hcai"], desc: "Added from hcai program." },
  "02456": { name: "Deep Learning", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E2A", exam: "Project + report", programs: ["hcai", "autonomous"], desc: "CNNs, RNNs, transformers, generative models, practical deep learning." },
  "02458": { name: "Cognitive Modelling", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E2B", exam: "Report", programs: ["hcai"], desc: "Added from hcai program." },
  "02460": { name: "Advanced Machine Learning", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F1B", exam: "Project + report", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02471": { name: "Machine Learning for Signal Processing", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], slot: "E1B", exam: "Oral + project", programs: ["hcai", "autonomous"], desc: "Advanced understanding of machine learning techniques applied to signal processing." },
  "02476": { name: "MLOps", ects: 5, sem: ["January"], cat: "elective", specs: ["ai"], slot: "Jan", exam: "Project", programs: ["hcai", "autonomous"], desc: "ML deployment pipelines, monitoring, CI/CD for ML, containerization." },
  "02477": { name: "Bayesian machine learning", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F2A", exam: "Written 4h", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02501": { name: "Advanced Deep Learning in Computer Vision", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F4A", exam: "Project + report", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02504": { name: "Computer Vision", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F3B", exam: "Written 4h", programs: ["hcai"], desc: "Added from hcai program." },
  "02506": { name: "Advanced Image Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F5B", exam: "Oral", programs: ["hcai"], desc: "Added from hcai program." },
  "02510": { name: "Deep learning and data engineering for image analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F5A", exam: "Project + report", programs: ["autonomous"], desc: "Added from autonomous program." },
  "02516": { name: "Introduction to Deep Learning in Computer Vision", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E5B", exam: "Written 4h", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02517": { name: "Responsible AI", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E2B", exam: "Report", programs: ["hcai"], desc: "Fairness, accountability, transparency, ethics in AI systems." },
  "02518": { name: "Computational 3D Imaging and Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F5B", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "02561": { name: "Computer Graphics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E5A", exam: "Oral", programs: ["hcai"], desc: "Added from hcai program." },
  "02562": { name: "Rendering - Introduction", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E5B", exam: "Project + report", programs: ["hcai"], desc: "Added from hcai program." },
  "02563": { name: "Generative Methods for Computer Graphics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E5B", exam: "Project + report", programs: ["hcai"], desc: "Added from hcai program." },
  "02566": { name: "Creating Digital Visual Experiences", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: "F2A", exam: "Project", programs: ["hcai"], desc: "Added from hcai program." },
  "02581": { name: "Geometric Data Analysis and Processing", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E1B", exam: "Oral", programs: ["hcai"], desc: "Added from hcai program." },
  "02582": { name: "Computational Data Analysis", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F2B", exam: "Written / Report", programs: ["hcai"], desc: "Added from hcai program." },
  "02611": { name: "Optimization for Data Science", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F5B", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "02612": { name: "Constrained Optimization", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F4A", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "02613": { name: "Python and High-Performance Computing", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai", "embedded"], slot: "F5A", exam: "Project", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02614": { name: "High-Performance Computing", ects: 5, sem: ["January"], cat: "elective", specs: ["embedded"], slot: "Jan", exam: "Project", programs: ["hcai", "autonomous"], desc: "Added from hcai and autonomous program." },
  "02619": { name: "Model Predictive Control", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["embedded"], slot: "E2B", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "02805": { name: "Social graphs and interactions", ects: 10, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E5", exam: "Project", programs: ["hcai"], desc: "Added from hcai program." },
  "02806": { name: "Social data analysis and visualization", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F3A", exam: "Project + peer review", programs: ["hcai"], desc: "Added from hcai program." },
  "02807": { name: "Computational Tools for Data Science", ects: 5, sem: ["Autumn"], cat: "elective", specs: ["ai"], slot: "E7", exam: "Report + experiments", programs: ["hcai"], desc: "Python data stack, visualization, big-data tools, reproducible workflows." },
  "02808": { name: "Personal Data Interaction for Mobile and Wearables", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: "F5", exam: "Project", programs: ["hcai"], desc: "Added from hcai program." },
  "02810": { name: "UX Design Prototyping", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], slot: "E1A", exam: "Project", programs: ["hcai"], desc: "Added from hcai program." },
  "02830": { name: "Advanced Project in Digital Media Engineering", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: "E5B", exam: "Project + report", programs: ["hcai"], desc: "Added from hcai program." },
  "02840": { name: "Computer Game Programming Fundamentals (DADIU)", ects: 15, sem: ["Autumn"], cat: "prog", specs: [], slot: "Autumn", exam: "Project evaluation", programs: ["hcai"], desc: "This course is the first part of the DADIU programme. Students who sign up for this course must be accepted for the DADIU programme and must also sign up for 02841. Covers all time slots in the first half of the autumn 13-week period." },
  "02841": { name: "Computer Game Programming in a Production (DADIU)", ects: 15, sem: ["Autumn"], cat: "prog", specs: [], slot: "Autumn", exam: "Project evaluation", programs: ["hcai"], desc: "This course covers all time slots in the second half of the autumn 13-week period." },
  "12100": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], slot: "F7", exam: "Written 2h + reports", programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "12101": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], slot: "F3B", exam: "Written 2h + reports", programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "12105": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], slot: "E7", exam: "Written 2h + reports", programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification (Evening slot)." },
  "12106": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], slot: "E3B", exam: "Written 2h + reports", programs: ["hcai"], desc: "Life-cycle assessment, environmental impact quantification." },
  "30554": { name: "Global Navigation Satellite Systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F2B", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34241": { name: "Digital video technology", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F4A", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34366": { name: "Intelligent systems", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E7", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34367": { name: "Project in Intelligent Systems", ects: 5, sem: ["January"], cat: "elective", specs: [], slot: "Jan", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34745": { name: "Linear control design 2", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: "E3", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34746": { name: "Robust and fault-tolerant control", ects: 10, sem: ["Spring"], cat: "elective", specs: [], slot: "F1", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34752": { name: "Bio-inspired control for robots", ects: 5, sem: ["August"], cat: "elective", specs: [], slot: "Aug", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34753": { name: "Robotics", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E4A", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34755": { name: "Building dependable robot systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F3B", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34757": { name: "Unmanned autonomous systems", ects: 5, sem: ["June"], cat: "elective", specs: [], slot: "Jun", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34759": { name: "Perception for Autonomous Systems", ects: 10, sem: ["Autumn"], cat: "elective", specs: [], slot: "E1", exam: "Oral + project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34760": { name: "Safety and Reliability in Robotic and Automation Systems", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F5B", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34761": { name: "Robot Autonomy", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F4A", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34763": { name: "Autonomous Marine Robotics", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F5B", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34764": { name: "Robotics and Automation in Pharmaceutical Manufacturing", ects: 5, sem: ["January"], cat: "elective", specs: [], slot: "Jan", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "34766": { name: "Robotic Manipulation: Perception, Planning, Control and Learning", ects: 5, sem: ["Spring"], cat: "elective", specs: [], slot: "F2A", exam: "Project", programs: ["autonomous"], desc: "Added from autonomous program." },
  "38102": { name: "Technology Entrepreneurship", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], slot: "E1B", exam: "Report + oral", programs: ["hcai", "autonomous"], desc: "Business modeling, startup creation, commercialization strategies." },
  "38103": { name: "X-Tech Entrepreneurship", ects: 10, sem: ["Spring"], cat: "innov2", specs: [], slot: "F3", exam: "Pitch + report", programs: ["hcai"], desc: "Project incubator connecting researchers and students to build startups." },
  "38106": { name: "Developing an Entrepreneurial Mindset", ects: 5, sem: ["Spring", "Autumn"], cat: "innov2", specs: [], slot: "E1B/F1B", exam: "Report", programs: ["autonomous"], desc: "Creativity, mindset building, startup exploration." },
  "38110": { name: "Staging co-creation and creativity", ects: 5, sem: ["Autumn"], cat: "elective", specs: [], slot: "E1B", exam: "Project", programs: ["hcai"], desc: "Added from hcai program." },
  "38113": { name: "Applied AI for Entrepreneurs", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], slot: "E2B", exam: "Oral + assignments", programs: ["autonomous"], desc: "Leveraging AI/ML systems to build new commercial platforms." },
  "38400": { name: "Innovation in Engineering", ects: 5, sem: ["January"], cat: "mandatory", specs: [], slot: "Jan", exam: "Report", programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "38401": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["January"], cat: "mandatory", specs: [], slot: "Jan", exam: "Report", programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "38402": { name: "Innovation in Engineering", ects: 5, sem: ["June"], cat: "mandatory", specs: [], slot: "Jun", exam: "Report", programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "38403": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["June"], cat: "mandatory", specs: [], slot: "Jun", exam: "Report", programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "38404": { name: "Innovation in Engineering", ects: 5, sem: ["August"], cat: "mandatory", specs: [], slot: "Aug", exam: "Report", programs: ["hcai"], desc: "Entrepreneurship, design thinking, innovation processes." },
  "38405": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["August"], cat: "mandatory", specs: [], slot: "Aug", exam: "Report", programs: ["hcai"], desc: "Team dynamics, innovation design, creative facilitation." },
  "42136": { name: "Large Scale Optimization using Decomposition", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F2B", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "42137": { name: "Optimization using metaheuristics", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F2A", exam: "Oral", programs: ["autonomous"], desc: "Added from autonomous program." },
  "42186": { name: "Model-based machine learning", ects: 5, sem: ["Spring"], cat: "elective", specs: ["ai"], slot: "F5B", exam: "Written 4h", programs: ["autonomous"], desc: "Added from autonomous program." },
  "thesis": { name: "Master's Thesis", ects: 30, sem: ["Spring", "Autumn"], cat: "thesis", specs: [], slot: "—", exam: "Thesis + oral defense", desc: "Standalone independent project, typically done in Semester 4." },
};

// Help helper function to determine if a course is valid
function getCourseDetails(code) {
  return COURSE_CATALOG[code];
}

const SYSTEM_INSTRUCTION = `
You are a DTU Academic Counselor Chatbot specializing in the MSc in Computer Science and Engineering.
Your job is to help the user manage their study plan by answering questions, recommending courses, and modifying their schedule based on user instructions.

You have access to the following COURSE CATALOG of available courses:
${JSON.stringify(COURSE_CATALOG, null, 2)}

The available semesters are:
- "sem1": Semester 1 — Autumn (September – December)
- "jan": January Intensive (3-week block in January)
- "sem2": Semester 2 — Spring (February – May)
- "summer": Summer Intensive (June / August)
- "sem3": Semester 3 — Autumn (September – December)
- "sem4": Semester 4 — Spring (February – June)

Rules for courses scheduling:
1. Courses have specific semester availability (e.g. if the catalog says "sem": ["Autumn"], it can ONLY go in "sem1" or "sem3". If it says "sem": ["Spring"], it can ONLY go in "sem2" or "sem4". If it says "sem": ["January"], it can ONLY go in "jan". If it says "sem": ["June"] or similar, it can ONLY go in "summer").
2. The user has a current selected set of courses and their semester assignments, which they will provide.
3. You can execute actions:
   - "ADD": Add a course to a specific semester. You must output the code and the target semester. Verify that the course runs in that semester (Autumn runs in sem1/sem3, Spring runs in sem2/sem4, January runs in jan, June/August/Summer runs in summer).
   - "REMOVE": Remove a course by code.
   - "MOVE": Move a course from one semester to another. Verify the course runs in the destination semester.
4. ECTS & Graduation Rules:
   - A standard MSc requires exactly 120 ECTS.
   - Mandatory foundation courses: 10 ECTS (1 course in Sustainability (5 ECTS) e.g. 12105 + 1 course in Innovation I (5 ECTS) e.g. 38400).
   - Programme-Specific Requirements: 50 ECTS minimum, consisting of:
     * Innovation II: 5 ECTS minimum (e.g. 02266).
     * Core Competence: Must choose at least 2 courses (from 02203, 02225, 02242, 02249, 02270, 02291).
     * Remaining Programme-Specific courses to make up 50 ECTS total (from the list of allowed programme courses).
   - Thesis: 30 ECTS (must be added as 'thesis' in sem4).
   - Electives: remaining ECTS to reach 120 ECTS in total.
   - Specialization tracks: Minimum 25 ECTS of courses matching a specialization identifier in "specs" (ai, cyber, digital, embedded, safe, software).
5. Clean-up & Total ECTS Balance (STRICT MATH RULES):
   - When asked to recommend or build a plan, you MUST distribute courses evenly.
   - STRICT MATH CONSTRAINTS: Courses are typically 5, 7.5, or 10 ECTS. Semesters MUST sum to an integer (e.g. 25 or 30).
     * If you add a 7.5 ECTS course, you MUST pair it with another 7.5 ECTS course in the SAME semester to make 15 ECTS total.
     * NEVER leave a semester with a sum like 27.5 ECTS, because a 2.5 ECTS course does not exist. Do not create 2.5 ECTS gaps.
   - You MUST adhere to these target semester workloads:
     * Semester 1 (Autumn): exactly 25 ECTS or 30 ECTS.
     * January: AT MOST 5 ECTS (strictly 1 course). Do NOT assign 2 courses in a 3-week intensive block.
     * Semester 2 (Spring): exactly 25 ECTS or 30 ECTS.
     * Summer: AT MOST 5 ECTS (strictly 1 course).
     * Semester 3 (Autumn): exactly 25 ECTS or 30 ECTS.
     * Semester 4 (Spring): exactly 30 ECTS (Master's Thesis).
   - If the user asks for a complete study plan or requests to switch to a specific specialization, you MUST output REMOVE actions for any currently selected courses that do not fit into the new plan or would cause the total ECTS to exceed 120 ECTS.
   - Always list alternative course swaps or optional routes in the text of your response so the student knows what options they can choose between.
6. Multi-specialization courses:
   - Explain to the user that some courses (e.g. 02291, 02225) belong to multiple specialization tracks. This is fully accurate per DTU program specifications, and they will count towards both specialization trackers in the UI. Keep this transparency clear.
7. Dynamic Choices (choices field):
   - Whenever you present alternative courses or swap choices in your recommendations (such as choosing 02249 vs 02242 in Sem 3, or choosing between various electives), you MUST populate the 'choices' array.
   - The user will see these choices as interactive buttons in the chat message, letting them swap courses dynamically. Specify the choice label and the options (with code, sem, and button label).
8. Entire DTU Catalog for Electives:
   - The user has access to the ENTIRE base of DTU courses for their electives. If the user asks to add a specific DTU course code (e.g. 02105, 42101) that is NOT in the provided COURSE_CATALOG, you MUST still allow it!
   - Treat it as a valid 5 ECTS or 10 ECTS elective course and output the ADD action for it. Do NOT reject DTU course codes just because they are missing from the JSON catalog.
   - When adding an unknown course, you MUST include 'fallbackName' (a reasonable guess or placeholder name for the course) and 'fallbackEcts' (usually 5 or 10) in the action object.

Your response MUST be in strict JSON format. Do not write markdown blocks like \`\`\`json ... \`\`\` around the JSON unless you have to, but prefer a raw JSON string or make sure the return type matches the specification. 
Specifically, output a JSON object containing:
1. "text": a friendly, natural language explanation of your response, suggestions, alerts, or details of actions taken. Feel free to use markdown in this text block.
2. "actions": an array of modification actions. Each action is an object with:
   - "type": "ADD", "REMOVE", or "MOVE"
   - "code": the course code (e.g., "02203" or any valid 5-digit DTU code)
   - "sem": the semester key (e.g., "sem1") - only required for ADD and MOVE.
   - "fallbackName": (optional) string, the name of the course if it is not in the provided catalog.
   - "fallbackEcts": (optional) number, the ECTS value if it is not in the provided catalog.
3. "choices": (optional) an array of choice blocks, each containing:
   - "label": "Choose course for Semester 3",
   - "options": an array of options, each containing:
     - "code": "02249",
     - "sem": "sem3",
     - "label": "02249 - Hard Problems"
    
Example JSON response:
{
  "text": "I've drafted a plan, but you can choose between two algorithms courses in Semester 3.",
  "actions": [
    { "type": "ADD", "code": "02203", "sem": "sem1" }
  ],
  "choices": [
    {
      "label": "Choose algorithms course for Semester 3",
      "options": [
        { "code": "02249", "sem": "sem3", "label": "02249 — Computationally Hard Problems (7.5 ECTS)" },
        { "code": "02242", "sem": "sem3", "label": "02242 — Program Analysis (7.5 ECTS)" }
      ]
    }
  ]
}

If the user asks a general question without requesting changes, keep the "actions" array empty.
Be proactive. If the user asks to add a course but doesn't specify which semester, pick the first appropriate semester it is available (e.g., sem1 for an Autumn course) and explain it.
`;

app.post('/api/chat', async (req, res) => {
  const { messages, currentState } = req.body;
  console.log(`\n[Server] POST /api/chat received. History length: ${messages?.length || 0}`);

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.warn("[Server] Bad Request: missing messages array.");
    return res.status(400).json({ error: "Missing or invalid messages array." });
  }

  // Basic input validation: ensure the latest message isn't maliciously huge
  const latestMessage = messages[messages.length - 1];
  if (!latestMessage || typeof latestMessage.content !== 'string' || latestMessage.content.length > 2000) {
    console.warn("[Server] Bad Request: message content exceeds length limits or is invalid.");
    return res.status(400).json({ error: "Message is too long or invalid." });
  }

  // Construct message payload for Gemini
  // We'll feed the system instruction, current state of study plan, and conversation history.
  const contextMessage = `CURRENT STUDY PLAN STATE (Selected courses and their assigned semesters):
${JSON.stringify(currentState, null, 2)}

Please respond to the user's message. Assess if they want to add/remove/move courses and output the response in JSON format. Ensure all course codes correspond to the course catalog database.`;

  if (!ai) {
    // Mock Mode (when API key is not present)
    console.log("[Server] Gemini API key not configured. Processing in Mock Mode.");
    return handleMockChat(messages[messages.length - 1].content, currentState, res);
  }

  try {
    console.log("[Server] Calling Gemini API (gemini-2.5-flash)...");
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Formatting conversation history
    // Convert to Gemini API format. Gemini expects { role: 'user'|'model', parts: [{ text: string }] }
    const geminiContents = [];

    // Add contextMessage as user prompt helper at the start or end
    // Let's add it right before the user's latest query, or as a system reminder.
    // We can map the messages array.
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const role = msg.sender === 'user' ? 'user' : 'model';
      
      let text = msg.content;
      if (i === messages.length - 1) {
        // Inject current state context into the last user message
        text = `${contextMessage}\n\nUser Message: ${msg.content}`;
      }

      geminiContents.push({
        role: role,
        parts: [{ text: text }]
      });
    }

    const responseSchema = {
      type: "OBJECT",
      properties: {
        text: { type: "STRING" },
        actions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              type: { type: "STRING", enum: ["ADD", "REMOVE", "MOVE"] },
              code: { type: "STRING" },
              sem: { type: "STRING", enum: ["sem1", "jan", "sem2", "summer", "sem3", "sem4"] },
              fallbackName: { type: "STRING" },
              fallbackEcts: { type: "NUMBER" }
            },
            required: ["type", "code"]
          }
        },
        choices: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              label: { type: "STRING" },
              options: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    code: { type: "STRING" },
                    sem: { type: "STRING", enum: ["sem1", "jan", "sem2", "summer", "sem3", "sem4"] },
                    label: { type: "STRING" }
                  },
                  required: ["code", "sem", "label"]
                }
              }
            },
            required: ["label", "options"]
          }
        }
      },
      required: ["text", "actions"]
    };

    const result = await model.generateContent({
      contents: geminiContents,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    console.log("[Server] Gemini API response received successfully!");
    const responseText = result.response.text();
    console.log(`[Server] Response JSON: ${responseText}`);
    const jsonResponse = JSON.parse(responseText);
    res.json(jsonResponse);

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      text: "Oops, I encountered an error while communicating with the Gemini API. Here is a backup response: you can manually add and remove courses using the selector checkboxes on the left.",
      actions: [],
      error: error.message
    });
  }
});

// Mock Chat Handler for offline/unconfigured environments
function handleMockChat(userQuery, currentState, res) {
  const query = userQuery.toLowerCase();
  let text = "";
  const actions = [];

  // Simple keyword matching for common actions
  const addMatch = query.match(/(?:add|select|choose)\s+(\d{5})/);
  const removeMatch = query.match(/(?:remove|delete|deselect|drop)\s+(\d{5})/);

  if (addMatch) {
    const code = addMatch[1];
    const course = COURSE_CATALOG[code];
    if (course) {
      // Pick first available semester
      let sem = "sem1";
      if (course.sem.includes("January")) sem = "jan";
      else if (course.sem.includes("June") || course.sem.includes("August")) sem = "summer";
      else if (course.sem.includes("Spring")) sem = "sem2";
      
      actions.push({ type: "ADD", code, sem });
      text = `[Mock Mode] I noticed you wanted to add **${course.name} (${code})**. I've added it to **${sem}** for you! Please configure your GEMINI_API_KEY in the backend .env file to enable the real AI chatbot advisor.`;
    } else {
      text = `[Mock Mode] I couldn't find course code **${code}** in the catalog. Try another course code.`;
    }
  } else if (removeMatch) {
    const code = removeMatch[1];
    const course = COURSE_CATALOG[code];
    if (currentState[code]) {
      actions.push({ type: "REMOVE", code });
      text = `[Mock Mode] I have removed **${course ? course.name : code}** from your schedule. Please configure your GEMINI_API_KEY in the backend .env file to enable the real AI chatbot advisor.`;
    } else {
      text = `[Mock Mode] Course **${code}** is not in your current schedule, so I couldn't remove it.`;
    }
  } else if (query.includes("suggest") || query.includes("recommend") || query.includes("specialization")) {
    text = `[Mock Mode] I can see you are looking for suggestions. For the **Embedded & Distributed Systems** specialization, I highly recommend:
- **02225** (Distributed Real-Time Systems) - Spring
- **02203** (Design of Digital Systems) - Autumn
- **02214** (Hardware/Software Codesign) - Spring
- **02226** (Networked Embedded Systems) - Autumn

You can add them by typing *"add 02225"* or by checking the box in the catalog. Link your Gemini API key in backend \`.env\` for full conversational assistance!`;
  } else {
    text = `[Mock Mode] Hello! I'm your DTU Study Plan advisor. You can ask me to add or remove courses (e.g. *"add 02203"* or *"remove 38400"*). To enable full AI reasoning, please add your Gemini API Key in the backend \`.env\` file as \`GEMINI_API_KEY\`.`;
  }

  return res.json({ text, actions, choices: [] });
}

const PLAN_CACHE_FILE = path.join(process.cwd(), 'plan_cache.json');

// Load cache from disk
let planCache = {};
if (fs.existsSync(PLAN_CACHE_FILE)) {
  try {
    planCache = JSON.parse(fs.readFileSync(PLAN_CACHE_FILE, 'utf8'));
  } catch (e) {
    console.error('[Server] Failed to load plan cache:', e);
  }
}

const saveCacheToDisk = () => {
  try {
    fs.writeFileSync(PLAN_CACHE_FILE, JSON.stringify(planCache));
  } catch (e) {
    console.error('[Server] Failed to save plan cache:', e);
  }
};

app.get('/api/plan', (req, res) => {
  // Use x-forwarded-for if behind a proxy, else req.ip
  const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  console.log(`[Server] GET /api/plan from IP: ${ip}`);
  const plan = planCache[ip] || {};
  res.json({ plan });
});

app.post('/api/plan', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  console.log(`[Server] POST /api/plan from IP: ${ip}`);
  const { plan } = req.body;
  if (plan && typeof plan === 'object') {
    planCache[ip] = plan;
    saveCacheToDisk();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid plan data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
