import StudentPane from './StudentPane'
import InstructorPane from './InstructorPane'
import FeedbackPanel from './FeedbackPanel'
import { MathDisplay } from './MathDisplay'
import { getInstructorRouteForLecture } from '../lib/lectureLinks'

export default function LectureView({ lecture, user, onHome, onChapterMenu, onChangeRole }) {
  const isInstructor = user?.role === 'instructor'
  const instructorRoute = getInstructorRouteForLecture(lecture)

  return (
    <div className="lecture-json-workspace">
      <nav className="lecture-toolbar" aria-label="Lecture navigation">
        <div>
          <button className="text-button" type="button" onClick={onHome}>Home</button>
          <button className="text-button" type="button" onClick={onChapterMenu}>Chapter Menu</button>
        </div>
        <span>{lecture.title}</span>
      </nav>

      <header className="lecture-json-header">
        <div>
          <p className="eyebrow">{lecture.course}</p>
          <h1>{lecture.title}</h1>
          <MathDisplay>{lecture.description || 'Explore the key definitions, worked examples, and interactive questions for this chapter. Students see guided practice while instructors see full solutions, notes, and common misconceptions.'}</MathDisplay>
        </div>

        <div className="mode-toggle-panel">
          {instructorRoute && (
            <div style={{ marginBottom: 8 }}>
              <button className="text-button" onClick={() => { window.location.hash = instructorRoute }}>Open Instructor Lecture</button>
            </div>
          )}
          <div className="role-header">
            <strong>Current role</strong>
            <span>{isInstructor ? 'Instructor' : 'Student'}</span>
          </div>
          <label>
            <span>Switch role</span>
            <select value={user.role} onChange={(event) => onChangeRole(event.target.value)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <p className="mode-note">Instructor-only solutions, pacing notes, and teaching prompts are visible only in instructor mode.</p>
        </div>
      </header>

      <div className="lecture-json-grid">
        <StudentPane lecture={lecture} />
        <aside className="instructor-sidepane">
          <InstructorPane lecture={lecture} isInstructor={isInstructor} />
          <FeedbackPanel />
        </aside>
      </div>
    </div>
  )
}
