import { useRef, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import { RegisteredComponent } from './componentRegistry'

function ElementContent({ element, revealCount, editing }) {
  if (element.type === 'math') return <MathDisplay>{element.content}</MathDisplay>
  if (element.type === 'interactive') return <RegisteredComponent componentKey={element.componentKey || element.component} revealCount={revealCount} settings={element.settings}/>
  if (element.type === 'live-question') return <div className="question-element"><strong>Ask Class</strong><span>{element.question?.prompt}</span>{element.question?.options?.map((option,index)=><small key={option}>{String.fromCharCode(65+index)}. {option}</small>)}</div>
  if (element.type === 'image') return element.src ? <img src={element.src} alt={element.alt || ''}/> : <div className="editor-placeholder">Image</div>
  if (element.type === 'comparison' && Array.isArray(element.rows)) return <div className="field-comparison">{element.rows.map((row)=><article key={row.label}><MathDisplay>{row.label}</MathDisplay><p>Field: {row.field}</p><p>Ordered: {row.ordered}</p><p>Complete: {row.complete}</p></article>)}</div>
  if (element.type === 'bullets') return <div>{String(element.content || '').split('\n').map((line,index)=><span key={`${line}-${index}`}>• {line}</span>)}</div>
  if (element.content != null && typeof element.content === 'object') {
    if (editing) { console.error('Unsupported slide element', element); return <div className="unsupported-element">Warning: unsupported slide element</div> }
    return null
  }
  const lines=String(element.content || '').split('\n')
  return <>{element.type === 'block' && <strong>{element.blockTitle || lines.shift()}</strong>}<div>{lines.map((line,index)=><span key={`${line}-${index}`}>{line}</span>)}</div></>
}

export default function VisualSlideCanvas({slide,revealCount=0,editing=false,studentNotes=false,selected=[],onSelect,onChange,showGrid=false,snap=true}) {
  const canvasRef=useRef(null),gesture=useRef(null),[guide,setGuide]=useState(null)
  const elements=slide.elements || []
  const point=(event)=>{const rect=canvasRef.current.getBoundingClientRect();return{x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100}}
  const start=(event,element,kind='move')=>{if(!editing||element.locked)return;event.stopPropagation();const additive=event.shiftKey;onSelect(additive?(selected.includes(element.id)?selected.filter((id)=>id!==element.id):[...selected,element.id]):[element.id]);gesture.current={kind,start:point(event),original:elements.filter((item)=>(additive?[...selected,element.id]:[element.id]).includes(item.id)).map((item)=>({...item}))};event.currentTarget.setPointerCapture(event.pointerId)}
  const move=(event)=>{if(!gesture.current)return;const now=point(event),dx=now.x-gesture.current.start.x,dy=now.y-gesture.current.start.y;const unit=snap?1:.1,changes={};gesture.current.original.forEach((item)=>{let x=item.x,y=item.y,width=item.width,height=item.height;if(gesture.current.kind==='move'){x=Math.max(0,Math.min(100-item.width,Math.round((item.x+dx)/unit)*unit));y=Math.max(0,Math.min(100-item.height,Math.round((item.y+dy)/unit)*unit));if(Math.abs(x+item.width/2-50)<1){x=50-item.width/2;setGuide('vertical')}else if(Math.abs(y+item.height/2-50)<1){y=50-item.height/2;setGuide('horizontal')}else setGuide(null)}else{width=Math.max(5,Math.min(100-item.x,Math.round((item.width+dx)/unit)*unit));height=Math.max(5,Math.min(100-item.y,Math.round((item.height+dy)/unit)*unit))}changes[item.id]={x,y,width,height}});onChange(changes,false)}
  const end=()=>{if(gesture.current){gesture.current=null;setGuide(null);onChange({},true)}}
  const visible=elements.filter((element)=>(editing||(studentNotes?element.showInStudentNotes!==false:element.showInPresentation!==false))&&((element.revealStep||0)<=revealCount||editing)).sort((a,b)=>(a.z||0)-(b.z||0))
  return <div ref={canvasRef} className={`visual-slide-canvas layout-${slide.layoutMode||'slide'} theme-${slide.theme||'academic'}${editing?' is-editing':''}${showGrid?' show-grid':''}`} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onClick={()=>editing&&onSelect([])}>{editing&&<div className="presentation-safe-area" aria-hidden="true"/>}{guide&&<i className={`smart-guide ${guide}`}/>} {visible.map((element)=><div className={`slide-element element-${element.type}${element.blockStyle?` block-${element.blockStyle}`:''}${selected.includes(element.id)?' selected':''}${element.locked?' locked':''}${editing&&(element.revealStep||0)>revealCount?' unrevealed':''}${editing&&(element.x<5||element.y<5||element.x+element.width>95||element.y+element.height>95)?' outside-safe-area':''}`} style={{left:`${element.x}%`,top:`${element.y}%`,width:`${element.width}%`,height:`${element.height}%`,zIndex:element.z,fontSize:`${element.fontSize||22}px`,fontWeight:element.fontWeight||400,fontStyle:element.italic?'italic':'normal',textDecoration:element.underline?'underline':'none',textAlign:element.align||'left',color:element.color,background:element.background,borderColor:element.border}} key={element.id} onPointerDown={(event)=>start(event,element)}><ElementContent element={element} revealCount={revealCount} editing={editing}/>{editing&&selected.includes(element.id)&&!element.locked&&<><button className="resize-handle se" aria-label="Resize element" onPointerDown={(event)=>start(event,element,'resize')}/><span className="element-tag">{element.type}</span></>}</div>)}</div>
}
