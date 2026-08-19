import { useState } from 'react'
import { MathDisplay, MathInline } from '../../components/MathDisplay'

const naturals = [1,2,3,4,5,6,7,8,9]
const integers = [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9]
const rationals = ['−7/3','−3/2','−2/3','−1/2','0','1/10','1/2','2/3','1','5/4','3/2','2','3']

function Objects({ values, active = [], dense = false, continuous = false }) {
  return <div className={`number-objects${dense?' is-dense':''}${continuous?' becomes-line':''}`} aria-label="Displayed number objects">{values.map((value,index)=><span className={active.map(String).includes(String(value))?'active':''} style={{'--object-index':index}} key={`${value}-${index}`}>{value}</span>)}</div>
}

function Select({ label, value, onChange, values }) { return <label>{label}<select value={value} onChange={(e)=>onChange(Number(e.target.value))}>{values.map((item)=><option key={item}>{item}</option>)}</select></label> }

function NaturalExplorer() {
  const [a,setA]=useState(2),[b,setB]=useState(3); const result=a+b
  return <div className="operation-explorer"><div><Select label="Choose a" value={a} onChange={setA} values={[1,2,3,4]}/><Select label="Choose b" value={b} onChange={setB} values={[1,2,3,4,5]}/></div><Objects values={naturals} active={[a,b,result]}/><MathDisplay>{`${a}+${b}=${result}`}</MathDisplay><strong>The result is still in ℕ.</strong><div className="discovered-property"><span>Closure under addition</span><MathDisplay>{'a,b\\in\\mathbb N\\Longrightarrow a+b\\in\\mathbb N'}</MathDisplay></div></div>
}

function IntegerExplorer() {
  const [a,setA]=useState(2),[b,setB]=useState(5),[inverse,setInverse]=useState(3); const result=a-b
  return <div className="operation-explorer compact"><div><Select label="a" value={a} onChange={setA} values={[-3,-2,-1,0,1,2,3,4,5]}/><Select label="b" value={b} onChange={setB} values={[-3,-2,-1,0,1,2,3,4,5]}/><Select label="inverse demo" value={inverse} onChange={setInverse} values={[1,2,3,4,5]}/></div><Objects values={integers} active={[a,b,result,inverse,-inverse,0]}/><div className="equation-pair"><MathDisplay>{`${a}-${b}=${a}+(${-b})=${result}`}</MathDisplay><MathDisplay>{`${inverse}+(${-inverse})=0`}</MathDisplay></div><strong>The result is still in ℤ. Every integer a has additive inverse −a.</strong></div>
}

function MultiplicationNeed() {
  const [example,setExample]=useState('3,-2'); const [a,b]=example.split(',').map(Number)
  return <div className="operation-explorer"><div className="example-buttons"><button onClick={()=>setExample('3,-2')}>3 × (−2)</button><button onClick={()=>setExample('-4,-2')}>−4 × (−2)</button></div><Objects values={integers} active={[a,b,a*b]}/><MathDisplay>{`${a}\\times(${b})=${a*b}\\in\\mathbb Z`}</MathDisplay><div className="need-card"><span>But does every nonzero integer have an inverse in ℤ?</span><MathDisplay>{'2\\cdot\\frac12=1\\qquad\\frac12\\notin\\mathbb Z'}</MathDisplay><strong>We need to enlarge the set.</strong></div></div>
}

function RationalInverse() {
  const [choice,setChoice]=useState('2/3'); const reciprocal={'2/3':'3/2','-4/5':'-5/4','3':'1/3'}[choice]
  return <div className="operation-explorer"><div className="example-buttons">{['2/3','-4/5','3'].map((value)=><button className={choice===value?'active':''} onClick={()=>setChoice(value)} key={value}>{value}</button>)}</div><Objects values={rationals} active={[choice,reciprocal]}/><MathDisplay>{`\\left(${choice}\\right)\\left(${reciprocal}\\right)=1`}</MathDisplay><strong>Every nonzero rational has a rational multiplicative inverse.</strong><p className="accuracy-note">ℚ is already a field.</p></div>
}

function Density() { const [zoom,setZoom]=useState(1); const values=zoom===1?['0','1/2','1']:zoom===2?['0','1/4','1/2','3/4','1']:['0','1/10','2/10','3/10','4/10','1/2','6/10','7/10','8/10','9/10','1']; return <div className="density-story"><Objects values={values} dense/><button onClick={()=>setZoom((z)=>z===3?1:z+1)}>Zoom and add rational points</button><p>Between any two distinct real numbers, we can find a rational number.</p><strong>Dense does not mean complete.</strong></div> }

function Approximation() { const [step,setStep]=useState(0); const values=['1','1.4','1.41','1.414','1.4142','1.41421']; return <div className="approximation-story"><div>{values.map((value,index)=><span className={index<=step?'visible':''} key={value}>{value}</span>)}<strong className={step===values.length-1?'visible':''}>→ √2</strong></div><button onClick={()=>setStep((value)=>Math.min(value+1,values.length-1))}>Next approximation</button><button onClick={()=>setStep(0)}>Reset</button><p>Every displayed finite decimal is rational. The exact limiting value √2 is not.</p></div> }

function Irrationals() { return <div className="irrational-story"><Objects values={['√2 ≈ 1.414…','√3 ≈ 1.732…','e ≈ 2.718…','π ≈ 3.142…']}/><MathDisplay>{'\\sqrt2,\\sqrt3,e,\\pi\\notin\\mathbb Q'}</MathDisplay><p>Irrational numbers cannot be written as p/q with integers p, q and q ≠ 0—but they are real.</p></div> }

function RealLineReveal() { const [complete,setComplete]=useState(false); const points=['−2','−3/2','−1','−1/2','0','1/2','1','√2','3/2','√3','2','e','3','π']; return <div className="real-line-story"><Objects values={points} dense continuous={complete}/><button onClick={()=>setComplete(true)} disabled={complete}>Combine rational + irrational numbers</button><button onClick={()=>setComplete(false)}>Reset animation</button>{complete&&<div className="real-line-label"><strong>The real number line</strong><MathDisplay>{'\\mathbb R=\\mathbb Q\\cup\\{\\text{irrational numbers}\\}'}</MathDisplay><MathDisplay>{'\\mathbb N\\subset\\mathbb Z\\subset\\mathbb Q\\subset\\mathbb R'}</MathDisplay></div>}</div> }

function OpeningChallenges() {
  return <div className="opening-challenges"><p>Are the numbers we currently have enough?</p><div><MathDisplay>{'2-5=\\ ?'}</MathDisplay><MathDisplay>{'1\\div2=\\ ?'}</MathDisplay><MathDisplay>{'x^2=2'}</MathDisplay></div></div>
}

function SquareRootMystery({ revealCount = 0 }) {
  const [localStep, setLocalStep] = useState(0)
  const activeStep = Math.max(Math.min(revealCount, 2), localStep)

  const revealNext = () => setLocalStep((current) => Math.min(2, Math.max(current, revealCount) + 1))
  const toggleCompleteProof = () => setLocalStep((current) => (activeStep >= 2 && revealCount < 2 ? 1 : Math.max(current, 2)))

  return (
    <div className="sqrt-mystery">
      <div
        className="unit-square"
        role="img"
        aria-label="A one by one square with diagonal d from the top-left vertex, coordinate zero comma one, to the bottom-right vertex, coordinate one comma zero."
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line className="unit-square-diagonal" x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="unit-square-side unit-square-side-left">1</span>
        <span className="unit-square-side unit-square-side-bottom">1</span>
        <strong className="unit-square-diagonal-label">d</strong>
      </div>

      <div className="sqrt-reveal" aria-live="polite">
        {activeStep === 0 && (
          <div className="sqrt-proof-prompt">
            <strong>How long is the diagonal?</strong>
            <MathDisplay>{'d=\\ ?'}</MathDisplay>
          </div>
        )}

        {activeStep === 1 && (
          <section className="sqrt-proof-stage" aria-labelledby="sqrt2-step-one-title">
            <span>STEP 1</span>
            <h3 id="sqrt2-step-one-title">Find the diagonal length</h3>
            <p>Apply the Pythagorean theorem and use the positive root because <MathInline>{'d>0'}</MathInline>.</p>
            <MathDisplay>{'1^2+1^2=d^2\\Longrightarrow d^2=2\\Longrightarrow d=\\sqrt2'}</MathDisplay>
          </section>
        )}

        {activeStep >= 2 && (
          <section className="sqrt-proof-stage sqrt-proof-stage-contradiction" id="sqrt2-irrational-proof" aria-labelledby="sqrt2-step-two-title">
            <span>STEP 2</span>
            <h3 id="sqrt2-step-two-title">Prove the length is irrational</h3>
            <div className="sqrt-proof-contradiction-body">
              <p>
                Assume <MathInline>{'\\sqrt2=\\frac ab'}</MathInline> in lowest terms, so <MathInline>{'a,b\\in\\mathbb Z'}</MathInline>, <MathInline>{'b\\ne0'}</MathInline>, and <MathInline>{'\\gcd(a,b)=1'}</MathInline>.
              </p>
              <div className="discrete-solution-math">
                <MathDisplay>{'a^2=2b^2\\Longrightarrow a\\text{ is even},\\quad a=2k'}</MathDisplay>
                <MathDisplay>{'4k^2=2b^2\\Longrightarrow b^2=2k^2\\Longrightarrow b\\text{ is even}'}</MathDisplay>
              </div>
              <p>
                Thus 2 divides both <MathInline>{'a'}</MathInline> and <MathInline>{'b'}</MathInline>, contradicting the assumption that <MathInline>{'\\frac ab'}</MathInline> has no common factor.
              </p>
            </div>
            <MathDisplay>{'\\boxed{d=\\sqrt2\\notin\\mathbb Q}'}</MathDisplay>
          </section>
        )}

        {revealCount === 0 && (
          <div className="sqrt-proof-controls">
            <button type="button" onClick={revealNext} disabled={activeStep >= 2}>Reveal next proof step</button>
            <button
              type="button"
              className="proof-toggle"
              aria-expanded={activeStep >= 2}
              aria-controls="sqrt2-irrational-proof"
              onClick={toggleCompleteProof}
            >
              {activeStep >= 2 ? 'Hide complete proof' : 'Show complete proof'}
            </button>
            <button type="button" onClick={() => setLocalStep(0)}>Reset</button>
          </div>
        )}
      </div>
    </div>
  )
}

function FieldCompleteness() {
  return <div className="field-completeness"><div className="concept-columns"><article><h3>FIELD</h3><p>The usual arithmetic operations behave consistently.</p><div className="operation-checks"><span>ADD ✓</span><span>SUBTRACT ✓</span><span>MULTIPLY ✓</span><span>DIVIDE BY NONZERO ✓</span></div><MathDisplay>{'a,b\\in F\\Longrightarrow a+b,ab\\in F'}</MathDisplay><MathDisplay>{'a+(-a)=0\\qquad a\\ne0\\Longrightarrow aa^{-1}=1'}</MathDisplay><small>The distributive law connects the operations:</small><MathDisplay>{'a(b+c)=ab+ac'}</MathDisplay></article><article><h3>COMPLETENESS</h3><p>Completeness is not another operation. Required boundary and least-upper-bound values are not missing.</p><div className="system-verdict"><strong>Q</strong><span>FIELD ✓</span><span>COMPLETE ✕</span><strong>R</strong><span>FIELD ✓</span><span>COMPLETE ✓</span></div></article></div><MathDisplay>{'\\boxed{\\mathbb Q\\text{ is an ordered field, but it is not complete.}}'}</MathDisplay><MathDisplay>{'\\boxed{\\mathbb R\\text{ is a complete ordered field.}}'}</MathDisplay></div>
}

function DenseNotComplete() {
  const [formal,setFormal]=useState(false)
  return <div className="dense-not-complete"><Approximation/><div className="dense-complete-cards"><article><h3>DENSE</h3><p>Rational numbers occur arbitrarily close to every real number.</p></article><article><h3>COMPLETE</h3><p>Required least-upper-bound and limiting boundary values remain inside the system.</p></article></div><MathDisplay>{'\\sqrt2\\notin\\mathbb Q\\qquad\\boxed{\\mathbb Q\\text{ is dense, but not complete.}}'}</MathDisplay><button onClick={()=>setFormal((value)=>!value)}>{formal?'Hide formal completeness idea':'Reveal formal completeness idea'}</button>{formal&&<div className="formal-completeness"><MathDisplay>{'S=\\{q\\in\\mathbb Q:q^2<2\\}'}</MathDisplay><p>S is nonempty and bounded above, but has no least upper bound in Q.</p><div className="boundary-line"><span>S: rational values with q² &lt; 2</span><b>√2</b></div><MathDisplay>{'\\sqrt2\\notin\\mathbb Q\\qquad\\sup_{\\mathbb R}S=\\sqrt2'}</MathDisplay></div>}</div>
}

function StructureComparison() {
  return <div className="structure-comparison"><MathDisplay>{'\\boxed{\\mathbb R\\text{ is a complete ordered field}}'}</MathDisplay><div><article><strong>FIELD</strong><span>Arithmetic works inside R for nonzero divisors.</span><MathDisplay>{'a,b\\in\\mathbb R'}</MathDisplay><span>+ &nbsp; − &nbsp; × &nbsp; ÷</span></article><article><strong>ORDERED</strong><span>Numbers can be compared consistently.</span><MathDisplay>{'a<b\\Longrightarrow a+c<b+c'}</MathDisplay><MathDisplay>{'0<a,\\ 0<b\\Longrightarrow0<ab'}</MathDisplay></article><article><strong>COMPLETE</strong><span>No required least upper bounds are missing.</span><MathDisplay>{'A\\subseteq\\mathbb R,\\ A\\ne\\varnothing'}</MathDisplay><span>If A is bounded above, then sup A belongs to R.</span></article></div><div className="structure-table"><span></span><b>FIELD</b><b>ORDERED</b><b>COMPLETE</b><strong>Q</strong><span>✓</span><span>✓</span><span>✕</span><strong>R</strong><span>✓</span><span>✓</span><span>✓</span></div></div>
}

function RationalJoke() {
  return <div className="rational-joke" role="img" aria-label="i says Be rational and pi responds Get real"><div><strong>i</strong><span>Be rational...</span></div><div><strong>π</strong><span>Get real!</span></div></div>
}

export default function NumberSystemStory({ stage, revealCount = 0 }) {
  if(stage==='opening-challenges') return <OpeningChallenges/>
  if(stage==='square-root-mystery') return <SquareRootMystery revealCount={revealCount}/>
  if(stage==='field-completeness') return <FieldCompleteness/>
  if(stage==='dense-not-complete') return <DenseNotComplete/>
  if(stage==='structure-comparison') return <StructureComparison/>
  if(stage==='rational-joke') return <RationalJoke/>
  if(stage==='natural-objects') { const count=Math.max(1,Math.min(5,revealCount||1)); return <div className="object-story"><Objects values={naturals.slice(0,count)}/>{revealCount>=6&&<><MathDisplay>{'\\mathbb N=\\{1,2,3,4,5,\\ldots\\}'}</MathDisplay><p>For this lecture, ℕ begins with 1.</p></>}</div> }
  if(stage==='natural-addition') return <NaturalExplorer/>
  if(stage==='subtraction-need') return <div className="need-story"><Objects values={naturals.slice(0,5)}/><MathDisplay>{'2-5=\\ ?'}</MathDisplay><MathDisplay>{'2-5=-3\\qquad -3\\notin\\mathbb N'}</MathDisplay><strong>We need to enlarge the set.</strong></div>
  if(stage==='integer-objects') { const left=Math.min(4,revealCount); return <div className="object-story"><Objects values={[...[-3,-2,-1,0].slice(4-left),1,2,3,4,5]} active={[-3,0,1,2,3]}/>{revealCount>=5&&<MathDisplay>{'\\mathbb Z=\\{\\ldots,-3,-2,-1,0,1,2,3,\\ldots\\}'}</MathDisplay>}{revealCount>=6&&<MathDisplay>{'\\mathbb N\\subset\\mathbb Z'}</MathDisplay>}</div> }
  if(stage==='integer-explorer') return <IntegerExplorer/>
  if(stage==='multiplication-need') return <MultiplicationNeed/>
  if(stage==='rational-objects') return <div className="object-story"><Objects values={rationals} dense/><MathDisplay>{'\\mathbb Q=\\left\\{\\frac pq:p,q\\in\\mathbb Z,\\ q\\ne0\\right\\}'}</MathDisplay><MathDisplay>{'\\mathbb N\\subset\\mathbb Z\\subset\\mathbb Q'}</MathDisplay></div>
  if(stage==='rational-inverse') return <RationalInverse/>
  if(stage==='density') return <Density/>
  if(stage==='sqrt2') return <Approximation/>
  if(stage==='irrationals') return <Irrationals/>
  if(stage==='real-line') return <RealLineReveal/>
  return null
}
