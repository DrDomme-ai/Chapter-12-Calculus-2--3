const keyFor = (lectureId) => `interactive-calculus:visual-editor:v1:${lectureId}`

export function loadLecture(lectureId, sourceSlides) {
  try {
    const saved=JSON.parse(localStorage.getItem(keyFor(lectureId)))
    // Replace an obsolete two-slide shell, while preserving genuine edited lectures.
    if(saved?.length<=2&&sourceSlides.length>saved.length+5)return sourceSlides
    const requiredSlides={
      'real-numbers':['rn-story-hook','rn-story-joke','rn-story-final-question'],
      trigonometry:['trig-circle-wave-hook'],
      'inverse-trigonometric-functions':['it-curiosity-hook'],
      'hyperbolic-functions':['hy-cable-hook'],
    }[lectureId]||[]
    if(saved?.length&&requiredSlides.some((id)=>!saved.some((slide)=>slide.id===id))){
      const byId=new Map(saved.map((slide)=>[slide.id,slide])),sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return [...sourceSlides.map((slide)=>byId.has(slide.id)?{...slide,...byId.get(slide.id),presenterNotes:slide.presenterNotes,question:slide.question,visualization:slide.visualization}:slide),...saved.filter((slide)=>!sourceIds.has(slide.id))]
    }
    // One-time master Trigonometry expansion: retain edited element layouts while
    // adding the newly required sections and refreshed private teaching scripts.
    if(lectureId==='trigonometry'&&saved?.length&&!saved.some((slide)=>slide.id==='trig-hyperbolic')){
      const byId=new Map(saved.map((slide)=>[slide.id,slide]))
      const sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return [...sourceSlides.map((slide)=>byId.has(slide.id)?{...slide,...byId.get(slide.id),presenterNotes:slide.presenterNotes}:slide),...saved.filter((slide)=>!sourceIds.has(slide.id))]
    }
    if(lectureId==='real-numbers'&&saved?.length&&!saved.some((slide)=>slide.id==='rn-field-vs-completeness')) return sourceSlides
    return saved||sourceSlides
  } catch { return sourceSlides }
}
export function saveLecture(lectureId, slides) { localStorage.setItem(keyFor(lectureId), JSON.stringify(slides)) }
export const updateSlide = (slides,id,change) => slides.map((slide)=>slide.id===id?{...slide,...change}:slide)
export const moveSlide = (slides,from,to) => { const copy=[...slides]; const [item]=copy.splice(from,1); copy.splice(to,0,item); return copy }
export const updateElement = (slide,id,change) => ({...slide,elements:slide.elements.map((item)=>item.id===id?{...item,...change}:item)})
export const deleteElement = (slide,ids) => ({...slide,elements:slide.elements.filter((item)=>!ids.includes(item.id))})
export const duplicateElement = (slide,ids) => ({...slide,elements:[...slide.elements,...slide.elements.filter((item)=>ids.includes(item.id)).map((item)=>({...item,id:`${item.id}-${crypto.randomUUID()}`,x:Math.min(92,item.x+2),y:Math.min(92,item.y+2)}))]})

export function ensureElements(slide) {
  if (slide.elements) {
    const canonicalHook=/^(rn-story-hook|rn-story-joke|rn-story-final-question|trig-circle-wave-hook|it-curiosity-hook|hy-cable-hook)$/.test(slide.id)
    return canonicalHook?{...slide,elements:slide.elements.map((element)=>({...element,showInPresentation:true,showInStudentNotes:true,...(element.id===`${slide.id}-title`?{y:5,height:18}:{}),...(element.type==='interactive'?{y:27,height:62}: {})}))}:slide
  }
  const elements=[]
  elements.push({id:`${slide.id}-title`,type:'text',x:7,y:5,width:86,height:18,content:slide.title,fontSize:42,fontWeight:800,align:'left',z:2,revealStep:0})
  ;(slide.presentationContent||[]).forEach((item,index)=>{
    const type=item.kind==='math'?'math':item.kind==='callout'?'definition':item.kind==='list'?'bullets':item.kind==='comparison'?'comparison':'text'
    const content=item.kind==='list'&&Array.isArray(item.value)?item.value.join('\n'):item.kind==='comparison'?undefined:item.value
    elements.push({id:`${slide.id}-content-${index}`,type,x:8,y:24+index*13,width:84,height:item.kind==='comparison'?25:11,content,rows:item.kind==='comparison'?item.value:undefined,fontSize:item.kind==='math'?28:22,fontWeight:item.kind==='callout'?700:400,align:'left',z:2,revealStep:0})
  })
  if(slide.visualization) elements.push({id:`${slide.id}-interactive`,type:'interactive',component:slide.visualization,x:8,y:39,width:84,height:48,z:1,revealStep:0,settings:{min:1,max:10,defaultA:2,defaultB:3,studentInput:true,instructorInput:true}})
  return {...slide,layoutMode:slide.layoutMode||'slide',theme:slide.theme||'academic',elements}
}

export function newElement(type,component) {
  if(type==='question')return{id:`element-${crypto.randomUUID()}`,type:'live-question',x:12,y:25,width:76,height:24,content:'Ask the class',fontSize:22,fontWeight:700,align:'left',color:'#102a36',background:'#ffffff',border:'#00877f',z:5,revealStep:0,locked:false,question:{type:'multiple-choice',prompt:'Type your question',options:['Choice A','Choice B','Choice C','Choice D'],correctAnswer:0,explanation:'',topic:'General',difficulty:'medium',attempts:1,timer:null,immediateFeedback:false,confidenceFollowUp:false},showInPresentation:true,showInStudentNotes:true,showInInstructorEditor:true}
  const presets={definition:{label:'Definition',style:'definition'},theorem:{label:'Theorem',style:'theorem'},property:{label:'Property',style:'property'},formula:{label:'Formula',style:'formula'},example:{label:'Example',style:'example'},important:{label:'Important',style:'important'},remark:{label:'Remark',style:'remark'},mistake:{label:'Common Mistake',style:'mistake'}}
  const preset=presets[type]
  const content=type==='math'?'x^2+y^2=r^2':type==='bullets'?'First idea\nSecond idea':preset?'Type content here':'Type text here'
  return {id:`element-${crypto.randomUUID()}`,type:preset?'block':type,x:12,y:25,width:42,height:type==='interactive'?38:18,content,blockTitle:preset?.label,blockStyle:preset?.style,fontSize:type==='heading'?38:type==='text'?28:22,fontWeight:type==='heading'||preset?700:400,align:type==='math'?'center':'left',color:'#102a36',background:'transparent',border:'transparent',z:5,revealStep:0,locked:false,componentKey:component,settings:{min:1,max:10,defaultA:2,defaultB:3,showClosure:true,studentInput:true,instructorInput:true},showInPresentation:true,showInStudentNotes:true,showInInstructorEditor:true}
}
