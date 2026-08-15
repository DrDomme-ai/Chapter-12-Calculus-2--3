import { useMemo, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import ExactValuePractice from '../../components/review/trigonometry/ExactValuePractice'
import InteractiveUnitCircle from '../../components/review/trigonometry/InteractiveUnitCircle'
import {
  CommonMistakeCard,
  ConceptCheck,
  DefinitionCard,
  FormulaCard,
  ProgressiveExample,
  SectionHeading,
  StudentChallenge,
  TopicMasteryCheck,
} from '../../components/review/trigonometry/TrigLessonBlocks'
import unitCircleLesson, { unitCircleExactValueQuestions } from '../../data/unitCircleLesson'
import '../../styles/algebra-review.css'
import '../../styles/angles-radians-lesson.css'
import '../../styles/unit-circle-lesson.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function toChoiceOptions(options) {
  return options.map((label, index) => ({ id: `option-${index}`, label }))
}

function toMasteryItems(items) {
  return items.map((item) => ({
    id: item.id,
    prompt: item.prompt,
    promptMath: item.math,
    options: item.options,
    correctAnswer: item.answerId,
    explanation: item.explanation,
  }))
}

function PracticeSolution({ solution }) {
  return (
    <div className="unit-practice-solution">
      <p>{solution.introduction}</p>
      {solution.steps.map((step, index) => (
        <div key={`${step.math}-${index}`}>
          <strong>Step {index + 1}</strong>
          <p>{step.text}</p>
          <MathDisplay>{step.math}</MathDisplay>
        </div>
      ))}
    </div>
  )
}

export default function UnitCircleLesson({
  completed = {},
  onCompletedChange,
  onOverview,
  onReviewHome,
  onHome,
  onPrevious,
  onPractice,
}) {
  const lesson = unitCircleLesson
  const [practiceCorrect, setPracticeCorrect] = useState(Boolean(completed.practice))
  const [exactPracticeCorrect, setExactPracticeCorrect] = useState(Boolean(completed.exactPractice))
  const [masteryResult, setMasteryResult] = useState(completed.mastery)
  const masteryItems = useMemo(() => toMasteryItems(lesson.masteryQuestions), [lesson.masteryQuestions])
  const progressItems = Number(practiceCorrect) + Number(exactPracticeCorrect) + Number(Boolean(masteryResult))
  const progressPercent = Math.round((progressItems / 3) * 100)

  const saveProgress = (patch) => {
    onCompletedChange?.({
      ...completed,
      ...(practiceCorrect ? { practice: true } : {}),
      ...(exactPracticeCorrect ? { exactPractice: true } : {}),
      ...(masteryResult ? { mastery: masteryResult } : {}),
      ...patch,
    })
  }

  const recordPractice = ({ correct }) => {
    if (!correct) return
    setPracticeCorrect(true)
    saveProgress({ practice: true })
  }

  const recordExactPractice = ({ correct }) => {
    if (!correct) return
    setExactPracticeCorrect(true)
    saveProgress({ exactPractice: true })
  }

  const recordMastery = (result) => {
    const nextResult = !masteryResult || result.percent >= masteryResult.percent ? result : masteryResult
    setMasteryResult(nextResult)
    saveProgress({ mastery: nextResult })
  }

  return (
    <div className="algebra-review-page angles-radians-page unit-circle-lesson-page">
      <nav className="algebra-review-toolbar angles-radians-toolbar" aria-label="Unit circle lesson navigation">
        <div>
          <button type="button" onClick={onOverview}>← Trigonometry Overview</button>
          <button type="button" onClick={onReviewHome}>Fundamental Review</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
        <span>{progressItems}/3 lesson goals complete</span>
      </nav>

      <header className="angles-radians-hero unit-circle-lesson-hero">
        <FoundationProgression current="Trigonometry" />
        <div className="angles-radians-hero-grid">
          <div>
            <p className="card-label">Foundation 02 · Trigonometry · Lesson 02</p>
            <span className="algebra-review-kicker">Visual lesson</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.introduction.text}</p>
            <div className="angles-radians-hero-actions">
              <button className="primary-button" type="button" onClick={() => scrollToSection('unit-explorer')}>Explore the circle →</button>
              <button className="secondary-button" type="button" onClick={() => scrollToSection('unit-practice')}>Jump to practice</button>
            </div>
          </div>
          <aside aria-label="Unit circle lesson progress">
            <span>Lesson progress</span>
            <strong>{progressPercent}%</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>Exact-value practice, guided practice, and mastery results are saved on this device.</p>
          </aside>
        </div>
      </header>

      <nav className="angles-radians-section-nav" aria-label="Unit circle lesson sections">
        {[
          ['unit-definition', '01', 'Meaning'],
          ['unit-explorer', '02', 'Explore'],
          ['unit-coordinates', '03', 'Why coordinates'],
          ['unit-exact-values', '04', 'Exact values'],
          ['unit-examples', '05', 'Examples'],
          ['unit-practice', '06', 'Practice'],
          ['unit-mastery', '07', 'Mastery'],
        ].map(([id, number, title]) => (
          <button type="button" key={id} onClick={() => scrollToSection(id)}><span>{number}</span>{title}</button>
        ))}
      </nav>

      <div className="angles-radians-content">
        <section id="unit-definition" className="angles-radians-section">
          <SectionHeading
            number="01"
            title="One rotating point stores two trig values"
            introduction={lesson.introduction.whyItMatters.text}
            question={lesson.introduction.question}
          />
          <div className="angles-definition-grid">
            <DefinitionCard title={lesson.definition.title} math={[lesson.definition.circleMath, lesson.definition.pointMath]}>
              <p>{lesson.definition.text}</p>
              <p>{lesson.definition.pointText}</p>
              <dl className="unit-coordinate-definitions">
                <div><dt>Horizontal coordinate</dt><dd><MathInline>{lesson.definition.coordinateLabels.horizontal}</MathInline></dd></div>
                <div><dt>Vertical coordinate</dt><dd><MathInline>{lesson.definition.coordinateLabels.vertical}</MathInline></dd></div>
              </dl>
            </DefinitionCard>
            <FormulaCard label={lesson.intuition.label} title={lesson.intuition.title} formula={lesson.intuition.tangentMath}>
              {lesson.intuition.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </FormulaCard>
          </div>
          <aside className="unit-calculus-connection">
            <p className="card-label">{lesson.introduction.whyItMatters.label}</p>
            <p>{lesson.introduction.whyItMatters.text}</p>
          </aside>
        </section>

        <section id="unit-explorer" className="angles-radians-section">
          <SectionHeading number="02" title="Move the point, then read the mathematics">
            <p>Rotate the radius by dragging the endpoint, using the angle slider, pressing the arrow keys, or selecting a special angle. Turn on practice mode when you are ready to predict before revealing.</p>
          </SectionHeading>
          <InteractiveUnitCircle />
        </section>

        <section id="unit-coordinates" className="angles-radians-section">
          <SectionHeading number="03" title={lesson.whyCoordinatesAreTrig.title} question={lesson.whyCoordinatesAreTrig.label}>
            <p>{lesson.whyCoordinatesAreTrig.text}</p>
          </SectionHeading>
          <div className="unit-coordinate-proof">
            {lesson.whyCoordinatesAreTrig.steps.map((step, index) => (
              <article key={step.math}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{step.text}</p>
                <MathDisplay>{step.math}</MathDisplay>
              </article>
            ))}
          </div>
          <p className="unit-quadrant-note">{lesson.whyCoordinatesAreTrig.quadrantNote}</p>
        </section>

        <section id="unit-exact-values" className="angles-radians-section">
          <SectionHeading number="04" title="Exact values are coordinates, not decimals">
            <p>Use the reference angle for magnitude and the terminal point for sign. The table is a reference; the practice lab asks you to reason from the geometry.</p>
          </SectionHeading>
          <div className="unit-angle-table-region" role="region" aria-label="Unit circle exact-value table" tabIndex="0">
            <table className="unit-angle-table">
              <caption>Exact values at the standard unit-circle angles</caption>
              <thead><tr><th scope="col">Degrees</th><th scope="col">Radians</th><th scope="col">Location</th><th scope="col">Cosine</th><th scope="col">Sine</th><th scope="col">Tangent</th></tr></thead>
              <tbody>
                {lesson.specialAngles.map((angle) => (
                  <tr key={angle.id}>
                    <th scope="row"><MathInline>{angle.degreeMath}</MathInline></th>
                    <td><MathInline>{angle.radianMath}</MathInline></td>
                    <td>{angle.quadrant}</td>
                    <td><MathInline>{angle.cosMath}</MathInline></td>
                    <td><MathInline>{angle.sinMath}</MathInline></td>
                    <td><MathInline>{angle.tanMath}</MathInline></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ExactValuePractice questions={unitCircleExactValueQuestions} onResult={recordExactPractice} />
          {exactPracticeCorrect && <p className="angles-saved-message" role="status">✓ Exact-value practice goal saved.</p>}
        </section>

        <section id="unit-examples" className="angles-radians-section">
          <SectionHeading number="05" title="Worked examples">
            <p>Reveal each argument one step at a time: locate the angle, identify a reference angle, apply coordinate signs, and only then state the value.</p>
          </SectionHeading>
          <div className="angles-example-grid">
            {lesson.workedExamples.map((example) => (
              <ProgressiveExample
                key={example.id}
                label={`${example.level} example`}
                title={example.title}
                prompt={example.prompt}
                promptMath={example.problemMath}
                steps={example.steps}
                conclusion="The circle supplies both the exact magnitude and its sign."
                conclusionMath={example.answerMath}
              />
            ))}
          </div>
        </section>

        <section id="unit-practice" className="angles-radians-section">
          <SectionHeading number="06" title="Your turn">
            <p>Use an exact reference value and the quadrant signs. Hints reveal the strategy gradually; the full solution remains separate.</p>
          </SectionHeading>
          <StudentChallenge
            label={lesson.practice.label}
            title={lesson.practice.title}
            prompt={lesson.practice.prompt}
            promptMath={lesson.practice.math}
            fields={lesson.practice.fields.map((field) => ({
              id: field.id,
              label: field.label,
              labelMath: field.mathLabel,
              acceptedAnswers: field.acceptedAnswers,
              placeholder: field.id === 'tangent' ? 'Example: sqrt(3)/3' : 'Example: -sqrt(3)/2',
              helpText: 'Enter an exact value; use sqrt for a radical.',
            }))}
            hints={lesson.practice.hints}
            solution={<PracticeSolution solution={lesson.practice.solution} />}
            onResult={recordPractice}
          />
          {practiceCorrect && <p className="angles-saved-message" role="status">✓ Guided-practice goal saved.</p>}

          <div className="unit-mistake-grid">
            {lesson.commonMistakes.map((mistake) => (
              <CommonMistakeCard
                key={mistake.id}
                label={mistake.label}
                title={mistake.title}
                claimMath={String.raw`${mistake.angleMath}\qquad ${mistake.incorrectMath}`}
                question={mistake.question}
                explanation={mistake.explanation}
                correctionMath={mistake.correctionMath}
              />
            ))}
          </div>

          <div className="angles-concept-grid">
            {lesson.conceptChecks.map((check) => {
              const options = toChoiceOptions(check.options)
              return (
                <ConceptCheck
                  key={check.id}
                  title={check.prompt}
                  options={options}
                  correctAnswer={options[check.options.indexOf(check.answer)].id}
                  explanation={check.explanation}
                />
              )
            })}
          </div>
        </section>

        <section id="unit-mastery" className="angles-radians-section angles-mastery-section">
          <SectionHeading number="07" title="Unit circle mastery check">
            <p>Check coordinates, undefined values, and the way quadrant signs identify an angle.</p>
          </SectionHeading>
          <TopicMasteryCheck
            title="Unit circle readiness"
            description="Answer all three questions. Your best result is saved locally."
            items={masteryItems}
            previousResult={masteryResult}
            onComplete={recordMastery}
          />
          <div className="angles-summary-card">
            <div>
              <p className="card-label">Summary</p>
              <h3>{lesson.summary.title}</h3>
              <ul>{lesson.summary.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div>{lesson.summary.formulaReview.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}</div>
          </div>
          <nav className="angles-next-actions" aria-label="Continue from the unit circle lesson">
            <button type="button" onClick={onPrevious}>← Previous: Angles and Radians</button>
            <button type="button" onClick={onOverview}>Trigonometry Overview</button>
            <button type="button" onClick={onPractice}>Guided practice →</button>
          </nav>
        </section>
      </div>
    </div>
  )
}
