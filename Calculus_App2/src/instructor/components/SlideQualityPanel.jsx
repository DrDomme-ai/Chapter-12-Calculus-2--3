import { useMemo } from 'react'
import { auditSlide } from '../services/slideQualityService'

export default function SlideQualityPanel({ slide, onSelect }) {
  const audit = useMemo(() => auditSlide(slide), [slide])
  const checks = [
    ['inside', 'All content within safe area'],
    ['readable', 'Readable projector text'],
    ['noOverlap', 'No same-layer collisions'],
    ['interactiveUsable', 'Interactive components usable'],
    ['focus', 'Main focus is clear'],
  ]

  return <section className="slide-quality-panel">
    <header><strong>Slide Quality</strong><button className={audit.issues.length ? 'has-issues' : ''}>{audit.issues.length ? `Warning: ${audit.issues.length} layout issues` : 'Checks passed'}</button></header>
    <div className="quality-checks">{checks.map(([key, label]) => <span className={audit.checks[key] ? 'pass' : 'warn'} key={key}>{audit.checks[key] ? 'Pass:' : 'Review:'} {label}</span>)}</div>
    {audit.issues.length > 0 && <details><summary>Identify affected objects</summary>{audit.issues.map((issue, index) => <button onClick={() => onSelect(issue.elementIds)} key={`${issue.type}-${index}`}>{issue.message}</button>)}</details>}
    {audit.suggestSplit && <p className="split-suggestion">Suggest Split: keep the main definition or visual together and move the example or question to a following slide.</p>}
    <p className="manual-layout-note">Manual layout mode: select an affected object, then drag or resize it inside the dotted safe area.</p>
  </section>
}
