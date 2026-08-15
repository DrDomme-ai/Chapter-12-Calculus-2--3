// A deliberately small, safe expression parser for review answers.
//
// It never executes student text. Instead, it tokenizes a strict mathematical
// grammar, builds an AST, and evaluates that AST at several deterministic test
// points. This lets factored and expanded derivatives compare as equivalent
// without adding a full computer-algebra dependency.

const FUNCTIONS = new Set([
  'arcsin', 'arctan', 'asin', 'atan',
  'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
  'sqrt', 'ln', 'log', 'exp',
])
const VARIABLES = new Set(['x', 't', 'u', 'z', 'theta'])
const CONSTANTS = new Set(['pi', 'e'])
// Longest names must be checked first so, for example, `arcsin` is not split
// into shorter known names. Adjacent variables such as `tx` still tokenize as
// implicit multiplication.
const KNOWN_NAMES = [
  'arctan', 'arcsin', 'theta', 'sqrt',
  'asin', 'atan', 'exp',
  'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
  'log', 'ln', 'pi', 'x', 't', 'u', 'z', 'e',
]

const MAX_INPUT_LENGTH = 400
const MAX_TOKENS = 300
const MAX_NODES = 400
const MAX_DEPTH = 50

const superscriptDigits = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁻': '-', '⁺': '+',
}

const expandUnicodeSuperscripts = (source) => source.replace(
  /[⁰¹²³⁴-⁹⁺⁻]+/g,
  (run) => `^(${[...run].map((character) => superscriptDigits[character]).join('')})`,
)

const readBracedGroup = (source, start) => {
  let index = start
  while (/\s/.test(source[index] || '')) index += 1
  if (source[index] !== '{') return null

  let depth = 0
  for (let cursor = index; cursor < source.length; cursor += 1) {
    if (source[cursor] === '{') depth += 1
    if (source[cursor] === '}') depth -= 1
    if (depth === 0) {
      return { content: source.slice(index + 1, cursor), end: cursor + 1 }
    }
  }
  throw new Error('Unclosed LaTeX group')
}

const rewriteLatex = (source, depth = 0) => {
  if (depth > 12) throw new Error('LaTeX nesting is too deep')
  let result = ''

  for (let index = 0; index < source.length;) {
    if (source[index] !== '\\') {
      result += source[index]
      index += 1
      continue
    }

    const commandMatch = source.slice(index + 1).match(/^[a-zA-Z]+/)
    if (!commandMatch) {
      // LaTeX spacing commands such as \, and \! have no mathematical value.
      if ([',', '!', ';', ':', ' '].includes(source[index + 1])) {
        index += 2
        continue
      }
      result += source[index]
      index += 1
      continue
    }

    const command = commandMatch[0].toLowerCase()
    let cursor = index + 1 + commandMatch[0].length

    if (command === 'left' || command === 'right') {
      index = cursor
      continue
    }

    if (command === 'cdot' || command === 'times') {
      result += '*'
      index = cursor
      continue
    }

    if (command === 'theta' || command === 'pi' || FUNCTIONS.has(command)) {
      result += command
      index = cursor
      continue
    }

    if (command === 'frac') {
      const numerator = readBracedGroup(source, cursor)
      if (!numerator) throw new Error('Expected a numerator after \\frac')
      const denominator = readBracedGroup(source, numerator.end)
      if (!denominator) throw new Error('Expected a denominator after \\frac')
      result += `((${rewriteLatex(numerator.content, depth + 1)})/(${rewriteLatex(denominator.content, depth + 1)}))`
      index = denominator.end
      continue
    }

    if (command === 'sqrt') {
      const radicand = readBracedGroup(source, cursor)
      if (!radicand) {
        result += 'sqrt'
        index = cursor
      } else {
        result += `sqrt(${rewriteLatex(radicand.content, depth + 1)})`
        index = radicand.end
      }
      continue
    }

    if (command === 'operatorname' || command === 'mathrm') {
      const group = readBracedGroup(source, cursor)
      if (!group) throw new Error(`Expected a group after \\${command}`)
      result += rewriteLatex(group.content, depth + 1)
      index = group.end
      continue
    }

    // Leaving an unknown command visible ensures the tokenizer rejects it.
    result += `\\${command}`
    index = cursor
  }

  return result
}

const prepareSource = (value) => {
  // Students often include a harmless label such as f'(x)= before the
  // expression. Only the right-most side is graded.
  const response = String(value)
  const expression = response.includes('=') ? response.slice(response.lastIndexOf('=') + 1) : response
  const initial = expandUnicodeSuperscripts(expression)
  return rewriteLatex(initial)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/[\u00b7\u00d7]/g, '*')
    .replace(/[\u00f7\u2044]/g, '/')
    .replace(/\u03b8/g, 'theta')
    .replace(/\u03c0/g, 'pi')
    .replace(/\u221a/g, 'sqrt')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
}

const tokenize = (sourceValue) => {
  const rawSource = String(sourceValue)
  if (rawSource.length > MAX_INPUT_LENGTH) throw new Error('The expression is too long')
  const source = prepareSource(rawSource)
  if (!source.trim()) throw new Error('The expression is empty')
  if (source.length > MAX_INPUT_LENGTH) throw new Error('The expression is too long')

  const tokens = []
  let index = 0

  const addToken = (type, value = type) => {
    tokens.push({ type, value })
    if (tokens.length > MAX_TOKENS) throw new Error('The expression has too many tokens')
  }

  while (index < source.length) {
    const character = source[index]
    if (/\s/.test(character)) {
      index += 1
      continue
    }

    if ('+-*/^()'.includes(character)) {
      addToken(character)
      index += 1
      continue
    }

    const numberMatch = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/)
    if (numberMatch) {
      const numericValue = Number(numberMatch[0])
      if (!Number.isFinite(numericValue)) throw new Error('Invalid number')
      addToken('number', numericValue)
      index += numberMatch[0].length
      continue
    }

    if (/[a-z]/.test(character)) {
      const name = KNOWN_NAMES.find((candidate) => source.startsWith(candidate, index))
      if (!name) throw new Error(`Unknown name near "${source.slice(index, index + 8)}"`)
      addToken('name', name)
      index += name.length
      continue
    }

    throw new Error(`Unsupported character "${character}"`)
  }

  addToken('eof')
  return tokens
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.position = 0
    this.nodeCount = 0
  }

  peek(type) {
    return this.tokens[this.position]?.type === type
  }

  take(type) {
    if (!this.peek(type)) throw new Error(`Expected ${type}`)
    const token = this.tokens[this.position]
    this.position += 1
    return token
  }

  node(kind, properties = {}) {
    this.nodeCount += 1
    if (this.nodeCount > MAX_NODES) throw new Error('The expression is too complex')
    return { kind, ...properties }
  }

  parse() {
    const expression = this.parseAdditive(0)
    this.take('eof')
    return expression
  }

  parseAdditive(depth) {
    this.checkDepth(depth)
    let left = this.parseMultiplicative(depth + 1)
    while (this.peek('+') || this.peek('-')) {
      const operator = this.tokens[this.position].type
      this.position += 1
      left = this.node('binary', { operator, left, right: this.parseMultiplicative(depth + 1) })
    }
    return left
  }

  parseMultiplicative(depth) {
    this.checkDepth(depth)
    let left = this.parseUnary(depth + 1)

    while (this.peek('*') || this.peek('/') || this.startsImplicitFactor()) {
      let operator = '*'
      if (this.peek('*') || this.peek('/')) {
        operator = this.tokens[this.position].type
        this.position += 1
      }
      left = this.node('binary', { operator, left, right: this.parseUnary(depth + 1) })
    }
    return left
  }

  parseUnary(depth) {
    this.checkDepth(depth)
    if (this.peek('+') || this.peek('-')) {
      const operator = this.tokens[this.position].type
      this.position += 1
      return this.node('unary', { operator, argument: this.parseUnary(depth + 1) })
    }
    return this.parsePower(depth + 1)
  }

  parsePower(depth) {
    this.checkDepth(depth)
    let base = this.parsePrimary(depth + 1)
    if (this.peek('^')) {
      this.position += 1
      base = this.node('binary', { operator: '^', left: base, right: this.parseUnary(depth + 1) })
    }
    return base
  }

  parsePrimary(depth) {
    this.checkDepth(depth)

    if (this.peek('number')) {
      return this.node('number', { value: this.take('number').value })
    }

    if (this.peek('(')) {
      this.take('(')
      const expression = this.parseAdditive(depth + 1)
      this.take(')')
      return expression
    }

    if (this.peek('name')) {
      const name = this.take('name').value
      if (VARIABLES.has(name)) return this.node('variable', { name })
      if (CONSTANTS.has(name)) return this.node('constant', { name })
      if (!FUNCTIONS.has(name)) throw new Error(`Unsupported function ${name}`)

      let functionPower = null
      if (this.peek('^')) {
        this.take('^')
        functionPower = this.parseUnary(depth + 1)
      }

      let argument
      if (this.peek('(')) {
        this.take('(')
        argument = this.parseAdditive(depth + 1)
        this.take(')')
      } else if (this.peek('number') || this.peek('name')) {
        argument = this.parsePower(depth + 1)
      } else {
        throw new Error(`Expected an argument for ${name}`)
      }

      const call = this.node('call', { name, argument })
      return functionPower ? this.node('binary', { operator: '^', left: call, right: functionPower }) : call
    }

    throw new Error(`Unexpected token ${this.tokens[this.position]?.type || 'end'}`)
  }

  startsImplicitFactor() {
    return this.peek('number') || this.peek('name') || this.peek('(')
  }

  checkDepth(depth) {
    if (depth > MAX_DEPTH) throw new Error('The expression is nested too deeply')
  }
}

const parseExpression = (source) => new Parser(tokenize(source)).parse()

const evaluateCall = (name, argument) => {
  if (name === 'sin') return Math.sin(argument)
  if (name === 'cos') return Math.cos(argument)
  if (name === 'tan') return Math.tan(argument)
  if (name === 'arcsin' || name === 'asin') {
    return argument < -1 || argument > 1 ? Number.NaN : Math.asin(argument)
  }
  if (name === 'arctan' || name === 'atan') return Math.atan(argument)
  if (name === 'sqrt') return argument < 0 ? Number.NaN : Math.sqrt(argument)
  // In calculus input, both ln and an unbased log denote the natural
  // logarithm. A base-specific logarithm can be entered by change of base,
  // for example ln(z)/ln(7).
  if (name === 'ln' || name === 'log') return argument <= 0 ? Number.NaN : Math.log(argument)
  if (name === 'exp') return Math.exp(argument)
  if (name === 'sec') {
    const denominator = Math.cos(argument)
    return Math.abs(denominator) < 1e-12 ? Number.NaN : 1 / denominator
  }
  if (name === 'csc') {
    const denominator = Math.sin(argument)
    return Math.abs(denominator) < 1e-12 ? Number.NaN : 1 / denominator
  }
  if (name === 'cot') {
    const denominator = Math.sin(argument)
    return Math.abs(denominator) < 1e-12 ? Number.NaN : Math.cos(argument) / denominator
  }
  return Number.NaN
}

const evaluateAst = (node, environment) => {
  if (node.kind === 'number') return node.value
  if (node.kind === 'constant') return node.name === 'pi' ? Math.PI : Math.E
  if (node.kind === 'variable') return environment[node.name]

  if (node.kind === 'unary') {
    const value = evaluateAst(node.argument, environment)
    return node.operator === '-' ? -value : value
  }

  if (node.kind === 'call') {
    return evaluateCall(node.name, evaluateAst(node.argument, environment))
  }

  if (node.kind === 'binary') {
    const left = evaluateAst(node.left, environment)
    const right = evaluateAst(node.right, environment)
    if (node.operator === '+') return left + right
    if (node.operator === '-') return left - right
    if (node.operator === '*') return left * right
    if (node.operator === '/') return Math.abs(right) < 1e-13 ? Number.NaN : left / right
    if (node.operator === '^') return Math.pow(left, right)
  }

  return Number.NaN
}

const collectVariables = (node, names = new Set()) => {
  if (node.kind === 'variable') names.add(node.name)
  if (node.argument) collectVariables(node.argument, names)
  if (node.left) collectVariables(node.left, names)
  if (node.right) collectVariables(node.right, names)
  return names
}

// These non-round values reduce accidental agreement. Zero is included to
// catch obvious domain mismatches, while plentiful positive points support
// fractional powers such as x^(-1/8).
const SAMPLE_VALUES = [
  0, -3.17, -2.41, -1.83, -1.29, -0.91, -0.47, -0.19,
  0.13, 0.29, 0.53, 0.79, 1.07, 1.37, 1.71, 2.09,
  2.57, 3.11, 3.73, 4.31, 5.03, 0.67, 1.93, 2.83, 4.73,
  // Small values provide enough common-domain samples for expressions such
  // as sqrt(1 - 16x^2), while values above seven cover sqrt(x - 7).
  -0.23, -0.17, -0.11, -0.07, -0.03, 0.03, 0.07, 0.11, 0.17, 0.23,
  7.13, 7.41, 7.79, 8.17, 8.63, 9.11, 9.67, 10.31, 11.09, 12.17,
]

const numericallyEquivalent = (leftAst, rightAst) => {
  const variables = [...collectVariables(leftAst, collectVariables(rightAst))].sort()
  let validComparisons = 0

  for (let sampleIndex = 0; sampleIndex < SAMPLE_VALUES.length; sampleIndex += 1) {
    const environment = {}
    variables.forEach((name, variableIndex) => {
      const stride = 2 * variableIndex + 1
      environment[name] = SAMPLE_VALUES[(sampleIndex * stride + 7 * variableIndex) % SAMPLE_VALUES.length]
    })

    const left = evaluateAst(leftAst, environment)
    const right = evaluateAst(rightAst, environment)
    const leftFinite = Number.isFinite(left)
    const rightFinite = Number.isFinite(right)

    if (leftFinite !== rightFinite) return false
    if (!leftFinite) continue

    validComparisons += 1
    const scale = Math.max(1, Math.abs(left), Math.abs(right))
    if (Math.abs(left - right) > 1e-8 * scale) return false
  }

  // Constant expressions only need one comparison; variable expressions must
  // agree throughout a meaningful sample of their common real domain.
  return validComparisons >= (variables.length === 0 ? 1 : 8)
}

export const areAlgebraicallyEquivalent = (leftSource, rightSource) => {
  try {
    return numericallyEquivalent(parseExpression(leftSource), parseExpression(rightSource))
  } catch {
    return false
  }
}

export const matchesAlgebraicAnswer = (answer, acceptedAnswers) => {
  if (!String(answer).trim() || !Array.isArray(acceptedAnswers)) return false
  return acceptedAnswers.some((accepted) => areAlgebraicallyEquivalent(answer, accepted))
}
