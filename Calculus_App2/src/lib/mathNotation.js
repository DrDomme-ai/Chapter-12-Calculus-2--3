// Compatibility normalizer for legacy LaTeX stored in ordinary JavaScript
// strings. Numeric computation remains separate from display strings.
const backspaceBetaPattern=new RegExp(`${String.fromCharCode(8)}(?=eta)`,'g')

export function normalizeLatex(source) {
  return String(source)
    .replace(backspaceBetaPattern, '\\b').replace(/\f(?=rac)/g, '\\f')
    .replace(/\t(?=heta|ext|an|o)/g, '\\t').replace(/\n(?=eq)/g, '\\n').replace(/\r(?=ight)/g, '\\r')
    .replace(/(arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan)(alpha|beta|theta)/g, '\\$1\\$2')
    .replace(/(?<!\\)(arcsin|arccos|arctan|sinh|cosh|tanh|coth|sin|cos|tan|sec|csc|cot)(alpha|beta|theta|pi|x|y|t)\b/g, '\\$1\\$2')
    .replace(/(?<![A-Za-z\\])(arcsin|arccos|arctan|sinh|cosh|tanh|coth|sin|cos|tan|sec|csc|cot|theta|alpha|beta|quad|qquad|pi|circ|sqrt|operatorname|mathbb|mathrm|displaystyle|boxed|cdot|iff|Rightarrow|Longrightarrow|pm|ln|in|le|ge|ne|lim|to|infty|int|left|right)(?![A-Za-z])/g, '\\$1')
    .replace(/\\frac(?:\\)?pi2/g, '\\frac{\\pi}{2}')
    .replace(/\\sqrt([0-9])/g, '\\sqrt{$1}')
}
