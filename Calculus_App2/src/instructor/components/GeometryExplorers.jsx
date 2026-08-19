import { useId, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import '../styles/geometry-explorers.css'

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value))
const sx=(x)=>160+x*28
const sy=(y)=>115-y*28

function ArrowDefs(){
  return <defs><marker id="geometry-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
}

function ExplorerShell({label,math,children,controls}){
  return <section className="geometry-explorer" aria-label={label}>
    <header><span>Interactive geometry</span><strong>{label}</strong></header>
    <div className="geometry-explorer-canvas">{children}</div>
    {math&&<MathDisplay>{math}</MathDisplay>}
    {controls&&<div className="geometry-explorer-controls">{controls}</div>}
  </section>
}

function CoordinateGrid({children,label='Coordinate plane'}){
  return <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label={label}>
    <defs><pattern id="geometry-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeOpacity=".11"/></pattern></defs><ArrowDefs/>
    <rect width="320" height="230" fill="url(#geometry-grid)"/>
    <line x1="12" y1="115" x2="308" y2="115" className="geometry-axis" markerEnd="url(#geometry-arrow)"/>
    <line x1="160" y1="218" x2="160" y2="12" className="geometry-axis" markerEnd="url(#geometry-arrow)"/>
    <text x="300" y="108">x</text><text x="168" y="20">y</text>
    {children}
  </svg>
}

function SphericalTriangle({revealCount=0,openingPrediction=false}){
  const [revealed,setRevealed]=useState(!openingPrediction||revealCount>0)
  const show=revealed||revealCount>0
  const gradient=useId().replaceAll(':','')
  return <ExplorerShell label={show?'A triangle on a sphere':'Test the familiar picture first'} math={show?String.raw`90^\circ+90^\circ+90^\circ=270^\circ`:String.raw`90^\circ+90^\circ+90^\circ\ ?`} controls={!openingPrediction&&<button type="button" onClick={()=>setRevealed((value)=>!value)}>{show?'Hide conclusion':'Reveal spherical triangle'}</button>}>
    <svg className="geometry-svg sphere-svg" viewBox="0 0 320 230" role="img" aria-label={show?'Spherical triangle with vertices at the North Pole and two points on the equator':'Ordinary plane triangle used to test whether three right angles seem possible'}>
      {show?<><defs><radialGradient id={gradient} cx="35%" cy="28%"><stop offset="0" stopColor="#dffff8"/><stop offset=".7" stopColor="#75ddd4"/><stop offset="1" stopColor="#167269"/></radialGradient></defs>
        <circle cx="160" cy="116" r="92" fill={`url(#${gradient})`} className="sphere-body"/>
        <ellipse cx="160" cy="116" rx="92" ry="25" className="sphere-equator"/>
        <path d="M160 24 Q92 72 76 116" className="sphere-geodesic"/>
        <path d="M160 24 Q228 72 244 116" className="sphere-geodesic"/>
        <path d="M76 116 Q160 141 244 116" className="sphere-geodesic"/>
        {[[160,24,'N'],[76,116,'A'],[244,116,'B']].map(([x,y,name])=><g key={name}><circle cx={x} cy={y} r="5" className="geometry-point"/><text x={x+(name==='A'?-18:10)} y={y+(name==='N'?-7:18)}>{name}</text></g>)}
        <g className="right-angle-marks"><path d="M151 36h10v10"/><path d="M86 108v10h10"/><path d="M224 118h10v-10"/><text x="132" y="66">90°</text><text x="87" y="145">90°</text><text x="207" y="145">90°</text></g></>:<><polygon points="55,180 265,180 174,52" className="geometry-triangle"/><path d="M55 180h18v-18" className="right-angle-mark"/><text x="75" y="160">90°</text><text x="232" y="165">90°?</text><text x="166" y="82">90°?</text></>}
    </svg>
  </ExplorerShell>
}

function PrimitivesExplorer(){
  const [kind,setKind]=useState('point')
  const definitions={point:'A location with no length, width, or thickness.',line:'Extends forever in two opposite directions.',segment:'The part of a line between two endpoints.',ray:'Begins at one endpoint and extends forever.'}
  return <ExplorerShell label="Point, line, segment, and ray" controls={<div role="group" aria-label="Choose a geometric object">{Object.keys(definitions).map((name)=><button type="button" className={kind===name?'active':''} onClick={()=>setKind(name)} key={name}>{name}</button>)}</div>}>
    <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label={`${kind}: ${definitions[kind]}`}>
      <ArrowDefs/>
      {kind==='point'&&<><circle cx="160" cy="110" r="7" className="geometry-point"/><text x="175" y="105">P</text></>}
      {kind==='line'&&<><line x1="35" y1="150" x2="285" y2="70" className="geometry-main-line" markerStart="url(#geometry-arrow)" markerEnd="url(#geometry-arrow)"/><text x="146" y="92">ℓ</text></>}
      {kind==='segment'&&<><line x1="65" y1="155" x2="255" y2="75" className="geometry-main-line"/><circle cx="65" cy="155" r="6" className="geometry-point"/><circle cx="255" cy="75" r="6" className="geometry-point"/><text x="47" y="177">A</text><text x="263" y="70">B</text></>}
      {kind==='ray'&&<><line x1="65" y1="155" x2="275" y2="66" className="geometry-main-line" markerEnd="url(#geometry-arrow)"/><circle cx="65" cy="155" r="6" className="geometry-point"/><text x="48" y="178">A</text></>}
      <text className="geometry-caption" x="160" y="210" textAnchor="middle">{definitions[kind]}</text>
    </svg>
  </ExplorerShell>
}

function RotatingAngle(){
  const [angle,setAngle]=useState(60)
  const radians=angle*Math.PI/180,x=160+92*Math.cos(radians),y=155-92*Math.sin(radians)
  const name=angle<90?'acute':angle===90?'right':angle<180?'obtuse':'straight'
  return <ExplorerShell label="Angle as rotation" math={String.raw`\theta=${angle}^\circ\quad\text{(${name})}`} controls={<label>Angle <input type="range" min="0" max="180" step="5" value={angle} onChange={(event)=>setAngle(Number(event.target.value))}/><output>{angle}°</output></label>}>
    <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label={`${angle} degree ${name} angle`}>
      <ArrowDefs/>
      <line x1="160" y1="155" x2="275" y2="155" className="geometry-ray" markerEnd="url(#geometry-arrow)"/>
      <line x1="160" y1="155" x2={x} y2={y} className="geometry-ray accent" markerEnd="url(#geometry-arrow)"/>
      <path d={`M198 155 A38 38 0 0 0 ${160+38*Math.cos(radians)} ${155-38*Math.sin(radians)}`} className="geometry-angle-arc"/>
      <circle cx="160" cy="155" r="5" className="geometry-point"/><text x="202" y="139">θ</text>
    </svg>
  </ExplorerShell>
}

function GeometryJoke(){
  const [punchline,setPunchline]=useState(false)
  return <ExplorerShell label="A parallel-lines interlude" controls={<button type="button" onClick={()=>setPunchline(true)} disabled={punchline}>{punchline?'Punchline revealed':'Reveal the punchline'}</button>}>
    <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label="Two parallel lines that never meet">
      <line x1="35" y1="70" x2="285" y2="120" className="geometry-main-line"/><line x1="35" y1="130" x2="285" y2="180" className="geometry-main-line accent"/>
      <text x="55" y="53">We have so much in common…</text>
      {punchline&&<text className="geometry-caption" x="160" y="215" textAnchor="middle">It is a shame we will never meet.</text>}
    </svg>
  </ExplorerShell>
}

function LineRelationships(){
  const [mode,setMode]=useState('parallel')
  return <ExplorerShell label="Line relationships" math={mode==='parallel'?String.raw`\ell_1\parallel\ell_2`:String.raw`\ell_1\perp\ell_2`} controls={<div role="group" aria-label="Choose a line relationship"><button className={mode==='parallel'?'active':''} onClick={()=>setMode('parallel')}>Parallel</button><button className={mode==='perpendicular'?'active':''} onClick={()=>setMode('perpendicular')}>Perpendicular</button></div>}>
    <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label={`${mode} lines`}>
      {mode==='parallel'?<><line x1="45" y1="70" x2="275" y2="125" className="geometry-main-line"/><line x1="45" y1="125" x2="275" y2="180" className="geometry-main-line accent"/><path d="M145 94l8-6M151 150l8-6" className="geometry-tick"/></>:<><line x1="55" y1="175" x2="265" y2="55" className="geometry-main-line"/><line x1="65" y1="55" x2="255" y2="185" className="geometry-main-line accent"/><path d="M151 109l13-8 8 13" className="right-angle-mark"/></>}
    </svg>
  </ExplorerShell>
}

function DistanceMidpoint(){
  const [x2,setX2]=useState(4),[y2,setY2]=useState(3),x1=-3,y1=-2
  const distance=Math.hypot(x2-x1,y2-y1),mx=(x1+x2)/2,my=(y1+y2)/2
  return <ExplorerShell label="Distance and midpoint" math={String.raw`d\approx ${distance.toFixed(2)},\qquad M=\left(${mx},${my}\right)`} controls={<><label>x₂<input type="range" min="-1" max="5" value={x2} onChange={(event)=>setX2(Number(event.target.value))}/></label><label>y₂<input type="range" min="-3" max="3" value={y2} onChange={(event)=>setY2(Number(event.target.value))}/></label></>}>
    <CoordinateGrid label={`Points A negative 3 negative 2 and B ${x2} ${y2}, with their midpoint`}><line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} className="geometry-main-line"/><circle cx={sx(x1)} cy={sy(y1)} r="6" className="geometry-point"/><circle cx={sx(x2)} cy={sy(y2)} r="6" className="geometry-point accent-fill"/><circle cx={sx(mx)} cy={sy(my)} r="5" className="geometry-midpoint"/><text x={sx(x1)-18} y={sy(y1)+18}>A</text><text x={sx(x2)+8} y={sy(y2)-8}>B</text><text x={sx(mx)+8} y={sy(my)-8}>M</text></CoordinateGrid>
  </ExplorerShell>
}

function TriangleExplorer(){
  const [apex,setApex]=useState(160)
  const left=55,right=270,base=180,height=55
  const a=Math.hypot(apex-left,base-height),b=Math.hypot(right-apex,base-height),c=right-left
  const angleA=Math.acos(clamp((b*b+c*c-a*a)/(2*b*c),-1,1))*180/Math.PI
  const angleB=Math.acos(clamp((a*a+c*c-b*b)/(2*a*c),-1,1))*180/Math.PI
  const angleC=180-angleA-angleB
  return <ExplorerShell label="Triangle relationships" math={String.raw`${angleA.toFixed(0)}^\circ+${angleB.toFixed(0)}^\circ+${angleC.toFixed(0)}^\circ=180^\circ`} controls={<label>Move the apex<input type="range" min="90" max="235" value={apex} onChange={(event)=>setApex(Number(event.target.value))}/></label>}>
    <svg className="geometry-svg" viewBox="0 0 320 230" role="img" aria-label="Adjustable triangle showing its three interior angles"><polygon points={`${left},${base} ${right},${base} ${apex},${height}`} className="geometry-triangle"/><circle cx={left} cy={base} r="5" className="geometry-point"/><circle cx={right} cy={base} r="5" className="geometry-point"/><circle cx={apex} cy={height} r="5" className="geometry-point accent-fill"/><text x={left-18} y={base+20}>A</text><text x={right+8} y={base+20}>B</text><text x={apex} y={height-12}>C</text></svg>
  </ExplorerShell>
}

function CircleExplorer(){
  const [radius,setRadius]=useState(3),[h,setH]=useState(1),k=-1
  const cx=sx(h),cy=sy(k),r=radius*20
  return <ExplorerShell label="Circle: fixed distance from a center" math={String.raw`(x${h<0?'+':'-'}${Math.abs(h)})^2+(y${k<0?'+':'-'}${Math.abs(k)})^2=${radius**2}`} controls={<><label>Radius<input type="range" min="1" max="4" value={radius} onChange={(event)=>setRadius(Number(event.target.value))}/></label><label>Center x<input type="range" min="-2" max="2" value={h} onChange={(event)=>setH(Number(event.target.value))}/></label></>}>
    <CoordinateGrid label={`Circle centered at ${h}, ${k} with radius ${radius}`}><circle cx={cx} cy={cy} r={r} className="geometry-circle"/><circle cx={cx} cy={cy} r="6" className="geometry-point"/><line x1={cx} y1={cy} x2={cx+r} y2={cy} className="geometry-radius"/><text x={cx+8} y={cy-8}>C</text><text x={cx+r/2} y={cy-8}>r</text></CoordinateGrid>
  </ExplorerShell>
}

function SlopeExplorer(){
  const [run,setRun]=useState(4),[rise,setRise]=useState(3),x1=-3,y1=-2,x2=x1+run,y2=y1+rise
  return <ExplorerShell label="Slope as rise over run" math={String.raw`m=\frac{\Delta y}{\Delta x}=\frac{${rise}}{${run}}=${(rise/run).toFixed(2)}`} controls={<><label>Rise<input type="range" min="-4" max="4" value={rise} onChange={(event)=>setRise(Number(event.target.value))}/></label><label>Run<input type="range" min="1" max="6" value={run} onChange={(event)=>setRun(Number(event.target.value))}/></label></>}>
    <CoordinateGrid label={`Line with rise ${rise} and run ${run}`}><line x1={sx(-5)} y1={sy(y1+(-5-x1)*rise/run)} x2={sx(5)} y2={sy(y1+(5-x1)*rise/run)} className="geometry-main-line"/><path d={`M${sx(x1)} ${sy(y1)}H${sx(x2)}V${sy(y2)}`} className="slope-steps"/><circle cx={sx(x1)} cy={sy(y1)} r="5" className="geometry-point"/><circle cx={sx(x2)} cy={sy(y2)} r="5" className="geometry-point accent-fill"/><text x={(sx(x1)+sx(x2))/2} y={sy(y1)+17}>run {run}</text><text x={sx(x2)+7} y={(sy(y1)+sy(y2))/2}>rise {rise}</text></CoordinateGrid>
  </ExplorerShell>
}

function CoordinatePythagorean(){
  const [x,setX]=useState(4),[y,setY]=useState(3),distance=Math.hypot(x,y)
  return <ExplorerShell label="Coordinate geometry and Pythagoras" math={String.raw`${x}^2+${y}^2=${distance.toFixed(2)}^2`} controls={<><label>x<input type="range" min="1" max="5" value={x} onChange={(event)=>setX(Number(event.target.value))}/></label><label>y<input type="range" min="1" max="3" value={y} onChange={(event)=>setY(Number(event.target.value))}/></label></>}>
    <CoordinateGrid label={`Right triangle with horizontal leg ${x}, vertical leg ${y}, and hypotenuse ${distance.toFixed(2)}`}><path d={`M${sx(0)} ${sy(0)}H${sx(x)}V${sy(y)}Z`} className="geometry-right-triangle"/><path d={`M${sx(x)-13} ${sy(0)}v-13h13`} className="right-angle-mark"/><text x={(sx(0)+sx(x))/2} y={sy(0)+18}>{x}</text><text x={sx(x)+8} y={(sy(0)+sy(y))/2}>{y}</text><text x={(sx(0)+sx(x))/2-8} y={(sy(0)+sy(y))/2-8}>d</text></CoordinateGrid>
  </ExplorerShell>
}

export default function GeometryExplorers({stage='primitives',revealCount=0,slideId}){
  const components={
    'spherical-triangle':SphericalTriangle,
    primitives:PrimitivesExplorer,
    'rotating-angle':RotatingAngle,
    'geometry-joke':GeometryJoke,
    'line-relationships':LineRelationships,
    'distance-midpoint':DistanceMidpoint,
    triangle:TriangleExplorer,
    circle:CircleExplorer,
    slope:SlopeExplorer,
    'coordinate-pythagorean':CoordinatePythagorean,
  }
  const Component=components[stage]||PrimitivesExplorer
  return <Component revealCount={revealCount} openingPrediction={slideId==='geo-spherical-prediction'}/>
}

export { GeometryExplorers }
