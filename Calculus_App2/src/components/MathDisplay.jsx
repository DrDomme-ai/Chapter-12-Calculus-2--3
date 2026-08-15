import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { normalizeLatex } from '../lib/mathNotation'

function useRenderedMath(children, displayMode) {
  const formula = normalizeLatex(children)

  return useMemo(() => {
    try {
      return {
        formula,
        html: katex.renderToString(formula, {
          displayMode,
          throwOnError: true,
          strict: false,
          trust: false,
        }),
      }
    } catch {
      // A readable fallback prevents malformed source from disappearing.
      return { formula, html: null }
    }
  }, [displayMode, formula])
}

export function MathDisplay({ children }) {
  const rendered = useRenderedMath(children, true)

  return (
    <div className="math-display">
      {rendered.html
        ? <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
        : <code className="math-render-error">{rendered.formula}</code>}
    </div>
  )
}

export function MathInline({ children }) {
  const rendered = useRenderedMath(children, false)

  return rendered.html
    ? <span className="math-inline" dangerouslySetInnerHTML={{ __html: rendered.html }} />
    : <code className="math-render-error">{rendered.formula}</code>
}
