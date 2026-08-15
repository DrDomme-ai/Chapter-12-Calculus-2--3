// The review catalog is deliberately separate from the page components. New
// modules can be added here without rebuilding the dashboard layout.

const makeModule = ({ routeId, ...module }) => ({
  ...module,
  routeId,
  // `route` is retained as a convenient alias for lightweight view routers.
  route: routeId,
})

export const calc2PrerequisiteModules = [
  makeModule({
    id: 'algebra-foundations',
    number: 1,
    title: 'Algebra',
    shortTitle: 'Algebra',
    description: 'Refresh the real-number system, inequalities, algebraic laws, exponents, functions, graphs, exponentials, and logarithms.',
    topics: ['Real numbers and intervals', 'Algebraic laws and exponents', 'Functions, graphs, exponentials, and logarithms'],
    progressKey: 'algebra',
    routeId: 'fundamental-algebra',
    status: 'available',
    questionTotal: 10,
  }),
  makeModule({
    id: 'functions',
    number: 2,
    title: 'Functions',
    shortTitle: 'Functions',
    description: 'Connect formulas, graphs, tables, domains, transformations, compositions, and inverse functions.',
    topics: ['Function language', 'Representations and families', 'Transformations, composition, and inverses'],
    progressKey: 'functions',
    routeId: 'calc2-functions',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'trigonometry-essentials',
    number: 3,
    title: 'Trigonometry',
    shortTitle: 'Trigonometry',
    description: 'Connect angles, coordinates, exact values, identities, periodic graphs, inverse functions, and calculus applications.',
    topics: ['Radians and the unit circle', 'Six functions, identities, and exact values', 'Graphs, periodicity, transformations, and inverse functions'],
    progressKey: 'trig',
    routeId: 'calc2-trig',
    status: 'available',
    questionTotal: 23,
  }),
  makeModule({
    id: 'limits',
    number: 4,
    title: 'Limits',
    shortTitle: 'Limits',
    description: 'Read limiting behavior from graphs and tables, evaluate limits algebraically, and interpret infinite and end behavior.',
    topics: ['One- and two-sided limits', 'Limit laws and indeterminate forms', 'Infinite limits and limits at infinity'],
    progressKey: 'limits',
    routeId: 'calc2-limits',
    status: 'available',
    questionTotal: 11,
  }),
  makeModule({
    id: 'continuity',
    number: 5,
    title: 'Continuity',
    shortTitle: 'Continuity',
    description: 'Use the limit definition of continuity, classify discontinuities, and apply the Intermediate Value Theorem.',
    topics: ['Continuity at a point', 'Types of discontinuity', 'Intermediate Value Theorem'],
    progressKey: 'continuity',
    routeId: 'calc2-continuity',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'derivatives',
    number: 6,
    title: 'Derivatives',
    shortTitle: 'Derivatives',
    description: 'Reconnect tangent slope and instantaneous change with the derivative definition and essential differentiation rules.',
    topics: ['Derivative as a limit', 'Interpretations of the derivative', 'Differentiation rules and implicit differentiation'],
    progressKey: 'derivatives',
    routeId: 'calc2-derivatives',
    status: 'available',
    questionTotal: 17,
  }),
  makeModule({
    id: 'applications-of-derivatives',
    number: 7,
    title: 'Applications of Derivatives',
    shortTitle: 'Derivative Applications',
    description: 'Use first- and second-derivative information to analyze graphs, locate extrema, and solve optimization problems.',
    topics: ['Critical numbers and extrema', 'Monotonicity and concavity', 'Optimization'],
    progressKey: 'derivativeApplications',
    routeId: 'calc2-derivative-applications',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'integrals',
    number: 8,
    title: 'Integrals',
    shortTitle: 'Integrals',
    description: 'Review antiderivatives, accumulation, definite integrals, the Fundamental Theorem of Calculus, and substitution.',
    topics: ['Area and accumulation', 'Fundamental Theorem of Calculus', 'Basic formulas and u-substitution'],
    progressKey: 'integrals',
    routeId: 'calc2-integrals',
    status: 'planned',
    questionTotal: 0,
  }),
]

export const calc2SupplementalModules = [
  makeModule({
    id: 'exponential-logarithmic-inverse-trig',
    label: 'Supplement',
    title: 'Exponentials, Logarithms & Inverse Trig',
    shortTitle: 'Exp, Logs & Inverse Trig',
    description: 'Target frequently used exponential, logarithmic, and inverse-trigonometric derivatives in one focused refresher.',
    topics: ['Exponential and logarithmic derivatives', 'Logarithmic differentiation', 'Inverse-trigonometric derivatives'],
    progressKey: 'expLog',
    routeId: 'calc2-exp-log',
    status: 'available',
    questionTotal: 13,
  }),
]

// Calculus III students need the same eight prerequisite modules before they
// revisit selected Calculus II material. Genuine multivariable topics begin in
// the course itself and therefore do not appear in this readiness catalog.
export const calc3SharedCoreModules = calc2PrerequisiteModules

export const calc3ExtensionModules = [
  makeModule({
    id: 'integration-techniques',
    number: 9,
    title: 'Integration Techniques',
    shortTitle: 'Integration Techniques',
    description: 'Refresh integration by parts, trigonometric methods, partial fractions, and improper integrals.',
    topics: ['Integration by parts', 'Trigonometric integrals and substitutions', 'Partial fractions and improper integrals'],
    progressKey: 'integrationTechniques',
    routeId: 'calc3-integration-techniques',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'parametric-equations',
    number: 10,
    title: 'Parametric Equations',
    shortTitle: 'Parametric Equations',
    description: 'Review parameterized motion, tangent slopes, second derivatives, and arc length.',
    topics: ['Parametric curves', 'First and second derivatives', 'Parametric arc length'],
    progressKey: 'parametric',
    routeId: 'calc3-parametric',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'polar-coordinates',
    number: 11,
    title: 'Polar Coordinates',
    shortTitle: 'Polar Coordinates',
    description: 'Reconnect polar and Cartesian coordinates and interpret familiar polar curves dynamically.',
    topics: ['Coordinate conversion', 'Polar graphs', 'Slopes and geometric interpretation'],
    progressKey: 'polar',
    routeId: 'calc3-polar',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'sequences-and-series',
    number: 12,
    title: 'Sequences & Series',
    shortTitle: 'Sequences & Series',
    description: 'Review sequence limits, partial sums, convergence, and the principal tests from Calculus II.',
    topics: ['Sequences and partial sums', 'Convergence and divergence', 'Core convergence tests'],
    progressKey: 'series',
    routeId: 'calc3-series',
    status: 'planned',
    questionTotal: 0,
  }),
  makeModule({
    id: 'power-and-taylor-series',
    number: 13,
    title: 'Power & Taylor Series',
    shortTitle: 'Power & Taylor Series',
    description: 'Refresh centers, intervals of convergence, and Taylor-polynomial approximations of familiar functions.',
    topics: ['Power series', 'Radius and interval of convergence', 'Taylor and Maclaurin series'],
    progressKey: 'taylorSeries',
    routeId: 'calc3-taylor-series',
    status: 'planned',
    questionTotal: 0,
  }),
]

// The shared Fundamental Review organizes the existing review modules by the
// mathematical stage they support. The module objects below are referenced,
// rather than copied, so progress keys and routes remain authoritative in one
// place while both courses use the same review library.
const modulesById = new Map(
  [
    ...calc2PrerequisiteModules,
    ...calc2SupplementalModules,
    ...calc3ExtensionModules,
  ].map((module) => [module.id, module]),
)

const selectModules = (...ids) => ids.map((id) => modulesById.get(id)).filter(Boolean)

export const fundamentalReviewFramework = Object.freeze([
  'Definitions',
  'Key Terms',
  'Important Formulas',
  'Visualizations',
  'Animations',
  'Worked Examples',
  'Practice',
  'Common Mistakes',
  'Mastery Check',
])

export const fundamentalReviewCatalog = {
  id: 'fundamental-review',
  title: 'Fundamental Review',
  subtitle: 'Strengthen the mathematics that calculus is built upon.',
  description: 'Move through one connected review library, or enter directly at the stage where you want to strengthen your foundation.',
  progression: ['Algebra', 'Trigonometry', 'Calculus I', 'Calculus II', 'Calculus III'],
  framework: fundamentalReviewFramework,
  categories: [
    {
      id: 'algebra',
      number: '01',
      title: 'Algebra',
      description: 'Reinforce the symbolic, equation-solving, function, and graph skills that every calculus topic assumes.',
      modules: selectModules('algebra-foundations'),
    },
    {
      id: 'trigonometry',
      number: '02',
      title: 'Trigonometry',
      description: 'Connect radians, the unit circle, graphs, identities, and inverse functions to later calculus work.',
      modules: selectModules('trigonometry-essentials'),
    },
    {
      id: 'calculus-1',
      number: '03',
      title: 'Calculus I',
      description: 'Review limits, continuity, derivatives, applications, and the integral ideas needed for Calculus II and III.',
      modules: selectModules(
        'limits',
        'continuity',
        'derivatives',
        'applications-of-derivatives',
        'integrals',
        'exponential-logarithmic-inverse-trig',
      ),
    },
    {
      id: 'calculus-2',
      number: '04',
      title: 'Calculus II',
      description: 'Refresh integration methods, parametric and polar ideas, and the sequence and series tools used later.',
      modules: selectModules(
        'integration-techniques',
        'parametric-equations',
        'polar-coordinates',
        'sequences-and-series',
        'power-and-taylor-series',
      ),
      courseId: 'calc2',
      courseLabel: 'Calculus II',
    },
    {
      id: 'calculus-3',
      number: '05',
      title: 'Calculus III',
      description: 'Consolidate multivariable foundations and identify the ideas that need another pass before moving forward.',
      modules: [],
      plannedTopics: ['Vectors and spatial geometry', 'Multivariable differentiation', 'Multiple integration', 'Vector fields'],
      courseId: 'calc3',
      courseLabel: 'Calculus III',
    },
  ],
}

export const calc2ReviewCatalog = {
  id: 'calc2',
  courseLabel: 'MATH 243 · Calculus II',
  eyebrow: 'Course preparation',
  title: 'Calculus II Fundamentals Review',
  description: 'Refresh the Calculus I and prerequisite mathematics you will use when studying integration, applications, parametric and polar curves, and series.',
  sharedCore: calc2PrerequisiteModules,
  supplemental: calc2SupplementalModules,
  extensions: [],
  continueLabel: 'Begin Calculus II',
}

export const calc3ReviewCatalog = {
  id: 'calc3',
  courseLabel: 'MATH 344 · Calculus III',
  eyebrow: 'Course preparation',
  title: 'Calculus III Readiness Review',
  description: 'Refresh the single-variable calculus, integration, parametric, polar, and series tools needed before multivariable calculus begins.',
  sharedCore: calc3SharedCoreModules,
  supplemental: calc2SupplementalModules,
  extensions: calc3ExtensionModules,
  continueLabel: 'Begin Calculus III',
}

export const reviewCatalog = {
  calc2: calc2ReviewCatalog,
  calc3: calc3ReviewCatalog,
}

// Descriptive aliases make the data easy to discover from either course page.
export const calculus2ReviewModules = calc2PrerequisiteModules
export const calculus3ReviewModules = [...calc3SharedCoreModules, ...calc3ExtensionModules]

export function getReviewCatalog(courseId) {
  return reviewCatalog[courseId] || calc2ReviewCatalog
}
