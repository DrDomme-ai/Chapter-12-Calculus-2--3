import { MathDisplay } from '../../components/MathDisplay'
import NumberSystemStory from './NumberSystemStory'
import FieldExplorer from './FieldExplorer'
import VisualSlideCanvas from './VisualSlideCanvas'
import LectureHooks from './LectureHooks'
import LectureOpeningSlide from './LectureOpeningSlide'
import ExamQuestionView from './ExamQuestionView'
import { getLectureSemantic } from '../services/lectureSemantics'
import { getSlideVisualStyle } from '../services/slideVisualStyle'
import '../styles/chapter12ColorSystem.css'

const CardValue=({value})=>typeof value==='string'&&(/\\[a-zA-Z]+|[_^]/.test(value))?<MathDisplay>{value}</MathDisplay>:value

function NaturalAddition() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8]
  return <div className="number-lab"><div className="number-line">{values.map((value) => <span key={value}>{value}</span>)}</div><MathDisplay>{'3+4=7\\in\\mathbb N'}</MathDisplay><p>Move four steps from 3. The result stays on the natural-number line.</p></div>
}

function NumberVisualization({ name, revealCount }) {
  if (name?.startsWith('lecture-hook:')) return <LectureHooks stage={name.split(':')[1]} />
  if (name?.startsWith('number-story:')) return <NumberSystemStory stage={name.split(':')[1]} revealCount={revealCount} />
  if (name?.startsWith('field:')) return <FieldExplorer stage={name.split(':')[1]} revealCount={revealCount} />
  if (name === 'natural-addition') return <NaturalAddition />
  if (name === 'integer-extension') return <div className="number-lab"><div className="number-line extended">{[-4,-3,-2,-1,0,1,2,3,4].map((v) => <span key={v}>{v}</span>)}</div><p>The same line extends through zero and into negative values.</p></div>
  if (name === 'rational-line' || name === 'irrational-line') return <div className="number-lab"><div className="number-line extended">{['−3/2','−1/2','0','1/2','2/3','√2','3/2'].map((v) => <span key={v}>{v}</span>)}</div><p>Fractions and irrational values occupy precise locations on one line.</p></div>
  if (name === 'density') return <div className="density-visual"><strong>0</strong><i /><b>1/2</b><i /><b>3/4</b><i /><b>7/8</b><i /><strong>1</strong><p>Zoom again: another rational lies between every pair.</p></div>
  if (name === 'supremum') return <div className="supremum-visual"><div><span>rational values with x² &lt; 2</span><strong>√2</strong></div><p>The boundary belongs to ℝ, but not to ℚ.</p></div>
  return null
}

function Content({ item }) {
  if (item.kind === 'math') return <div className="slide-math-item" style={item.spaceAfter?{marginBottom:`${item.spaceAfter}px`}:undefined}><MathDisplay>{item.value}</MathDisplay></div>
  if (item.kind === 'list') return <ul>{item.value.map((entry) => <li key={entry}>{entry}</li>)}</ul>
  if (item.kind === 'callout') return <p className="slide-callout">{item.value}</p>
  if (item.kind === 'eyebrow') return <p className="slide-eyebrow">{item.value}</p>
  if (item.kind === 'comparison') return <div className="field-comparison">{item.value.map((row) => <article key={row.label}><MathDisplay>{row.label}</MathDisplay><p><strong>{row.formula?'Formula:':'Field:'}</strong> {row.formula?<MathDisplay>{row.formula}</MathDisplay>:<CardValue value={row.field}/>}</p><p><strong>{row.characteristic?'Key Characteristic:':'Ordered:'}</strong> {row.characteristic||row.ordered}</p><p><strong>{row.behavior?'Behavior:':'Complete:'}</strong> {row.behavior||row.complete}</p></article>)}</div>
  if (item.value != null && typeof item.value === 'object') { console.error('Unsupported projected slide content', item); return null }
  return <p>{item.value}</p>
}

export default function SlideCanvas({ slide, revealCount = 0, audience = false, openingContext, inlineEditing=false, onInlineChange, selected=[], onSelect, onChange }) {
  const semantic=getLectureSemantic(slide.type)
  const visualStyle=getSlideVisualStyle(slide)
  if(slide.visualization==='lecture-opening')return <article className={`lecture-slide slide-type-welcome${audience?' is-audience':''}`}><LectureOpeningSlide settings={slide.visualizationSettings} {...openingContext}/></article>
  if(slide.examQuestion)return <article data-slide-id={slide.id} data-semantic="question" style={visualStyle.slide} className={`lecture-slide semantic-question slide-type-exam-question${audience?' is-audience':''}`}><header><span className="semantic-label" style={visualStyle.label}><i aria-hidden="true">?</i>Exam Question</span><h2>{slide.title}</h2></header><div className="slide-content" style={visualStyle.card}><ExamQuestionView key={slide.examQuestion.id} question={slide.examQuestion}/></div><footer><span>Interactive Calculus</span><span>Solution remains hidden until requested</span></footer></article>
  if (slide.elements) return <div data-visual-category={visualStyle.key} style={{...visualStyle.slide,position:'absolute',inset:0,border:visualStyle.card.border,borderRadius:visualStyle.card.borderRadius,overflow:'hidden'}}><VisualSlideCanvas key={slide.id} slide={slide} revealCount={revealCount} inlineEditing={inlineEditing} onInlineChange={onInlineChange} selected={selected} onSelect={onSelect} onChange={onChange}/></div>
  const reveals = slide.revealSteps?.slice(0, revealCount) || []
  return <article data-slide-id={slide.id} data-semantic={semantic.kind} data-visual-category={visualStyle.key} style={visualStyle.slide} className={`lecture-slide semantic-${semantic.kind} slide-type-${slide.type}${audience ? ' is-audience' : ''}`}>
    <header><span className="semantic-label" style={visualStyle.label}><i aria-hidden="true">{semantic.icon}</i>{semantic.label}</span><h2>{slide.title}</h2></header>
    <div className="slide-content" style={visualStyle.card}>{slide.presentationContent?.map((item, index) => <Content item={item} key={`${item.kind}-${index}`} />)}<NumberVisualization name={slide.visualization} revealCount={revealCount} />
      {!!reveals.length && <ol className="reveal-list">{reveals.map((entry,index) => <li key={`${index}-${entry}`}>{entry}</li>)}</ol>}
      {slide.type === 'whiteboard' && <div className="whiteboard-prompt">Write, sketch, or work the problem here.</div>}
    </div>
    <footer><span>Interactive Calculus</span><span>{slide.type === 'live-question' ? 'Ask the class before revealing the answer' : ''}</span></footer>
  </article>
}
