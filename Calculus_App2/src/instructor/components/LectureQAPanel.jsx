import { useMemo } from 'react'
import { auditSlide } from '../services/slideQualityService'

const hookIds={
  'real-numbers':{opening:'rn-story-hook',closing:'rn-story-joke'},
  trigonometry:{opening:'trig-circle-wave-hook'},
  'inverse-trigonometric-functions':{opening:'it-curiosity-hook'},
  'hyperbolic-functions':{opening:'hy-cable-hook'},
}

export default function LectureQAPanel({lectureId,slides}) {
  const qa=useMemo(()=>{
    const ids=hookIds[lectureId]||{},elements=slides.flatMap((slide)=>slide.elements||[])
    return {opening:!ids.opening||slides.some((slide)=>slide.id===ids.opening),closing:!ids.closing||slides.some((slide)=>slide.id===ids.closing),questions:slides.filter((slide)=>slide.question).length+elements.filter((element)=>element.type==='live-question').length,brokenMedia:elements.filter((element)=>element.type==='image'&&!element.src).length,unsupported:elements.filter((element)=>element.content!=null&&typeof element.content==='object'&&!['comparison'].includes(element.type)).length,overflow:slides.reduce((count,slide)=>count+auditSlide(slide).issues.filter((issue)=>issue.type==='boundary').length,0)}
  },[lectureId,slides])
  return <details className="lecture-qa-panel"><summary>Lecture Check</summary><div><span>Slides <b>{slides.length}</b></span><span>Opening Hook <b>{qa.opening?'Pass':'Missing'}</b></span>{hookIds[lectureId]?.closing&&<span>Closing Hook <b>{qa.closing?'Pass':'Missing'}</b></span>}<span>Live Questions <b>{qa.questions}</b></span><span>Broken Media <b>{qa.brokenMedia}</b></span><span>Unsupported Elements <b>{qa.unsupported}</b></span><span>Overflow Issues <b>{qa.overflow}</b></span></div></details>
}
