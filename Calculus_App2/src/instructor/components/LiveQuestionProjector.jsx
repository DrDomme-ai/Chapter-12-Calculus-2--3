import { useEffect, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import LiveQuizSequenceView from './LiveQuizSequenceView'
import { normalizeQuizQuestion } from '../services/liveQuizService'

function AngleQuestionVisual(){return <svg className="quiz-question-visual" viewBox="0 0 420 150" role="img" aria-label="Two vectors with an unknown angle theta between them"><defs><marker id="question-arrow-a" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#38bdf8"/></marker><marker id="question-arrow-b" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f59e0b"/></marker></defs><circle cx="90" cy="120" r="7" fill="#fff"/><line x1="90" y1="120" x2="350" y2="120" stroke="#38bdf8" strokeWidth="7" markerEnd="url(#question-arrow-a)"/><line x1="90" y1="120" x2="265" y2="34" stroke="#f59e0b" strokeWidth="7" markerEnd="url(#question-arrow-b)"/><path d="M145 120 A55 55 0 0 0 139 96" fill="none" stroke="#fff" strokeWidth="4"/><text x="158" y="99" fill="#fff" fontSize="25">θ</text><text x="325" y="105" fill="#fff" fontSize="25" fontWeight="800">a</text><text x="242" y="28" fill="#fff" fontSize="25" fontWeight="800">b</text></svg>}

function useSecondsRemaining(question){
  const calculate=()=>question?.expires_at
    ? Math.max(0,Math.ceil((new Date(question.expires_at).getTime()-Date.now())/1000))
    : null
  const [remaining,setRemaining]=useState(calculate)
  useEffect(()=>{
    setRemaining(calculate())
    if(!question?.expires_at||question.status!=='open')return undefined
    const timer=setInterval(()=>setRemaining(calculate()),250)
    return()=>clearInterval(timer)
  },[question?.id,question?.expires_at,question?.status])
  return remaining
}

export default function LiveQuestionProjector({session,slide}){
  if(slide?.liveQuizView)return <LiveQuizSequenceView slide={slide} session={session}/>
  const active=session?.active_question,slideQuestionId=slide?.question?.id||slide?.id,activeMatches=String(active?.id)===String(slideQuestionId)
  const question=activeMatches?active:slide?.question?{...normalizeQuizQuestion({...slide.question,id:slideQuestionId}),status:'not-started'}:null
  const remaining=useSecondsRemaining(question)
  if(session?.shared_response)return <section className="live-question-projector shared-reflection" aria-live="polite"><header><span>Anonymous reflection</span><strong>Shared by instructor</strong></header><h2>“{session.shared_response.text}”</h2><footer><span>One student wrote</span></footer></section>
  if(!question||question.status==='ready'||!slide?.question)return null
  const responses=activeMatches?(session.responses||[]).filter(response=>response.question_id===question.id):[]
  const eligible=question.eligible_participant_count??session.participant_count??0
  const showResults=['results','answer-revealed'].includes(question.status)
  const reveal=question.status==='answer-revealed'
  const correctAnswers=Array.isArray(question.correctAnswer)?question.correctAnswer:[question.correctAnswer??question.correct_option_index]
  const selected=(answer,index)=>Array.isArray(answer)?answer.map(Number).includes(index):Number(answer)===index
  return <section className="live-question-projector" data-question-id={question.id} aria-live="polite">
    <header><span>Live challenge · {question.topic||'General'}</span><strong>{responses.length} / {eligible} responded</strong></header>
    {remaining!=null&&question.status==='open'&&<div className={`challenge-countdown ${remaining<=10?'ending':''}`}><strong>{remaining}</strong><span>seconds remaining</span></div>}
    {question.status==='closed'&&<div className="challenge-closed">Time is up · answers are closed</div>}
    {question.status==='not-started'&&<div className="challenge-closed quiz-ready">Waiting for instructor to start</div>}
    <div className="quiz-question-card">
      <h2>{question.prompt}</h2>
      {question.mathPrompt&&<div className="quiz-prompt-math"><MathDisplay>{question.mathPrompt}</MathDisplay></div>}
    </div>
    {question.solution?.visual==='right-angle-vectors'&&<AngleQuestionVisual/>}
    {question.options?.length&&<div className="projector-options">{question.options.map((option,index)=>{const count=responses.filter(response=>selected(response.answer,index)).length,correct=correctAnswers.map(Number).includes(index);return <article className={reveal&&correct?'correct':''} key={`${option}-${index}`}><b>{String.fromCharCode(65+index)}</b>{question.optionMath?.[index]?<MathDisplay>{question.optionMath[index]}</MathDisplay>:<span>{option}</span>}{showResults&&<strong>{responses.length?Math.round(count/responses.length*100):0}%</strong>}</article>})}</div>}
    <footer>{question.timer&&<span>{question.timer}-second challenge</span>}<span>{question.status.replace('-',' ')}</span></footer>
  </section>
}
