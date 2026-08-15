import React, { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

export default function LiveStudent({ joinCodeProp }) {
  const [joinCode, setJoinCode] = useState(joinCodeProp || '')
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    return () => { /* cleanup if needed */ }
  }, [])

  const joinSession = async () => {
    const { data, error } = await supabase.from('live_sessions').select('*').eq('join_code', joinCode).maybeSingle()
    if (error) return console.error('joinSession error', error)
    if (!data) return alert('Session not found')
    setSession(data)

    // register participant (profiles must exist); here we insert a lightweight participant
    await supabase.from('session_participants').insert([{ session_id: data.id, joined_at: new Date().toISOString() }])

    // subscribe to session updates
    const channel = supabase
      .channel(`public:live_sessions:id=eq.${data.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions', filter: `id=eq.${data.id}` }, (payload) => {
        setSession(payload.new)
      })
      .subscribe()

    // subscribe to new questions for this session
    const qChannel = supabase
      .channel(`public:questions:session_id=eq.${data.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'questions', filter: `session_id=eq.${data.id}` }, (payload) => {
        setQuestion(payload.new)
      })
      .subscribe()
  }

  const submitAnswer = async () => {
    if (!question || selected == null) return
    await supabase.from('responses').insert([{
      session_id: session.id,
      question_id: question.id,
      answer: selected,
      submitted_at: new Date().toISOString(),
    }])
    alert('Answer submitted')
  }

  return (
    <div className="page live-student">
      {!session && (
        <div>
          <h2>Join Live Class</h2>
          <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter session code" />
          <button onClick={joinSession}>Join</button>
        </div>
      )}

      {session && (
        <div>
          <h3>Lecture: {session.lecture_id}</h3>
          <p>Waiting for instructor... (Slide {session.current_slide_index})</p>

          {question && question.type === 'mcq' && (
            <div className="live-question">
              <h4>{question.prompt}</h4>
              <ul>
                {question.options?.map((opt, i) => (
                  <li key={i}>
                    <label>
                      <input type="radio" name="mcq" checked={selected === i} onChange={() => setSelected(i)} /> {opt}
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={submitAnswer}>Submit answer</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
