import React from 'react';

const EMBEDDED_COURSES = ['02203', '02211', '02214', '02225', '02226', '02249', '02258', '02291'];
const CYBER_COURSES = ['02231', '02232', '02234', '02270', '02271', '02275', '02276', '02277', '02278', '02291'];

const ELECTIVES_LIST = [
  { code: '02267', name: 'Software Development of Web Services', why: 'Adds cloud/API layer. Many embedded roles now involve IoT cloud connectivity (Grundfos, Kamstrup, Danfoss).', semText: 'F — Spring', ects: 5, timing: 'spring' },
  { code: '02268', name: 'Process-Oriented & Event-Driven Software Systems', why: 'Industrial automation and IoT event pipelines. Relevant to manufacturing and process industries — common in Denmark.', semText: 'F — Spring', ects: 5, timing: 'spring' },
  { code: '02278', name: 'Post-Quantum Cryptography', why: 'Forward bet — EU quantum regulation incoming. Rare skill that differentiates within security-aware embedded roles.', semText: 'June intensive', ects: 5, timing: 'june' },
  { code: '02234', name: 'Research Topics in Cybersecurity', why: 'Keeps you current on emerging threats. Good for thesis ideation if targeting OT/ICS security at Terma or telecom companies.', semText: 'E — Autumn', ects: 5, timing: 'autumn' },
  { code: '02285', name: 'AI and Multi-Agent Systems', why: 'If you want to angle toward robotics or autonomous systems — growing sector in Denmark (Universal Robots, MAN Energy).', semText: 'E — Autumn', ects: 7.5, timing: 'autumn' },
  { code: '31372', name: 'Hierarchical and Distributed Automation Systems', why: 'DTU Electro. Covers PLC, SCADA, and fieldbuses. Perfect for Danish industrial IoT roles (Grundfos, Danfoss) where embedded HW meets automation.', semText: 'F — Spring', ects: 5, timing: 'spring' },
  { code: '34760', name: 'Safety and Reliability in Robotic Systems', why: 'DTU Electro. Safety standards, risk analysis, reliability modeling. Critical for safety-critical and security-aware industrial embedded careers.', semText: 'E — Autumn', ects: 5, timing: 'autumn' },
  { code: '30310', name: 'Space Systems Engineering', why: 'DTU Space. Covers systems engineering, trade-offs, reliability, integration, and risk management in extreme environments. Excellent for complex systems.', semText: 'E — Autumn', ects: 5, timing: 'autumn' },
  { code: '22058', name: 'Wearable Sensors: Designing and Prototyping', why: 'DTU Health Tech. Hands-on design of wearable bio-sensors (ECG, IMU). Crucial if targeting Danish medical tech giants like Demant or GN Hearing.', semText: 'F — Spring', ects: 5, timing: 'spring' },
  { code: '22449', name: 'Introduction to Biomedical Product Development', why: 'DTU Health Tech. Medical device regulations, QA, and risk management (ISO 13485). Key for security-aware compliance engineering.', semText: 'E — Autumn', ects: 5, timing: 'autumn' },
  { code: '27510', name: 'Biosensors and Bioanalysis', why: 'DTU Bioengineering. Biological transducers, micro/nanofabrication, and sensor integration. Bridges biotech and physical sensors.', semText: 'F — Spring', ects: 5, timing: 'spring' },
  { code: 'other', name: 'Other outside-department course', why: 'Choose based on target industry. Wind energy → offshore systems. Pharma → biomedical devices. Maritime → autonomous vessels.', semText: 'varies', ects: 5, timing: 'both' }
];

export default function RecommendedPlan({
  choiceGroupSem3,
  setChoiceGroupSem3,
  selectedElectives,
  setSelectedElectives,
  semestersState,
  setSemestersState
}) {

  const toggleElective = (code) => {
    setSelectedElectives(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const toggleCourseSemester = (courseCode) => {
    setSemestersState(prev => {
      const current = prev[courseCode];
      let next = 'sem2';
      if (courseCode === '02225') {
        next = current === 'sem2' ? 'sem3' : 'sem2';
      } else if (courseCode === '02277') {
        next = current === 'sem2' ? 'sem3' : 'sem2';
      } else if (courseCode === '02231') {
        next = current === 'sem2' ? 'sem1' : 'sem2';
      }
      return { ...prev, [courseCode]: next };
    });
  };

  // Elective slot routing logic
  const getElectiveSlots = () => {
    const activeElectives = ELECTIVES_LIST.filter(e => selectedElectives.has(e.code));
    
    let slotSem2 = { code: '—', name: 'Free elective slot', ects: 5, why: 'Use the elective picker section below to select your preferred option.', timingHtml: <span className="timing timing-both">varies</span>, selected: false };
    let slotSem3 = { code: '—', name: 'Free elective slot', ects: 7.5, why: 'Use the elective picker section below.', timingHtml: <span className="timing timing-both">varies</span>, selected: false };

    let slot2Filled = false;
    let slot3Filled = false;
    const assigned = new Set();

    // 1. Assign Autumn or 7.5 ECTS electives to Sem 3 slot
    activeElectives.forEach(item => {
      const isAutumn = item.timing === 'autumn' || item.timing === 'both';
      const is7_5 = item.ects === 7.5;
      if ((isAutumn || is7_5) && !slot3Filled) {
        slotSem3 = {
          code: item.code,
          name: item.name,
          ects: item.ects,
          why: item.why,
          timingHtml: <span className={`timing timing-${item.timing}`}>{item.semText}</span>,
          selected: true
        };
        slot3Filled = true;
        assigned.add(item.code);
      }
    });

    // 2. Assign Spring or remaining electives to Sem 2 slot, then empty slot 3 if not filled
    activeElectives.forEach(item => {
      if (assigned.has(item.code)) return;
      if (!slot2Filled) {
        slotSem2 = {
          code: item.code,
          name: item.name,
          ects: item.ects,
          why: item.why,
          timingHtml: <span className={`timing timing-${item.timing}`}>{item.semText}</span>,
          selected: true
        };
        slot2Filled = true;
        assigned.add(item.code);
      } else if (!slot3Filled) {
        slotSem3 = {
          code: item.code,
          name: item.name,
          ects: item.ects,
          why: item.why,
          timingHtml: <span className={`timing timing-${item.timing}`}>{item.semText}</span>,
          selected: true
        };
        slot3Filled = true;
        assigned.add(item.code);
      }
    });

    return { slotSem2, slotSem3 };
  };

  const { slotSem2, slotSem3 } = getElectiveSlots();

  // Static structure definitions
  const sem1Courses = [
    { code: '02203', name: 'Design of Digital Systems', detail: 'FPGA hardware design, CAD tools, digital circuit implementation', ects: 5, cat: 'core', timing: 'E — Autumn', notes: 'Core pick 1 of 2. Hands-on with real hardware — good entry point.' },
    { code: '02226', name: 'Networked Embedded Systems', detail: 'Communication protocols, IoT architectures, real-world embedded labs', ects: 5, cat: 'prog', timing: 'E — Autumn', notes: 'Practical and lab-heavy. Accessible for new students. Core to your profile.' },
    { code: '02258', name: 'Parallel Computer Systems', detail: 'Concurrent programming, parallel architectures, performance models', ects: 5, cat: 'prog', timing: 'E — Autumn', notes: 'Autumn confirmed. Complements embedded track directly.' },
    { code: '02291', name: 'System Integration', detail: 'Heterogeneous systems, APIs, middleware, service-oriented architectures', ects: 5, cat: 'prog', timing: 'E — Autumn', notes: 'Counts toward Embedded specialization. Bridges hardware and software.' },
    { code: '12105', name: 'Quantitative Methods to Assess Sustainability', detail: 'Life-cycle assessment, environmental impact quantification', ects: 5, cat: 'mandatory', timing: 'E — Autumn (eve slot Tue 18–22)', notes: 'Tick-the-box requirement. Evening slot means minimal schedule clash. Light workload.' },
    { code: '02270', name: 'Cybersecurity Fundamentals', detail: 'Network security, threat modeling, secure systems design', ects: 5, cat: 'core', timing: 'E — Autumn', notes: 'Core pick 2 of 2 (or programme-specific). NIS2 literacy — useful for all Danish industrial roles. Not a detour.' }
  ];

  // If 02231 is moved to Autumn (Sem 1)
  if (semestersState['02231'] === 'sem1') {
    sem1Courses.push({
      code: '02231',
      name: 'Cryptography Fundamentals',
      detail: 'Symmetric/asymmetric crypto, protocols, mathematical foundations',
      ects: 5,
      cat: 'prog',
      timing: 'E — Autumn',
      notes: 'Moved to Sem 1. Embedded crypto on constrained devices is a valued specialism.',
      isToggled: true
    });
  }

  const janCourses = [
    { code: '42500', name: 'Innovation in Engineering', detail: 'Entrepreneurship, design thinking, innovation processes', ects: 5, cat: 'mandatory', timing: 'January', notes: 'Must complete. Also offered June (42501) or Aug (42504) if January fills up.' },
    { code: '02266', name: 'User Experience Engineering', detail: 'UI/UX methods, user research, prototyping, usability testing', ects: 5, cat: 'innov', timing: 'January', notes: 'Mandatory Innovation II pick. Practical and project-based — not heavy theory.' }
  ];

  const sem2Courses = [];
  if (semestersState['02225'] === 'sem2') {
    sem2Courses.push({
      code: '02225',
      name: 'Distributed Real-Time Systems',
      detail: 'Real-time scheduling, fault tolerance, distributed protocols, timing constraints',
      ects: 5,
      cat: 'core',
      timing: '⚠ verify — likely Spring',
      notes: 'The single most important course for your profile. Spring only (F4B). Confirm on Study Planner.',
      toggleBtn: <button className="choice-btn" style={{marginTop: 4, padding: '2px 6px', fontSize: 9, display: 'block'}} onClick={() => toggleCourseSemester('02225')}>Move to Autumn</button>
    });
  }

  sem2Courses.push({
    code: '02214',
    name: 'Hardware/Software Codesign',
    detail: 'FPGA-software interfaces, firmware-hardware boundary, co-simulation',
    ects: 5,
    cat: 'prog',
    timing: 'F — Spring',
    notes: 'Deepens the embedded layer. Firmware/hardware boundary is a key skill for Danish industrial jobs.'
  });

  if (semestersState['02231'] === 'sem2') {
    sem2Courses.push({
      code: '02231',
      name: 'Cryptography Fundamentals',
      detail: 'Symmetric/asymmetric crypto, protocols, mathematical foundations',
      ects: 5,
      cat: 'prog',
      timing: 'Spring (F)',
      notes: 'Move to Sem 1 if timing allows. Embedded crypto on constrained devices is a valued specialism.',
      toggleBtn: <button className="choice-btn" style={{marginTop: 4, padding: '2px 6px', fontSize: 9, display: 'block'}} onClick={() => toggleCourseSemester('02231')}>Move to Autumn (Sem 1)</button>
    });
  }

  if (semestersState['02277'] === 'sem2') {
    sem2Courses.push({
      code: '02277',
      name: 'Cyber Risk Management and Incident Response',
      detail: 'NIS2 compliance, risk frameworks, incident handling, governance',
      ects: 5,
      cat: 'prog',
      timing: '⚠ verify — likely Spring',
      notes: 'NIS2-directly relevant. Danish industrial employers increasingly expect this literacy. Confirm semester.',
      toggleBtn: <button className="choice-btn" style={{marginTop: 4, padding: '2px 6px', fontSize: 9, display: 'block'}} onClick={() => toggleCourseSemester('02277')}>Move to Autumn</button>
    });
  }

  const sem3Courses = [
    { code: '02211', name: 'Research Topics in Computer Architecture', detail: 'Advanced processor design, memory hierarchies, current research directions', ects: 5, cat: 'prog', timing: 'E — Autumn', notes: 'Rounds out Embedded specialization. Good for thesis ideation in hardware-adjacent topics.' }
  ];

  if (semestersState['02225'] === 'sem3') {
    sem3Courses.push({
      code: '02225',
      name: 'Distributed Real-Time Systems',
      detail: 'Real-time scheduling, fault tolerance, distributed protocols, timing constraints',
      ects: 5,
      cat: 'core',
      timing: 'Autumn',
      notes: 'Moved to Autumn. Confirm on Study Planner.',
      toggleBtn: <button className="choice-btn" style={{marginTop: 4, padding: '2px 6px', fontSize: 9, display: 'block'}} onClick={() => toggleCourseSemester('02225')}>Move to Spring (Sem 2)</button>
    });
  }

  if (semestersState['02277'] === 'sem3') {
    sem3Courses.push({
      code: '02277',
      name: 'Cyber Risk Management and Incident Response',
      detail: 'NIS2 compliance, risk frameworks, incident handling, governance',
      ects: 5,
      cat: 'prog',
      timing: 'Autumn',
      notes: 'Moved to Autumn. Confirm on Study Planner.',
      toggleBtn: <button className="choice-btn" style={{marginTop: 4, padding: '2px 6px', fontSize: 9, display: 'block'}} onClick={() => toggleCourseSemester('02277')}>Move to Spring (Sem 2)</button>
    });
  }

  // sem 3 hard options
  const isHard02249Selected = choiceGroupSem3 === '02249';
  const isHard02242Selected = choiceGroupSem3 === '02242';

  sem3Courses.push({
    code: '02249',
    name: <span>Computationally Hard Problems <span style={{color:'var(--text-faint)', fontWeight: 400, fontSize: 11}}>— option A</span></span>,
    detail: 'NP-completeness, approximation algorithms, exact exponential algorithms',
    ects: 7.5,
    cat: 'prog',
    timing: 'E — Autumn',
    notes: 'Counts toward Embedded specialization. Needed to reach 25 ECTS threshold. Challenging but broadens algorithmic thinking.',
    isChoice: true,
    choiceId: '02249',
    selected: isHard02249Selected,
    disabled: choiceGroupSem3 && !isHard02249Selected
  });

  sem3Courses.push({
    code: '02242',
    name: <span>Program Analysis <span style={{color:'var(--text-faint)', fontWeight: 400, fontSize: 11}}>— option B</span></span>,
    detail: 'Static analysis, dataflow, type systems, software reliability',
    ects: 7.5,
    cat: 'prog',
    timing: 'E — Autumn',
    notes: 'Software reliability angle — preferred if you target safety-critical software roles over pure hardware. Does not count toward Embedded specialization.',
    isChoice: true,
    choiceId: '02242',
    selected: isHard02242Selected,
    disabled: choiceGroupSem3 && !isHard02242Selected
  });

  sem3Courses.push({
    code: '02275',
    name: 'Ethical Hacking',
    detail: 'Penetration testing, vulnerability assessment, exploitation techniques',
    ects: 5,
    cat: 'prog',
    timing: 'E — Autumn',
    notes: 'Autumn (E5B — Wed 13–17). Top-listed skill in Danish market. Now no longer conflicts with 02270 (done in Sem 1).'
  });

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'mandatory': return 'cat-mandatory';
      case 'core': return 'cat-core';
      case 'prog': return 'cat-prog';
      case 'innov': return 'cat-innov';
      case 'elective': return 'cat-elective';
      case 'thesis': return 'cat-thesis';
      default: return 'cat-elective';
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'mandatory': return 'Mandatory foundation';
      case 'core': return 'Core competence';
      case 'prog': return 'Programme-specific';
      case 'innov': return 'Innovation II';
      case 'elective': return 'Free elective';
      case 'thesis': return 'Thesis';
      default: return 'Free elective';
    }
  };

  const getTimingBadge = (timing) => {
    if (timing.includes('Autumn')) return <span className="timing timing-autumn">E — Autumn</span>;
    if (timing.includes('Spring')) return <span className="timing timing-spring">F — Spring</span>;
    if (timing.includes('January')) return <span className="timing timing-jan">January</span>;
    if (timing.includes('verify')) return <span className="timing timing-verify">⚠ verify</span>;
    return <span className="timing timing-both">varies</span>;
  };

  // Calculate ECTS sum helper for a list of courses
  const getCoursesEctsSum = (courses) => {
    return courses.reduce((acc, c) => {
      if (c.disabled) return acc;
      return acc + c.ects;
    }, 0);
  };

  const sem1Sum = getCoursesEctsSum(sem1Courses);
  const janSum = getCoursesEctsSum(janCourses);
  const sem2Sum = getCoursesEctsSum(sem2Courses) + slotSem2.ects;
  const sem3Sum = getCoursesEctsSum(sem3Courses) + slotSem3.ects;

  return (
    <div className="main">
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#1B4B8A'}}></div>Mandatory foundation
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#4A2080'}}></div>Core competence
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#1A6B3A'}}></div>Programme-specific
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#7A4F00'}}></div>Innovation II
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#6B6860'}}></div>Free elective
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{background:'#0E5F5F'}}></div>Thesis
        </div>
        <div className="legend-item">
          <span className="timing timing-autumn">E</span> Autumn (efterår)
        </div>
        <div className="legend-item">
          <span className="timing timing-spring">F</span> Spring (forår)
        </div>
        <div className="legend-item">
          <span className="timing timing-jan">Jan</span> January intensive
        </div>
        <div className="legend-item">
          <span className="timing timing-verify">⚠ verify</span> Confirm on Study Planner
        </div>
      </div>

      {/* SEM 1 */}
      <div className="sem-block">
        <div className="sem-header">
          <span className="sem-title">Semester 1 — Autumn</span>
          <span className="sem-period">September – December</span>
          <span className="sem-ects-total">{sem1Sum} ECTS</span>
        </div>
        <div className="sem-note">Easing in: practical, hands-on courses. No heavy theory yet. Getting comfortable with DTU's system.</div>
        <table className="course-table">
          <thead>
            <tr>
              <th style={{width: 70}}>Code</th>
              <th>Course</th>
              <th style={{width: 50, textAlign: 'center'}}>ECTS</th>
              <th style={{width: 120}}>Category</th>
              <th style={{width: 110}}>Timing</th>
              <th style={{width: 250}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sem1Courses.map(course => (
              <tr key={course.code}>
                <td className="code">{course.code}</td>
                <td>
                  <div className="course-name">{course.name}</div>
                  <div className="course-detail">{course.detail}</div>
                </td>
                <td className="ects-cell">{course.ects}</td>
                <td><span className={`cat ${getCategoryClass(course.cat)}`}>{getCategoryLabel(course.cat)}</span></td>
                <td>{getTimingBadge(course.timing)}</td>
                <td className="course-detail">{course.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JANUARY */}
      <div className="sem-block">
        <div className="sem-header">
          <span className="sem-title">January Intensive</span>
          <span className="sem-period">3-week block · January</span>
          <span className="sem-ects-total">{janSum} ECTS</span>
        </div>
        <div className="sem-note">Mandatory foundation courses. Both run in January — confirm they don't clash within the same 3-week window via DTU Study Planner.</div>
        <table className="course-table">
          <thead>
            <tr>
              <th style={{width: 70}}>Code</th>
              <th>Course</th>
              <th style={{width: 50, textAlign: 'center'}}>ECTS</th>
              <th style={{width: 120}}>Category</th>
              <th style={{width: 90}}>Timing</th>
              <th style={{width: 250}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {janCourses.map(course => (
              <tr key={course.code}>
                <td className="code">{course.code}</td>
                <td>
                  <div className="course-name">{course.name}</div>
                  <div className="course-detail">{course.detail}</div>
                </td>
                <td className="ects-cell">{course.ects}</td>
                <td><span className={`cat ${getCategoryClass(course.cat)}`}>{getCategoryLabel(course.cat)}</span></td>
                <td>{getTimingBadge(course.timing)}</td>
                <td className="course-detail">{course.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="warn-box">⚠ Confirm both January courses run in different weeks of the 3-week block, or that they don't overlap. Check via DTU Study Planner once enrolled.</div>
      </div>

      {/* SEM 2 */}
      <div className="sem-block">
        <div className="sem-header">
          <span className="sem-title">Semester 2 — Spring</span>
          <span className="sem-period">February – May</span>
          <span className="sem-ects-total">{sem2Sum} ECTS</span>
        </div>
        <div className="sem-note">Core embedded depth. 02225 is your most important course — it's Spring only. Slightly lighter semester by design.</div>
        <table className="course-table">
          <thead>
            <tr>
              <th style={{width: 70}}>Code</th>
              <th>Course</th>
              <th style={{width: 50, textAlign: 'center'}}>ECTS</th>
              <th style={{width: 120}}>Category</th>
              <th style={{width: 120}}>Timing</th>
              <th style={{width: 250}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sem2Courses.map(course => (
              <tr key={course.code}>
                <td className="code">{course.code}</td>
                <td>
                  <div className="course-name">{course.name}</div>
                  <div className="course-detail">{course.detail}</div>
                </td>
                <td className="ects-cell">{course.ects}</td>
                <td><span className={`cat ${getCategoryClass(course.cat)}`}>{getCategoryLabel(course.cat)}</span></td>
                <td>
                  <div>{getTimingBadge(course.timing)}</div>
                  {course.toggleBtn}
                </td>
                <td className="course-detail">{course.notes}</td>
              </tr>
            ))}
            {/* ELECTIVE SLOT SEM 2 */}
            <tr className={`choice-row ${slotSem2.selected ? 'selected-choice' : ''}`}>
              <td className="code">{slotSem2.code}</td>
              <td>
                <div className="course-name">{slotSem2.name}</div>
                <div className="course-detail">{slotSem2.selected ? 'Selected Elective' : slotSem2.why}</div>
              </td>
              <td className="ects-cell">{slotSem2.ects}</td>
              <td><span className="cat cat-elective">Free elective</span></td>
              <td>{slotSem2.timingHtml}</td>
              <td className="course-detail">{slotSem2.selected ? slotSem2.why : 'Use the elective picker section below to select your preferred option.'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SEM 3 */}
      <div className="sem-block">
        <div className="sem-header">
          <span className="sem-title">Semester 3 — Autumn</span>
          <span className="sem-period">September – December</span>
          <span className="sem-ects-total">{sem3Sum} ECTS</span>
        </div>
        <div className="sem-note">Consolidation and thesis preparation. Start contacting potential thesis supervisors in October of this semester.</div>
        <table className="course-table">
          <thead>
            <tr>
              <th style={{width: 70}}>Code</th>
              <th>Course</th>
              <th style={{width: 50, textAlign: 'center'}}>ECTS</th>
              <th style={{width: 120}}>Category</th>
              <th style={{width: 120}}>Timing</th>
              <th style={{width: 250}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sem3Courses.map(course => (
              <tr
                key={course.code}
                className={
                  course.isChoice
                    ? `choice-row ${course.selected ? 'selected-choice' : ''} ${course.disabled ? 'disabled-choice' : ''}`
                    : ''
                }
              >
                <td className="code">{course.code}</td>
                <td>
                  <div className="course-name">{course.name}</div>
                  <div className="course-detail">{course.detail}</div>
                </td>
                <td className="ects-cell">{course.ects}</td>
                <td><span className={`cat ${getCategoryClass(course.cat)}`}>{getCategoryLabel(course.cat)}</span></td>
                <td>
                  <div>{getTimingBadge(course.timing)}</div>
                  {course.toggleBtn}
                </td>
                <td className="course-detail">{course.notes}</td>
              </tr>
            ))}
            {/* CHOICE PICKER PANEL FOR SEM 3 */}
            <tr style={{background: 'var(--amber-light)'}}>
              <td colSpan="6" style={{padding: '8px 10px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
                  <span style={{fontSize: 12, color: 'var(--amber)', fontWeight: 500}}>Pick one for semester 3:</span>
                  <button
                    className={`choice-btn ${isHard02249Selected ? 'active' : ''}`}
                    onClick={() => setChoiceGroupSem3('02249')}
                  >
                    Select 02249 — Computationally Hard Problems
                  </button>
                  <button
                    className={`choice-btn ${isHard02242Selected ? 'active' : ''}`}
                    onClick={() => setChoiceGroupSem3('02242')}
                  >
                    Select 02242 — Program Analysis
                  </button>
                  <span style={{fontSize: 11, color: 'var(--text-faint)', marginLeft: 4}}>
                    Note: 02249 counts toward Embedded specialization; 02242 does not.
                  </span>
                </div>
              </td>
            </tr>
            {/* ELECTIVE SLOT SEM 3 */}
            <tr className={`choice-row ${slotSem3.selected ? 'selected-choice' : ''}`}>
              <td className="code">{slotSem3.code}</td>
              <td>
                <div className="course-name">{slotSem3.name}</div>
                <div className="course-detail">{slotSem3.selected ? 'Selected Elective' : slotSem3.why}</div>
              </td>
              <td className="ects-cell">{slotSem3.ects}</td>
              <td><span className="cat cat-elective">Free elective</span></td>
              <td>{slotSem3.timingHtml}</td>
              <td className="course-detail">{slotSem3.selected ? slotSem3.why : 'Use the elective picker section below.'}</td>
            </tr>
          </tbody>
        </table>
        <div className="warn-box">⚠ 02277 (Cyber Risk Management) is tentatively placed in Semester 2 Spring. If it turns out to be Autumn-only, move it here and adjust elective slots accordingly. Always verify on DTU Study Planner.</div>
      </div>

      {/* ELECTIVE GRID */}
      <div className="divider"></div>
      <div className="section-title">Free elective slots — pick based on your target industry</div>
      <p style={{fontSize: 12, color: 'var(--text-muted)', marginBottom: '0.75rem'}}>
        You have one ~5 ECTS slot in Sem 2 and one ~7.5 ECTS slot in Sem 3. Click a card to select it. These are suggestions — you can also take any DTU course from another department.
      </p>
      <div className="elective-grid">
        {ELECTIVES_LIST.map(e => {
          const isSelected = selectedElectives.has(e.code);
          return (
            <div
              key={e.code}
              className={`elective-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleElective(e.code)}
            >
              <div className="elective-card-code">{e.code === 'other' ? 'OTHER' : e.code}</div>
              <div className="elective-card-name">{e.name}</div>
              <div className="elective-card-why">{e.why}</div>
              <div className="elective-card-meta">
                <span className={`timing timing-${e.timing}`}>{e.semText}</span>
                <span className="cat cat-elective" style={{marginLeft: 4}}>{e.ects} ECTS</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEM 4 THESIS */}
      <div className="divider"></div>
      <div className="sem-block">
        <div className="sem-header">
          <span className="sem-title">Semester 4 — Spring</span>
          <span className="sem-period">February – June</span>
          <span className="sem-ects-total">30 ECTS</span>
        </div>
        <div className="thesis-block">
          <h3>Master's Thesis — 30 ECTS</h3>
          <p style={{fontSize: 13, color: 'var(--teal)', lineHeight: 1.6}}>The thesis is your single most important career asset. An industry-partnered thesis is what converts the degree into a job offer for international graduates.</p>
          <div className="thesis-tips">
            <div className="thesis-tip">Start researching company partners in <strong>Semester 2</strong>. DTU career office and department boards post live company collaboration opportunities.</div>
            <div className="thesis-tip">Contact potential supervisors by <strong>October of Semester 3</strong>. Supervisors fill up early.</div>
            <div className="thesis-tip">Target companies: <strong>Vestas, Grundfos, Terma, Ericsson Denmark, Siemens Gamesa, Kamstrup, Danfoss, MAN Energy</strong> — all have English-first engineering cultures and DTU pipelines.</div>
            <div className="thesis-tip">Suggested angle: <em>"Security architecture for real-time networked embedded systems under NIS2 compliance constraints"</em> — or any OT/ICS security topic relevant to your partner company.</div>
            <div className="thesis-tip">Notify the head of study you want <strong>"Embedded and Distributed Systems"</strong> on your diploma before submitting the thesis.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
