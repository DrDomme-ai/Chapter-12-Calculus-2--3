export default function ReadinessCheckPlaceholder({ onHome }) {
  return (
    <div className="lecture-placeholder">
      <p className="lecture-label">Calculus Readiness Check</p>
      <h1>Readiness check coming soon</h1>
      <p>This placeholder will become a professional readiness assessment for Calculus II and Calculus III. It will help students identify prerequisite strengths and review needs before they continue.</p>
      <button className="primary-button" type="button" onClick={onHome}>Return home</button>
    </div>
  )
}
