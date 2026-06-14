import React, { useState } from 'react';
import RecommendedPlan from './components/RecommendedPlan';
import CustomPlan from './components/CustomPlan';
import {
  COURSE_CATALOG,
  EMBEDDED_COURSES,
  getCategoryClass,
  getCategoryLabel,
  getTimingClass,
  getTimingLabel,
  getElectiveSlots
} from './courses';

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

      // 3. Electives assigned to slots (using shared helper)
      const { slotSem2, slotSem3 } = getElectiveSlots(selectedElectives);
      let slot2Ects = slotSem2.selected ? slotSem2.ects : 0;
      let slot3Ects = slotSem3.selected ? slotSem3.ects : 0;

      if (slotSem2.selected && EMBEDDED_COURSES.includes(slotSem2.code)) {
        embeddedECTS += slotSem2.ects;
      }
      if (slotSem3.selected && EMBEDDED_COURSES.includes(slotSem3.code)) {
        embeddedECTS += slotSem3.ects;
      }

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
        "02282": 7.5, "02280": 10, "02287": 5, "02289": 5, "02291": 5
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

  const getPrintPlanCourses = () => {
    if (activeTab === 'recommended') {
      const sem1 = {
        title: 'Semester 1 — Autumn',
        period: 'September – December',
        courses: [
          { code: '02203', ...COURSE_CATALOG['02203'], notes: 'Core pick 1 of 2. Hands-on with real hardware — good entry point.' },
          { code: '02226', ...COURSE_CATALOG['02226'], notes: 'Practical and lab-heavy. Accessible for new students. Core to your profile.' },
          { code: '02258', ...COURSE_CATALOG['02258'], notes: 'Autumn confirmed. Complements embedded track directly.' },
          { code: '02291', ...COURSE_CATALOG['02291'], notes: 'Counts toward Embedded specialization. Bridges hardware and software.' },
          { code: '12105', ...COURSE_CATALOG['12105'], notes: 'Tick-the-box requirement. Evening slot means minimal schedule clash. Light workload.' },
          { code: '02270', ...COURSE_CATALOG['02270'], notes: 'Core pick 2 of 2 (or programme-specific). NIS2 literacy — useful for all Danish industrial roles. Not a detour.' }
        ]
      };
      if (semestersState['02231'] === 'sem1') {
        sem1.courses.push({ code: '02231', ...COURSE_CATALOG['02231'], notes: 'Moved to Sem 1. Embedded crypto on constrained devices is a valued specialism.' });
      }

      const jan = {
        title: 'January Intensive',
        period: '3-week block · January',
        courses: [
          { code: '42500', ...COURSE_CATALOG['42500'], notes: 'Must complete. Also offered June (42501) or Aug (42504) if January fills up.' },
          { code: '02266', ...COURSE_CATALOG['02266'], notes: 'Mandatory Innovation II pick. Practical and project-based — not heavy theory.' }
        ]
      };

      const sem2 = {
        title: 'Semester 2 — Spring',
        period: 'February – May',
        courses: []
      };
      if (semestersState['02225'] === 'sem2') {
        sem2.courses.push({ code: '02225', ...COURSE_CATALOG['02225'], notes: 'The single most important course for your profile. Spring only (F4B). Confirm on Study Planner.' });
      }
      sem2.courses.push({ code: '02214', ...COURSE_CATALOG['02214'], notes: 'Deepens the embedded layer. Firmware/hardware boundary is a key skill for Danish industrial jobs.' });
      if (semestersState['02231'] === 'sem2') {
        sem2.courses.push({ code: '02231', ...COURSE_CATALOG['02231'], notes: 'Move to Sem 1 if timing allows. Embedded crypto on constrained devices is a valued specialism.' });
      }
      if (semestersState['02277'] === 'sem2') {
        sem2.courses.push({ code: '02277', ...COURSE_CATALOG['02277'], notes: 'NIS2-directly relevant. Danish industrial employers increasingly expect this literacy. Confirm semester.' });
      }
      const { slotSem2, slotSem3 } = getElectiveSlots(selectedElectives);
      if (slotSem2.selected) {
        sem2.courses.push({
          code: slotSem2.code,
          name: slotSem2.name,
          ects: slotSem2.ects,
          cat: 'elective',
          timing: slotSem2.timing,
          notes: slotSem2.why
        });
      }

      const sem3 = {
        title: 'Semester 3 — Autumn',
        period: 'September – December',
        courses: [
          { code: '02211', ...COURSE_CATALOG['02211'], notes: 'Rounds out Embedded specialization. Good for thesis ideation in hardware-adjacent topics.' }
        ]
      };
      if (semestersState['02225'] === 'sem3') {
        sem3.courses.push({ code: '02225', ...COURSE_CATALOG['02225'], notes: 'Moved to Autumn. Confirm on Study Planner.' });
      }
      if (semestersState['02277'] === 'sem3') {
        sem3.courses.push({ code: '02277', ...COURSE_CATALOG['02277'], notes: 'Moved to Autumn. Confirm on Study Planner.' });
      }
      if (choiceGroupSem3 === '02249') {
        sem3.courses.push({ code: '02249', ...COURSE_CATALOG['02249'], notes: 'Counts toward Embedded specialization. Needed to reach 25 ECTS threshold. Challenging but broadens algorithmic thinking.' });
      } else if (choiceGroupSem3 === '02242') {
        sem3.courses.push({ code: '02242', ...COURSE_CATALOG['02242'], notes: 'Software reliability angle — preferred if you target safety-critical software roles over pure hardware. Does not count toward Embedded specialization.' });
      }
      sem3.courses.push({ code: '02275', ...COURSE_CATALOG['02275'], notes: 'Autumn (E5B — Wed 13–17). Top-listed skill in Danish market. Now no longer conflicts with 02270 (done in Sem 1).' });
      if (slotSem3.selected) {
        sem3.courses.push({
          code: slotSem3.code,
          name: slotSem3.name,
          ects: slotSem3.ects,
          cat: 'elective',
          timing: slotSem3.timing,
          notes: slotSem3.why
        });
      }

      const sem4 = {
        title: 'Semester 4 — Spring',
        period: 'February – June',
        courses: [
          { code: 'thesis', ...COURSE_CATALOG['thesis'], notes: 'The thesis is your single most important career asset. An industry-partnered thesis is what converts the degree into a job offer for international graduates.' }
        ]
      };

      const semesters = [sem1, jan, sem2, sem3, sem4];
      semesters.forEach(s => {
        s.ects = s.courses.reduce((acc, c) => acc + c.ects, 0);
      });
      return semesters;
    } else {
      const semesters = [
        { id: "sem1", title: "Semester 1 — Autumn", period: "September – December", courses: [] },
        { id: "jan", title: "January Intensive", period: "3-week block · January", courses: [] },
        { id: "sem2", title: "Semester 2 — Spring", period: "February – May", courses: [] },
        { id: "summer", title: "Summer Intensive", period: "June / August", courses: [] },
        { id: "sem3", title: "Semester 3 — Autumn", period: "September – December", courses: [] },
        { id: "sem4", title: "Semester 4 — Spring", period: "February – June", courses: [] }
      ];

      semesters.forEach(s => {
        s.courses = Object.entries(customState)
          .filter(([_, sVal]) => sVal === s.id)
          .map(([code]) => {
            const course = COURSE_CATALOG[code];
            return {
              code,
              name: course.name,
              ects: course.ects,
              cat: course.cat,
              timing: course.sem.join('/'),
              notes: course.desc
            };
          });
        s.ects = s.courses.reduce((acc, c) => acc + c.ects, 0);
      });

      return semesters.filter(s => s.courses.length > 0);
    }
  };

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
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
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
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {total >= 120 && (
            <button
              className="download-pdf-btn"
              onClick={() => window.print()}
            >
              📥 Download PDF
            </button>
          )}
        </div>
      </div>

      {/* ECTS PROGRESS TRACKER BAR */}
      <div className="progress-wrap">
        <span className="progress-label">{activeTab === 'recommended' ? 'Recommended Plan Progress' : 'Custom Progress'}</span>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${Math.min(100, (total / 120) * 100)}%` }}></div>
        </div>
        <span className="progress-ects">{total} / 120 ECTS</span>
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

      {/* PRINT-ONLY STUDY PLAN RENDER */}
      <div className="print-only">
        <div className="print-header">
          <div className="header-eyebrow">Technical University of Denmark · MSc Computer Science & Engineering</div>
          <h1>DTU Study Plan</h1>
          <div className="print-header-sub">
            <span><strong>Active Plan:</strong> {activeTab === 'recommended' ? 'Recommended Plan' : 'Custom Study Plan'}</span>
            <span style={{ marginLeft: 20 }}><strong>Total ECTS:</strong> {total} / 120 ECTS</span>
            <span style={{ marginLeft: 20 }}><strong>Embedded Specialization ECTS:</strong> {embeddedECTS} / 25 ECTS</span>
          </div>
        </div>

        {getPrintPlanCourses().map((sem, idx) => (
          <div key={idx} className="sem-block" style={{ pageBreakInside: 'avoid' }}>
            <div className="sem-header">
              <span className="sem-title">{sem.title}</span>
              <span className="sem-period">{sem.period}</span>
              <span className="sem-ects-total">{sem.ects} ECTS</span>
            </div>
            <table className="course-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Code</th>
                  <th>Course</th>
                  <th style={{ width: 60, textAlign: 'center' }}>ECTS</th>
                  <th style={{ width: 140 }}>Category</th>
                  <th style={{ width: 110 }}>Timing</th>
                  <th>Notes / Description</th>
                </tr>
              </thead>
              <tbody>
                {sem.courses.map(course => {
                  const tClass = getTimingClass(course.timing || '');
                  const tLabel = getTimingLabel(course.timing || '');
                  return (
                    <tr key={course.code}>
                      <td className="code">{course.code === 'thesis' ? 'THESIS' : course.code}</td>
                      <td>
                        <div className="course-name">{course.name}</div>
                      </td>
                      <td className="ects-cell">{course.ects}</td>
                      <td>
                        <span className={`cat ${getCategoryClass(course.cat)}`}>
                          {getCategoryLabel(course.cat)}
                        </span>
                      </td>
                      <td>
                        <span className={`timing ${tClass}`}>{tLabel}</span>
                      </td>
                      <td className="course-detail">{course.notes || course.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
