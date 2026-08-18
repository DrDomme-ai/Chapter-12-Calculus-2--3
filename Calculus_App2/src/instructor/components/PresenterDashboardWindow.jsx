import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import SlideCanvas from './SlideCanvas'
import PresenterNotesPanel from './PresenterNotesPanel'

const clock=(seconds)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`

export default function PresenterDashboardWindow({popup,host,lectureTitle,current,next,index,total,revealCount,onPrevious,onNext,onClose,onInstructorFeedbackChange}){
  const [seconds,setSeconds]=useState(0)
  useEffect(()=>{if(!popup)return;popup.addEventListener('beforeunload',onClose);return()=>popup.removeEventListener('beforeunload',onClose)},[onClose,popup])
  useEffect(()=>{const timer=setInterval(()=>setSeconds(value=>value+1),1000);return()=>clearInterval(timer)},[])
  if(!host)return null
  return createPortal(<main className="presenter-dashboard"><header><div><small>Private presenter view</small><h1>{lectureTitle}</h1></div><div className="presenter-metrics"><strong>{clock(seconds)}</strong><span>Slide {index+1} / {total}</span></div></header><div className="presenter-dashboard-grid"><section className="presenter-current"><h2>Current slide</h2><div className="presenter-slide-preview"><SlideCanvas slide={current} revealCount={revealCount}/></div></section><section className="presenter-next"><h2>Next slide</h2><div className="presenter-slide-preview">{next?<SlideCanvas slide={next} revealCount={99}/>:<div className="presenter-end">End of lecture</div>}</div></section><section className="presenter-private-notes"><PresenterNotesPanel notes={current.presenterNotes} studentNotes={[]} tab="presenter" onTabChange={()=>{}} instructorFeedback={current.instructorFeedback||''} onInstructorFeedbackChange={onInstructorFeedbackChange}/></section></div><footer><button onClick={onPrevious} disabled={index===0}>← Previous</button><progress value={index+1} max={total}/><button onClick={onNext} disabled={index===total-1}>Next →</button></footer></main>,host)
}
