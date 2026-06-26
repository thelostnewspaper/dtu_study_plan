import React from 'react';
import { COURSE_CATALOG, getCategoryLabel, getCategoryClass } from '../courses';

const SEMESTERS = [
  { id: "sem1", title: "Semester 1 — Autumn", period: "September – December", targetEcts: 30 },
  { id: "jan", title: "January Intensive", period: "3-week block · January", targetEcts: 5 },
  { id: "sem2", title: "Semester 2 — Spring", period: "February – May", targetEcts: 30 },
  { id: "summer", title: "Summer Intensive", period: "June / August", targetEcts: 0 },
  { id: "sem3", title: "Semester 3 — Autumn", period: "September – December", targetEcts: 25 },
  { id: "sem4", title: "Semester 4 — Spring", period: "February – June", targetEcts: 30 }
];

export default function FinalPlan({ customState }) {
  // Compute grouped courses
  const semGroups = SEMESTERS.map(sem => {
    const semCourses = Object.entries(customState)
      .filter(([code, sId]) => sId === sem.id)
      .map(([code]) => {
        const c = COURSE_CATALOG[code];
        if (!c) return null;
        return {
          code,
          name: c.name,
          ects: c.ects,
          cat: c.cat,
          specs: c.specs
        };
      })
      .filter(Boolean);
    
    const ectsSum = semCourses.reduce((sum, c) => sum + c.ects, 0);
    return { ...sem, courses: semCourses, ectsSum };
  });

  const totalEcts = semGroups.reduce((sum, s) => sum + s.ectsSum, 0);

  return (
    <div style={{ padding: '0 2rem 2rem' }}>
      <div className="print-only" style={{ marginBottom: '1.5rem', borderBottom: '4px solid #000', paddingBottom: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Technical University of Denmark · MSc Computer Science & Engineering</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>DTU Study Plan — Custom Plan</h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '13px' }}>
          <span><strong>Total ECTS:</strong> {totalEcts} / 120</span>
        </div>
      </div>

      <div className="hide-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900 }}>Final Custom Plan</h2>
        <button 
          className="download-pdf-btn"
          style={{ fontSize: 14, padding: '8px 16px', background: 'var(--color-bg)', color: 'var(--color-text)', border: '2px solid var(--color-border)', boxShadow: '4px 4px 0px var(--color-text)', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => window.print()}
        >
          Download PDF
        </button>
      </div>

      <div className="bento-plan">
        {semGroups.map(sem => {
          if (sem.id === 'summer' && sem.courses.length === 0) {
            return (
              <div key={sem.id} className="bento-card summer-card hide-print">
                <div className="summer-title">{sem.title} — {sem.period}</div>
                <div className="summer-sub">No courses selected for Summer</div>
              </div>
            );
          }

          if (sem.id === 'jan' && sem.courses.length === 0) {
             return (
              <div key={sem.id} className="bento-card summer-card hide-print">
                <div className="summer-title">{sem.title} — {sem.period}</div>
                <div className="summer-sub">No courses selected for January</div>
              </div>
            );
          }

          return (
            <div key={sem.id} className="bento-card" style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
              <div className="bento-card-header">
                <span className="bento-card-title">{sem.title}</span>
                <span className="bento-card-period">{sem.period}</span>
                <span className="bento-card-ects">{sem.ectsSum} ECTS</span>
              </div>
              
              {sem.courses.length === 0 ? (
                <div style={{ padding: '1rem', fontStyle: 'italic', color: 'var(--text-faint)' }}>No courses assigned.</div>
              ) : (
                <table className="course-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Code</th>
                      <th>Course Name</th>
                      <th style={{ width: 60, textAlign: 'center' }}>ECTS</th>
                      <th style={{ width: 180 }}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map(c => (
                      <tr key={c.code}>
                        <td className="code">
                          <a 
                            href={`https://dtucourseanalyzer.pythonanywhere.com/course/${c.code}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {c.code === 'thesis' ? 'THESIS' : c.code}
                          </a>
                        </td>
                        <td>
                          <div className="course-name" style={{ fontSize: 13, fontWeight: 500 }}>
                            {c.name}
                          </div>
                        </td>
                        <td className="ects-cell" style={{ textAlign: 'center' }}>{c.ects}</td>
                        <td>
                          <span className={`role-badge ${getCategoryClass(c.cat)}`}>
                            {getCategoryLabel(c.cat)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
