import { useId, useMemo, useState } from 'react'
import { cofunctionMatchingActivity } from '../../../data/cofunctionLesson'
import { MathInline } from '../../MathDisplay'
import '../../../styles/cofunction-matching-lab.css'

const EMPTY_ITEMS = Object.freeze([])
const EMPTY_MATCHES = Object.freeze({})

function shuffledCopy(items, seed) {
  const copy = [...items]
  let value = seed + 1

  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0
    const swapIndex = value % (index + 1)
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  if (copy.length > 1 && copy.every((item, index) => item.id === items[index].id)) {
    copy.push(copy.shift())
  }

  return copy
}

/**
 * Keyboard- and touch-friendly matching activity for the cofunction lesson.
 * Pass another object with the matchingActivity schema to reuse the lab.
 */
export function CofunctionMatchingLab({
  activity = cofunctionMatchingActivity,
  onComplete,
}) {
  const titleId = useId()
  const directionsId = useId()
  const feedbackId = useId()
  const leftItems = activity?.leftItems || EMPTY_ITEMS
  const rightItems = activity?.rightItems || EMPTY_ITEMS
  const expectedMatches = activity?.matches || EMPTY_MATCHES
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [shuffleSeed, setShuffleSeed] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState({
    kind: 'instruction',
    message: 'Choose one expression from either column to begin.',
  })
  const shuffledRightItems = useMemo(
    () => shuffledCopy(rightItems, shuffleSeed),
    [rightItems, shuffleSeed],
  )
  const total = leftItems.length

  const pairForLeft = (leftId) => matchedPairs.find((pair) => pair.leftId === leftId)
  const pairForRight = (rightId) => matchedPairs.find((pair) => pair.rightId === rightId)

  const checkPair = (leftId, rightId) => {
    if (expectedMatches[leftId] !== rightId) {
      setSelectedLeft(leftId)
      setSelectedRight(rightId)
      setFeedback({
        kind: 'incorrect',
        message: 'Not a match yet. Complement the angle, then switch to the paired cofunction.',
      })
      return
    }

    const nextPairs = [...matchedPairs, {
      leftId,
      rightId,
      number: matchedPairs.length + 1,
    }]
    const completed = total > 0 && nextPairs.length === total
    setMatchedPairs(nextPairs)
    setSelectedLeft(null)
    setSelectedRight(null)
    setIsComplete(completed)
    setFeedback(completed
      ? { kind: 'success', message: activity.successMessage || 'Every pair is correct.' }
      : { kind: 'correct', message: `Match ${nextPairs.length} is correct. Choose another pair.` })

    if (completed && !isComplete) {
      onComplete?.({
        correct: true,
        total,
        matches: Object.fromEntries(nextPairs.map((pair) => [pair.leftId, pair.rightId])),
      })
    }
  }

  const chooseLeft = (leftId) => {
    if (pairForLeft(leftId)) return
    if (selectedLeft === leftId) {
      setSelectedLeft(null)
      setFeedback({ kind: 'instruction', message: 'Selection cleared. Choose an expression to continue.' })
      return
    }
    if (selectedRight) {
      checkPair(leftId, selectedRight)
      return
    }
    setSelectedLeft(leftId)
    setFeedback({ kind: 'instruction', message: 'Left expression selected. Now choose its complementary-angle form.' })
  }

  const chooseRight = (rightId) => {
    if (pairForRight(rightId)) return
    if (selectedRight === rightId) {
      setSelectedRight(null)
      setFeedback({ kind: 'instruction', message: 'Selection cleared. Choose an expression to continue.' })
      return
    }
    if (selectedLeft) {
      checkPair(selectedLeft, rightId)
      return
    }
    setSelectedRight(rightId)
    setFeedback({ kind: 'instruction', message: 'Complementary-angle form selected. Now choose its matching function.' })
  }

  const reset = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatchedPairs([])
    setIsComplete(false)
    setShuffleSeed((seed) => seed + 1)
    setFeedback({ kind: 'instruction', message: 'Matching reset. The right column has been reshuffled.' })
  }

  if (!leftItems.length || !rightItems.length) return null

  return (
    <section className="cofunction-match" aria-labelledby={titleId} aria-describedby={directionsId}>
      <header className="cofunction-match__header">
        <div>
          <p className="cofunction-match__eyebrow">Matching lab</p>
          <h3 id={titleId}>{activity.title}</h3>
          <p id={directionsId}>{activity.directions}</p>
          <p className="cofunction-match__help">Select one button in each column. Correct pairs lock automatically; you can start on either side.</p>
        </div>
        <div className="cofunction-match__progress" aria-label={`${matchedPairs.length} of ${total} pairs matched`}>
          <span><strong>{matchedPairs.length}</strong> of {total} matched</span>
          <progress value={matchedPairs.length} max={total}>{matchedPairs.length} of {total}</progress>
        </div>
      </header>

      <div className="cofunction-match__board">
        <div className="cofunction-match__column" role="group" aria-label="Functions of theta">
          <h4>Function</h4>
          {leftItems.map((item) => {
            const pair = pairForLeft(item.id)
            const selected = selectedLeft === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`cofunction-match__choice${selected ? ' is-selected' : ''}${pair ? ' is-matched' : ''}`}
                aria-pressed={selected}
                aria-disabled={Boolean(pair)}
                aria-describedby={feedbackId}
                onClick={() => chooseLeft(item.id)}
              >
                <span className="cofunction-match__math"><MathInline>{item.math}</MathInline></span>
                {pair && <span className="cofunction-match__badge" aria-label={`Matched pair ${pair.number}`}>✓ Pair {pair.number}</span>}
                {selected && <span className="cofunction-match__badge">Selected</span>}
              </button>
            )
          })}
        </div>

        <div className="cofunction-match__column" role="group" aria-label="Complementary-angle forms">
          <h4>Complementary-angle form</h4>
          {shuffledRightItems.map((item) => {
            const pair = pairForRight(item.id)
            const selected = selectedRight === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`cofunction-match__choice${selected ? ' is-selected' : ''}${pair ? ' is-matched' : ''}`}
                aria-pressed={selected}
                aria-disabled={Boolean(pair)}
                aria-describedby={feedbackId}
                onClick={() => chooseRight(item.id)}
              >
                <span className="cofunction-match__math"><MathInline>{item.math}</MathInline></span>
                {pair && <span className="cofunction-match__badge" aria-label={`Matched pair ${pair.number}`}>✓ Pair {pair.number}</span>}
                {selected && <span className="cofunction-match__badge">Selected</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="cofunction-match__footer">
        <p id={feedbackId} className={`cofunction-match__feedback is-${feedback.kind}`} role="status" aria-live="polite">
          <span aria-hidden="true">{feedback.kind === 'incorrect' ? '!' : feedback.kind === 'success' || feedback.kind === 'correct' ? '✓' : '→'}</span>
          {feedback.message}
        </p>
        <button type="button" className="cofunction-match__reset" onClick={reset}>Reset and reshuffle</button>
      </div>
    </section>
  )
}

export default CofunctionMatchingLab
