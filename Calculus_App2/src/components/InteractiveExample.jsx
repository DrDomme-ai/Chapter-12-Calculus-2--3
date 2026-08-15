import { useState } from 'react'
import { MathDisplay } from './MathDisplay'

const normalize = (value) => value.trim().replace(/\s+/g, ' ').replace(/\*/g, '').replace(/\\cdot/g, '').replace(/\^\{/g, '^').toLowerCase()

export default function InteractiveExample({ example, isInstructor }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  function checkAnswer() {
    const normalizedStudent = normalize(answer)
    const normalizedAnswer = normalize(example.answer || '')

    if (!normalizedAnswer) {
      setFeedback('The instructor answer is not available yet.')
      return
    }

    setFeedback(normalizedStudent === normalizedAnswer
      ? 'Correct — well done.'
      : 'Not quite. Try another form or use the instructor notes for structure.')
  }

  return (
    <div className="interactive-example">
      <div className="example-header">
        <span className="card-label">Example</span>
        <h3>{example.title}</h3>
      </div>
      <div className="example-body">
        {example.type && (
          <p className="example-type">
            {example.type === 'teacher-demo' ? 'Class example' : example.type === 'student-practice' ? 'Student practice' : example.type}
          </p>
        )}
        {example.prompt && <p>{example.prompt}</p>}
        {example.math ? <MathDisplay>{example.math}</MathDisplay> : example.prompt && <MathDisplay>{example.prompt}</MathDisplay>}
        {example.interactive?.prompt && <p className="example-prompt">{example.interactive.prompt}</p>}
      </div>

      <label className="example-input">
        <span>Your answer</span>
        <input
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Type your final answer here"
        />
      </label>

      <div className="example-actions">
        <button type="button" onClick={checkAnswer}>Check answer</button>
        <button type="button" className="secondary-button" onClick={() => setShowHint(!showHint)}>
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
        {isInstructor && (
          <button type="button" className="secondary-button" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Hide solution' : 'Show solution'}
          </button>
        )}
      </div>

      {feedback && <div className="example-feedback" role="status">{feedback}</div>}
      {showHint && example.interactive?.hint && <div className="example-hint"><strong>Hint:</strong> {example.interactive.hint}</div>}
      {isInstructor && showAnswer && (
        <div className="example-solution">
          <h4>Instructor solution</h4>
          <MathDisplay>{example.instructorSolution}</MathDisplay>
        </div>
      )}
    </div>
  )
}
