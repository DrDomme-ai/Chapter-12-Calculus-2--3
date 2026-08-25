import { useEffect, useMemo, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'

const path=(fn)=>Array.from({length:121},(_,index)=>{const x=-3+6*index/120,y=Math.max(-4,Math.min(4,fn(x)));return`${index?'L':'M'} ${45+70*(x+3)} ${180-40*y}`}).join(' ')
const descriptions={
  reflection:'Replacing x by −x reflects the exponential graph across the y-axis; it does not make exponential outputs negative.',
  parity:'Even symmetry mirrors across the y-axis; odd symmetry rotates through 180 degrees around the origin.',
  decomposition:'Adding f(x) and f(−x) cancels the odd part and doubles the even part. Subtracting cancels the even part and doubles the odd part.',
  reconstruct:'The pointwise sum cosh x + sinh x reconstructs eˣ; their difference reconstructs e⁻ˣ.',
  series:'Even powers of the exponential series form cosh; odd powers form sinh.',
  'circle-hyperbola':'Circular functions parameterize x²+y²=1; hyperbolic functions parameterize the right branch of x²−y²=1.',
  identity:'Expanding the exponential definitions makes the e²ˣ and e⁻²ˣ terms cancel, leaving 1.',
  sector:'The hyperbolic parameter A is twice the signed hyperbolic-sector area, analogous to θ being twice unit-circle sector area.',
  graphs:'Cosh is even with minimum 1; sinh is odd and crosses the origin.',
  derivatives:'Differentiation swaps sinh and cosh without the circular negative sign.',
  'concept-map':'Definitions, symmetry, series, geometry, identities, calculus, and applications are one connected exponential story.',
}

export default function HyperbolicStoryVisuals({stage='reflection',onContextChange}){
  const [step,setStep]=useState(0),[playing,setPlaying]=useState(false),[value,setValue]=useState(1)
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setStep(current=>(current+1)%6),850);return()=>clearInterval(timer)},[playing])
  useEffect(()=>{const detail={stage,step,value,description:descriptions[stage]};onContextChange?.(detail);window.dispatchEvent(new CustomEvent('hyperbolic-animation-context',{detail}))},[stage,step,value,onContextChange])
  const x=value, point=useMemo(()=>({cosh:Math.cosh(x),sinh:Math.sinh(x)}),[x])
  const reset=()=>{setPlaying(false);setStep(0);setValue(1)}
  const graphs=stage==='reflection'?[[Math.exp,'original'],[v=>Math.exp(-v),'reflected']]:stage==='reconstruct'?[[Math.cosh,'active'],[Math.sinh,'inverse'],[Math.exp,'original']]:[[Math.cosh,'active'],[Math.sinh,'inverse']]
  return <section className={`hyperbolic-story stage-${stage}`}>
    <div className="hyperbolic-story-controls"><button onClick={()=>setPlaying(true)} disabled={playing}>Play</button><button onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button><button onClick={()=>{setPlaying(false);setStep(current=>(current+1)%6)}}>Next step</button><button onClick={reset}>Reset</button><label>x / A <input type="range" min="-2" max="2" step=".05" value={value} onChange={event=>setValue(Number(event.target.value))}/><b>{value.toFixed(2)}</b></label></div>
    {['reflection','reconstruct','graphs','derivatives'].includes(stage)&&<svg viewBox="0 0 510 360" role="img" aria-label={descriptions[stage]}><path className="hy-axis" d="M45 180H475M255 20V340"/>{graphs.slice(0,Math.max(1,Math.ceil((step+1)/2))).map(([fn,name])=><path className={`hy-curve hy-${name}`} d={path(fn)} key={name}/>)}</svg>}
    {stage==='parity'&&<div className="hy-story-pair"><article><strong>Even</strong><MathDisplay>{String.raw`f(-x)=f(x)`}</MathDisplay><span>y-axis symmetry</span></article><article><strong>Odd</strong><MathDisplay>{String.raw`f(-x)=-f(x)`}</MathDisplay><span>origin symmetry</span></article></div>}
    {stage==='decomposition'&&<div className="hy-story-steps"><MathDisplay>{String.raw`f(x)=E(x)+O(x)`}</MathDisplay>{step>0&&<MathDisplay>{String.raw`f(-x)=E(x)-O(x)`}</MathDisplay>}{step>1&&<MathDisplay>{String.raw`E(x)=\frac{f(x)+f(-x)}2`}</MathDisplay>}{step>2&&<MathDisplay>{String.raw`O(x)=\frac{f(x)-f(-x)}2`}</MathDisplay>}<strong>{step>3?'Divide by 2 because the surviving component appeared twice.':'Predict what addition will cancel.'}</strong></div>}
    {stage==='series'&&<div className="hy-story-pair"><article><strong>Even powers</strong><MathDisplay>{String.raw`1+\frac{x^2}{2!}+\frac{x^4}{4!}+\cdots=\cosh x`}</MathDisplay></article><article><strong>Odd powers</strong><MathDisplay>{String.raw`x+\frac{x^3}{3!}+\frac{x^5}{5!}+\cdots=\sinh x`}</MathDisplay></article></div>}
    {['circle-hyperbola','sector'].includes(stage)&&<div className="hy-geometry-split"><svg viewBox="0 0 240 220"><path className="hy-axis" d="M15 110H225M120 10V210"/><circle className="hy-shape" cx="120" cy="110" r="75"/><line className="hy-radius" x1="120" y1="110" x2={120+75*Math.cos(x)} y2={110-75*Math.sin(x)}/></svg><svg viewBox="0 0 240 220"><path className="hy-axis" d="M15 110H225M70 10V210"/><path className="hy-shape" d="M145 15C70 60 70 160 145 205"/><line className="hy-radius" x1="70" y1="110" x2={70+45*point.cosh} y2={110-25*point.sinh}/></svg><MathDisplay>{stage==='sector'?String.raw`A=2(\text{hyperbolic sector area})`:String.raw`(\cos\theta,\sin\theta)\quad\longleftrightarrow\quad(\cosh A,\sinh A)`}</MathDisplay></div>}
    {stage==='identity'&&<div className="hy-story-steps"><MathDisplay>{String.raw`\left(\frac{e^x+e^{-x}}2\right)^2-\left(\frac{e^x-e^{-x}}2\right)^2`}</MathDisplay>{step>1&&<MathDisplay>{String.raw`=\frac{e^{2x}+2+e^{-2x}-(e^{2x}-2+e^{-2x})}{4}`}</MathDisplay>}{step>3&&<MathDisplay>{String.raw`=\frac44=1`}</MathDisplay>}</div>}
    {stage==='concept-map'&&<div className="hy-concept-map"><strong>eˣ</strong><span>even part → cosh</span><span>odd part → sinh</span><span>eˣ = cosh + sinh</span><span>cosh² − sinh² = 1</span><span>unit hyperbola</span><span>derivatives & integrals</span><span>catenaries & models</span></div>}
    <p className="hy-story-caption">{descriptions[stage]}</p>
  </section>
}
