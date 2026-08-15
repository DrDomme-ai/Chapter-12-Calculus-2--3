import { useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'

const groups = [
  { name:'Operations', items:[['Closure under addition','a,b\\in F\\Longrightarrow a+b\\in F'],['Closure under multiplication','a,b\\in F\\Longrightarrow ab\\in F']] },
  { name:'Identities', items:[['Additive identity','0\\in F,\\quad a+0=a'],['Multiplicative identity','1\\in F,\\quad a\\cdot1=a'],['Distinct identities','0\\ne1']] },
  { name:'Inverses', items:[['Additive inverse','-a\\in F,\\quad a+(-a)=0'],['Multiplicative inverse','a\\ne0\\Longrightarrow \\frac1a\\in F,\\quad a\\left(\\frac1a\\right)=1']] },
  { name:'Laws', items:[['Commutative','a+b=b+a,\\quad ab=ba'],['Associative','(a+b)+c=a+(b+c),\\quad(ab)c=a(bc)'],['Distributive','a(b+c)=ab+ac']] },
]

const tests = {
  N:{notation:'\\mathbb N=\\{1,2,3,\\ldots\\}',checks:[['Addition','yes'],['Multiplication','yes'],['Additive inverses','no']],example:'2\\in\\mathbb N\\quad\\text{but}\\quad-2\\notin\\mathbb N',conclusion:'ℕ is not a field.'},
  Z:{notation:'\\mathbb Z=\\{\\ldots,-2,-1,0,1,2,\\ldots\\}',checks:[['Addition','yes'],['Multiplication','yes'],['Additive inverses','yes'],['Multiplicative inverses','no']],example:'2\\in\\mathbb Z\\quad\\text{but}\\quad\\frac12\\notin\\mathbb Z',conclusion:'ℤ is not a field.'},
  Q:{notation:'\\mathbb Q=\\{p/q:p,q\\in\\mathbb Z,\\ q\\ne0\\}',checks:[['Addition','yes'],['Multiplication','yes'],['Additive inverses','yes'],['Nonzero multiplicative inverses','yes'],['Arithmetic laws','yes']],example:'\\frac35\\cdot\\frac53=1',conclusion:'ℚ is a field.'},
  R:{notation:'\\mathbb R',checks:[['Field axioms','yes'],['Ordered','yes'],['Complete','yes']],example:'\\mathbb Q:\\ field\\;\\checkmark,\\ ordered\\;\\checkmark,\\ complete\\;\\times',conclusion:'ℝ is a complete ordered field.'},
}

export function FieldAxioms({ revealCount=0 }) {
  const visible=[]; let remaining=revealCount
  groups.forEach((group)=>{ const count=Math.max(0,Math.min(group.items.length,remaining)); if(count||revealCount>=groups.slice(0,groups.indexOf(group)).reduce((sum,item)=>sum+item.items.length,0)) visible.push({...group,items:group.items.slice(0,count)}); remaining-=count })
  const complete=revealCount>=groups.reduce((sum,group)=>sum+group.items.length,0)
  return <div className="field-axioms"><div className="field-groups">{groups.map((group,index)=>{const shown=visible.find((item)=>item.name===group.name);return <section className={shown?.items.length?'is-visible':''} key={group.name}><span>{index+1}</span><h3>{group.name}</h3>{shown?.items.map(([label,math])=><div key={label}><strong>{label}</strong><MathDisplay>{math}</MathDisplay></div>)}</section>})}</div>{complete&&<div className="field-summary"><strong>A field has arithmetic identities, inverses, and laws inside the set.</strong><span>Subtraction uses a − b = a + (−b). Division uses a/b = a(1/b), b ≠ 0.</span><b>FIELD = ARITHMETIC WORKS INSIDE THE SET</b></div>}</div>
}

export function FieldSetTester() {
  const [setName,setSetName]=useState('N'),[tested,setTested]=useState(false); const test=tests[setName]
  const symbols={N:'ℕ',Z:'ℤ',Q:'ℚ',R:'ℝ'}
  return <div className="field-tester"><div className="field-set-tabs">{Object.keys(tests).map((name)=><button className={setName===name?'active':''} onClick={()=>{setSetName(name);setTested(false)}} key={name}>{symbols[name]}</button>)}</div><MathDisplay>{test.notation}</MathDisplay><button className="test-field-button" onClick={()=>setTested(true)}>Test Field</button>{tested&&<div className="field-test-result"><div>{test.checks.map(([label,status])=><p className={status} key={label}><span>{status==='yes'?'✓':'✕'}</span>{label}</p>)}</div><MathDisplay>{test.example}</MathDisplay><strong>{test.conclusion}</strong>{setName==='R'&&<p>Then what distinguishes ℚ from ℝ? Completeness.</p>}</div>}</div>
}

export default function FieldExplorer({ stage,revealCount }) { return stage==='axioms'?<FieldAxioms revealCount={revealCount}/>:<FieldSetTester/> }
