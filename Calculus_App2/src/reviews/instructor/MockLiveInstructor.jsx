import React, { useEffect, useState } from 'react'
import mockLive from '../../lib/mockLive'
import LectureJoinQRCode from '../../components/LectureJoinQRCode'
import { makeJoinUrl } from '../../lib/url'

export default function MockLiveInstructor({ lectureId = 'real-numbers' }) {
  const [session, setSession] = useState(null)
  const [showJoinScreen, setShowJoinScreen] = useState(false)

  useEffect(() => {
    let unsub
    if (session) {
      unsub = mockLive.subscribeSession(session.id, (s) => setSession({ ...s }))
    }
    return () => unsub?.()
  }, [session?.id])

  const start = () => {
    const s = mockLive.createSession({ lectureId, createdBy: 'instructor' })
    setSession({ ...s })
  }

  const end = () => {
    if (!session) return
    mockLive.endSession(session.id)
    setSession(null)
  }

  const next = () => {
    if (!session) return
    mockLive.changeSlide(session.id, (session.current_slide_index || 0) + 1)
  }

  const prev = () => {
    if (!session) return
    mockLive.changeSlide(session.id, Math.max(0, (session.current_slide_index || 0) - 1))
  }

  const openQuestion = () => {
    if (!session) return
    mockLive.openQuestion(session.id, {
      type: 'mcq',
      prompt: 'Which number is irrational?',
      options: ['2/3', '-5', 'sqrt(2)', '0.75'],
      correct_option_index: 2,
    })
  }

  const openComprehension = () => {
    if (!session) return
    mockLive.openComprehension(session.id)
  }

  // compute simple aggregates for comprehension
  const comprehensionAggregate = session?.comprehensions?.length
    ? (function () {
        const total = session.comprehensions.length
        const mathSum = session.comprehensions.reduce((acc, entry) => acc + (entry.data.mathCorrect || 0), 0)
        const avgMath = Math.round((mathSum / (total * (session.comprehensions[0]?.data?.mathTotal || 1))) * 100)
        const avgConfidence = Math.round((session.comprehensions.reduce((s, e) => s + (e.data.confidence || 0), 0) / total) * 10) / 10
        return { total, avgMath, avgConfidence }
      })()
    : null

  return (
    <div className="page live-instructor">
      <h1>Instructor Controls — Live Session</h1>

      {!session && <button onClick={start} className="primary-button">Start Live Lecture</button>}

      {session && (
        <div>
          <p>Session id: {session.id}</p>
          <p>Join code: <strong>{session.join_code}</strong></p>
          <p>Slide index: {session.current_slide_index}</p>
          <p>Students joined: {session.participants.length}</p>

          <div style={{ display: 'flex', gap: 8, margin: '12px 0', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={prev} className="secondary-button">Previous</button>
              <button onClick={next} className="secondary-button">Next</button>
              <button onClick={openQuestion} className="secondary-button">Open MCQ</button>
              <button onClick={openComprehension} className="secondary-button">Request end-of-lecture comprehension</button>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setShowJoinScreen(true)} className="secondary-button">Show Join Screen</button>
              <button onClick={() => {
                const link = makeJoinUrl(session.join_code)
                navigator.clipboard?.writeText(link)
                alert('Join link copied')
              }} className="text-button">Copy Join Link</button>
              <button onClick={() => { navigator.clipboard?.writeText(session.join_code); alert('Class code copied') }} className="text-button">Copy Class Code</button>
              <button onClick={() => { mockLive.regenerateJoinCode(session.id); }} className="text-button">Regenerate Code</button>
              <button onClick={end} className="text-button">End</button>
            </div>
          </div>

          <section>
            <h3>Private instructor dashboard (live)</h3>
            <p>Status: {session.status}</p>
            <p>Students joined: {session.participants.length}</p>
            {session.responses && (
              <div>
                <h4>Responses (private)</h4>
                <table>
                  <thead><tr><th>ID</th><th>Answer</th><th>Time</th></tr></thead>
                  <tbody>
                    {session.responses.map((r) => (
                      <tr key={r.id}><td>{r.id}</td><td>{String(r.answer)}</td><td>{r.submitted_at}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {session.comprehension_open && (
              <div>
                <h4>Comprehension open — submissions: {session.comprehensions?.length || 0}</h4>
                {comprehensionAggregate && (
                  <div>
                    <p>Average math %: {comprehensionAggregate.avgMath}%</p>
                    <p>Average confidence: {comprehensionAggregate.avgConfidence}</p>
                  </div>
                )}
                <details>
                  <summary>Private student submissions</summary>
                  <ul>
                    {(session.comprehensions || []).map((c) => (
                      <li key={c.id}>{c.participant?.name || 'Student'} — math correct: {c.data.mathCorrect}/{c.data.mathTotal} — confidence: {c.data.confidence} — muddy: {c.data.muddyPoint || '—'}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </section>

          {showJoinScreen && (
            <div className="join-projector" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
              <div style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 920, width: '95%', textAlign: 'center' }}>
                <h2 style={{ marginTop: 0 }}>{lectureId === 'real-numbers' ? 'Real Numbers & Algebra' : lectureId}</h2>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <LectureJoinQRCode joinUrl={makeJoinUrl(session.join_code)} sessionCode={session.join_code} lectureTitle={lectureId === 'real-numbers' ? 'Real Numbers & Algebra' : lectureId} size={360} />
                  <div style={{ maxWidth: 360, textAlign: 'left' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: 6 }}>Scan to join or visit:</p>
                    <p style={{ fontFamily: 'monospace', background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{makeJoinUrl(session.join_code)}</p>
                    <p style={{ marginTop: 8 }}>Class Code: <strong style={{ fontSize: '1.25rem' }}>{session.join_code}</strong></p>
                    <p>Students joined: <strong>{session.participants.length}</strong></p>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button onClick={() => setShowJoinScreen(false)} className="secondary-button">Hide Join Screen</button>
                      <button onClick={() => { navigator.clipboard?.writeText(makeJoinUrl(session.join_code)); alert('Join link copied') }} className="text-button">Copy Join Link</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
