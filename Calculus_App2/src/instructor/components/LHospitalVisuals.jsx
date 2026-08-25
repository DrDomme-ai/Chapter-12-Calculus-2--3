import { useEffect, useMemo, useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'

const flows={
  decision:['SUBSTITUTE / ANALYZE','ORDINARY VALUE → EVALUATE','0/0 OR ∞/∞ → MAY APPLY','0·∞ OR ∞−∞ → REWRITE','POWER FORM → TAKE LOG','CHECK CONDITIONS'],
  'decision-master':['SUBSTITUTE','NAME THE FORM','REWRITE IF REQUIRED','CHECK CONDITIONS','APPLY IF APPROPRIATE','CHECK THE NEW FORM AGAIN','STOP WHEN ALGEBRA IS EASIER'],
  power:['Set y=f(x)^{g(x)}','Take ln','Rewrite g(x) ln f(x)','Evaluate lim ln y','Exponentiate: lim y=e^L'],
  product:['Recognize 0·∞','L’Hospital cannot act on a product','Rewrite f/(1/g)','Or rewrite g/(1/f)','Choose the simpler quotient','Check for 0/0 or ∞/∞'],
  'product-example':['x→0⁺ and ln x→−∞','Name 0·(−∞)','Rewrite ln x/(1/x)','Name −∞/∞','Differentiate separately','Simplify to −x→0'],
  difference:['Recognize ∞−∞','L’Hospital cannot act on a difference','Common denominator','Rationalize','Or factor dominant behavior','Check the resulting quotient'],
  'difference-example':['sec x−tan x','Write 1/cos x−sin x/cos x','Combine: (1−sin x)/cos x','Rationalize','Simplify to cos x/(1+sin x)','Evaluate →0'],
  cmvt:['Choose a and nearby x','Cauchy MVT produces c between them','Secant ratio equals f′(c)/g′(c)','Use f(a)=g(a)=0','Let x→a, so c→a'],
}

const formulas={
  product:[String.raw`f(x)g(x)`,String.raw`\frac{f(x)}{1/g(x)}`,String.raw`\frac{g(x)}{1/f(x)}`],
  'product-example':[String.raw`x\ln x`,String.raw`\frac{\ln x}{1/x}`,String.raw`\frac{1/x}{-1/x^2}=-x`],
  difference:[String.raw`f(x)-g(x)`,String.raw`\frac{A(x)}{B(x)}`,String.raw`\frac00\text{ or }\frac\infty\infty`],
  'difference-example':[String.raw`\sec x-\tan x`,String.raw`\frac{1-\sin x}{\cos x}`,String.raw`\frac{\cos x}{1+\sin x}`],
  power:[String.raw`y=f(x)^{g(x)}`,String.raw`\ln y=g(x)\ln f(x)`,String.raw`\lim y=e^{\lim\ln y}`],
  cmvt:[String.raw`\frac{f(x)-f(a)}{g(x)-g(a)}`,String.raw`\frac{f'(c)}{g'(c)}`],
}

export default function LHospitalVisuals({stage,revealCount=0}){
  const steps=flows[stage]||[]
  const maxSteps=['three-limits','race'].includes(stage)?3:steps.length
  const initial=Math.min(maxSteps,Math.max(1,Number(revealCount)||1))
  const [visible,setVisible]=useState(initial),[playing,setPlaying]=useState(false)
  const reducedMotion=useMemo(()=>typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,[])
  useEffect(()=>{if(!playing||reducedMotion)return undefined;const timer=setInterval(()=>setVisible(value=>{if(value>=maxSteps){setPlaying(false);return value}return value+1}),900);return()=>clearInterval(timer)},[playing,reducedMotion,maxSteps])
  const reset=()=>{setPlaying(false);setVisible(1)}
  const controls=<div className="lh-animation-controls"><button onClick={()=>setPlaying(true)} disabled={playing||reducedMotion||visible>=maxSteps}>Play</button><button onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button><button onClick={()=>{setPlaying(false);setVisible(value=>Math.max(1,value-1))}}>Previous</button><button onClick={()=>{setPlaying(false);setVisible(value=>Math.min(maxSteps,value+1))}}>Next Step</button><button onClick={reset}>Reset</button>{reducedMotion&&<span>Reduced motion · use step controls</span>}</div>

  if(stage==='three-limits'){
    const cards=[[String.raw`\frac{x}{x}`,String.raw`1`],[String.raw`\frac{x^2}{x}`,String.raw`0`],[String.raw`\frac{x}{x^2}`,String.raw`+\infty\ (x\to0^+)`]]
    const count=Math.min(cards.length,Math.max(1,visible))
    return <div className="lh-visual">{controls}<div className="lh-cards">{cards.slice(0,count).map(([expression,result],index)=><article key={expression}><b>Example {String.fromCharCode(65+index)}</b><MathDisplay>{expression}</MathDisplay><span>substitution form: 0/0</span><MathDisplay>{String.raw`\text{limit}= ${result}`}</MathDisplay></article>)}</div>{count===cards.length&&<strong className="lh-conclusion">SAME FORM · DIFFERENT BEHAVIOR</strong>}</div>
  }
  if(stage==='race')return <div className="lh-visual">{controls}<div className="lh-race-tracks">{[['Numerator wins','∞'],['Denominator wins','0'],['Same growth rate','finite nonzero']].slice(0,Math.min(3,Math.max(1,visible))).map(([label,result],index)=><article key={label}><strong>{label}</strong><div><i className={`runner runner-${index+1}`}/><span>Result: {result}</span></div></article>)}</div><strong className="lh-conclusion">∞/∞ IS INDETERMINATE</strong></div>
  if(steps.length)return <div className={`lh-visual lh-flow lh-stage-${stage}`}>{controls}{formulas[stage]&&<div className="lh-formula-sequence">{formulas[stage].map((formula,index)=><MathDisplay key={formula}>{formula}</MathDisplay>)}</div>}<div className="lh-flow-grid">{steps.map((label,index)=><div className={index<visible?'shown':''} key={`${index}-${label}`}><span>{index+1}</span><strong>{label}</strong></div>)}</div></div>
  return <div className="lh-visual">{controls}<p>Select Next Step to reveal the mathematical transformation.</p></div>
}
