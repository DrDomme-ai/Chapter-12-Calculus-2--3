import { useMemo, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import FoundationProgression from '../../components/review/fundamental/FoundationProgression'
import AngleRadiansExplorer from '../../components/review/trigonometry/AngleRadiansExplorer'
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
import angleRadiansLesson from '../../data/angleRadiansLesson'
import '../../styles/algebra-review.css'
import '../../styles/angles-radians-lesson.css'

function scrollToSection(id) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function toChoiceOptions(options) {
  return options.map((label, index) => ({ id: `option-${index}`, label }))
}

function toMasteryItems(items) {
  return items.map((item) => {
    if (item.type === 'multi-expression') {
      return {
        id: item.id,
        prompt: item.prompt,
        promptMath: item.math,
        options: [
          { id: 'correct', label: 'The angle is π/2 radians, or 90°.' },
          { id: 'radius', label: 'The angle is 2π radians, or 360°.' },
          { id: 'arc', label: 'The angle is π/5 radians, or 36°.' },
        ],
        correctAnswer: 'correct',
        explanation: item.explanation,
      }
    }

    const correctLabel = item.id === 'angle-mastery-conversion' ? '5π/4' : '7π'
    const labels = item.id === 'angle-mastery-conversion'
      ? ['5π/4', '4π/5', '225π']
      : ['7π', '7π/6', '42π']

    return {
      id: item.id,
      prompt: item.prompt,
      promptMath: item.math,
      options: labels.map((label, index) => ({ id: index === 0 ? 'correct' : `choice-${index}`, label })),
      correctAnswer: 'correct',
      explanation: `${item.explanation} The correct value is ${correctLabel}.`,
    }
  })
}

function PracticeSolution({ solution }) {
  return (
    <div className="angles-practice-solution">
      <p>{solution.introduction}</p>
      {solution.steps.map((step) => (
        <div key={step.part}>
          <strong>Part {step.part}</strong>
          <MathDisplay>{step.math}</MathDisplay>
        </div>
      ))}
    </div>
  )
}

export default function AnglesRadiansLesson({
  completed = {},
  onCompletedChange,
  onOverview,
  onReviewHome,
  onHome,
  onNext,
  onPractice,
}) {
  const lesson = angleRadiansLesson
  const [practiceCorrect, setPracticeCorrect] = useState(Boolean(completed.practice))
  const masteryItems = useMemo(() => toMasteryItems(lesson.masteryQuestions), [lesson.masteryQuestions])
  const savedMastery = completed.mastery
  const progressItems = Number(Boolean(completed.practice)) + Number(Boolean(savedMastery))
  const progressPercent = Math.round((progressItems / 2) * 100)

  const recordPractice = ({ correct }) => {
    setPracticeCorrect(correct)
    if (correct && !completed.practice) onCompletedChange?.({ ...completed, practice: true })
  }

  const recordMastery = (result) => {
    const nextResult = !savedMastery || result.percent >= savedMastery.percent ? result : savedMastery
    onCompletedChange?.({ ...completed, mastery: nextResult })
  }

  return (
    <div className="algebra-review-page angles-radians-page">
      <nav className="algebra-review-toolbar angles-radians-toolbar" aria-label="Angles and radians lesson navigation">
        <div>
          <button type="button" onClick={onOverview}>← Trigonometry Overview</button>
          <button type="button" onClick={onReviewHome}>Fundamental Review</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
        <span>{progressItems}/2 lesson goals complete</span>
      </nav>

      <header className="angles-radians-hero">
        <FoundationProgression current="Trigonometry" />
        <div className="angles-radians-hero-grid">
          <div>
            <p className="card-label">Foundation 02 · Trigonometry · Lesson 01</p>
            <span className="algebra-review-kicker">Visual lesson</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.introduction.text}</p>
            <div className="angles-radians-hero-actions">
              <button className="primary-button" type="button" onClick={() => scrollToSection('angle-rotation')}>Explore rotation →</button>
              <button className="secondary-button" type="button" onClick={() => scrollToSection('angle-practice')}>Jump to practice</button>
            </div>
          </div>
          <aside aria-label="Angles and radians lesson progress">
            <span>Lesson progress</span>
            <strong>{progressPercent}%</strong>
            <progress max="100" value={progressPercent}>{progressPercent}%</progress>
            <p>Practice and mastery results are saved on this device.</p>
          </aside>
        </div>
      </header>

      <nav className="angles-radians-section-nav" aria-label="Angles and radians lesson sections">
        {[
          ['angle-rotation', '01', 'Rotation'],
          ['angle-measures', '02', 'Measure'],
          ['angle-conversions', '03', 'Conversions'],
          ['angle-calculus', '04', 'Why radians'],
          ['angle-examples', '05', 'Examples'],
          ['angle-practice', '06', 'Practice'],
          ['angle-mastery', '07', 'Mastery'],
        ].map(([id, number, title]) => (
          <button type="button" key={id} onClick={() => scrollToSection(id)}><span>{number}</span>{title}</button>
        ))}
      </nav>

      <div className="angles-radians-content">
        <section id="angle-rotation" className="angles-radians-section">
          <SectionHeading
            number="01"
            title="An angle records rotation"
            introduction={lesson.introduction.whyItMatters.text}
            question={lesson.introduction.question}
          />
          <div className="angles-definition-grid">
            <DefinitionCard title={lesson.definition.title} math={lesson.definition.coterminalFormula}>
              <p>{lesson.definition.text}</p>
              <dl className="angles-direction-list">
                <div><dt>Positive direction</dt><dd>{lesson.definition.positiveDirection}</dd></div>
                <div><dt>Negative direction</dt><dd>{lesson.definition.negativeDirection}</dd></div>
              </dl>
            </DefinitionCard>
            <DefinitionCard label={lesson.radianDefinition.label} title={lesson.radianDefinition.title} math={[lesson.radianDefinition.formula, lesson.radianDefinition.equivalentFormula]}>
              <p>{lesson.radianDefinition.text}</p>
              <p>{lesson.radianDefinition.oneRadian}</p>
            </DefinitionCard>
          </div>
          <AngleRadiansExplorer />
        </section>

        <section id="angle-measures" className="angles-radians-section">
          <SectionHeading number="02" title="One rotation, three descriptions">
            <p>Degrees divide a turn into 360 pieces. Radians compare arc length with radius. Revolutions compare the angle with one full turn.</p>
          </SectionHeading>
          <div className="angles-equivalence-grid">
            {lesson.specialEquivalences.map((angle) => (
              <article key={angle.degrees}>
                <span>{angle.degrees}°</span>
                <MathDisplay>{String.raw`${angle.degreeMath}=${angle.radians}\text{ rad}`}</MathDisplay>
                <div className="angles-revolution-value"><MathDisplay>{String.raw`${angle.revolutions}\text{ revolution}`}</MathDisplay></div>
              </article>
            ))}
          </div>
          <div className="angles-why-card">
            <p className="card-label">Why is one full turn 2π radians?</p>
            <h3>Circle circumference supplies the answer.</h3>
            <p>A complete arc has length <strong>2πr</strong>. Dividing that arc length by the radius gives <strong>2π</strong>, so one full revolution measures 2π radians.</p>
            <MathDisplay>{String.raw`\theta=\frac{s}{r}=\frac{2\pi r}{r}=2\pi`}</MathDisplay>
          </div>
        </section>

        <section id="angle-conversions" className="angles-radians-section">
          <SectionHeading number="03" title="Convert by canceling units">
            <p>A conversion factor equals one. Arrange it so the unit you do not want cancels and the desired unit remains.</p>
          </SectionHeading>
          <div className="angles-formula-grid">
            {lesson.conversionFormulas.map((formula) => (
              <FormulaCard key={formula.id} title={formula.title} formula={formula.formula} description={formula.cue}>
                <MathDisplay>{formula.factor}</MathDisplay>
              </FormulaCard>
            ))}
          </div>
        </section>

        <section id="angle-calculus" className="angles-radians-section">
          <SectionHeading number="04" title={lesson.whyRadians.title} question={lesson.whyRadians.label} />
          <div className="angles-calculus-card">
            <div>
              {lesson.whyRadians.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p>{lesson.whyRadians.conclusion}</p>
            </div>
            <div>
              {lesson.whyRadians.formulas.map((formula) => <MathDisplay key={formula}>{formula}</MathDisplay>)}
              <details>
                <summary>What changes if the input is measured in degrees?</summary>
                <MathDisplay>{lesson.whyRadians.degreeContrast}</MathDisplay>
              </details>
            </div>
          </div>
          <CommonMistakeCard
            title={lesson.commonMistake.title}
            claim={lesson.commonMistake.scenario}
            claimMath={lesson.commonMistake.incorrectMath}
            question={lesson.commonMistake.question}
            explanation={lesson.commonMistake.explanation}
            correctionMath={lesson.commonMistake.correctionSteps.join(String.raw`\qquad`)}
          >
            <p>{lesson.commonMistake.calculusConnection}</p>
          </CommonMistakeCard>
        </section>

        <section id="angle-examples" className="angles-radians-section">
          <SectionHeading number="05" title="Worked examples">
            <p>Reveal one step at a time. Units and geometric meaning drive each solution.</p>
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
                conclusion="The exact forms describe the same rotation."
                conclusionMath={example.answer}
              />
            ))}
          </div>
        </section>

        <section id="angle-practice" className="angles-radians-section">
          <SectionHeading number="06" title="Your turn">
            <p>Complete all three exact-value tasks before asking for the full solution.</p>
          </SectionHeading>
          <StudentChallenge
            label={lesson.practice.label}
            title={lesson.practice.title}
            prompt={lesson.practice.directions}
            fields={lesson.practice.parts.map((part) => ({
              id: part.id,
              label: part.prompt,
              labelMath: part.math,
              acceptedAnswers: part.acceptedAnswers,
              placeholder: part.id.includes('degrees') ? 'Example: -300' : 'Example: 7pi/4',
              helpText: part.id.includes('degrees') ? 'Enter the numerical degree measure.' : 'Use pi for π.',
            }))}
            hints={lesson.practice.hints}
            solution={<PracticeSolution solution={lesson.practice.solution} />}
            onResult={recordPractice}
          />
          {practiceCorrect && <p className="angles-saved-message" role="status">✓ Practice goal saved.</p>}
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

        <section id="angle-mastery" className="angles-radians-section angles-mastery-section">
          <SectionHeading number="07" title="Angles and radians mastery check">
            <p>Check conversion, arc length, and the geometric definition of a radian.</p>
          </SectionHeading>
          <TopicMasteryCheck
            title="Angle and radian readiness"
            description="Answer all three questions. Your best result is saved locally."
            items={masteryItems}
            previousResult={savedMastery}
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
          <nav className="angles-next-actions" aria-label="Continue from the angles and radians lesson">
            <button type="button" onClick={onOverview}>← Trigonometry Overview</button>
            <button type="button" onClick={onPractice}>Guided practice</button>
            <button type="button" onClick={onNext}>Next: The Unit Circle →</button>
          </nav>
        </section>
      </div>
    </div>
  )
}
