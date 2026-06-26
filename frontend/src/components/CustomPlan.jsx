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

export default function CustomPlan({ customState, setCustomState }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('all');

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
        {/* AI Advisor Chatbot at the top, full width */}
        <div style={{ marginBottom: '2rem' }}>
          <PlanChatbot currentState={customState} onApplyActions={handleApplyChatActions} courseCatalog={COURSE_CATALOG} />
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
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="custom-plan-layout" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem', alignItems: 'flex-start' }}>
          
          {/* Catalog Column */}
          <div className="custom-plan-catalog" style={{ flex: '1 1 480px', minWidth: 320, background: 'var(--color-bg)', border: '3px solid var(--color-border)', borderRadius: 0, padding: '1.5rem', boxShadow: '5px 5px 0px var(--color-text)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid var(--color-text)', paddingBottom: 6, color: 'var(--color-text)' }}>1. Course Catalog</h3>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                style={{ flex: 1, padding: '8px 12px', border: '2px solid var(--color-border)', borderRadius: 0, fontFamily: 'var(--font-main)', fontSize: 13, outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', boxShadow: '3px 3px 0px var(--color-text)' }}
              />
              <select
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '2px solid var(--color-border)', borderRadius: 0, fontFamily: 'var(--font-main)', fontSize: 13, background: 'var(--color-cyan)', color: 'var(--color-text)', boxShadow: '3px 3px 0px var(--color-text)', outline: 'none' }}
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

            <div style={{ maxHeight: 650, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 6 }}>
              <table className="course-table">
                <thead>
                  <tr>
                    <th style={{ width: 50, textAlign: 'center' }}>Select</th>
                    <th style={{ width: 70 }}>Code</th>
                    <th>Details</th>
                    <th style={{ width: 50, textAlign: 'center' }}>ECTS</th>
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
                        <tr key={code} className={isSelected ? 'selected-choice' : ''} style={{ cursor: 'pointer' }}>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => { e.stopPropagation(); toggleCustomCourse(code); }}>
                            <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                          </td>
                          <td className="code" onClick={() => toggleCustomCourse(code)} style={{ verticalAlign: 'middle' }}>{code === 'thesis' ? 'THESIS' : code}</td>
                          <td onClick={() => toggleCustomCourse(code)}>
                            <div className="course-name" style={{ fontSize: 12, fontWeight: 500 }}>
                              <a
                                href={`https://dtucourseanalyzer.com/course/${code}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: 'inherit', textDecoration: 'underline' }}
                              >
                                {c.name}
                              </a>
                            </div>
                            <div className="course-detail" style={{ fontSize: 11, marginTop: 2 }}>{c.desc}</div>
                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <span className={`cat ${getCategoryClass(c.cat)}`} style={{ fontSize: 8, padding: '1px 4px' }}>{getCategoryLabel(c.cat)}</span>
                              <span className={`timing ${getTimingClass(c.sem.join('/'))}`} style={{ fontSize: 8, padding: '1px 4px' }}>{c.sem.join('/')}</span>
                              {c.specs.map(sId => (
                                <span key={sId} className="cat" style={{ fontSize: 8, padding: '1px 4px', ...specColors[sId] }}>{specNameMap[sId]}</span>
                              ))}
                            </div>
                          </td>
                          <td className="ects-cell" onClick={() => toggleCustomCourse(code)} style={{ verticalAlign: 'middle' }}>{c.ects}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule Column */}
          <div className="custom-plan-schedule" style={{ flex: '1 1 480px', minWidth: 320 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid var(--color-text)', paddingBottom: 6, color: 'var(--color-text)' }}>2. Custom Schedule</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Select courses on the left or type in the chat. They appear below where you can adjust timing.</p>

            <div style={{ maxHeight: 720, overflowY: 'auto' }}>
                {(() => {
                  // Calculate dynamic placeholder slot allocations to hit exactly 120 ECTS
                  const allocatedSlots = {
                    sem1: 0,
                    jan: 0,
                    sem2: 0,
                    summer: 0,
                    sem3: 0,
                    sem4: 0
                  };

                  if (totalEcts < 120) {
                    let pool = 120 - totalEcts;
                    const mainSems = ['sem1', 'sem2', 'sem3', 'sem4'];
                    
                    // 1. Allocate to regular semesters first (up to 30 ECTS each)
                    for (const id of mainSems) {
                      const semCourses = Object.entries(customState).filter(([_, sVal]) => sVal === id);
                      const ectsSum = semCourses.reduce((acc, [code]) => acc + (COURSE_CATALOG[code]?.ects || 0), 0);
                      if (ectsSum < 30) {
                        const space = 30 - ectsSum;
                        const alloc = Math.min(space, pool);
                        allocatedSlots[id] = alloc;
                        pool -= alloc;
                      }
                      if (pool <= 0) break;
                    }

                    // 2. Allocate remaining to intensives if needed (up to 5 ECTS each)
                    if (pool > 0) {
                      const intensives = ['jan', 'summer'];
                      for (const id of intensives) {
                        const semCourses = Object.entries(customState).filter(([_, sVal]) => sVal === id);
                        const ectsSum = semCourses.reduce((acc, [code]) => acc + (COURSE_CATALOG[code]?.ects || 0), 0);
                        if (ectsSum < 5) {
                          const space = 5 - ectsSum;
                          const alloc = Math.min(space, pool);
                          allocatedSlots[id] = alloc;
                          pool -= alloc;
                        }
                        if (pool <= 0) break;
                      }
                    }
                  }

                  return SEMESTERS.map(sem => {
                    const semCourses = Object.entries(customState).filter(([_, sVal]) => sVal === sem.id);
                    const ectsSum = semCourses.reduce((acc, [code]) => acc + (COURSE_CATALOG[code]?.ects || 0), 0);
                    const slotEcts = allocatedSlots[sem.id];
                    
                    return (
                      <div key={sem.id} className="sem-block" style={{ marginBottom: '1.5rem', background: '#fff', padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
                        <div className="sem-header" style={{ marginBottom: '0.5rem', borderBottom: '2px solid var(--accent)', display: 'flex', alignTo: 'baseline' }}>
                          <span className="sem-title" style={{ fontSize: 13, fontWeight: 600 }}>{sem.title}</span>
                          <span className="sem-period" style={{ fontSize: 9, marginLeft: 6 }}>{sem.period}</span>
                          <span className="sem-ects-total" style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>{ectsSum} ECTS</span>
                        </div>

                        <table className="course-table">
                          <tbody>
                            {semCourses.length === 0 ? (
                              <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-faint)', fontStyle: 'italic', padding: 12, fontSize: 11 }}>
                                  No courses assigned.
                                </td>
                              </tr>
                            ) : (
                              semCourses.map(([code]) => {
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
                                    <td className="code" style={{ width: 60, verticalAlign: 'middle', fontSize: 10 }}>{code === 'thesis' ? 'THESIS' : code}</td>
                                    <td style={{ verticalAlign: 'middle' }}>
                                      <div className="course-name" style={{ fontSize: 11, fontWeight: 500 }}>
                                        <a
                                          href={`https://dtucourseanalyzer.com/course/${code}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ color: 'inherit', textDecoration: 'underline' }}
                                        >
                                          {c.name}
                                        </a>
                                      </div>
                                    </td>
                                    <td className="ects-cell" style={{ width: 40, verticalAlign: 'middle', fontSize: 11 }}>{c.ects}</td>
                                    <td className="hide-print" style={{ width: 100, verticalAlign: 'middle' }}>
                                      <select
                                        value={sem.id}
                                        onChange={(e) => changeCustomCourseSemester(code, e.target.value)}
                                        style={{ width: '100%', padding: '4px', fontSize: 10, border: '2px solid var(--color-border)', borderRadius: 0, background: 'var(--color-yellow)', color: 'var(--color-text)', outline: 'none' }}
                                      >
                                        {options.map(opt => (
                                          <option key={opt.val} value={opt.val}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="hide-print" style={{ width: 25, textAlign: 'center', verticalAlign: 'middle' }}>
                                      <button onClick={() => toggleCustomCourse(code)} style={{ border: 'none', background: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 14 }}>&times;</button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                            {slotEcts > 0 && (
                              <tr style={{ background: 'var(--color-bg)', border: '2px dashed var(--color-border)' }}>
                                <td className="code" style={{ width: 60, verticalAlign: 'middle', fontSize: 10, color: 'var(--color-text)' }}>—</td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <div className="course-name" style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    {sem.id === 'jan' || sem.id === 'summer' ? 'Free intensive slot' : 'Free elective / choice slot'}
                                  </div>
                                  <div className="course-detail" style={{ fontSize: 10, color: 'var(--text-faint)' }}>
                                    Select a course from the catalog on the left to fill this space.
                                  </div>
                                </td>
                                <td className="ects-cell" style={{ width: 40, verticalAlign: 'middle', fontSize: 11, color: 'var(--text-muted)' }}>
                                  {slotEcts} ECTS
                                </td>
                                <td colSpan="2"></td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

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
