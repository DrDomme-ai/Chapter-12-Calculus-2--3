import { useEffect, useRef, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import HybridMathText from '../../components/HybridMathText'
import { RegisteredComponent } from './componentRegistry'
import { getLectureSemantic } from '../services/lectureSemantics'

const CardValue=({value})=>typeof value==='string'&&(/\\[a-zA-Z]+|[_^]/.test(value))?<MathDisplay>{value}</MathDisplay>:value

function ElementContent({ element, revealCount, editing, inlineEditing, onInlineChange }) {
  const editable=(content=element.content)=><div contentEditable suppressContentEditableWarning onPointerDown={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()} onBlur={event=>onInlineChange?.(element.id,{content:event.currentTarget.innerText})}>{content}</div>
  const editMath=(content,change)=>(inlineEditing||editing)?<button className="inline-math-render" type="button" title="Click to edit LaTeX" onClick={()=>{const next=window.prompt('Edit LaTeX',content);if(next!==null)change(next)}}><MathDisplay>{content}</MathDisplay></button>:<MathDisplay>{content}</MathDisplay>
  if (element.type === 'math') return (inlineEditing||editing)?<button className="inline-math-render" type="button" title="Click to edit Markdown + LaTeX" onClick={()=>{const next=window.prompt('Edit Markdown + LaTeX',element.content);if(next!==null)onInlineChange?.(element.id,{content:next})}}><HybridMathText source={element.content} defaultMath/></button>:<HybridMathText source={element.content} defaultMath/>
  if (element.type === 'combined') {const source=element.math?`${element.content}\n$$${element.math}$$`:element.content;return inlineEditing?editable(source):<HybridMathText source={source}/>}
  if (element.type === 'interactive') return <RegisteredComponent componentKey={element.componentKey || element.component} revealCount={revealCount} settings={element.settings}/>
  if (element.type === 'live-question') return <div className="question-element"><strong>Ask Class</strong><span>{element.question?.prompt}</span>{element.question?.options?.map((option,index)=><small key={option}>{String.fromCharCode(65+index)}. {option}</small>)}</div>
  if (element.type === 'image') return element.src ? <img src={element.src} alt={element.alt || ''}/> : <div className="editor-placeholder">Image</div>
  if (element.type === 'comparison' && Array.isArray(element.rows)) return <div className="field-comparison">{element.rows.map((row,rowIndex)=>{const update=(change)=>onInlineChange?.(element.id,{rows:element.rows.map((item,index)=>index===rowIndex?{...item,...change}:item)});return <article key={row.label}>{editMath(row.label,label=>update({label}))}<p><strong>{row.formula?'Formula:':'Field:'}</strong> {row.formula?editMath(row.formula,formula=>update({formula})):<CardValue value={row.field}/>}</p><p><strong>{row.characteristic?'Key Characteristic:':'Ordered:'}</strong> {inlineEditing?<span contentEditable suppressContentEditableWarning onBlur={event=>update({characteristic:event.currentTarget.innerText})}>{row.characteristic||row.ordered}</span>:row.characteristic||row.ordered}</p><p><strong>{row.behavior?'Behavior:':'Complete:'}</strong> {inlineEditing?<span contentEditable suppressContentEditableWarning onBlur={event=>update({behavior:event.currentTarget.innerText})}>{row.behavior||row.complete}</span>:row.behavior||row.complete}</p></article>})}</div>
  if (element.type === 'bullets') return inlineEditing?editable():<div>{String(element.content || '').split('\n').map((line,index)=><span key={`${line}-${index}`}><HybridMathText source={line}/></span>)}</div>
  if (element.content != null && typeof element.content === 'object') {
    if (editing) { console.error('Unsupported slide element', element); return <div className="unsupported-element">Warning: unsupported slide element</div> }
    return null
  }
  const lines=String(element.content || '').split('\n')
  if(inlineEditing)return editable()
  return <>{element.type === 'block' && <strong>{element.blockTitle || lines.shift()}</strong>}<HybridMathText source={lines.join('\n')}/></>
}

function CrossProductEndSlide({slide}){
  const items=slide.presentationContent||[]
  const intro=items.find(item=>item.kind==='text')?.value
  const bullets=items.find(item=>item.kind==='list')?.value||[]
  const callout=items.find(item=>item.kind==='callout')?.value
  return <div data-slide-id={slide.id} className={`visual-slide-canvas cross-product-end-slide ${slide.id==='c124-mistakes'?'mistakes-end-slide':'exam-end-slide'}`}>
    <h2>{slide.title}</h2>
    {intro&&<p className="cross-product-end-intro">{intro}</p>}
    <div className="cross-product-end-list">{bullets.map((entry,index)=><div key={`${index}-${entry}`}><b>{index+1}</b><HybridMathText source={entry}/></div>)}</div>
    <div className="cross-product-end-callout"><HybridMathText source={callout}/></div>
  </div>
}

function CrossProductSummarySlide({slide}){
  const items=slide.presentationContent||[]
  const formulas=items.filter(item=>item.kind==='math')
  const bullets=items.find(item=>item.kind==='list')?.value||[]
  const icons=['→','⊥','✋','⇄','0','▱','△','N','τ']
  return <div data-slide-id={slide.id} className="visual-slide-canvas cross-product-summary-slide">
    <h2>{slide.title}</h2>
    <div className="cross-summary-formulas">
      <article><span>Component computation</span><MathDisplay>{formulas[0]?.value}</MathDisplay></article>
      <article><span>Magnitude and area</span><MathDisplay>{formulas[1]?.value}</MathDisplay></article>
    </div>
    <div className="cross-summary-concepts">{bullets.map((entry,index)=><article key={`${index}-${entry}`}><b aria-hidden="true">{icons[index]||'✓'}</b><HybridMathText source={entry}/></article>)}</div>
  </div>
}

function CrossProductConsolidatedSlide({slide}){
  const bullets=(slide.presentationContent||[]).find(item=>item.kind==='list')?.value||[]
  return <div data-slide-id={slide.id} className="visual-slide-canvas cross-product-consolidated-slide">
    <h2>{slide.title}</h2>
    <div>{bullets.map((entry,index)=><article key={`${index}-${entry}`}><b>{index+1}</b><HybridMathText source={entry}/></article>)}</div>
  </div>
}

export default function VisualSlideCanvas({slide,revealCount=0,editing=false,inlineEditing=false,onInlineChange,studentNotes=false,selected=[],onSelect,onChange,showGrid=false,snap=true,onElementContextMenu,onCanvasContextMenu}) {
  const semantic=getLectureSemantic(slide.type)
  const canvasRef=useRef(null),gesture=useRef(null),[guide,setGuide]=useState(null),[overflowIds,setOverflowIds]=useState([])
  const elements=slide.elements || []
  const layoutVariant=slide.layoutVariant
  const structuredRole=(element)=>{
    if(layoutVariant!=='angle-split')return null
    if(element.id===`${slide.id}-title`)return 'title'
    if(element.id===`${slide.id}-interactive`)return 'body'
    return null
  }
  const point=(event)=>{const rect=canvasRef.current.getBoundingClientRect();return{x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100}}
  const start=(event,element,kind='move')=>{if((!editing&&!inlineEditing)||element.locked)return;if(event.target.closest('button,input,select,textarea,[role="slider"],[contenteditable="true"]'))return;event.stopPropagation();const additive=event.shiftKey;onSelect?.(additive?(selected.includes(element.id)?selected.filter((id)=>id!==element.id):[...selected,element.id]):[element.id]);gesture.current={kind,start:point(event),original:elements.filter((item)=>(additive?[...selected,element.id]:[element.id]).includes(item.id)).map((item)=>({...item}))};event.currentTarget.setPointerCapture(event.pointerId)}
  const move=(event)=>{if(!gesture.current||!onChange)return;const now=point(event),dx=now.x-gesture.current.start.x,dy=now.y-gesture.current.start.y;const unit=snap?1:.1,changes={};gesture.current.original.forEach((item)=>{let x=item.x,y=item.y,width=item.width,height=item.height;if(gesture.current.kind==='move'){x=Math.max(0,Math.min(100-item.width,Math.round((item.x+dx)/unit)*unit));y=Math.max(0,Math.min(100-item.height,Math.round((item.y+dy)/unit)*unit));if(Math.abs(x+item.width/2-50)<1){x=50-item.width/2;setGuide('vertical')}else if(Math.abs(y+item.height/2-50)<1){y=50-item.height/2;setGuide('horizontal')}else setGuide(null)}else{width=Math.max(5,Math.min(100-item.x,Math.round((item.width+dx)/unit)*unit));height=Math.max(5,Math.min(100-item.y,Math.round((item.height+dy)/unit)*unit))}changes[item.id]={x,y,width,height,...(gesture.current.kind==='resize'?{autoSize:false}:{})}});onChange(changes,false)}
  const end=()=>{if(gesture.current){gesture.current=null;setGuide(null);onChange?.({},true)}}
  const visible=elements.filter((element)=>(editing||(studentNotes?element.showInStudentNotes!==false:element.showInPresentation!==false))&&((element.revealStep||0)<=revealCount||editing)).sort((a,b)=>(a.z||0)-(b.z||0))
  useEffect(()=>{
    if(!canvasRef.current)return undefined
    const canvas=canvasRef.current
    const scan=()=>{
      canvas.querySelectorAll('.slide-element[data-slide-title="true"]:not([data-title-auto-fit="true"])').forEach((node)=>{node.style.fontSize=`${node.dataset.titleFontSize||36}px`})
      canvas.querySelectorAll('.slide-element[data-title-auto-fit="true"]').forEach((node)=>{
        const fitKey=`${node.clientWidth}:${node.textContent}`
        if(node.dataset.titleFitKey===fitKey)return
        node.dataset.titleFitKey=fitKey
        let size=36
        node.style.fontSize=`${size}px`
        while(size>.5&&node.scrollWidth>node.clientWidth+1){size-=.5;node.style.fontSize=`${size}px`}
      })
      if(!editing)return
      const next=[...canvas.querySelectorAll('.slide-element')]
        .filter((node)=>node.scrollWidth>node.clientWidth+2||node.scrollHeight>node.clientHeight+2)
        .map((node)=>node.dataset.elementId)
        .filter(Boolean)
        .sort()
      setOverflowIds((current)=>current.join('|')===next.join('|')?current:next)
    }
    const resizeObserver=new ResizeObserver(scan)
    const mutationObserver=new MutationObserver(scan)
    resizeObserver.observe(canvas)
    canvas.querySelectorAll('.slide-element').forEach((node)=>resizeObserver.observe(node))
    mutationObserver.observe(canvas,{subtree:true,childList:true,characterData:true})
    const frame=requestAnimationFrame(scan)
    return()=>{cancelAnimationFrame(frame);resizeObserver.disconnect();mutationObserver.disconnect()}
  },[editing,slide.id,slide.title,slide.elements])
  if(slide.id==='c124-mistakes'||slide.id==='c124-exam')return <CrossProductEndSlide slide={slide}/>
  if(slide.id==='c124-summary')return <CrossProductSummarySlide slide={slide}/>
  if(slide.id?.startsWith('chapter-12-4-consolidated-'))return <CrossProductConsolidatedSlide slide={slide}/>
  return <div ref={canvasRef} data-slide-id={slide.id} data-semantic={semantic.kind} className={`visual-slide-canvas semantic-${semantic.kind} layout-${slide.layoutMode||'slide'}${layoutVariant?` layout-variant-${layoutVariant}`:''} theme-${slide.theme||'academic'}${slide.type==='whiteboard'?` whiteboard-${slide.whiteboardBackground||'blank'}`:''}${editing?' is-editing':''}${inlineEditing?' is-inline-editing':''}${showGrid?' show-grid':''}`} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onContextMenu={(event)=>{if(!editing)return;event.preventDefault();onCanvasContextMenu?.(event,point(event))}} onClick={()=>{if(editing||inlineEditing)onSelect?.([])}}>{editing&&<div className="presentation-safe-area" aria-hidden="true"/>}{editing&&overflowIds.length>0&&<div className="internal-overflow-warning" role="status">Content overflow detected in {overflowIds.length} element{overflowIds.length===1?'':'s'}.</div>}{guide&&<i className={`smart-guide ${guide}`}/>} {visible.map((element)=>{
    const role=structuredRole(element)
    const isTitle=element.id===`${slide.id}-title`
    const autoFitTitle=isTitle&&element.titleAutoFit!==false
    const contentSized=['text','math','combined','definition','block','bullets'].includes(element.type)&&element.autoSize!==false
    const fittedWidth=isTitle?Math.max(element.width,95-element.x):element.width
    const positionStyle=role?{}:{left:`${element.x}%`,top:`${element.y}%`,width:`${fittedWidth}%`,height:contentSized?'auto':`${element.height}%`,maxHeight:contentSized?`${Math.max(0,95-element.y)}%`:undefined}
    const displayFontSize=isTitle?(autoFitTitle?36:Math.max(22,element.fontSize||36)):Math.max(22,element.fontSize||22)
    return <div data-element-id={element.id} data-slide-title={isTitle?'true':undefined} data-title-auto-fit={autoFitTitle?'true':undefined} data-title-font-size={isTitle?element.fontSize||36:undefined} className={`slide-element element-${element.type}${element.blockStyle?` block-${element.blockStyle}`:''}${role?` structured-${role}`:''}${selected.includes(element.id)?' selected':''}${element.locked?' locked':''}${overflowIds.includes(element.id)?' internal-overflow':''}${editing&&(element.revealStep||0)>revealCount?' unrevealed':''}${editing&&(element.x<5||element.y<5||element.x+fittedWidth>95||element.y+element.height>95)?' outside-safe-area':''}`} style={{...positionStyle,zIndex:element.z,fontSize:`${displayFontSize}px`,fontWeight:element.fontWeight||400,fontStyle:element.italic?'italic':'normal',textDecoration:element.underline?'underline':'none',textAlign:element.align||'left',color:element.color,background:element.background,borderColor:element.border}} key={element.id} onClick={(event)=>event.stopPropagation()} onContextMenu={(event)=>{if(!editing)return;event.preventDefault();event.stopPropagation();onElementContextMenu?.(event,element)}} onPointerDown={(event)=>start(event,element)}><ElementContent element={element} revealCount={revealCount} editing={editing} inlineEditing={inlineEditing} onInlineChange={onInlineChange}/>{editing&&selected.includes(element.id)&&!element.locked&&<><button className="resize-handle se" aria-label="Resize element" onPointerDown={(event)=>start(event,element,'resize')}/><span className="element-tag">{element.type}</span></>}</div>
  })}</div>
}
