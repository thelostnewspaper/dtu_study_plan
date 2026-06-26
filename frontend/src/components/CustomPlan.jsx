import React, { useState } from 'react';
import PlanChatbot from './PlanChatbot';
import {
  COURSE_CATALOG,
  getCategoryClass,
  getCategoryLabel,
  getTimingClass,
  getTimingLabel
} from '../courses';

const SEMESTERS = [
  { id: "sem1", title: "Semester 1 — Autumn", period: "September – December" },
  { id: "jan", title: "January Intensive", period: "3-week block · January" },
  { id: "sem2", title: "Semester 2 — Spring", period: "February – May" },
  { id: "summer", title: "Summer Intensive", period: "June / August" },
  { id: "sem3", title: "Semester 3 — Autumn", period: "September – December" },
  { id: "sem4", title: "Semester 4 — Spring", period: "February – June" }
];

export default function CustomPlan({ customState, setCustomState, chatMessages, setChatMessages, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSemesterId, setTargetSemesterId] = useState(null);

  const openCourseModal = (semId) => {
    setTargetSemesterId(semId);
    setIsModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsModalOpen(false);
    setTargetSemesterId(null);
  };

  const handleModalCourseSelect = (code) => {
    // If course is already in the plan, don't allow duplicate addition via modal.
    if (customState[code]) {
      alert(`Course ${code} is already in your plan!`);
      return;
    }
    setCustomState(prev => ({
      ...prev,
      [code]: targetSemesterId
    }));
    closeCourseModal();
  };

  const toggleCustomCourse = (code) => {
    setCustomState(prev => {
      const next = { ...prev };
      if (next[code] !== undefined) {
        delete next[code];
      } else {
        const course = COURSE_CATALOG[code];
        if (code === 'thesis') {
          next[code] = 'sem4';
        } else if (course.sem.includes('January')) {
          next[code] = 'jan';
        } else if (course.sem.includes('June') || course.sem.includes('August') || course.sem.join().includes('June')) {
          next[code] = 'summer';
        } else if (course.sem.includes('Autumn')) {
          next[code] = 'sem1';
        } else {
          next[code] = 'sem2';
        }
      }
      return next;
    });
  };

  const changeCustomCourseSemester = (code, sem) => {
    setCustomState(prev => ({
      ...prev,
      [code]: sem
    }));
  };

  const handleApplyChatActions = (actions) => {
    setCustomState(prev => {
      const next = { ...prev };
      actions.forEach(act => {
        if (act.type === 'ADD') {
          if (!COURSE_CATALOG[act.code] && act.fallbackName) {
            COURSE_CATALOG[act.code] = {
              name: act.fallbackName,
              ects: act.fallbackEcts || 5,
              sem: ['Autumn', 'Spring', 'January', 'June'],
              cat: 'elective',
              specs: [],
              desc: 'Custom DTU course.'
            };
          }
          if (COURSE_CATALOG[act.code]) {
            // Default to appropriate semester if not provided or valid
            let targetSem = act.sem;
            const allowed = COURSE_CATALOG[act.code].sem;
            if (!targetSem) {
              if (allowed.includes('January')) targetSem = 'jan';
              else if (allowed.includes('June') || allowed.includes('August')) targetSem = 'summer';
              else if (allowed.includes('Autumn')) targetSem = 'sem1';
              else targetSem = 'sem2';
            }
            next[act.code] = targetSem;
          }
        } else if (act.type === 'REMOVE') {
          delete next[act.code];
        } else if (act.type === 'MOVE') {
          if (COURSE_CATALOG[act.code] && act.sem) {
            next[act.code] = act.sem;
          }
        }
      });
      return next;
    });
  };

  // ECTS Calculations
  let totalEcts = 0;
  let mandatoryEcts = 0;
  let progSpecificEcts = 0;
  let coreCount = 0;
  let sustainSelected = false;
  let innovSelected = false;
  let innov2Ects = 0;
  let thesisSelected = false;

  let specEcts = {
    ai: 0,
    cyber: 0,
    digital: 0,
    embedded: 0,
    safe: 0,
    software: 0
  };

  Object.entries(customState).forEach(([code]) => {
    const course = COURSE_CATALOG[code];
    if (!course) return;
    const ects = course.ects;

    totalEcts += ects;

    if (["12100", "12101", "12105", "12106"].includes(code)) {
      sustainSelected = true;
      mandatoryEcts += ects;
    }

    if (["42500", "42501", "42502", "42503", "42504", "42505"].includes(code)) {
      innovSelected = true;
      mandatoryEcts += ects;
    }

    if (course.cat === 'innov2') {
      innov2Ects += ects;
      progSpecificEcts += ects;
    }

    if (course.cat === 'core') {
      coreCount++;
      progSpecificEcts += ects;
    }

    if (course.cat === 'prog') {
      progSpecificEcts += ects;
    }

    if (code === 'thesis') {
      thesisSelected = true;
    }

    course.specs.forEach(specId => {
      if (specEcts[specId] !== undefined) {
        specEcts[specId] += ects;
      }
    });
  });

  // Category and timing helpers are imported from courses.js

  const specNameMap = {
    ai: "AI & Algorithms",
    cyber: "Cybersecurity",
    digital: "Digital Systems",
    embedded: "Embedded & Distributed",
    safe: "Safe & Secure",
    software: "Software Engineering"
  };

  const specColors = {
    ai: { background: "var(--color-pink)", color: "var(--color-bg)" },
    cyber: { background: "var(--color-cyan)", color: "var(--color-text)" },
    digital: { background: "var(--color-yellow)", color: "var(--color-text)" },
    embedded: { background: "var(--color-text)", color: "var(--color-bg)" },
    safe: { background: "var(--color-pink)", color: "var(--color-bg)" },
    software: { background: "var(--color-yellow)", color: "var(--color-text)" }
  };

  // Rule Validation Engine
  const isEctsOverload = totalEcts > 120;
  
  let intensiveOverloads = [];
  const janCourses = Object.entries(customState).filter(([_, sVal]) => sVal === 'jan');
  if (janCourses.length > 1) {
    intensiveOverloads.push('January');
  }
  const summerCourses = Object.entries(customState).filter(([_, sVal]) => sVal === 'summer');
  if (summerCourses.length > 1) {
    intensiveOverloads.push('Summer');
  }
  
  return (
    <div>
      <div style={{ padding: '0 2rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="req-pills">
          <span className={`req-pill ${sustainSelected ? 'met' : ''}`}>Sustainability</span>
          <span className={`req-pill ${innovSelected ? 'met' : ''}`}>Innovation I</span>
          <span className={`req-pill ${innov2Ects >= 5 ? 'met' : ''}`}>Innovation II (≥5 ECTS)</span>
          <span className={`req-pill ${coreCount >= 2 ? 'met' : ''}`}>Core (≥2 courses)</span>
          <span className={`req-pill ${progSpecificEcts >= 50 ? 'met' : ''}`}>Prog-Specific (≥50 ECTS)</span>
          <span className={`req-pill ${thesisSelected ? 'met' : ''}`}>Thesis (30 ECTS)</span>
        </div>
      </div>

      <div className="main">
        <div className="hide-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            className="download-pdf-btn"
            onClick={() => window.print()}
          >
            Download PDF
          </button>
        </div>

        {/* AI Advisor Chatbot at the top, full width */}
        <div style={{ marginBottom: '2rem' }}>
          <PlanChatbot 
            currentState={customState} 
            onApplyActions={handleApplyChatActions} 
            courseCatalog={COURSE_CATALOG} 
            messages={chatMessages}
            setMessages={setChatMessages}
          />
        </div>

        {/* Specialization Tracker */}
        <div className="section-title">Specialization Tracks ECTS Tracker</div>
        <div className="spec-tracker">
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: '1rem' }}>Diploma Endorsement Eligibility — Minimum 25 ECTS in a specialization line</h3>
          <div className="spec-rows" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px 20px' }}>
            {Object.keys(specNameMap).map(specId => {
              const ectsVal = specEcts[specId] || 0;
              const pctVal = Math.min(100, (ectsVal / 25) * 100);
              const isMet = ectsVal >= 25;
              return (
                <div key={specId} className="spec-row">
                  <span className="spec-check" style={{ color: isMet ? 'var(--color-cyan)' : 'var(--color-text)' }}>{isMet ? '✓' : '○'}</span>
                  <span className="spec-name" style={{ width: 180 }}>{specNameMap[specId]}</span>
                  <div className="spec-bar-outer">
                    <div className="spec-bar-inner" style={{ width: `${pctVal}%`, background: 'var(--color-pink)' }}></div>
                  </div>
                  <span className="spec-num">{ectsVal} / 25 ECTS</span>
                </div>
              );
            })}
            {/* Rule Warnings */}
        {isEctsOverload && (
          <div style={{ background: 'var(--color-pink)', color: 'var(--color-bg)', padding: '1rem', border: '3px solid var(--color-text)', boxShadow: '4px 4px 0 var(--color-text)', marginBottom: '2rem', fontWeight: 900, textAlign: 'center', fontSize: 16 }}>
            WARNING: YOU HAVE EXCEEDED THE 120 ECTS LIMIT!
          </div>
        )}
        {intensiveOverloads.length > 0 && (
          <div style={{ background: 'var(--color-yellow)', color: 'var(--color-text)', padding: '1rem', border: '3px solid var(--color-text)', boxShadow: '4px 4px 0 var(--color-text)', marginBottom: '2rem', fontWeight: 900, textAlign: 'center', fontSize: 16 }}>
            WARNING: YOU CANNOT TAKE MORE THAN 1 COURSE (5 ECTS) IN THE {intensiveOverloads.join(' AND ').toUpperCase()} INTENSIVE BLOCK!
          </div>
        )}

        {/* Single Column Schedule Layout */}
        <div className="custom-plan-schedule" style={{ width: '100%', maxWidth: 1000, margin: '0 auto', background: 'var(--color-bg)', border: '3px solid var(--color-border)', borderRadius: 0, padding: '1.5rem', boxShadow: '5px 5px 0px var(--color-text)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid var(--color-text)', paddingBottom: 6, color: 'var(--color-text)' }}>Custom Schedule</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: '1.5rem', fontWeight: 500 }}>Select empty slots to add courses. You must complete exactly 120 ECTS.</p>

          <div style={{ overflowY: 'auto' }}>
            {SEMESTERS.map(sem => {
              const semCourses = Object.entries(customState).filter(([_, sVal]) => sVal === sem.id);
              const ectsSum = semCourses.reduce((acc, [code]) => acc + (COURSE_CATALOG[code]?.ects || 0), 0);
              
              // Target slots: 6 for main semesters, 1 for intensives
              const targetSlots = (sem.id === 'jan' || sem.id === 'summer') ? 1 : 6;
              const emptySlotsCount = Math.max(0, targetSlots - semCourses.length);

              return (
                <div key={sem.id} className="sem-block" style={{ marginBottom: '1.5rem', background: '#fff', padding: 12, border: '2px solid var(--border)', borderRadius: 0, boxShadow: '3px 3px 0 var(--border)' }}>
                  <div className="sem-header" style={{ marginBottom: '0.5rem', borderBottom: '2px solid var(--accent)', display: 'flex', alignTo: 'baseline' }}>
                    <span className="sem-title" style={{ fontSize: 15, fontWeight: 900 }}>{sem.title}</span>
                    <span className="sem-period" style={{ fontSize: 11, marginLeft: 8, fontWeight: 500, alignSelf: 'center' }}>{sem.period}</span>
                    <span className="sem-ects-total" style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 900, color: 'var(--accent)' }}>{ectsSum} ECTS</span>
                  </div>

                  <table className="course-table">
                    <tbody>
                      {semCourses.map(([code]) => {
                        const c = COURSE_CATALOG[code];
                        if (!c) return null;

                        const allowed = c.sem;
                        const isAutumnOnly = allowed.length === 1 && allowed[0] === 'Autumn';
                        const isSpringOnly = allowed.length === 1 && allowed[0] === 'Spring';
                        const isJanuaryOnly = allowed.length === 1 && allowed[0] === 'January';
                        const isSummerOnly = allowed.length === 1 && (allowed[0] === 'June' || allowed[0] === 'August' || allowed.join().includes('June'));

                        let options = [];
                        if (code === 'thesis') {
                          options = [
                            { val: 'sem4', label: 'Sem 4 (Spring)' },
                            { val: 'sem3', label: 'Sem 3 (Autumn)' }
                          ];
                        } else if (isJanuaryOnly) {
                          options = [{ val: 'jan', label: 'January' }];
                        } else if (isSummerOnly) {
                          options = [{ val: 'summer', label: 'Summer' }];
                        } else if (isAutumnOnly) {
                          options = [
                            { val: 'sem1', label: 'Sem 1 (Autumn)' },
                            { val: 'sem3', label: 'Sem 3 (Autumn)' }
                          ];
                        } else if (isSpringOnly) {
                          options = [
                            { val: 'sem2', label: 'Sem 2 (Spring)' },
                            { val: 'sem4', label: 'Sem 4 (Spring)' }
                          ];
                        } else {
                          options = [
                            { val: 'sem1', label: 'Sem 1 (Autumn)' },
                            { val: 'sem2', label: 'Sem 2 (Spring)' },
                            { val: 'sem3', label: 'Sem 3 (Autumn)' },
                            { val: 'sem4', label: 'Sem 4 (Spring)' }
                          ];
                        }

                        return (
                          <tr key={code}>
                            <td className="code" style={{ width: 60, verticalAlign: 'middle', fontSize: 11, fontWeight: 900 }}>
                              <a
                                href={`https://dtucourseanalyzer.pythonanywhere.com/course/${code}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: 'inherit', textDecoration: 'underline' }}
                              >
                                {code === 'thesis' ? 'THESIS' : code}
                              </a>
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                              <div className="course-name" style={{ fontSize: 12, fontWeight: 600 }}>
                                <a
                                  href={`https://dtucourseanalyzer.pythonanywhere.com/course/${code}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ color: 'inherit', textDecoration: 'underline' }}
                                >
                                  {c.name}
                                </a>
                              </div>
                            </td>
                            <td className="ects-cell" style={{ width: 40, verticalAlign: 'middle', fontSize: 12, fontWeight: 600 }}>{c.ects}</td>
                            <td className="hide-print" style={{ width: 140, verticalAlign: 'middle' }}>
                              <select
                                value={sem.id}
                                onChange={(e) => changeCustomCourseSemester(code, e.target.value)}
                                style={{ width: '100%', padding: '6px', fontSize: 11, border: '2px solid var(--color-border)', borderRadius: 0, background: 'var(--color-yellow)', color: 'var(--color-text)', outline: 'none', fontWeight: 600 }}
                              >
                                {options.map(opt => (
                                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="hide-print" style={{ width: 30, textAlign: 'center', verticalAlign: 'middle' }}>
                              <button onClick={() => toggleCustomCourse(code)} style={{ border: '2px solid var(--color-text)', background: 'var(--color-pink)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 900, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* Empty Placeholder Slots */}
                      {Array.from({ length: emptySlotsCount }).map((_, i) => (
                        <tr key={`empty-${i}`} style={{ background: 'var(--color-bg)', border: '2px dashed var(--color-border)' }}>
                          <td className="code" style={{ width: 60, verticalAlign: 'middle', fontSize: 12, color: 'var(--color-text)' }}>—</td>
                          <td style={{ verticalAlign: 'middle', padding: '8px 4px' }}>
                            <button
                              onClick={() => openCourseModal(sem.id)}
                              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'var(--color-cyan)', color: 'var(--color-text)', border: '2px solid var(--color-text)', boxShadow: '2px 2px 0 var(--color-text)', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
                            >
                              + SELECT COURSE
                            </button>
                          </td>
                          <td className="ects-cell" style={{ width: 40, verticalAlign: 'middle', fontSize: 11, color: 'var(--text-muted)' }}>
                            —
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
          }}>
            <div style={{
              background: 'var(--color-bg)', border: '4px solid var(--color-text)', borderRadius: 0,
              padding: '1.5rem', boxShadow: '8px 8px 0px var(--color-text)',
              width: '100%', maxWidth: 800, maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '3px solid var(--color-text)', paddingBottom: 6 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 900, color: 'var(--color-text)', margin: 0 }}>Select Course for {SEMESTERS.find(s => s.id === targetSemesterId)?.title}</h3>
                <button onClick={closeCourseModal} style={{ background: 'var(--color-pink)', color: '#fff', border: '2px solid var(--color-text)', padding: '4px 8px', fontWeight: 900, cursor: 'pointer' }}>CLOSE X</button>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--color-text)', borderRadius: 0, fontFamily: 'var(--font-main)', fontSize: 14, outline: 'none', background: '#fff', color: 'var(--color-text)', boxShadow: '3px 3px 0px var(--color-text)' }}
                />
                <select
                  value={specFilter}
                  onChange={(e) => setSpecFilter(e.target.value)}
                  style={{ padding: '10px 14px', border: '2px solid var(--color-text)', borderRadius: 0, fontFamily: 'var(--font-main)', fontSize: 14, background: 'var(--color-cyan)', color: 'var(--color-text)', boxShadow: '3px 3px 0px var(--color-text)', outline: 'none', fontWeight: 600 }}
                >
                  <option value="all">All Specs</option>
                  <option value="ai">AI</option>
                  <option value="cyber">Cyber</option>
                  <option value="digital">Digital</option>
                  <option value="embedded">Embedded</option>
                  <option value="safe">Safe & Secure</option>
                  <option value="software">Software</option>
                  <option value="mandatory">Mandatory</option>
                  <option value="innov2">Innov II</option>
                </select>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', border: '2px solid var(--color-text)', background: '#fff' }}>
                <table className="course-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}>
                    <tr>
                      <th style={{ width: 70, padding: 8 }}>Code</th>
                      <th style={{ padding: 8 }}>Details</th>
                      <th style={{ width: 50, textAlign: 'center', padding: 8 }}>ECTS</th>
                      <th style={{ width: 80, textAlign: 'center', padding: 8 }}>Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(COURSE_CATALOG)
                      .filter(([code, c]) => {
                        const matchesSearch = code.includes(searchQuery) || c.name.toLowerCase().includes(searchQuery.toLowerCase());
                        let matchesFilter = true;
                        if (specFilter !== 'all') {
                          if (specFilter === 'mandatory') matchesFilter = c.cat === 'mandatory';
                          else if (specFilter === 'innov2') matchesFilter = c.cat === 'innov2';
                          else matchesFilter = c.specs.includes(specFilter);
                        }
                        return matchesSearch && matchesFilter;
                      })
                      .map(([code, c]) => {
                        const isSelected = customState[code] !== undefined;
                        return (
                          <tr key={code} style={{ borderBottom: '1px solid var(--color-border)', background: isSelected ? 'var(--color-bg)' : '#fff' }}>
                            <td className="code" style={{ verticalAlign: 'middle', padding: 8 }}>
                              {code === 'thesis' ? 'THESIS' : code}
                            </td>
                            <td style={{ padding: 8 }}>
                              <div className="course-name" style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                              <div className="course-detail" style={{ fontSize: 11, marginTop: 4 }}>{c.desc}</div>
                              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                <span className={`cat ${getCategoryClass(c.cat)}`} style={{ fontSize: 9, padding: '2px 6px' }}>{getCategoryLabel(c.cat)}</span>
                                <span className={`timing ${getTimingClass(c.sem.join('/'))}`} style={{ fontSize: 9, padding: '2px 6px' }}>{c.sem.join('/')}</span>
                                {c.specs.map(sId => (
                                  <span key={sId} className="cat" style={{ fontSize: 9, padding: '2px 6px', ...specColors[sId] }}>{specNameMap[sId]}</span>
                                ))}
                              </div>
                            </td>
                            <td className="ects-cell" style={{ verticalAlign: 'middle', textAlign: 'center', padding: 8, fontWeight: 600 }}>{c.ects}</td>
                            <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: 8 }}>
                              <button
                                onClick={() => handleModalCourseSelect(code)}
                                disabled={isSelected}
                                style={{
                                  padding: '6px 12px',
                                  background: isSelected ? 'var(--color-border)' : 'var(--color-yellow)',
                                  color: isSelected ? '#999' : 'var(--color-text)',
                                  border: `2px solid ${isSelected ? '#999' : 'var(--color-text)'}`,
                                  boxShadow: isSelected ? 'none' : '2px 2px 0 var(--color-text)',
                                  fontWeight: 900, cursor: isSelected ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {isSelected ? 'ADDED' : 'ADD'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}       </div>

          </div>

        {/* Custom Plan Summary Grid */}
        <div className="section-divider" style={{ marginTop: '3rem' }}><span>Custom Plan Summary</span></div>
        <div className="summary-grid">
          <div className="sum-card">
            <div className="sum-num">{totalEcts}</div>
            <div className="sum-label">Total ECTS</div>
          </div>
          <div className="sum-card">
            <div className="sum-num">{mandatoryEcts}</div>
            <div className="sum-label">Foundation ECTS</div>
          </div>
          <div className="sum-card">
            <div className="sum-num">{progSpecificEcts}</div>
            <div className="sum-label">Prog-Specific ECTS</div>
          </div>
          <div className="sum-card">
            <div className="sum-num">{thesisSelected ? 30 : 0}</div>
            <div className="sum-label">Thesis ECTS</div>
          </div>
          <div className="sum-card">
            <div className="sum-num">{Math.max(0, 120 - totalEcts)}</div>
            <div className="sum-label">Remaining ECTS</div>
          </div>
        </div>

      </div>
    </div>
  );
}
