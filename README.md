# DTU MSc Study Planner (Embedded & Distributed Systems Specialization)

An interactive, user-friendly study planner application designed for students enrolled in the **MSc in Computer Science and Engineering** at the **Technical Technical University of Denmark (DTU)**. It specifically helps plan a course trajectory targeting the **Embedded & Distributed Systems** specialization, along with a secondary focus on **security-aware systems**.

---

## 🚀 Key Features

* **Unified ECTS Progress Tracker**: A persistent progress bar at the top showing selected ECTS against the 120 ECTS requirement, visible on both tabs.
* **Recommended Study Plan**: A structured 4-semester layout with:
  * ECTS counts calculated per semester automatically.
  * Easy semester toggles for shifting specific core/programme courses.
  * Embedded and general program guidelines advice.
  * Interactive elective picker where choosing a course auto-routes it to correct Spring/Autumn elective slots.
* **Custom Plan Builder**: 
  * Full catalog search and specialization filter capabilities.
  * Interactive drag-and-drop or select adjustments to customize and balance ECTS per semester.
  * Live **Diploma Endorsement Tracker** verifying if you've met the minimum 25 ECTS threshold for specialization lines like AI, Cybersecurity, Digital Systems, etc.
* **AI Planner Chatbot**: An built-in AI advisor to suggest, add, remove, or move courses dynamically.

---

## 🛠️ Tech Stack & Structure

The repository is organized into a full-stack structure:

```
├── backend/            # Express/Node.js server with Gemini API integration
├── frontend/           # React + Vite client application
├── package.json        # Unified scripts to run both environments concurrently
└── dtu_study_plan.html # Legacy static reference layout
```

---

## 🏃 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Setup and Running locally

1. **Install dependencies for both frontend and backend**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend/` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start both servers concurrently**:
   ```bash
   npm run dev
   ```
   * Frontend will launch on: `http://localhost:5173/`
   * Backend API server runs on: `http://localhost:5000`

---

## 📚 Curriculum Specializations Configured

All ECTS tracks are updated to DTU curriculum specifications:
* **Embedded and Distributed Systems**: 25 ECTS minimum (contains updated `02280` Artificial Intelligence and Multi-Agent Systems course - 10 ECTS).
* **Cybersecurity**
* **Digital Systems**
* **Safe and Secure by Design**
* **Software Engineering**
* **Artificial Intelligence and Algorithms**
