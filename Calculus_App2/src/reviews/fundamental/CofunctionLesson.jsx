import { useId, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import CofunctionMatchingLab from '../../components/review/trigonometry/CofunctionMatchingLab'
import CofunctionTriangleExplorer from '../../components/review/trigonometry/CofunctionTriangleExplorer'
import {
  CommonMistakeCard,
  ProgressiveExample,
  SectionHeading,
} from '../../components/review/trigonometry/TrigLessonBlocks'
import { SixFunctionsCheck } from '../../components/review/trigonometry/SixFunctionsPractice'
import lesson from '../../data/cofunctionLesson'
import '../../styles/algebra-review.css'
import '../../styles/angles-radians-lesson.css'
import '../../styles/six-trig-functions-lesson.css'
import '../../styles/cofunction-lesson.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function adaptQuestion(question) {
  return {
    ...question,
    type: question.type === 'multiple-choice' ? 'choice' : question.type,
    correctAnswer: question.answerId,
    explanation: question.explanation || 'Complement the angle, then switch to the paired cofunction.',
  }
}

function ComplementCheck({ onComplete }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = answer === '3pi/10'

  const feedback = answer === '4pi/5'
    ? 'That completes a straight angle. A complement must add to one right angle.'
    : 'Use a common denominator: π/2 = 5π/10 and π/5 = 2π/10.'

  const check = () => {
    setChecked(true)
    if (correct) onComplete?.()
  }

  return (
    <article className="cofunction-complement-check">
      <div>
        <p className="trig-lesson-label">Your turn</p>
        <h3>Find the complement.</h3>
        <MathDisplay>{lesson.complementPractice.problemMath}</MathDisplay>
      </div>
      <div>
        <div className="cofunction-choice-row" role="group" aria-label="Choose the complement of pi over five">
          {[
            ['pi/10', String.raw`\frac{\pi}{10}`],
            ['3pi/10', String.raw`\frac{3\pi}{10}`],
            ['4pi/5', String.raw`\frac{4\pi}{5}`],
          ].map(([value, math]) => (
            <button
              type="button"
              aria-pressed={answer === value}
              className={answer === value ? 'is-selected' : ''}
              key={value}
              onClick={() => { setAnswer(value); setChecked(false) }}
            >
              <MathInline>{math}</MathInline>
            </button>
          ))}
        </div>
        <button type="button" className="trig-lesson-primary-action" disabled={!answer} onClick={check}>Check complement</button>
        {checked && (
          <div className={`cofunction-inline-feedback ${correct ? 'is-correct' : 'is-incorrect'}`} role="status">
            <strong>{correct ? 'Exactly.' : 'Almost—subtract from π/2.'}</strong>
            <p>{correct ? 'The common denominator makes the subtraction visible.' : feedback}</p>
            {correct && <MathDisplay>{String.raw`\frac{\pi}{2}-\frac{\pi}{5}=\frac{5\pi}{10}-\frac{2\pi}{10}=\frac{3\pi}{10}`}</MathDisplay>}
          </div>
        )}
      </div>
    </article>
  )
}

function CofunctionPairMap() {
  return (
    <div className="cofunction-pair-map" aria-label="The three cofunction pairs">
      <MathDisplay>{lesson.cofunctionPairs.angleSwitchMath}</MathDisplay>
      <div>
        {lesson.cofunctionPairs.pairs.map((pair) => (
          <article key={pair.id}>
            <MathInline>{pair.firstMath}</MathInline>
            <span aria-hidden="true">↔</span>
            <MathInline>{pair.secondMath}</MathInline>
          </article>
        ))}
      </div>
      <strong>{lesson.cofunctionPairs.rule}</strong>
    </div>
  )
}

function PracticeSolution() {
  return (
    <div className="cofunction-practice-solution">
      {lesson.practice.solution.steps.map((step) => (
        <article key={step.part}>
          <span>Part {step.part}</span>
          <MathDisplay>{step.math}</MathDisplay>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  )
}

function CofunctionPractice({ onComplete }) {
  const fields = lesson.practice.fields
  const instanceId = useId()
  const [answers, setAnswers] = useState(() => Object.fromEntries(fields.map((field) => [field.id, ''])))
  const [results, setResults] = useState(null)
  const [hintCount, setHintCount] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const ready = fields.every((field) => answers[field.id].trim())

  const normalize = (value) => value.toLowerCase().replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
  const isCorrect = (field, answer) => field.acceptedAnswers.some((accepted) => normalize(accepted) === normalize(answer))
  const feedbackFor = (field, answer) => {
    const special = field.feedbackRules?.find((rule) => rule.answers?.some((candidate) => normalize(candidate) === normalize(answer)))
    return special?.message || field.feedbackRules?.[0]?.message || 'Check the complementary angle and its paired function.'
  }

  const check = (event) => {
    event.preventDefault()
    const next = Object.fromEntries(fields.map((field) => [field.id, isCorrect(field, answers[field.id])]))
    setResults(next)
    if (Object.values(next).every(Boolean)) onComplete?.()
  }

  const reset = () => {
    setAnswers(Object.fromEntries(fields.map((field) => [field.id, ''])))
    setResults(null)
    setHintCount(0)
    setShowSolution(false)
  }

  return (
    <article className="cofunction-practice">
      <header><p className="trig-lesson-label">{lesson.practice.label}</p><h3>{lesson.practice.title}</h3><p>{lesson.practice.directions}</p></header>
      <form onSubmit={check}>
        <div className="cofunction-practice-grid">
          {fields.map((field, index) => {
            const inputId = `${instanceId}-${field.id}`
            const correct = results?.[field.id]
            return (
              <label key={field.id} htmlFor={inputId}>
                <span>Part {index + 1} · {field.prompt}</span>
                {field.givenMath && <MathDisplay>{field.givenMath}</MathDisplay>}
                <MathDisplay>{field.problemMath}</MathDisplay>
                <input
                  id={inputId}
                  value={answers[field.id]}
                  placeholder={index < 2 ? 'Example: cot x' : 'Enter the decimal'}
                  autoComplete="off"
                  aria-invalid={results ? !correct : undefined}
                  onChange={(event) => {
                    setAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                    setResults(null)
                  }}
                />
                {results && <small className={correct ? 'is-correct' : 'is-incorrect'}>{correct ? 'Correct—the cofunction pair fits.' : feedbackFor(field, answers[field.id])}</small>}
              </label>
            )
          })}
        </div>
        <div className="trig-lesson-actions">
          <button type="submit" className="trig-lesson-primary-action" disabled={!ready}>Check all three</button>
          {lesson.practice.hints.map((hint, index) => (
            <button type="button" className="trig-lesson-secondary-action" key={hint} onClick={() => setHintCount((count) => Math.max(count, index + 1))}>Hint {index + 1}</button>
          ))}
          <button type="button" className="trig-lesson-secondary-action" onClick={() => setShowSolution(true)}>Show solution</button>
          <button type="button" className="trig-lesson-quiet-action" onClick={reset}>Reset</button>
        </div>
      </form>
      {hintCount > 0 && <div className="cofunction-hints" aria-live="polite">{lesson.practice.hints.slice(0, hintCount).map((hint) => <p key={hint}>{hint}</p>)}</div>}
      {showSolution && <PracticeSolution />}
    </article>
  )
}

function UnitCircleConnection() {
  return (
    <details className="cofunction-unit-circle">
      <summary>{lesson.unitCircleConnection.label}: {lesson.unitCircleConnection.title}</summary>
      <div>
        <svg viewBox="0 0 320 320" role="img" aria-label="First-quadrant unit circle showing complementary points reflected across y equals x">
          <line x1="30" y1="290" x2="298" y2="290" className="axis" />
          <line x1="30" y1="290" x2="30" y2="22" className="axis" />
          <path d="M 290 290 A 260 260 0 0 0 30 30" className="circle" />
          <line x1="30" y1="290" x2="290" y2="30" className="mirror" />
          <line x1="30" y1="290" x2="255" y2="160" className="ray ray-one" />
          <line x1="30" y1="290" x2="160" y2="65" className="ray ray-two" />
          <circle cx="255" cy="160" r="8" className="point point-one" />
          <circle cx="160" cy="65" r="8" className="point point-two" />
          <text x="232" y="147">P(θ)</text><text x="171" y="58">P(π/2−θ)</text><text x="225" y="86">y = x</text>
        </svg>
        <div>
          <MathDisplay>{lesson.unitCircleConnection.originalPointMath}</MathDisplay>
          <MathDisplay>{lesson.unitCircleConnection.complementPointMath}</MathDisplay>
          <p>{lesson.unitCircleConnection.explanation}</p>
        </div>
      </div>
    </details>
  )
}

export default function CofunctionLesson({
  completed = {},
  onCompletedChange,
  onOverview,
  onReviewHome,
  onHome,
  onPrevious,
  onNext,
}) {
  const [saved, setSaved] = useState(completed)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const diagnosticQuestions = useMemo(() => lesson.diagnostic.questions.map(adaptQuestion), [])
  const quickQuestions = useMemo(() => lesson.quickCheck.questions.map(adaptQuestion), [])
  const goalKeys = ['complement', 'matching', 'practice']
  const completedGoals = saved.reviewed ? 4 : goalKeys.filter((key) => Boolean(saved[key])).length
  const progressPercent = Math.round((completedGoals / 4) * 100)

  const save = (patch) => {
    setSaved((current) => {
      const next = { ...current, ...patch }
      onCompletedChange?.(next)
      return next
    })
  }

  const openDiagnostic = () => {
    setShowDiagnostic(true)
    window.requestAnimationFrame(() => scrollToSection('cofunction-diagnostic'))
  }

  const recordDiagnostic = (result) => {
    const best = !saved.diagnostic || result.percent >= saved.diagnostic.percent ? result : saved.diagnostic
    save({ diagnostic: best, ...(result.score >= lesson.diagnostic.passingScore ? { reviewed: true } : {}) })
  }

  const recordQuickCheck = (result) => {
    const best = !saved.quickCheck || result.percent >= saved.quickCheck.percent ? result : saved.quickCheck
    save({ quickCheck: best, ...(result.score >= lesson.quickCheck.passingScore ? { reviewed: true } : {}) })
  }

  return (
    <div className="algebra-review-page angles-radians-page cofunction-lesson-page">
      <nav className="algebra-review-toolbar angles-radians-toolbar" aria-label="Cofunction lesson navigation">
        <div>
          <button type="button" onClick={onOverview}>← Trigonometry Overview</button>
          <button type="button" onClick={onReviewHome}>Fundamental Review</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
        <span>{saved.reviewed ? 'Reviewed' : `${completedGoals}/4 review goals complete`}</span>
      </nav>

      <header className="angles-radians-hero cofunction-hero">
        <FoundationProgression current="Trigonometry" />
        <div className="angles-radians-hero-grid">
          <div>
            <p className="card-label">Foundation 02 · Trigonometry · Lesson 04</p>
            <span className="algebra-review-kicker">{lesson.status}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
            <p className="cofunction-time">Review time: {lesson.estimatedReviewTime} · Quick path: {lesson.quickPathTime}</p>
            <div className="angles-radians-hero-actions">
              <button className="primary-button" type="button" onClick={openDiagnostic}>I remember this — Quick Check</button>
              <button className="secondary-button" type="button" onClick={() => scrollToSection('cofunction-complements')}>Review it with me</button>
            </div>
          </div>
          <aside aria-label="Cofunction lesson progress">
            <span>{saved.reviewed ? 'Lesson status' : 'Lesson progress'}</span>
            <strong>{saved.reviewed ? 'Reviewed' : `${progressPercent}%`}</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>Complement, matching, practice, and check results are saved on this device.</p>
          </aside>
        </div>
      </header>

      {showDiagnostic && (
        <section id="cofunction-diagnostic" className="cofunction-diagnostic-wrap">
          <SixFunctionsCheck
            label="3–5 minute path"
            title={lesson.diagnostic.title}
            description={lesson.quickPath.description}
            questions={diagnosticQuestions}
            previousResult={saved.diagnostic}
            passPercent={100}
            onComplete={recordDiagnostic}
          />
          {!saved.reviewed && <button type="button" className="secondary-button" onClick={() => scrollToSection('cofunction-complements')}>Review it with me</button>}
        </section>
      )}

      <nav className="angles-radians-section-nav cofunction-section-nav" aria-label="Cofunction lesson sections">
        {[
          ['cofunction-complements', '01', 'Complements'],
          ['cofunction-geometry', '02', 'Why they switch'],
          ['cofunction-pairs', '03', 'Three pairs'],
          ['cofunction-examples', '04', 'Examples'],
          ['cofunction-practice', '05', 'Practice'],
          ['cofunction-check', '06', 'Quick check'],
          ['cofunction-summary', '07', 'Summary'],
        ].map(([id, number, title]) => (
          <button type="button" key={id} onClick={() => scrollToSection(id)}><span>{number}</span>{title}</button>
        ))}
      </nav>

      <div className="angles-radians-content cofunction-content">
        <section id="cofunction-complements" className="angles-radians-section">
          <SectionHeading number="01" title={lesson.complementaryAngles.title} question="What stays constant as one angle changes?">
            <p>{lesson.complementaryAngles.text}</p>
          </SectionHeading>
          <div className="cofunction-definition-grid">
            <article><span>Degrees</span><MathDisplay>{lesson.complementaryAngles.degreeMath}</MathDisplay></article>
            <article><span>Radians</span><MathDisplay>{lesson.complementaryAngles.radianMath}</MathDisplay></article>
            <article><span>Complement of θ</span><MathDisplay>{lesson.complementaryAngles.complementMath}</MathDisplay></article>
          </div>
          <ComplementCheck onComplete={() => save({ complement: true })} />
          {saved.complement && <p className="angles-saved-message" role="status">✓ Complement goal saved.</p>}
        </section>

        <section id="cofunction-geometry" className="angles-radians-section cofunction-geometry-section">
          <SectionHeading number="02" title="One triangle, two acute viewpoints" question={lesson.introduction.question}>
            <p>{lesson.introduction.reveal}</p>
          </SectionHeading>
          <CofunctionTriangleExplorer initialAngle={lesson.complementExplorer.initialDegrees} />
          <p className="cofunction-tagline">{lesson.introduction.tagline}</p>
        </section>

        <section id="cofunction-pairs" className="angles-radians-section">
          <SectionHeading number="03" title="Three partner pairs—not six random formulas">
            <p>Once opposite and adjacent exchange jobs, sine pairs with cosine and tangent pairs with cotangent. Taking reciprocals gives secant and cosecant.</p>
          </SectionHeading>
          <CofunctionPairMap />
          <div className="cofunction-reciprocal-contrast">
            <article>
              <span>{lesson.reciprocalDistinction.cofunction.label}</span>
              <MathDisplay>{lesson.reciprocalDistinction.cofunction.math}</MathDisplay>
              <p>{lesson.reciprocalDistinction.cofunction.explanation}</p>
            </article>
            <article>
              <span>{lesson.reciprocalDistinction.reciprocal.label}</span>
              <MathDisplay>{lesson.reciprocalDistinction.reciprocal.math}</MathDisplay>
              <p>{lesson.reciprocalDistinction.reciprocal.explanation}</p>
            </article>
          </div>
          <CommonMistakeCard
            title={lesson.reciprocalDistinction.title}
            claim="Cosine's cofunction is secant."
            explanation="Secant is cosine's reciprocal because the angle stays the same. Sine is cosine's cofunction because the angle changes to its complement."
            correctionMath={lesson.reciprocalDistinction.contrast.math}
          />
          <CofunctionMatchingLab activity={lesson.matchingActivity} onComplete={() => save({ matching: true })} />
          {saved.matching && <p className="angles-saved-message" role="status">✓ All six cofunction matches saved.</p>}
        </section>

        <section id="cofunction-examples" className="angles-radians-section">
          <SectionHeading number="04" title={lesson.exactValueConnections.title}>
            <p>A cofunction identity lets one known exact value answer a second question—no new calculation.</p>
          </SectionHeading>
          <div className="cofunction-exact-grid">
            {lesson.exactValueConnections.examples.map((example) => (
              <article key={example.id}>
                <MathDisplay>{example.complementMath}</MathDisplay>
                <p>Known</p><MathDisplay>{example.knownMath}</MathDisplay>
                <p>Therefore</p><MathDisplay>{example.resultMath}</MathDisplay>
                <small>{example.explanation}</small>
              </article>
            ))}
          </div>
          <ProgressiveExample
            label={lesson.workedExample.level}
            title={lesson.workedExample.title}
            prompt={lesson.workedExample.prompt}
            promptMath={lesson.workedExample.problemMath}
            steps={lesson.workedExample.steps}
            conclusion="The angle is complemented, so the function switches to its partner."
            conclusionMath={lesson.workedExample.answerMath}
          />
        </section>

        <section id="cofunction-practice" className="angles-radians-section">
          <SectionHeading number="05" title="Your turn: recognize, rewrite, evaluate">
            <p>Use the angle relationship first. Three staged hints and the complete solution are available.</p>
          </SectionHeading>
          <CofunctionPractice onComplete={() => save({ practice: true })} />
          {saved.practice && <p className="angles-saved-message" role="status">✓ Guided-practice goal saved.</p>}
          <UnitCircleConnection />
        </section>

        <section id="cofunction-check" className="angles-radians-section">
          <SectionHeading number="06" title="Quick check">
            <p>Four short questions check complements, pairings, rewriting, and the cofunction-versus-reciprocal distinction.</p>
          </SectionHeading>
          <SixFunctionsCheck
            title={lesson.quickCheck.title}
            description={lesson.quickCheck.description}
            questions={quickQuestions}
            previousResult={saved.quickCheck}
            passPercent={75}
            onComplete={recordQuickCheck}
          />
          <CommonMistakeCard
            label="Watch for this"
            title={lesson.commonMistakes.featured.question}
            claimMath={lesson.commonMistakes.featured.incorrectMath}
            explanation={lesson.commonMistakes.featured.explanation}
            correctionMath={lesson.commonMistakes.featured.correctionMath}
          />
          <details className="cofunction-mistakes">
            <summary>{lesson.commonMistakes.title}</summary>
            <ul>{lesson.commonMistakes.items.map((item) => <li key={item.id}>{item.text}{item.math && <MathDisplay>{item.math}</MathDisplay>}</li>)}</ul>
          </details>
        </section>

        <section id="cofunction-summary" className="angles-radians-section">
          <SectionHeading number="07" title={lesson.summary.title} />
          <div className="cofunction-visual-summary">
            <MathDisplay>{lesson.summary.complementMath}</MathDisplay>
            <div>{lesson.summary.pairMap.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}</div>
            <strong>{lesson.summary.keyMessage}</strong>
          </div>
          <aside className="cofunction-calculus-connection">
            <div><p className="card-label">{lesson.summary.whyCalculus.title}</p><p>{lesson.summary.whyCalculus.text}</p></div>
            <ul>{lesson.summary.whyCalculus.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </aside>
          <div className="cofunction-completion-card">
            <div><p className="card-label">{saved.reviewed ? 'Lesson reviewed' : 'Review summary'}</p><h3>{lesson.completion.title}</h3><ul>{lesson.completion.outcomes.map((outcome) => <li key={outcome}>✓ {outcome}</li>)}</ul></div>
            <div><span>{lesson.completion.rememberLabel}</span><MathDisplay>{lesson.completion.rememberMath}</MathDisplay></div>
          </div>
          <nav className="angles-next-actions" aria-label="Continue from the cofunction relationships lesson">
            <button type="button" onClick={onPrevious}>← Previous: Six Trig Functions</button>
            <button type="button" onClick={() => scrollToSection('cofunction-check')}>Try Quick Check</button>
            <button type="button" onClick={() => scrollToSection('cofunction-complements')}>Review Again</button>
            <button type="button" onClick={onNext}>Back to lesson map →</button>
          </nav>
        </section>
      </div>
    </div>
  )
}
