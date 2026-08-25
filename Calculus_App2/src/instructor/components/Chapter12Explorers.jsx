import { useEffect, useMemo, useState } from 'react'
import '../styles/chapter12LayoutFixes.css'

const arrow=(x1,y1,x2,y2,color='#087f78',key='a')=><g key={key}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" markerEnd="url(#c12-arrow)"/><circle cx={x2} cy={y2} r="4" fill={color}/></g>
const labels={dimensions:'Build one, two, then three independent directions.',axes:'Three perpendicular directions form a right-handed frame.',planes:'A coordinate plane sets its missing coordinate to zero.',octants:'Coordinate planes divide space into eight sign regions.',point:'Plot with three independent coordinate movements.',projection:'A perpendicular drop removes one component.',surfaces:'One equation in space leaves two degrees of freedom.',cylinder:'A missing variable is free to extend.',distance:'Build the diagonal from perpendicular changes.',sphere:'Every radius from the center has equal length.','equivalent-vectors':'Translation preserves magnitude and direction.',addition:'Tip-to-tail and parallelogram laws agree.',scaling:'Scaling changes length and may reverse direction.',basis:'Basis vectors isolate coordinate directions.','unit-vector':'Normalization preserves direction and makes length one.','angle-components':'Components resolve motion along axes.','dot-alignment':'Rotate b and watch dot-product sign change.',orthogonality:'At 90°, directional agreement is zero.','direction-cosines':'Normalized components are direction cosines.','projection-dot':'The shadow along a is the vector projection.',work:'Only force parallel to displacement contributes.','cross-product':'Two directions create a perpendicular normal.','right-hand':'Reverse the order and the normal reverses.','cross-area':'Parallelogram area changes with sine of the angle.',torque:'Perpendicular force produces the strongest turn.','line-motion':'The parameter moves a point along a line.','plane-normal':'Every in-plane displacement is perpendicular to the normal.','plane-angle':'The angle between planes comes from their normals.','point-plane-distance':'The shortest path follows the normal.','missing-variable':'Extrude a plane curve parallel to the missing axis.','trace-explorer':'A moving plane exposes a 2D trace.','quadric-gallery':'Compare sign patterns and surface shapes.','surface-slices':'Stack traces to reconstruct the surface.'}
const animated=new Set(['dimensions','point','projection','distance','sphere','addition','scaling','dot-alignment','orthogonality','projection-dot','work','cross-product','right-hand','cross-area','torque','line-motion','plane-normal','plane-angle','point-plane-distance','missing-variable','trace-explorer','quadric-gallery','surface-slices'])

export default function Chapter12Explorers({stage,mode='review'}){
  const [angle,setAngle]=useState(45),[scale,setScale]=useState(1),[plane,setPlane]=useState('xy'),[step,setStep]=useState(0),[playing,setPlaying]=useState(false)
  const [visible,setVisible]=useState({a:true,b:true,z:true,result:true,trace:true})
  const [reversed,setReversed]=useState(false),[crossView,setCrossView]=useState('normal')
  const usesAngleAnimation=['dot-alignment','orthogonality','direction-cosines','projection-dot','work','cross-product','right-hand','cross-area','torque','plane-angle'].includes(stage)
  const advance=()=>setStep(value=>{const next=(value+1)%7;if(usesAngleAnimation)setAngle([15,45,75,90,120,150,180][next]);return next})
  useEffect(()=>{if(!playing)return;const timer=setInterval(advance,650);return()=>clearInterval(timer)},[playing,usesAngleAnimation])
  const radians=angle*Math.PI/180, progress=step/6
  const dynamic=useMemo(()=>({x:95+75*Math.cos(radians),y:125-75*Math.sin(radians)}),[radians])
  const alignment=['dot-alignment','orthogonality','direction-cosines','projection-dot','work','cross-product','right-hand','cross-area','torque','plane-angle'].includes(stage)
  const surface=['missing-variable','trace-explorer','quadric-gallery','surface-slices'].includes(stage)
  const spatial=['dimensions','axes','planes','octants','point','projection','surfaces','cylinder','distance','sphere','line-motion','plane-normal','point-plane-distance'].includes(stage)||surface
  const hasZLayer=spatial||['work','torque'].includes(stage)
  const reset=()=>{setPlaying(false);setStep(0);setAngle(stage==='torque'?90:stage==='cross-parallel'?0:45);setScale(1);setPlane('xy');setVisible({a:true,b:true,z:true,result:true,trace:true});setReversed(false);setCrossView('normal')}
  const toggleVisible=(key)=>setVisible(current=>({...current,[key]:!current[key]}))
  useEffect(()=>{
    setPlaying(false)
    setStep(0)
    setAngle(stage==='torque'?90:stage==='cross-parallel'?0:45)
    setVisible({a:true,b:true,z:true,result:true,trace:true})
    setReversed(false)
    setCrossView('normal')
  },[stage])
  if(stage==='torque'){
    const fx=120+95*Math.cos(radians),fy=168-95*Math.sin(radians),torque=(10*Math.sin(radians)).toFixed(2)
    return <div className="torque-explorer" data-mode={mode} onPointerDown={event=>event.stopPropagation()}>
      <div className="torque-canvas">
        <svg viewBox="0 0 430 245" role="img" aria-label={`Torque diagram with force angle ${angle} degrees and torque magnitude ${torque}`}>
          <defs><marker id="torque-arrow-r" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#087f78"/></marker><marker id="torque-arrow-f" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#d65d45"/></marker><marker id="torque-arrow-t" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#6d28d9"/></marker></defs>
          <g opacity=".48"><line x1="120" y1="168" x2="390" y2="168" stroke="#64748b" strokeWidth="2"/><line x1="120" y1="168" x2="55" y2="218" stroke="#64748b" strokeWidth="2"/><line x1="120" y1="168" x2="120" y2="18" stroke="#64748b" strokeWidth="2"/><text x="393" y="184">x</text><text x="45" y="226">y</text><text x="128" y="24">z</text></g>
          <rect x="92" y="158" width="34" height="20" rx="5" fill="#475569"/><circle cx="120" cy="168" r="7" fill="#1e293b"/>
          {visible.a&&<g><line x1="120" y1="168" x2="270" y2="168" stroke="#087f78" strokeWidth="7" markerEnd="url(#torque-arrow-r)"/><text x="204" y="194" textAnchor="middle" fill="#08645f" fontSize="19" fontWeight="900">r = ⟨2,0,0⟩ m</text></g>}
          {visible.b&&<g><line x1="120" y1="168" x2={fx} y2={fy} stroke="#d65d45" strokeWidth="7" markerEnd="url(#torque-arrow-f)"/><text x={(120+fx)/2-12} y={(168+fy)/2-10} fill="#a33b2e" fontSize="18" fontWeight="900">F</text></g>}
          <path d={`M164 168 A44 44 0 0 0 ${120+44*Math.cos(radians)} ${168-44*Math.sin(radians)}`} fill="none" stroke="#d97706" strokeWidth="3"/><text x="157" y="150" fill="#92400e" fontSize="15" fontWeight="900">θ</text>
          {visible.result&&<g><line x1="120" y1="168" x2="120" y2={Math.max(38,168-105*Math.sin(radians))} stroke="#6d28d9" strokeWidth="8" markerEnd="url(#torque-arrow-t)"/><text x="136" y="64" fill="#4c1d95" fontSize="18" fontWeight="900">τ = r × F</text><circle cx="342" cy="74" r="27" fill="#f5f3ff" stroke="#6d28d9" strokeWidth="4"/><circle cx="342" cy="74" r="7" fill="#6d28d9"/><text x="342" y="116" textAnchor="middle" fill="#4c1d95" fontSize="14" fontWeight="900">out of xy-plane</text></g>}
          <text x="318" y="214" textAnchor="middle" fill="#334155" fontSize="17" fontWeight="900">‖τ‖ = 2(5) sin {angle}° = {torque} N·m</text>
        </svg>
      </div>
      <div className="torque-controls" aria-label="Torque animation controls">
        <button type="button" onClick={()=>setPlaying(true)} disabled={playing}>Play</button>
        <button type="button" onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button>
        <button type="button" onClick={()=>{setPlaying(false);advance()}}>Step</button>
        <button type="button" onClick={reset}>Reset</button>
        <label>Force angle <input type="range" min="0" max="180" value={angle} onChange={event=>{setPlaying(false);setAngle(Number(event.target.value))}}/><b>{angle}°</b></label>
        <button type="button" className={visible.a?'active':''} aria-pressed={visible.a} onClick={()=>toggleVisible('a')}>r</button>
        <button type="button" className={visible.b?'active':''} aria-pressed={visible.b} onClick={()=>toggleVisible('b')}>F</button>
        <button type="button" className={visible.result?'active':''} aria-pressed={visible.result} onClick={()=>toggleVisible('result')}>τ</button>
      </div>
    </div>
  }
  if(stage==='cross-parallel'){
    const opposite=angle===180
    return <div className="parallel-vector-explorer" data-mode={mode} onPointerDown={event=>event.stopPropagation()}>
      <div className="parallel-vector-controls" role="group" aria-label="Choose parallel-vector direction">
        <button type="button" className={!opposite?'active':''} aria-pressed={!opposite} onClick={()=>setAngle(0)}>Same direction: θ = 0</button>
        <button type="button" className={opposite?'active':''} aria-pressed={opposite} onClick={()=>setAngle(180)}>Opposite directions: θ = π</button>
        <button type="button" onClick={()=>setVisible(current=>({...current,a:!current.a}))} aria-pressed={visible.a}>Vector a</button>
        <button type="button" onClick={()=>setVisible(current=>({...current,b:!current.b}))} aria-pressed={visible.b}>Vector b</button>
      </div>
      <div className="parallel-vector-canvas">
        <svg viewBox="0 0 420 230" role="img" aria-label={`Parallel vectors with angle ${opposite?'pi':'zero'} and zero cross product`}>
          <defs><marker id="parallel-arrow-a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#087f78"/></marker><marker id="parallel-arrow-b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#d65d45"/></marker></defs>
          <line x1="30" y1="125" x2="390" y2="125" stroke="#cbd5e1" strokeWidth="2"/>
          <circle cx="210" cy="125" r="6" fill="#334155"/>
          {visible.a&&<g><line x1="210" y1="125" x2="355" y2="125" stroke="#087f78" strokeWidth="7" markerEnd="url(#parallel-arrow-a)"/><text x="290" y="105" textAnchor="middle" fill="#08645f" fontSize="20" fontWeight="900">a</text></g>}
          {visible.b&&<g><line x1="210" y1="125" x2={opposite?65:325} y2={opposite?125:125} stroke="#d65d45" strokeWidth="7" markerEnd="url(#parallel-arrow-b)"/><text x={opposite?135:275} y="158" textAnchor="middle" fill="#a33b2e" fontSize="20" fontWeight="900">b</text></g>}
          <g transform="translate(210 42)"><circle r="27" fill="#f1f5f9" stroke="#64748b" strokeWidth="3"/><text y="7" textAnchor="middle" fill="#334155" fontSize="24" fontWeight="900">0</text><text y="47" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="900">a × b = 0</text></g>
          <text x="210" y="210" textAnchor="middle" fill="#4c1d95" fontSize="18" fontWeight="900">sin {opposite?'π':'0'} = 0, so the parallelogram has zero area.</text>
        </svg>
      </div>
      <div className="parallel-vector-result"><strong>a × b = 𝟎</strong><span>The cross product is the zero vector.</span></div>
    </div>
  }
  if(stage==='right-hand'){
    const bx=120+95*Math.cos(radians),by=166-95*Math.sin(radians),cx=bx+125
    const order=reversed?'b × a':'a × b',direction=reversed?'into the screen':'out of the screen'
    return <div className="right-hand-explorer" data-mode={mode} onPointerDown={event=>event.stopPropagation()}>
      <div className="right-hand-controls">
        <button type="button" onClick={()=>setPlaying(true)} disabled={playing}>Play</button>
        <button type="button" onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button>
        <button type="button" onClick={()=>{setPlaying(false);advance()}}>Step</button>
        <button type="button" onClick={reset}>Reset</button>
        <button type="button" className={reversed?'active':''} onClick={()=>setReversed(value=>!value)}>Reverse order</button>
      </div>
      <div className="right-hand-view-controls" role="group" aria-label="Cross product visualization mode">
        <button type="button" className={crossView==='normal'?'active':''} aria-pressed={crossView==='normal'} onClick={()=>setCrossView('normal')}>Normal vector</button>
        <button type="button" className={crossView==='projection'?'active':''} aria-pressed={crossView==='projection'} onClick={()=>setCrossView('projection')}>Projection plane</button>
        <label>Angle <input type="range" min="5" max="175" value={angle} onChange={event=>{setPlaying(false);setAngle(Number(event.target.value))}}/><b>{angle}°</b></label>
      </div>
      <div className="right-hand-stage">
        <svg viewBox="0 0 380 220" role="img" aria-label={`${order} points ${direction}`}>
          <defs><marker id="rh-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs>
          <g opacity=".58"><line x1="120" y1="166" x2="355" y2="166" stroke="#64748b" strokeWidth="2"/><line x1="120" y1="166" x2="55" y2="205" stroke="#64748b" strokeWidth="2"/><line x1="120" y1="166" x2="120" y2="18" stroke="#64748b" strokeWidth="2"/><text x="356" y="182">x</text><text x="45" y="211">y</text><text x="127" y="25">z</text></g>
          {crossView==='projection'&&<><polygon points={`120,166 245,166 ${cx},${by} ${bx},${by}`} fill="#7c3aed35" stroke="#7c3aed" strokeWidth="3"/><line x1={bx} y1={by} x2={bx} y2="166" stroke="#d97706" strokeWidth="3" strokeDasharray="7 5"/><text x="285" y="202" textAnchor="middle" fill="#5b21b6" fontSize="14" fontWeight="900">plane spanned by a and b</text></>}
          <line x1="120" y1="166" x2="245" y2="166" stroke="#087f78" strokeWidth="6" markerEnd="url(#rh-arrow)"/><text x="190" y="190" fill="#08645f" fontSize="17" fontWeight="900">a</text>
          <line x1="120" y1="166" x2={bx} y2={by} stroke="#d65d45" strokeWidth="6" markerEnd="url(#rh-arrow)"/><text x={(120+bx)/2-9} y={(166+by)/2-9} fill="#a33b2e" fontSize="17" fontWeight="900">b</text>
          <path d={`M160 166 A40 40 0 0 0 ${120+40*Math.cos(radians)} ${166-40*Math.sin(radians)}`} fill="none" stroke="#4f46e5" strokeWidth="3"/><text x="151" y="150" fill="#3730a3" fontSize="15" fontWeight="900">θ</text>
          {crossView==='normal'&&<g><circle cx="305" cy="72" r="31" fill="#f4efff" stroke="#6d28d9" strokeWidth="4"/>{reversed?<><line x1="288" y1="55" x2="322" y2="89" stroke="#6d28d9" strokeWidth="6"/><line x1="322" y1="55" x2="288" y2="89" stroke="#6d28d9" strokeWidth="6"/></>:<circle cx="305" cy="72" r="7" fill="#6d28d9"/>}<text x="305" y="119" textAnchor="middle" fill="#4c1d95" fontSize="15" fontWeight="900">{reversed?'⊗ into screen':'⊙ out of screen'}</text></g>}
        </svg>
        <div className="right-hand-readout"><strong>{order}</strong><span>{direction}</span><small>{reversed?'Curl from b toward a; the normal reverses.':'Curl from a toward b; your thumb gives the normal.'}</small></div>
      </div>
    </div>
  }
  if(stage==='cross-area'){
    const bx=120+90*Math.cos(radians),by=170-90*Math.sin(radians),cx=bx+130,areaRatio=Math.sin(radians)
    return <div className="cross-area-explorer" data-mode={mode} onPointerDown={event=>event.stopPropagation()}>
      <div className="cross-area-controls">
        <button type="button" onClick={()=>setPlaying(true)} disabled={playing}>Play</button>
        <button type="button" onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button>
        <button type="button" onClick={()=>{setPlaying(false);advance()}}>Step</button>
        <button type="button" onClick={reset}>Reset</button>
        <label>Angle <input type="range" min="0" max="180" value={angle} onChange={event=>{setPlaying(false);setAngle(Number(event.target.value))}}/><b>{angle}°</b></label>
      </div>
      <div className="cross-area-layer-controls" aria-label="Show or hide area diagram layers">
        <button type="button" className={visible.a?'active':''} aria-pressed={visible.a} onClick={()=>toggleVisible('a')}>Vector a</button>
        <button type="button" className={visible.b?'active':''} aria-pressed={visible.b} onClick={()=>toggleVisible('b')}>Vector b</button>
        <button type="button" className={visible.result?'active':''} aria-pressed={visible.result} onClick={()=>toggleVisible('result')}>Area and height</button>
      </div>
      <div className="cross-area-stage">
        <svg viewBox="0 0 360 220" role="img" aria-label={`Parallelogram formed by vectors a and b at ${angle} degrees`}>
          <defs><marker id="cross-area-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs>
          <line x1="25" y1="170" x2="345" y2="170" stroke="#cbd5e1" strokeWidth="2"/>
          {visible.result&&<><polygon points={`120,170 250,170 ${cx},${by} ${bx},${by}`} fill="#f5b94255" stroke="#7c3aed" strokeWidth="3"/><line x1={bx} y1={by} x2={bx} y2="170" stroke="#d97706" strokeWidth="3" strokeDasharray="7 5"/><text x={bx+7} y={(by+170)/2} fill="#92400e" fontSize="14" fontWeight="800">height</text></>}
          {visible.a&&<g><line x1="120" y1="170" x2="250" y2="170" stroke="#087f78" strokeWidth="6" markerEnd="url(#cross-area-arrow)"/><text x="185" y="198" textAnchor="middle" fill="#08645f" fontSize="17" fontWeight="900">a (base)</text></g>}
          {visible.b&&<g><line x1="120" y1="170" x2={bx} y2={by} stroke="#d65d45" strokeWidth="6" markerEnd="url(#cross-area-arrow)"/><text x={(120+bx)/2-8} y={(170+by)/2-8} fill="#a33b2e" fontSize="17" fontWeight="900">b</text></g>}
          <path d={`M158 170 A38 38 0 0 0 ${120+38*Math.cos(radians)} ${170-38*Math.sin(radians)}`} fill="none" stroke="#4f46e5" strokeWidth="3"/>
          <text x="150" y="154" fill="#3730a3" fontSize="15" fontWeight="900">θ</text>
        </svg>
        <div className="cross-area-readout"><strong>Area = ‖a‖‖b‖ sin θ</strong><span>sin {angle}° = {areaRatio.toFixed(3)}</span></div>
      </div>
    </div>
  }
  return <div className="chapter12-explorer" data-mode={mode} data-stage={stage}>
    <div className="chapter12-controls">
      {animated.has(stage)&&<><button type="button" onClick={()=>setPlaying(true)} disabled={playing}>Play</button><button type="button" onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button><button type="button" onClick={()=>{setPlaying(false);advance()}}>Step</button><button type="button" onClick={reset}>Reset</button></>}
      {stage==='planes'&&['xy','xz','yz'].map(value=><button type="button" className={plane===value?'active':''} onClick={()=>setPlane(value)} key={value}>{value}</button>)}
      {alignment&&<label>Angle <input type="range" min="0" max="180" value={angle} onChange={event=>setAngle(Number(event.target.value))}/><b>{angle}°</b></label>}
      {stage==='scaling'&&<label>Scalar <input type="range" min="-2" max="2" step=".1" value={scale} onChange={event=>setScale(Number(event.target.value))}/><b>{scale}</b></label>}
    </div>
    <div className="chapter12-color-key" aria-label="Show or hide visualization layers"><button type="button" className={`c12-key-a${visible.a?' active':''}`} aria-pressed={visible.a} onClick={()=>toggleVisible('a')}>x / vector a / primary</button><button type="button" className={`c12-key-b${visible.b?' active':''}`} aria-pressed={visible.b} onClick={()=>toggleVisible('b')}>y / vector b / secondary</button>{hasZLayer&&<button type="button" className={`c12-key-z${visible.z?' active':''}`} aria-pressed={visible.z} onClick={()=>toggleVisible('z')}>z / point / force</button>}<button type="button" className={`c12-key-result${visible.result?' active':''}`} aria-pressed={visible.result} onClick={()=>toggleVisible('result')}>resultant / normal / projection</button>{surface&&<button type="button" className={`c12-key-trace${visible.trace?' active':''}`} aria-pressed={visible.trace} onClick={()=>toggleVisible('trace')}>active trace</button>}</div>
    <svg viewBox="0 0 320 220" role="img" aria-label={labels[stage]||'Interactive Chapter 12 visualization'}>
      <defs><marker id="c12-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker><linearGradient id="c12-surface"><stop stopColor="#70d6cf"/><stop offset="1" stopColor="#7356a8"/></linearGradient></defs>
      <path d="M25 175H295M95 205L220 55M95 205V20" stroke="#cad5d9" strokeWidth="2"/>
      {spatial&&<>{visible.a&&arrow(95,175,280,175,'#087f78','x')}{visible.b&&arrow(95,175,220,55,'#7356a8','y')}{visible.z&&arrow(95,175,95,25,'#d65d45','z')}</>}
      {stage==='planes'&&<polygon points={plane==='xy'?'40,174 185,70 280,174 130,215':plane==='xz'?'95,205 95,25 220,55 220,180':'95,205 95,25 275,175 190,215'} fill="#70d6cf" opacity=".4"/>}
      {['point','projection','distance'].includes(stage)&&<><path d={`M95 175L${95+95*Math.max(.2,progress)} 175L230 125L230 70`} fill="none" stroke="#d65d45" strokeWidth="3" strokeDasharray="7 5"/><circle cx="230" cy="70" r="7" fill="#d65d45"/></>}
      {['sphere','cylinder'].includes(stage)&&<><ellipse cx="185" cy="125" rx={stage==='sphere'?55:42} ry={stage==='sphere'?55:18} fill="#70d6cf" opacity=".4" stroke="#087f78" strokeWidth="3"/>{stage==='cylinder'&&<><line x1="143" y1="55" x2="143" y2="180" stroke="#087f78"/><line x1="227" y1="55" x2="227" y2="180" stroke="#087f78"/></>}</>}
      {['equivalent-vectors','addition','scaling','basis','unit-vector','angle-components'].includes(stage)&&<>{arrow(95,125,stage==='scaling'?95+75*scale:185,stage==='unit-vector'?85:75,'#087f78','u')}{stage==='equivalent-vectors'&&arrow(155,175,245,125,'#087f78','u2')}{stage==='addition'&&<>{arrow(185,75,260,110,'#d65d45','v')}{step>2&&arrow(95,125,260,110,'#7356a8','sum')}</>}{stage==='basis'&&arrow(95,125,95,45,'#d65d45','j')}</>}
      {alignment&&<>{visible.result&&stage==='cross-area'&&<polygon points={`95,125 180,125 ${dynamic.x+85},${dynamic.y} ${dynamic.x},${dynamic.y}`} fill="#7356a833" stroke="#7356a8" strokeWidth="3"/>}{visible.a&&arrow(95,125,180,125,'#087f78','a')}{visible.b&&arrow(95,125,dynamic.x,dynamic.y,'#d65d45','b')}<path d={`M135 125 A40 40 0 0 0 ${95+40*Math.cos(radians)} ${125-40*Math.sin(radians)}`} fill="none" stroke="#7356a8" strokeWidth="3"/>{visible.result&&['projection-dot','work'].includes(stage)&&<line x1={dynamic.x} y1={dynamic.y} x2={dynamic.x} y2="125" stroke="#7356a8" strokeWidth="3" strokeDasharray="6 4"/>}{visible.result&&['cross-product','torque'].includes(stage)&&arrow(95,125,95,45,'#7356a8','normal')}{visible.result&&stage==='right-hand'&&<g><circle cx="245" cy="82" r="25" fill="#f4efff" stroke="#7356a8" strokeWidth="4"/><circle cx="245" cy="82" r="6" fill="#7356a8"/><text x="245" y="120" textAnchor="middle" fill="#51377d" fontSize="13" fontWeight="800">a × b: out of screen</text><text x="132" y="145" textAnchor="middle" fill="#51377d" fontSize="13" fontWeight="800">curl a toward b</text></g>}</>}
      {stage==='line-motion'&&<><line x1="45" y1="175" x2="270" y2="65" stroke="#087f78" strokeWidth="4"/><circle cx={55+205*progress} cy={170-100*progress} r="8" fill="#d65d45"/></>}
      {['plane-normal','point-plane-distance'].includes(stage)&&<><polygon points="55,165 170,70 275,120 155,210" fill="#70d6cf" opacity=".45"/>{arrow(165,135,165,45,'#d65d45','normal')}{stage==='point-plane-distance'&&<line x1="235" y1="35" x2="180" y2="125" stroke="#7356a8" strokeWidth="4" strokeDasharray="7 4"/>}</>}
      {surface&&<><path d={stage==='missing-variable'?`M70 175 Q120 ${35+30*progress} 170 175 Q220 ${35+30*progress} 270 175`:'M45 175 C80 35 130 35 165 175 C200 315 250 315 285 175'} fill="none" stroke="url(#c12-surface)" strokeWidth="7"/>{visible.trace&&<><line x1={60+210*progress} y1="35" x2={60+210*progress} y2="195" stroke="#e3a629" strokeWidth="4"/><ellipse cx={60+210*progress} cy="125" rx="25" ry={10+25*progress} fill="#e3a62955" stroke="#e3a629"/></>}</>}
    </svg>
    <p>{labels[stage]||'Explore the geometry.'} {stage==='dot-alignment'&&<strong> cos θ = {Math.cos(radians).toFixed(2)}</strong>} {stage==='cross-area'&&<strong> sin θ = {Math.sin(radians).toFixed(2)}</strong>}</p>
  </div>
}
