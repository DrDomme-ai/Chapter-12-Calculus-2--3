import { useState } from 'react'

const categories = ['Clarification', 'Calculation', 'Concept', 'Other']

export default function FeedbackPanel() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [messages, setMessages] = useState([])

  function submitFeedback() {
    const trimmed = message.trim()
    if (!trimmed) return
    setMessages((current) => [{ id: Date.now(), category, text: trimmed }, ...current])
    setMessage('')
    setCategory(categories[0])
  }

  return (
    <section className="feedback-panel">
      <div className="feedback-header">
        <h2>Student feedback</h2>
        <p>Students can submit a quick note and category. Instructors see all responses immediately.</p>
      </div>
      <label>
        <span>Category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="I'm stuck on the integration by parts setup." />
      </label>
      <button type="button" className="primary-button" onClick={submitFeedback}>Submit feedback</button>
      <div className="feedback-list">
        {messages.length === 0 ? (
          <p className="empty-feedback">No feedback yet.</p>
        ) : (
          messages.map((entry) => (
            <div key={entry.id} className="feedback-message">
              <span className="feedback-category">{entry.category}</span>
              <p>{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
