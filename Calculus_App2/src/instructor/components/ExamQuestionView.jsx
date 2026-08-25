import { useState } from 'react'
import DetailedSolutionPanel, { SafeValue } from '../../components/review/DetailedSolutionPanel'

export default function ExamQuestionView({ question }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [shownParts, setShownParts] = useState(0)
  const [selfRating, setSelfRating] = useState('')
  const hints = question.hints || []
  const parts = question.solutionParts || []
  const solution = question.solution || {}

  const checkAnswer = () => {
    if (!answer.trim()) return
    const accepted = question.acceptedAnswers || (question.answer == null ? [] : [question.answer])
    if (!accepted.length) {
      setFeedback('Response recorded. Use a hint or compare your work with the optional detailed solution.')
      return
    }
    const normalize = (value) => String(value).trim().toLowerCase().replace(/\s+/g, '')
    setFeedback(accepted.some((value) => normalize(value) === normalize(answer))
      ? 'Correct. Your response matches the stored answer.'
      : (question.incorrectFeedback || 'Not yet. Recheck the method, sign, units, or requested form, then try again.'))
  }

  return <section className="exam-question-view">
    <div className="exam-question-prompt">
      <strong>Original exam question</strong>
      <SafeValue value={question.sourceQuestion || question.prompt} />
    </div>

    <section className="exam-try-first" aria-label="Try the question first">
      <h3>Try it first</h3>
      <label>Your answer or work<input value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback('') }} /></label>
      <div className="exam-solution-controls">
        <button type="button" onClick={checkAnswer} disabled={!answer.trim()}>Check answer</button>
        {hintCount < hints.length && <button type="button" onClick={() => setHintCount((count) => count + 1)}>Hint {hintCount + 1}</button>}
        {hintCount > 0 && <button type="button" onClick={() => setHintCount(0)}>Hide hints</button>}
        <button type="button" onClick={() => { setShowSolution((visible) => !visible); setShownParts((count) => count || Math.min(1, parts.length)) }}>
          {showSolution ? 'Hide detailed solution' : 'Show detailed solution'}
        </button>
      </div>
      {hints.slice(0, hintCount).map((hint, index) => <div className="exam-progressive-hint" key={index}><strong>Hint {index + 1}</strong><SafeValue value={hint} /></div>)}
      {feedback && <p className="exam-answer-feedback" role="status">{feedback}</p>}
    </section>

    {showSolution && <DetailedSolutionPanel
      solution={solution}
      fallbackParts={parts}
      visibleParts={shownParts}
      onShowPart={() => setShownParts((count) => Math.min(parts.length, count + 1))}
      onShowAll={() => setShownParts(parts.length)}
      onHide={() => { setShowSolution(false); setShownParts(0) }}
    />}

    {showSolution && <section className="exam-self-rating"><h3>How do you feel about this problem now?</h3>{['I understand it', 'I need another example', 'I am still confused'].map((label) => <button className={selfRating === label ? 'active' : ''} type="button" onClick={() => setSelfRating(label)} key={label}>{label}</button>)}</section>}
  </section>
}
