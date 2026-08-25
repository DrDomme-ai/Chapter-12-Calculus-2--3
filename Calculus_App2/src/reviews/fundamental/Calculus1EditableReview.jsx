import ReviewRunner from '../../components/review/ReviewRunner'
import { MathDisplay } from '../../components/MathDisplay'
import { flattenReviewQuestions } from '../../data/courseReviews/calculus1'

const mathKey = /math|formula|equation|given|master|example|work|answer|expression|derivative|integral|symbol/i
const hiddenKeys = new Set(['id', 'questions', 'acceptedAnswers', 'type'])
const labelFor = (key) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase())

function ContentValue({ name, value }) {
  if (value == null || value === '') return null
  const showLabel = name && name.toLowerCase() !== 'math'

  if (typeof value === 'string' || typeof value === 'number') {
    return <div className="calculus-content-value">
      {showLabel && <strong>{labelFor(name)}</strong>}
      {typeof value === 'string' && mathKey.test(name || '')
        ? <MathDisplay>{value}</MathDisplay>
        : <p>{String(value)}</p>}
    </div>
  }

  if (Array.isArray(value)) {
    const simple = value.every((item) => ['string', 'number'].includes(typeof item))
    if (simple) return <div className="calculus-content-value">
      {showLabel && <strong>{labelFor(name)}</strong>}
      {mathKey.test(name || '')
        ? value.map((item, index) => <MathDisplay key={`${item}-${index}`}>{String(item)}</MathDisplay>)
        : <ul>{value.map((item, index) => <li key={`${item}-${index}`}>{String(item)}</li>)}</ul>}
    </div>
    return <div>{name && <h4>{labelFor(name)}</h4>}{value.map((item, index) => <ContentValue key={index} name="" value={item} />)}</div>
  }

  return <section className="calculus-content-group">
    {name && <h4>{labelFor(name)}</h4>}
    {Object.entries(value)
      .filter(([key]) => !hiddenKeys.has(key))
      .map(([key, item]) => <ContentValue key={key} name={key} value={item} />)}
  </section>
}

export default function Calculus1EditableReview({ review, completed, onCompletedChange, onReviewCenter, onHome }) {
  const questions = review.questions || flattenReviewQuestions(review)

  return <>
    <section className="calculus-authored-content" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px' }}>
      <p className="eyebrow">Complete authored lesson</p>
      <h2>{review.titleLines.join(' ')}</h2>
      {review.overview && <ContentValue name="overview" value={review.overview} />}
      {(review.stations || []).map((station, index) => <details
        key={station.id || index}
        open={index === 0}
        style={{ margin: '18px 0', padding: '18px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff' }}
      >
        <summary style={{ cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>{station.title || `Section ${index + 1}`}</summary>
        <ContentValue name="" value={station} />
      </details>)}
      {review.finalSummary && <ContentValue name="final summary" value={review.finalSummary} />}
    </section>

    <ReviewRunner
      className="calculus-one-editable-review"
      eyebrowText="Shared Fundamental Review · Calculus I"
      titleLines={review.titleLines}
      description={review.description}
      topicLabel={review.topicLabel}
      topicDescription={review.topicDescription}
      stations={review.stations}
      questions={questions}
      completed={completed}
      onCompletedChange={onCompletedChange}
      onReviewCenter={onReviewCenter}
      onHome={onHome}
      summaryHeadings={{ complete: 'This Calculus I foundation is ready.', nearly: 'This foundation is nearly ready.', continue: 'Keep building this Calculus I foundation.' }}
      summaryDescription={review.titleLines.join(' ').toLowerCase()}
    />
  </>
}
