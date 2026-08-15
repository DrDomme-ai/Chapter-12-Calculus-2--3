import { useState } from 'react'
import { MathDisplay } from './MathDisplay'

export function WhyButton({ children }) {
  const [open, setOpen] = useState(false)
  return <div className="why-reveal"><button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>Why?</button>{open && <div>{children}</div>}</div>
}

export function StepByStepSolution({ steps, resetLabel = 'Hide solution' }) {
  const [shown, setShown] = useState(0)
  return <div className="step-solution">
    {steps.slice(0, shown).map((step, index) => <div className="solution-step" key={step}><span>{index + 1}</span><MathDisplay>{step}</MathDisplay></div>)}
    <div className="step-actions">
      {shown < steps.length && <button type="button" onClick={() => setShown(shown + 1)}>Reveal Next Step</button>}
      {shown > 0 && <button className="quiet" type="button" onClick={() => setShown(0)}>{resetLabel}</button>}
    </div>
  </div>
}

export function HintChallenge({ title, prompt, answer, normalize = (value) => value.trim().toLowerCase(), hints, solution, placeholder = 'Enter answer' }) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState('')
  const [hint, setHint] = useState(0)
  const check = () => setFeedback(normalize(value) === normalize(answer) ? 'Correct — well done.' : 'Not yet. Check the signs and coordinate order, then try again.')
  return <div className="challenge-card"><span className="card-label">Your turn</span><h3>{title}</h3><MathDisplay>{prompt}</MathDisplay><label>Answer<input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} /></label><div className="challenge-actions"><button type="button" onClick={check}>Check Answer</button>{hints.map((_, index) => <button className="quiet" type="button" key={index} onClick={() => setHint(Math.max(hint, index + 1))}>Hint {index + 1}</button>)}<button className="quiet" type="button" onClick={() => setHint(hints.length + 1)}>Show Solution</button></div>{feedback && <p className={feedback.startsWith('Correct') ? 'correct' : 'try-again'} role="status">{feedback}</p>}{hints.slice(0, Math.min(hint, hints.length)).map((text) => <p className="hint" key={text}>{text}</p>)}{hint > hints.length && <div className="solution-box"><MathDisplay>{solution}</MathDisplay></div>}</div>
}

export function MistakeCard({ title, wrongWork, choices, answer, explanation }) {
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  return <article className="mistake-card"><span className="card-label">Common mistake</span><h3>{title}</h3><MathDisplay>{wrongWork}</MathDisplay><p><strong>What went wrong?</strong></p><div className="mistake-choices">{choices.map((item) => <button type="button" className={choice === item ? 'selected' : ''} onClick={() => setChoice(item)} key={item}>{item}</button>)}</div><button className="explain-button" type="button" disabled={!choice} onClick={() => setRevealed(true)}>Check diagnosis</button>{revealed && <p className={choice === answer ? 'correct' : 'try-again'}>{choice === answer ? `Correct. ${explanation}` : 'That is not the key error. Examine which coordinate or sign changed.'}</p>}</article>
}

export function SphereQuestion() {
  const [center, setCenter] = useState('')
  const [radius, setRadius] = useState('')
  const [feedback, setFeedback] = useState('')
  const normalize = (value) => value.replace(/[()\s]/g, '')
  const check = () => setFeedback(normalize(center) === '2,-1,4' && radius.trim() === '5' ? 'Correct — the signs reverse inside each squared factor, and √25 = 5.' : 'Not yet. Compare each factor with (x − a)², (y − b)², and (z − c)².')
  return <div className="challenge-card"><span className="card-label">Your turn</span><h3>Identify the sphere</h3><MathDisplay>{'(x-2)^2+(y+1)^2+(z-4)^2=25'}</MathDisplay><div className="dual-answer"><label>Center<input value={center} onChange={e=>setCenter(e.target.value)} placeholder="(a, b, c)" /></label><label>Radius<input value={radius} onChange={e=>setRadius(e.target.value)} placeholder="r" /></label></div><button type="button" onClick={check}>Check Answer</button>{feedback && <p className={feedback.startsWith('Correct')?'correct':'try-again'}>{feedback}</p>}</div>
}

export function ExitTicket() {
  const [answers, setAnswers] = useState(['','',''])
  const [results, setResults] = useState(null)
  const clean = value => value.toLowerCase().replace(/[()\s]/g,'')
  const check = () => setResults([['xy-plane','xy'].includes(clean(answers[0])), clean(answers[1]) === '0,-5,7', ['-1,3,-2;4','-1,3,-2,4'].includes(clean(answers[2]))])
  const questions = ['Which coordinate plane contains (4, −2, 0)?','Project (3, −5, 7) onto the yz-plane.','Center and radius of (x+1)²+(y−3)²+(z+2)²=16 (enter center; radius).']
  return <div className="exit-ticket">{questions.map((question,index)=><label key={question}><span>{index+1}</span><strong>{question}</strong><input value={answers[index]} onChange={e=>setAnswers(answers.map((value,i)=>i===index?e.target.value:value))} placeholder="Your answer" />{results && <small className={results[index]?'correct':'try-again'}>{results[index]?'Correct':index===0?'Remember: the zero coordinate names the missing axis.':index===1?'The x-coordinate must become zero.':'Reverse the signs in the factors and take √16.'}</small>}</label>)}<button type="button" onClick={check}>Check Exit Ticket</button>{results && <p className="ticket-score">Score: {results.filter(Boolean).length} / 3</p>}</div>
}
