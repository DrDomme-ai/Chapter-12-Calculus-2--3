import { useState } from 'react'
import { MathDisplay } from './MathDisplay'

function InstructorSection({ section }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="instructor-section">
      <button type="button" className="expand-button" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Review'} instructor notes for {section.title}
      </button>
      {expanded && (
        <div className="instructor-notes">
          {section.examples?.map((example) => (
            <details key={example.id} className="example-notes">
              <summary>{example.title}</summary>
              <div className="example-teacher-text">
                <p><strong>Prompt:</strong> {example.prompt}</p>
                {example.interactive?.prompt && <p><strong>Student prompt:</strong> {example.interactive.prompt}</p>}
                <p><strong>Teaching note:</strong> Preview the strategy before students answer, then compare their approach to the instructor solution.</p>
                <MathDisplay>{example.instructorSolution}</MathDisplay>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}

export default function InstructorPane({ lecture, isInstructor }) {
  if (!isInstructor) {
    return (
      <div className="instructor-locked">
        <h2>Instructor-only panel</h2>
        <p>This panel is private. Switch to instructor mode to review full worked solutions and teaching prompts.</p>
      </div>
    )
  }

  return (
    <section className="instructor-pane">
      <div className="instructor-header">
        <h2>Instructor controls</h2>
        <p className="instructor-panel-note">Use this panel to preview solved examples, scaffold student thinking, and make quick annotation decisions.</p>
      </div>
      {lecture.sections.map((section) => (
        <InstructorSection key={section.id} section={section} />
      ))}
    </section>
  )
}
