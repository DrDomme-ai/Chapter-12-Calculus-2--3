import { useEffect, useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import NumberSystemExplorer from '../../components/review/algebra/NumberSystemExplorer'
import RealNumberLine from '../../components/review/algebra/RealNumberLine'
import InequalityIntervalLab from '../../components/review/algebra/InequalityIntervalLab'
import AbsoluteValueLab from '../../components/review/algebra/AbsoluteValueLab'
import AlgebraLawsLab from '../../components/review/algebra/AlgebraLawsLab'
import ExponentRulesLab from '../../components/review/algebra/ExponentRulesLab'
import FunctionExplorer from '../../components/review/algebra/FunctionExplorer'
import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import {
  algebraMasteryQuestions,
  algebraMistakes,
  algebraObjectives,
  algebraSections,
  signPractice,
} from '../../data/algebraReview'
import '../../styles/algebra-review.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function SectionHeading({ number, title, introduction, question, children }) {
  return (
    <header className="algebra-section-heading">
      <span aria-hidden="true">{number}</span>
      <div>
        <p className="card-label">Foundation 01 · Algebra</p>
        <h2>{title}</h2>
        {introduction && <p className="algebra-section-introduction">{introduction}</p>}
        {question && <p className="algebra-opening-question">{question}</p>}
        {children}
      </div>
    </header>
  )
}

function IntegerSubtractionDemo() {
  const [position, setPosition] = useState(2)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setTimeout(() => {
      const nextPosition = Math.max(-4, position - 1)
      setPosition(nextPosition)
      if (nextPosition === -4) setRunning(false)
    }, 330)
    return () => window.clearTimeout(timer)
  }, [position, running])

  const begin = () => {
    setPosition(2)
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) setPosition(-4)
    else setRunning(true)
  }

  const x = 40 + ((position + 6) / 12) * 640

  return (
    <div className="algebra-demo-card">
      <div className="algebra-demo-copy">
        <p className="card-label">Subtraction in motion</p>
        <h3>Start at 2, then move six units left.</h3>
        <p>Integers let subtraction continue past zero, so removing more than the starting amount still has a meaningful result.</p>
      </div>
      <svg className="algebra-integer-line" viewBox="0 0 720 125" role="img" aria-label={`Number line showing the current position at ${position}`}>
        <line x1="40" y1="64" x2="680" y2="64" />
        {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => {
          const tickX = 40 + ((value + 6) / 12) * 640
          return <g key={value}><line x1={tickX} y1="54" x2={tickX} y2="74" /><text x={tickX} y="96">{value}</text></g>
        })}
        <line className="algebra-motion-path" x1={40 + (8 / 12) * 640} y1="38" x2={x} y2="38" />
        <circle className="algebra-moving-point" cx={x} cy="64" r="10" />
        <text className="algebra-moving-label" x={x} y="28">{position}</text>
      </svg>
      <div className="algebra-demo-actions">
        <button className="primary-button" type="button" onClick={begin} disabled={running}>{running ? 'Moving…' : 'Animate 2 − 6'}</button>
        <MathDisplay>{String.raw`2-6=${position === -4 ? '-4' : '?'}`}</MathDisplay>
      </div>
    </div>
  )
}

function DivisionMeaningLab() {
  const [divisor, setDivisor] = useState(2)
  return (
    <div className="algebra-demo-card algebra-division-lab">
      <div>
        <p className="card-label">Why can the denominator not be zero?</p>
        <h3>Division asks for a missing group count.</h3>
        <p><MathInline>{String.raw`6\div2=3`}</MathInline> asks how many groups of size 2 make 6. Three groups work.</p>
      </div>
      <div className="algebra-choice-tabs" role="group" aria-label="Choose a divisor">
        <button type="button" className={divisor === 2 ? 'active' : ''} onClick={() => setDivisor(2)}>Explore 6 ÷ 2</button>
        <button type="button" className={divisor === 0 ? 'active' : ''} onClick={() => setDivisor(0)}>Explore 6 ÷ 0</button>
      </div>
      {divisor === 2 ? (
        <div className="algebra-group-visual" aria-label="Six dots arranged as three groups of two">
          {[0, 1, 2].map((group) => <span key={group}><i /><i /></span>)}
          <p>Three groups × two in each group = six.</p>
        </div>
      ) : (
        <div className="algebra-zero-group" role="status">
          <MathDisplay>{String.raw`?\cdot0=6`}</MathDisplay>
          <p>Every finite number multiplied by zero gives zero, never six. There is no finite group count that solves this request, so division by zero is undefined.</p>
        </div>
      )}
    </div>
  )
}

function CommonMistakeLab() {
  const [revealed, setRevealed] = useState({})
  return (
    <section className="algebra-mistake-section" aria-labelledby="algebra-mistakes-title">
      <header>
        <p className="card-label">Common mistakes that break calculus</p>
        <h2 id="algebra-mistakes-title">What went wrong?</h2>
        <p>Each statement below is tempting—and false. Predict the issue before opening the explanation.</p>
      </header>
      <div className="algebra-mistake-grid">
        {algebraMistakes.map((mistake, index) => (
          <article key={mistake.id} className="algebra-mistake-card">
            <span className="algebra-mistake-number">Mistake {index + 1}</span>
            <MathDisplay>{mistake.claim}</MathDisplay>
            {index === 0 && (
              <svg className="algebra-square-model" viewBox="0 0 180 180" role="img" aria-label="Square split into a squared, b squared, and two ab rectangles">
                <rect x="10" y="10" width="160" height="160" />
                <line x1="105" y1="10" x2="105" y2="170" /><line x1="10" y1="105" x2="170" y2="105" />
                <text x="53" y="62">a²</text><text x="132" y="140">b²</text><text x="130" y="62">ab</text><text x="55" y="140">ab</text>
              </svg>
            )}
            <button
              type="button"
              className="secondary-button"
              aria-expanded={Boolean(revealed[mistake.id])}
              onClick={() => setRevealed((current) => ({ ...current, [mistake.id]: !current[mistake.id] }))}
            >
              {revealed[mistake.id] ? 'Hide explanation' : 'Reveal what went wrong'}
            </button>
            {revealed[mistake.id] && (
              <div className="algebra-mistake-answer" role="status">
                <MathDisplay>{mistake.correction}</MathDisplay>
                <p>{mistake.explanation}</p>
                <MathDisplay>{mistake.counterexample}</MathDisplay>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function SignPractice() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const current = signPractice[index]

  const check = () => setFeedback(answer.trim() === current.answer ? 'correct' : 'incorrect')
  const next = () => {
    setIndex((currentIndex) => (currentIndex + 1) % signPractice.length)
    setAnswer('')
    setFeedback(null)
  }

  return (
    <div className="algebra-sign-practice">
      <div>
        <p className="card-label">Rapid-fire practice</p>
        <span>Question {index + 1} of {signPractice.length}</span>
        <MathDisplay>{current.prompt}</MathDisplay>
      </div>
      <label>
        Product or quotient
        <input value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && check()} inputMode="numeric" />
      </label>
      <div className="algebra-demo-actions">
        <button className="primary-button" type="button" onClick={check}>Check answer</button>
        <button className="secondary-button" type="button" onClick={next}>Next</button>
      </div>
      {feedback && (
        <p className={`algebra-feedback ${feedback}`} role="status">
          {feedback === 'correct' ? 'Correct. The sign and magnitude both agree.' : 'Not yet. Decide the sign first, then multiply the magnitudes.'}
        </p>
      )}
    </div>
  )
}

function MasteryCheck({ completed, onCompletedChange }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const question = algebraMasteryQuestions[index]
  const correct = selected === question.answer
  const completeCount = algebraMasteryQuestions.filter((item) => completed?.[item.id]).length

  const check = () => {
    if (!selected) return
    setChecked(true)
    if (correct && !completed?.[question.id]) {
      onCompletedChange?.({ ...completed, [question.id]: true })
    }
  }

  const move = (direction) => {
    setIndex((current) => Math.max(0, Math.min(algebraMasteryQuestions.length - 1, current + direction)))
    setSelected('')
    setChecked(false)
  }

  return (
    <div className="algebra-mastery-card">
      <div className="algebra-mastery-progress">
        <div><span>Mastery progress</span><strong>{completeCount}/{algebraMasteryQuestions.length}</strong></div>
        <progress max={algebraMasteryQuestions.length} value={completeCount}>{completeCount}</progress>
      </div>
      <p className="card-label">{question.concept} · Question {index + 1}</p>
      <h3>{question.prompt}</h3>
      {question.promptMath && <MathDisplay>{question.promptMath}</MathDisplay>}
      <div className="algebra-answer-options" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option, optionIndex) => (
          <label key={option} className={selected === option ? 'selected' : ''}>
            <input type="radio" name={question.id} value={option} checked={selected === option} onChange={() => { setSelected(option); setChecked(false) }} />
            <span>{question.optionsMath?.[optionIndex] ? <MathInline>{question.optionsMath[optionIndex]}</MathInline> : option}</span>
          </label>
        ))}
      </div>
      <div className="algebra-demo-actions">
        <button className="primary-button" type="button" onClick={check} disabled={!selected}>Check answer</button>
        <button className="secondary-button" type="button" onClick={() => move(-1)} disabled={index === 0}>Previous</button>
        <button className="secondary-button" type="button" onClick={() => move(1)} disabled={index === algebraMasteryQuestions.length - 1}>Next</button>
      </div>
      {checked && (
        <div className={`algebra-feedback-panel ${correct ? 'correct' : 'incorrect'}`} role="status">
          <strong>{correct ? 'Correct.' : 'Try again.'}</strong>
          <p>{correct ? question.explanation : 'Revisit the related section, then compare every option with the definition—not only with a remembered pattern.'}</p>
        </div>
      )}
      {completeCount === algebraMasteryQuestions.length && (
        <div className="algebra-complete-message" role="status">
          <span aria-hidden="true">✓</span>
          <div><strong>Algebra foundation complete</strong><p>You can return to any section whenever a calculus problem exposes an algebra gap.</p></div>
        </div>
      )}
    </div>
  )
}

export default function AlgebraReview({ completed = {}, onCompletedChange, onReviewHome, onHome }) {
  const completeCount = Object.values(completed).filter(Boolean).length
  const progressPercent = Math.round((completeCount / algebraMasteryQuestions.length) * 100)
  const sectionLinks = useMemo(() => algebraSections, [])

  return (
    <div className="algebra-review-page">
      <nav className="algebra-review-toolbar" aria-label="Algebra review navigation">
        <div>
          <button type="button" onClick={onReviewHome}>← Fundamental Review</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
        <span>{completeCount}/{algebraMasteryQuestions.length} mastery checks complete</span>
      </nav>

      <header className="algebra-review-hero">
        <FoundationProgression current="Algebra" />
        <div className="algebra-review-hero-grid">
          <div>
            <p className="card-label">Foundation 01</p>
            <span className="algebra-review-kicker">Fundamental Review</span>
            <h1>Algebra</h1>
            <h2>The mathematical language calculus is built on.</h2>
            <p>Before we differentiate, integrate, or work in three dimensions, we need a language for numbers, expressions, and functions. This review refreshes the algebraic ideas that appear constantly throughout calculus.</p>
            <button className="primary-button" type="button" onClick={() => scrollToSection('algebra-objectives')}>Begin review →</button>
          </div>
          <aside aria-label="Algebra module progress">
            <span>Mastery</span>
            <strong>{progressPercent}%</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>Progress is saved in the same shared review record for both courses.</p>
          </aside>
        </div>
      </header>

      <section id="algebra-objectives" className="algebra-objectives" aria-labelledby="algebra-objectives-title">
        <div>
          <p className="card-label">Learning objectives</p>
          <h2 id="algebra-objectives-title">By the end of this review, you should be able to:</h2>
        </div>
        <ul>{algebraObjectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
      </section>

      <nav className="algebra-section-nav" aria-label="Algebra review sections">
        {sectionLinks.map((section) => <button key={section.id} type="button" onClick={() => scrollToSection(section.id)}><span>{section.number}</span>{section.title}</button>)}
      </nav>

      <div className="algebra-review-content">
        <section id="real-numbers" className="algebra-lesson-section">
          <SectionHeading
            number="01"
            title="The Real Number System"
            introduction={<>At the foundation of mathematics lies a simple but powerful idea: objects can be organized into collections called <strong>sets</strong>. Among the most important are sets of numbers, which give us a precise language for counting, measuring, comparing, and describing quantities throughout mathematics, science, and engineering.</>}
            question="What kinds of numbers do we actually use in calculus?"
          >
            <p>The real numbers form a nested family. Each larger set keeps the earlier numbers and adds new possibilities.</p>
          </SectionHeading>
          <NumberSystemExplorer />
          <div className="algebra-concept-grid">
            <article><p className="card-label">Natural numbers</p><MathDisplay>{String.raw`\mathbb N=\{1,2,3,4,\ldots\}`}</MathDisplay><p>These counting numbers answer questions such as “How many objects are there?” Examples include 7, 24, and 103.</p></article>
            <article><p className="card-label">Integers</p><MathDisplay>{String.raw`\mathbb Z=\{\ldots,-2,-1,0,1,2,\ldots\}`}</MathDisplay><p>Adding zero and negative whole numbers makes subtraction meaningful even when the amount removed is larger than the amount present.</p></article>
            <article><p className="card-label">Rational numbers</p><MathDisplay>{String.raw`\mathbb Q=\left\{\frac pq:p,q\in\mathbb Z,\ q\neq0\right\}`}</MathDisplay><p>Fractions, integers, terminating decimals, and repeating decimals belong here. For example, <MathInline>{String.raw`5=\frac51`}</MathInline> and <MathInline>{String.raw`0.25=\frac14`}</MathInline>.</p></article>
            <article><p className="card-label">Irrational numbers</p><MathDisplay>{String.raw`\sqrt2,\ \pi,\ e\in\mathbb R\setminus\mathbb Q`}</MathDisplay><p>Their decimals neither end nor fall into a repeating block. A nonterminating decimal is not automatically irrational: repeating decimals are rational.</p></article>
          </div>
          <IntegerSubtractionDemo />
          <DivisionMeaningLab />
        </section>

        <section id="number-line" className="algebra-lesson-section">
          <SectionHeading number="02" title="The Real Number Line">
            <p>Every real number marks exactly one location. Position turns “greater than” and “less than” into geometry.</p>
          </SectionHeading>
          <RealNumberLine />
        </section>

        <section id="inequalities" className="algebra-lesson-section">
          <SectionHeading number="03" title="Inequalities and Intervals">
            <p><MathInline>{String.raw`a>b`}</MathInline> places a to the right of b; <MathInline>{String.raw`a<b`}</MathInline> places a to the left. Brackets include a finite endpoint; parentheses exclude it.</p>
          </SectionHeading>
          <div className="algebra-formula-row" aria-label="Inequality and interval examples">
            <div><MathDisplay>{String.raw`x>2\iff x\in(2,\infty)`}</MathDisplay></div>
            <div><MathDisplay>{String.raw`-3\le x<4\iff x\in[-3,4)`}</MathDisplay></div>
            <div><MathDisplay>{String.raw`x\le5\iff x\in(-\infty,5]`}</MathDisplay></div>
          </div>
          <InequalityIntervalLab />
        </section>

        <section id="absolute-value" className="algebra-lesson-section">
          <SectionHeading number="04" title="Absolute Value as Distance">
            <p>Absolute value measures distance. It is not merely an instruction to erase a negative sign.</p>
          </SectionHeading>
          <AbsoluteValueLab />
        </section>

        <section id="algebra-laws" className="algebra-lesson-section">
          <SectionHeading number="05" title="Rules of Algebra">
            <p>These laws are not arbitrary tricks. They express stable properties of addition and multiplication that let equivalent expressions keep the same value.</p>
          </SectionHeading>
          <AlgebraLawsLab />
          <CommonMistakeLab />
        </section>

        <section id="signs" className="algebra-lesson-section">
          <SectionHeading number="06" title="Rules of Signs">
            <p>A negative sign means “take the opposite.” Multiplying by a negative reverses direction; applying that reversal twice restores the original direction.</p>
          </SectionHeading>
          <div className="algebra-sign-grid">
            {[[String.raw`(+)(+)`, '+'], [String.raw`(+)(-)`, '−'], [String.raw`(-)(+)`, '−'], [String.raw`(-)(-)`, '+']].map(([rule, result]) => (
              <div key={rule}><MathInline>{rule}</MathInline><span aria-hidden="true">→</span><strong>{result}</strong></div>
            ))}
          </div>
          <SignPractice />
        </section>

        <section id="exponents" className="algebra-lesson-section">
          <SectionHeading number="07" title="Exponent Rules">
            <p>For a positive integer n, <MathInline>{String.raw`a^n`}</MathInline> is a compact record of repeated multiplication. The broader exponent rules preserve that pattern.</p>
          </SectionHeading>
          <ExponentRulesLab />
        </section>

        <section id="functions" className="algebra-lesson-section">
          <SectionHeading number="08" title="Functions and Their Graphs">
            <p>A function assigns exactly one output to each allowed input. Calculus studies how those outputs change.</p>
          </SectionHeading>
          <FunctionExplorer />
          <aside className="algebra-connection-card">
            <p className="card-label">Connection to calculus</p>
            <h3>Functions are the objects that calculus investigates.</h3>
            <p>Limits track nearby outputs, derivatives measure their rate of change, and integrals accumulate them. Domain restrictions, graph shape, and inverse relationships are therefore calculus skills—not side topics.</p>
          </aside>
        </section>

        <section id="mastery" className="algebra-lesson-section algebra-mastery-section">
          <SectionHeading number="09" title="Algebra Mastery Check">
            <p>Use definitions and structure rather than pattern matching. Correct answers are saved automatically.</p>
          </SectionHeading>
          <MasteryCheck completed={completed} onCompletedChange={onCompletedChange} />
        </section>
      </div>
    </div>
  )
}
