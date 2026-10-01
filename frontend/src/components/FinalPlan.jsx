import React from 'react';
import { COURSE_CATALOG, getCategoryLabel, getCategoryClass } from '../courses';

import { SLOT_LABELS, Timetable } from './RecommendedPlan';

const SEMESTERS = [
  { id: "sem1", title: "Semester 1 — Autumn", period: "September – December", targetEcts: 30 },
  { id: "jan1", title: "January Intensive Y1", period: "3-week block · January", targetEcts: 5, mini: true },
  { id: "sem2", title: "Semester 2 — Spring", period: "February – May", targetEcts: 30 },
  { id: "jun1", title: "June Intensive Y1", period: "June", targetEcts: 5, mini: true },
  { id: "aug1", title: "August Intensive Y1", period: "August", targetEcts: 5, mini: true },
  { id: "sem3", title: "Semester 3 — Autumn", period: "September – December", targetEcts: 25 },
  { id: "jan2", title: "January Intensive Y2", period: "3-week block · January", targetEcts: 5, mini: true },
  { id: "sem4", title: "Semester 4 — Spring", period: "February – June", targetEcts: 30 }
];

export default function FinalPlan({ customState }) {
  // Compute grouped courses
  const semGroups = SEMESTERS.map(sem => {
    const semCourses = Object.entries(customState)
      .filter(([code, sId]) => {
        if (sem.id === 'jan1') return sId === 'jan1';
        if (sem.id === 'jan2') return sId === 'jan2';
        if (sem.id === 'jun1') return sId === 'jun1';
        if (sem.id === 'aug1') return sId === 'aug1';
        return sId === sem.id;
      })
      .map(([code]) => {
        const c = COURSE_CATALOG[code];
        if (!c) return null;
        return {
          code,
          name: c.name,
          ects: c.ects,
          cat: c.cat,
          specs: c.specs,
          slot: c.slot
        };
      })
      .filter(Boolean);
    
    const ectsSum = semCourses.reduce((sum, c) => sum + c.ects, 0);
    return { ...sem, courses: semCourses, ectsSum };
  });

  const specNameMap = {
    ai: "AI and Algorithms",
    cyber: "Cybersecurity",
    digital: "Digital Systems",
    embedded: "Embedded & Autonomous",
    safe: "Safe & Secure",
    software: "Software Engineering"
  };

  const specEcts = {};
  semGroups.forEach(sem => {
    sem.courses.forEach(c => {
      if (c.cat !== 'elective' && c.specs) {
        c.specs.forEach(sId => {
          specEcts[sId] = (specEcts[sId] || 0) + (c.ects || 5);
        });
      }
    });
  });

  const fulfilledSpecs = Object.keys(specNameMap)
    .filter(sId => (specEcts[sId] || 0) >= 25)
    .map(sId => specNameMap[sId]);

  const totalEcts = semGroups.reduce((acc, sem) => {
    if (sem.id === 'sem4') {
      // Always count thesis as 30 ECTS for sem4
      const hasThesis = sem.courses.some(c => c.code === 'thesis');
      return acc + sem.ectsSum + (hasThesis ? 0 : 30);
    }
    return acc + sem.ectsSum;
  }, 0);

  return (
    <div className="print-only">
      <div className="print-header">
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>Technical University of Denmark · MSc Computer Science & Engineering</div>
        <h1>DTU Study Plan — Custom Plan</h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '6px', fontSize: '12px' }}>
          <span><strong>Total ECTS:</strong> {totalEcts} / 120</span>
          {fulfilledSpecs.length > 0 && (
            <span><strong>Specializations:</strong> {fulfilledSpecs.join(', ')}</span>
          )}
        </div>
      </div>

      {semGroups.map(sem => {
      if (sem.mini && sem.courses.length === 0) return null;

        return (
          <div key={sem.id} className="sem-block">
            <div className="sem-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="sem-title" style={{ margin: 0 }}>{sem.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="sem-period" style={{ margin: 0 }}>{sem.period}</span>
                <span className="sem-ects-total" style={{ background: '#FFE500', border: '2px solid #000', padding: '2px 8px', fontWeight: 900, margin: 0 }}>
                  {sem.id === 'sem4'
                    ? sem.ectsSum + (sem.courses.some(c => c.code === 'thesis') ? 0 : 30)
                    : sem.ectsSum} ECTS
                </span>
              </div>
            </div>
            
            {sem.id === 'sem4' || sem.courses.length > 0 ? (
              <table className="course-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Code</th>
                    <th>Course</th>
                    <th style={{ width: 45, textAlign: 'center' }}>ECTS</th>
                    <th style={{ width: 80 }}>Slot</th>
                    <th style={{ width: 120 }}>Exam</th>
                    <th style={{ width: 130 }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.id === 'sem4' && !sem.courses.some(c => c.code === 'thesis') && (
                    <tr style={{ fontWeight: 700 }}>
                      <td className="code">THESIS</td>
                      <td>Master's Thesis Project</td>
                      <td className="ects-cell">30</td>
                      <td className="slot-cell"><div style={{ fontWeight: 700 }}>—</div></td>
                      <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Thesis + oral</td>
                      <td><span className="role-badge role-thesis">Thesis</span></td>
                    </tr>
                  )}
                  {sem.courses.map(c => {
                    const courseFull = COURSE_CATALOG[c.code] || c;
                    return (
                      <tr key={c.code}>
                        <td className="code">
                          <a 
                            href={c.code === 'thesis' ? 'https://kurser.dtu.dk/' : `https://kurser.dtu.dk/course/2026-2027/${c.code}?menulanguage=en`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {c.code === 'thesis' ? 'THESIS' : c.code}
                          </a>
                        </td>
                        <td>
                          <a 
                            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${c.code}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {c.name}
                          </a>
                        </td>
                        <td className="ects-cell">{c.ects}</td>
                        <td className="slot-cell">
                          <div style={{ fontWeight: 700 }}>{courseFull.slot || 'TBA'}</div>
                          {courseFull.slot && SLOT_LABELS[courseFull.slot] && courseFull.slot !== SLOT_LABELS[courseFull.slot] && (
                            <div style={{ fontSize: '10px', color: 'var(--color-text)', opacity: 0.6, whiteSpace: 'nowrap' }}>{SLOT_LABELS[courseFull.slot]}</div>
                          )}
                        </td>
                        <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                          {courseFull.exam || COURSE_CATALOG[c.code]?.exam || 'Exam TBA'}
                        </td>
                        <td>
                          <span className={`role-badge ${getCategoryClass(c.cat)}`}>
                            {getCategoryLabel(c.cat)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--color-text)', opacity: 0.6, fontSize: 12 }}>No courses assigned.</div>
            )}
          </div>
        );
      })}
      
      {/* Print Timetable */}
      <div style={{ pageBreakBefore: 'always', padding: '0.5rem 0' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '3px solid #000', paddingBottom: '4px' }}>Weekly Timetable</h2>
        {semGroups.filter(s => ['sem1', 'sem2', 'sem3'].includes(s.id)).map((sem, i) => {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
          const dayMapping = {
            'Mon': ['1A', '2A'],
            'Tue': ['3A', '4A', '7'],
            'Wed': ['5A', '5B'],
            'Thu': ['2B', '1B'],
            'Fri': ['4B', '3B']
          };
          const times = [
            { label: 'Morning (8–12)', match: ['1A', '2B', '3A', '4B', '5A'] },
            { label: 'Afternoon (13–17)', match: ['2A', '1B', '4A', '3B', '5B'] },
            { label: 'Evening (18–22)', match: ['7'] }
          ];

          return (
            <div key={i} className="timetable-sem-print">
              <h4 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', marginTop: '12px' }}>{sem.title}</h4>
              <table className="tt-table-print" style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse', fontSize: '9px', border: '1px solid #000' }}>
                <thead>
                  <tr style={{ background: '#eee' }}>
                    <th style={{ width: '80px', border: '1px solid #000', padding: '4px' }}>Time</th>
                    {days.map(d => <th key={d} style={{ border: '1px solid #000', padding: '4px' }}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {times.map((timeObj, tIdx) => (
                    <tr key={tIdx}>
                      <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 600 }}>{timeObj.label}</td>
                      {days.map((d, dIdx) => {
                        const validSlotsForThisDayAndTime = timeObj.match.filter(s => dayMapping[d].includes(s));
                        const coursesInCell = sem.courses.filter(c => {
                          const slot = COURSE_CATALOG[c.code]?.slot;
                          if (!slot) return false;
                          let normalizedSlot = slot;
                          if (slot === 'F4A+B') normalizedSlot = 'F4A,F4B';
                          if (slot === 'E4A+B') normalizedSlot = 'E4A,E4B';

                          const isAutumnSem = sem.title.includes('Autumn') || sem.id === 'sem1' || sem.id === 'sem3';
                          const isSpringSem = sem.title.includes('Spring') || sem.id === 'sem2' || sem.id === 'sem4';

                          const isAutumnMatch = (slot === 'Autumn' && isAutumnSem);
                          const isSpringMatch = (slot === 'Spring' && isSpringSem);

                          return isAutumnMatch || isSpringMatch || validSlotsForThisDayAndTime.some(s => normalizedSlot.includes(s));
                        });

                        return (
                          <td key={dIdx} style={{ border: '1px solid #000', padding: '4px', verticalAlign: 'top' }}>
                            {coursesInCell.map((c, cIdx) => (
                              <div key={cIdx} style={{ marginBottom: '4px' }}>
                                <strong>{c.code === 'thesis' ? 'THESIS' : c.code}</strong><br/>
                                <span style={{ fontSize: '8px' }}>{c.name}</span>
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
          );
        })}
        {/* Intensive Blocks section */}
        {semGroups.filter(s => s.mini && s.courses.length > 0).length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px', borderBottom: '2px solid #000', paddingBottom: '3px' }}>Intensive Blocks</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {semGroups.filter(s => s.mini && s.courses.length > 0).map((sem, i) => (
                <div key={i} style={{ border: '1px solid #000', padding: '6px', minWidth: 160 }}>
                  <div style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid #aaa', paddingBottom: '2px' }}>{sem.title}</div>
                  {sem.courses.map((c, ci) => (
                    <div key={ci} style={{ fontSize: '8px', marginBottom: '2px' }}>
                      <strong>{c.code}</strong> — {c.name} ({c.ects} ECTS)
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
