import { useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'

function CircleWaveHook() {
  return <div className="circle-wave-hook"><div className="hook-circle"><i/><b>P</b></div><div className="hook-trace"><svg viewBox="0 0 420 180" role="img" aria-label="Sine wave traced by the height of a rotating point"><path d="M5 90 C40 10 75 10 110 90 S180 170 215 90 S285 10 320 90 S390 170 415 90"/><line x1="0" y1="90" x2="420" y2="90"/></svg></div><p>Why does circular motion produce this graph?</p></div>
}

function InverseTrigHook() {
  return <div className="inverse-hook"><MathDisplay>{'\\sin\\theta=\\frac12'}</MathDisplay><div><MathDisplay>{'\\theta=\\frac{\\pi}{6}'}</MathDisplay><MathDisplay>{'\\theta=\\frac{5\\pi}{6}'}</MathDisplay><MathDisplay>{'+\\ 2\\pi k'}</MathDisplay></div><strong>So why does your calculator return only one answer?</strong></div>
}

function CableHook() {
  const [revealed,setRevealed]=useState(false)
  return <div className="cable-hook"><div><article><span>PARABOLA?</span><svg viewBox="0 0 220 110"><path d="M5 5 Q110 205 215 5"/></svg></article><article className={revealed?'correct':''}><span>CATENARY?</span><svg viewBox="0 0 220 110"><path d="M5 5 C45 105 175 105 215 5"/></svg></article></div><button onClick={()=>setRevealed(true)}>Reveal the hanging-cable curve</button>{revealed&&<><strong>CATENARY</strong><MathDisplay>{'y=a\\cosh\\left(\\frac xa\\right)'}</MathDisplay><p>What is cosh?</p></>}</div>
}

export default function LectureHooks({stage}) {
  if(stage==='circle-wave') return <CircleWaveHook/>
  if(stage==='inverse-trig') return <InverseTrigHook/>
  if(stage==='hanging-cable') return <CableHook/>
  return null
}
