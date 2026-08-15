import { useState } from 'react'

export default function MathHeroVisual() {
  const [animateKey, setAnimateKey] = useState(0)
  return (
    <div className="home-visual-card" aria-label="A subtle mathematical visual showing a function curve and a three-dimensional vector representation.">
      <div className="visual-top">
        <div className="visual-panel graph-panel">
          <span className="visual-panel-label">Single-variable curve</span>
          <svg viewBox="0 0 320 220" aria-hidden="true" key={animateKey}>
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d766e" />
                <stop offset="100%" stopColor="#153b4a" />
              </linearGradient>
            </defs>
            <path className="graph-grid" d="M40 30 H300 M40 70 H300 M40 110 H300 M40 150 H300 M40 190 H300 M40 30 V190" />
            <path className="function-curve" d="M42 170 C90 130 130 80 170 100 C210 120 245 95 302 50" />
            <line className="tangent-line" x1="150" y1="52" x2="220" y2="32" />
            <circle className="curve-point" cx="170" cy="100" r="8" />
          </svg>
        </div>
        <div className="visual-panel space-panel">
          <span className="visual-panel-label">Multivariable geometry</span>
          <svg viewBox="0 0 320 220" aria-hidden="true">
            <g className="space-grid">
              <path d="M50 200 L160 90 L285 90" fill="none" />
              <path d="M50 200 L160 90 L160 20" fill="none" />
              <path d="M50 200 L285 90" fill="none" />
            </g>
            <g className="space-axes">
              <line x1="50" y1="200" x2="310" y2="200" />
              <line x1="50" y1="200" x2="160" y2="20" />
              <line x1="160" y1="90" x2="260" y2="42" />
            </g>
            <path className="vector-line" d="M50 200 L190 110" />
            <polygon className="vector-head" points="190,110 182,118 198,118" />
            <circle className="space-point" cx="190" cy="110" r="6" />
          </svg>
        </div>
      </div>
      <div className="home-visual-footer">
        <p>Explore calculus visually with a curve, tangent, and spatial vector model.</p>
        <button className="secondary-button" type="button" onClick={() => setAnimateKey((current) => current + 1)}>Reset view</button>
      </div>
    </div>
  )
}
