import { useState } from 'react'
import { MathDisplay, MathInline } from '../../MathDisplay'

const NUMBER_SETS = {
  natural: {
    name: 'Natural',
    symbol: String.raw`\mathbb{N}`,
    stage: 1,
    definition: 'The positive counting numbers. In this review, zero is not included in this set.',
    examples: String.raw`1,\ 2,\ 3,\ 4,\ldots`,
    relationship: String.raw`\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`,
  },
  integer: {
    name: 'Integer',
    symbol: String.raw`\mathbb{Z}`,
    stage: 2,
    definition: 'Whole numbers in both directions, together with zero. Integers make subtraction possible without leaving the system.',
    examples: String.raw`\ldots,-2,-1,0,1,2,\ldots`,
    relationship: String.raw`\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`,
  },
  rational: {
    name: 'Rational',
    symbol: String.raw`\mathbb{Q}`,
    stage: 3,
    definition: 'Numbers that can be written as a ratio of two integers with a nonzero denominator.',
    examples: String.raw`\frac{2}{7},\ -8,\ 0.75,\ 0.\overline{3}`,
    relationship: String.raw`\mathbb{Q}\subset\mathbb{R}`,
  },
  irrational: {
    name: 'Irrational',
    symbol: String.raw`\mathbb{R}\setminus\mathbb{Q}`,
    stage: 4,
    definition: 'Real numbers that cannot be expressed as a ratio of integers. Their decimals neither terminate nor repeat in a fixed cycle.',
    examples: String.raw`\sqrt{2},\ \pi,\ e`,
    relationship: String.raw`(\mathbb{R}\setminus\mathbb{Q})\subset\mathbb{R}`,
  },
  real: {
    name: 'Real',
    symbol: String.raw`\mathbb{R}`,
    stage: 4,
    definition: 'Every number represented by a position on the continuous number line: all rational and all irrational numbers.',
    examples: String.raw`-3,\ \frac{2}{7},\ \sqrt{2},\ \pi`,
    relationship: String.raw`\mathbb{R}=\mathbb{Q}\cup(\mathbb{R}\setminus\mathbb{Q})`,
  },
}

const SAMPLE_VALUES = [
  {
    id: 'three',
    label: String.raw`3`,
    spoken: '3',
    membership: [
      String.raw`3\in\mathbb{N}`,
      String.raw`3\in\mathbb{Z}`,
      String.raw`3\in\mathbb{Q}`,
      String.raw`3\in\mathbb{R}`,
    ],
  },
  {
    id: 'negative-three',
    label: String.raw`-3`,
    spoken: 'negative 3',
    membership: [
      String.raw`-3\notin\mathbb{N}`,
      String.raw`-3\in\mathbb{Z}`,
      String.raw`-3\in\mathbb{Q}`,
      String.raw`-3\in\mathbb{R}`,
    ],
  },
  {
    id: 'two-sevenths',
    label: String.raw`\frac{2}{7}`,
    spoken: '2 sevenths',
    membership: [
      String.raw`\frac{2}{7}\notin\mathbb{Z}`,
      String.raw`\frac{2}{7}\in\mathbb{Q}`,
      String.raw`\frac{2}{7}\in\mathbb{R}`,
    ],
  },
  {
    id: 'sqrt-two',
    label: String.raw`\sqrt{2}`,
    spoken: 'square root of 2',
    membership: [
      String.raw`\sqrt{2}\notin\mathbb{Q}`,
      String.raw`\sqrt{2}\in\mathbb{R}`,
    ],
  },
  {
    id: 'pi',
    label: String.raw`\pi`,
    spoken: 'pi',
    membership: [
      String.raw`\pi\notin\mathbb{Q}`,
      String.raw`\pi\in\mathbb{R}`,
    ],
  },
  {
    id: 'zero',
    label: String.raw`0`,
    spoken: 'zero',
    membership: [
      String.raw`0\notin\mathbb{N}\ \text{ under our convention}`,
      String.raw`0\in\mathbb{Z}`,
      String.raw`0\in\mathbb{Q}`,
      String.raw`0\in\mathbb{R}`,
    ],
  },
]

const CLASSIFICATION_VALUES = [
  { id: 'five', label: String.raw`5`, spoken: '5', answer: 'natural' },
  { id: 'negative-three', label: String.raw`-3`, spoken: 'negative 3', answer: 'integer' },
  { id: 'two-sevenths', label: String.raw`\frac{2}{7}`, spoken: '2 sevenths', answer: 'rational' },
  { id: 'sqrt-two', label: String.raw`\sqrt{2}`, spoken: 'square root of 2', answer: 'irrational' },
  { id: 'pi', label: String.raw`\pi`, spoken: 'pi', answer: 'irrational' },
  { id: 'zero', label: String.raw`0`, spoken: 'zero', answer: 'integer' },
]

const CLASSIFICATION_TARGETS = [
  { id: 'natural', label: 'Natural only as the smallest set' },
  { id: 'integer', label: 'Integer, but not natural' },
  { id: 'rational', label: 'Rational, but not integer' },
  { id: 'irrational', label: 'Irrational' },
]

const RATIONALITY_QUIZ = [
  {
    id: 'repeating-third',
    label: String.raw`0.33333\ldots`,
    answer: 'rational',
    feedback: 'The repeating block represents 1/3, so this number is a ratio of integers.',
  },
  {
    id: 'sqrt-nine',
    label: String.raw`\sqrt{9}`,
    answer: 'rational',
    feedback: 'Its exact value is 3, an integer and therefore a rational number.',
  },
  {
    id: 'sqrt-five',
    label: String.raw`\sqrt{5}`,
    answer: 'irrational',
    feedback: 'Five is not a perfect square, and its square root cannot be a ratio of integers.',
  },
  {
    id: 'pi-decimal',
    label: String.raw`3.14159265\ldots\ (=\pi)`,
    answer: 'irrational',
    feedback: 'This label identifies pi. Its digits continue without terminating or settling into a repeating block.',
  },
  {
    id: 'twenty-two-sevenths',
    label: String.raw`\frac{22}{7}`,
    answer: 'rational',
    feedback: 'It is already written as a ratio of two integers. It is close to pi, but it is not equal to pi.',
  },
  {
    id: 'e',
    label: String.raw`e`,
    answer: 'irrational',
    feedback: 'The constant e is a real number that cannot be represented by an integer ratio.',
  },
]

function NumberSetMap({ selectedSet, revealStage }) {
  return (
    <svg
      className="algebra-number-set-map"
      viewBox="0 0 760 430"
      role="img"
      aria-labelledby="algebra-number-map-title algebra-number-map-description"
    >
      <title id="algebra-number-map-title">Nested map of the real number system</title>
      <desc id="algebra-number-map-description">
        Natural numbers sit inside integers, integers sit inside rational numbers, and rational and irrational numbers sit inside the real numbers.
      </desc>

      {revealStage >= 4 && (
        <g className={`algebra-set-region algebra-set-region--real ${selectedSet === 'real' ? 'is-active' : ''}`}>
          <rect x="20" y="18" width="720" height="390" rx="38" />
          <text x="48" y="58">Real numbers R</text>
        </g>
      )}
      {revealStage >= 3 && (
        <g className={`algebra-set-region algebra-set-region--rational ${selectedSet === 'rational' ? 'is-active' : ''}`}>
          <rect x="66" y="78" width="420" height="282" rx="34" />
          <text x="92" y="116">Rational numbers Q</text>
        </g>
      )}
      {revealStage >= 2 && (
        <g className={`algebra-set-region algebra-set-region--integer ${selectedSet === 'integer' ? 'is-active' : ''}`}>
          <rect x="112" y="138" width="310" height="176" rx="30" />
          <text x="138" y="176">Integers Z</text>
        </g>
      )}
      {revealStage >= 1 && (
        <g className={`algebra-set-region algebra-set-region--natural ${selectedSet === 'natural' ? 'is-active' : ''}`}>
          <rect x="166" y="198" width="198" height="72" rx="26" />
          <text x="265" y="241" textAnchor="middle">Natural numbers N</text>
        </g>
      )}
      {revealStage >= 4 && (
        <g className={`algebra-set-region algebra-set-region--irrational ${selectedSet === 'irrational' ? 'is-active' : ''}`}>
          <path d="M 528 126 C 660 100, 716 174, 696 264 C 680 340, 556 365, 508 300 C 463 239, 469 147, 528 126 Z" />
          <text x="598" y="214" textAnchor="middle">Irrational</text>
          <text x="598" y="241" textAnchor="middle">R outside Q</text>
        </g>
      )}
    </svg>
  )
}

function ClassificationLab() {
  const [activeValue, setActiveValue] = useState(null)
  const [placements, setPlacements] = useState({})
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState('')

  const placeValue = (valueId, targetId) => {
    if (!valueId) {
      setStatus('Select a number first, then choose a destination.')
      return
    }

    setPlacements((current) => ({ ...current, [valueId]: targetId }))
    setActiveValue(null)
    setChecked(false)
    setStatus('Number placed. Answers remain hidden until you check all six.')
  }

  const handleDrop = (event, targetId) => {
    event.preventDefault()
    const valueId = event.dataTransfer.getData('text/plain')
    placeValue(valueId, targetId)
  }

  const checkPlacements = () => {
    if (Object.keys(placements).length !== CLASSIFICATION_VALUES.length) {
      setStatus('Place all six numbers before checking your classification.')
      return
    }

    const correct = CLASSIFICATION_VALUES.filter((value) => placements[value.id] === value.answer).length
    setChecked(true)
    setStatus(correct === CLASSIFICATION_VALUES.length
      ? 'All six classifications are correct.'
      : `${correct} of ${CLASSIFICATION_VALUES.length} are correct. Reconsider the marked choices and try again.`)
  }

  const reset = () => {
    setActiveValue(null)
    setPlacements({})
    setChecked(false)
    setStatus('Activity reset. Select or drag a number to begin.')
  }

  return (
    <section className="algebra-classification-lab" aria-labelledby="algebra-classification-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="card-label">Try it</span>
          <h3 id="algebra-classification-heading">Drag the number into the most specific set</h3>
        </div>
        <p>Keyboard option: select a number, then use a “Place selected here” button.</p>
      </header>

      <div className="algebra-number-bank" aria-label="Numbers to classify">
        {CLASSIFICATION_VALUES.map((value) => {
          const placed = placements[value.id]
          return (
            <button
              key={value.id}
              className={`algebra-number-chip ${activeValue === value.id ? 'is-selected' : ''} ${placed ? 'is-placed' : ''}`}
              type="button"
              draggable
              aria-pressed={activeValue === value.id}
              aria-label={`${value.spoken}${placed ? `, currently placed in ${placed}` : ''}`}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', value.id)}
              onClick={() => {
                setActiveValue(value.id)
                setStatus(`${value.spoken} selected. Now choose a destination.`)
              }}
            >
              <MathInline>{value.label}</MathInline>
            </button>
          )
        })}
      </div>

      <div className="algebra-classification-targets">
        {CLASSIFICATION_TARGETS.map((target) => {
          const placedValues = CLASSIFICATION_VALUES.filter((value) => placements[value.id] === target.id)
          return (
            <div
              key={target.id}
              className="algebra-classification-target"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, target.id)}
            >
              <h4>{target.label}</h4>
              <div className="algebra-target-values" aria-label={`Numbers placed in ${target.label}`}>
                {placedValues.length === 0 && <span>Drop zone</span>}
                {placedValues.map((value) => {
                  const isCorrect = checked && value.answer === target.id
                  const isIncorrect = checked && value.answer !== target.id
                  return (
                    <span
                      key={value.id}
                      className={`algebra-placed-value ${isCorrect ? 'is-correct' : ''} ${isIncorrect ? 'is-incorrect' : ''}`}
                    >
                      <MathInline>{value.label}</MathInline>
                      {checked && <span className="algebra-result-word"> {isCorrect ? 'Correct' : 'Recheck'}</span>}
                    </span>
                  )
                })}
              </div>
              <button type="button" className="secondary-button" onClick={() => placeValue(activeValue, target.id)}>
                Place selected here
              </button>
            </div>
          )
        })}
      </div>

      <div className="algebra-lab-actions">
        <button type="button" onClick={checkPlacements}>Check classifications</button>
        <button className="secondary-button" type="button" onClick={reset}>Reset</button>
      </div>
      <p className="algebra-live-feedback" aria-live="polite">{status}</p>
    </section>
  )
}

function RationalityQuiz() {
  const [responses, setResponses] = useState({})

  return (
    <section className="algebra-rationality-quiz" aria-labelledby="algebra-rationality-heading">
      <header className="algebra-lab-heading">
        <div>
          <span className="card-label">Concept check</span>
          <h3 id="algebra-rationality-heading">Rational or irrational?</h3>
        </div>
        <p>A repeating decimal is rational; merely having infinitely many digits does not settle the question.</p>
      </header>

      <div className="algebra-rationality-grid">
        {RATIONALITY_QUIZ.map((item) => {
          const response = responses[item.id]
          const isCorrect = response === item.answer

          return (
            <article className="algebra-rationality-card" key={item.id}>
              <MathDisplay>{item.label}</MathDisplay>
              <div className="algebra-choice-row" role="group" aria-label={`Classify ${item.id}`}>
                {['rational', 'irrational'].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={response === choice ? 'is-selected' : ''}
                    aria-pressed={response === choice}
                    onClick={() => setResponses((current) => ({ ...current, [item.id]: choice }))}
                  >
                    {choice[0].toUpperCase() + choice.slice(1)}
                  </button>
                ))}
              </div>
              {response && (
                <p className={`algebra-answer-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} aria-live="polite">
                  <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {item.feedback}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function NumberSystemExplorer() {
  const [selectedSet, setSelectedSet] = useState('natural')
  const [revealStage, setRevealStage] = useState(1)
  const [selectedValue, setSelectedValue] = useState('three')
  const selectedDefinition = NUMBER_SETS[selectedSet]
  const selectedSample = SAMPLE_VALUES.find((value) => value.id === selectedValue)

  const selectSet = (setId) => {
    setSelectedSet(setId)
    setRevealStage((current) => Math.max(current, NUMBER_SETS[setId].stage))
  }

  return (
    <div className="algebra-number-system-explorer">
      <section className="algebra-number-map-panel" aria-labelledby="algebra-number-map-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Interactive map</span>
            <h3 id="algebra-number-map-heading">Build the real-number system from the inside out</h3>
          </div>
          <p>Each new layer keeps every number from the layer before it.</p>
        </header>

        <div className="algebra-set-controls" role="group" aria-label="Select a number set">
          {Object.entries(NUMBER_SETS).map(([setId, set]) => (
            <button
              key={setId}
              type="button"
              className={selectedSet === setId ? 'is-active' : ''}
              aria-pressed={selectedSet === setId}
              onClick={() => selectSet(setId)}
            >
              {set.name} <MathInline>{set.symbol}</MathInline>
            </button>
          ))}
        </div>

        <div className="algebra-number-map-layout">
          <div>
            <NumberSetMap selectedSet={selectedSet} revealStage={revealStage} />
            <div className="algebra-map-reveal-controls">
              <span>Layer {revealStage} of 4</span>
              <button
                type="button"
                disabled={revealStage >= 4}
                onClick={() => setRevealStage((current) => Math.min(4, current + 1))}
              >
                Reveal next set
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setRevealStage(1)
                  setSelectedSet('natural')
                }}
              >
                Replay layers
              </button>
            </div>
          </div>

          <aside className="algebra-set-definition" aria-live="polite">
            <span className="card-label">{selectedDefinition.name} numbers</span>
            <MathDisplay>{selectedDefinition.symbol}</MathDisplay>
            <p>{selectedDefinition.definition}</p>
            <dl>
              <dt>Examples</dt>
              <dd><MathInline>{selectedDefinition.examples}</MathInline></dd>
              <dt>Belongs-to relationship</dt>
              <dd><MathInline>{selectedDefinition.relationship}</MathInline></dd>
            </dl>
          </aside>
        </div>
      </section>

      <section className="algebra-membership-panel" aria-labelledby="algebra-membership-heading">
        <header className="algebra-lab-heading">
          <div>
            <span className="card-label">Membership explorer</span>
            <h3 id="algebra-membership-heading">One number may belong to several nested sets</h3>
          </div>
          <p>Select a value to trace every set that contains it.</p>
        </header>

        <div className="algebra-membership-values" role="group" aria-label="Choose a sample number">
          {SAMPLE_VALUES.map((value) => (
            <button
              key={value.id}
              type="button"
              className={selectedValue === value.id ? 'is-active' : ''}
              aria-pressed={selectedValue === value.id}
              aria-label={`Show memberships for ${value.spoken}`}
              onClick={() => setSelectedValue(value.id)}
            >
              <MathInline>{value.label}</MathInline>
            </button>
          ))}
        </div>

        <div className="algebra-membership-result" aria-live="polite">
          <p><strong>Membership statements for <MathInline>{selectedSample.label}</MathInline></strong></p>
          <div className="algebra-membership-equations">
            {selectedSample.membership.map((statement) => (
              <MathDisplay key={statement}>{statement}</MathDisplay>
            ))}
          </div>
        </div>
      </section>

      <ClassificationLab />
      <RationalityQuiz />
    </div>
  )
}

export default NumberSystemExplorer
