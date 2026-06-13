import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
  "12100": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], desc: "Life-cycle assessment, environmental impact quantification." },
  "12101": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], desc: "Life-cycle assessment, environmental impact quantification." },
  "12105": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [], desc: "Life-cycle assessment, environmental impact quantification (Evening slot)." },
  "12106": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Spring"], cat: "mandatory", specs: [], desc: "Life-cycle assessment, environmental impact quantification." },
  "42500": { name: "Innovation in Engineering", ects: 5, sem: ["January"], cat: "mandatory", specs: [], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42501": { name: "Innovation in Engineering", ects: 5, sem: ["June"], cat: "mandatory", specs: [], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42504": { name: "Innovation in Engineering", ects: 5, sem: ["August"], cat: "mandatory", specs: [], desc: "Entrepreneurship, design thinking, innovation processes." },
  "42502": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["January"], cat: "mandatory", specs: [], desc: "Team dynamics, innovation design, creative facilitation." },
  "42503": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["June"], cat: "mandatory", specs: [], desc: "Team dynamics, innovation design, creative facilitation." },
  "42505": { name: "Facilitating Innovation in Multidisciplinary Teams", ects: 5, sem: ["August"], cat: "mandatory", specs: [], desc: "Team dynamics, innovation design, creative facilitation." },
  "thesis": { name: "Master's Thesis", ects: 30, sem: ["Spring", "Autumn"], cat: "thesis", specs: [], desc: "Standalone independent project, typically done in Semester 4." },
  "02266": { name: "User Experience Engineering", ects: 5, sem: ["January"], cat: "innov2", specs: ["software"], desc: "UI/UX methods, user research, prototyping, usability testing." },
  "38102": { name: "Technology Entrepreneurship", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], desc: "Business modeling, startup creation, commercialization strategies." },
  "38103": { name: "X-Tech Entrepreneurship", ects: 10, sem: ["Autumn", "Spring"], cat: "innov2", specs: [], desc: "Project incubator connecting researchers and students to build startups." },
  "38106": { name: "Developing an Entrepreneurial Mindset", ects: 5, sem: ["Spring"], cat: "innov2", specs: [], desc: "Creativity, mindset building, startup exploration." },
  "38113": { name: "Applied AI for Entrepreneurs", ects: 5, sem: ["Autumn"], cat: "innov2", specs: [], desc: "Leveraging AI/ML systems to build new commercial platforms." },
  "02201": { name: "Agile Hardware Design", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], desc: "Modern agile workflows for digital systems, rapid prototyping." },
  "02203": { name: "Design of Digital Systems", ects: 5, sem: ["Autumn"], cat: "core", specs: ["digital", "embedded"], desc: "FPGA hardware design, CAD tools, digital circuit implementation." },
  "02205": { name: "VLSI Design", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital"], desc: "Very Large Scale Integration, CMOS technology, transistor-level layout." },
  "02207": { name: "Verification of Digital Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital"], desc: "Formal verification, model checking, assertion-based testing." },
  "02209": { name: "Test of Digital Systems", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital"], desc: "Fault modeling, automatic test pattern generation, design-for-testability." },
  "02211": { name: "Research Topics in Computer Architecture", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["digital", "embedded"], desc: "Advanced processor design, memory hierarchies, research directions." },
  "02214": { name: "Hardware/Software Codesign", ects: 5, sem: ["Spring"], cat: "prog", specs: ["digital", "embedded"], desc: "FPGA-software interfaces, firmware-hardware boundary, co-simulation." },
  "02225": { name: "Distributed Real-Time Systems", ects: 5, sem: ["Spring"], cat: "core", specs: ["digital", "embedded"], desc: "Real-time scheduling, fault tolerance, distributed protocols." },
  "02226": { name: "Networked Embedded Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], desc: "Communication protocols, IoT architectures, real-world embedded labs." },
  "02231": { name: "Cryptography Fundamentals", ects: 5, sem: ["Autumn", "Spring"], cat: "prog", specs: ["cyber", "safe"], desc: "Symmetric/asymmetric crypto, protocols, mathematical foundations." },
  "02232": { name: "Applied Cryptography", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber", "safe"], desc: "Implementation of crypto algorithms, secure communication protocols." },
  "02234": { name: "Research Topics in Cybersecurity", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], desc: "Keeps you current on emerging threats and OT/ICS security." },
  "02242": { name: "Program Analysis", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["safe", "software"], desc: "Static analysis, dataflow, type systems, software reliability." },
  "02244": { name: "Logic for Security", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["safe"], desc: "Mathematical logic, formal models of security protocols." },
  "02245": { name: "Program Verification", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["safe", "software"], desc: "Formal verification tools, Hoare logic, proving program correctness." },
  "02246": { name: "Model Checking", ects: 7.5, sem: ["Spring"], cat: "prog", specs: ["safe"], desc: "Automated verification of finite-state concurrent systems." },
  "02247": { name: "Compiler Construction", ects: 5, sem: ["Spring"], cat: "prog", specs: ["safe"], desc: "Parsing, lexing, semantic analysis, compiler design." },
  "02249": { name: "Computationally Hard Problems", ects: 7.5, sem: ["Autumn"], cat: "core", specs: ["ai", "embedded"], desc: "NP-completeness, approximation algorithms, exact algorithms." },
  "02256": { name: "Automated Reasoning", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai", "safe"], desc: "Theorem proving, SAT/SMT solvers, logical frameworks." },
  "02258": { name: "Parallel Computer Systems", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["embedded"], desc: "Concurrent programming, parallel architectures, performance models." },
  "02262": { name: "Formal Aspects of Process Science", ects: 5, sem: ["Spring"], cat: "prog", specs: ["safe", "software"], desc: "Concurrency theory, Petri nets, process algebra." },
  "02267": { name: "Software Development of Web Services", ects: 5, sem: ["Spring"], cat: "prog", specs: ["software"], desc: "Cloud/API layer and IoT cloud connectivity." },
  "02268": { name: "Process-Oriented and Event-Driven Software Systems", ects: 5, sem: ["Spring"], cat: "prog", specs: ["software"], desc: "Industrial automation and IoT event pipelines." },
  "02269": { name: "Process Mining", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["software"], desc: "Discovering, monitoring, and improving processes from event logs." },
  "02270": { name: "Cybersecurity Fundamentals", ects: 5, sem: ["Autumn"], cat: "core", specs: ["cyber", "software"], desc: "Network security, threat modeling, secure systems design." },
  "02271": { name: "Advanced Cybersecurity", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], desc: "Advanced threat defense, secure architecture design." },
  "02275": { name: "Ethical Hacking", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["cyber"], desc: "Penetration testing, vulnerability assessment, exploitation." },
  "02276": { name: "Usable Security and Privacy", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], desc: "Human factors in security, interface design for security." },
  "02277": { name: "Cyber Risk Management and Incident Response", ects: 5, sem: ["Spring"], cat: "prog", specs: ["cyber"], desc: "NIS2 compliance, risk frameworks, incident handling." },
  "02278": { name: "Post-Quantum Cryptography", ects: 5, sem: ["June"], cat: "prog", specs: ["cyber"], desc: "Forward bet on quantum-resistant cryptographic algorithms." },
  "02282": { name: "Algorithms for Massive Data Sets", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["ai"], desc: "Streaming algorithms, hashing, handling giant data collections." },
  "02285": { name: "Artificial Intelligence and Multi-Agent Systems", ects: 7.5, sem: ["Autumn"], cat: "prog", specs: ["ai"], desc: "Robotics and autonomous agent decision-making models." },
  "02287": { name: "Logical Theories for Uncertainty and Learning", ects: 5, sem: ["Autumn"], cat: "prog", specs: ["ai"], desc: "Probabilistic logic and foundations of machine learning." },
  "02289": { name: "Algorithmic Techniques for Modern Data Models", ects: 5, sem: ["Spring"], cat: "prog", specs: ["ai"], desc: "Advanced graph algorithms, data structures, metric spaces." },
  "02291": { name: "System Integration", ects: 5, sem: ["Autumn"], cat: "core", specs: ["ai", "cyber", "digital", "embedded", "safe", "software"], desc: "Heterogeneous systems, APIs, middleware, SOA." }
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
4. ECTS Rules:
   - A standard MSc requires exactly 120 ECTS.
   - Mandatory foundation courses: 15 ECTS (Sustainability: 5 ECTS, Innovation I: 5 ECTS, Innovation II: 5 ECTS).
   - Program-specific courses (core + program electives): minimum 50 ECTS.
   - Core competence courses: minimum 2 courses.
   - Thesis: 30 ECTS (usually done in sem4).
   - Specialization tracks: Minimum 25 ECTS of courses matching a specialization identifier in "specs" (ai, cyber, digital, embedded, safe, software).

Your response MUST be in strict JSON format. Do not write markdown blocks like \`\`\`json ... \`\`\` around the JSON unless you have to, but prefer a raw JSON string or make sure the return type matches the specification. 
Specifically, output a JSON object containing:
1. "text": a friendly, natural language explanation of your response, suggestions, alerts, or details of actions taken. Feel free to use markdown in this text block.
2. "actions": an array of modification actions. Each action is an object with:
   - "type": "ADD", "REMOVE", or "MOVE"
   - "code": the course code (e.g., "02203")
   - "sem": the semester key (e.g., "sem1") - only required for ADD and MOVE.
   
Example JSON response:
{
  "text": "I've added Design of Digital Systems (02203) to your first semester since it runs in the Autumn. Note that this adds 5 ECTS to your Digital Systems and Embedded specializations.",
  "actions": [
    { "type": "ADD", "code": "02203", "sem": "sem1" }
  ]
}

If the user asks a general question without requesting changes, keep the "actions" array empty.
Be proactive. If the user asks to add a course but doesn't specify which semester, pick the first appropriate semester it is available (e.g., sem1 for an Autumn course) and explain it.
`;

app.post('/api/chat', async (req, res) => {
  const { messages, currentState } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages array." });
  }

  // Construct message payload for Gemini
  // We'll feed the system instruction, current state of study plan, and conversation history.
  const contextMessage = `CURRENT STUDY PLAN STATE (Selected courses and their assigned semesters):
${JSON.stringify(currentState, null, 2)}

Please respond to the user's message. Assess if they want to add/remove/move courses and output the response in JSON format. Ensure all course codes correspond to the course catalog database.`;

  if (!ai) {
    // Mock Mode (when API key is not present)
    console.log("Gemini API key not configured. Processing in Mock Mode.");
    return handleMockChat(messages[messages.length - 1].content, currentState, res);
  }

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
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
              sem: { type: "STRING", enum: ["sem1", "jan", "sem2", "summer", "sem3", "sem4"] }
            },
            required: ["type", "code"]
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

    const responseText = result.response.text();
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
    text = `[Mock Mode] Hello! I'm your DTU Study Plan advisor. You can ask me to add or remove courses (e.g. *"add 02203"* or *"remove 42500"*). To enable full AI reasoning, please add your Gemini API Key in the backend \`.env\` file as \`GEMINI_API_KEY\`.`;
  }

  return res.json({ text, actions });
}

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
