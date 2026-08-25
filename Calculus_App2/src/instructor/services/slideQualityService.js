const SAFE=5
const intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y
const ABSOLUTE_MIN=16
const minFont=(element)=>Math.max(ABSOLUTE_MIN,element.id?.endsWith('-title')||element.type==='heading'?36:element.type==='math'||element.type==='block'?28:element.type==='text'||element.type==='live-question'?22:18)
const textLength=(element)=>String(element.content||element.question?.prompt||'').length
// Layout repair may move or resize a box, but it must never shrink classroom text.
const fitFont=(element)=>Math.max(ABSOLUTE_MIN,Number(element.fontSize)||22)

export function auditSlide(slide){
  const elements=(slide.elements||[]).filter((element)=>element.showInPresentation!==false),issues=[]
  elements.forEach((element)=>{
    if(element.x<SAFE||element.y<SAFE||element.x+element.width>100-SAFE||element.y+element.height>100-SAFE)issues.push({type:'boundary',severity:'error',elementIds:[element.id],message:'Outside the 5% presentation safe area'})
    if((element.fontSize||22)<ABSOLUTE_MIN)issues.push({type:'font-minimum',severity:'error',elementIds:[element.id],message:element.instructorOverride?'Accessibility warning: this instructor-edited text is below the 16 pt classroom minimum.':'Student-facing text is below the absolute 16 pt minimum'})
    else if((element.fontSize||22)<minFont(element))issues.push({type:'font',severity:'warning',elementIds:[element.id],message:`Text is below the ${minFont(element)}pt projector target`})
    if(element.type==='interactive'&&(element.width<48||element.height<38))issues.push({type:'component-size',severity:'warning',elementIds:[element.id],message:'Interactive component is below its useful display size'})
    if(element.width<=0||element.height<=0)issues.push({type:'hidden',severity:'error',elementIds:[element.id],message:'Element has no visible area'})
  })
  elements.forEach((element,index)=>elements.slice(index+1).forEach((other)=>{if(intersects(element,other)&&Math.min(element.z||0,other.z||0)===Math.max(element.z||0,other.z||0))issues.push({type:'collision',severity:'warning',elementIds:[element.id,other.id],message:'Elements overlap on the same layer'})}))
  const types=new Set(elements.map((element)=>element.type)),suggestSplit=elements.length>6||(types.has('interactive')&&types.has('live-question')&&elements.length>4)
  return{issues,suggestSplit,checks:{inside:!issues.some((x)=>x.type==='boundary'),readable:!issues.some((x)=>['font','font-minimum'].includes(x.type)),noOverlap:!issues.some((x)=>x.type==='collision'),interactiveUsable:!issues.some((x)=>x.type==='component-size'),focus:elements.filter((x)=>x.type==='interactive'||x.type==='math').length<=2}}
}

export function autoFitSlide(slide,{tidy=false}={}){
  const all=slide.elements||[],source=all.filter((element)=>element.showInPresentation!==false),count=source.length,columns=count>5?2:1,rows=Math.max(1,Math.ceil(count/columns))
  const visibleIndex=new Map(source.map((element,index)=>[element.id,index]))
  const rowItems=Array.from({length:rows},(_,row)=>source.filter((_,index)=>Math.floor(index/columns)===row))
  const rowWeights=rowItems.map((items)=>Math.max(1,...items.map((element)=>element.type==='interactive'?3:element.id?.endsWith('-title')||element.type==='heading'?1.15:1+Math.min(2,textLength(element)/90))))
  const gap=2,availableHeight=88-gap*(rows-1),weightTotal=rowWeights.reduce((sum,value)=>sum+value,0)
  const rowHeights=rowWeights.map((weight)=>availableHeight*weight/weightTotal)
  const rowTops=[];let cursor=6;rowHeights.forEach((height)=>{rowTops.push(cursor);cursor+=height+gap})
  return{...slide,elements:all.map((element)=>{
    if(element.showInPresentation===false)return element
    const index=visibleIndex.get(element.id)
    if(element.instructorOverride)return element
    if(tidy){const column=index%columns,row=Math.floor(index/columns),width=columns===2?42:88,height=rowHeights[row];return{...element,x:columns===2?6+column*46:6,y:rowTops[row],width,height,fontSize:fitFont(element)}}
    const width=Math.min(element.width,90),height=Math.min(element.height,90)
    return{...element,width,height,x:Math.max(SAFE,Math.min(100-SAFE-width,element.x)),y:Math.max(SAFE,Math.min(100-SAFE-height,element.y)),fontSize:fitFont(element)}
  })}
}
