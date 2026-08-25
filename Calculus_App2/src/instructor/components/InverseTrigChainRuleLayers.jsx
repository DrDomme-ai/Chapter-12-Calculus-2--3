import { MathDisplay } from '../../components/MathDisplay'

const stages = [
  { label: 'Original function', math: String.raw`7\arcsin(x^2)` },
  { label: 'Outside constant', math: String.raw`7` },
  { label: 'Outer function', math: String.raw`\arcsin(\square)` },
  { label: 'Inner function', math: String.raw`u=x^2` },
  { label: 'Differentiate the inner function', math: String.raw`u'=2x` },
  { label: 'Substitute the complete inner function', math: String.raw`\sqrt{1-u^2}\;\longrightarrow\;\sqrt{1-(x^2)^2}` },
  { label: 'Square inside the square', math: String.raw`u^2\;\longrightarrow\;(x^2)^2\;\longrightarrow\;x^4` },
  { label: 'Final derivative', math: String.raw`\boxed{y'=\frac{14x}{\sqrt{1-x^4}}}` },
]

export default function InverseTrigChainRuleLayers({ revealCount = 0 }) {
  const visible = Math.max(1, Math.min(stages.length, revealCount + 1))
  return <section className="inverse-trig-chain-layers" aria-label="Inverse sine Chain Rule layers">
    {stages.slice(0, visible).map((stage, index) => <article className={index === visible - 1 ? 'active' : ''} key={stage.label}>
      <span>{index + 1}</span><div><strong>{stage.label}</strong><MathDisplay>{stage.math}</MathDisplay></div>
    </article>)}
  </section>
}
