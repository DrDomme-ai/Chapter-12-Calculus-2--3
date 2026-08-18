// Student-facing content for the third Trigonometry Fundamental Review lesson.
// The UI can use this one source for progressive reveals, answer checking,
// accessibility text, saved progress, and the optional quick path.

export const sixTrigFunctionNames = [
  { id: 'sin', name: 'Sine', math: '\\sin\\theta' },
  { id: 'cos', name: 'Cosine', math: '\\cos\\theta' },
  { id: 'tan', name: 'Tangent', math: '\\tan\\theta' },
  { id: 'csc', name: 'Cosecant', math: '\\csc\\theta' },
  { id: 'sec', name: 'Secant', math: '\\sec\\theta' },
  { id: 'cot', name: 'Cotangent', math: '\\cot\\theta' },
]

export const sixTrigFunctionsLesson = {
  id: 'six-trigonometric-functions',
  number: '03',
  foundation: 'Foundation 02 - Trigonometry',
  title: 'The Six Trigonometric Functions',
  shortTitle: 'Six Trig Functions',
  description: 'Build tangent, cotangent, secant, and cosecant from sine and cosine.',
  status: 'Core Review',
  estimatedReviewTime: '10-15 minutes',
  quickPathTime: '3-5 minutes',

  introduction: {
    label: 'Opening question',
    pointMath: 'P(\\theta)=(\\cos\\theta,\\sin\\theta)',
    lead: 'If sine and cosine already locate the point, do we really need to memorize four unrelated functions?',
    choices: [
      { id: 'yes', label: 'Yes' },
      { id: 'maybe', label: 'Maybe' },
      { id: 'show-me', label: 'Show me' },
    ],
    reveal: 'No separate list is needed. A ratio and three reciprocals build the rest.',
    tagline: 'Six functions. Two ingredients.',
  },

  quickPath: {
    title: 'I remember this - Quick Check',
    description: 'Answer all three diagnostic questions correctly to mark this lesson reviewed, or choose the guided path to rebuild the relationships.',
    passRequirement: { correct: 3, outOf: 3 },
    guidedLabel: 'Review it with me',
    quickLabel: 'Try quick check',
  },

  diagnostic: {
    id: 'six-functions-diagnostic',
    title: 'Three-question diagnostic',
    description: 'Use the connected definitions to show that the main relationships are still familiar.',
    passingScore: 3,
    questions: [
      {
        id: 'six-diagnostic-tangent',
        type: 'multiple-choice',
        prompt: 'Which expression builds tangent from sine and cosine?',
        options: [
          { id: 'a', math: '\\frac{\\cos\\theta}{\\sin\\theta}' },
          { id: 'b', math: '\\frac{\\sin\\theta}{\\cos\\theta}' },
          { id: 'c', math: '\\frac1{\\sin\\theta}' },
          { id: 'd', math: '\\frac1{\\cos\\theta}' },
        ],
        answerId: 'b',
        explanation: 'Tangent is vertical coordinate over horizontal coordinate, so it is sine divided by cosine.',
      },
      {
        id: 'six-diagnostic-pair',
        type: 'multiple-choice',
        prompt: 'Which reciprocal pair is correct?',
        options: [
          { id: 'a', math: '\\sin\\theta\\leftrightarrow\\sec\\theta' },
          { id: 'b', math: '\\cos\\theta\\leftrightarrow\\csc\\theta' },
          { id: 'c', math: '\\cos\\theta\\leftrightarrow\\sec\\theta' },
          { id: 'd', math: '\\sin\\theta\\leftrightarrow\\cot\\theta' },
        ],
        answerId: 'c',
        explanation: 'Secant is the reciprocal of cosine. Cosecant is the reciprocal of sine.',
      },
      {
        id: 'six-diagnostic-axis',
        type: 'multi-select',
        prompt: 'Which functions are defined at the top of the unit circle? Select all that apply.',
        promptMath: '\\theta=\\frac{\\pi}{2}',
        options: [
          { id: 'sin', math: '\\sin\\theta' },
          { id: 'cos', math: '\\cos\\theta' },
          { id: 'tan', math: '\\tan\\theta' },
          { id: 'csc', math: '\\csc\\theta' },
          { id: 'sec', math: '\\sec\\theta' },
          { id: 'cot', math: '\\cot\\theta' },
        ],
        answerIds: ['sin', 'cos', 'csc', 'cot'],
        explanation: 'Sine and cosine are both defined. A zero cosine makes tangent and secant undefined, while cosecant is 1 and cotangent is 0.',
      },
    ],
  },

  learningGoals: [
    'Interpret sine and cosine as unit-circle coordinates.',
    'Build tangent from sine and cosine.',
    'Pair sine, cosine, and tangent with their reciprocals.',
    'Use denominators to decide when a trig function is undefined.',
    'Evaluate all six functions at familiar angles.',
    'Connect unit-circle definitions with right-triangle ratios.',
  ],

  sineCosineFoundation: {
    label: 'Start with sine and cosine',
    title: 'One point gives the two foundation values.',
    pointMath: 'P(\\theta)=(x,y)',
    coordinateStatements: [
      {
        id: 'cos-coordinate',
        cue: 'horizontal coordinate',
        math: '\\cos\\theta=x',
      },
      {
        id: 'sin-coordinate',
        cue: 'vertical coordinate',
        math: '\\sin\\theta=y',
      },
    ],
    example: {
      angleMath: '\\theta=\\frac{\\pi}{3}',
      pointMath: 'P\\left(\\frac{\\pi}{3}\\right)=\\left(\\frac12,\\frac{\\sqrt3}{2}\\right)',
      conclusions: [
        '\\cos\\frac{\\pi}{3}=\\frac12',
        '\\sin\\frac{\\pi}{3}=\\frac{\\sqrt3}{2}',
      ],
    },
    whyItMatters: 'Sine and cosine are the foundation. Every other function in this lesson is a ratio or a reciprocal built from them.',
  },

  tangentBuild: {
    label: 'Build tangent',
    title: 'Compare vertical change with horizontal change.',
    openingPointMath: 'P(\\theta)=(x,y)',
    question: 'Which ratio compares the vertical coordinate with the horizontal coordinate?',
    steps: [
      {
        id: 'coordinate-ratio',
        label: 'Start with the coordinates',
        text: 'Place the vertical coordinate over the horizontal coordinate.',
        math: '\\tan\\theta=\\frac{y}{x}',
      },
      {
        id: 'coordinate-substitution',
        label: 'Replace each coordinate',
        text: 'The vertical coordinate is sine and the horizontal coordinate is cosine.',
        math: 'y=\\sin\\theta,\\qquad x=\\cos\\theta',
      },
      {
        id: 'tangent-identity',
        label: 'Connect the functions',
        text: 'Tangent is therefore a quotient of the two foundation functions.',
        math: '\\boxed{\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}}',
      },
    ],
    explorerExample: {
      angleMath: '\\theta=\\frac{\\pi}{4}',
      calculationMath: '\\tan\\frac{\\pi}{4}=\\frac{\\sqrt2/2}{\\sqrt2/2}=1',
    },
    discovery: {
      prompt: 'What happens as the point approaches the top of the unit circle?',
      limitMath: '\\cos\\theta\\to0\\quad\\text{as}\\quad\\theta\\to\\frac{\\pi}{2}',
      conclusionMath: '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}\\quad\\text{is undefined when }\\cos\\theta=0',
      note: 'Tangent works normally until its cosine denominator becomes zero.',
    },
  },

  reciprocalRelationships: {
    label: 'Build the reciprocals',
    question: 'What changes when each known function is turned upside down?',
    pairs: [
      {
        id: 'sin-csc',
        baseId: 'sin',
        reciprocalId: 'csc',
        baseMath: '\\sin\\theta',
        reciprocalMath: '\\csc\\theta',
        formulaMath: '\\boxed{\\csc\\theta=\\frac{1}{\\sin\\theta}}',
      },
      {
        id: 'cos-sec',
        baseId: 'cos',
        reciprocalId: 'sec',
        baseMath: '\\cos\\theta',
        reciprocalMath: '\\sec\\theta',
        formulaMath: '\\boxed{\\sec\\theta=\\frac{1}{\\cos\\theta}}',
      },
      {
        id: 'tan-cot',
        baseId: 'tan',
        reciprocalId: 'cot',
        baseMath: '\\tan\\theta',
        reciprocalMath: '\\cot\\theta',
        formulaMath: '\\boxed{\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}}\\quad\\left(\\cot\\theta=\\frac1{\\tan\\theta}\\text{ when tangent is defined}\\right)',
      },
    ],
    relationshipMap: {
      foundations: ['sin', 'cos'],
      ratio: { result: 'tan', numerator: 'sin', denominator: 'cos' },
      reciprocals: [
        ['sin', 'csc'],
        ['cos', 'sec'],
        ['tan', 'cot'],
      ],
    },
    memoryLine: 'Cosecant pairs with sine; secant pairs with cosine.',
  },

  triangleConnection: {
    label: 'Right-triangle connection',
    title: 'The same relationships appear as side-length ratios.',
    sideLabels: {
      opposite: 'opposite',
      adjacent: 'adjacent',
      hypotenuse: 'hypotenuse',
    },
    ratios: [
      { id: 'sin', math: '\\sin\\theta=\\frac{\\text{opposite}}{\\text{hypotenuse}}' },
      { id: 'cos', math: '\\cos\\theta=\\frac{\\text{adjacent}}{\\text{hypotenuse}}' },
      { id: 'tan', math: '\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}' },
      { id: 'csc', math: '\\csc\\theta=\\frac{\\text{hypotenuse}}{\\text{opposite}}' },
      { id: 'sec', math: '\\sec\\theta=\\frac{\\text{hypotenuse}}{\\text{adjacent}}' },
      { id: 'cot', math: '\\cot\\theta=\\frac{\\text{adjacent}}{\\text{opposite}}' },
    ],
    interactionPrompt: 'Make the triangle larger while preserving its angle. Did any ratio change?',
    discovery: 'No. Similar triangles may have different side lengths, but corresponding side ratios stay fixed when the angle stays fixed.',
  },

  undefinedReasoning: {
    label: 'When is a function undefined?',
    title: 'Inspect the denominator instead of memorizing a table.',
    rule: 'A zero denominator makes the function undefined.',
    ruleMath: '\\boxed{\\text{denominator}=0\\;\\Longrightarrow\\;\\text{function undefined}}',
    denominatorGroups: [
      {
        id: 'cosine-denominator',
        coordinateCondition: 'x=\\cos\\theta=0',
        functions: ['tan', 'sec'],
        formulas: [
          '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}',
          '\\sec\\theta=\\frac1{\\cos\\theta}',
        ],
        undefinedAt: '\\theta=\\frac{\\pi}{2}+k\\pi,\\qquad k\\in\\mathbb Z',
        visualCue: 'These are the top and bottom points where x = 0.',
      },
      {
        id: 'sine-denominator',
        coordinateCondition: 'y=\\sin\\theta=0',
        functions: ['csc', 'cot'],
        formulas: [
          '\\csc\\theta=\\frac1{\\sin\\theta}',
          '\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}',
        ],
        undefinedAt: '\\theta=k\\pi,\\qquad k\\in\\mathbb Z',
        visualCue: 'These are the left and right points where y = 0.',
      },
    ],
    alwaysDefined: {
      text: 'Sine and cosine are coordinates of every unit-circle point, so they are defined for every real angle.',
      math: '\\operatorname{dom}(\\sin)=\\operatorname{dom}(\\cos)=\\mathbb R',
    },
  },

  workedExample: {
    id: 'six-functions-example-pi-three',
    level: 'Foundation',
    title: 'Worked example - Build all six from two values',
    prompt: 'Find the exact values of all six trigonometric functions.',
    problemMath: '\\theta=\\frac{\\pi}{3}',
    steps: [
      {
        label: 'Locate the unit-circle point',
        text: 'At this standard angle, read the horizontal and vertical coordinates from the unit circle.',
        math: 'P\\left(\\frac{\\pi}{3}\\right)=\\left(\\frac12,\\frac{\\sqrt3}{2}\\right)',
      },
      {
        label: 'Read the foundation values',
        text: 'Cosine is horizontal and sine is vertical.',
        math: '\\cos\\frac{\\pi}{3}=\\frac12,\\qquad\\sin\\frac{\\pi}{3}=\\frac{\\sqrt3}{2}',
      },
      {
        label: 'Build tangent',
        text: 'Divide sine by cosine.',
        math: '\\tan\\frac{\\pi}{3}=\\frac{\\sqrt3/2}{1/2}=\\sqrt3',
      },
      {
        label: 'Take the reciprocals',
        text: 'Cosecant pairs with sine, secant with cosine, and cotangent with tangent.',
        math: '\\csc\\frac{\\pi}{3}=\\frac{2}{\\sqrt3}=\\frac{2\\sqrt3}{3},\\qquad\\sec\\frac{\\pi}{3}=2,\\qquad\\cot\\frac{\\pi}{3}=\\frac1{\\sqrt3}=\\frac{\\sqrt3}{3}',
      },
      {
        label: 'Check the signs',
        text: 'The point is in Quadrant I, so every value is positive.',
        math: '\\sin\\theta>0,\\;\\cos\\theta>0,\\;\\tan\\theta>0',
      },
    ],
    answerMath: '\\left(\\sin\\theta,\\cos\\theta,\\tan\\theta,\\csc\\theta,\\sec\\theta,\\cot\\theta\\right)=\\left(\\frac{\\sqrt3}{2},\\frac12,\\sqrt3,\\frac{2\\sqrt3}{3},2,\\frac{\\sqrt3}{3}\\right)',
    acceptedDisplayConventions: {
      cosecant: ['\\frac{2}{\\sqrt3}', '\\frac{2\\sqrt3}{3}'],
      cotangent: ['\\frac1{\\sqrt3}', '\\frac{\\sqrt3}{3}'],
      note: 'Both equivalent exact forms are correct; the rationalized form is used in the displayed answer.',
    },
  },

  practice: {
    id: 'six-functions-practice-three-pi-four',
    label: 'Your turn',
    title: 'Build six exact values from one point',
    directions: 'Enter exact values. Find sine and cosine first, then build the remaining four.',
    problemMath: '\\theta=\\frac{3\\pi}{4}',
    quadrant: 'Quadrant II',
    fields: [
      {
        id: 'sin',
        label: 'Sine',
        mathLabel: '\\sin\\frac{3\\pi}{4}',
        acceptedAnswers: ['sqrt(2)/2', 'sqrt2/2', '1/sqrt(2)', '1/sqrt2'],
        answerMath: '\\frac{\\sqrt2}{2}',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['-sqrt(2)/2', '-sqrt2/2'], message: 'The magnitude is right. Sine is positive above the x-axis in Quadrant II.' },
        ],
      },
      {
        id: 'cos',
        label: 'Cosine',
        mathLabel: '\\cos\\frac{3\\pi}{4}',
        acceptedAnswers: ['-sqrt(2)/2', '-sqrt2/2', '-1/sqrt(2)', '-1/sqrt2'],
        answerMath: '-\\frac{\\sqrt2}{2}',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['sqrt(2)/2', 'sqrt2/2'], message: 'The magnitude is right. Cosine is negative to the left of the y-axis.' },
        ],
      },
      {
        id: 'tan',
        label: 'Tangent',
        mathLabel: '\\tan\\frac{3\\pi}{4}',
        acceptedAnswers: ['-1'],
        answerMath: '-1',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['1'], message: 'Use sine divided by cosine. A positive numerator divided by a negative denominator is negative.' },
          { kind: 'relationship', message: 'Build tangent from sine divided by cosine.' },
        ],
      },
      {
        id: 'csc',
        label: 'Cosecant',
        mathLabel: '\\csc\\frac{3\\pi}{4}',
        acceptedAnswers: ['sqrt(2)', 'sqrt2', '2/sqrt(2)', '2/sqrt2'],
        answerMath: '\\sqrt2',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['-sqrt(2)', '-sqrt2'], message: 'Cosecant has the same sign as sine, which is positive in Quadrant II.' },
          { kind: 'swapped-reciprocal', message: 'Cosecant is paired with sine. Take the reciprocal of the sine value.' },
        ],
      },
      {
        id: 'sec',
        label: 'Secant',
        mathLabel: '\\sec\\frac{3\\pi}{4}',
        acceptedAnswers: ['-sqrt(2)', '-sqrt2', '-2/sqrt(2)', '-2/sqrt2'],
        answerMath: '-\\sqrt2',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['sqrt(2)', 'sqrt2'], message: 'Secant has the same sign as cosine, which is negative in Quadrant II.' },
          { kind: 'swapped-reciprocal', message: 'Secant is paired with cosine. Take the reciprocal of the cosine value.' },
        ],
      },
      {
        id: 'cot',
        label: 'Cotangent',
        mathLabel: '\\cot\\frac{3\\pi}{4}',
        acceptedAnswers: ['-1'],
        answerMath: '-1',
        feedbackRules: [
          { kind: 'opposite-sign', answers: ['1'], message: 'Cotangent is the reciprocal of tangent, so the sign must remain negative.' },
          { kind: 'relationship', message: 'Use cosine divided by sine, or take the reciprocal of tangent.' },
        ],
      },
    ],
    exactOnly: true,
    decimalFeedback: 'Use an exact value involving a fraction or radical rather than a decimal approximation.',
    hints: [
      'Hint 1: The terminal point is in Quadrant II. Its x-coordinate is negative and its y-coordinate is positive.',
      'Hint 2: Start with sine and cosine at the displayed reference angle. Then use tangent as a quotient and apply the three reciprocal pairs.',
    ],
    solution: {
      introduction: 'The reference angle supplies the magnitude; Quadrant II supplies the signs.',
      steps: [
        {
          text: 'Read the unit-circle coordinates.',
          math: 'P\\left(\\frac{3\\pi}{4}\\right)=\\left(-\\frac{\\sqrt2}{2},\\frac{\\sqrt2}{2}\\right)',
        },
        {
          text: 'Use the coordinates for cosine and sine.',
          math: '\\sin\\frac{3\\pi}{4}=\\frac{\\sqrt2}{2},\\qquad\\cos\\frac{3\\pi}{4}=-\\frac{\\sqrt2}{2}',
        },
        {
          text: 'Form the quotient for tangent.',
          math: '\\tan\\frac{3\\pi}{4}=\\frac{\\sqrt2/2}{-\\sqrt2/2}=-1',
        },
        {
          text: 'Take the reciprocal of each paired function.',
          math: '\\csc\\frac{3\\pi}{4}=\\sqrt2,\\qquad\\sec\\frac{3\\pi}{4}=-\\sqrt2,\\qquad\\cot\\frac{3\\pi}{4}=-1',
        },
      ],
      answerMath: '\\boxed{\\sin\\theta=\\frac{\\sqrt2}{2},\\;\\cos\\theta=-\\frac{\\sqrt2}{2},\\;\\tan\\theta=-1,\\;\\csc\\theta=\\sqrt2,\\;\\sec\\theta=-\\sqrt2,\\;\\cot\\theta=-1}',
    },
  },

  survivalChallenge: {
    id: 'which-functions-survive',
    title: 'Which functions survive?',
    directions: 'Choose an axis angle, select every function defined there, and then justify your choices from sine and cosine.',
    functionIds: ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'],
    angles: [
      {
        id: 'survive-zero',
        angleMath: '0',
        pointMath: '(1,0)',
        sinMath: '0',
        cosMath: '1',
        values: { sin: '0', cos: '1', tan: '0', csc: '\\text{undefined}', sec: '1', cot: '\\text{undefined}' },
        definedIds: ['sin', 'cos', 'tan', 'sec'],
        undefinedIds: ['csc', 'cot'],
        explanation: 'Sine is zero, so cosecant and cotangent divide by zero. Cosine is nonzero, so tangent and secant are defined.',
      },
      {
        id: 'survive-pi-two',
        angleMath: '\\frac{\\pi}{2}',
        pointMath: '(0,1)',
        sinMath: '1',
        cosMath: '0',
        values: { sin: '1', cos: '0', tan: '\\text{undefined}', csc: '1', sec: '\\text{undefined}', cot: '0' },
        definedIds: ['sin', 'cos', 'csc', 'cot'],
        undefinedIds: ['tan', 'sec'],
        explanation: 'Cosine is zero, so tangent and secant divide by zero. Cotangent is defined because its sine denominator is nonzero, and its value is zero.',
        emphasisMath: '\\cot\\frac{\\pi}{2}=\\frac{\\cos(\\pi/2)}{\\sin(\\pi/2)}=\\frac01=0',
      },
      {
        id: 'survive-pi',
        angleMath: '\\pi',
        pointMath: '(-1,0)',
        sinMath: '0',
        cosMath: '-1',
        values: { sin: '0', cos: '-1', tan: '0', csc: '\\text{undefined}', sec: '-1', cot: '\\text{undefined}' },
        definedIds: ['sin', 'cos', 'tan', 'sec'],
        undefinedIds: ['csc', 'cot'],
        explanation: 'Sine is zero, so cosecant and cotangent are undefined. Cosine is nonzero, so tangent is 0 and secant is -1.',
      },
      {
        id: 'survive-three-pi-two',
        angleMath: '\\frac{3\\pi}{2}',
        pointMath: '(0,-1)',
        sinMath: '-1',
        cosMath: '0',
        values: { sin: '-1', cos: '0', tan: '\\text{undefined}', csc: '-1', sec: '\\text{undefined}', cot: '0' },
        definedIds: ['sin', 'cos', 'csc', 'cot'],
        undefinedIds: ['tan', 'sec'],
        explanation: 'Cosine is zero, so tangent and secant are undefined. Sine is nonzero, so cosecant is -1 and cotangent is 0.',
      },
    ],
  },

  quickCheck: {
    title: 'Quick Check',
    description: 'Use the relationships, not a memorized six-row table.',
    passingScore: 3,
    questions: [
      {
        id: 'six-quick-tangent',
        type: 'multiple-choice',
        prompt: 'Which identity defines tangent?',
        options: [
          { id: 'a', math: '\\frac{\\cos\\theta}{\\sin\\theta}' },
          { id: 'b', math: '\\frac{\\sin\\theta}{\\cos\\theta}' },
          { id: 'c', math: '\\frac1{\\sin\\theta}' },
          { id: 'd', math: '\\frac1{\\cos\\theta}' },
        ],
        answerId: 'b',
        explanation: 'Tangent compares the vertical coordinate with the horizontal coordinate, so it is sine divided by cosine.',
      },
      {
        id: 'six-quick-reciprocal',
        type: 'multiple-choice',
        prompt: 'Which function is the reciprocal of cosine?',
        options: [
          { id: 'a', label: 'cosecant', math: '\\csc\\theta' },
          { id: 'b', label: 'secant', math: '\\sec\\theta' },
          { id: 'c', label: 'cotangent', math: '\\cot\\theta' },
          { id: 'd', label: 'tangent', math: '\\tan\\theta' },
        ],
        answerId: 'b',
        explanation: 'Secant and cosine are reciprocal partners.',
      },
      {
        id: 'six-quick-undefined',
        type: 'multi-select',
        prompt: 'If sine is zero, which functions must be undefined? Select all that apply.',
        promptMath: '\\sin\\theta=0',
        options: [
          { id: 'sin', math: '\\sin\\theta' },
          { id: 'cos', math: '\\cos\\theta' },
          { id: 'tan', math: '\\tan\\theta' },
          { id: 'csc', math: '\\csc\\theta' },
          { id: 'sec', math: '\\sec\\theta' },
          { id: 'cot', math: '\\cot\\theta' },
        ],
        answerIds: ['csc', 'cot'],
        explanation: 'Sine appears in the denominator of cosecant and cotangent. A zero sine makes exactly those two quotients undefined.',
      },
      {
        id: 'six-quick-value',
        type: 'expression',
        prompt: 'Use the given foundation values to find tangent.',
        promptMath: '\\sin\\theta=\\frac35,\\qquad\\cos\\theta=\\frac45',
        answerMath: '\\frac34',
        acceptedAnswers: ['3/4', '0.75'],
        hint: 'Divide sine by cosine, then simplify the complex fraction.',
        explanationMath: '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}=\\frac{3/5}{4/5}=\\frac34',
      },
    ],
  },

  optionalChallenge: {
    id: 'six-functions-quadrant-challenge',
    label: 'Challenge',
    title: 'Use two signs to recover the quadrant',
    prompt: 'Which quadrant contains the terminal point?',
    promptMath: '\\tan\\theta=-\\sqrt3,\\qquad\\cos\\theta<0',
    options: [
      { id: 'i', label: 'Quadrant I' },
      { id: 'ii', label: 'Quadrant II' },
      { id: 'iii', label: 'Quadrant III' },
      { id: 'iv', label: 'Quadrant IV' },
    ],
    answerId: 'ii',
    explanation: 'A negative cosine places the point on the left. Because tangent = sine/cosine is negative while cosine is negative, sine must be positive. Left and above is Quadrant II.',
    requiredForMastery: false,
  },

  commonMistakes: {
    title: 'Watch for these',
    featured: {
      id: 'swapped-sec-csc',
      question: 'What went wrong?',
      incorrectMath: '\\sec\\theta=\\frac1{\\sin\\theta},\\qquad\\csc\\theta=\\frac1{\\cos\\theta}',
      correctionMath: '\\boxed{\\sec\\theta=\\frac1{\\cos\\theta}},\\qquad\\boxed{\\csc\\theta=\\frac1{\\sin\\theta}}',
      explanation: 'The names sound similar, but the reciprocal pairs do not cross: secant pairs with cosine and cosecant pairs with sine.',
      memoryLine: 'Cosecant pairs with sine; secant pairs with cosine.',
    },
    items: [
      { id: 'sec-pair', text: 'Secant is reciprocal cosine, not reciprocal sine.', math: '\\sec\\theta=\\frac1{\\cos\\theta}' },
      { id: 'csc-pair', text: 'Cosecant is reciprocal sine.', math: '\\csc\\theta=\\frac1{\\sin\\theta}' },
      { id: 'tan-order', text: 'The order in the tangent ratio matters.', math: '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}' },
      { id: 'zero-denominator', text: 'A quotient is undefined precisely when its denominator is zero.', math: '\\frac{a}{0}\\text{ is undefined}' },
      { id: 'signs', text: 'An exact magnitude is incomplete without the correct quadrant sign.', math: '\\text{reference value}+\\text{quadrant sign}=\\text{exact value}' },
    ],
  },

  summary: {
    title: 'Six functions. Two foundations.',
    foundations: ['\\sin\\theta', '\\cos\\theta'],
    formulas: [
      '\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}',
      '\\csc\\theta=\\frac1{\\sin\\theta}',
      '\\sec\\theta=\\frac1{\\cos\\theta}',
      '\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}\\quad\\left(=\\frac1{\\tan\\theta}\\text{ when tangent is defined}\\right)',
    ],
    whyCalculus: {
      title: 'Why this matters in calculus',
      text: 'These functions recur in limits, derivatives, integrals, vectors, parametric curves, and polar coordinates. Seeing their relationships means there are fewer disconnected formulas to remember.',
      topics: ['limits', 'derivatives', 'integrals', 'vectors', 'parametric curves', 'polar coordinates'],
    },
  },

  completion: {
    title: 'You should now be able to',
    outcomes: [
      'build tangent from sine and cosine',
      'identify the three reciprocal pairs',
      'use denominators to find undefined values',
      'calculate all six functions from sine and cosine',
    ],
    rememberLabel: 'One thing to remember',
    rememberMath: '\\boxed{\\text{Start with sine and cosine. Build everything else.}}',
    actions: [
      { id: 'quick-check', label: 'Try Quick Check' },
      { id: 'review-again', label: 'Review Again' },
      { id: 'next-lesson', label: 'Next Lesson' },
    ],
  },
}

export const sixTrigQuickCheckQuestions = sixTrigFunctionsLesson.quickCheck.questions
export const sixTrigDiagnosticQuestions = sixTrigFunctionsLesson.diagnostic.questions
export const sixTrigSurvivalAngles = sixTrigFunctionsLesson.survivalChallenge.angles
export const sixTrigPractice = sixTrigFunctionsLesson.practice
export const sixTrigExactPractice = sixTrigFunctionsLesson.practice

export default sixTrigFunctionsLesson
