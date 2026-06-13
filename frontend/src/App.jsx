import React, { useState } from 'react';
import RecommendedPlan from './components/RecommendedPlan';
import CustomPlan from './components/CustomPlan';

const EMBEDDED_COURSES = ['02203', '02211', '02214', '02225', '02226', '02249', '02258', '02291'];

const COURSE_CATALOG = {
  "12105": { name: "Quantitative Methods to Assess Sustainability", ects: 5, sem: ["Autumn"], cat: "mandatory", specs: [] },
  "42500": { name: "Innovation in Engineering", ects: 5, sem: ["January"], cat: "mandatory", specs: [] },
  "02266": { name: "User Experience Engineering", ects: 5, sem: ["January"], cat: "innov2", specs: ["software"] },
  "02203": { name: "Design of Digital Systems", ects: 5, sem: ["Autumn"], cat: "core", specs: ["digital", "embedded"] },
  "02225": { name: "Distributed Real-Time Systems", ects: 5, sem: ["Spring"], cat: "core", specs: ["digital", "embedded"] },
  "thesis": { name: "Master's Thesis", ects: 30, sem: ["Spring", "Autumn"], cat: "thesis", specs: [] }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('recommended');

  // Recommended Plan State
  const [choiceGroupSem3, setChoiceGroupSem3] = useState(null);
  const [selectedElectives, setSelectedElectives] = useState(new Set());
  const [semestersState, setSemestersState] = useState({
    '02225': 'sem2',
    '02277': 'sem2',
    '02231': 'sem2'
  });

  // Custom Plan State
  const [customState, setCustomState] = useState({
    "12105": "sem1",
    "42500": "jan",
    "02266": "jan",
    "02203": "sem1",
    "02225": "sem2",
    "thesis": "sem4"
  });

  // Unified Header Stats Calculation
  const calculateHeaderStats = () => {
    if (activeTab === 'recommended') {
      let total = 30; // Thesis
      let embeddedECTS = 0;

      // 1. Static Recommended Courses
      const staticCodes = ['02203', '02226', '02258', '02291', '12105', '02270', '42500', '02266', '02225', '02214', '02231', '02277', '02211', '02275'];
      staticCodes.forEach(code => {
        total += 5;
        if (EMBEDDED_COURSES.includes(code)) {
          embeddedECTS += 5;
        }
      });

      // 2. Choice Semester 3
      if (choiceGroupSem3) {
        total += 7.5;
        if (choiceGroupSem3 === '02249') {
          embeddedECTS += 7.5;
        }
      }

      // 3. Electives assigned to slots (derived from selectedElectives logic)
      // Mirror the slots logic from RecommendedPlan
      const ELECTIVES_DATA = {
        '02267': { code: '02267', ects: 5, timing: 'spring' },
        '02268': { code: '02268', ects: 5, timing: 'spring' },
        '02278': { code: '02278', ects: 5, timing: 'june' },
        '02234': { code: '02234', ects: 5, timing: 'autumn' },
        '02285': { code: '02285', ects: 7.5, timing: 'autumn' },
        '31372': { code: '31372', ects: 5, timing: 'spring' },
        '34760': { code: '34760', ects: 5, timing: 'autumn' },
        '30310': { code: '30310', ects: 5, timing: 'autumn' },
        '22058': { code: '22058', ects: 5, timing: 'spring' },
        '22449': { code: '22449', ects: 5, timing: 'autumn' },
        '27510': { code: '27510', ects: 5, timing: 'spring' },
        'other': { code: 'other', ects: 5, timing: 'both' }
      };

      const activeElectives = Array.from(selectedElectives).map(code => ELECTIVES_DATA[code]).filter(Boolean);
      let slot2Ects = 0;
      let slot3Ects = 0;
      let slot3Filled = false;
      let slot2Filled = false;
      const assigned = new Set();

      activeElectives.forEach(item => {
        const isAutumn = item.timing === 'autumn' || item.timing === 'both';
        const is7_5 = item.ects === 7.5;
        if ((isAutumn || is7_5) && !slot3Filled) {
          slot3Ects = item.ects;
          slot3Filled = true;
          assigned.add(item.code);
          if (EMBEDDED_COURSES.includes(item.code)) {
            embeddedECTS += item.ects;
          }
        }
      });

      activeElectives.forEach(item => {
        if (assigned.has(item.code)) return;
        if (!slot2Filled) {
          slot2Ects = item.ects;
          slot2Filled = true;
          assigned.add(item.code);
          if (EMBEDDED_COURSES.includes(item.code)) {
            embeddedECTS += item.ects;
          }
        } else if (!slot3Filled) {
          slot3Ects = item.ects;
          slot3Filled = true;
          assigned.add(item.code);
          if (EMBEDDED_COURSES.includes(item.code)) {
            embeddedECTS += item.ects;
          }
        }
      });

      total += slot2Ects + slot3Ects;

      return { total, embeddedECTS };

    } else {
      // Custom Plan Stats
      let total = 0;
      let embeddedECTS = 0;

      // Full Custom Catalog lookup table (just a fallback database locally for header calculations)
      const FULL_CATALOG_ECTS = {
        "12100": 5, "12101": 5, "12105": 5, "12106": 5,
        "42500": 5, "42501": 5, "42504": 5, "42502": 5, "42503": 5, "42505": 5,
        "thesis": 30,
        "02266": 5, "38102": 5, "38103": 10, "38106": 5, "38113": 5,
        "02201": 5, "02203": 5, "02205": 5, "02207": 5, "02209": 5,
        "02211": 5, "02214": 5, "02225": 5, "02226": 5, "02231": 5,
        "02232": 5, "02234": 5, "02242": 7.5, "02244": 7.5, "02245": 7.5,
        "02246": 7.5, "02247": 5, "02249": 7.5, "02256": 5, "02258": 5,
        "02262": 5, "02267": 5, "02268": 5, "02269": 5, "02270": 5,
        "02271": 5, "02275": 5, "02276": 5, "02277": 5, "02278": 5,
        "02282": 7.5, "02285": 7.5, "02287": 5, "02289": 5, "02291": 5
      };

      Object.entries(customState).forEach(([code]) => {
        const ects = FULL_CATALOG_ECTS[code] || 5;
        total += ects;
        if (EMBEDDED_COURSES.includes(code)) {
          embeddedECTS += ects;
        }
      });

      return { total, embeddedECTS };
    }
  };

  const { total, embeddedECTS } = calculateHeaderStats();

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <div className="header-eyebrow">Technical University of Denmark · MSc Computer Science & Engineering</div>
        <h1>Your 120 ECTS Study Plan</h1>
        <div className="header-sub">Specialization: Embedded & Distributed Systems · Secondary: security-aware</div>
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
            <div className="hstat-num">{embeddedECTS}</div>
            <div className="hstat-label">Embedded specialization ECTS</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">4</div>
            <div className="hstat-label">Semesters</div>
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        <button
          className={`choice-btn ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
          style={{ fontSize: 13, padding: '8px 16px' }}
        >
          Recommended Plan
        </button>
        <button
          className={`choice-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
          style={{ fontSize: 13, padding: '8px 16px' }}
        >
          Custom Plan Builder
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'recommended' ? (
        <RecommendedPlan
          choiceGroupSem3={choiceGroupSem3}
          setChoiceGroupSem3={setChoiceGroupSem3}
          selectedElectives={selectedElectives}
          setSelectedElectives={setSelectedElectives}
          semestersState={semestersState}
          setSemestersState={setSemestersState}
        />
      ) : (
        <CustomPlan
          customState={customState}
          setCustomState={setCustomState}
        />
      )}
    </div>
  );
}
