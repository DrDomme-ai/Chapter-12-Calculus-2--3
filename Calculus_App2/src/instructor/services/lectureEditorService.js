const keyFor = (lectureId) => `interactive-calculus:visual-editor:v1:${lectureId}`

export function loadLecture(lectureId, sourceSlides) {
  try {
    let saved=JSON.parse(localStorage.getItem(keyFor(lectureId)))
    if(lectureId==='exponential-growth-decay'&&saved?.length){const family=sourceSlides.find(slide=>slide.id==='egd-function-families'),growth=sourceSlides.find(slide=>slide.id==='egd-exp-family');saved=saved.map(slide=>{if(slide.id===family?.id){const rows=family.presentationContent?.[0]?.value;if(slide.layoutVariant==='function-families-manual-v1')return slide;return{...slide,title:family.title,presentationContent:family.presentationContent,layoutVariant:'function-families-manual-v1',elements:(slide.elements||[]).map(element=>element.id===`${slide.id}-title`?{...element,content:family.title,x:6,y:5,width:88,height:14,fontSize:36,locked:false}:element.type==='comparison'?{...element,rows,x:6,y:22,width:88,height:72,fontSize:18,locked:false}:element)}}if(slide.id===growth?.id){const contaminated=(slide.elements||[]).some(element=>element.type==='comparison'||element.id?.startsWith('egd-function-families-'));if(contaminated)return{...slide,...growth,elements:undefined};const typo=/exponention|gorth|groth/i;return{...slide,title:typo.test(slide.title||'')?growth.title:slide.title,elements:(slide.elements||[]).map(element=>element.id===`${slide.id}-title`&&typo.test(element.content||'')?{...element,content:growth.title}:element)}}return slide})}
    if(lectureId==='inverse-trigonometric-functions'&&saved?.length){saved=saved.map(slide=>slide.id==='it-curiosity-hook'?{...slide,visualization:'trigFunctionLookupExplorer',elements:(slide.elements||[]).map(element=>element.id===`${slide.id}-interactive`?{...element,component:'trigFunctionLookupExplorer',componentKey:'trigFunctionLookupExplorer'}:element)}:slide.id==='it-master-table'?{...slide,title:'Principal ranges and benchmark values',presentationContent:[],visualization:'inverseTrigBenchmarkExplorer',elements:[...(slide.elements||[]).filter(element=>!element.id?.startsWith(`${slide.id}-content-`)&&element.id!==`${slide.id}-interactive`).map(element=>element.id===`${slide.id}-title`?{...element,content:'Principal ranges and benchmark values',x:6,y:5,width:88,height:13}:element),{id:`${slide.id}-interactive`,type:'interactive',component:'inverseTrigBenchmarkExplorer',componentKey:'inverseTrigBenchmarkExplorer',x:6,y:20,width:88,height:74,z:1,revealStep:0,locked:false,settings:{studentInput:true,instructorInput:true}}]}:slide.id==='it-hlt'?{...slide,title:'Six trig functions and their inverses',presentationContent:[{kind:'text',value:'Select a table row, then compare the original, restricted, and inverse graphs.'}],visualization:'sixTrigInverseMaster',elements:[...(slide.elements||[]).filter(element=>element.id!==`${slide.id}-interactive`).map(element=>element.id===`${slide.id}-title`?{...element,content:'Six trig functions and their inverses',x:6,y:5,width:88,height:11}:element.id===`${slide.id}-content-0`?{...element,content:'Select a table row, then compare the original, restricted, and inverse graphs.',x:6,y:17,width:88,height:7,fontSize:16}:element),{id:`${slide.id}-interactive`,type:'interactive',component:'sixTrigInverseMaster',componentKey:'sixTrigInverseMaster',x:6,y:25,width:88,height:69,z:1,revealStep:0,locked:false,settings:{studentInput:true,instructorInput:true}}]}:slide)}
    if(lectureId==='inverse-trigonometric-functions'&&saved?.length){const canonical=sourceSlides.find(slide=>slide.id==='it-other-derivatives');saved=saved.map(slide=>slide.id!=='it-other-derivatives'?slide:{...slide,title:canonical?.title||'Arccos and arctan derivatives',presentationContent:canonical?.presentationContent||slide.presentationContent,elements:[...(slide.elements||[]).filter(element=>!element.id?.startsWith(`${slide.id}-content-`)&&!(element.type==='text'&&typeof element.content==='string'&&/\*\*/.test(element.content)&&/(?:\$|\\\(|\\begin\{)/.test(element.content))).map(element=>element.id===`${slide.id}-title`?{...element,content:'Arccos and arctan derivatives',x:6,y:5,width:88,height:13}:element),{id:`${slide.id}-content-0`,type:'math',x:6,y:22,width:88,height:32,content:String.raw`\frac{d}{dx}\arccos x=-\frac{1}{\sqrt{1-x^2}}`,fontSize:14,fontWeight:400,align:'center',z:2,revealStep:0,autoSize:false,locked:false},{id:`${slide.id}-content-1`,type:'math',x:6,y:59,width:88,height:33,content:String.raw`\frac{d}{dx}\arctan x=\frac{1}{1+x^2}`,fontSize:14,fontWeight:400,align:'center',z:2,revealStep:0,autoSize:false,locked:false}]})}
    // Keep the instructor's saved layout, but refresh canonical teaching content
    // for Slide 14 after its proof and reveal sequence were corrected.
    const refreshRealNumbersChallenge = (slides) => {
      if (lectureId !== 'real-numbers') return slides
      const canonical = sourceSlides.find((slide) => slide.id === 'rn-story-challenge-three')
      if (!canonical) return slides
      return slides.map((slide) => slide.id === canonical.id
        ? {
            ...slide,
            presenterNotes: canonical.presenterNotes,
            revealSteps: canonical.revealSteps,
            visualization: canonical.visualization,
          }
        : slide)
    }
    // Replace an obsolete two-slide shell, while preserving genuine edited lectures.
    if(saved?.length<=2&&sourceSlides.length>saved.length+5)return sourceSlides
    // Master live-lecture requirements are inherited by every lecture, including
    // lectures whose instructor-edited layouts were saved before the requirement existed.
    if(saved?.length&&sourceSlides.some((slide)=>(slide.id.includes('-master-')||slide.solutionFor)&&!saved.some((item)=>item.id===slide.id))){
      const byId=new Map(saved.map((slide)=>[slide.id,slide])),sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return [...sourceSlides.map((slide)=>byId.has(slide.id)?{...slide,...byId.get(slide.id),question:slide.question,masterRequirement:slide.masterRequirement}:slide),...saved.filter((slide)=>!sourceIds.has(slide.id))]
    }
    const requiredSlides={
      'real-numbers':['rn-story-hook','rn-story-joke','rn-story-final-question'],
      trigonometry:['trig-circle-wave-hook'],
      'inverse-trigonometric-functions':['it-curiosity-hook'],
      'hyperbolic-functions':['hy-cable-hook'],
    }[lectureId]||[]
    if(saved?.length&&requiredSlides.some((id)=>!saved.some((slide)=>slide.id===id))){
      const byId=new Map(saved.map((slide)=>[slide.id,slide])),sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return refreshRealNumbersChallenge([...sourceSlides.map((slide)=>byId.has(slide.id)?{...slide,...byId.get(slide.id),presenterNotes:slide.presenterNotes,question:slide.question,visualization:slide.visualization}:slide),...saved.filter((slide)=>!sourceIds.has(slide.id))])
    }
    // One-time master Trigonometry expansion: retain edited element layouts while
    // adding the newly required sections and refreshed private teaching scripts.
    if(lectureId==='trigonometry'&&saved?.length&&!saved.some((slide)=>slide.id==='trig-hyperbolic')){
      const byId=new Map(saved.map((slide)=>[slide.id,slide]))
      const sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return [...sourceSlides.map((slide)=>byId.has(slide.id)?{...slide,...byId.get(slide.id),presenterNotes:slide.presenterNotes}:slide),...saved.filter((slide)=>!sourceIds.has(slide.id))]
    }
    if(lectureId==='real-numbers'&&saved?.length&&!saved.some((slide)=>slide.id==='rn-field-vs-completeness')) return sourceSlides
    // Geometry is maintained as a canonical instructor lecture. Refresh the
    // mathematical content, notes, questions, and reveal sequence while keeping
    // any element positions the instructor has adjusted in the editor.
    if(lectureId==='geometry'&&saved?.length){
      const byId=new Map(saved.map((slide)=>[slide.id,slide]))
      const sourceIds=new Set(sourceSlides.map((slide)=>slide.id))
      return [
        ...sourceSlides.map((source)=>{
          const edited=byId.get(source.id)
          if(!edited)return source
          return {
            ...edited,
            ...source,
            layoutMode:edited.layoutMode||source.layoutMode,
            theme:edited.theme||source.theme,
            elements:edited.elements,
          }
        }),
        ...saved.filter((slide)=>!sourceIds.has(slide.id)),
      ]
    }
    return refreshRealNumbersChallenge(saved||sourceSlides)
  } catch { return sourceSlides }
}
export function saveLecture(lectureId, slides) { localStorage.setItem(keyFor(lectureId), JSON.stringify(slides)) }
export const updateSlide = (slides,id,change) => slides.map((slide)=>slide.id===id?{...slide,...change}:slide)
export const moveSlide = (slides,from,to) => { const copy=[...slides]; const [item]=copy.splice(from,1); copy.splice(to,0,item); return copy }
export const updateElement = (slide,id,change) => ({...slide,elements:slide.elements.map((item)=>item.id===id?{...item,...change}:item)})
export const deleteElement = (slide,ids) => ({...slide,elements:slide.elements.filter((item)=>!ids.includes(item.id))})
export const duplicateElement = (slide,ids) => ({...slide,elements:[...slide.elements,...slide.elements.filter((item)=>ids.includes(item.id)).map((item)=>({...item,id:`${item.id}-${crypto.randomUUID()}`,x:Math.min(92,item.x+2),y:Math.min(92,item.y+2)}))]})

export function ensureElements(slide) {
  const hasLegacyMarkdownMathList=(slide.elements||[]).some(element=>element.type==='text'&&typeof element.content==='string'&&/(?:^|\n)\s*[-*]\s+\*\*/.test(element.content)&&/(?:\$|\\\(|\\\[|\\begin\{)/.test(element.content))
  if(hasLegacyMarkdownMathList&&(slide.presentationContent||[]).some(item=>item.kind==='math'))return ensureElements({...slide,elements:undefined})
  const geometryLayout = (items) => {
    const titleId=`${slide.id}-title`
    const contentItems=items.filter((item)=>item.id!==titleId&&item.type!=='interactive')
    const hasInteractive=items.some((item)=>item.type==='interactive')
    const contentWidth=hasInteractive?40:88
    const weightFor=(item)=>{
      const text=String(item.content||'')
      if(item.type==='bullets')return Math.max(1.4,text.split('\n').length*1.05)
      if(item.type==='math')return 1.35
      if(item.type==='definition'||item.type==='block')return Math.max(1.5,1+text.length/48)
      return Math.max(1.9,.8+text.length/45)
    }
    const weights=new Map(contentItems.map((item)=>[item.id,weightFor(item)]))
    const totalWeight=Math.max(1,[...weights.values()].reduce((sum,value)=>sum+value,0))
    let contentY=25
    return items.map((element)=>{
      if(element.id===titleId){
        return {...element,x:6,y:5,width:88,height:19,fontSize:element.titleAutoFit===false?element.fontSize:36,locked:element.userLocked===true}
      }
      if(element.type==='interactive'){
        return {
          ...element,
          x:hasInteractive?50:6,
          y:25,
          width:hasInteractive?44:88,
          height:69,
          locked:element.userLocked===true,
          settings:{...element.settings,presentationLayout:'geometry-slide',slideId:slide.id},
        }
      }
      const height=69*(weights.get(element.id)||1)/totalWeight
      const y=contentY
      contentY+=height
      return {
        ...element,
        x:6,
        y,
        width:contentWidth,
        height,
        fontSize:Math.min(element.fontSize||22,element.type==='math'?24:19),
      }
    })
  }
  if (slide.elements) {
    // Typography normalization changes title styling only; it deliberately
    // preserves every saved coordinate, dimension, layer, and block order.
    const normalizedElements=slide.elements.map((element)=>element.id===`${slide.id}-title`&&element.titleAutoFit!==false?{...element,fontSize:36}:element)
    const normalizedSlide={...slide,elements:normalizedElements}
    const canonicalHook=/^(rn-story-hook|rn-story-joke|rn-story-final-question|trig-circle-wave-hook|it-curiosity-hook|hy-cable-hook)$/.test(slide.id)
    const squareRootProof=slide.id==='rn-story-challenge-three'
    const angleSplit=slide.id==='trig-angle'
    const inverseExplorer=slide.visualization==='inverseTrigExplorer'
    const growthDecayOpening=slide.id==='egd-exp-family'
    const growthDecayCuriosity=slide.id==='egd-curiosity'
    const trigLookup=slide.id==='it-curiosity-hook'
    const geometrySlide=slide.id?.startsWith('geo-')
    if(geometrySlide){
      return {
        ...slide,
        layoutMode:'slide',
        layoutVariant:'geometry-safe',
        elements:geometryLayout(normalizedElements),
      }
    }
    return canonicalHook||squareRootProof||angleSplit||inverseExplorer||growthDecayOpening||growthDecayCuriosity||trigLookup
      ? {
          ...slide,
          ...(angleSplit ? { layoutVariant: 'angle-split' } : {}),
          elements: normalizedElements.map((element) => ({
            ...element,
            ...(canonicalHook
              ? {
                  showInPresentation: true,
                  showInStudentNotes: true,
                  ...(element.id===`${slide.id}-title`?{y:5,height:18}:{}),
                  ...(element.type==='interactive'?{y:27,height:62}: {}),
                }
              : {}),
            ...(squareRootProof&&element.type==='interactive'
              ? { y: Math.min(element.y ?? 30, 30), height: Math.max(element.height ?? 70, 70) }
              : {}),
            ...(angleSplit&&element.id===`${slide.id}-title`
              ? { x: 6, y: 6, width: 88, height: 14, fontSize: element.titleAutoFit===false?element.fontSize:36, locked: element.userLocked===true }
              : {}),
            ...(angleSplit&&element.id===`${slide.id}-interactive`
              ? {
                  x: 6,
                  y: 24,
                  width: 88,
                  height: 70,
                  locked: element.userLocked===true,
                  settings: { ...element.settings, presentationLayout: 'slide-split' },
                }
              : {}),
            ...(inverseExplorer&&element.id===`${slide.id}-title`?{x:6,y:5,width:88,height:15,fontSize:element.titleAutoFit===false?element.fontSize:36,locked:element.userLocked===true}:{}),
            ...(inverseExplorer&&element.id?.startsWith(`${slide.id}-content-`)?{x:6,y:21,width:88,height:10,fontSize:20,locked:element.userLocked===true}:{}),
            ...(inverseExplorer&&element.id===`${slide.id}-interactive`?{x:6,y:32,width:88,height:62,locked:element.userLocked===true}:{}),
            ...(growthDecayOpening&&element.id===`${slide.id}-title`?{x:6,y:5,width:88,height:14,fontSize:element.titleAutoFit===false?element.fontSize:36,locked:element.userLocked===true}:{}),
            ...(growthDecayOpening&&element.id?.startsWith(`${slide.id}-content-`)?{x:6,y:20,width:88,height:9,fontSize:28,locked:element.userLocked===true}:{}),
            ...(growthDecayOpening&&element.id===`${slide.id}-interactive`?{x:6,y:30,width:88,height:64,locked:element.userLocked===true}:{}),
            ...(growthDecayCuriosity&&element.id===`${slide.id}-title`?{x:6,y:5,width:88,height:16,fontSize:element.titleAutoFit===false?element.fontSize:36,locked:element.userLocked===true}:{}),
            ...(growthDecayCuriosity&&element.id===`${slide.id}-content-0`?{x:6,y:24,width:88,height:30,fontSize:24,locked:element.userLocked===true}:{}),
            ...(growthDecayCuriosity&&element.id===`${slide.id}-content-1`?{x:6,y:57,width:88,height:37,fontSize:22,locked:element.userLocked===true}:{}),
            ...(trigLookup&&element.id===`${slide.id}-title`?{x:6,y:5,width:88,height:11,fontSize:element.titleAutoFit===false?element.fontSize:36,locked:element.userLocked===true}:{}),
            ...(trigLookup&&element.id===`${slide.id}-content-0`?{x:6,y:17,width:30,height:9,fontSize:24,locked:element.userLocked===true}:{}),
            ...(trigLookup&&element.id===`${slide.id}-content-1`?{x:38,y:17,width:56,height:9,fontSize:18,locked:element.userLocked===true}:{}),
            ...(trigLookup&&element.id===`${slide.id}-interactive`?{x:6,y:27,width:88,height:67,component:'trigFunctionLookupExplorer',componentKey:'trigFunctionLookupExplorer',locked:element.userLocked===true}:{}),
          })),
        }
      : normalizedSlide
  }
  const elements=[]
  elements.push({id:`${slide.id}-title`,type:'text',x:7,y:5,width:86,height:18,content:slide.title,fontSize:36,fontWeight:800,align:'left',z:2,revealStep:0})
  ;(slide.presentationContent||[]).forEach((item,index)=>{
    const type=item.kind==='math'?'math':item.kind==='callout'?'definition':item.kind==='list'?'bullets':item.kind==='comparison'?'comparison':'text'
    const content=item.kind==='list'&&Array.isArray(item.value)?item.value.join('\n'):item.kind==='comparison'?undefined:item.value
    elements.push({id:`${slide.id}-content-${index}`,type,x:8,y:24+index*13,width:84,height:item.kind==='comparison'?25:11,content,rows:item.kind==='comparison'?item.value:undefined,fontSize:item.kind==='math'?28:22,fontWeight:item.kind==='callout'?700:400,align:'left',z:2,revealStep:0})
  })
  if(slide.visualization) {
    const proofLayout=slide.id==='rn-story-challenge-three'?{y:30,height:70}:{y:39,height:48}
    elements.push({id:`${slide.id}-interactive`,type:'interactive',component:slide.visualization,x:8,...proofLayout,width:84,z:1,revealStep:0,settings:{min:1,max:10,defaultA:2,defaultB:3,studentInput:true,instructorInput:true,...slide.visualizationSettings}})
  }
  if(slide.type==='student-feedback'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:12,fontSize:36,locked:false}:element.type==='interactive'?{...element,x:6,y:19,width:88,height:75,locked:false}:element)}
  }
  if(slide.id==='it-curiosity-hook'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:11,fontSize:36,locked:false}:element.id===`${slide.id}-content-0`?{...element,x:6,y:17,width:30,height:9,fontSize:24,locked:false}:element.id===`${slide.id}-content-1`?{...element,x:38,y:17,width:56,height:9,fontSize:18,locked:false}:element.id===`${slide.id}-interactive`?{...element,x:6,y:27,width:88,height:67,component:'trigFunctionLookupExplorer',componentKey:'trigFunctionLookupExplorer',locked:false}:element)}
  }
  if(slide.id==='it-master-table'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:13,fontSize:36,locked:false}:element.id===`${slide.id}-interactive`?{...element,x:6,y:20,width:88,height:74,component:'inverseTrigBenchmarkExplorer',componentKey:'inverseTrigBenchmarkExplorer',locked:false}:element)}
  }
  if(slide.id==='it-hlt'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:11,fontSize:36,locked:false}:element.id===`${slide.id}-content-0`?{...element,x:6,y:17,width:88,height:7,fontSize:16,locked:false}:element.id===`${slide.id}-interactive`?{...element,x:6,y:25,width:88,height:69,component:'sixTrigInverseMaster',componentKey:'sixTrigInverseMaster',locked:false}:element)}
  }
  if(slide.id==='it-other-derivatives'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:13,fontSize:36,locked:false}:element.id===`${slide.id}-content-0`?{...element,x:6,y:22,width:88,height:32,fontSize:14,autoSize:false,locked:false}:element.id===`${slide.id}-content-1`?{...element,x:6,y:59,width:88,height:33,fontSize:14,autoSize:false,locked:false}:element)}
  }
  if(slide.visualization==='inverseTrigExplorer'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:15,fontSize:36,locked:false}:element.id?.startsWith(`${slide.id}-content-`)?{...element,x:6,y:21,width:88,height:10,fontSize:20,locked:false}:element.id===`${slide.id}-interactive`?{...element,x:6,y:32,width:88,height:62,locked:false}:element)}
  }
  if(slide.id==='egd-exp-family'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:14,fontSize:36,locked:false}:element.id?.startsWith(`${slide.id}-content-`)?{...element,x:6,y:20,width:88,height:9,fontSize:28,locked:false}:element.id===`${slide.id}-interactive`?{...element,x:6,y:30,width:88,height:64,locked:false}:element)}
  }
  if(slide.id==='egd-curiosity'){
    return {...slide,layoutMode:'slide',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:16,fontSize:36,locked:false}:element.id===`${slide.id}-content-0`?{...element,x:6,y:24,width:88,height:30,fontSize:24,locked:false}:element.id===`${slide.id}-content-1`?{...element,x:6,y:57,width:88,height:37,fontSize:22,locked:false}:element)}
  }
  if(slide.id==='egd-function-families'){
    return {...slide,layoutMode:'slide',layoutVariant:'function-families-manual-v1',theme:slide.theme||'academic',elements:elements.map(element=>element.id===`${slide.id}-title`?{...element,x:6,y:5,width:88,height:14,fontSize:36,locked:false}:element.type==='comparison'?{...element,x:6,y:22,width:88,height:72,fontSize:18,locked:false}:element)}
  }
  if (slide.id === 'trig-angle') {
    return {
      ...slide,
      layoutMode: slide.layoutMode || 'slide',
      layoutVariant: 'angle-split',
      theme: slide.theme || 'academic',
      elements: elements.map((element) => {
        if (element.id === `${slide.id}-title`) {
          return { ...element, x: 6, y: 6, width: 88, height: 14, fontSize: 36, locked: false }
        }
        if (element.id === `${slide.id}-interactive`) {
          return {
            ...element,
            x: 6,
            y: 24,
            width: 88,
            height: 70,
            locked: false,
            settings: { ...element.settings, presentationLayout: 'slide-split' },
          }
        }
        return element
      }),
    }
  }
  if(slide.id?.startsWith('geo-')){
    return {
      ...slide,
      layoutMode:'slide',
      layoutVariant:'geometry-safe',
      theme:slide.theme||'academic',
      elements:geometryLayout(elements),
    }
  }
  return {...slide,layoutMode:slide.layoutMode||'slide',theme:slide.theme||'academic',elements}
}

export function newElement(type,component) {
  if(type==='question')return{id:`element-${crypto.randomUUID()}`,type:'live-question',x:12,y:25,width:76,height:24,content:'Ask the class',fontSize:22,fontWeight:700,align:'left',color:'#102a36',background:'#ffffff',border:'#00877f',z:5,revealStep:0,locked:false,question:{type:'multiple-choice',prompt:'Type your question',options:['Choice A','Choice B','Choice C','Choice D'],correctAnswer:0,explanation:'',topic:'General',difficulty:'medium',attempts:1,timer:null,immediateFeedback:false,confidenceFollowUp:false},showInPresentation:true,showInStudentNotes:true,showInInstructorEditor:true}
  const presets={definition:{label:'Definition',style:'definition'},theorem:{label:'Theorem',style:'theorem'},property:{label:'Property',style:'property'},formula:{label:'Formula',style:'formula'},example:{label:'Example',style:'example'},important:{label:'Important',style:'important'},remark:{label:'Remark',style:'remark'},mistake:{label:'Common Mistake',style:'mistake'}}
  const preset=presets[type]
  if(type==='combined')return{id:`element-${crypto.randomUUID()}`,type:'combined',x:12,y:25,width:52,height:22,content:'Type explanatory text here.\n$$x^2+y^2=r^2$$',fontSize:22,fontWeight:400,align:'left',color:'#102a36',background:'transparent',border:'transparent',z:5,revealStep:0,locked:false,showInPresentation:true,showInStudentNotes:true,showInInstructorEditor:true}
  const content=type==='math'?'x^2+y^2=r^2':type==='bullets'?'First idea\nSecond idea':preset?'Type content here':'Type text here'
  return {id:`element-${crypto.randomUUID()}`,type:preset?'block':type,x:12,y:25,width:42,height:type==='interactive'?38:18,content,blockTitle:preset?.label,blockStyle:preset?.style,fontSize:type==='heading'?38:type==='text'?28:22,fontWeight:type==='heading'||preset?700:400,align:type==='math'?'center':'left',color:'#102a36',background:'transparent',border:'transparent',z:5,revealStep:0,locked:false,componentKey:component,settings:{min:1,max:10,defaultA:2,defaultB:3,showClosure:true,studentInput:true,instructorInput:true},showInPresentation:true,showInStudentNotes:true,showInInstructorEditor:true}
}
