import React, { useState } from 'react';
import {
  PLAN_SEMESTERS,
  FLEX_ALTERNATIVES,
  PREREQ_CHAINS,
  CAREER_ROADMAP,
  CAREER_THREADS,
  CONFIRM_ITEMS,
  CYBER_SPEC_COURSES,
  PS_COURSES,
  COURSE_CATALOG
} from '../courses';

// ---- DTU Slot → Day/Time Lookup ----
export const SLOT_LABELS = {
  // Autumn (E) slots
  'E1A': 'Mon 8-12',   'E1B': 'Thu 13-17',
  'E2A': 'Mon 13-17',  'E2B': 'Thu 8-12',
  'E3A': 'Tue 8-12',   'E3B': 'Fri 13-17',
  'E4A': 'Tue 13-17',  'E4B': 'Fri 8-12',
  'E5A': 'Wed 8-12',   'E5B': 'Wed 13-17',
  'E7':  'Tue 18-22',
  // Spring (F) slots
  'F1A': 'Mon 8-12',   'F1B': 'Thu 13-17',
  'F2A': 'Mon 13-17',  'F2B': 'Thu 8-12',
  'F3A': 'Tue 8-12',   'F3B': 'Fri 13-17',
  'F4A': 'Tue 13-17',  'F4B': 'Fri 8-12',
  'F5A': 'Wed 8-12',   'F5B': 'Wed 13-17',
  'F7':  'Tue 18-22',
  // Special
  'Jan': 'January', 'Jun': 'June', 'Aug': 'August',
  '—': '—',
};

// ---- Helpers ----

function getRoleClass(role) {
  if (!role) return 'role-elective';
  const r = role.toLowerCase();
  if (r.includes('foundation')) return 'role-foundation';
  if (r.includes('core')) return 'role-core';
  if (r.includes('programme') || r === 'programme-specific') return 'role-ps';
  if (r.includes('innovation')) return 'role-innov';
  if (r.includes('thesis')) return 'role-thesis';
  return 'role-elective';
}

function StatusBadge({ status }) {
  if (status === 'LOCKED') return <span className="status-badge status-locked">LOCKED</span>;
  if (status === 'KEEP') return <span className="status-badge status-keep">KEEP</span>;
  if (status === 'FLEX') return <span className="status-badge status-flex">FLEX</span>;
  return null;
}

function GradeBadge({ grading }) {
  if (grading === 'P/F') return <span className="grade-badge grade-pf">P/F</span>;
  return <span className="grade-badge grade-7">7-pt</span>;
}

// ---- Course Table Row ----

function CourseRow({ course, flexId, flexChoices, onFlexChange }) {
  const isFlex = course.status === 'FLEX' && flexId;

  // If this is a flex row with a changed selection, use the alternative data
  let displayCourse = course;
  if (isFlex && flexChoices[flexId] && flexChoices[flexId] !== course.code) {
    const alt = FLEX_ALTERNATIVES[flexId];
    if (alt) {
      const selected = alt.options.find(o => o.code === flexChoices[flexId]);
      if (selected) {
        displayCourse = {
          ...course,
          code: selected.code,
          name: selected.name,
          ects: selected.ects,
          slot: selected.slot,
          exam: selected.exam,
          grading: selected.grading
        };
      }
    }
  }

  return (
    <tr className={isFlex ? 'flex-row' : ''}>
      <td className="code">
        <a 
          href={`https://kurser.dtu.dk/course/2026-2027/${displayCourse.code}?menulanguage=en`} 
          target="_blank" 
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          {displayCourse.code}
        </a>
      </td>
      <td>
        {isFlex ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="flex-select-wrap">
              <select
                className="flex-select"
                value={flexChoices[flexId] || course.code}
                onChange={e => onFlexChange(flexId, e.target.value)}
              >
                {FLEX_ALTERNATIVES[flexId].options.map(opt => (
                  <option key={opt.code} value={opt.code}>
                    {opt.code} — {opt.name}
                  </option>
                ))}
              </select>
              <span className="flex-select-arrow">▾</span>
            </div>
            <a
              href={`https://dtucourseanalyzer.pythonanywhere.com/course/${displayCourse.code}`}
              target="_blank"
              rel="noreferrer"
              title="Analyze Course"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background: 'var(--color-yellow)',
                color: 'var(--color-text)',
                border: '2px solid var(--color-text)',
                boxShadow: '2px 2px 0 var(--color-text)',
                textDecoration: 'none',
                fontWeight: '900',
                flexShrink: 0
              }}
            >
              ↗
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <a
              href={`https://dtucourseanalyzer.pythonanywhere.com/course/${displayCourse.code}`}
              target="_blank"
              rel="noreferrer"
              className="course-name"
              style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {displayCourse.name}
            </a>
            {COURSE_CATALOG[displayCourse.code]?.programs && COURSE_CATALOG[displayCourse.code].cat !== 'mandatory' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {COURSE_CATALOG[displayCourse.code].programs.map(prog => (
                  <span key={prog} style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--color-pink)', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>
                    {prog === 'hcai' ? 'HCAI' : 'AUTONOMOUS'}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="ects-cell">{displayCourse.ects}</td>
      <td className="slot-cell">
        <div style={{ fontWeight: 700 }}>{displayCourse.slot}</div>
        {SLOT_LABELS[displayCourse.slot] && displayCourse.slot !== SLOT_LABELS[displayCourse.slot] && (
          <div style={{ fontSize: '10px', color: 'var(--color-text)', opacity: 0.6, whiteSpace: 'nowrap' }}>{SLOT_LABELS[displayCourse.slot]}</div>
        )}
      </td>
      <td>
        <span className={`role-badge ${getRoleClass(displayCourse.role)}`}>
          {displayCourse.role}
        </span>
      </td>
      <td><StatusBadge status={course.status} /></td>
      <td><GradeBadge grading={displayCourse.grading} /></td>
    </tr>
  );
}

// ---- Semester Course Table ----

function SemesterTable({ courses, flexChoices, onFlexChange }) {
  return (
    <table className="course-table">
      <thead>
        <tr>
          <th style={{ width: 60 }}>Code</th>
          <th>Course</th>
          <th style={{ width: 45, textAlign: 'center' }}>ECTS</th>
          <th style={{ width: 80 }}>Slot / Time</th>
          <th style={{ width: 130 }}>Role</th>
          <th style={{ width: 90 }}>Status</th>
          <th style={{ width: 45 }}>Grade</th>
        </tr>
      </thead>
      <tbody>
        {courses.map(c => (
          <CourseRow
            key={c.flexId || c.code}
            course={c}
            flexId={c.flexId}
            flexChoices={flexChoices}
            onFlexChange={onFlexChange}
          />
        ))}
      </tbody>
    </table>
  );
}

// ---- Mini Card (January / June) ----

function MiniCard({ semester, flexChoices, onFlexChange }) {
  const course = semester.courses[0];
  if (!course) return null;

  return (
    <div className="bento-card bento-mini">
      <div className="mini-left">
        <span className="bento-card-title">{semester.title}</span>
        <span className="bento-card-period">{semester.period}</span>
        <span className="bento-card-ects">{semester.targetEcts} ECTS</span>
      </div>
      <div className="mini-right">
        <div className="mini-course-code">
          <a 
            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${course.code}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {course.code}
          </a>
        </div>
        <div className="mini-course-name" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <a
            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${course.code}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {course.name}
          </a>
          {COURSE_CATALOG[course.code]?.programs && COURSE_CATALOG[course.code].cat !== 'mandatory' && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
              {COURSE_CATALOG[course.code].programs.map(prog => (
                <span key={prog} style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--color-pink)', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>
                  {prog === 'hcai' ? 'HCAI' : 'AUTONOMOUS'}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mini-badges">
          <span className={`role-badge ${getRoleClass(course.role)}`}>{course.role}</span>
          <StatusBadge status={course.status} />
          <GradeBadge grading={course.grading} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TIMETABLE COMPONENT
// ============================================================
// ============================================================
// TIMETABLE COMPONENT
// ============================================================
export function Timetable({ semesters, flexChoices = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button className="toggle-tt-btn" onClick={() => setIsOpen(true)}>
        Show Weekly Timetable
      </button>
    );
  }

  // Define week matrix logic for DTU standard slots
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = [
    { label: 'Morning (8–12)', match: ['1A', '2B', '3A', '4B', '5A'] },
    { label: 'Afternoon (13–17)', match: ['2A', '1B', '4A', '3B', '5B'] },
    { label: 'Evening (18–22)', match: ['7'] }
  ];

  // Map each course to its grid cell
  const getCoursesForCell = (sem, dayIndex, timeMatchList) => {
    // DTU logic: 1A is Mon morning. So day 0, morning match contains '1A'.
    // Mon: 1A (M), 2A (A). Tue: 3A (M), 4A (A), 7 (E). Wed: 5A (M), 5B (A). 
    // Thu: 2B (M), 1B (A). Fri: 4B (M), 3B (A).
    const dayMapping = {
      'Mon': ['1A', '2A'],
      'Tue': ['3A', '4A', '7'],
      'Wed': ['5A', '5B'],
      'Thu': ['2B', '1B'],
      'Fri': ['4B', '3B']
    };
    
    const validSlotsForThisDayAndTime = timeMatchList.filter(s => dayMapping[days[dayIndex]].includes(s));

    let foundCourses = [];
    sem.courses.forEach(c => {
      const isFlex = c.status === 'FLEX' && c.flexId;
      let actualCode = c.code;
      let slot = c.slot;
      let name = c.name;

      if (isFlex && flexChoices[c.flexId]) {
        const flexOpt = FLEX_ALTERNATIVES[c.flexId]?.options?.find(o => o.code === flexChoices[c.flexId]);
        if (flexOpt) {
          actualCode = flexOpt.code;
          slot = flexOpt.slot;
          name = flexOpt.name;
        }
      }
      
      if (!slot) return;
      
      let normalizedSlot = slot;
      if (slot === 'F4A+B') normalizedSlot = 'F4A,F4B';
      if (slot === 'E4A+B') normalizedSlot = 'E4A,E4B';

      const isAutumnSem = sem.title.includes('Autumn') || sem.title.includes('sem1') || sem.title.includes('sem3');
      const isSpringSem = sem.title.includes('Spring') || sem.title.includes('sem2') || sem.title.includes('sem4');

      const isAutumnMatch = (slot === 'Autumn' && isAutumnSem);
      const isSpringMatch = (slot === 'Spring' && isSpringSem);

      if (isAutumnMatch || isSpringMatch || validSlotsForThisDayAndTime.some(s => normalizedSlot.includes(s))) {
        foundCourses.push({ code: actualCode, name: name, slot });
      }
    });
    return foundCourses;
  };

  return (
    <div className="timetable-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, color: 'var(--color-text)' }}>Weekly Timetable Overview</h3>
        <button className="choice-btn" onClick={() => setIsOpen(false)}>Hide Timetable</button>
      </div>
      
      <div className="timetable-grid">
        {semesters.filter(sem => !sem.mini && !sem.thesis && !sem.break).map((sem, i) => (
          <div key={i} className="timetable-sem" style={{ overflowX: 'auto' }}>
            <h4 style={{ marginBottom: 16 }}>{sem.title}</h4>
            <table className="tt-table" style={{ tableLayout: 'fixed', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Time</th>
                  {days.map(d => <th key={d} style={{ width: 'calc((100% - 120px) / 5)' }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {times.map((timeObj, tIdx) => (
                  <tr key={tIdx}>
                    <td className="tt-time-col">{timeObj.label}</td>
                    {days.map((d, dIdx) => {
                      const courses = getCoursesForCell(sem, dIdx, timeObj.match);
                      return (
                        <td key={dIdx} className="tt-cell">
                          {courses.map((c, cIdx) => (
                            <div key={cIdx} className="tt-course-box">
                              <div className="tt-c-code">{c.code}</div>
                              <div className="tt-c-name" style={{ fontSize: '10px', lineHeight: 1.2, margin: '2px 0' }}>{c.name}</div>
                              <div className="tt-c-slot">{c.slot}{SLOT_LABELS[c.slot] ? ` · ${SLOT_LABELS[c.slot]}` : ''}</div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Intensive Blocks section */}
      {semesters.some(sem => sem.mini && sem.courses && sem.courses.length > 0) && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 900, marginBottom: 12, borderBottom: '2px solid var(--color-border)', paddingBottom: 4 }}>Intensive Blocks</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {semesters.filter(sem => sem.mini && sem.courses && sem.courses.length > 0).map((sem, i) => (
              <div key={i} style={{ border: '2px solid var(--color-border)', padding: '0.75rem', minWidth: 200, background: 'var(--color-bg)' }}>
                <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8, borderBottom: '1px solid var(--color-border)', paddingBottom: 4 }}>{sem.title}</div>
                {sem.courses.map((c, ci) => (
                  <div key={ci} className="tt-course-box" style={{ marginBottom: 4 }}>
                    <div className="tt-c-code">{c.code}</div>
                    <div className="tt-c-name" style={{ fontSize: '10px', lineHeight: 1.2, margin: '2px 0' }}>{c.name}</div>
                    <div className="tt-c-slot">{c.slot}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function RecommendedPlan({ flexChoices, setFlexChoices }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  // Compute Specialization ECTS
  const specNameMap = {
    ai: "AI and Algorithms",
    cyber: "Cybersecurity",
    digital: "Digital Systems",
    embedded: "Embedded & Autonomous",
    safe: "Safe & Secure",
    software: "Software Engineering"
  };

  const specEcts = {};
  PLAN_SEMESTERS.forEach(sem => {
    sem.courses.forEach(c => {
      const isFlex = c.status === 'FLEX' && c.flexId;
      let actualCode = c.code;
      if (isFlex && flexChoices[c.flexId] && flexChoices[c.flexId] !== c.code) {
        const alt = FLEX_ALTERNATIVES[c.flexId];
        if (alt) {
          const selected = alt.options.find(o => o.code === flexChoices[c.flexId]);
          if (selected) {
            actualCode = selected.code;
          }
        }
      }
      
      const courseObj = COURSE_CATALOG[actualCode];
      if (courseObj && courseObj.cat !== 'elective' && courseObj.specs) {
        courseObj.specs.forEach(sId => {
          specEcts[sId] = (specEcts[sId] || 0) + (courseObj.ects || 5);
        });
      }
    });
  });

  const handleFlexChange = (flexId, newCode) => {
    setFlexChoices(prev => ({ ...prev, [flexId]: newCode }));
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Dynamically compute totals
  const totalEcts = 120;
  
  let psEcts = 0;
  let electiveEcts = 0;

  PLAN_SEMESTERS.forEach(sem => {
    sem.courses.forEach(c => {
      const isFlex = c.status === 'FLEX' && c.flexId;
      let actualCode = c.code;
      if (isFlex && flexChoices[c.flexId]) {
        const alt = FLEX_ALTERNATIVES[c.flexId]?.options?.find(o => o.code === flexChoices[c.flexId]);
        if (alt) actualCode = alt.code;
      }
      
      const courseObj = COURSE_CATALOG[actualCode];
      if (courseObj) {
        if (['core', 'prog', 'innov2'].includes(courseObj.cat)) {
          psEcts += courseObj.ects;
        } else if (courseObj.cat === 'elective') {
          electiveEcts += courseObj.ects;
        }
      }
    });
  });

  const fulfilledSpecs = Object.keys(specNameMap)
    .filter(sId => (specEcts[sId] || 0) >= 25)
    .map(sId => specNameMap[sId]);

  // Split semesters into pairs for bento layout
  const sem1 = PLAN_SEMESTERS.find(s => s.id === 'sem1');
  const jan1 = PLAN_SEMESTERS.find(s => s.id === 'jan1');
  const sem2 = PLAN_SEMESTERS.find(s => s.id === 'sem2');
  const jun1 = PLAN_SEMESTERS.find(s => s.id === 'jun1');
  const summer = PLAN_SEMESTERS.find(s => s.id === 'summer');
  const sem3 = PLAN_SEMESTERS.find(s => s.id === 'sem3');
  const jan2 = PLAN_SEMESTERS.find(s => s.id === 'jan2');
  const sem4 = PLAN_SEMESTERS.find(s => s.id === 'sem4');

  return (
    <>
      <div className="main">
      {/* ======== STATS BENTO ROW ======== */}
      <div className="bento-stats">
        <div className="bento-stat-card">
          <div className="bento-stat-num">{totalEcts}</div>
          <div className="bento-stat-label">Total ECTS</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: `${(totalEcts / 120) * 100}%`, background: 'var(--color-text)' }} />
          </div>
        </div>
        <div className="bento-stat-card">
          <div className="bento-stat-num">10</div>
          <div className="bento-stat-label">Mandatory Foundation</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: '100%', background: 'var(--color-cyan)' }} />
          </div>
        </div>
        <div className="bento-stat-card">
          <div className="bento-stat-num">{psEcts}</div>
          <div className="bento-stat-label">Programme-Specific</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: `${(psEcts / 50) * 100}%`, background: 'var(--color-yellow)' }} />
          </div>
        </div>

        <div className="bento-stat-card">
          <div className="bento-stat-num">{electiveEcts}</div>
          <div className="bento-stat-label">Electives</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: `${(electiveEcts / 30) * 100}%`, background: 'var(--color-pink)' }} />
          </div>
        </div>
        <div className="bento-stat-card">
          <div className="bento-stat-num">30</div>
          <div className="bento-stat-label">Thesis</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: '100%', background: 'var(--color-cyan)' }} />
          </div>
        </div>
      </div>

      {/* ======== LEGEND / STATUS KEY ======== */}
      <div className="bento-card legend-card">
        <span className="legend-title">Status:</span>
        <div className="legend-group"><span className="status-badge status-locked">LOCKED</span> removing breaks a requirement</div>
        <div className="legend-group"><span className="status-badge status-keep">KEEP</span> elective but core credential</div>
        <div className="legend-group"><span className="status-badge status-flex">FLEX</span> free to swap for thesis prereqs</div>
        <div className="legend-divider" />
        <span className="legend-title">Roles:</span>
        <div className="legend-group"><span className="role-badge role-foundation">Foundation</span></div>
        <div className="legend-group"><span className="role-badge role-core">Core Competence</span></div>
        <div className="legend-group"><span className="role-badge role-ps">Programme-specific</span></div>
        <div className="legend-group"><span className="role-badge role-innov">Innovation II</span></div>
        <div className="legend-group"><span className="role-badge role-elective">Elective</span></div>
        <div className="legend-group"><span className="role-badge role-thesis">Thesis</span></div>
      </div>

      {/* ======== SPEC TRACKER ======== */}
      <div className="bento-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <h3 style={{ fontSize: 12, fontWeight: 900, marginBottom: '0.75rem', textTransform: 'uppercase' }}>Specialization Tracker (Min 25 ECTS)</h3>
        <div className="spec-rows" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px 16px' }}>
          {Object.keys(specNameMap).map(specId => {
            const ectsVal = specEcts[specId] || 0;
            const pctVal = Math.min(100, (ectsVal / 25) * 100);
            const isMet = ectsVal >= 25;
            return (
              <div key={specId} className="spec-row" style={{ gap: '8px', alignItems: 'center', marginBottom: 0 }}>
                <span className="spec-check" style={{ color: isMet ? 'var(--color-cyan)' : 'var(--color-text)', fontSize: 12, fontWeight: 900 }}>{isMet ? '✓' : '○'}</span>
                <span className="spec-name" style={{ width: 140, fontSize: 11 }}>{specNameMap[specId]}</span>
                <div className="spec-bar-outer" style={{ height: 10, flex: 1, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-text)', boxShadow: 'inset 1px 1px 0px var(--color-text)' }}>
                  <div className="spec-bar-inner" style={{ width: `${pctVal}%`, height: '100%', background: 'var(--color-pink)', borderRight: '1px solid var(--color-text)' }}></div>
                </div>
                <span className="spec-num" style={{ fontSize: 11, width: 45 }}>{ectsVal}/25</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======== YEAR 1 ======== */}
      <div className="section-divider"><span>Year 1</span></div>

      <div className="bento-plan">
        <div className="bento-card">
          <div className="bento-card-header">
            <span className="bento-card-title">{sem1.title}</span>
            <span className="bento-card-period">{sem1.period}</span>
            <span className="bento-card-ects">{sem1.targetEcts} ECTS</span>
          </div>
          <div className="bento-card-note">{sem1.note}</div>
          <SemesterTable courses={sem1.courses} flexChoices={flexChoices} onFlexChange={handleFlexChange} />
        </div>

        <MiniCard semester={jan1} flexChoices={flexChoices} onFlexChange={handleFlexChange} />

        <div className="bento-card">
          <div className="bento-card-header">
            <span className="bento-card-title">{sem2.title}</span>
            <span className="bento-card-period">{sem2.period}</span>
            <span className="bento-card-ects">{sem2.targetEcts} ECTS</span>
          </div>
          <div className="bento-card-note">{sem2.note}</div>
          <SemesterTable courses={sem2.courses} flexChoices={flexChoices} onFlexChange={handleFlexChange} />
        </div>

        <MiniCard semester={jun1} flexChoices={flexChoices} onFlexChange={handleFlexChange} />

        <div className="bento-card summer-card">
          <div className="summer-title">{summer.title} — {summer.period}</div>
          <div className="summer-sub">{summer.note}</div>
        </div>
      </div>

      {/* ======== YEAR 2 ======== */}
      <div className="section-divider"><span>Year 2</span></div>

      <div className="bento-plan">
        <div className="bento-card">
          <div className="bento-card-header">
            <span className="bento-card-title">{sem3.title}</span>
            <span className="bento-card-period">{sem3.period}</span>
            <span className="bento-card-ects">{sem3.targetEcts} ECTS</span>
          </div>
          <div className="bento-card-note">{sem3.note}</div>
          <SemesterTable courses={sem3.courses} flexChoices={flexChoices} onFlexChange={handleFlexChange} />
        </div>

        <MiniCard semester={jan2} flexChoices={flexChoices} onFlexChange={handleFlexChange} />

        <div className="bento-card thesis-card">
          <div className="bento-card-header">
            <span className="bento-card-title">{sem4.title}</span>
            <span className="bento-card-period">{sem4.period}</span>
            <span className="bento-card-ects">{sem4.targetEcts} ECTS</span>
          </div>
          <h3>Master's Thesis — 30 ECTS</h3>
          <p>Industry-partnered thesis — your single most important career asset. This is what converts the degree into a job offer for international graduates.</p>
          <div className="thesis-tips">
            <div className="thesis-tip">Start researching company partners in <strong>Semester 2</strong>. DTU career office and department boards post live company collaboration opportunities.</div>
            <div className="thesis-tip">Contact supervisors by <strong>October of Semester 3</strong>. Supervisors fill up early.</div>
            <div className="thesis-tip">Target companies: <strong>Vestas, Grundfos, Terma, Ericsson Denmark, Siemens Gamesa, Kamstrup, Danfoss, MAN Energy</strong> — all have English-first engineering cultures and DTU pipelines.</div>
            <div className="thesis-tip">Suggested angle: <em>"Security architecture for AI-driven systems under NIS2 compliance constraints"</em> — or any AI + cybersecurity topic relevant to your partner company.</div>
          </div>
        </div>
      </div>



      {/* ======== CAREER ROADMAP ======== */}
      <div className="section-divider"><span>Career Roadmap</span></div>

      <div className="roadmap-card">
        <h3>Career Roadmap — The Execution Layer</h3>
        <p style={{ fontSize: 12, color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Hiring chain: <strong>student job → summer internship → industry thesis → graduate role</strong> — each step a referral into the next.
        </p>
        <div className="roadmap-timeline">
          {CAREER_ROADMAP.map((phase, i) => (
            <div className="roadmap-phase" key={i}>
              <div className="roadmap-phase-title">{phase.phase}</div>
              <ul className="roadmap-phase-items">
                {phase.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Timetable Feature */}
      <Timetable semesters={[sem1, sem2, sem3, sem4]} flexChoices={flexChoices} />
      </div>

      {/* PRINT-ONLY RENDER */}
      <div className="print-only">
        <div className="print-header">
          <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>Technical University of Denmark · MSc Computer Science & Engineering</div>
          <h1>DTU Study Plan — Recommended Plan</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '6px', fontSize: '12px' }}>
            <span><strong>Total ECTS:</strong> {totalEcts} / 120</span>
            {fulfilledSpecs.length > 0 && (
              <span><strong>Specializations:</strong> {fulfilledSpecs.join(', ')}</span>
            )}
          </div>
        </div>

        {PLAN_SEMESTERS.filter(s => !s.break).map((sem, idx) => (
          <div key={idx} className="sem-block">
            <div className="sem-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="sem-title" style={{ margin: 0 }}>{sem.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="sem-period" style={{ margin: 0 }}>{sem.period}</span>
                <span className="sem-ects-total" style={{ background: '#FFE500', border: '2px solid #000', padding: '2px 8px', fontWeight: 900, margin: 0 }}>{sem.targetEcts} ECTS</span>
              </div>
            </div>
            <table className="course-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Code</th>
                  <th>Course</th>
                  <th style={{ width: 45, textAlign: 'center' }}>ECTS</th>
                  <th style={{ width: 50 }}>Slot</th>
                  <th style={{ width: 120 }}>Exam</th>
                  <th style={{ width: 120 }}>Role</th>
                  <th style={{ width: 45 }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {sem.courses.map(course => {
                  const isFlex = course.status === 'FLEX' && course.flexId;
                  let displayCourse = course;
                  if (isFlex && flexChoices[course.flexId] && flexChoices[course.flexId] !== course.code) {
                    const alt = FLEX_ALTERNATIVES[course.flexId];
                    if (alt) {
                      const selected = alt.options.find(o => o.code === flexChoices[course.flexId]);
                      if (selected) {
                        displayCourse = { ...course, ...selected };
                      }
                    }
                  }
                  const codeDisplay = displayCourse.code === 'thesis' ? 'THESIS' : displayCourse.code;
                  return (
                    <tr key={displayCourse.code}>
                      <td className="code">
                        <a href={`https://kurser.dtu.dk/course/2026-2027/${displayCourse.code}?menulanguage=en`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                          {codeDisplay}
                        </a>
                      </td>
                      <td>
                        <a href={`https://dtucourseanalyzer.pythonanywhere.com/course/${displayCourse.code}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                          {displayCourse.name}
                        </a>
                      </td>
                      <td className="ects-cell">{displayCourse.ects}</td>
                      <td className="slot-cell">
                        <div style={{ fontWeight: 700 }}>{displayCourse.slot}</div>
                        {SLOT_LABELS[displayCourse.slot] && displayCourse.slot !== SLOT_LABELS[displayCourse.slot] && (
                          <div style={{ fontSize: '10px', color: 'var(--color-text)', opacity: 0.6, whiteSpace: 'nowrap' }}>{SLOT_LABELS[displayCourse.slot]}</div>
                        )}
                      </td>
                      <td>{displayCourse.exam}</td>
                      <td>
                        <span className={`role-badge ${getRoleClass(displayCourse.role)}`}>
                          {displayCourse.role}
                        </span>
                      </td>
                      <td><GradeBadge grading={displayCourse.grading} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* PRINT TIMETABLE for Sems 1-3 */}
        <div style={{ pageBreakBefore: 'always', padding: '0.5rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '3px solid #000', paddingBottom: '4px' }}>Weekly Timetable</h2>
          {[sem1, sem2, sem3].filter(Boolean).map((sem, i) => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            const dayMapping = {
              'Mon': ['1A', '2A'],
              'Tue': ['3A', '4A', '7'],
              'Wed': ['5A', '5B'],
              'Thu': ['2B', '1B'],
              'Fri': ['4B', '3B']
            };
            const times = [
              { label: '8–12', slots: ['1A', '2B', '3A', '4B', '5A'] },
              { label: '13–17', slots: ['2A', '1B', '4A', '3B', '5B'] },
              { label: '18–22', slots: ['7'] },
            ];

            const getCoursesForCell = (dayIdx, timeSlots) => {
              const validSlots = timeSlots.filter(s => dayMapping[days[dayIdx]].includes(s));
              let found = [];
              sem.courses.forEach(c => {
                let displayC = c;
                if (c.status === 'FLEX' && c.flexId && flexChoices[c.flexId] && flexChoices[c.flexId] !== c.code) {
                  const alt = FLEX_ALTERNATIVES[c.flexId];
                  if (alt) {
                    const selected = alt.options.find(o => o.code === flexChoices[c.flexId]);
                    if (selected) displayC = { ...c, ...selected };
                  }
                }
                if (!displayC.slot) return;

                const isAutumnSem = sem.title.includes('Autumn') || sem.id === 'sem1' || sem.id === 'sem3';
                const isSpringSem = sem.title.includes('Spring') || sem.id === 'sem2' || sem.id === 'sem4';

                const isAutumnMatch = (displayC.slot === 'Autumn' && isAutumnSem);
                const isSpringMatch = (displayC.slot === 'Spring' && isSpringSem);

                if (isAutumnMatch || isSpringMatch || validSlots.some(s => displayC.slot.includes(s))) {
                  found.push(displayC);
                }
              });
              return found;
            };

            return (
              <div key={i} style={{ marginBottom: '10px', pageBreakInside: 'avoid' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 900, marginBottom: '3px', textTransform: 'uppercase' }}>{sem.title}</h4>
                <table className="course-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={{ padding: '2px 4px', fontSize: '9px' }}>Time</th>
                      {days.map(d => <th key={d} style={{ padding: '2px 4px', fontSize: '9px' }}>{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {times.map((t, tIdx) => (
                      <tr key={tIdx}>
                        <td style={{ fontWeight: 900, padding: '2px 4px', fontSize: '9px' }}>{t.label}</td>
                        {days.map((d, dIdx) => {
                          const courses = getCoursesForCell(dIdx, t.slots);
                          return (
                            <td key={dIdx} style={{ verticalAlign: 'top', padding: '2px 4px', fontSize: '8px' }}>
                              {courses.length > 0 ? courses.map((c, cIdx) => (
                                <div key={cIdx} style={{ lineHeight: '1.1' }}>
                                  <strong>{c.code}</strong>
                                  <br/>
                                  <span style={{ fontSize: '7.5px', fontWeight: 400, color: '#333' }}>{c.name}</span>
                                </div>
                              )) : <span style={{ color: '#ccc' }}>—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
