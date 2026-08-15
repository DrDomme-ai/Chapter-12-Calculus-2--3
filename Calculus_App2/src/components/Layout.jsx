function Layout({ children, onHome, onReview, onProject, onInstructor, activeView }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <button className="brand" type="button" onClick={onHome} aria-label="Interactive Calculus home">
          <span className="brand-mark" aria-hidden="true">&int;</span>
          <span>Interactive Calculus</span>
        </button>

        <nav className="site-navigation" aria-label="Primary navigation">
          <button type="button" onClick={onHome} aria-current={activeView === 'home' ? 'page' : undefined}>Home</button>
          <button type="button" onClick={onReview} aria-current={activeView === 'review-path' ? 'page' : undefined}>Fundamental Review</button>
          <button type="button" onClick={onProject} aria-current={activeView === 'project' ? 'page' : undefined}>Project</button>
          <button type="button" onClick={onInstructor} aria-current={activeView === 'instructor' ? 'page' : undefined}>Instructor Lectures</button>
        </nav>
      </header>
      <main id="main-content" tabIndex="-1">{children}</main>
      <footer>Dr. Domme &middot; Interactive mathematics for the classroom and beyond</footer>
    </div>
  )
}

export default Layout
