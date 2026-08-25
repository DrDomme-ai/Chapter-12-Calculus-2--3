import { useState } from 'react'
import { MathDisplay } from '../../components/MathDisplay'
import Chapter12Explorers from '../../instructor/components/Chapter12Explorers'
import CrossProductExplorer from '../../instructor/components/CrossProductExplorer'
import { chapter12ReviewSections, getChapter12Review } from '../../data/chapter12Review'
import './chapter12-review.css'

function Reveal({label='Show why',children}){
  const [open,setOpen]=useState(false)
  return <div className="c12-reveal"><button type="button" onClick={()=>setOpen(value=>!value)} aria-expanded={open}>{open?'Hide':label}</button>{open&&<div>{children}</div>}</div>
}

function PracticeCard({item,index}){
  const [answer,setAnswer]=useState('')
  const [checked,setChecked]=useState(false)
  return <article className="c12-practice-card"><span>{item[0]}</span><h3>{index+1}. {item[1]}</h3><label>Your idea<input value={answer} onChange={event=>setAnswer(event.target.value)} /></label><button type="button" onClick={()=>setChecked(true)}>Check your idea</button>{checked&&<p><strong>Complete answer:</strong> {item[2]}</p>}</article>
}

export default function Chapter12Review({sectionId='12-1',onBack,onOpenSection}){
  const section=getChapter12Review(sectionId)
  return <main className="chapter12-review-page">
    <nav className="c12-review-nav"><button type="button" onClick={onBack}>← Chapter 12</button><div>{chapter12ReviewSections.map(item=><button type="button" className={item.id===section.id?'active':''} onClick={()=>onOpenSection(item.id)} key={item.id}>{item.number}</button>)}</div></nav>
    <header className="c12-review-hero"><p>Complete self-paced review · {section.number}</p><h1>{section.title}</h1><p>{section.why}</p><aside><strong>The one thing to remember</strong>{section.remember}</aside></header>
    <section><h2>Objectives</h2><ul>{section.objectives.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section><h2>Definitions and intuition</h2><div className="c12-card-grid">{section.definitions.map(([term,meaning])=><article key={term}><h3>{term}</h3><p>{meaning}</p></article>)}</div></section>
    {section.id==='12-4'&&<section className="c12-cross-product-feature"><h2>Interactive Cross Product Laboratory</h2><p>Rotate the vectors, change their magnitudes and angle, verify the computation, and complete the guided exercises.</p><div><CrossProductExplorer/></div></section>}
    <section><h2>Drag it, rotate it, change it</h2><p>Predict first. Use the controls, then explain what remains invariant and what changes.</p><div className="c12-visual-grid">{section.visualStages.map(stage=><article key={stage}><Chapter12Explorers stage={stage}/></article>)}</div></section>
    <section><h2>Formulas—and how to rebuild them</h2>{section.formulas.map(([name,formula,why])=><article className="c12-formula" key={name}><h3>{name}</h3><MathDisplay>{formula}</MathDisplay><Reveal label="If you forget the formula"><p>{why}</p></Reveal></article>)}</section>
    <section><h2>Worked examples</h2>{section.examples.map(([title,prompt,solution],index)=><article className="c12-example" key={title}><span>Example {index+1}</span><h3>{title}</h3>{prompt.includes('\\')||prompt.includes('^')?<MathDisplay>{prompt}</MathDisplay>:<p>{prompt}</p>}<Reveal label="Show full solution">{solution.includes('\\')||solution.includes('^')?<MathDisplay>{solution}</MathDisplay>:<p>{solution}</p>}</Reveal></article>)}</section>
    <section><h2>Common traps · True or False</h2>{section.traps.map(([claim,answer,why])=><article className="c12-trap" key={claim}><h3>Predict: {claim}</h3><Reveal label="Answer and counterexample"><strong>{answer}.</strong> {why}</Reveal></article>)}</section>
    <section><h2>Practice ladder and exam preparation</h2><p>Try each problem before opening its complete answer. Return later and solve it without notes.</p><div className="c12-practice-grid">{section.practice.map((item,index)=><PracticeCard item={item} index={index} key={item[1]}/>)}</div></section>
    <section className="c12-reference"><h2>Quick reference and mastery check</h2><ul><li>I can state the central idea in my own words.</li><li>I can reconstruct each formula rather than only recite it.</li><li>I can explain why every concept trap is false.</li><li>I can complete the challenge and exam problems without revealing answers.</li></ul><strong>Remember: {section.remember}</strong></section>
  </main>
}
