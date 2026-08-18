// This overview is separate from the existing practice bank so later visual
// lessons can grow without coupling navigation copy to individual questions.
export const trigonometryOverview = {
  foundation: '02',
  title: 'Trigonometry',
  subtitle: 'Angles, coordinates, and periodic change.',
  introduction: 'Trigonometry connects angles, coordinates, and periodic motion. Its functions describe relationships that appear throughout calculus whenever we study rotation, oscillation, waves, geometry, integration, and change.',
  whyItMatters: 'Trigonometric functions appear repeatedly in derivatives, integrals, parametric curves, polar coordinates, vectors, series, and mathematical models. A strong understanding of trigonometry makes later calculus significantly easier.',
  philosophy: ['See', 'Understand', 'Formalize', 'Practice', 'Correct Mistakes', 'Master'],
}

export const trigonometryReviewTopics = [
  'Radians and angles',
  'The unit circle',
  'The six trigonometric functions',
  'Exact values',
  'Fundamental identities',
  'Trigonometric graphs',
  'Periodicity',
  'Angle addition and subtraction',
  'Inverse trigonometric functions',
  'Hyperbolic functions',
]

export const trigonometryModules = [
  { number: '01', id: 'angles-radians', title: 'Angles and Radian Measure', description: 'Interpret an angle as rotation and connect radians to arc length.' },
  { number: '02', id: 'unit-circle', title: 'The Unit Circle', description: 'Read sine and cosine as the coordinates of a rotating point.' },
  { number: '03', id: 'six-functions', title: 'The Six Trigonometric Functions', description: 'Build tangent, cotangent, secant, and cosecant from sine and cosine.', status: 'Core Review · Interactive' },
  { number: '04', id: 'cofunctions', title: 'Cofunction Relationships', description: 'Use complementary angles to connect sine with cosine and tangent with cotangent.', status: 'Core Review · Interactive' },
  { number: '05', id: 'pythagorean-identities', title: 'Pythagorean Identities', description: 'Let the circle equation generate the three central identities.' },
  { number: '06', id: 'symmetry', title: 'Symmetry', description: 'Recognize even and odd behavior geometrically and graphically.' },
  { number: '07', id: 'graphs', title: 'Trigonometric Graphs', description: 'Trace periodic graphs from motion around the unit circle.' },
  { number: '08', id: 'periodicity', title: 'Periodicity', description: 'Explain why different trigonometric functions repeat over different intervals.' },
  { number: '09', id: 'transformations', title: 'Transformations', description: 'Interpret amplitude, period, phase shift, and vertical shift.' },
  { number: '10', id: 'angle-identities', title: 'Angle Addition and Subtraction', description: 'Develop exact-value tools from rotations and coordinate relationships.' },
  { number: '11', id: 'combined-sinusoid', title: 'Combining Sine and Cosine', description: 'Rewrite a linear combination as one shifted sinusoid.' },
  { number: '12', id: 'inverse-trig', title: 'Inverse Trigonometric Functions', description: 'Understand principal values through restricted and reflected graphs.' },
  { number: '13', id: 'hyperbolic', title: 'Hyperbolic Functions', description: 'Compare circular functions with an exponential family built from a hyperbola.', advanced: true },
]

export const trigonometryNextTopic = {
  previous: 'Algebra Review',
  next: 'Calculus I Review',
}
