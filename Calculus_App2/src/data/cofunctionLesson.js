// Student-facing content for the fourth Trigonometry Fundamental Review
// lesson. Geometry is introduced before the identity list so the UI can
// reveal each relationship as a consequence of one fixed right triangle.

export const cofunctionLesson = {
  id: 'cofunction-relationships',
  number: '04',
  foundation: 'Foundation 02 - Trigonometry',
  title: 'Cofunction Relationships',
  shortTitle: 'Cofunctions',
  description: 'Use complementary angles to connect sine with cosine and tangent with cotangent.',
  status: 'Core Review',
  estimatedReviewTime: '10-12 minutes',
  quickPathTime: '3-5 minutes',

  introduction: {
    label: 'Opening question',
    title: 'One triangle, two acute viewpoints',
    angleMath: '\\theta+\\phi=\\frac{\\pi}{2}',
    question: 'The triangle did not change. Why do opposite and adjacent change?',
    views: [
      { id: 'theta', label: 'View from theta', math: '\\theta' },
      { id: 'phi', label: 'View from phi', math: '\\phi' },
    ],
    reveal: 'Opposite and adjacent are names relative to the angle being viewed. Changing the acute angle changes those two jobs, while the hypotenuse stays fixed.',
    tagline: 'Same triangle. Different point of view.',
  },

  quickPath: {
    title: 'I remember this - Quick Check',
    description: 'Pass the three-question diagnostic to mark the lesson reviewed, or follow the guided geometric path.',
    passRequirement: { correct: 3, outOf: 3 },
    quickLabel: 'Try quick check',
    guidedLabel: 'Review it with me',
  },

  diagnostic: {
    id: 'cofunction-diagnostic',
    title: 'Three-question diagnostic',
    passingScore: 3,
    questions: [
      {
        id: 'cofunction-diagnostic-complement',
        type: 'multiple-choice',
        prompt: 'Which angle is complementary to the given angle?',
        promptMath: '\\frac{\\pi}{6}',
        options: [
          { id: 'a', math: '\\frac{\\pi}{3}' },
          { id: 'b', math: '\\frac{5\\pi}{6}' },
          { id: 'c', math: '\\frac{2\\pi}{3}' },
          { id: 'd', math: '\\frac{11\\pi}{6}' },
        ],
        answerId: 'a',
        explanation: 'The two angles add to one right angle.',
        explanationMath: '\\frac{\\pi}{6}+\\frac{\\pi}{3}=\\frac{\\pi}{2}',
      },
      {
        id: 'cofunction-diagnostic-pair',
        type: 'multiple-choice',
        prompt: 'Complete the cofunction relationship.',
        promptMath: '\\sin\\theta=\\underline{\\qquad}',
        options: [
          { id: 'a', math: '\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'b', math: '\\csc\\theta' },
          { id: 'c', math: '\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'd', math: '\\cos\\theta' },
        ],
        answerId: 'a',
        explanation: 'Complement the angle and switch sine to its cofunction, cosine.',
      },
      {
        id: 'cofunction-diagnostic-distinction',
        type: 'multiple-choice',
        prompt: 'Which statement is a reciprocal identity rather than a cofunction identity?',
        options: [
          { id: 'a', math: '\\tan\\theta=\\cot\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'b', math: '\\sec\\theta=\\frac1{\\cos\\theta}' },
          { id: 'c', math: '\\cos\\theta=\\sin\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'd', math: '\\csc\\theta=\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)' },
        ],
        answerId: 'b',
        explanation: 'A reciprocal turns a value upside down. A cofunction relationship changes both the function and the angle.',
      },
    ],
  },

  learningGoals: [
    'Recognize complementary angles in degrees and radians.',
    'Find the complement of a given acute angle.',
    'Explain the sine-cosine relationship using one right triangle.',
    'Connect tangent with cotangent and secant with cosecant.',
    'Rewrite and evaluate expressions using cofunction identities.',
    'Distinguish cofunctions from reciprocal functions.',
  ],

  complementaryAngles: {
    label: 'Definition',
    title: 'Complementary angles complete a right angle.',
    text: 'Two angles are complementary when their measures add to one right angle.',
    degreeMath: '\\alpha+\\beta=90^{\\circ}',
    radianMath: '\\alpha+\\beta=\\frac{\\pi}{2}',
    complementText: 'The complement of an angle is the amount still needed to reach a right angle.',
    complementMath: '\\operatorname{comp}(\\theta)=\\frac{\\pi}{2}-\\theta',
    domainMath: '0<\\theta<\\frac{\\pi}{2}',
  },

  complementExplorer: {
    id: 'complement-explorer',
    label: 'Explore',
    title: 'Keep the sum fixed while the angles change.',
    minDegrees: 5,
    maxDegrees: 85,
    stepDegrees: 1,
    initialDegrees: 30,
    thetaMath: '\\theta',
    complementMath: '\\phi=\\frac{\\pi}{2}-\\theta',
    invariantMath: '\\theta+\\phi=\\frac{\\pi}{2}=90^{\\circ}',
    prompt: 'Move the angle. What stays constant?',
    reveal: 'The two measures change, but their sum remains one right angle.',
    presets: [
      {
        id: 'complement-30-60',
        thetaDegrees: 30,
        phiDegrees: 60,
        degreeMath: '30^{\\circ}\\leftrightarrow60^{\\circ}',
        radianMath: '\\frac{\\pi}{6}\\leftrightarrow\\frac{\\pi}{3}',
      },
      {
        id: 'complement-45-45',
        thetaDegrees: 45,
        phiDegrees: 45,
        degreeMath: '45^{\\circ}\\leftrightarrow45^{\\circ}',
        radianMath: '\\frac{\\pi}{4}\\leftrightarrow\\frac{\\pi}{4}',
      },
    ],
  },

  complementPractice: {
    id: 'complement-practice-pi-five',
    label: 'Your turn',
    prompt: 'Find the complement of the angle. Give an exact value.',
    problemMath: '\\frac{\\pi}{5}',
    acceptedAnswers: ['3pi/10', '(3pi)/10', '3*pi/10'],
    answerMath: '\\frac{3\\pi}{10}',
    hints: [
      'Subtract the given angle from one right angle.',
      'Rewrite both fractions with denominator 10 before subtracting.',
    ],
    feedbackRules: [
      {
        kind: 'supplement-instead-of-complement',
        answers: ['4pi/5', '(4pi)/5', '4*pi/5'],
        message: 'That angle completes a straight angle. A complement must add to one right angle.',
      },
      {
        kind: 'common-denominator',
        message: 'Use a common denominator before subtracting the fractions.',
      },
    ],
    solutionSteps: [
      '\\frac{\\pi}{2}-\\frac{\\pi}{5}',
      '\\frac{5\\pi}{10}-\\frac{2\\pi}{10}',
      '\\boxed{\\frac{3\\pi}{10}}',
    ],
  },

  sideRoleGeometry: {
    label: 'Why sine becomes cosine',
    title: 'Switch the angle; watch the side labels switch jobs.',
    triangle: {
      angleSumMath: '\\theta+\\phi=\\frac{\\pi}{2}',
      sides: [
        { id: 'a', math: 'a' },
        { id: 'b', math: 'b' },
        { id: 'c', math: 'c' },
      ],
      views: [
        {
          id: 'theta',
          label: 'View from theta',
          angleMath: '\\theta',
          oppositeSide: 'a',
          adjacentSide: 'b',
          hypotenuseSide: 'c',
          sineMath: '\\sin\\theta=\\frac{a}{c}',
          cosineMath: '\\cos\\theta=\\frac{b}{c}',
          tangentMath: '\\tan\\theta=\\frac{a}{b}',
        },
        {
          id: 'phi',
          label: 'View from complement',
          angleMath: '\\phi=\\frac{\\pi}{2}-\\theta',
          oppositeSide: 'b',
          adjacentSide: 'a',
          hypotenuseSide: 'c',
          sineMath: '\\sin\\phi=\\frac{b}{c}',
          cosineMath: '\\cos\\phi=\\frac{a}{c}',
          cotangentMath: '\\cot\\phi=\\frac{a}{b}',
        },
      ],
      accessibilityDescription: 'A fixed right triangle has legs a and b and hypotenuse c. Relative to theta, a is opposite and b is adjacent. Relative to phi, b is opposite and a is adjacent. Side c remains the hypotenuse in both views.',
    },
    sineDiscovery: {
      steps: [
        {
          text: 'From the first acute angle, side a is opposite.',
          math: '\\sin\\theta=\\frac{a}{c}',
        },
        {
          text: 'From the other acute angle, the same side a is adjacent.',
          math: '\\cos\\phi=\\frac{a}{c}',
        },
        {
          text: 'The ratios use the same two side lengths, so they are equal.',
          math: '\\sin\\theta=\\cos\\phi',
        },
        {
          text: 'Replace the second acute angle with the complement of the first.',
          math: '\\boxed{\\sin\\theta=\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)}',
        },
      ],
    },
    cosineDiscovery: {
      text: 'The same geometry in reverse turns the side adjacent to theta into the side opposite its complement.',
      steps: [
        '\\cos\\theta=\\frac{b}{c}',
        '\\sin\\phi=\\frac{b}{c}',
        '\\boxed{\\cos\\theta=\\sin\\left(\\frac{\\pi}{2}-\\theta\\right)}',
      ],
    },
    takeaway: 'Sine and cosine are cofunctions because opposite and adjacent switch when the acute viewpoint switches.',
  },

  tangentCotangent: {
    label: 'Tangent and cotangent',
    title: 'Switching the legs reverses the ratio.',
    steps: [
      {
        text: 'From theta, compare opposite with adjacent.',
        math: '\\tan\\theta=\\frac{a}{b}',
      },
      {
        text: 'From the complementary angle, side a is adjacent and side b is opposite.',
        math: '\\cot\\phi=\\frac{\\text{adjacent to }\\phi}{\\text{opposite to }\\phi}=\\frac{a}{b}',
      },
      {
        text: 'The equal side ratios produce the cofunction identity.',
        math: '\\boxed{\\tan\\theta=\\cot\\left(\\frac{\\pi}{2}-\\theta\\right)}',
      },
    ],
    reverseMath: '\\boxed{\\cot\\theta=\\tan\\left(\\frac{\\pi}{2}-\\theta\\right)}',
  },

  secantCosecant: {
    label: 'Secant and cosecant',
    title: 'Take reciprocals of the sine-cosine relationships.',
    derivations: [
      {
        startMath: '\\cos\\theta=\\sin\\left(\\frac{\\pi}{2}-\\theta\\right)',
        reciprocalMath: '\\frac1{\\cos\\theta}=\\frac1{\\sin\\left(\\frac{\\pi}{2}-\\theta\\right)}',
        resultMath: '\\boxed{\\sec\\theta=\\csc\\left(\\frac{\\pi}{2}-\\theta\\right)}',
      },
      {
        startMath: '\\sin\\theta=\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)',
        reciprocalMath: '\\frac1{\\sin\\theta}=\\frac1{\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)}',
        resultMath: '\\boxed{\\csc\\theta=\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)}',
      },
    ],
  },

  cofunctionPairs: {
    title: 'Three cofunction pairs',
    angleSwitchMath: '\\theta\\leftrightarrow\\frac{\\pi}{2}-\\theta',
    pairs: [
      { id: 'sin-cos', firstId: 'sin', secondId: 'cos', firstMath: '\\sin', secondMath: '\\cos' },
      { id: 'tan-cot', firstId: 'tan', secondId: 'cot', firstMath: '\\tan', secondMath: '\\cot' },
      { id: 'sec-csc', firstId: 'sec', secondId: 'csc', firstMath: '\\sec', secondMath: '\\csc' },
    ],
    rule: 'Complement the angle and switch to the paired cofunction.',
  },

  reciprocalDistinction: {
    label: 'Common mistake',
    title: 'Cofunctions are partners, not reciprocals.',
    cofunction: {
      label: 'Cofunction relationship',
      math: '\\sin\\theta=\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)',
      explanation: 'The function changes because the angle changes to its complement.',
    },
    reciprocal: {
      label: 'Reciprocal relationship',
      math: '\\csc\\theta=\\frac1{\\sin\\theta}',
      explanation: 'The angle stays the same while the function value is inverted.',
    },
    contrast: {
      text: 'Cosine has sine as its cofunction and secant as its reciprocal.',
      math: '\\operatorname{cofunction}(\\cos)=\\sin,\\qquad\\operatorname{reciprocal}(\\cos)=\\sec',
    },
  },

  matchingActivity: {
    id: 'cofunction-matching',
    title: 'Match each function with its complementary-angle form.',
    directions: 'Pair every item on the left with exactly one expression on the right.',
    leftItems: [
      { id: 'left-sin', math: '\\sin\\theta' },
      { id: 'left-cos', math: '\\cos\\theta' },
      { id: 'left-tan', math: '\\tan\\theta' },
      { id: 'left-cot', math: '\\cot\\theta' },
      { id: 'left-sec', math: '\\sec\\theta' },
      { id: 'left-csc', math: '\\csc\\theta' },
    ],
    rightItems: [
      { id: 'right-csc', math: '\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)' },
      { id: 'right-tan', math: '\\cot\\left(\\frac{\\pi}{2}-\\theta\\right)' },
      { id: 'right-cos', math: '\\sin\\left(\\frac{\\pi}{2}-\\theta\\right)' },
      { id: 'right-sec', math: '\\csc\\left(\\frac{\\pi}{2}-\\theta\\right)' },
      { id: 'right-sin', math: '\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)' },
      { id: 'right-cot', math: '\\tan\\left(\\frac{\\pi}{2}-\\theta\\right)' },
    ],
    matches: {
      'left-sin': 'right-sin',
      'left-cos': 'right-cos',
      'left-tan': 'right-tan',
      'left-cot': 'right-cot',
      'left-sec': 'right-sec',
      'left-csc': 'right-csc',
    },
    successMessage: 'Every function is paired with a complementary angle and its cofunction.',
  },

  exactValueConnections: {
    label: 'Exact-value connection',
    title: 'A known value can answer a complementary question.',
    examples: [
      {
        id: 'exact-sin-cos',
        complementMath: '\\frac{\\pi}{6}+\\frac{\\pi}{3}=\\frac{\\pi}{2}',
        knownMath: '\\sin\\frac{\\pi}{6}=\\frac12',
        questionMath: '\\cos\\frac{\\pi}{3}',
        resultMath: '\\boxed{\\sin\\frac{\\pi}{6}=\\cos\\frac{\\pi}{3}=\\frac12}',
        explanation: 'The angles are complementary and sine pairs with cosine.',
      },
      {
        id: 'exact-tan-cot',
        complementMath: '\\frac{\\pi}{6}+\\frac{\\pi}{3}=\\frac{\\pi}{2}',
        knownMath: '\\tan\\frac{\\pi}{6}=\\frac{\\sqrt3}{3}',
        questionMath: '\\cot\\frac{\\pi}{3}',
        resultMath: '\\boxed{\\tan\\frac{\\pi}{6}=\\cot\\frac{\\pi}{3}=\\frac{\\sqrt3}{3}}',
        explanation: 'The angles are complementary and tangent pairs with cotangent.',
      },
    ],
  },

  workedExample: {
    id: 'cofunction-worked-rewrite',
    level: 'Foundation',
    title: 'Worked example - Rewrite with a cofunction',
    prompt: 'Simplify the expression.',
    problemMath: '\\sin\\left(\\frac{\\pi}{2}-x\\right)',
    steps: [
      {
        label: 'Recognize the angle form',
        text: 'The input is the complement of x.',
        math: 'x+\\left(\\frac{\\pi}{2}-x\\right)=\\frac{\\pi}{2}',
      },
      {
        label: 'Identify the cofunction pair',
        text: 'Sine and cosine are cofunctions.',
        math: '\\sin\\leftrightarrow\\cos',
      },
      {
        label: 'Switch the function',
        text: 'Complementing the angle switches sine to cosine.',
        math: '\\boxed{\\sin\\left(\\frac{\\pi}{2}-x\\right)=\\cos x}',
      },
    ],
    answerMath: '\\cos x',
  },

  practice: {
    id: 'cofunction-guided-practice',
    label: 'Your turn',
    title: 'Recognize, rewrite, and evaluate',
    directions: 'Use a cofunction relationship for each part.',
    fields: [
      {
        id: 'practice-tan-cot',
        prompt: 'Simplify.',
        problemMath: '\\tan\\left(\\frac{\\pi}{2}-x\\right)',
        acceptedAnswers: ['cot(x)', 'cotx', 'cot x'],
        answerMath: '\\cot x',
        feedbackRules: [
          {
            kind: 'wrong-pair',
            answers: ['sec(x)', 'secx', 'sec x'],
            message: 'Tangent pairs with cotangent. Secant belongs with cosecant.',
          },
        ],
      },
      {
        id: 'practice-sec-csc',
        prompt: 'Simplify.',
        problemMath: '\\sec\\left(\\frac{\\pi}{2}-x\\right)',
        acceptedAnswers: ['csc(x)', 'cscx', 'csc x', 'cosecant(x)'],
        answerMath: '\\csc x',
        feedbackRules: [
          {
            kind: 'reciprocal-confusion',
            answers: ['cos(x)', 'cosx', 'cos x'],
            message: 'Cosine is secant\'s reciprocal. Cosecant is secant\'s cofunction.',
          },
        ],
      },
      {
        id: 'practice-complement-value',
        prompt: 'Use the given value to determine the requested value.',
        givenMath: '\\sin28^{\\circ}\\approx0.4695',
        problemMath: '\\cos62^{\\circ}',
        acceptedAnswers: ['0.4695', '.4695'],
        answerMath: '0.4695',
        feedbackRules: [
          {
            kind: 'angle-check',
            message: 'Check whether the two degree measures add to a right angle before calculating again.',
          },
        ],
      },
    ],
    hints: [
      'Hint 1: Do the two angles add to a right angle?',
      'Hint 2: Which functions form a cofunction pair?',
      'Hint 3: Switching acute angles makes opposite and adjacent exchange roles.',
    ],
    solution: {
      steps: [
        {
          part: '1',
          math: '\\boxed{\\tan\\left(\\frac{\\pi}{2}-x\\right)=\\cot x}',
          text: 'Tangent and cotangent are cofunctions.',
        },
        {
          part: '2',
          math: '\\boxed{\\sec\\left(\\frac{\\pi}{2}-x\\right)=\\csc x}',
          text: 'Secant and cosecant are cofunctions.',
        },
        {
          part: '3',
          math: '28^{\\circ}+62^{\\circ}=90^{\\circ}\\quad\\Longrightarrow\\quad\\boxed{\\cos62^{\\circ}=\\sin28^{\\circ}\\approx0.4695}',
          text: 'The known and requested values are equal because the angles are complementary.',
        },
      ],
    },
  },

  unitCircleConnection: {
    label: 'Optional visualization',
    title: 'The coordinate pair switches across the line y = x.',
    domainMath: '0<\\theta<\\frac{\\pi}{2}',
    originalPointMath: 'P(\\theta)=(\\cos\\theta,\\sin\\theta)',
    complementPointMath: 'P\\left(\\frac{\\pi}{2}-\\theta\\right)=(\\sin\\theta,\\cos\\theta)',
    explanation: 'Within Quadrant I, complementary angles exchange the horizontal and vertical coordinates. This is the unit-circle version of the side-role switch in the triangle.',
  },

  quickCheck: {
    title: 'Quick Check',
    description: 'Use the complement first, then choose the paired cofunction.',
    passingScore: 3,
    questions: [
      {
        id: 'cofunction-quick-complement',
        type: 'multiple-choice',
        prompt: 'Find the complement of the given angle.',
        promptMath: '\\frac{\\pi}{5}',
        options: [
          { id: 'a', math: '\\frac{\\pi}{5}' },
          { id: 'b', math: '\\frac{3\\pi}{10}' },
          { id: 'c', math: '\\frac{4\\pi}{5}' },
          { id: 'd', math: '\\frac{\\pi}{10}' },
        ],
        answerId: 'b',
        explanationMath: '\\frac{\\pi}{2}-\\frac{\\pi}{5}=\\frac{5\\pi-2\\pi}{10}=\\frac{3\\pi}{10}',
      },
      {
        id: 'cofunction-quick-sine',
        type: 'multiple-choice',
        prompt: 'Complete the identity.',
        promptMath: '\\sin\\theta=\\underline{\\qquad}',
        options: [
          { id: 'a', math: '\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'b', math: '\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'c', math: '\\cot\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'd', math: '\\csc\\left(\\frac{\\pi}{2}-\\theta\\right)' },
        ],
        answerId: 'b',
        explanation: 'Sine and cosine are cofunctions.',
      },
      {
        id: 'cofunction-quick-tangent',
        type: 'expression',
        prompt: 'Simplify.',
        promptMath: '\\tan\\left(\\frac{\\pi}{2}-x\\right)',
        acceptedAnswers: ['cot(x)', 'cotx', 'cot x'],
        answerMath: '\\cot x',
        hint: 'Switch tangent to its cofunction.',
        explanationMath: '\\tan\\left(\\frac{\\pi}{2}-x\\right)=\\cot x',
      },
      {
        id: 'cofunction-quick-reciprocal',
        type: 'multiple-choice',
        prompt: 'Which statement is a reciprocal identity rather than a cofunction identity?',
        options: [
          { id: 'a', math: '\\sin\\theta=\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'b', math: '\\tan\\theta=\\cot\\left(\\frac{\\pi}{2}-\\theta\\right)' },
          { id: 'c', math: '\\sec\\theta=\\frac1{\\cos\\theta}' },
          { id: 'd', math: '\\csc\\theta=\\sec\\left(\\frac{\\pi}{2}-\\theta\\right)' },
        ],
        answerId: 'c',
        explanation: 'The reciprocal identity keeps the same angle and inverts cosine. The other statements change to complementary angles.',
      },
    ],
  },

  optionalChallenge: {
    id: 'cofunction-angle-sum-connection',
    label: 'Challenge / Connection',
    title: 'Rewrite before evaluating',
    prompt: 'Without a calculator, use a cofunction relationship and a known exact value to evaluate.',
    problemMath: '\\cos\\frac{5\\pi}{12}',
    rewriteMath: '\\cos\\frac{5\\pi}{12}=\\sin\\left(\\frac{\\pi}{2}-\\frac{5\\pi}{12}\\right)=\\sin\\frac{\\pi}{12}',
    answerMath: '\\frac{\\sqrt6-\\sqrt2}{4}',
    acceptedAnswers: ['(sqrt(6)-sqrt(2))/4', '(sqrt6-sqrt2)/4'],
    explanation: 'The cofunction step changes cosine of the larger complementary angle into sine of the smaller angle. Evaluating the final special value uses an angle-difference result from a later identity lesson.',
    requiredForMastery: false,
  },

  commonMistakes: {
    title: 'Watch for these',
    featured: {
      id: 'complement-versus-supplement',
      question: 'What went wrong?',
      incorrectMath: '\\operatorname{comp}(\\theta)=\\pi-\\theta',
      correctionMath: '\\boxed{\\operatorname{comp}(\\theta)=\\frac{\\pi}{2}-\\theta}',
      explanation: 'Subtracting from pi produces a supplementary angle. Complementary angles add to a right angle, not a straight angle.',
    },
    items: [
      {
        id: 'not-reciprocal',
        text: 'A complement is an angle relationship; a reciprocal inverts a function value.',
        correctionMath: '\\cos\\left(\\frac{\\pi}{2}-\\theta\\right)=\\sin\\theta\\qquad\\text{but}\\qquad\\frac1{\\sin\\theta}=\\csc\\theta',
      },
      { id: 'sin-cos-pair', text: 'Sine pairs with cosine.', math: '\\sin\\leftrightarrow\\cos' },
      { id: 'tan-cot-pair', text: 'Tangent pairs with cotangent.', math: '\\tan\\leftrightarrow\\cot' },
      { id: 'sec-csc-pair', text: 'Secant pairs with cosecant.', math: '\\sec\\leftrightarrow\\csc' },
      {
        id: 'arbitrary-angle-change',
        text: 'A cofunction identity requires complementary angles, not an arbitrary change of input.',
        math: '\\alpha+\\beta=\\frac{\\pi}{2}',
      },
    ],
  },

  summary: {
    title: 'Same triangle. Opposite and adjacent switch.',
    complementMath: '\\theta+\\left(\\frac{\\pi}{2}-\\theta\\right)=\\frac{\\pi}{2}',
    pairMap: [
      '\\boxed{\\sin\\leftrightarrow\\cos}',
      '\\boxed{\\tan\\leftrightarrow\\cot}',
      '\\boxed{\\sec\\leftrightarrow\\csc}',
    ],
    keyMessage: 'The function changes to its cofunction when the angle changes to its complement.',
    whyCalculus: {
      title: 'Why this matters in calculus',
      text: 'Cofunction relationships help rewrite equivalent trigonometric expressions, simplify identities, interpret phase shifts, and connect the shapes of sine and cosine graphs.',
      topics: ['equivalent forms', 'identities', 'phase shifts', 'sine and cosine graphs'],
    },
  },

  completion: {
    title: 'You should now be able to',
    outcomes: [
      'find the complement of an angle',
      'explain why sine and cosine are cofunctions',
      'pair tangent with cotangent',
      'pair secant with cosecant',
      'rewrite expressions using complementary angles',
    ],
    rememberLabel: 'One thing to remember',
    rememberMath: '\\boxed{\\text{Complement the angle, switch to the cofunction.}}',
    actions: [
      { id: 'quick-check', label: 'Try Quick Check' },
      { id: 'review-again', label: 'Review Again' },
      { id: 'next-lesson', label: 'Next Lesson' },
    ],
  },
}

export const cofunctionDiagnosticQuestions = cofunctionLesson.diagnostic.questions
export const cofunctionPairs = cofunctionLesson.cofunctionPairs.pairs
export const cofunctionMatchingActivity = cofunctionLesson.matchingActivity
export const cofunctionPractice = cofunctionLesson.practice
export const cofunctionQuickCheckQuestions = cofunctionLesson.quickCheck.questions

export default cofunctionLesson
