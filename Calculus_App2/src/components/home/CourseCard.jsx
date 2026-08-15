export default function CourseCard({ code, title, descriptor, description, path, onBegin, actionLabel }) {
  const buttonLabel = actionLabel || `ENTER ${title.toUpperCase()}`

  return (
    <article className="home-course-card">
      <div className="course-card-header">
        <p className="course-card-code">{code}</p>
        <h3>{title}</h3>
        <p className="course-card-descriptor">{descriptor}</p>
      </div>
      <p className="course-card-description">{description}</p>
      <div className="course-card-track" aria-label={`${title} course path`}>
        {path.map((step, index) => (
          <span key={step} className="path-chip">
            <span className="chip-label">{step}</span>
            {index < path.length - 1 && <span className="chip-arrow" aria-hidden="true">&rarr;</span>}
          </span>
        ))}
      </div>
      <button className="primary-button course-card-action" type="button" onClick={onBegin}>
        {buttonLabel} <span aria-hidden="true">&rarr;</span>
      </button>
    </article>
  )
}
