import InteractiveExample from './InteractiveExample'

function LectureSection({ section }) {
  return (
    <section className="student-section">
      <div className="section-heading">
        <div>
          <span className="section-tag">Concept</span>
          <h2>{section.title}</h2>
        </div>
      </div>
      <div className="section-content" dangerouslySetInnerHTML={{ __html: section.content }} />
      {section.examples?.map((example) => (
        <InteractiveExample key={example.id} example={example} isInstructor={false} />
      ))}
      {section.examples?.length === 0 && (
        <div className="student-placeholder">
          <p>This section introduces the idea for students before any guided example.</p>
        </div>
      )}
    </section>
  )
}

export default function StudentPane({ lecture }) {
  return (
    <section className="student-pane" aria-label="Student lesson content">
      <div className="student-summary">
        <span className="card-label">Learning Objectives</span>
        <ul>
          {lecture.learningObjectives?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {lecture.sections.map((section) => (
        <LectureSection section={section} key={section.id} />
      ))}
    </section>
  )
}
