import { useMemo, useRef, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'

const COLORS={a:'#1769d2',b:'#17834b',cross:'#d21f65',area:'#f2a51a',angle:'#7447c6'}
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value))
const round=value=>Math.abs(value)<.0005?'0':Number(value.toFixed(2)).toString()
const angleLabel=degrees=>({0:'0',45:'\\frac{\\pi}{4}',90:'\\frac{\\pi}{2}',135:'\\frac{3\\pi}{4}',180:'\\pi'}[degrees]||`${degrees}^\\circ`)

const lessons={
  use:'Use the cross product for normals to planes and surfaces, areas, torque, angular momentum, and orientation in three-dimensional space.',
  instructions:'Drag the diagram to rotate it. Change the angle and magnitudes. Reverse the order and watch the normal flip while its magnitude and the area stay fixed.',
  mistakes:'The cross product is a vector, not a scalar. Use sine, not cosine. Reversing order changes the sign. Parallel vectors produce the zero vector. Protect the negative middle cofactor in determinant expansion.',
}

const exercises=[
  {prompt:'For a=<1,0,0> and b=<0,3,0>, what is a×b?',options:['<0,0,3>','<0,3,0>','3','<0,0,-3>'],answer:0,feedback:'The right-hand rule sends x toward y, so the result is +3k.'},
  {prompt:'If two nonzero vectors are parallel, what is their cross product?',options:['1','The zero vector','Their dot product','A unit normal'],answer:1,feedback:'The angle is 0 or π, so sin θ=0 and the spanned area collapses.'},
  {prompt:'If |a×b|=12, what is the triangle area?',options:['6','12','24','144'],answer:0,feedback:'The cross-product magnitude is the parallelogram area; a diagonal cuts it in half.'},
  {prompt:'If |a|=2, |b|=4, and θ=30°, what is the parallelogram area?',options:['2','4','6','8'],answer:1,feedback:'Area=|a||b|sin θ=(2)(4)(1/2)=4.'},
  {prompt:'How are b×a and a×b related?',options:['Equal','Unrelated','b×a=−(a×b)','One is scalar'],answer:2,feedback:'Reversing the order reverses the normal direction but preserves its magnitude.'},
  {prompt:'Curling the right-hand fingers from +x toward +y makes the thumb point where?',options:['+z','−z','+x','−y'],answer:0,feedback:'The standard axes are right-handed: i×j=k, so the thumb points in the +z direction.'},
  {prompt:'When is torque |r×F| largest for fixed magnitudes?',options:['F parallel to r','F perpendicular to r','At 45°','It is constant'],answer:1,feedback:'The sine factor is largest at 90°, so only the perpendicular force component produces maximum turning.'},
]

function Arrow({from,to,color,label,dashed=false}){
  return <g><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="4" strokeDasharray={dashed?'7 5':undefined} markerEnd="url(#cp-arrow)"/><text x={to.x+7} y={to.y-6} fill={color} fontWeight="900" fontSize="14">{label}</text></g>
}

export default function CrossProductExplorer(){
  const [tab,setTab]=useState('explore'),[theta,setTheta]=useState(45),[aMag,setAMag]=useState(2),[bMag,setBMag]=useState(1),[reversed,setReversed]=useState(false),[yaw,setYaw]=useState(-28),[pitch,setPitch]=useState(24),[exercise,setExercise]=useState(0),[choice,setChoice]=useState(null)
  const drag=useRef(null)
  const radians=theta*Math.PI/180,sine=Math.sin(radians),cosine=Math.cos(radians),magnitude=aMag*bMag*sine,triangle=magnitude/2,sign=reversed?-1:1
  const vectors=useMemo(()=>({a:[aMag,0,0],b:[bMag*cosine,bMag*sine,0],cross:[0,0,sign*magnitude]}),[aMag,bMag,cosine,magnitude,sign,sine])
  const project=([x,y,z])=>{const cy=Math.cos(yaw*Math.PI/180),sy=Math.sin(yaw*Math.PI/180),cp=Math.cos(pitch*Math.PI/180),sp=Math.sin(pitch*Math.PI/180),xr=x*cy-y*sy,yr=x*sy+y*cy;return{x:155+xr*48,y:125-(z*cp-yr*sp)*45}}
  const origin=project([0,0,0]),aEnd=project(vectors.a),bEnd=project(vectors.b),sumEnd=project([vectors.a[0]+vectors.b[0],vectors.a[1]+vectors.b[1],0]),crossEnd=project(vectors.cross)
  const graphPoints=Array.from({length:61},(_,index)=>{const x=index/60*Math.PI;return`${35+index/60*250},${102-75*Math.sin(x)}`}).join(' '),graphX=35+theta/180*250,graphY=102-75*sine
  const startDrag=event=>{drag.current={x:event.clientX,y:event.clientY,yaw,pitch};event.currentTarget.setPointerCapture(event.pointerId)}
  const moveDrag=event=>{if(!drag.current)return;setYaw(drag.current.yaw+(event.clientX-drag.current.x)*.45);setPitch(clamp(drag.current.pitch-(event.clientY-drag.current.y)*.35,-65,65))}
  const currentExercise=exercises[exercise]
  return <section className="cross-product-lab" aria-label="Interactive cross product visualization">
    <header><div><span>Interactive vector laboratory</span><strong>THE CROSS PRODUCT OF TWO VECTORS</strong></div><nav aria-label="Visualization sections">{[['explore','Explore'],['compute','Compute'],['learn','Learn & Practice']].map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}</nav></header>

    {tab==='explore'&&<div className="cp-explore-grid">
      <article className="cp-diagram-card"><div className="cp-card-heading"><strong>Rotate the 3D diagram</strong><small>Drag with a mouse or pointer</small></div><svg viewBox="0 0 320 250" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} role="img" aria-label="Vectors a and b, their parallelogram, and a perpendicular cross-product vector">
        <defs><marker id="cp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker><pattern id="cp-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke={COLORS.area} strokeWidth="2" opacity=".5"/></pattern></defs>
        <path d="M25 205H295M55 225L260 35M155 225V18" stroke="#c7d2d8" strokeWidth="2"/>
        <polygon points={`${origin.x},${origin.y} ${aEnd.x},${aEnd.y} ${sumEnd.x},${sumEnd.y} ${bEnd.x},${bEnd.y}`} fill="url(#cp-hatch)" stroke={COLORS.area} strokeWidth="3" aria-label="Parallelogram area"/>
        <Arrow from={origin} to={aEnd} color={COLORS.a} label="a"/><Arrow from={origin} to={bEnd} color={COLORS.b} label="b"/><Arrow from={origin} to={crossEnd} color={COLORS.cross} label={reversed?'b×a':'a×b'} dashed={reversed}/>
        <path d={`M${origin.x+30},${origin.y} A30,30 0 0 0 ${origin.x+30*Math.cos(radians)},${origin.y-30*Math.sin(radians)}`} fill="none" stroke={COLORS.angle} strokeWidth="4"/><text x={origin.x+36} y={origin.y-18} fill={COLORS.angle} fontWeight="900">θ</text>
        <text x="10" y="20" fill={COLORS.a} fontWeight="800">|a|={round(aMag)}</text><text x="10" y="40" fill={COLORS.b} fontWeight="800">|b|={round(bMag)}</text>
      </svg><div className="cp-legend"><span><i style={{background:COLORS.a}}/>vector a</span><span><i style={{background:COLORS.b}}/>vector b</span><span><i style={{background:COLORS.cross}}/>normal</span><span><i className="hatched"/>area</span></div></article>
      <aside className="cp-controls-card"><strong>Change the vectors</strong><label title="Angle between vectors a and b">Angle θ <output>{theta}°</output><input aria-label="Angle theta" type="range" min="0" max="180" step="1" value={theta} onChange={event=>setTheta(Number(event.target.value))}/></label><label title="Magnitude of vector a">Magnitude |a| <output>{aMag.toFixed(1)}</output><input aria-label="Magnitude of vector a" type="range" min=".5" max="3" step=".1" value={aMag} onChange={event=>setAMag(Number(event.target.value))}/></label><label title="Magnitude of vector b">Magnitude |b| <output>{bMag.toFixed(1)}</output><input aria-label="Magnitude of vector b" type="range" min=".5" max="3" step=".1" value={bMag} onChange={event=>setBMag(Number(event.target.value))}/></label><button className="cp-reverse" onClick={()=>setReversed(value=>!value)}>Reverse the Order</button><MathDisplay>{reversed?String.raw`\mathbf b\times\mathbf a=-(\mathbf a\times\mathbf b)`:String.raw`\mathbf a\times\mathbf b`}</MathDisplay><p><b>Right-hand rule:</b> point along the first vector, curl toward the second, and your thumb follows the {reversed?'reversed ':''}normal.</p></aside>
      <article className="cp-graph-card"><strong>Area as the angle changes</strong><svg viewBox="0 0 310 125" role="img" aria-label="Graph of cross-product magnitude from zero to pi"><path d="M35 10V102H295" fill="none" stroke="#657680" strokeWidth="2"/><polyline points={graphPoints} fill="none" stroke={COLORS.area} strokeWidth="4"/><circle cx={graphX} cy={graphY} r="6" fill={COLORS.cross}/>{[[0,'0'],[.25,'π/4'],[.5,'π/2'],[.75,'3π/4'],[1,'π']].map(([fraction,label])=><text x={35+fraction*250} y="119" textAnchor="middle" fontSize="11" key={label}>{label}</text>)}</svg><p>Parallel → zero. Perpendicular → maximum. The magnitude is the area spanned by the vectors.</p></article>
      <article className="cp-area-card"><MathDisplay>{String.raw`\|\mathbf a\times\mathbf b\|=\|\mathbf a\|\|\mathbf b\|\sin\theta`}</MathDisplay><MathDisplay>{String.raw`${aMag.toFixed(1)}(${bMag.toFixed(1)})\sin(${angleLabel(theta)})=${round(magnitude)}`}</MathDisplay><div><span>Parallelogram area <b>{round(magnitude)}</b></span><span>Triangle area <b>{round(triangle)}</b></span></div></article>
    </div>}

    {tab==='compute'&&<div className="cp-compute-grid">
      <article><strong>Component computation</strong>
        <MathDisplay>{String.raw`\mathbf a\times\mathbf b=\langle a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1\rangle`}</MathDisplay>
        <MathDisplay>{String.raw`\mathbf a=\langle${round(aMag)},0,0\rangle,\quad\mathbf b=\langle${round(bMag*cosine)},${round(bMag*sine)},0\rangle`}</MathDisplay>
        <MathDisplay>{String.raw`\mathbf a\times\mathbf b=\langle0,0,${round(magnitude)}\rangle`}</MathDisplay>
        <div className="cp-checks"><span>✓ <MathInline>{String.raw`\mathbf a\cdot(\mathbf a\times\mathbf b)=0`}</MathInline></span><span>✓ <MathInline>{String.raw`\mathbf b\cdot(\mathbf a\times\mathbf b)=0`}</MathInline></span></div>
        <p>Both zero dot products verify that the cross-product vector is perpendicular to both original vectors.</p>
      </article>
      <article><strong>Worked example</strong>
        <MathDisplay>{String.raw`\mathbf a=\langle1,2,3\rangle,\quad\mathbf b=\langle4,5,6\rangle`}</MathDisplay>
        <MathDisplay>{String.raw`\mathbf a\times\mathbf b=\begin{array}{|ccc|}\mathbf i&\mathbf j&\mathbf k\\1&2&3\\4&5&6\end{array}`}</MathDisplay>
        <MathDisplay>{String.raw`\begin{aligned}\mathbf a\times\mathbf b&=\langle2(6)-3(5),\;3(4)-1(6),\;1(5)-2(4)\rangle\\&=\langle-3,6,-3\rangle\end{aligned}`}</MathDisplay>
        <p>The middle determinant cofactor carries a negative sign; the component formula above already incorporates it.</p>
        <MathDisplay>{String.raw`\langle1,2,3\rangle\cdot\langle-3,6,-3\rangle=0`}</MathDisplay><MathDisplay>{String.raw`\langle4,5,6\rangle\cdot\langle-3,6,-3\rangle=0`}</MathDisplay>
      </article>
      <article className="cp-torque"><strong>Application: torque</strong><svg viewBox="0 0 300 120" role="img" aria-label="Wrench and perpendicular force creating torque"><circle cx="45" cy="70" r="13" fill="#334b59"/><rect x="45" y="62" width="170" height="16" rx="8" fill="#9aa8ad"/><line x1="205" y1="65" x2="205" y2="18" stroke={COLORS.b} strokeWidth="6" markerEnd="url(#cp-arrow)"/><path d="M65 96A55 55 0 0 0 105 108" fill="none" stroke={COLORS.cross} strokeWidth="5" markerEnd="url(#cp-arrow)"/><text x="210" y="25" fill={COLORS.b} fontWeight="900">F⊥</text><text x="110" y="94" fontWeight="900">r</text></svg><MathDisplay>{String.raw`\boldsymbol\tau=\mathbf r\times\mathbf F`}</MathDisplay><p>The farther from the pivot and the more perpendicular the force, the greater the torque.</p></article>
    </div>}

    {tab==='learn'&&<div className="cp-learn-grid"><article><details open><summary>Concept</summary><p>You will learn how to compute a cross product, determine its direction using the right-hand rule, and interpret its magnitude as an area.</p><ul><li>a×b is a vector.</li><li>It is perpendicular to the plane of a and b.</li><li>Its magnitude is parallelogram area.</li><li>Direction depends on order.</li><li>Parallel vectors give the zero vector.</li></ul></details><details><summary>When Would I Use This?</summary><p>{lessons.use}</p></details><details><summary>Instructions</summary><p>{lessons.instructions}</p></details><details><summary>Worked Example</summary><p>Open the Compute tab for the complete component calculation and two orthogonality checks.</p></details><details><summary>Common Mistakes</summary><p>{lessons.mistakes}</p></details></article><article className="cp-exercise"><strong>Exercises with feedback · {exercise+1}/{exercises.length}</strong><p>{currentExercise.prompt}</p>{currentExercise.options.map((option,index)=><button className={choice===index?'selected':''} onClick={()=>setChoice(index)} key={option}>{String.fromCharCode(65+index)}. {option}</button>)}{choice!=null&&<div className={choice===currentExercise.answer?'correct':'incorrect'}><b>{choice===currentExercise.answer?'Correct.':'Not yet.'}</b> {currentExercise.feedback}</div>}<footer><button disabled={exercise===0} onClick={()=>{setExercise(value=>value-1);setChoice(null)}}>Previous</button><button disabled={exercise===exercises.length-1} onClick={()=>{setExercise(value=>value+1);setChoice(null)}}>Next</button></footer></article></div>}
  </section>
}
