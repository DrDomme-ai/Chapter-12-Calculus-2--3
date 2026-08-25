import { useMemo, useState } from 'react'
import { getKahootQuestionsForLecture } from '../data/kahootQuestionCollections'

export default function LiveQuestionLauncher({slides,session,onOpen,lectureId}){
  const bank=useMemo(()=>{
    const embedded=slides.flatMap(slide=>[...(slide.question?[{...slide.question,bankId:slide.id,label:`${slide.title} · ${slide.question.topic||'General'}`}]:[]),...(slide.elements||[]).filter(element=>element.type==='live-question').map(element=>({...element.question,bankId:element.id,label:`${slide.title} · ${element.question?.topic||'General'}`}))])
    const collection=getKahootQuestionsForLecture(lectureId).map(question=>({...question,bankId:`collection:${question.id}`,label:`Interactive collection · ${question.prompt}`}))
    return [...embedded,...collection]
  },[slides,lectureId])
  const [selected,setSelected]=useState(bank[0]?.bankId||''),[quick,setQuick]=useState(false),[type,setType]=useState('multiple-choice'),[prompt,setPrompt]=useState(''),[choices,setChoices]=useState(''),[answer,setAnswer]=useState(''),[topic,setTopic]=useState('General')
  const launchBank=()=>{const question=bank.find(item=>item.bankId===selected);if(question&&session)onOpen(session.id,question)}
  const launchQuick=()=>{
    if(!prompt.trim()||!session)return
    const options=['multiple-choice','multiple-select','true-false'].includes(type)?(type==='true-false'?['True','False']:choices.split('\n').map(value=>value.trim()).filter(Boolean)):undefined
    const correctAnswer=type==='multiple-select'?answer.split(',').map(value=>options.findIndex(option=>option===value.trim())).filter(index=>index>=0):options?Math.max(0,options.findIndex(option=>option===answer)):answer
    onOpen(session.id,{type,prompt,options,correctAnswer,topic,difficulty:'medium',attempts:1,source:'quick'});setQuick(false);setPrompt('');setChoices('');setAnswer('')
  }
  if(!session)return null
  const choiceType=['multiple-choice','multiple-select'].includes(type)
  return <section className="live-question-launcher"><strong>Ask Class</strong><select value={selected} onChange={event=>setSelected(event.target.value)}><option value="">Embedded or interactive-collection question…</option>{bank.map(question=><option value={question.bankId} key={question.bankId}>{question.label}</option>)}</select><button onClick={launchBank} disabled={!selected}>Open Question</button><button onClick={()=>setQuick(value=>!value)}>Quick Question</button>{quick&&<div className="quick-question-form"><label>Type<select value={type} onChange={event=>setType(event.target.value)}>{['multiple-choice','multiple-select','true-false','numerical','short-answer','confidence'].map(value=><option value={value} key={value}>{value}</option>)}</select></label><label>Prompt<input value={prompt} onChange={event=>setPrompt(event.target.value)}/></label>{choiceType&&<label>Choices, one per line<textarea value={choices} onChange={event=>setChoices(event.target.value)}/></label>}<label>{type==='multiple-select'?'Correct choices, comma separated':'Correct answer'}<input value={answer} onChange={event=>setAnswer(event.target.value)}/></label><label>Topic<input value={topic} onChange={event=>setTopic(event.target.value)}/></label><button onClick={launchQuick}>Launch Immediately</button></div>}</section>
}
