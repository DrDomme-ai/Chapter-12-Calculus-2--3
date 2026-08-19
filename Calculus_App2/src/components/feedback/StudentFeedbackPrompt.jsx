import { useMemo, useState } from 'react'
import './student-feedback.css'

const STORAGE_KEY='interactive-calculus:student-feedback:v1'

function saveFeedback(entry){
  try{
    const current=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')
    localStorage.setItem(STORAGE_KEY,JSON.stringify([...current,entry].slice(-200)))
    window.dispatchEvent(new CustomEvent('interactive-calculus:feedback-submitted',{detail:entry}))
    return true
  }catch{return false}
}

export default function StudentFeedbackPrompt({moduleId,moduleTitle='this module',compact=false}){
  const resolvedId=useMemo(()=>moduleId||window.location.hash||'unknown-module',[moduleId])
  const [mnemonic,setMnemonic]=useState(''),[memoryNote,setMemoryNote]=useState(''),[suggestion,setSuggestion]=useState(''),[feedback,setFeedback]=useState(''),[status,setStatus]=useState('')
  const submit=(event)=>{
    event.preventDefault()
    if(![mnemonic,memoryNote,suggestion,feedback].some(value=>value.trim())){setStatus('Add at least one idea before submitting.');return}
    const ok=saveFeedback({id:crypto.randomUUID?.()||`${Date.now()}`,moduleId:resolvedId,moduleTitle,mnemonic:mnemonic.trim(),memoryNote:memoryNote.trim(),suggestion:suggestion.trim(),feedback:feedback.trim(),submittedAt:new Date().toISOString()})
    setStatus(ok?'Thank you—your ideas were saved for this module.':'Feedback could not be saved in this browser.')
    if(ok){setMnemonic('');setMemoryNote('');setSuggestion('');setFeedback('')}
  }
  return <section className={`student-feedback-prompt${compact?' is-compact':''}`} aria-labelledby={`feedback-${resolvedId.replace(/[^a-z0-9]/gi,'-')}`}><header><span>Help improve this lesson</span><h2 id={`feedback-${resolvedId.replace(/[^a-z0-9]/gi,'-')}`}>Your memory tricks and feedback</h2><p>Share only what you are comfortable saving on this device. Do not include private information.</p></header><form onSubmit={submit}><label>Custom mnemonic<textarea value={mnemonic} onChange={e=>setMnemonic(e.target.value)} placeholder="A phrase, pattern, or creative trick that helps you remember…" maxLength={500}/></label><label>Personalized memory note<textarea value={memoryNote} onChange={e=>setMemoryNote(e.target.value)} placeholder="Explain it in your own words or connect it to a name or story…" maxLength={800}/></label><label>Content suggestion<textarea value={suggestion} onChange={e=>setSuggestion(e.target.value)} placeholder="What example, visual, or practice question should be added?" maxLength={800}/></label><label>General feedback<textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="What would make this lecture or review more useful?" maxLength={800}/></label><button type="submit">Submit suggestion</button>{status&&<p role="status">{status}</p>}</form></section>
}
