import React, { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'
import QRCode from 'react-qr-code'

function makeJoinCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function LiveInstructor({ lectureId = 'real-numbers' }) {
  const [session, setSession] = useState(null)
  const [joinCode, setJoinCode] = useState('')
  const [sub, setSub] = useState(null)

  useEffect(() => {
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe()
    }
  }, [sub])

  const startSession = async () => {
    const code = makeJoinCode()
    setJoinCode(code)
    // Create a live_sessions row. Schema must exist in Supabase for prototype.
    const { data, error } = await supabase.from('live_sessions').insert([{
      lecture_id: lectureId,
      join_code: code,
      status: 'live',
      current_slide_index: 0,
      created_by: 'instructor',
    }]).select().single()
    if (error) return console.error('startSession error', error)
    setSession(data)

    // Subscribe to changes for this session
    const channel = supabase
      .channel(`public:live_sessions:id=eq.${data.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions', filter: `id=eq.${data.id}` }, (payload) => {
        setSession(payload.new)
      })
      .subscribe()

    setSub(channel)
  }

  const endSession = async () => {
    if (!session) return
    await supabase.from('live_sessions').update({ status: 'ended' }).eq('id', session.id)
    setSession(null)
    setJoinCode('')
    if (sub && sub.unsubscribe) sub.unsubscribe()
    setSub(null)
  }

  const changeSlide = async (delta) => {
    if (!session) return
    const next = (session.current_slide_index || 0) + delta
    await supabase.from('live_sessions').update({ current_slide_index: next }).eq('id', session.id)
  }

  const openQuestion = async () => {
    if (!session) return
    const question = {
      lecture_id: lectureId,
      session_id: session.id,
      type: 'mcq',
      prompt: 'Which number is irrational?',
      options: ['2/3', '-5', '\\sqrt{2}', '0.75'],
      correct_option_index: 2,
      status: 'open',
    }
    await supabase.from('questions').insert([question])
    // also mark session to indicate a question is open
    await supabase.from('live_sessions').update({ question_status: 'open' }).eq('id', session.id)
  }

  return (
    <div className="page live-instructor">
      <header>
        <h1>Live Instructor — {lectureId}</h1>
      </header>

      {!session && (
        <div>
          <button className="primary-button" onClick={startSession}>Start Live Session</button>
        </div>
      )}

      {session && (
        <div>
          <p>Session ID: {session.id}</p>
          <p>Join code: <strong>{session.join_code}</strong></p>
          <div style={{ width: 150 }}><QRCode value={window.location.origin + `#/instructor/join/${session.join_code}`} size={150} /></div>
          <p>Slide: {session.current_slide_index}</p>

          <div className="instructor-controls">
            <button onClick={() => changeSlide(-1)}>Previous</button>
            <button onClick={() => changeSlide(1)}>Next</button>
            <button onClick={openQuestion}>Open MCQ question</button>
            <button onClick={endSession}>End session</button>
          </div>

          <section>
            <h3>Private instructor dashboard (live)</h3>
            <p>Status: {session.status}</p>
          </section>
        </div>
      )}
    </div>
  )
}
