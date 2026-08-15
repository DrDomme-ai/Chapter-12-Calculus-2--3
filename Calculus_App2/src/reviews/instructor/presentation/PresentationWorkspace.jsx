import React, { useEffect, useState, useRef } from 'react'
import { MathDisplay } from '../../../components/MathDisplay'
import AnnotationCanvas from './AnnotationCanvas'
import LectureJoinQRCode from '../../../components/LectureJoinQRCode'
import PresenterNotes from './PresenterNotes'
import mockLive from '../../../lib/mockLive'
import { makeJoinUrl } from '../../../lib/url'

const initialSlides = [
  { id: 1, type: 'title', title: 'Real Numbers & Algebra', content: ['Review Week', 'Real Numbers — Number Systems and Algebraic Foundations'], notes: 'Introduce sets and field axioms.' },
  { id: 2, type: 'definition', title: 'Important Sets of Numbers', content: ["\\mathbb{N} = {1,2,3,...}", "\\mathbb{Z} = {...,-2,-1,0,1,2,...}", "\\mathbb{Q} = {p/q : p,q\\in\\mathbb{Z}, q\\ne0}"] , notes: 'Highlight containment relationships.'},
  { id: 3, type: 'axiom', title: 'Field Axioms', content: ['Closure, commutativity, associativity, distributivity, identities, inverses'], notes: 'Give examples.'},
  { id: 4, type: 'example', title: 'Polynomial example', content: ['f(x)=x^2-3x+2', 'f(2)=0'], notes: 'Solve step by step.'},
  { id: 5, type: 'question', title: 'Checkpoint Questions', content: ['Explain why 5/0 cannot be defined.', 'Containment: N ⊂ Z ⊂ Q ⊂ R', 'Simplify a^7/a^3'], notes: 'Ask students to discuss.'},
]

export default function PresentationWorkspace({ lectureId = 'real-numbers' }) {
  const [slides, setSlides] = useState(() => {
    // load saved from localStorage if exists
    try {
      const raw = localStorage.getItem('presentation:real-numbers:slides')
      return raw ? JSON.parse(raw) : initialSlides
    } catch (e) { return initialSlides }
  })
  const [index, setIndex] = useState(0)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#d00')
  const [lineWidth, setLineWidth] = useState(3)
  const [presentMode, setPresentMode] = useState(false)
  const [session, setSession] = useState(null)
  const [showJoinScreen, setShowJoinScreen] = useState(false)
  const canvasRef = useRef(null)
  const presentationUnsubRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [showSlidesPanel, setShowSlidesPanel] = useState(true)
  const [showNotesPanel, setShowNotesPanel] = useState(true)

  useEffect(() => localStorage.setItem('presentation:real-numbers:slides', JSON.stringify(slides)), [slides])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') setIndex((i) => Math.min(i + 1, slides.length - 1))
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setIndex((i) => Math.max(i - 1, 0))
      if (e.key === 'Home') setIndex(0)
      if (e.key === 'End') setIndex(slides.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  const current = slides[index]

  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1))

  const startLive = () => {
    const s = mockLive.createSession({ lectureId, createdBy: 'instructor' })
    setSession({ ...s })
    // subscribe to live session updates
    const unsub = mockLive.subscribeSession(s.id, (updated) => setSession({ ...updated }))
    // store unsubscribe on ref so we can cleanup when ending
    presentationUnsubRef.current = unsub
    setShowJoinScreen(true)
  }

  const endLive = () => {
    if (!session) return
    mockLive.endSession(session.id)
    setSession(null)
    setShowJoinScreen(false)
    if (presentationUnsubRef.current) { presentationUnsubRef.current(); presentationUnsubRef.current = null }
  }

  const addSlide = (type = 'blank') => {
    const s = { id: Date.now(), type, title: 'New Slide', content: [], notes: '' }
    setSlides((cur) => [...cur, s])
    setIndex(slides.length)
  }

  const openFullScreen = async () => {
    const el = document.getElementById('presentation-canvas')
    if (!el) return
    if (el.requestFullscreen) await el.requestFullscreen()
    setPresentMode(true)
  }

  const exitFullScreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    setPresentMode(false)
  }

  useEffect(() => {
    const onFsChange = () => setPresentMode(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  return (
    <div className="presentation-workspace" style={{ display: 'flex', gap: 12, height: 'calc(100vh - 80px)' }}>
      {showSlidesPanel && (
        <aside style={{ width: 240, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Slides</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => addSlide('blank')}>+ New</button>
            <button onClick={() => setShowSlidesPanel(false)} className="text-button">Hide</button>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          {slides.map((s, i) => (
            <div key={s.id} onClick={() => setIndex(i)} style={{ padding: 8, border: i === index ? '2px solid #007acc' : '1px solid #ddd', marginBottom: 6, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 48, height: 28, background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#666' }}>{s.type.toUpperCase()}</div>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="text-button" onClick={(e) => { e.stopPropagation(); setSlides(prev => { const copy = [...prev]; copy.splice(i+1,0, {...prev[i], id: Date.now()} ); return copy }) }}>Duplicate</button>
                <button className="text-button" onClick={(e) => { e.stopPropagation(); setSlides(prev => prev.filter((_,idx)=>idx!==i)); if (i <= index && index>0) setIndex(idx=>idx-1) }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        </aside>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="presentation-toolbar" style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', padding: 8, borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button title="Previous" onClick={prev}>←</button>
            <button title="Next" onClick={next}>→</button>
            <button title="Present" onClick={openFullScreen}>Present</button>
            <button title="Start Live" onClick={startLive}>{session ? '● LIVE' : 'Start Live'}</button>
            <button title="Join Screen" onClick={() => setShowJoinScreen((s) => !s)}>Join Screen</button>
            <div style={{ width: 1, height: 24, background: '#eee', margin: '0 8px' }} />
            <button title="Pointer" onClick={() => setTool('pointer')}>Pointer</button>
            <button title="Pen" onClick={() => setTool('pen')}>Pen</button>
            <button title="Highlighter" onClick={() => setTool('highlighter')}>Highlighter</button>
            <button title="Eraser" onClick={() => setTool('eraser')}>Eraser</button>
            <button title="Undo" onClick={() => canvasRef.current?.undo?.()}>Undo</button>
            <button title="Redo" onClick={() => canvasRef.current?.redo?.()}>Redo</button>
            <button title="Clear" onClick={() => canvasRef.current?.clear?.()}>Clear</button>
            <div style={{ width: 1, height: 24, background: '#eee', margin: '0 8px' }} />
            <button title="Whiteboard" onClick={() => addSlide('whiteboard')}>Whiteboard</button>
            <button title="Ask Class" onClick={() => mockLive.openQuestion(session?.id, { text: 'Quick question' })} disabled={!session}>Ask Class</button>
            <button title="Comprehension" onClick={() => mockLive.openComprehension(session?.id)} disabled={!session}>Comprehension</button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>Zoom -</button>
            <div>Fit</div>
            <button onClick={() => setZoom(1)}>100%</button>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}>Zoom +</button>
          </div>
        </div>

        <div id="presentation-canvas" style={{ position: 'relative', border: '1px solid #ddd', background: '#f6f8fa', padding: 12, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 1100, aspectRatio: '16/9', background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', transform: `scale(${zoom})`, transformOrigin: 'center', overflow: 'hidden', position: 'relative' }}>
            <div style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>{current.title}</h2>
              <div>
                {current.content.map((c, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    {String(c).startsWith('\\') ? <MathDisplay>{c}</MathDisplay> : <div>{c}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Annotation canvas overlay */}
            <AnnotationCanvas ref={canvasRef} tool={tool} color={color} lineWidth={lineWidth} />
          </div>
        </div>

        {showJoinScreen && session && (
          <div style={{ marginTop: 12 }}>
            <h3>Join this lecture</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <LectureJoinQRCode joinUrl={makeJoinUrl(session.join_code)} sessionCode={session.join_code} lectureTitle={'Real Numbers & Algebra'} size={200} />
              <div>
                <p>Class Code: <strong>{session.join_code}</strong></p>
                <p>Students joined: <strong>{session.participants.length}</strong></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {showNotesPanel && (
        <aside style={{ width: 360, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Presenter Notes</h3>
            <div>
              <button className="text-button" onClick={() => setShowNotesPanel(false)}>Hide</button>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <PresenterNotes notes={(current.notes && [{ type: 'note', text: current.notes }]) || []} onChange={(blocks) => {
              const text = (blocks || []).map(b=>b.text).join('\n')
              const copy = [...slides]
              copy[index] = { ...copy[index], notes: text }
              setSlides(copy)
            }} />

            <div style={{ marginTop: 12 }}>
              <div>Slide {index + 1} of {slides.length}</div>
              <div style={{ marginTop: 8 }}>Connected students: {session?.participants?.length || 0}</div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
