import { useState } from 'react'

const W=620,H=280,pad=36
// Stop a curve when it leaves the plot instead of clamping every later value
// to the top edge. Clamping makes unbounded exponential growth look logistic.
const pathFor=(fn,xMin=0,xMax=10,yMax=10)=>{
  let started=false
  return Array.from({length:121},(_,i)=>{
    const x=xMin+(xMax-xMin)*i/120,y=fn(x)
    if(!Number.isFinite(y)||y<0||y>yMax)return''
    const command=started?'L':'M'
    started=true
    return`${command}${pad+(W-2*pad)*i/120},${H-pad-(H-2*pad)*y/yMax}`
  }).join(' ')
}
const Axes=({children,yLabel='amount'})=><svg viewBox={`0 0 ${W} ${H}`} role="img"><path className="gd-axis" d={`M${pad} 12V${H-pad}H${W-12}`}/><text x="8" y="18">{yLabel}</text><text x={W-42} y={H-8}>time</text>{children}</svg>

function Curves({mode}){
  const [k,setK]=useState(.5)
  const rate=mode==='bases'?Math.abs(k):k
  const referenceRates=mode==='bases'?[]:[-.5,-.25,.25,.5].filter((value)=>value!==rate)
  return <div className="gd-viz">
    <Axes>
      {referenceRates.map((value)=><path key={value} className={value>0?'gd-growth':'gd-decay'} opacity=".25" d={pathFor(x=>Math.exp(value*x))}/>)}
      <path className={rate>=0?'gd-growth':'gd-decay'} d={pathFor(x=>Math.exp(rate*x))}/>
      {mode==='bases'&&<path className="gd-decay" d={pathFor(x=>Math.exp(-rate*x))}/>}
      {rate>0&&<text className="gd-growth-label" x="365" y="30">continues upward without bound ↑</text>}
    </Axes>
    <label>{mode==='bases'?'Growth rate':'Proportionality constant'} <input aria-label="Exponential rate k" type="range" min={mode==='bases'?'.05':'-1'} max="1" step=".05" value={k} onChange={e=>setK(Number(e.target.value))}/><strong> k={rate.toFixed(2)}</strong></label>
  </div>
}
function LinearExponential(){const [t,setT]=useState(5);return <div className="gd-viz"><Axes><path className="gd-linear" d={pathFor(x=>1+.55*x)}/><path className="gd-growth" d={pathFor(x=>1.22**x)}/><circle className="gd-dot" cx={pad+(W-2*pad)*t/10} cy={H-pad-(H-2*pad)*Math.min(10,1.22**t)/10} r="6"/></Axes><div className="gd-legend"><span>Linear: 1+0.55t</span><span>Exponential: 1.22ᵗ</span></div><input aria-label="Time" type="range" min="0" max="10" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></div>}
function Applications(){return <div className="gd-card-grid">{[['Population','dP/dt=kP'],['Radioactive material','dm/dt=km'],['Chemical concentration','dc/dt=kc'],['Continuous interest','dA/dt=rA']].map(([name,math])=><article key={name}><strong>{name}</strong><span>{math}</span></article>)}</div>}
function Population(){const [year,setYear]=useState(8),points=[1,1.18,1.42,1.65,2.05,2.38,2.9,3.5,4.15,5];return <div className="gd-viz"><Axes yLabel="population"><path className="gd-growth" d={pathFor(x=>Math.exp(.18*x),0,10,6)}/>{points.map((y,x)=><circle key={x} className="gd-data" cx={pad+(W-2*pad)*x/10} cy={H-pad-(H-2*pad)*y/6} r="4" opacity={x<=year?1:.15}/>)}</Axes><label>Observed window <input type="range" min="1" max="9" value={year} onChange={e=>setYear(Number(e.target.value))}/></label><small>Fit within the observed window; extrapolation assumes conditions continue.</small></div>}
function HalfLife(){const [steps,setSteps]=useState(0),amount=100/2**steps;return <div className="gd-half"><div className="gd-material" style={{width:`${amount}%`}}/><strong>{amount.toFixed(1)}% remains</strong><input aria-label="Half-life intervals" type="range" min="0" max="6" value={steps} onChange={e=>setSteps(Number(e.target.value))}/><span>{steps} half-life interval{steps===1?'':'s'}</span></div>}
function TargetDecay({settings}){const initial=settings.initial||100,halfLife=settings.halfLife||1600,target=settings.target||30,max=halfLife*4,t=-halfLife*Math.log2(target/initial);return <div className="gd-viz"><Axes yLabel="mass"><path className="gd-decay" d={pathFor(x=>initial*2**(-x/halfLife),0,max,initial)}/><path className="gd-target" d={`M${pad},${H-pad-(H-2*pad)*target/initial}H${W-pad}`}/><circle className="gd-dot" cx={pad+(W-2*pad)*t/max} cy={H-pad-(H-2*pad)*target/initial} r="7"/></Axes><strong>Target {target} g reached at t ≈ {Math.round(t)} years</strong></div>}
function LogUnlock(){return <div className="gd-log"><span>e<sup>kt</sup></span><b>apply ln</b><span>ln(e<sup>kt</sup>)</span><b>inverse functions undo</b><span>kt</span></div>}
function Cooling({settings}){const [minutes,setMinutes]=useState(0),surrounding=settings.surrounding??68,initial=settings.initial??180,temp=surrounding+(initial-surrounding)*Math.exp(-.08*minutes);return <div className="gd-cooling"><div className="gd-thermometer"><i style={{height:`${Math.max(4,Math.min(100,temp/2))}%`}}/></div><div><strong>Object: {temp.toFixed(1)}°F</strong><span>Surroundings: {surrounding}°F</span><span>Difference: {(temp-surrounding).toFixed(1)}°F</span><input aria-label="Minutes" type="range" min="0" max="60" value={minutes} onChange={e=>setMinutes(Number(e.target.value))}/><small>{minutes} minutes · rate slows as the difference shrinks</small></div></div>}
function Compounding(){const [n,setN]=useState(1),principal=1000,r=.06,t=10,amount=principal*(1+r/n)**(n*t),continuous=principal*Math.exp(r*t);return <div className="gd-compound"><table><thead><tr><th>Frequency</th><th>Balance</th></tr></thead><tbody>{[1,2,4,12,365].map(periods=><tr className={periods===n?'active':''} key={periods}><td>{({1:'Annual',2:'Semiannual',4:'Quarterly',12:'Monthly',365:'Daily'})[periods]}</td><td>${(principal*(1+r/periods)**(periods*t)).toFixed(2)}</td></tr>)}<tr><td>Continuous</td><td>${continuous.toFixed(2)}</td></tr></tbody></table><label>n={n} <input type="range" min="1" max="365" value={n} onChange={e=>setN(Number(e.target.value))}/></label><strong>Current: ${amount.toFixed(2)}</strong></div>}
function Connections(){return <div className="gd-connections"><strong>dy/dt = ky</strong>{['Population','Radioactive decay','Chemical reactions','Continuous interest'].map(item=><span key={item}>{item}</span>)}<em>d(T−Tₛ)/dt = k(T−Tₛ)</em></div>}

export default function GrowthDecayVisuals({stage,settings={}}){if(stage==='linear-exponential')return <LinearExponential/>;if(stage==='k-curves')return <Curves mode={settings.mode}/>;if(stage==='applications')return <Applications/>;if(stage==='population')return <Population/>;if(stage==='half-life')return <HalfLife/>;if(stage==='target-decay')return <TargetDecay settings={settings}/>;if(stage==='log-unlock')return <LogUnlock/>;if(stage==='cooling')return <Cooling settings={settings}/>;if(stage==='compounding')return <Compounding/>;if(stage==='connections')return <Connections/>;return null}
