import React, { useEffect, useState } from 'react'

function renderBlock(block) {
  const { type, text } = block
  switch (type) {
    case 'teaching': return (<div style={{ marginBottom: 8 }}><strong>TEACHING NOTE</strong><div>{text}</div></div>)
    case 'definition': return (<div style={{ marginBottom: 8 }}><strong>DEFINITION</strong><div>{text}</div></div>)
    case 'important': return (<div style={{ marginBottom: 8 }}><strong>IMPORTANT PROPERTIES</strong><ul>{text.split('\n').map((l,i)=>(<li key={i}>{l}</li>))}</ul></div>)
    case 'ask': return (<div style={{ marginBottom: 8, fontStyle: 'italic' }}>ASK: {text}</div>)
    default: return (<div style={{ marginBottom: 8 }}>{text}</div>)
  }
}

export default function PresenterNotes({ notes, onChange }) {
  const [mode, setMode] = useState('view')
  const [draft, setDraft] = useState(notes || [])
  const [status, setStatus] = useState('Saved')

  useEffect(() => { setDraft(notes || []) }, [notes])

  // autosave
  useEffect(() => {
    if (mode !== 'edit') return
    setStatus('Saving...')
    const t = setTimeout(() => { onChange?.(draft); setStatus('Saved') }, 800)
    return () => clearTimeout(t)
  }, [draft, mode])

  if (mode === 'view') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Presenter Notes</h3>
          <div style={{ fontSize: 12, color: '#666' }}>
            <button className="text-button" onClick={() => setMode('edit')}>Edit Notes</button>
          </div>
        </div>
        <div style={{ color: '#222' }}>
          {draft && draft.length ? draft.map((b, i) => <div key={i}>{renderBlock(b)}</div>) : <div style={{ color: '#666' }}>No notes yet. Click Edit to add structured notes.</div>}
        </div>
      </div>
    )
  }

  // edit mode: simple textarea for structured JSON-like blocks one per line: type|text
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Edit Notes</h3>
        <div style={{ fontSize: 12 }}>
          <button className="text-button" onClick={() => { setMode('view'); setStatus('Saved') }}>Done</button>
        </div>
      </div>

      <div>
        <p style={{ marginTop: 0, color: '#666' }}>Quick editor: each line is <code>type|content</code>. Example: <code>teaching|Ask students which properties...</code></p>
        <textarea value={(draft || []).map(b => `${b.type}|${b.text}`).join('\n')} onChange={(e) => {
          const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean)
          const parsed = lines.map(l => {
            const idx = l.indexOf('|')
            if (idx === -1) return { type: 'note', text: l }
            return { type: l.slice(0, idx), text: l.slice(idx + 1) }
          })
          setDraft(parsed)
        }} style={{ width: '100%', minHeight: 220 }} />
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>{status}</div>
      </div>
    </div>
  )
}
