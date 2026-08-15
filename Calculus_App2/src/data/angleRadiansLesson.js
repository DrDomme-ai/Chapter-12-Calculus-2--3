// Phase 2 lesson content for the shared Fundamental Review. Keeping the
// mathematics in data allows the lesson UI, narration, worked-example reveal,
// practice, and mastery systems to present the same verified source material.

export const angleRadiansLesson = {
  id: 'angles-and-radians',
  number: '01',
  foundation: 'Foundation 02 · Trigonometry',
  title: 'Angles and Radian Measure',
  shortTitle: 'Angles & Radians',
  introduction: {
    question: 'How can one number describe a rotation?',
    text: 'An angle records directed rotation from an initial ray to a terminal ray. Degree and radian measures describe the same motion using different scales; radians are the scale naturally produced by the geometry of a circle.',
    whyItMatters: {
      label: 'Why this matters',
      text: 'Calculus uses angles to describe circular motion, oscillation, waves, polar curves, and vector direction. Fluency with radians lets the geometry and the calculus formulas fit together without artificial conversion factors.',
    },
  },

  definition: {
    label: 'Definition',
    title: 'An angle is a directed rotation.',
    text: 'Fix an initial ray. Rotating it about its endpoint produces a terminal ray. Counterclockwise rotation is positive, clockwise rotation is negative, and rotations differing by a whole number of turns are coterminal.',
    positiveDirection: 'Counterclockwise',
    negativeDirection: 'Clockwise',
    coterminalFormula: '\\theta+2\\pi k,\\qquad k\\in\\mathbb Z',
  },

  radianDefinition: {
    label: 'Geometric definition',
    title: 'Radians compare arc length with radius.',
    text: 'For a central angle that intercepts an arc of length s in a circle of radius r, its radian measure is the ratio of those two lengths.',
    formula: '\\theta=\\frac{s}{r},\\qquad r>0',
    equivalentFormula: 's=r\\theta',
    oneRadian: 'One radian is the central angle that intercepts an arc whose length equals the radius.',
    interpretation: 'Because s and r use the same unit of length, their ratio is unitless. That makes radian measure a natural numerical description of rotation.',
  },

  specialEquivalences: [
    { degrees: 360, degreeMath: '360^{\\circ}', radians: '2\\pi', revolutions: '1' },
    { degrees: 180, degreeMath: '180^{\\circ}', radians: '\\pi', revolutions: '\\frac12' },
    { degrees: 90, degreeMath: '90^{\\circ}', radians: '\\frac{\\pi}{2}', revolutions: '\\frac14' },
    { degrees: 60, degreeMath: '60^{\\circ}', radians: '\\frac{\\pi}{3}', revolutions: '\\frac16' },
    { degrees: 45, degreeMath: '45^{\\circ}', radians: '\\frac{\\pi}{4}', revolutions: '\\frac18' },
    { degrees: 30, degreeMath: '30^{\\circ}', radians: '\\frac{\\pi}{6}', revolutions: '\\frac1{12}' },
  ],

  conversionFormulas: [
    {
      id: 'degrees-to-radians',
      title: 'Degrees to radians',
      cue: 'Multiply by a form of 1 that cancels degrees.',
      formula: '\\theta_{\\mathrm{rad}}=\\theta_{\\mathrm{deg}}\\left(\\frac{\\pi\\ \\mathrm{rad}}{180^{\\circ}}\\right)',
      factor: '\\frac{\\pi\\ \\mathrm{rad}}{180^{\\circ}}=1',
    },
    {
      id: 'radians-to-degrees',
      title: 'Radians to degrees',
      cue: 'Multiply by the reciprocal conversion factor so radians cancel.',
      formula: '\\theta_{\\mathrm{deg}}=\\theta_{\\mathrm{rad}}\\left(\\frac{180^{\\circ}}{\\pi\\ \\mathrm{rad}}\\right)',
      factor: '\\frac{180^{\\circ}}{\\pi\\ \\mathrm{rad}}=1',
    },
  ],

  whyRadians: {
    label: 'Why does calculus use radians?',
    title: 'Radians make circular change direct.',
    paragraphs: [
      'The definition of a radian already contains the geometry of a circle. Once the angle is measured in radians, arc length is simply radius times angle; no additional conversion constant is needed.',
      'Radians also make small angular changes and small vertical changes in the sine function agree at the origin. That geometric fact is what gives the standard derivative of sine its clean form.',
    ],
    formulas: [
      's=r\\theta',
      '\\lim_{h\\to0}\\frac{\\sin h}{h}=1',
      '\\frac{d}{dx}\\sin x=\\cos x\\qquad\\text{(when }x\\text{ is measured in radians)}',
    ],
    degreeContrast: '\\frac{d}{dx}\\sin\\!\\left(\\frac{\\pi x}{180}\\right)=\\frac{\\pi}{180}\\cos\\!\\left(\\frac{\\pi x}{180}\\right)',
    conclusion: 'Using degrees would insert the factor π/180 into the derivative. Radian measure is therefore not a classroom convention; it is the scale that matches the local geometry of the circle.',
  },

  workedExamples: [
    {
      id: 'angle-example-foundation',
      level: 'Foundation',
      title: 'Example 1 — Foundation',
      prompt: 'Convert the angle to radians and give an exact value.',
      problemMath: '150^{\\circ}',
      steps: [
        {
          label: 'Choose a conversion factor',
          text: 'The desired unit is radians, so place degrees in the denominator of the conversion factor.',
          math: '150^{\\circ}\\left(\\frac{\\pi\\ \\mathrm{rad}}{180^{\\circ}}\\right)',
        },
        {
          label: 'Cancel units',
          text: 'The degree units cancel, leaving a radian measure.',
          math: '\\frac{150\\pi}{180}\\ \\mathrm{rad}',
        },
        {
          label: 'Reduce the exact fraction',
          text: 'Divide numerator and denominator by 30.',
          math: '\\boxed{\\frac{5\\pi}{6}\\ \\mathrm{rad}}',
        },
      ],
      answer: '\\frac{5\\pi}{6}',
    },
    {
      id: 'angle-example-intermediate',
      level: 'Intermediate',
      title: 'Example 2 — Intermediate',
      prompt: 'Convert the directed angle to degrees. Then identify its least positive coterminal angle.',
      problemMath: '-\\frac{7\\pi}{4}',
      steps: [
        {
          label: 'Convert radians to degrees',
          text: 'Use the factor whose radian unit cancels.',
          math: '-\\frac{7\\pi}{4}\\left(\\frac{180^{\\circ}}{\\pi}\\right)',
        },
        {
          label: 'Simplify',
          text: 'Cancel π and evaluate 180 ÷ 4.',
          math: '-7(45^{\\circ})=-315^{\\circ}',
        },
        {
          label: 'Find a positive coterminal measure',
          text: 'Add one complete revolution. This changes the numerical label but not the terminal ray.',
          math: '-315^{\\circ}+360^{\\circ}=\\boxed{45^{\\circ}}',
        },
      ],
      answer: '-315^{\\circ}\\text{; least positive coterminal angle }45^{\\circ}',
    },
    {
      id: 'angle-example-challenge',
      level: 'Challenge',
      title: 'Example 3 — Challenge',
      prompt: 'A circle has radius 8 and an intercepted arc of length 10π. Find the central angle in radians, in degrees, and as a fraction of a revolution.',
      problemMath: 'r=8,\\qquad s=10\\pi',
      steps: [
        {
          label: 'Use the radian definition',
          text: 'Radian measure is arc length divided by radius.',
          math: '\\theta=\\frac{s}{r}=\\frac{10\\pi}{8}=\\frac{5\\pi}{4}',
        },
        {
          label: 'Convert to degrees',
          text: 'Now convert the exact radian value.',
          math: '\\frac{5\\pi}{4}\\left(\\frac{180^{\\circ}}{\\pi}\\right)=225^{\\circ}',
        },
        {
          label: 'Compare with one full turn',
          text: 'Divide the angle by 2π radians, the measure of one revolution.',
          math: '\\frac{5\\pi/4}{2\\pi}=\\frac58',
        },
        {
          label: 'State all three forms',
          text: 'Each form describes the same directed rotation.',
          math: '\\boxed{\\theta=\\frac{5\\pi}{4}=225^{\\circ}=\\frac58\\text{ revolution}}',
        },
      ],
      answer: '\\frac{5\\pi}{4}\\text{ radians},\\ 225^{\\circ},\\ \\frac58\\text{ revolution}',
    },
  ],

  practice: {
    id: 'angle-radians-practice',
    label: 'Your turn',
    title: 'Connect degrees, radians, and arc length',
    directions: 'Give exact values. Complete all three parts before opening the full solution.',
    parts: [
      {
        id: 'practice-degrees-to-radians',
        prompt: 'Convert to radians.',
        math: '315^{\\circ}',
        acceptedAnswers: ['7pi/4', '(7pi)/4', '7*pi/4'],
        answerMath: '\\frac{7\\pi}{4}',
      },
      {
        id: 'practice-radians-to-degrees',
        prompt: 'Convert to degrees.',
        math: '-\\frac{5\\pi}{3}',
        acceptedAnswers: ['-300'],
        answerMath: '-300^{\\circ}',
      },
      {
        id: 'practice-arc-length',
        prompt: 'Find the intercepted arc length.',
        math: 'r=9,\\qquad \\theta=\\frac{2\\pi}{3}',
        acceptedAnswers: ['6pi', '6*pi'],
        answerMath: '6\\pi',
      },
    ],
    hints: [
      'Hint 1: Choose the conversion factor by asking which unit must cancel. For the arc-length part, the angle is already in radians.',
      'Hint 2: Reduce 315/180, cancel π in the second conversion, and substitute r = 9 and θ = 2π/3 into s = rθ.',
    ],
    solution: {
      introduction: 'Write the relevant relationship before substituting so that the units guide the computation.',
      steps: [
        {
          part: 'a',
          math: '315^{\\circ}\\left(\\frac{\\pi}{180^{\\circ}}\\right)=\\frac{315\\pi}{180}=\\boxed{\\frac{7\\pi}{4}}',
        },
        {
          part: 'b',
          math: '-\\frac{5\\pi}{3}\\left(\\frac{180^{\\circ}}{\\pi}\\right)=-5(60^{\\circ})=\\boxed{-300^{\\circ}}',
        },
        {
          part: 'c',
          math: 's=r\\theta=9\\left(\\frac{2\\pi}{3}\\right)=\\boxed{6\\pi}',
        },
      ],
    },
  },

  commonMistake: {
    id: 'degree-in-radian-formula',
    label: 'Common mistake',
    title: 'Using a degree measure directly in a radian formula',
    question: 'What went wrong?',
    scenario: 'A circle has radius 8 and central angle 60°. A student writes:',
    incorrectMath: 's=r\\theta=8(60)=480',
    explanation: 'The relationship s = rθ assumes θ is measured in radians. The number 60 is a degree measure, so substituting it directly changes the scale by a factor of 180/π.',
    correctionSteps: [
      '60^{\\circ}\\left(\\frac{\\pi}{180^{\\circ}}\\right)=\\frac{\\pi}{3}',
      's=8\\left(\\frac{\\pi}{3}\\right)=\\boxed{\\frac{8\\pi}{3}}',
    ],
    calculusConnection: 'The same unit issue appears in differentiation: d(sin x)/dx = cos x without an extra scale factor only when x is a radian measure.',
  },

  conceptChecks: [
    {
      id: 'angle-concept-ratio',
      prompt: 'Why is radian measure dimensionless?',
      options: [
        'It is defined as a ratio of two lengths measured in the same unit.',
        'Angles have no geometric meaning.',
        'The radius is always equal to 1.',
      ],
      answer: 'It is defined as a ratio of two lengths measured in the same unit.',
      explanation: 'In θ = s/r, the length units cancel. A unit circle is useful, but radius 1 is not required for the definition.',
    },
    {
      id: 'angle-concept-scale',
      prompt: 'If the radius doubles while the radian angle remains fixed, what happens to the intercepted arc length?',
      options: ['It is cut in half.', 'It stays fixed.', 'It doubles.'],
      answer: 'It doubles.',
      explanation: 'Since s = rθ, holding θ fixed makes arc length directly proportional to radius.',
    },
    {
      id: 'angle-concept-derivative',
      prompt: 'Why do standard calculus formulas prefer radians?',
      options: [
        'Radians make every angle an integer.',
        'Radians align angle with arc length and remove conversion constants from derivatives.',
        'Degree measures cannot describe negative rotation.',
      ],
      answer: 'Radians align angle with arc length and remove conversion constants from derivatives.',
      explanation: 'The ratio definition θ = s/r produces the natural local scale in which the derivative of sin x is exactly cos x.',
    },
  ],

  summary: {
    title: 'Angles and radians — key ideas',
    points: [
      'An angle measures directed rotation: counterclockwise is positive and clockwise is negative.',
      'A radian compares intercepted arc length with radius through θ = s/r.',
      'One complete revolution is 360° = 2π radians.',
      'Convert units with a factor equal to 1, arranging it so the unwanted unit cancels.',
      'Use radians in s = rθ and in the standard derivative and integral formulas for trigonometric functions.',
    ],
    formulaReview: [
      '360^{\\circ}=2\\pi\\text{ rad}',
      '\\theta_{\\mathrm{rad}}=\\theta_{\\mathrm{deg}}\\frac{\\pi}{180}',
      '\\theta_{\\mathrm{deg}}=\\theta_{\\mathrm{rad}}\\frac{180}{\\pi}',
      '\\theta=\\frac{s}{r}\\iff s=r\\theta',
    ],
  },

  masteryQuestions: [
    {
      id: 'angle-mastery-conversion',
      category: 'Radians',
      type: 'expression',
      prompt: 'Convert to radians. Give an exact value.',
      math: '225^{\\circ}',
      acceptedAnswers: ['5pi/4', '(5pi)/4', '5*pi/4'],
      answerMath: '\\frac{5\\pi}{4}',
      hints: ['Multiply by π/180 and reduce 225/180.'],
      explanation: '225°(π/180°) = 5π/4.',
    },
    {
      id: 'angle-mastery-arc',
      category: 'Arc length',
      type: 'expression',
      prompt: 'Find the exact arc length.',
      math: 'r=6,\\qquad \\theta=\\frac{7\\pi}{6}',
      acceptedAnswers: ['7pi', '7*pi'],
      answerMath: '7\\pi',
      hints: ['The angle is already in radians, so use s = rθ.'],
      explanation: 's = 6(7π/6) = 7π.',
    },
    {
      id: 'angle-mastery-definition',
      category: 'Radian definition',
      type: 'multi-expression',
      prompt: 'An arc has length 5π in a circle of radius 10. Find the central angle in radians and degrees.',
      math: 's=5\\pi,\\qquad r=10',
      fields: [
        {
          id: 'radians',
          label: 'Radians',
          acceptedAnswers: ['pi/2', '(pi)/2'],
          answerMath: '\\frac{\\pi}{2}',
        },
        {
          id: 'degrees',
          label: 'Degrees',
          acceptedAnswers: ['90'],
          answerMath: '90^{\\circ}',
        },
      ],
      hints: ['First use θ = s/r; then convert the result to degrees.'],
      explanation: 'θ = 5π/10 = π/2 radians, which is 90°.',
    },
  ],
}

export const angleRadiansMasteryQuestions = angleRadiansLesson.masteryQuestions

export default angleRadiansLesson
