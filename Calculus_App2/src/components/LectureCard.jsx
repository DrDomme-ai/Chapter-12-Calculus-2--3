import React from 'react'

export default function LectureCard({
  title,
  description,
  meta = [],
  status = 'ready',
  onOpen,
  onStartLive,
  onJoin,
  disabled = false,
}) {
  const isComing = status === 'coming-soon'

  return (
    <article className={`instructor-card ${isComing ? 'coming-soon' : ''}`} style={{ padding: 16, borderRadius: 6, background: 'white', boxShadow: 'none' }}>
      <div className="card-meta" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {meta.map((m, i) => (
          <span key={i} className="meta-pill" style={{ padding: '6px 10px', background: 'rgba(0,122,102,0.06)', borderRadius: 14, fontSize: 12, color: '#006a57', fontWeight: 600 }}>{m.toUpperCase()}</span>
        ))}
      </div>

      <h2 style={{ margin: '6px 0 8px' }}>{title}</h2>
      <p style={{ margin: '0 0 16px', color: '#333', lineHeight: 1.4 }}>{description}</p>

      <div className="instructor-actions" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <button onClick={onOpen} className="primary-button" disabled={isComing || disabled} style={{ width: '100%' }}>Open Lecture</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="role-label" style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>INSTRUCTOR</div>
            <button onClick={onStartLive} className="secondary-button" disabled={isComing || disabled}>Start Live Lecture</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="role-label" style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>STUDENT</div>
            <button onClick={onJoin} className="text-button" disabled={isComing || disabled}>Join Live Class</button>
          </div>
        </div>
      </div>

      {isComing && (
        <div style={{ marginTop: 12, color: '#777' }}><em>Coming soon — interactive lecture card scaffolded for future content.</em></div>
      )}
    </article>
  )
}
