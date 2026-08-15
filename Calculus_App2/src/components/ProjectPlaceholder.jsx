export default function ProjectPlaceholder({ onHome }) {
  return (
    <div className="page project-placeholder-page">
      <button className="text-button" type="button" onClick={onHome}>
        <span aria-hidden="true">&larr;</span> Home
      </button>
      <section className="project-placeholder-card" aria-labelledby="project-heading">
        <p className="eyebrow">Student project</p>
        <h1 id="project-heading">Teach a chapter through an interactive experience.</h1>
        <p>
          Students will eventually use this workspace to plan and build a chapter-level learning
          experience with definitions, intuition, examples, visualizations, practice, feedback,
          common mistakes, and a mastery assessment.
        </p>
        <div className="project-placeholder-status" role="status">
          <span aria-hidden="true">01</span>
          <div>
            <strong>Project workspace planned</strong>
            <p>The navigation entry is ready; authoring, submission, and assessment tools will be developed in a later milestone.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
