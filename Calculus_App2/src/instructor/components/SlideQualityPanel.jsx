import { useMemo, useState } from 'react'
import { auditSlide, autoFitSlide } from '../services/slideQualityService'

export default function SlideQualityPanel({ slide, onSelect, onApply }) {
  const [proposal, setProposal] = useState(null)
  const audit = useMemo(() => auditSlide(slide), [slide])
  const preview = proposal ? auditSlide(proposal) : null
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
    <div className="quality-actions"><button onClick={() => setProposal(autoFitSlide(slide))}>Preview Auto Fit</button><button onClick={() => setProposal(autoFitSlide(slide, { tidy: true }))}>Preview Tidy Layout</button></div>
    {proposal && <div className="fit-preview"><strong>Preview</strong><span>{audit.issues.length} issues to {preview.issues.length} issues</span><p>No changes have been applied.</p><button onClick={() => { onApply(proposal); setProposal(null) }}>Apply</button><button onClick={() => setProposal(null)}>Cancel</button></div>}
  </section>
}
