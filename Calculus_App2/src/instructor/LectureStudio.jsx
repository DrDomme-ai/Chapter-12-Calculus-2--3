import { useEffect, useRef, useState } from 'react'
import LectureJoinQRCode from '../components/LectureJoinQRCode'
import { makeJoinUrl } from '../lib/url'
import AnnotationLayer from './components/AnnotationLayer'
import PresenterNotesPanel from './components/PresenterNotesPanel'
import PresenterDashboardWindow from './components/PresenterDashboardWindow'
import SlideCanvas from './components/SlideCanvas'
import VisualSlideCanvas from './components/VisualSlideCanvas'
import ElementInspector from './components/ElementInspector'
import LiveQuestionProjector from './components/LiveQuestionProjector'
import LiveQuestionLauncher from './components/LiveQuestionLauncher'
import SlideQualityPanel from './components/SlideQualityPanel'
import LectureQAPanel from './components/LectureQAPanel'
import { getLecture } from './data/lectureCatalog'
import { changeLectureSlide, createLectureSession, endLectureSession, getParticipants, getProjectorSession, openLectureQuestion, subscribeToSession } from './services/lectureSessionService'
import { deleteElement, duplicateElement, ensureElements, loadLecture, newElement, saveLecture } from './services/lectureEditorService'
import { componentPalette } from './components/componentPalette'
import './styles/instructor.css'

const whiteboardOptions = [
  ['blank', 'Blank'],
  ['grid', 'Grid'],
  ['coordinate-plane', 'Coordinate Plane'],
  ['dot-grid', 'Dot Grid'],
  ['geometry-construction', 'Geometry Construction'],
]

export default function LectureStudio({ lectureId, initialMode = 'edit', onBack }) {
  const source = getLecture(lectureId)
  const [slides, setSlides] = useState(() => loadLecture(source.id,source.slides).map(ensureElements))
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState(initialMode)
  const [pathMode,setPathMode]=useState(source.presentationModes?.[0]?.id||'custom')
  const [tool, setTool] = useState('pointer')
  const [color,setColor] = useState('#c53d32')
  const [width,setWidth] = useState(4)
  const [annotations, setAnnotations] = useState({})
  const [revealCounts, setRevealCounts] = useState({})
  const [notesTab, setNotesTab] = useState('presenter')
  const [session, setSession] = useState(() => initialMode==='live' ? {...createLectureSession(source.id)} : null)
  const [showJoin, setShowJoin] = useState(initialMode==='live')
  const [paused] = useState(false)
  const [clipboard, setClipboard] = useState(null)
  const [contextMenu,setContextMenu]=useState(null)
  const [presenterPortal,setPresenterPortal]=useState(null)
  const [dragged, setDragged] = useState(null)
  const [selectedElements,setSelectedElements]=useState([])
  const [showGrid,setShowGrid]=useState(false),[snap,setSnap]=useState(false),[saveStatus,setSaveStatus]=useState('Saved'),[showData,setShowData]=useState(false)
  const annotationRef = useRef(null)
  const presenterWindowRef = useRef(null)
  const historyRef=useRef([]), redoRef=useRef([]), editBaseRef=useRef(null), saveTimerRef=useRef(null)
  const activeSlides=mode==='edit'||pathMode==='custom'?slides:slides.filter((item)=>{const paths=item.recommendedFor||item.courses||[];return !paths.length||paths.includes(pathMode)})
  const current = activeSlides[index]||activeSlides[0]
  const nextSlide = activeSlides[index + 1]

  // Keep navigation valid when a shorter recommended course path is selected.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{if(index>=activeSlides.length)setIndex(Math.max(0,activeSlides.length-1))},[index,activeSlides.length])

  useEffect(() => {clearTimeout(saveTimerRef.current);saveTimerRef.current=setTimeout(()=>{saveLecture(source.id,slides);setSaveStatus('Saved')},450);return()=>clearTimeout(saveTimerRef.current)}, [slides, source.id])
  useEffect(() => { if (session) changeLectureSlide(session.id, index) }, [index, session])
  const sessionId = session?.id
  useEffect(() => { if (!sessionId) return; return subscribeToSession(sessionId, (updated) => setSession({ ...updated })) }, [sessionId])
  const replaceCurrent=(next)=>setSlides((items)=>items.map((item,i)=>i===index?next:item))
  const commitSlide=(next)=>{historyRef.current.push(current);redoRef.current=[];setSaveStatus('Saving…');replaceCurrent(next)}
  const updateInlineElement=(elementId,change)=>{historyRef.current.push(current);redoRef.current=[];setSaveStatus('Saving…');setSlides(items=>items.map(slide=>slide.id===current.id?{...slide,elements:slide.elements.map(element=>element.id===elementId?{...element,...change}:element)}:slide))}
  const undoEdit=()=>{const previous=historyRef.current.pop();if(!previous)return;redoRef.current.push(current);replaceCurrent(previous)}
  const redoEdit=()=>{const next=redoRef.current.pop();if(!next)return;historyRef.current.push(current);replaceCurrent(next)}
  const changeElements=(changes,commit)=>{if(!editBaseRef.current)editBaseRef.current=current; if(Object.keys(changes).length)replaceCurrent({...current,elements:current.elements.map((item)=>changes[item.id]?{...item,...changes[item.id]}:item)});if(commit&&editBaseRef.current){historyRef.current.push(editBaseRef.current);redoRef.current=[];editBaseRef.current=null}}
  const modifySelected=(change)=>commitSlide({...current,elements:current.elements.map((item)=>selectedElements.includes(item.id)?{...item,...change,...(change.locked!=null?{userLocked:change.locked}:{}),...(change.fontSize!=null&&item.id===`${current.id}-title`?{titleAutoFit:false}:{})}:item)})
  const alignSelected=(action)=>{
    const items=current.elements.filter((item)=>selectedElements.includes(item.id))
    if(!items.length)return
    const minX=Math.min(...items.map(i=>i.x)),maxX=Math.max(...items.map(i=>i.x+i.width)),minY=Math.min(...items.map(i=>i.y)),maxY=Math.max(...items.map(i=>i.y+i.height))
    const horizontal=[...items].sort((a,b)=>a.x-b.x),vertical=[...items].sort((a,b)=>a.y-b.y)
    const horizontalGap=items.length>1?(maxX-minX-items.reduce((sum,item)=>sum+item.width,0))/(items.length-1):0
    const verticalGap=items.length>1?(maxY-minY-items.reduce((sum,item)=>sum+item.height,0))/(items.length-1):0
    const distributedX=new Map(),distributedY=new Map()
    let cursor=minX
    horizontal.forEach((item)=>{distributedX.set(item.id,cursor);cursor+=item.width+horizontalGap})
    cursor=minY
    vertical.forEach((item)=>{distributedY.set(item.id,cursor);cursor+=item.height+verticalGap})
    commitSlide({...current,elements:current.elements.map((item)=>{
      if(!selectedElements.includes(item.id)||item.locked)return item
      if(action==='left')return{...item,x:minX}
      if(action==='right')return{...item,x:maxX-item.width}
      if(action==='center')return{...item,x:(minX+maxX-item.width)/2}
      if(action==='top')return{...item,y:minY}
      if(action==='bottom')return{...item,y:maxY-item.height}
      if(action==='middle')return{...item,y:(minY+maxY-item.height)/2}
      if(action==='distribute-h')return{...item,x:distributedX.get(item.id)}
      if(action==='distribute-v')return{...item,y:distributedY.get(item.id)}
      return item
    })})
  }
  const layerSelected=(action)=>{const values=current.elements.map(i=>i.z||0),top=Math.max(...values,0),bottom=Math.min(...values,0);modifySelected({z:action==='front'?top+1:action==='back'?bottom-1:Math.max(bottom,Math.min(top,(current.elements.find(i=>selectedElements.includes(i.id))?.z||0)+(action==='forward'?1:-1)))})}
  const insertElement=(type,component,position)=>{const created=newElement(type,component),element=position?{...created,x:Math.max(5,Math.min(95-created.width,position.x)),y:Math.max(5,Math.min(95-created.height,position.y))}:created;commitSlide({...current,elements:[...current.elements,element]});setSelectedElements([element.id]);setContextMenu(null)}
  const copySelected=()=>{const copied=current.elements.filter((item)=>selectedElements.includes(item.id));if(copied.length)setClipboard(structuredClone(copied));setContextMenu(null)}
  const pasteClipboard=()=>{if(!Array.isArray(clipboard)||!clipboard.length)return;const pasted=structuredClone(clipboard).map((item)=>({...item,id:`${item.id}-${crypto.randomUUID()}`,x:Math.min(95-item.width,item.x+2),y:Math.min(95-item.height,item.y+2),locked:false}));commitSlide({...current,elements:[...current.elements,...pasted]});setSelectedElements(pasted.map((item)=>item.id));setContextMenu(null)}
  const duplicateSelected=()=>{const copied=current.elements.filter((item)=>selectedElements.includes(item.id));if(!copied.length)return;const duplicated=structuredClone(copied).map((item)=>({...item,id:`${item.id}-${crypto.randomUUID()}`,x:Math.min(95-item.width,item.x+2),y:Math.min(95-item.height,item.y+2),locked:false}));commitSlide({...current,elements:[...current.elements,...duplicated]});setSelectedElements(duplicated.map((item)=>item.id));setContextMenu(null)}
  const deleteSelected=()=>{if(!selectedElements.length)return;commitSlide(deleteElement(current,selectedElements));setSelectedElements([]);setContextMenu(null)}
  useEffect(() => {
    const keydown = (event) => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable) return
      if(mode==='edit'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redoEdit():undoEdit();return}
      if(mode==='edit'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redoEdit();return}
      if(mode==='edit'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='c'){event.preventDefault();copySelected();return}
      if(mode==='edit'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='v'){event.preventDefault();pasteClipboard();return}
      if(mode==='edit'&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='d'){event.preventDefault();duplicateSelected();return}
      if(mode==='edit'&&selectedElements.length&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const amount=event.shiftKey?2:.25,dx=event.key==='ArrowLeft'?-amount:event.key==='ArrowRight'?amount:0,dy=event.key==='ArrowUp'?-amount:event.key==='ArrowDown'?amount:0;commitSlide({...current,elements:current.elements.map((item)=>selectedElements.includes(item.id)&&!item.locked?{...item,x:item.x+dx,y:item.y+dy}:item)});return}
      if(mode==='edit'&&selectedElements.length&&['Delete','Backspace'].includes(event.key)){event.preventDefault();deleteSelected();return}
      if(mode!=='edit'&&['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();setIndex((value)=>Math.min(value+1,activeSlides.length-1))}
      if(mode!=='edit'&&['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();setIndex((value)=>Math.max(value-1,0))}
    };window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown)
  // Editor commands intentionally bind to the latest slide snapshot.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mode,current,selectedElements,clipboard,activeSlides.length])

  const startLive = () => { setAnnotations({});setRevealCounts({});const created = createLectureSession(source.id); setSession({ ...created }); setMode('live'); setShowJoin(true) }
  const endLecture=()=>{if(session?.id)endLectureSession(session.id);annotationRef.current?.clear();setAnnotations({});setRevealCounts({});setSession(null);setShowJoin(false);setTool('pointer');setIndex(0);setMode('presenter')}
  const addSlide = (type = 'blank',whiteboardBackground='blank') => { const backgroundLabel=whiteboardOptions.find(([id])=>id===whiteboardBackground)?.[1];let suffix=slides.length+1;while(slides.some((slide)=>slide.id===`${source.id}-custom-${suffix}`))suffix+=1;const created = ensureElements({ id: `${source.id}-custom-${suffix}`, type, title: type === 'whiteboard' ? `${backgroundLabel || 'Blank'} Whiteboard` : 'New Slide', whiteboardBackground,layoutMode:'slide',theme:'academic',presentationContent: [], presenterNotes: [], studentNotes: [], revealSteps: [],courses:['calc2','calc3'],recommendedFor:['calc2','calc3'] }); setSlides((items) => [...items, created]); setIndex(activeSlides.length) }
  const duplicate = (slideIndex) => setSlides((items) => { const sourceSlide=items[slideIndex]; const copy = { ...sourceSlide, id: `${sourceSlide.id}-copy-${Date.now()}`, elements:(sourceSlide.elements||[]).map((element)=>({...element,id:`${element.id}-${crypto.randomUUID()}`})) }; return [...items.slice(0, slideIndex + 1), copy, ...items.slice(slideIndex + 1)] })
  const remove = (slideIndex) => { if (slides.length === 1) return; setSlides((items) => items.filter((_, i) => i !== slideIndex)); setIndex((value) => Math.min(value, slides.length - 2)) }
  const moveSelectedTo=(targetIndex)=>{if(!selectedElements.length||targetIndex<0||targetIndex>=slides.length)return;const moving=current.elements.filter((element)=>selectedElements.includes(element.id));setSlides((items)=>items.map((slide,i)=>i===index?{...slide,elements:slide.elements.filter((element)=>!selectedElements.includes(element.id))}:i===targetIndex?{...slide,elements:[...slide.elements,...moving.map((element)=>({...element,id:`${element.id}-${crypto.randomUUID()}`}))]}:slide));setSelectedElements([]);setIndex(targetIndex)}
  const reorder = (target) => { if (dragged === null || dragged === target) return; setSlides((items) => { const copy = [...items]; const [moving] = copy.splice(dragged, 1); copy.splice(target, 0, moving); return copy }); setIndex(target); setDragged(null) }
  const reveal = () => setRevealCounts((counts) => ({ ...counts, [current.id]: Math.min((counts[current.id] || 0) + 1, current.revealSteps?.length || 0) }))
  const previousReveal = () => setRevealCounts((counts) => ({ ...counts, [current.id]: Math.max((counts[current.id] || 0) - 1, 0) }))
  const updateTitle = (title) => setSlides((items) => items.map((item, i) => i === index ? { ...item, title } : item))
  const updatePresenterNotes=(presenterNotes)=>commitSlide({...current,presenterNotes})
  const updateInstructorFeedback=(instructorFeedback)=>{setSaveStatus('Saving…');setSlides(items=>items.map(slide=>slide.id===current.id?{...slide,instructorFeedback}:slide))}
  const participants = getParticipants(session)
  const projectorSession=getProjectorSession(session)
  const beginLecture=()=>{setShowJoin(false);window.dispatchEvent(new Event('calculus:begin-lecture'));setTimeout(()=>setIndex((value)=>value===0?1:value),4000)}
  const openingContext={joinUrl:session?makeJoinUrl(session.join_code):null,sessionCode:session?.join_code,onBegin:beginLecture}
  const tools = ['pointer','pen','highlighter','eraser']
  const closePresenterWindow=()=>{presenterWindowRef.current=null;setPresenterPortal(null);setMode((value)=>value==='audience'?'presenter':value)}
  const openPresenterView=()=>{
    const popup=window.open('','calculus-presenter-view','popup,width=1400,height=900,resizable=yes,scrollbars=yes')
    if(!popup){setMode('presenter');return}
    const popupDocument=popup.document
    popupDocument.title=`Presenter · ${source.title}`;popupDocument.body.innerHTML='';popupDocument.body.className='presenter-window-body'
    document.querySelectorAll('link[rel="stylesheet"],style').forEach((node)=>popupDocument.head.appendChild(node.cloneNode(true)))
    const host=popupDocument.createElement('div');popupDocument.body.appendChild(host)
    setAnnotations({});setRevealCounts({});presenterWindowRef.current=popup;setPresenterPortal({popup,host});setIndex(0);setMode('audience')
    document.documentElement.requestFullscreen?.().catch(()=>{})
  }
  useEffect(()=>()=>presenterWindowRef.current?.close(),[])

  if (mode === 'audience') return <><div className="audience-view"><SlideCanvas slide={current} revealCount={revealCounts[current.id] || 0} audience openingContext={openingContext}/>{projectorSession&&<LiveQuestionProjector session={projectorSession}/>}<AnnotationLayer ref={annotationRef} active tool={tool} color={color} width={width} paths={annotations[current.id] || []} onChange={(paths) => setAnnotations((all) => ({ ...all, [current.id]: paths }))}/><div className="audience-annotation-tools" aria-label="Live annotation tools">{tools.map(name=><button className={tool===name?'active':''} onClick={()=>setTool(name)} key={name}>{name}</button>)}<input aria-label="Ink color" type="color" value={color} onChange={event=>setColor(event.target.value)}/><input aria-label="Stroke width" type="range" min="1" max="14" value={width} onChange={event=>setWidth(Number(event.target.value))}/><button onClick={()=>annotationRef.current?.undo()}>Undo</button><button onClick={()=>annotationRef.current?.clear()}>Clear</button></div><button className="audience-exit" onClick={() => {presenterWindowRef.current?.close();presenterWindowRef.current=null;setPresenterPortal(null);document.fullscreenElement&&document.exitFullscreen();setMode(session ? 'live' : 'presenter')}}>Exit Presentation</button></div>{presenterPortal&&<PresenterDashboardWindow popup={presenterPortal.popup} host={presenterPortal.host} lectureTitle={source.title} current={current} next={nextSlide} index={index} total={activeSlides.length} revealCount={revealCounts[current.id]||0} onPrevious={()=>setIndex(value=>Math.max(0,value-1))} onNext={()=>setIndex(value=>Math.min(activeSlides.length-1,value+1))} onClose={closePresenterWindow} onInstructorFeedbackChange={updateInstructorFeedback}/>}</>
  if (mode === 'student-notes') {
    const preserveSlideGeometry=source.id==='geometry'
    return <div className={`student-notes-view${preserveSlideGeometry?' slide-notes-view':''}`}><header><div><small>Student notes · {pathMode}</small><h1>{source.title}</h1></div><button onClick={() => setMode('edit')}>Return to Editor</button></header>{activeSlides.map((slide)=><section className={`student-note-page${preserveSlideGeometry?' geometry-note-slide':''}`} key={slide.id} aria-label={slide.title}><VisualSlideCanvas slide={{...slide,layoutMode:preserveSlideGeometry?'slide':'page'}} revealCount={99} studentNotes /></section>)}</div>
  }

  return <div className={`lecture-studio mode-${mode}${paused ? ' animations-paused' : ''}`}>
    <header className="studio-toolbar"><button onClick={onBack}>← Lectures</button><div className="studio-title"><strong>{source.title}</strong><span>Slide {index + 1} of {activeSlides.length} · {saveStatus}</span></div>{source.presentationModes&&<div className="course-path-switch" aria-label="Present for">{source.presentationModes.map((path)=><button className={pathMode===path.id?'active':''} onClick={()=>{setPathMode(path.id);setIndex(0)}} key={path.id}>{path.label}</button>)}</div>}<div className="mode-switch"><button className={mode === 'edit' ? 'active' : ''} onClick={() => setMode('edit')}>Edit</button><button className={mode === 'presenter' ? 'active' : ''} onClick={openPresenterView}>Presenter</button><button className={mode === 'live' ? 'active' : ''} onClick={session ? () => setMode('live') : startLive}>{session ? 'Live Class' : 'Start Live Lecture'}</button><button onClick={() => setMode('audience')}>Present</button></div></header>
    {mode==='edit'?<div className="studio-tools editor-ribbon"><button onClick={undoEdit}>Undo</button><button onClick={redoEdit}>Redo</button><details><summary>Insert / Components</summary><div className="insert-menu">{['text','heading','bullets','math','combined','definition','theorem','property','formula','example','important','remark','question','mistake','image','shape','arrow','line','whiteboard'].map((type)=><button onClick={()=>insertElement(type)} key={type}>{type}</button>)}{componentPalette.map((item)=><button onClick={()=>insertElement('interactive',item.key)} key={item.key}>{item.label}</button>)}</div></details>{selectedElements.length>0&&<><button onClick={copySelected}>Copy Block</button><button onClick={duplicateSelected}>Duplicate Block</button><button onClick={deleteSelected}>Delete Block</button></>}<button onClick={pasteClipboard} disabled={!clipboard?.length}>Paste Block</button><button onClick={()=>moveSelectedTo(index-1)} disabled={!selectedElements.length||index===0}>Move to Previous</button><button onClick={()=>moveSelectedTo(index+1)} disabled={!selectedElements.length||index===slides.length-1}>Move to Next</button><button className={showGrid?'active':''} onClick={()=>setShowGrid(v=>!v)}>Grid</button><button className={snap?'active':''} onClick={()=>setSnap(v=>!v)}>Snap</button><button onClick={()=>setShowData(v=>!v)}>View Data</button><button onClick={()=>addSlide('blank')}>New Slide</button></div>:<div className="studio-tools"><button onClick={() => setIndex(Math.max(index - 1, 0))}>Previous Slide</button><button onClick={() => setIndex(Math.min(index + 1, slides.length - 1))}>Next Slide</button>{tools.map((name) => <button key={name} className={tool === name ? 'active' : ''} onClick={() => setTool(name)}>{name}</button>)}<label>Ink <input type="color" value={color} onChange={event=>setColor(event.target.value)}/></label><label>Width <input type="range" min="1" max="14" value={width} onChange={event=>setWidth(Number(event.target.value))}/></label><button onClick={() => annotationRef.current?.undo()}>Undo</button><button onClick={() => annotationRef.current?.redo()}>Redo</button><button onClick={() => annotationRef.current?.clear()}>Clear</button><details className="quick-whiteboard-menu"><summary>Whiteboard</summary><div>{whiteboardOptions.map(([id,label])=><button onClick={()=>addSlide('whiteboard',id)} key={id}>{label}</button>)}</div></details>{current.revealSteps?.length > 0 && <><button onClick={previousReveal}>Previous Step</button><button onClick={reveal}>Reveal</button></>}{session&&<><button onClick={()=>current.question&&openLectureQuestion(session.id,current.question)}>Ask Class</button><button className="end-lecture-button" onClick={endLecture}>End Lecture & Clear Ink</button></>}</div>}
    <div className="studio-context-bar">
      {mode==='edit'&&<><button className="student-notes-preview" onClick={() => setMode('student-notes')}>Preview Student Notes</button><LectureQAPanel lectureId={source.id} slides={slides}/><SlideQualityPanel slide={current} onSelect={setSelectedElements}/></>}
      {mode==='live'&&<LiveQuestionLauncher slides={slides} session={session} onOpen={openLectureQuestion}/>} 
    </div>
    <div className="studio-layout">
      <aside className="slide-rail"><header><strong>Slides</strong><button onClick={() => addSlide()}>+ New Slide</button></header>{activeSlides.map((item, itemIndex) => <article draggable={mode==='edit'} onDragStart={() => setDragged(itemIndex)} onDragOver={(e) => e.preventDefault()} onDrop={() => reorder(itemIndex)} className={itemIndex === index ? 'active' : ''} key={item.id} onClick={() => setIndex(itemIndex)}><span>{itemIndex + 1}</span><div className="thumbnail"><small>{item.type} · {item.level||'essential'}</small><strong>{item.title}</strong></div>{mode === 'edit' && <div className="thumbnail-actions"><button title="Copy all slide blocks" onClick={(e) => { e.stopPropagation(); setClipboard(structuredClone(item.elements||[])) }}>Copy Blocks</button><button title="Duplicate slide" onClick={(e) => { e.stopPropagation(); duplicate(itemIndex) }}>Duplicate</button><button title="Delete" onClick={(e) => { e.stopPropagation(); remove(itemIndex) }}>Delete</button></div>}</article>)}</aside>
      <main className={`studio-stage ${current.layoutMode==='page'?'page-stage':''}`} onClick={()=>setContextMenu(null)}><div className={`slide-frame ${current.layoutMode==='page'?'page-frame':''}`}>{mode==='edit'?<VisualSlideCanvas slide={current} revealCount={99} editing selected={selectedElements} onSelect={setSelectedElements} onChange={changeElements} onInlineChange={updateInlineElement} showGrid={showGrid} snap={snap} onElementContextMenu={(event,element)=>{if(!selectedElements.includes(element.id))setSelectedElements([element.id]);setContextMenu({x:event.clientX,y:event.clientY,element:true})}} onCanvasContextMenu={(event,position)=>setContextMenu({x:event.clientX,y:event.clientY,element:false,position})}/>:<><SlideCanvas slide={current} revealCount={revealCounts[current.id] || 0} openingContext={openingContext} inlineEditing={mode==='presenter'||mode==='live'} onInlineChange={updateInlineElement} selected={selectedElements} onSelect={setSelectedElements} onChange={changeElements}/>{mode==='live'&&projectorSession&&<LiveQuestionProjector session={projectorSession}/>}<AnnotationLayer ref={annotationRef} active tool={tool} color={color} width={width} paths={annotations[current.id] || []} onChange={(paths)=>setAnnotations((all)=>({...all,[current.id]:paths}))}/></>}</div>{mode==='edit'&&<section className="slide-editor"><label>Page title<input value={current.title} onChange={(e)=>updateTitle(e.target.value)}/></label><label>Layout mode<select value={current.layoutMode||'slide'} onChange={(e)=>commitSlide({...current,layoutMode:e.target.value})}><option value="slide">16:9 Slide</option><option value="page">Lecture Page</option></select></label><label>Design style<select value={current.theme||'academic'} onChange={(e)=>commitSlide({...current,theme:e.target.value})}><option value="academic">Interactive Calculus</option><option value="classic-math">Classic Math</option></select></label></section>}{showData&&<pre className="lecture-data-view">{JSON.stringify(current,null,2)}</pre>}</main>
      <div className="studio-side">{mode==='edit'?<><ElementInspector elements={current.elements.filter((item)=>selectedElements.includes(item.id))} onUpdate={modifySelected} onAlign={alignSelected} onDuplicate={()=>commitSlide(duplicateElement(current,selectedElements))} onDelete={()=>{commitSlide(deleteElement(current,selectedElements));setSelectedElements([])}} onLayer={layerSelected}/><PresenterNotesPanel notes={current.presenterNotes} studentNotes={current.studentNotes} tab={notesTab} onTabChange={setNotesTab} editable onNotesChange={updatePresenterNotes} instructorFeedback={current.instructorFeedback||''} onInstructorFeedbackChange={updateInstructorFeedback}/></>:<><PresenterNotesPanel notes={current.presenterNotes} studentNotes={current.studentNotes} tab={notesTab} onTabChange={setNotesTab} session={session} question={current.question} instructorFeedback={current.instructorFeedback||''} onInstructorFeedbackChange={updateInstructorFeedback}/><section className="next-preview"><span>Next slide</span>{nextSlide?<strong>{nextSlide.title}</strong>:<strong>End</strong>}</section></>}</div>
    </div>
    {contextMenu&&<div className="element-context-menu" style={{left:contextMenu.x,top:contextMenu.y}} onClick={(event)=>event.stopPropagation()}>{contextMenu.element?<><button onClick={copySelected}>Copy</button><button onClick={duplicateSelected}>Duplicate Block</button><button onClick={deleteSelected}>Delete</button></>:<><button onClick={()=>insertElement('text',null,contextMenu.position)}>Insert Text Box</button><button onClick={()=>insertElement('math',null,contextMenu.position)}>Insert Math Box</button><button onClick={()=>insertElement('combined',null,contextMenu.position)}>Insert Text + Math Box</button></>}<button onClick={pasteClipboard} disabled={!clipboard?.length}>Paste</button></div>}
    {showJoin && session && <div className="join-overlay" role="dialog" aria-modal="true"><section><button className="join-close" onClick={() => setShowJoin(false)}>Close</button><p>Live class</p><h2>{source.title}</h2><LectureJoinQRCode joinUrl={makeJoinUrl(session.join_code)} sessionCode={session.join_code} lectureTitle={source.title} size={300} /><h3>Scan to join</h3><div>Class code <strong>{session.join_code}</strong></div><p>Students joined: {participants.length}</p><button className="primary" onClick={beginLecture}>Begin Lecture</button></section></div>}
  </div>
}
