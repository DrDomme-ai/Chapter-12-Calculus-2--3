/* eslint-disable no-useless-escape -- Dynamic labels include LaTeX command strings. */
import { useId, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import { TRIG_TICKS } from '../data/trigMathNotation'

const ORIGIN={x:255,y:190},SCALE=52,GRAPH_LIMIT=3.45
const X=(x)=>ORIGIN.x+x*SCALE,Y=(y)=>ORIGIN.y-y*SCALE
const curve=(fn,min=-3,max=3)=>{
  let drawing=false
  return Array.from({length:181},(_,i)=>{
    const x=min+(max-min)*i/180,y=fn(x),visible=Number.isFinite(y)&&Math.abs(y)<=GRAPH_LIMIT
    if(!visible){drawing=false;return''}
    const command=drawing?'L':'M';drawing=true
    return`${command} ${X(x).toFixed(2)} ${Y(y).toFixed(2)}`
  }).filter(Boolean).join(' ')
}
const graphTicks=TRIG_TICKS.filter(({value})=>Math.abs(value)<=Math.PI)
function TrigTickLabels(){return graphTicks.map((tick)=><foreignObject x={X(tick.value)-30} y={ORIGIN.y} width="60" height="28" key={tick.value}><div xmlns="http://www.w3.org/1999/xhtml" className="svg-math-label"><MathInline>{tick.latex}</MathInline></div></foreignObject>)}
const Point=({point,className})=><circle className={className} cx={X(point[0])} cy={Y(point[1])} r="5"/>

export function InverseTrigExplorer(){
  const [kind,setKind]=useState('sin'),[restricted,setRestricted]=useState(false),id=useId()
  const config={
    sin:{fn:Math.sin,domain:restricted?[-Math.PI/2,Math.PI/2]:[-Math.PI,Math.PI],inverse:Math.asin,label:'arcsin',principal:'[-π/2, π/2]',sourcePoints:[[-Math.PI/2,-1],[Math.PI/2,1]],inversePoints:[[-1,-Math.PI/2],[1,Math.PI/2]]},
    cos:{fn:Math.cos,domain:restricted?[0,Math.PI]:[-Math.PI,Math.PI],inverse:Math.acos,label:'arccos',principal:'[0, π]',sourcePoints:[[0,1],[Math.PI,-1]],inversePoints:[[1,0],[-1,Math.PI]]},
    tan:{fn:Math.tan,domain:[-Math.PI/2+.035,Math.PI/2-.035],inverse:Math.atan,label:'arctan',principal:'(-π/2, π/2)',sourcePoints:[[0,0]],inversePoints:[[0,0]]},
  }[kind]
  const source=curve(config.fn,...config.domain),inverse=curve(config.inverse,kind==='tan'?-3.4:-1,kind==='tan'?3.4:1)
  const chooseKind=(next)=>{setKind(next);setRestricted(true)}
  return <section className="trig-advanced-explorer" aria-labelledby={`${id}-title`} data-function={kind}><header><strong id={`${id}-title`}>Inverse Trig Reflection Explorer</strong><div>{['sin','cos','tan'].map(k=><button type="button" aria-pressed={kind===k} className={kind===k?'active':''} onClick={()=>chooseKind(k)} key={k}>{k}</button>)}</div></header><label><input type="checkbox" checked={restricted} onChange={e=>setRestricted(e.target.checked)}/> Restrict the original function <strong>{restricted?config.principal:'full domain'}</strong></label><svg viewBox="0 0 510 380" role="img" aria-label={`${kind} and ${config.label} reflected across y equals x`}><path className="axis" d={`M35 ${ORIGIN.y}H475M${ORIGIN.x} 10V370`}/><TrigTickLabels/><path className="reflection" data-axis="y=x" d={`M${X(-3.4)} ${Y(-3.4)}L${X(3.4)} ${Y(3.4)}`}/>{kind==='tan'&&restricted&&<><path className="asymptote" data-asymptote="source-left" d={`M${X(-Math.PI/2)} 10V370`}/><path className="asymptote" data-asymptote="source-right" d={`M${X(Math.PI/2)} 10V370`}/><path className="asymptote inverse-asymptote" data-asymptote="inverse-top" d={`M35 ${Y(Math.PI/2)}H475`}/><path className="asymptote inverse-asymptote" data-asymptote="inverse-bottom" d={`M35 ${Y(-Math.PI/2)}H475`}/></>}<path className="source-curve" data-curve={`${kind}-source`} d={source}/>{restricted&&<path className="inverse-curve" data-curve={`${config.label}-inverse`} d={inverse}/>} {restricted&&config.sourcePoints.map((point,index)=><Point point={point} className="mapping-point source-point" key={`source-${index}`}/>)}{restricted&&config.inversePoints.map((point,index)=><Point point={point} className="mapping-point inverse-point" key={`inverse-${index}`}/>)}</svg><MathDisplay>{restricted?`y=${config.label}(x)\text{ is the reflection of restricted }y=${kind}(x)`:`y=${kind}(x)\text{ must pass the Horizontal Line Test first}`}</MathDisplay></section>
}

export function HyperbolicExplorer(){
  const [kind,setKind]=useState('cosh'),[t,setT]=useState(1),id=useId()
  const fn={sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh}[kind]
  const point={x:Math.cosh(t),y:Math.sinh(t)}
  return <section className="trig-advanced-explorer" aria-labelledby={`${id}-title`}><header><strong id={`${id}-title`}>Hyperbolic Function Explorer</strong><div>{['sinh','cosh','tanh'].map(k=><button type="button" className={kind===k?'active':''} onClick={()=>setKind(k)} key={k}>{k}</button>)}</div></header><label>Parameter t = {t.toFixed(2)}<input type="range" min="-2" max="2" step=".05" value={t} onChange={e=>setT(Number(e.target.value))}/></label><svg viewBox="0 0 510 380" role="img" aria-label={`${kind} graph and hyperbola parameter point`}><path className="axis" d={`M35 ${ORIGIN.y}H475M${ORIGIN.x} 10V370`}/><path className="source-curve" d={curve(fn)}/><path className="hyperbola" d={curve(x=>Math.sqrt(1+x*x),-2,2)}/><circle cx={X(Math.min(3,point.x-1))} cy={Y(Math.max(-1.8,Math.min(1.8,point.y/2)))} r="7"/></svg><MathDisplay>{kind==='cosh'?`\cosh^2 t-\sinh^2 t=1`:`${kind}(t)=${fn(t).toFixed(3)}`}</MathDisplay></section>
}
