import { useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import RightTriangleSixFunctions from '../../components/review/trigonometry/RightTriangleSixFunctions'
import SixFunctionsExplorer, { TrigRelationshipMap } from '../../components/review/trigonometry/SixFunctionsExplorer'
import {
  CommonMistakeCard,
  ConceptCheck,
  ProgressiveExample,
  SectionHeading,
} from '../../components/review/trigonometry/TrigLessonBlocks'
import {
  SixFunctionsCheck,
  SixFunctionValuePractice,
  WhichFunctionsSurvive,
} from '../../components/review/trigonometry/SixFunctionsPractice'
import lesson from '../../data/sixTrigFunctionsLesson'
import '../../styles/algebra-review.css'
import '../../styles/angles-radians-lesson.css'
import '../../styles/six-trig-functions-lesson.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function adaptQuestion(question) {
  return {
    ...question,
    type: question.type === 'multiple-choice' ? 'choice' : question.type,
    correctAnswer: question.answerId,
    correctAnswers: question.answerIds,
    explanation: question.explanation || 'Use the relationships among the six functions.',
  }
}

function buildSurvivalCases(angles) {
  const positions = ['right', 'top', 'left', 'bottom']
  return angles.map((angle, index) => ({
    id: angle.id,
    angleMath: angle.angleMath,
    definedFunctions: angle.definedIds,
    coordinateMath: String.raw`P=${angle.pointMath},\qquad \sin\theta=${angle.sinMath},\quad \cos\theta=${angle.cosMath}`,
    position: positions[index],
    visualLabel: `Unit-circle point at the axis angle shown; ${angle.explanation}`,
    explanation: angle.explanation,
    reasonMath: angle.emphasisMath || String.raw`\sin\theta=${angle.sinMath},\qquad\cos\theta=${angle.cosMath}`,
  }))
}

export default function SixTrigFunctionsLesson({
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
  const survivalCases = useMemo(() => buildSurvivalCases(lesson.survivalChallenge.angles), [])
  const completedGoals = saved.reviewed
    ? 4
    : ['relationships', 'practice', 'survival'].filter((key) => Boolean(saved[key])).length
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
    window.requestAnimationFrame(() => scrollToSection('six-functions-diagnostic'))
  }

  const recordDiagnostic = (result) => {
    const best = !saved.diagnostic || result.percent >= saved.diagnostic.percent ? result : saved.diagnostic
    save({ diagnostic: best, ...(result.score === 3 ? { reviewed: true } : {}) })
  }

  const recordQuickCheck = (result) => {
    const best = !saved.quickCheck || result.percent >= saved.quickCheck.percent ? result : saved.quickCheck
    save({ quickCheck: best, ...(result.score >= lesson.quickCheck.passingScore ? { reviewed: true } : {}) })
  }

  return (
    <div className="algebra-review-page angles-radians-page six-functions-lesson-page">
      <nav className="algebra-review-toolbar angles-radians-toolbar" aria-label="Six trigonometric functions lesson navigation">
        <div>
          <button type="button" onClick={onOverview}>← Trigonometry Overview</button>
          <button type="button" onClick={onReviewHome}>Fundamental Review</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
        <span>{saved.reviewed ? 'Reviewed' : `${completedGoals}/4 review goals complete`}</span>
      </nav>

      <header className="angles-radians-hero six-functions-hero">
        <FoundationProgression current="Trigonometry" />
        <div className="angles-radians-hero-grid">
          <div>
            <p className="card-label">Foundation 02 · Trigonometry · Lesson 03</p>
            <span className="algebra-review-kicker">{lesson.status}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
            <p className="six-functions-time">Review time: {lesson.estimatedReviewTime} · Quick path: {lesson.quickPathTime}</p>
            <div className="angles-radians-hero-actions">
              <button className="primary-button" type="button" onClick={openDiagnostic}>I remember this — Quick Check</button>
              <button className="secondary-button" type="button" onClick={() => scrollToSection('six-functions-foundations')}>Review it with me</button>
            </div>
          </div>
          <aside aria-label="Six trigonometric functions lesson progress">
            <span>{saved.reviewed ? 'Lesson status' : 'Lesson progress'}</span>
            <strong>{saved.reviewed ? 'Reviewed' : `${progressPercent}%`}</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>Your reciprocal match, exact-value practice, survival challenge, and check result are saved on this device.</p>
          </aside>
        </div>
      </header>

      {showDiagnostic && (
        <section id="six-functions-diagnostic" className="six-diagnostic-wrap">
          <SixFunctionsCheck
            label="3–5 minute path"
            title={lesson.diagnostic.title}
            description={lesson.diagnostic.description}
            questions={diagnosticQuestions}
            previousResult={saved.diagnostic}
            passPercent={100}
            onComplete={recordDiagnostic}
          />
          {!saved.reviewed && <button type="button" className="secondary-button" onClick={() => scrollToSection('six-functions-foundations')}>Review it with me</button>}
        </section>
      )}

      <nav className="angles-radians-section-nav six-functions-section-nav" aria-label="Six trigonometric functions lesson sections">
        {[
          ['six-functions-foundations', '01', 'Sine & cosine'],
          ['six-functions-tangent', '02', 'Tangent'],
          ['six-functions-reciprocals', '03', 'Reciprocals'],
          ['six-functions-triangle', '04', 'Triangle'],
          ['six-functions-undefined', '05', 'Undefined'],
          ['six-functions-practice', '06', 'Exact values'],
          ['six-functions-check', '07', 'Quick check'],
          ['six-functions-summary', '08', 'Summary'],
        ].map(([id, number, title]) => (
          <button type="button" key={id} onClick={() => scrollToSection(id)}><span>{number}</span>{title}</button>
        ))}
      </nav>

      <div className="angles-radians-content six-functions-content">
        <section id="six-functions-foundations" className="angles-radians-section">
          <SectionHeading
            number="01"
            title="Start with sine and cosine"
            question="Six functions. Two ingredients."
          >
            <p>{lesson.sineCosineFoundation.whyItMatters}</p>
          </SectionHeading>
          <SixFunctionsExplorer
            onMilestone={(milestone) => {
              if (milestone === 'all-six') save({ explored: true })
            }}
          />
          <aside className="six-foundation-note">
            <strong>Why this matters</strong>
            <span>Sine and cosine are the foundation. The other four functions are built from them.</span>
          </aside>
        </section>

        <section id="six-functions-tangent" className="angles-radians-section">
          <SectionHeading number="02" title={lesson.tangentBuild.title} question={lesson.tangentBuild.question} />
          <ProgressiveExample
            label="Build the relationship"
            title="From unit-circle coordinates to tangent"
            promptMath={lesson.tangentBuild.openingPointMath}
            steps={lesson.tangentBuild.steps}
            conclusion="Vertical divided by horizontal becomes sine divided by cosine."
            conclusionMath={lesson.tangentBuild.steps.at(-1).math}
          />
          <div className="six-tangent-discovery">
            <div><p className="card-label">Important discovery</p><h3>Move toward the top of the circle.</h3><p>{lesson.tangentBuild.discovery.prompt}</p></div>
            <div><MathDisplay>{lesson.tangentBuild.discovery.limitMath}</MathDisplay><MathDisplay>{lesson.tangentBuild.discovery.conclusionMath}</MathDisplay></div>
            <strong>Tangent is perfectly happy until cosine becomes zero.</strong>
          </div>
        </section>

        <section id="six-functions-reciprocals" className="angles-radians-section">
          <SectionHeading number="03" title="Build the reciprocal functions" question={lesson.reciprocalRelationships.question}>
            <p>Reveal each reciprocal, then match the three partner pairs.</p>
          </SectionHeading>
          <TrigRelationshipMap onComplete={() => save({ relationships: true })} />
          {saved.relationships && <p className="angles-saved-message" role="status">✓ Reciprocal-pair goal saved.</p>}
          <CommonMistakeCard
            title="Secant and cosecant are easy to reverse"
            claimMath={lesson.commonMistakes.featured.incorrectMath}
            explanation={lesson.commonMistakes.featured.explanation}
            correctionMath={lesson.commonMistakes.featured.correctionMath}
          >
            <p><strong>{lesson.commonMistakes.featured.memoryLine}</strong></p>
          </CommonMistakeCard>
        </section>

        <section id="six-functions-triangle" className="angles-radians-section">
          <SectionHeading number="04" title={lesson.triangleConnection.title} question="Make the triangle larger. Did the ratios change?">
            <p>{lesson.triangleConnection.discovery}</p>
          </SectionHeading>
          <RightTriangleSixFunctions />
        </section>

        <section id="six-functions-undefined" className="angles-radians-section">
          <SectionHeading number="05" title={lesson.undefinedReasoning.title} question="Which denominator can become zero?" />
          <div className="six-denominator-grid">
            {lesson.undefinedReasoning.denominatorGroups.map((group) => (
              <article key={group.id}>
                <p className="card-label">When this coordinate is zero</p>
                <MathDisplay>{group.coordinateCondition}</MathDisplay>
                <div>{group.formulas.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}</div>
                <strong>{group.functions.map((name) => name.toUpperCase()).join(' and ')} are undefined.</strong>
                <p>{group.visualCue}</p>
              </article>
            ))}
          </div>
          <div className="six-denominator-rule"><MathDisplay>{lesson.undefinedReasoning.ruleMath}</MathDisplay></div>
          <WhichFunctionsSurvive cases={survivalCases} onComplete={() => save({ survival: true })} />
          {saved.survival && <p className="angles-saved-message" role="status">✓ Axis-angle reasoning goal saved.</p>}
        </section>

        <section id="six-functions-practice" className="angles-radians-section">
          <SectionHeading number="06" title="Exact values: build four from two">
            <p>Start with the unit-circle point. Then use one quotient and three reciprocal relationships.</p>
          </SectionHeading>
          <ProgressiveExample
            label="Worked example"
            title={lesson.workedExample.title}
            prompt={lesson.workedExample.prompt}
            promptMath={lesson.workedExample.problemMath}
            steps={lesson.workedExample.steps}
            conclusion="All six values came from the same unit-circle point."
            conclusionMath={lesson.workedExample.answerMath}
          />
          <SixFunctionValuePractice practice={lesson.practice} onComplete={() => save({ practice: true })} />
          {saved.practice && <p className="angles-saved-message" role="status">✓ Six-value practice goal saved.</p>}
        </section>

        <section id="six-functions-check" className="angles-radians-section">
          <SectionHeading number="07" title="Quick check">
            <p>Four short questions check relationships, reciprocals, zero denominators, and an exact quotient.</p>
          </SectionHeading>
          <SixFunctionsCheck
            title={lesson.quickCheck.title}
            description={lesson.quickCheck.description}
            questions={quickQuestions}
            previousResult={saved.quickCheck}
            passPercent={75}
            onComplete={recordQuickCheck}
          />
          <ConceptCheck
            label={lesson.optionalChallenge.label}
            title={lesson.optionalChallenge.title}
            prompt={lesson.optionalChallenge.prompt}
            promptMath={lesson.optionalChallenge.promptMath}
            options={lesson.optionalChallenge.options}
            correctAnswer={lesson.optionalChallenge.answerId}
            explanation={lesson.optionalChallenge.explanation}
          />
          <details className="six-mistake-summary">
            <summary>{lesson.commonMistakes.title}</summary>
            <ol>{lesson.commonMistakes.items.map((item) => <li key={item.id}><p>{item.text}</p><MathInline>{item.math}</MathInline></li>)}</ol>
          </details>
        </section>

        <section id="six-functions-summary" className="angles-radians-section">
          <SectionHeading number="08" title={lesson.summary.title} />
          <div className="six-visual-summary">
            <div className="six-summary-foundations">
              {lesson.summary.foundations.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}
            </div>
            <span>build</span>
            <div>{lesson.summary.formulas.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}</div>
            <strong>Six functions. Two foundations.</strong>
          </div>
          <aside className="six-calculus-connection">
            <div><p className="card-label">{lesson.summary.whyCalculus.title}</p><p>{lesson.summary.whyCalculus.text}</p></div>
            <ul>{lesson.summary.whyCalculus.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </aside>
          <div className="six-completion-card">
            <div><p className="card-label">{saved.reviewed ? 'Lesson reviewed' : 'Review summary'}</p><h3>{lesson.completion.title}</h3><ul>{lesson.completion.outcomes.map((outcome) => <li key={outcome}>✓ {outcome}</li>)}</ul></div>
            <div><span>{lesson.completion.rememberLabel}</span><MathDisplay>{lesson.completion.rememberMath}</MathDisplay></div>
          </div>
          <nav className="angles-next-actions" aria-label="Continue from the six trigonometric functions lesson">
            <button type="button" onClick={onPrevious}>← Previous: The Unit Circle</button>
            <button type="button" onClick={() => scrollToSection('six-functions-check')}>Try Quick Check</button>
            <button type="button" onClick={() => scrollToSection('six-functions-foundations')}>Review Again</button>
            <button type="button" onClick={onNext}>Next Lesson →</button>
          </nav>
        </section>
      </div>
    </div>
  )
}
