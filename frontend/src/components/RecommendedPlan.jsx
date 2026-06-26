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
          href={`https://dtucourseanalyzer.pythonanywhere.com/course/${displayCourse.code}`} 
          target="_blank" 
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          {displayCourse.code}
        </a>
      </td>
      <td>
        {isFlex ? (
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
        ) : (
          <a
            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${displayCourse.code}`}
            target="_blank"
            rel="noreferrer"
            className="course-name"
            style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {displayCourse.name}
          </a>
        )}
      </td>
      <td className="ects-cell">{displayCourse.ects}</td>
      <td className="slot-cell">{displayCourse.slot}</td>
      <td className="exam-cell">{displayCourse.exam}</td>
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
          <th style={{ width: 50 }}>Slot</th>
          <th style={{ width: 140 }}>Exam</th>
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
        <div className="mini-course-name">
          <a
            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${course.code}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {course.name}
          </a>
        </div>
        <div className="mini-detail">{course.exam}</div>
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
function Timetable({ semesters, flexChoices }) {
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
      const isFlex = c.code === 'choice';
      const actualCode = isFlex ? flexChoices[c.id] : c.code;
      // In Recommended Plan, courses.js PLAN_SEMESTERS holds the `slot` directly or we find it in FLEX_ALTERNATIVES
      let slot = c.slot;
      if (isFlex) {
        // Find slot from FLEX_ALTERNATIVES
        const { FLEX_ALTERNATIVES } = require('../courses');
        const flexOpt = FLEX_ALTERNATIVES[c.id]?.options?.find(o => o.code === actualCode);
        if (flexOpt) slot = flexOpt.slot;
      }
      
      if (!slot) return;
      // Check if slot ends with any of validSlotsForThisDayAndTime
      // e.g. "E1A" ends with "1A"
      if (validSlotsForThisDayAndTime.some(s => slot.includes(s))) {
        foundCourses.push({ code: actualCode, name: c.name, slot });
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
            <table className="tt-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Time</th>
                  {days.map(d => <th key={d}>{d}</th>)}
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
                              <div className="tt-c-slot">{c.slot}</div>
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
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function RecommendedPlan() {
  const [flexChoices, setFlexChoices] = useState({
    sem2_flex: '02417',
    sem3_flex1: '02517',
    sem3_flex2: '02807'
  });

  const [checkedItems, setCheckedItems] = useState(new Set());

  const handleFlexChange = (flexId, code) => {
    setFlexChoices(prev => ({ ...prev, [flexId]: code }));
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Compute totals
  const totalEcts = PLAN_SEMESTERS.reduce((sum, sem) => sum + sem.targetEcts, 0);
  const cyberEcts = PLAN_SEMESTERS.flatMap(s => s.courses)
    .filter(c => CYBER_SPEC_COURSES.includes(c.code))
    .reduce((sum, c) => sum + c.ects, 0);
  const psEcts = PLAN_SEMESTERS.flatMap(s => s.courses)
    .filter(c => PS_COURSES.includes(c.code))
    .reduce((sum, c) => sum + c.ects, 0);
  const electiveEcts = PLAN_SEMESTERS.flatMap(s => s.courses)
    .filter(c => c.status === 'FLEX' || c.status === 'KEEP')
    .reduce((sum, c) => sum + c.ects, 0);

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
          <div className="bento-stat-num">{cyberEcts}</div>
          <div className="bento-stat-label">Cyber Spec</div>
          <div className="bento-stat-bar">
            <div className="bento-stat-fill" style={{ width: `${(cyberEcts / 25) * 100}%`, background: 'var(--color-cyan)' }} />
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
        <div className="legend-divider" />
        <div className="legend-group"><span className="cyber-dot" /> = counts toward Cybersecurity spec</div>
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
  );
}
