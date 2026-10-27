import React, { useState } from 'react';
import { COURSE_CATALOG, FLEX_ALTERNATIVES } from '../courses';

// DTU Official Exam Sessions and Slot Mappings
export const EXAM_SESSIONS = [
  {
    id: 'winter_2026',
    semesterIds: ['sem1', 'jan1'],
    title: 'WINTER EXAM 2026 (DECEMBER 2026 – JANUARY 2027)',
    subTitle: 'DECEMBER 2026',
    rows: [
      { date: '6 Dec 2026', slot: '01001, 01003, 01025, 01034, 01035, 01037', slotCodes: ['01001', '01003', '01025', '01034', '01035', '01037'], grading: '12 Jan 2027' },
      { date: '7 Dec 2026', slot: 'E1A', slotCodes: ['E1A'], grading: '13 Jan 2027' },
      { date: '8 Dec 2026', slot: 'E1B', slotCodes: ['E1B'], grading: '14 Jan 2027' },
      { date: '9 Dec 2026', slot: 'E2A', slotCodes: ['E2A'], grading: '15 Jan 2027' },
      { date: '10 Dec 2026', slot: 'E2B', slotCodes: ['E2B'], grading: '18 Jan 2027' },
      { date: '11 Dec 2026', slot: 'E3A', slotCodes: ['E3A'], grading: '19 Jan 2027' },
      { date: '12 Dec 2026', slot: '01915, 10916, 10935', slotCodes: ['01915', '10916', '10935'], grading: '19 Jan 2027' },
      { date: '14 Dec 2026', slot: 'E3B', slotCodes: ['E3B'], grading: '20 Jan 2027' },
      { date: '15 Dec 2026', slot: 'E4A', slotCodes: ['E4A'], grading: '21 Jan 2027' },
      { date: '16 Dec 2026', slot: 'E4B', slotCodes: ['E4B'], grading: '22 Jan 2027' },
      { date: '17 Dec 2026', slot: 'E5A', slotCodes: ['E5A'], grading: '25 Jan 2027' },
      { date: '18 Dec 2026', slot: 'E5B', slotCodes: ['E5B'], grading: '26 Jan 2027' },
      { date: '19 Dec 2026', slot: '02323, 02402, 02403, 12105, 12106', slotCodes: ['02323', '02402', '02403', '12105', '12106'], grading: '26 Jan 2027' },
      { date: '21 Dec 2026', slot: 'E7', slotCodes: ['E7'], grading: '27 Jan 2027' },
      { date: '22 Jan 2027', slot: 'Jan (3-Week Intensive)', slotCodes: ['Jan', 'jan1'], isIntensive: true, grading: '29 Jan 2027' }
    ]
  },
  {
    id: 'summer_2027',
    semesterIds: ['sem2', 'jun1'],
    title: 'SUMMER EXAM 2027 (MAY 2027 – JUNE 2027)',
    subTitle: 'MAY – JUNE 2027',
    rows: [
      { date: '24 May 2027', slot: '01001, 01003, 01025, 01034', slotCodes: ['01001', '01003', '01025', '01034'], grading: '15 Jun 2027' },
      { date: '25 May 2027', slot: 'F1A', slotCodes: ['F1A'], grading: '15 Jun 2027' },
      { date: '26 May 2027', slot: 'F1B', slotCodes: ['F1B'], grading: '16 Jun 2027' },
      { date: '27 May 2027', slot: 'F2A', slotCodes: ['F2A'], grading: '17 Jun 2027' },
      { date: '28 May 2027', slot: 'F2B', slotCodes: ['F2B'], grading: '18 Jun 2027' },
      { date: '31 May 2027', slot: 'F3A', slotCodes: ['F3A'], grading: '21 Jun 2027' },
      { date: '1 Jun 2027', slot: 'F3B', slotCodes: ['F3B'], grading: '22 Jun 2027' },
      { date: '2 Jun 2027', slot: 'F4A', slotCodes: ['F4A'], grading: '23 Jun 2027' },
      { date: '3 Jun 2027', slot: 'F4B', slotCodes: ['F4B'], grading: '24 Jun 2027' },
      { date: '4 Jun 2027', slot: 'F5A', slotCodes: ['F5A'], grading: '25 Jun 2027' },
      { date: '7 Jun 2027', slot: 'F5B', slotCodes: ['F5B'], grading: '28 Jun 2027' },
      { date: '8 Jun 2027', slot: '02323, 02402, 12100, 12101, F7', slotCodes: ['02323', '02402', '12100', '12101', 'F7'], grading: '29 Jun 2027' },
      { date: '25 Jun 2027', slot: 'Jun (3-Week Intensive)', slotCodes: ['Jun', 'jun1'], isIntensive: true, grading: '2 Jul 2027' }
    ]
  },
  {
    id: 'winter_2027',
    semesterIds: ['sem3', 'jan2'],
    title: 'WINTER EXAM 2027 (DECEMBER 2027 – JANUARY 2028)',
    subTitle: 'DECEMBER 2027',
    rows: [
      { date: '6 Dec 2027', slot: '01001, 01003, 01025', slotCodes: ['01001', '01003', '01025'], grading: '12 Jan 2028' },
      { date: '7 Dec 2027', slot: 'E1A', slotCodes: ['E1A'], grading: '13 Jan 2028' },
      { date: '8 Dec 2027', slot: 'E1B', slotCodes: ['E1B'], grading: '14 Jan 2028' },
      { date: '9 Dec 2027', slot: 'E2A', slotCodes: ['E2A'], grading: '15 Jan 2028' },
      { date: '10 Dec 2027', slot: 'E2B', slotCodes: ['E2B'], grading: '18 Jan 2028' },
      { date: '11 Dec 2027', slot: 'E3A', slotCodes: ['E3A'], grading: '19 Jan 2028' },
      { date: '13 Dec 2027', slot: 'E3B', slotCodes: ['E3B'], grading: '20 Jan 2028' },
      { date: '14 Dec 2027', slot: 'E4A', slotCodes: ['E4A'], grading: '21 Jan 2028' },
      { date: '15 Dec 2027', slot: 'E4B', slotCodes: ['E4B'], grading: '22 Jan 2028' },
      { date: '16 Dec 2027', slot: 'E5A', slotCodes: ['E5A'], grading: '25 Jan 2028' },
      { date: '17 Dec 2027', slot: 'E5B', slotCodes: ['E5B'], grading: '26 Jan 2028' },
      { date: '18 Dec 2027', slot: '02807, 12105, 12106, E7', slotCodes: ['02807', '12105', '12106', 'E7'], grading: '26 Jan 2028' },
      { date: '21 Jan 2028', slot: 'Jan (3-Week Intensive)', slotCodes: ['Jan', 'jan2'], isIntensive: true, grading: '28 Jan 2028' }
    ]
  },
  {
    id: 'summer_2028',
    semesterIds: ['sem4'],
    title: 'SUMMER EXAM 2028 (MAY 2028 – JUNE 2028)',
    subTitle: 'JUNE 2028',
    rows: [
      { date: '15 Jun 2028', slot: 'Thesis Submission Deadline', slotCodes: ['thesis'], grading: '30 Jun 2028' },
      { date: '20–29 Jun 2028', slot: 'Thesis Oral Defense & Examination', slotCodes: ['thesis'], grading: '30 Jun 2028' }
    ]
  }
];

function resolveCourse(c, flexChoices = {}) {
  let code = c.code;
  let name = c.name;
  let slot = c.slot;
  let exam = c.exam;

  if (c.status === 'FLEX' && c.flexId && flexChoices[c.flexId]) {
    const alt = FLEX_ALTERNATIVES[c.flexId]?.options?.find(o => o.code === flexChoices[c.flexId]);
    if (alt) {
      code = alt.code;
      name = alt.name;
      slot = alt.slot;
      exam = alt.exam;
    }
  }

  const catItem = COURSE_CATALOG[code];
  if (catItem) {
    if (!slot) slot = catItem.slot;
    if (!exam) exam = catItem.exam;
    if (!name) name = catItem.name;
  }

  return { code, name, slot, exam };
}

const SPECIAL_EXAM_CODE_COURSES = [
  '12105', '12106', '02807', '02323', '02402', '02403',
  '01001', '01003', '01025', '01034', '01035', '01037',
  '01915', '10916', '10935'
];

// Find course matching a specific exam slot row
function findMatchingCourses(row, sessionCourses) {
  const matches = [];

  sessionCourses.forEach(c => {
    // 1. Direct course code match (e.g. 12105 in slotCodes) - takes highest priority
    if (row.slotCodes && row.slotCodes.includes(c.code)) {
      matches.push(c);
      return;
    }

    // If course has its own dedicated exam code slot elsewhere, do NOT match generic slot
    if (SPECIAL_EXAM_CODE_COURSES.includes(c.code)) {
      return;
    }

    // 2. Direct slot match (e.g. c.slot is 'E2B' and row has 'E2B')
    if (c.slot && row.slotCodes && row.slotCodes.includes(c.slot)) {
      matches.push(c);
      return;
    }

    // 3. Intensive block match (Jan / Jun / Aug)
    if (row.isIntensive) {
      if (c.slot === 'Jan' || c.slot === 'Jun' || c.slot === 'Aug') {
        if (row.slotCodes.some(sc => sc.toLowerCase() === c.slot.toLowerCase())) {
          matches.push(c);
          return;
        }
      }
    }

    // 4. Thesis match
    if (c.code === 'thesis' && row.slotCodes && row.slotCodes.includes('thesis')) {
      matches.push(c);
      return;
    }
  });

  return matches;
}

/**
 * DTUOfficialExamTimetable Table Component
 */
export function DTUExamSessionTable({ session, enrolledCourses }) {
  return (
    <div className="dtu-exam-session-block" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
      {/* Top Section Header with Double Rule matching official DTU format */}
      <div style={{ borderTop: '4px solid #000', borderBottom: '2px solid #000', padding: '6px 0 5px 0', marginBottom: '6px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading, "Space Grotesk", Arial, sans-serif)', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', margin: 0, letterSpacing: '0.3px', color: '#000' }}>
          {session.title}
        </h3>
      </div>
      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#444', marginBottom: '8px', letterSpacing: '0.4px' }}>
        {session.subTitle}
      </div>

      <table className="dtu-exam-table" style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', fontSize: '11px', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#FFE500', color: '#000' }}>
            <th style={{ width: '115px', padding: '8px 10px', textAlign: 'left', border: '1.5px solid #000', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.2px' }}>
              DATE
            </th>
            <th style={{ width: '145px', padding: '8px 10px', textAlign: 'left', border: '1.5px solid #000', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.2px' }}>
              EXAM SLOT
            </th>
            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1.5px solid #000', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.2px' }}>
              YOUR COURSES
            </th>
            <th style={{ width: '135px', padding: '8px 10px', textAlign: 'left', border: '1.5px solid #000', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.2px' }}>
              GRADING DEADLINE
            </th>
          </tr>
        </thead>
        <tbody>
          {session.rows.map((row, rIdx) => {
            const matches = findMatchingCourses(row, enrolledCourses);
            const isEnrolled = matches.length > 0;

            return (
              <tr 
                key={rIdx} 
                className={isEnrolled ? 'enrolled-row' : 'non-enrolled-row'}
                style={{ 
                  background: isEnrolled ? '#E6F9F5' : '#ffffff',
                  color: '#000'
                }}
              >
                <td style={{ padding: '7px 10px', border: '1px solid #000', fontWeight: isEnrolled ? 800 : 500, fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {row.date}
                </td>
                <td style={{ padding: '7px 10px', border: '1px solid #000', fontSize: row.slot.length > 20 ? '9px' : '11px', fontWeight: isEnrolled ? 800 : 400, color: '#000', lineHeight: 1.25 }}>
                  {row.slot}
                </td>
                <td style={{ padding: '7px 10px', border: '1px solid #000', lineHeight: 1.35 }}>
                  {isEnrolled ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {matches.map(c => {
                        const examStr = c.exam ? `(${c.exam})` : '';
                        return (
                          <div key={c.code} style={{ fontSize: '11px' }}>
                            <strong style={{ fontWeight: 800 }}>{c.code} {c.name}</strong>{' '}
                            {examStr && (
                              <span style={{ fontSize: '9.5px', fontWeight: 400, fontStyle: 'italic', color: '#2b2b2b' }}>
                                {examStr}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ color: '#bbb' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '7px 10px', border: '1px solid #000', fontWeight: isEnrolled ? 800 : 500, fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {row.grading}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Printable View: Appended directly to PDF Download
 */
export function PrintDTUOfficialExamTimetable({ semesters, flexChoices = {} }) {
  // Extract all courses organized by semester IDs
  return (
    <div style={{ pageBreakBefore: 'always', padding: '0.5rem 0' }}>
      {EXAM_SESSIONS.map(session => {
        // Collect courses for this session's semesters
        const sessionSemesters = semesters.filter(s => session.semesterIds.includes(s.id));
        const enrolledCourses = [];
        sessionSemesters.forEach(s => {
          if (s.courses) {
            s.courses.forEach(c => enrolledCourses.push(resolveCourse(c, flexChoices)));
          }
        });

        // Always show the session table (matches DTU official timetable)
        return (
          <DTUExamSessionTable 
            key={session.id} 
            session={session} 
            enrolledCourses={enrolledCourses} 
          />
        );
      })}
    </div>
  );
}

/**
 * Interactive Screen View (toggled on demand)
 */
export default function DTUOfficialExamTimetable({ semesters, flexChoices = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button className="toggle-exam-btn" onClick={() => setIsOpen(true)}>
        📋 Show Official Exam Timetable
      </button>
    );
  }

  return (
    <div className="timetable-container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, color: 'var(--color-text)', margin: 0 }}>
            Official DTU Exam Timetables & Grading Deadlines
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--color-text)', opacity: 0.7 }}>
            Official DTU slot timetable with exact dates, enrolled course highlights, and sensor grading deadlines.
          </p>
        </div>
        <button className="choice-btn" onClick={() => setIsOpen(false)}>Hide Exam Timetable</button>
      </div>

      <div>
        {EXAM_SESSIONS.map(session => {
          const sessionSemesters = semesters.filter(s => session.semesterIds.includes(s.id));
          const enrolledCourses = [];
          sessionSemesters.forEach(s => {
            if (s.courses) {
              s.courses.forEach(c => enrolledCourses.push(resolveCourse(c, flexChoices)));
            }
          });

          return (
            <div key={session.id} style={{ marginBottom: 28 }}>
              <DTUExamSessionTable session={session} enrolledCourses={enrolledCourses} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
