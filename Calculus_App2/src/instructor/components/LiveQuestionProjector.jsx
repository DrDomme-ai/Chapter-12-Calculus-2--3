import { MathDisplay, MathInline } from '../../components/MathDisplay'

export default function LiveQuestionProjector({session}){
  const question=session?.active_question
  if(session?.shared_response)return <section className="live-question-projector shared-reflection" aria-live="polite"><header><span>Anonymous reflection</span><strong>Shared by instructor</strong></header><h2>“{session.shared_response.text}”</h2><footer><span>One student wrote</span></footer></section>
  if(!question||question.status==='ready')return null
  const responses=(session.responses||[]).filter((r)=>r.question_id===question.id),eligible=question.eligible_participant_count??session.participant_count??0
  const showResults=['results','answer-revealed'].includes(question.status),reveal=question.status==='answer-revealed'
  return <section className="live-question-projector" aria-live="polite"><header><span>Live question · {question.topic||'General'}</span><strong>{responses.length} / {eligible} responded</strong></header><h2>{question.mathPrompt?<MathInline>{question.mathPrompt}</MathInline>:question.prompt}</h2>{question.options?.length&&<div className="projector-options">{question.options.map((option,index)=>{const count=responses.filter((r)=>Number(r.answer)===index).length,correct=index===(question.correctAnswer??question.correct_option_index);return <article className={reveal&&correct?'correct':''} key={`${option}-${index}`}><b>{String.fromCharCode(65+index)}</b>{question.optionMath?.[index]?<MathDisplay>{question.optionMath[index]}</MathDisplay>:<span>{option}</span>}{showResults&&<strong>{responses.length?Math.round(count/responses.length*100):0}%</strong>}</article>})}</div>}<footer>{question.timer&&<span>Timer: {question.timer}s</span>}<span>{question.status.replace('-',' ')}</span></footer></section>
}
