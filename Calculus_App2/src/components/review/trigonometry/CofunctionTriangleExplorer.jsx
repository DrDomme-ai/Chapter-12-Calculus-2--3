import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'
import '../../../styles/cofunction-triangle-explorer.css'

const MIN_ANGLE = 1
const MAX_ANGLE = 89
const VISUAL_HYPOTENUSE = 292

const exactValues = {
  30: {
    sin: String.raw`\frac{1}{2}`,
    cos: String.raw`\frac{\sqrt{3}}{2}`,
    tan: String.raw`\frac{\sqrt{3}}{3}`,
    sec: String.raw`\frac{2\sqrt{3}}{3}`,
    csc: '2',
  },
  45: {
    sin: String.raw`\frac{\sqrt{2}}{2}`,
    cos: String.raw`\frac{\sqrt{2}}{2}`,
    tan: '1',
    sec: String.raw`\sqrt{2}`,
    csc: String.raw`\sqrt{2}`,
  },
  60: {
    sin: String.raw`\frac{\sqrt{3}}{2}`,
    cos: String.raw`\frac{1}{2}`,
    tan: String.raw`\sqrt{3}`,
    sec: '2',
    csc: String.raw`\frac{2\sqrt{3}}{3}`,
  },
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function greatestCommonDivisor(first, second) {
  let a = Math.abs(Math.round(first))
  let b = Math.abs(Math.round(second))
  while (b) {
    const remainder = a % b
    a = b
    b = remainder
  }
  return a || 1
}

function radiansMath(degrees) {
  const divisor = greatestCommonDivisor(degrees, 180)
  const numerator = degrees / divisor
  const denominator = 180 / divisor
  if (denominator === 1) return numerator === 1 ? String.raw`\pi` : String.raw`${numerator}\pi`
  return numerator === 1
    ? String.raw`\frac{\pi}{${denominator}}`
    : String.raw`\frac{${numerator}\pi}{${denominator}}`
}

function decimalMath(value) {
  return value.toFixed(4)
}

function RelationshipCard({ label, side, leftMath, rightMath, valueMath, explanation }) {
  return (
    <article className={`cofunction-relationship-card is-side-${side}`}>
      <header>
        <span>{label}</span>
        <strong>same side {side}</strong>
      </header>
      <div className="cofunction-equality">
        <div><MathInline>{leftMath}</MathInline></div>
        <span aria-label="equals">=</span>
        <div><MathInline>{rightMath}</MathInline></div>
      </div>
      <div className="cofunction-shared-value">
        Both use <MathInline>{valueMath}</MathInline>
      </div>
      <p>{explanation}</p>
    </article>
  )
}

export function CofunctionTriangleExplorer({ initialAngle = 30 }) {
  const parsedInitialAngle = Number(initialAngle)
  const safeInitialAngle = Number.isFinite(parsedInitialAngle)
    ? clamp(Math.round(parsedInitialAngle), MIN_ANGLE, MAX_ANGLE)
    : 30
  const [theta, setTheta] = useState(safeInitialAngle)
  const [viewpoint, setViewpoint] = useState('theta')
  const headingId = useId()
  const descriptionId = useId()
  const readoutId = useId()

  const complement = 90 - theta
  const thetaRadians = radiansMath(theta)
  const complementRadians = radiansMath(complement)
  const exact = exactValues[theta]

  const triangle = useMemo(() => {
    const radians = (theta * Math.PI) / 180
    const sine = Math.sin(radians)
    const cosine = Math.cos(radians)
    const tangent = sine / cosine
    const origin = { x: 82, y: 336 }
    const rightCorner = { x: origin.x + VISUAL_HYPOTENUSE * cosine, y: origin.y }
    const upperCorner = { x: rightCorner.x, y: origin.y - VISUAL_HYPOTENUSE * sine }

    return {
      sine,
      cosine,
      tangent,
      secant: 1 / cosine,
      cosecant: 1 / sine,
      origin,
      rightCorner,
      upperCorner,
    }
  }, [theta])

  const viewingTheta = viewpoint === 'theta'
  const activeAngleName = viewingTheta ? 'theta' : 'phi'
  const activeAngleMath = viewingTheta ? String.raw`\theta` : String.raw`\phi=\frac{\pi}{2}-\theta`
  const horizontalRole = viewingTheta ? 'ADJACENT' : 'OPPOSITE'
  const verticalRole = viewingTheta ? 'OPPOSITE' : 'ADJACENT'
  const thetaArcRadius = 48
  const thetaArcEnd = {
    x: triangle.origin.x + thetaArcRadius * triangle.cosine,
    y: triangle.origin.y - thetaArcRadius * triangle.sine,
  }
  const phiArcRadius = 43
  const phiArcStart = { x: triangle.upperCorner.x, y: triangle.upperCorner.y + phiArcRadius }
  const phiArcEnd = {
    x: triangle.upperCorner.x - phiArcRadius * triangle.sine,
    y: triangle.upperCorner.y + phiArcRadius * triangle.cosine,
  }
  const exactOrApproximate = {
    sin: exact?.sin ?? decimalMath(triangle.sine),
    cos: exact?.cos ?? decimalMath(triangle.cosine),
    tan: exact?.tan ?? decimalMath(triangle.tangent),
    sec: exact?.sec ?? decimalMath(triangle.secant),
    csc: exact?.csc ?? decimalMath(triangle.cosecant),
  }
  const valueRelation = exact ? '=' : String.raw`\approx`
  const horizontalLength = triangle.rightCorner.x - triangle.origin.x
  const verticalLength = triangle.rightCorner.y - triangle.upperCorner.y
  const rightAngleMarkerSize = Math.max(2, Math.min(18, horizontalLength * 0.42, verticalLength * 0.42))

  const reset = () => {
    setTheta(safeInitialAngle)
    setViewpoint('theta')
  }

  return (
    <section className="cofunction-triangle-explorer" aria-labelledby={headingId}>
      <header className="cofunction-explorer-heading">
        <div>
          <span className="card-label">Interactive side-role switch</span>
          <h3 id={headingId}>Same triangle. Different point of view.</h3>
          <p id={descriptionId}>The two acute angles share one right triangle. Switch the viewpoint and watch the same two legs exchange the jobs <strong>opposite</strong> and <strong>adjacent</strong>.</p>
        </div>
        <div className="cofunction-complement-badge">
          <MathInline>{String.raw`\theta+\phi=90^\circ=\frac{\pi}{2}`}</MathInline>
        </div>
      </header>

      <div className="cofunction-explorer-layout">
        <div className="cofunction-triangle-stage">
          <div className="cofunction-view-banner" aria-live="polite">
            <span>Viewing from</span>
            <strong><MathInline>{activeAngleMath}</MathInline></strong>
            <small>The triangle has not moved—only the point of view changed.</small>
          </div>

          <div className="cofunction-triangle-scroll" tabIndex="0" aria-label="Triangle diagram; scroll horizontally on a small screen if needed">
          <svg viewBox="0 0 540 410" role="img" aria-labelledby={`${headingId}-visual-title ${headingId}-visual-description`}>
            <title id={`${headingId}-visual-title`}>One right triangle viewed from two complementary angles</title>
            <desc id={`${headingId}-visual-description`}>
              Angle theta is {theta} degrees and angle phi is {complement} degrees. From {activeAngleName}, horizontal side b is {horizontalRole.toLowerCase()}, vertical side a is {verticalRole.toLowerCase()}, and side c remains the hypotenuse.
            </desc>

            <polygon
              points={`${triangle.origin.x},${triangle.origin.y} ${triangle.rightCorner.x},${triangle.rightCorner.y} ${triangle.upperCorner.x},${triangle.upperCorner.y}`}
              className="cofunction-triangle-area"
            />
            <line x1={triangle.origin.x} y1={triangle.origin.y} x2={triangle.rightCorner.x} y2={triangle.rightCorner.y} className="cofunction-side cofunction-side-b" />
            <line x1={triangle.rightCorner.x} y1={triangle.rightCorner.y} x2={triangle.upperCorner.x} y2={triangle.upperCorner.y} className="cofunction-side cofunction-side-a" />
            <line x1={triangle.origin.x} y1={triangle.origin.y} x2={triangle.upperCorner.x} y2={triangle.upperCorner.y} className="cofunction-side cofunction-side-c" />

            <path
              d={`M ${triangle.rightCorner.x - rightAngleMarkerSize} ${triangle.rightCorner.y} L ${triangle.rightCorner.x - rightAngleMarkerSize} ${triangle.rightCorner.y - rightAngleMarkerSize} L ${triangle.rightCorner.x} ${triangle.rightCorner.y - rightAngleMarkerSize}`}
              className="cofunction-right-angle"
            />
            <text x={triangle.rightCorner.x - 7} y={triangle.rightCorner.y - 7} textAnchor="end" className="cofunction-right-label">90°</text>

            <path
              d={`M ${triangle.origin.x + thetaArcRadius} ${triangle.origin.y} A ${thetaArcRadius} ${thetaArcRadius} 0 0 0 ${thetaArcEnd.x} ${thetaArcEnd.y}`}
              className={`cofunction-angle-arc${viewingTheta ? ' is-active' : ''}`}
            />
            <text x={triangle.origin.x + 60 * Math.cos((theta * Math.PI) / 360)} y={triangle.origin.y - 60 * Math.sin((theta * Math.PI) / 360)} className={`cofunction-angle-label${viewingTheta ? ' is-active' : ''}`}>θ</text>

            <path
              d={`M ${phiArcStart.x} ${phiArcStart.y} A ${phiArcRadius} ${phiArcRadius} 0 0 1 ${phiArcEnd.x} ${phiArcEnd.y}`}
              className={`cofunction-angle-arc${viewingTheta ? '' : ' is-active'}`}
            />
            <text x={triangle.upperCorner.x - 55 * Math.sin((complement * Math.PI) / 360)} y={triangle.upperCorner.y + 55 * Math.cos((complement * Math.PI) / 360)} className={`cofunction-angle-label${viewingTheta ? '' : ' is-active'}`}>φ</text>

            <g className="cofunction-side-label cofunction-label-b">
              <rect x={(triangle.origin.x + triangle.rightCorner.x) / 2 - 69} y={triangle.origin.y + 13} width="138" height="42" rx="9" />
              <text x={(triangle.origin.x + triangle.rightCorner.x) / 2} y={triangle.origin.y + 31} textAnchor="middle">{horizontalRole}</text>
              <text x={(triangle.origin.x + triangle.rightCorner.x) / 2} y={triangle.origin.y + 46} textAnchor="middle">side b</text>
            </g>

            <g className="cofunction-side-label cofunction-label-a">
              <rect x={triangle.rightCorner.x + 10} y={(triangle.rightCorner.y + triangle.upperCorner.y) / 2 - 21} width="138" height="42" rx="9" />
              <text x={triangle.rightCorner.x + 79} y={(triangle.rightCorner.y + triangle.upperCorner.y) / 2 - 3} textAnchor="middle">{verticalRole}</text>
              <text x={triangle.rightCorner.x + 79} y={(triangle.rightCorner.y + triangle.upperCorner.y) / 2 + 13} textAnchor="middle">side a</text>
            </g>

            <g className="cofunction-side-label cofunction-label-c">
              <rect x={(triangle.origin.x + triangle.upperCorner.x) / 2 - 71} y={(triangle.origin.y + triangle.upperCorner.y) / 2 - 50} width="142" height="42" rx="9" />
              <text x={(triangle.origin.x + triangle.upperCorner.x) / 2} y={(triangle.origin.y + triangle.upperCorner.y) / 2 - 31} textAnchor="middle">HYPOTENUSE</text>
              <text x={(triangle.origin.x + triangle.upperCorner.x) / 2} y={(triangle.origin.y + triangle.upperCorner.y) / 2 - 15} textAnchor="middle">side c</text>
            </g>
          </svg>
          </div>

          <dl className="cofunction-role-summary">
            <div className="is-side-a"><dt>Side a · vertical</dt><dd>{verticalRole} to {viewingTheta ? 'θ' : 'φ'}</dd></div>
            <div className="is-side-b"><dt>Side b · horizontal</dt><dd>{horizontalRole} to {viewingTheta ? 'θ' : 'φ'}</dd></div>
            <div className="is-side-c"><dt>Side c · longest</dt><dd>HYPOTENUSE from either angle</dd></div>
          </dl>
        </div>

        <section id={readoutId} className="cofunction-relationships" aria-labelledby={`${headingId}-relationships`}>
          <header>
            <span className="card-label">The geometry explains the identities</span>
            <h4 id={`${headingId}-relationships`}>The same side ratio gets a partner name</h4>
          </header>
          <div className="cofunction-relationship-grid">
            <RelationshipCard
              label="Sine and cosine"
              side="a"
              leftMath={String.raw`\sin\theta=\frac{a}{c}`}
              rightMath={String.raw`\cos\phi=\frac{a}{c}`}
              valueMath={String.raw`\frac{a}{c}${valueRelation}${exactOrApproximate.sin}`}
              explanation="Side a is opposite θ but adjacent to φ. The fraction itself never changes."
            />
            <RelationshipCard
              label="Cosine and sine"
              side="b"
              leftMath={String.raw`\cos\theta=\frac{b}{c}`}
              rightMath={String.raw`\sin\phi=\frac{b}{c}`}
              valueMath={String.raw`\frac{b}{c}${valueRelation}${exactOrApproximate.cos}`}
              explanation="Side b is adjacent to θ but opposite φ. Switching angles switches the function name."
            />
            <RelationshipCard
              label="Tangent and cotangent"
              side="ratio"
              leftMath={String.raw`\tan\theta=\frac{a}{b}`}
              rightMath={String.raw`\cot\phi=\frac{a}{b}`}
              valueMath={String.raw`\frac{a}{b}${valueRelation}${exactOrApproximate.tan}`}
              explanation="From φ the side roles reverse, so cotangent recreates θ's tangent ratio."
            />
          </div>
          <div className="cofunction-key-result">
            <MathDisplay>{String.raw`\sin\theta=\cos\left(\frac{\pi}{2}-\theta\right)\qquad \tan\theta=\cot\left(\frac{\pi}{2}-\theta\right)`}</MathDisplay>
            <p>Complement the angle, then switch to its cofunction.</p>
          </div>
        </section>

        <aside className="cofunction-controls" aria-describedby={descriptionId}>
          <div className="cofunction-view-controls" role="group" aria-label="Choose which acute angle defines opposite and adjacent">
            <span>Choose a viewpoint</span>
            <div>
              <button type="button" className={viewingTheta ? 'active' : ''} aria-pressed={viewingTheta} onClick={() => setViewpoint('theta')}>
                View from <MathInline>{String.raw`\theta`}</MathInline>
              </button>
              <button type="button" className={viewingTheta ? '' : 'active'} aria-pressed={!viewingTheta} onClick={() => setViewpoint('complement')}>
                View from complement
              </button>
            </div>
            <small>Switch the angle. Watch sides a and b switch jobs.</small>
          </div>

          <div className="cofunction-angle-control">
            <label htmlFor={`${headingId}-theta`}>
              <span>Angle θ</span>
              <output htmlFor={`${headingId}-theta`}>{theta}°</output>
            </label>
            <input
              id={`${headingId}-theta`}
              type="range"
              min={MIN_ANGLE}
              max={MAX_ANGLE}
              step="1"
              value={theta}
              aria-valuetext={`Theta ${theta} degrees; complement phi ${complement} degrees`}
              aria-controls={readoutId}
              onChange={(event) => setTheta(Number(event.target.value))}
            />
            <small>Keyboard: use the arrow keys for 1° steps or Page Up/Down for larger steps.</small>
          </div>

          <div className="cofunction-common-angles" role="group" aria-label="Choose a common value for theta">
            {[30, 45, 60].map((commonAngle) => (
              <button
                type="button"
                className={theta === commonAngle ? 'active' : ''}
                aria-pressed={theta === commonAngle}
                onClick={() => setTheta(commonAngle)}
                key={commonAngle}
              >
                {commonAngle}°
              </button>
            ))}
          </div>

          <div className="cofunction-live-complement" aria-live="polite" aria-atomic="true">
            <div>
              <span>Angle θ</span>
              <strong>{theta}°</strong>
              <MathInline>{thetaRadians}</MathInline>
            </div>
            <span className="cofunction-plus" aria-hidden="true">+</span>
            <div>
              <span>Complement φ</span>
              <strong>{complement}°</strong>
              <MathInline>{complementRadians}</MathInline>
            </div>
            <span className="cofunction-total">Always 90° · <MathInline>{String.raw`\frac{\pi}{2}`}</MathInline></span>
          </div>

          <button type="button" className="cofunction-reset-button" onClick={reset}>Reset explorer</button>
        </aside>
      </div>

      <aside className="cofunction-reciprocal-followup">
        <div>
          <span className="card-label">The reciprocal pair follows</span>
          <p>Because cosine and sine exchange roles, their reciprocals exchange roles too.</p>
        </div>
        <div>
          <MathInline>{String.raw`\sec\theta=\csc\phi${valueRelation}${exactOrApproximate.sec}`}</MathInline>
          <MathInline>{String.raw`\csc\theta=\sec\phi${valueRelation}${exactOrApproximate.csc}`}</MathInline>
        </div>
      </aside>
    </section>
  )
}

export default CofunctionTriangleExplorer
