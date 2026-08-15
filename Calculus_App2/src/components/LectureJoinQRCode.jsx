import React from 'react'
import QRCode from 'react-qr-code'

export default function LectureJoinQRCode({ joinUrl, sessionCode, lectureTitle, size = 280 }) {
  const padding = 24
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16 }}>
      <div style={{ background: '#fff', padding, borderRadius: 8 }}>
        <QRCode value={joinUrl} size={size} />
      </div>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        {lectureTitle && <div style={{ fontWeight: 600 }}>{lectureTitle}</div>}
        {sessionCode && <div style={{ marginTop: 6, fontSize: '1.1rem' }}>Class Code: <strong>{sessionCode}</strong></div>}
      </div>
    </div>
  )
}
