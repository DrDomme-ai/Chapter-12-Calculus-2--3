/* eslint-disable no-useless-escape -- Dynamic labels include LaTeX command strings. */
import { useId, useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import { TRIG_TICKS } from '../data/trigMathNotation'

const X=(x)=>45+(x+3)*70, Y=(y)=>190-y*90
const curve=(fn,min=-3,max=3)=>Array.from({length:121},(_,i)=>{const x=min+(max-min)*i/120;return`${i?'L':'M'} ${X(x)} ${Y(fn(x))}`}).join(' ')
const graphTicks=TRIG_TICKS.filter(({value})=>Math.abs(value)<=Math.PI/2)
function TrigTickLabels(){return graphTicks.map((tick)=><foreignObject x={X(tick.value)-30} y="190" width="60" height="28" key={tick.value}><div xmlns="http://www.w3.org/1999/xhtml" className="svg-math-label"><MathInline>{tick.latex}</MathInline></div></foreignObject>)}

export function InverseTrigExplorer(){
  const [kind,setKind]=useState('sin'),[restricted,setRestricted]=useState(false),id=useId()
  const config={sin:{fn:Math.sin,domain:restricted?[-Math.PI/2,Math.PI/2]:[-3,3],inverse:Math.asin,label:'arcsin'},cos:{fn:Math.cos,domain:restricted?[0,Math.PI]:[-3,3],inverse:Math.acos,label:'arccos'},tan:{fn:Math.tan,domain:[-1.45,1.45],inverse:Math.atan,label:'arctan'}}[kind]
  const source=curve(config.fn,...config.domain),inverse=curve((x)=>config.inverse(x),kind==='tan'?-3:-1,kind==='tan'?3:1)
  return <section className="trig-advanced-explorer" aria-labelledby={`${id}-title`}><header><strong id={`${id}-title`}>Inverse Trig Reflection Explorer</strong><div>{['sin','cos','tan'].map(k=><button className={kind===k?'active':''} onClick={()=>setKind(k)} key={k}>{k}</button>)}</div></header><label><input type="checkbox" checked={restricted} onChange={e=>setRestricted(e.target.checked)}/> Restrict the original function</label><svg viewBox="0 0 510 380" role="img" aria-label={`${kind} and ${config.label} reflected across y equals x`}><path className="axis" d="M45 190H485M255 15V365"/><TrigTickLabels/><path className="reflection" d="M45 370L485 10"/><path className="source-curve" d={source}/>{restricted&&<path className="inverse-curve" d={inverse}/>}</svg><MathDisplay>{restricted?`y=${config.label}(x)\text{ is the reflection of restricted }y=${kind}(x)`:`y=${kind}(x)\text{ must pass the Horizontal Line Test first}`}</MathDisplay></section>
}

export function HyperbolicExplorer(){
  const [kind,setKind]=useState('cosh'),[t,setT]=useState(1),id=useId()
  const fn={sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh}[kind]
  const point={x:Math.cosh(t),y:Math.sinh(t)}
  return <section className="trig-advanced-explorer" aria-labelledby={`${id}-title`}><header><strong id={`${id}-title`}>Hyperbolic Function Explorer</strong><div>{['sinh','cosh','tanh'].map(k=><button className={kind===k?'active':''} onClick={()=>setKind(k)} key={k}>{k}</button>)}</div></header><label>Parameter t = {t.toFixed(2)}<input type="range" min="-2" max="2" step=".05" value={t} onChange={e=>setT(Number(e.target.value))}/></label><svg viewBox="0 0 510 380" role="img" aria-label={`${kind} graph and hyperbola parameter point`}><path className="axis" d="M45 190H485M255 15V365"/><path className="source-curve" d={curve(fn)}/><path className="hyperbola" d={curve(x=>Math.sqrt(1+x*x),-2,2)}/><circle cx={X(Math.min(3,point.x-1))} cy={Y(Math.max(-1.8,Math.min(1.8,point.y/2)))} r="7"/></svg><MathDisplay>{kind==='cosh'?`\cosh^2 t-\sinh^2 t=1`:`${kind}(t)=${fn(t).toFixed(3)}`}</MathDisplay></section>
}
