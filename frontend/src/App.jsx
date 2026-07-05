import React, { useState } from 'react';
import RecommendedPlan from './components/RecommendedPlan';
import CustomPlan from './components/CustomPlan';
import FinalPlan from './components/FinalPlan';
import {
  COURSE_CATALOG,
  EMBEDDED_COURSES,
  getCategoryClass,
  getCategoryLabel,
  PLAN_SEMESTERS,
  FLEX_ALTERNATIVES
} from './courses';

export default function App() {
  const [activeTab, setActiveTab] = useState('recommended');

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      content: "Hello! I'm your DTU Study Plan advisor. Ask me anything about your course planning, like *\"Which cybersecurity courses should I choose?\"* or command me: *\"Add 02225 to semester 2\"* or *\"Remove 02266\"*."
    }
  ]);

  const [recFlexChoices, setRecFlexChoices] = useState({
    sem3_flex_dl: '02456',
    sem3_flex_eh: '02807'
  });

  const [customState, setCustomState] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/plan')
      .then(res => res.json())
      .then(data => {
        if (data && data.plan) {
          // Always ensure thesis is in sem4
          setCustomState({ thesis: 'sem4', ...data.plan, thesis: 'sem4' });
        } else {
          setCustomState({ thesis: 'sem4' });
        }
        setHasLoaded(true);
      })
      .catch(err => {
        console.error("Failed to fetch plan:", err);
        setCustomState({ thesis: 'sem4' });
        setHasLoaded(true);
      });
  }, []);

  React.useEffect(() => {
    if (!hasLoaded) return;
    fetch('http://localhost:5000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: customState })
    })
    .catch(err => console.error("Failed to auto-save plan:", err));
  }, [customState, hasLoaded]);

  const saveCustomPlan = () => {
    fetch('http://localhost:5000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: customState })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) alert('Custom plan saved to the cloud based on your IP!');
    })
    .catch(err => console.error("Failed to save plan:", err));
  };

  const clearCustomPlan = () => {
    if (window.confirm("Are you sure you want to clear all courses from your custom plan?")) {
      setCustomState({});
      fetch('http://localhost:5000/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: {} })
      });
    }
  };

  // Compute header stats based on active tab
  const calculateHeaderStats = () => {
    if (activeTab === 'recommended') {
      const totalEcts = PLAN_SEMESTERS.reduce((sum, sem) => sum + sem.targetEcts, 0);
      const cyberEcts = 25; // fixed — 5 courses × 5 ECTS
      return { total: totalEcts, cyberEcts };
    } else {
      // Custom Plan Stats / Final Plan Stats — use COURSE_CATALOG for accurate ECTS per course
      let total = 0;

      Object.entries(customState).forEach(([code]) => {
        const ects = COURSE_CATALOG[code]?.ects || 5;
        total += ects;
      });

      return { total, cyberEcts: 0 };
    }
  };

  const { total, cyberEcts } = calculateHeaderStats();

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <div className="header-eyebrow">Technical University of Denmark · MSc Computer Science & Engineering</div>
        <h1>Your 120 ECTS Study Plan</h1>
        <div className="header-stats">
          <div className="hstat">
            <div className="hstat-num">{total}</div>
            <div className="hstat-label">ECTS selected</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">120</div>
            <div className="hstat-label">ECTS required</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">4</div>
            <div className="hstat-label">Semesters</div>
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            className={`choice-btn ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended Plan
          </button>
          <button
            className={`choice-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Plan Builder
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {total >= 120 && (
            <button
              className="download-pdf-btn"
              onClick={() => window.print()}
            >
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-wrap">
        <span className="progress-label">{activeTab === 'recommended' ? 'Recommended Plan' : 'Custom Plan'}</span>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${Math.min(100, (total / 120) * 100)}%` }}></div>
        </div>
        <span className="progress-ects">{total} / 120 ECTS</span>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'recommended' ? (
        <RecommendedPlan flexChoices={recFlexChoices} setFlexChoices={setRecFlexChoices} />
      ) : (
        <CustomPlan
          customState={customState}
          setCustomState={setCustomState}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          setActiveTab={setActiveTab}
          onSave={saveCustomPlan}
          onClear={clearCustomPlan}
        />
      )}

      {/* PRINT-ONLY RENDER */}
      {activeTab === 'custom' && (
        <div className="print-only">
          <FinalPlan customState={customState} />
        </div>
      )}
    </div>
  );
}
