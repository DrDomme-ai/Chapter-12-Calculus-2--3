function ChapterCard({ number, title, description, onClick, accent = false, actionLabel = 'Explore Chapter 12' }) {
  return (
    <button
      className={`course-card${accent ? ' accent' : ''}`}
      type="button"
      onClick={onClick}
      aria-label={`${actionLabel}: ${title}`}
    >
      <span className="course-number">{number}</span>
      <span className="course-title">{title}</span>
      <span className="course-description">{description}</span>
      <span className="course-link">{actionLabel} <span aria-hidden="true">&rarr;</span></span>
    </button>
  )
}

export default ChapterCard
