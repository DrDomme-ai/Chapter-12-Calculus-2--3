import { MathDisplay } from '../../components/MathDisplay'
import NumberSystemStory from './NumberSystemStory'
import FieldExplorer from './FieldExplorer'
import VisualSlideCanvas from './VisualSlideCanvas'
import LectureHooks from './LectureHooks'

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
  if (item.kind === 'math') return <MathDisplay>{item.value}</MathDisplay>
  if (item.kind === 'list') return <ul>{item.value.map((entry) => <li key={entry}>{entry}</li>)}</ul>
  if (item.kind === 'callout') return <p className="slide-callout">{item.value}</p>
  if (item.kind === 'eyebrow') return <p className="slide-eyebrow">{item.value}</p>
  if (item.kind === 'comparison') return <div className="field-comparison">{item.value.map((row) => <article key={row.label}><MathDisplay>{row.label}</MathDisplay><p>Field: {row.field}</p><p>Ordered: {row.ordered}</p><p>Complete: {row.complete}</p></article>)}</div>
  if (item.value != null && typeof item.value === 'object') { console.error('Unsupported projected slide content', item); return null }
  return <p>{item.value}</p>
}

export default function SlideCanvas({ slide, revealCount = 0, audience = false }) {
  if (slide.elements) return <VisualSlideCanvas slide={slide} revealCount={revealCount} />
  const reveals = slide.revealSteps?.slice(0, revealCount) || []
  return <article className={`lecture-slide slide-type-${slide.type}${audience ? ' is-audience' : ''}`}>
    <header><span>{slide.type.replace('-', ' ')}</span><h2>{slide.title}</h2></header>
    <div className="slide-content">{slide.presentationContent?.map((item, index) => <Content item={item} key={`${item.kind}-${index}`} />)}<NumberVisualization name={slide.visualization} revealCount={revealCount} />
      {!!reveals.length && <ol className="reveal-list">{reveals.map((entry) => <li key={entry}>{entry}</li>)}</ol>}
      {slide.type === 'whiteboard' && <div className="whiteboard-prompt">Write, sketch, or work the problem here.</div>}
    </div>
    <footer><span>Interactive Calculus</span><span>{slide.type === 'live-question' ? 'Ask the class before revealing the answer' : ''}</span></footer>
  </article>
}
