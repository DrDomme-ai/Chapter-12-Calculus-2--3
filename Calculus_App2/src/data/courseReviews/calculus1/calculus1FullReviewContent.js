// EDIT CALCULUS I FUNDAMENTAL REVIEW CONTENT HERE.
// Add a station by copying one object in `stations`. Add an activity by copying
// a question inside that station. Every question needs a unique `id`.

const question=(id,title,prompt,acceptedAnswers,explanation,math)=>({
  id,type:'expression',title,prompt,math,acceptedAnswers,hints:['Identify the relevant definition or theorem.','Write the governing equation before simplifying.'],explanation,
})

export const continuityReview = {
  titleLines: ['Continuity', 'Fundamental Review'],

  description:
    'Build a complete understanding of continuity by connecting graphs, limits, function values, one-sided behavior, discontinuities, piecewise functions, and the Intermediate Value Theorem.',

  topicLabel: 'Continuity â€” Complete Review',

  topicDescription:
    'Move through the stations in order. Each station begins with intuition, then gives the formal mathematics, visual ideas, worked examples, common mistakes, and practice.',

  overview: {
    bigIdea:
      'Continuity connects what a function is doing near a point with what the function actually does at that point.',

    studentGoal:
      'By the end of this review, you should be able to look at a graph, formula, table, or piecewise function and determine where it is continuous and why.',

    memoryLine:
      'Continuous at a = function value exists + limit exists + they are equal.',

    masterFormula: String.raw`
      \boxed{\lim_{x\to a}f(x)=f(a)}
    `,

    roadmap: [
      'Understand continuity visually.',
      'Learn the three conditions for continuity at a point.',
      'Recognize different kinds of discontinuities.',
      'Test continuity algebraically.',
      'Handle piecewise functions.',
      'Understand continuity on intervals.',
      'Apply continuity theorems.',
      'Use the Intermediate Value Theorem.'
    ]
  },

  stations: [

    // ============================================================
    // STATION 1
    // ============================================================

    {
      id: 'continuity-intuition',

      title: '1. What Does Continuity Mean?',

      description:
        'Begin with the geometric idea before introducing the formal definition.',

      learnFirst: {
        intuition:
          'Imagine tracing the graph near a point with your finger. If the graph does not jump, break, disappear, or suddenly move somewhere else, the function behaves continuously there.',

        definition:
          'Informally, a function is continuous when small changes in the input produce small changes in the output.',

        definitionMath: String.raw`
          x\text{ close to }a
          \quad\Longrightarrow\quad
          f(x)\text{ close to }f(a)
        `,

        decisionCue:
          'Ask: As x approaches a, does the graph approach the point actually assigned to x=a?'
      },

      visual: {
        type: 'continuous-path',

        title: 'Trace the Graph',

        description:
          'Animate a point traveling along a smooth curve toward x=a from both sides.',

        stages: [
          'A point approaches a from the left.',
          'A second point approaches a from the right.',
          'Both output values approach the same height.',
          'The filled point f(a) is located at that same height.',
          'Highlight: limit = function value.'
        ]
      },

      examples: [
        {
          title: 'A continuous polynomial',
          math: String.raw`
            f(x)=x^2+3x-1
          `,
          explanation:
            'Polynomials are continuous everywhere, so limits may be evaluated by direct substitution.',

          work: [
            String.raw`
              \lim_{x\to2}(x^2+3x-1)
            `,
            String.raw`
              =2^2+3(2)-1
            `,
            String.raw`
              =4+6-1=9
            `
          ],

          answer: String.raw`
            \boxed{9}
          `
        }
      ],

      takeaway:
        'Continuity is a relationship between nearby values, a limit, and the actual function value.',

      questions: [
        question(
          'continuity-intuition-basic',
          'Continuous behavior',
          'If a graph approaches y=6 from both sides as x approaches 3 and f(3)=6, is the function continuous at x=3?',
          ['Yes'],
          'Both sides approach 6 and the actual function value is also 6.',
          String.raw`\lim_{x\to3}f(x)=f(3)=6`
        )
      ]
    },

    // ============================================================
    // STATION 2
    // ============================================================

    {
      id: 'continuity-at-a-point',

      title: '2. The Three Conditions for Continuity',

      description:
        'Learn the formal test for continuity at a single point.',

      learnFirst: {
        intuition:
          'Three things must line up perfectly: the point must exist, the graph must approach one height, and that height must be the actual point.',

        definition:
          'A function f is continuous at x=a if all three continuity conditions are satisfied.',

        definitionMath: String.raw`
          \boxed{
          1.\ f(a)\text{ exists}
          \qquad
          2.\ \lim_{x\to a}f(x)\text{ exists}
          \qquad
          3.\ \lim_{x\to a}f(x)=f(a)
          }
        `,

        decisionCue:
          'Always check the conditions in this order: value â†’ limit â†’ equality.'
      },

      visual: {
        type: 'three-condition-check',

        title: 'The Continuity Checklist',

        stages: [
          {
            label: 'Condition 1',
            text: 'Locate the filled point at x=a.',
            result: 'Does f(a) exist?'
          },
          {
            label: 'Condition 2',
            text: 'Approach x=a from both directions.',
            result: 'Do the one-sided limits agree?'
          },
          {
            label: 'Condition 3',
            text: 'Compare the limiting height to the filled point.',
            result: 'Does the limit equal f(a)?'
          }
        ]
      },

      examples: [
        {
          title: 'Continuous at the point',

          given: String.raw`
            f(2)=5,\qquad
            \lim_{x\to2^-}f(x)=5,\qquad
            \lim_{x\to2^+}f(x)=5
          `,

          work: [
            'Condition 1: f(2)=5 exists.',
            'Condition 2: Both one-sided limits equal 5, so the two-sided limit exists.',
            'Condition 3: The limit equals f(2).'
          ],

          conclusion: String.raw`
            \boxed{f\text{ is continuous at }x=2}
          `
        },

        {
          title: 'Limit exists, but continuity fails',

          given: String.raw`
            \lim_{x\to4}f(x)=3,
            \qquad
            f(4)=7
          `,

          explanation:
            'The graph approaches 3, but the actual function value is 7.',

          conclusion: String.raw`
            \boxed{
            \lim_{x\to4}f(x)\neq f(4)
            }
          `
        }
      ],

      commonMistakes: [
        'Checking only that f(a) exists.',
        'Checking only that the limit exists.',
        'Assuming a limit must equal the function value.',
        'Ignoring one-sided limits.'
      ],

      takeaway:
        'All three conditions are required. Failure of even one condition means the function is not continuous at that point.',

      questions: [
        question(
          'continuity-basic',
          'Evaluate a continuous limit',
          'If f is continuous and f(2)=7, find the limit as x approaches 2.',
          ['7'],
          'Continuity allows direct substitution: the limit equals f(2)=7.',
          String.raw`\lim_{x\to2}f(x)`
        ),

        question(
          'continuity-three-conditions',
          'Check continuity',
          'Suppose f(1)=4 and the limit of f(x) as x approaches 1 is 4. Is f continuous at x=1?',
          ['Yes'],
          'The function value exists, the limit exists, and the two values agree.'
        )
      ]
    },

    // ============================================================
    // STATION 3
    // ============================================================

    {
      id: 'one-sided-continuity',

      title: '3. One-Sided Limits and Continuity',

      description:
        'Understand why the left-hand and right-hand behavior must agree.',

      learnFirst: {
        intuition:
          'For a two-sided limit to exist, the function must approach the same height from both directions.',

        definition:
          'The two-sided limit exists only when the left-hand and right-hand limits exist and are equal.',

        definitionMath: String.raw`
          \boxed{
          \lim_{x\to a}f(x)=L
          \iff
          \lim_{x\to a^-}f(x)=L
          =
          \lim_{x\to a^+}f(x)
          }
        `,

        decisionCue:
          'Before declaring continuity, compare what happens from the left and from the right.'
      },

      animation: {
        type: 'left-right-limit',

        description:
          'Animate two points approaching x=a simultaneously from opposite sides.',

        continuousCase:
          'Both points converge to the same y-value.',

        jumpCase:
          'The two points approach different y-values; display LIMIT DOES NOT EXIST.'
      },

      examples: [
        {
          title: 'Matching one-sided limits',

          math: String.raw`
            \lim_{x\to3^-}f(x)=8,
            \qquad
            \lim_{x\to3^+}f(x)=8
          `,

          conclusion: String.raw`
            \boxed{\lim_{x\to3}f(x)=8}
          `
        },

        {
          title: 'Different one-sided limits',

          math: String.raw`
            \lim_{x\to3^-}f(x)=2,
            \qquad
            \lim_{x\to3^+}f(x)=5
          `,

          conclusion: String.raw`
            \boxed{\lim_{x\to3}f(x)\text{ does not exist}}
          `
        }
      ],

      takeaway:
        'Different one-sided limits automatically destroy two-sided continuity.'
    },

    // ============================================================
    // STATION 4
    // ============================================================

    {
      id: 'discontinuities',

      title: '4. Types of Discontinuities',

      description:
        'Learn to recognize holes, jumps, and infinite discontinuities.',

      learnFirst: {
        intuition:
          'Not all breaks in a graph behave the same way. The type of break tells us why continuity failed.',

        definition:
          'A discontinuity occurs at a point where at least one of the three continuity conditions fails.',

        definitionMath: String.raw`
          \text{discontinuous at }a
          \Longleftrightarrow
          \text{one or more continuity conditions fail}
        `,

        decisionCue:
          'Look for a hole, a jump, or behavior that becomes unbounded.'
      },

      visual: {
        type: 'discontinuity-gallery',

        cards: [
          {
            title: 'Removable Discontinuity',
            label: 'Hole',
            description:
              'The limit exists, but the function is missing the correct value.',
            math: String.raw`
              \lim_{x\to a}f(x)=L
              \quad\text{but}\quad
              f(a)\neq L
              \text{ or }f(a)\text{ is undefined}
            `
          },

          {
            title: 'Jump Discontinuity',
            label: 'Jump',
            description:
              'The left-hand and right-hand limits approach different values.',
            math: String.raw`
              \lim_{x\to a^-}f(x)
              \neq
              \lim_{x\to a^+}f(x)
            `
          },

          {
            title: 'Infinite Discontinuity',
            label: 'Vertical Asymptote',
            description:
              'The function grows without bound near the point.',
            math: String.raw`
              f(x)\to\pm\infty
              \quad\text{as}\quad
              x\to a
            `
          }
        ]
      },

      examples: [
        {
          title: 'Removable discontinuity',

          math: String.raw`
            f(x)=\frac{x^2-4}{x-2}
          `,

          work: [
            String.raw`
              x^2-4=(x-2)(x+2)
            `,
            String.raw`
              f(x)=x+2,\qquad x\neq2
            `,
            String.raw`
              \lim_{x\to2}f(x)=4
            `
          ],

          explanation:
            'The graph behaves like y=x+2 but has a hole at x=2.',

          conclusion:
            'If we define f(2)=4, the discontinuity is repaired.'
        },

        {
          title: 'Infinite discontinuity',

          math: String.raw`
            f(x)=\frac{1}{x-3}
          `,

          explanation:
            'The denominator becomes zero at x=3, creating a vertical asymptote.',

          conclusion: String.raw`
            \boxed{x=3\text{ is an infinite discontinuity}}
          `
        }
      ],

      commonMistakes: [
        'Calling every discontinuity a hole.',
        'Assuming a vertical asymptote means the function value must be zero.',
        'Forgetting that a jump has two finite but unequal one-sided limits.'
      ],

      takeaway:
        'Identify why continuity fails, not merely that it fails.'
    },

    // ============================================================
    // STATION 5
    // ============================================================

    {
      id: 'common-continuous-functions',

      title: '5. Functions That Are Automatically Continuous',

      description:
        'Know when direct substitution is justified immediately.',

      learnFirst: {
        intuition:
          'Many familiar functions have no hidden breaks inside their natural domains.',

        definition:
          'Standard elementary functions are continuous at every point where they are defined.',

        definitionMath: String.raw`
          \boxed{
          \lim_{x\to a}f(x)=f(a)
          \text{ whenever }f
          \text{ is continuous at }a
          }
        `,

        decisionCue:
          'First ask whether the expression is built from familiar continuous functions and whether a is in the domain.'
      },

      families: [
        {
          name: 'Polynomials',
          example: String.raw`x^4-3x+7`,
          continuousWhere: 'Every real number'
        },
        {
          name: 'Rational functions',
          example: String.raw`\frac{x+1}{x^2-9}`,
          continuousWhere: 'Where the denominator is nonzero'
        },
        {
          name: 'Roots',
          example: String.raw`\sqrt{x-2}`,
          continuousWhere: 'On their real-valued domains'
        },
        {
          name: 'Exponential functions',
          example: String.raw`e^x`,
          continuousWhere: 'Every real number'
        },
        {
          name: 'Logarithmic functions',
          example: String.raw`\ln x`,
          continuousWhere: 'Where the argument is positive'
        },
        {
          name: 'Trigonometric functions',
          example: String.raw`\sin x,\cos x`,
          continuousWhere: 'Throughout their natural domains'
        }
      ],

      examples: [
        {
          title: 'Direct substitution',

          math: String.raw`
            \lim_{x\to\pi/3}
            \left(2\sin x+\cos x\right)
          `,

          work: [
            String.raw`
              =2\sin\frac{\pi}{3}
              +\cos\frac{\pi}{3}
            `,
            String.raw`
              =2\left(\frac{\sqrt3}{2}\right)
              +\frac12
            `,
            String.raw`
              =\sqrt3+\frac12
            `
          ],

          answer: String.raw`
            \boxed{\sqrt3+\frac12}
          `
        }
      ],

      takeaway:
        'Direct substitution is not a trick. It is a consequence of continuity.'
    },

    // ============================================================
    // STATION 6
    // ============================================================

    {
      id: 'continuity-theorems',

      title: '6. Continuity Rules and Theorems',

      description:
        'Understand how continuous functions can be combined.',

      learnFirst: {
        intuition:
          'If two functions behave continuously, ordinary algebraic combinations usually preserve continuity.',

        definition:
          'Sums, differences, products, scalar multiples, quotients with nonzero denominator, and compositions of continuous functions remain continuous.',

        definitionMath: String.raw`
          f,g\text{ continuous}
          \Longrightarrow
          f+g,\ f-g,\ fg,\ cf
          \text{ continuous}
        `,

        decisionCue:
          'Build complicated functions from simpler continuous pieces.'
      },

      theorems: [
        {
          name: 'Sum Rule',
          math: String.raw`
            \lim_{x\to a}[f(x)+g(x)]
            =
            \lim_{x\to a}f(x)
            +
            \lim_{x\to a}g(x)
          `
        },

        {
          name: 'Product Rule',
          math: String.raw`
            \lim_{x\to a}f(x)g(x)
            =
            \left(\lim_{x\to a}f(x)\right)
            \left(\lim_{x\to a}g(x)\right)
          `
        },

        {
          name: 'Quotient Rule',
          math: String.raw`
            \lim_{x\to a}
            \frac{f(x)}{g(x)}
            =
            \frac{
              \lim_{x\to a}f(x)
            }{
              \lim_{x\to a}g(x)
            },
            \quad
            \lim_{x\to a}g(x)\neq0
          `
        },

        {
          name: 'Composition Rule',
          math: String.raw`
            \lim_{x\to a}f(g(x))
            =
            f\left(
            \lim_{x\to a}g(x)
            \right)
          `,
          note:
            'Provided the required continuity conditions are satisfied.'
        }
      ],

      takeaway:
        'Continuity lets us pass limits through familiar algebraic operations.'
    },

    // ============================================================
    // STATION 7
    // ============================================================

    {
      id: 'piecewise-continuity',

      title: '7. Continuity of Piecewise Functions',

      description:
        'Learn the most important exam procedure for matching two pieces.',

      learnFirst: {
        intuition:
          'Inside each piece, continuity is usually easy. The danger occurs where the formula changes.',

        definition:
          'For a piecewise function, check continuity especially at boundary points where one formula changes to another.',

        definitionMath: String.raw`
          \boxed{
          \lim_{x\to a^-}f(x)
          =
          \lim_{x\to a^+}f(x)
          =
          f(a)
          }
        `,

        decisionCue:
          'At the joining point: LEFT = RIGHT = VALUE.'
      },

      animation: {
        type: 'piecewise-slider',

        description:
          'Animate two curve pieces moving vertically until their endpoint heights meet.',

        labels: [
          'Left-hand limit',
          'Right-hand limit',
          'Function value',
          'Continuous when all three coincide'
        ]
      },

      examples: [
        {
          title: 'Find k so the function is continuous',

          math: String.raw`
            f(x)=
            \begin{cases}
            x^2+1, & x<2,\\
            kx-1, & x\ge2.
            \end{cases}
          `,

          work: [
            'At x=2, make the two pieces agree.',

            String.raw`
              \lim_{x\to2^-}f(x)
              =
              2^2+1
              =
              5
            `,

            String.raw`
              \lim_{x\to2^+}f(x)
              =
              2k-1
            `,

            String.raw`
              2k-1=5
            `,

            String.raw`
              2k=6
            `,

            String.raw`
              k=3
            `
          ],

          answer: String.raw`
            \boxed{k=3}
          `,

          explanation:
            'With k=3, the left-hand limit, right-hand limit, and function value all equal 5.'
        },

        {
          title: 'Piecewise discontinuity',

          math: String.raw`
            f(x)=
            \begin{cases}
            x+1,&x<0,\\
            x+4,&x\ge0.
            \end{cases}
          `,

          work: [
            String.raw`
              \lim_{x\to0^-}f(x)=1
            `,
            String.raw`
              \lim_{x\to0^+}f(x)=4
            `
          ],

          conclusion: String.raw`
            \boxed{\text{Jump discontinuity at }x=0}
          `
        }
      ],

      commonMistakes: [
        'Substituting into only one piece.',
        'Forgetting which inequality contains the equality sign.',
        'Finding k from f(a) alone without checking both limits.',
        'Assuming piecewise automatically means discontinuous.'
      ],

      takeaway:
        'For piecewise continuity problems, remember: LEFT = RIGHT = VALUE.',

      questions: [
        question(
          'piecewise-basic',
          'Match the pieces',
          'If the left-hand limit at x=4 is 9, what must the right-hand limit and f(4) equal for continuity?',
          ['9'],
          'Continuity requires the left limit, right limit, and function value to all agree.'
        )
      ]
    },

    // ============================================================
    // STATION 8
    // ============================================================

    {
      id: 'continuity-on-intervals',

      title: '8. Continuity on Intervals',

      description:
        'Extend continuity from one point to an entire interval.',

      learnFirst: {
        intuition:
          'To be continuous on an interval, the graph must behave continuously at every point in that interval.',

        definition:
          'A function is continuous on an open interval if it is continuous at every point in the interval.',

        definitionMath: String.raw`
          f\text{ continuous on }(a,b)
          \Longleftrightarrow
          f\text{ continuous at every }c\in(a,b)
        `,

        decisionCue:
          'Check the interior normally; at endpoints of closed intervals, use the appropriate one-sided limit.'
      },

      endpointRules: [
        {
          endpoint: 'Left endpoint a',
          math: String.raw`
            \lim_{x\to a^+}f(x)=f(a)
          `
        },
        {
          endpoint: 'Right endpoint b',
          math: String.raw`
            \lim_{x\to b^-}f(x)=f(b)
          `
        }
      ],

      example: {
        title: 'Continuity on a closed interval',

        function: String.raw`
          f(x)=\sqrt{4-x^2}
        `,

        interval: String.raw`
          [-2,2]
        `,

        explanation:
          'This is the upper semicircle of radius 2. It is continuous throughout its domain, including one-sided continuity at the endpoints.'
      },

      takeaway:
        'Closed interval continuity uses one-sided limits at its endpoints.'
    },

    // ============================================================
    // STATION 9
    // ============================================================

    {
      id: 'ivt',

      title: '9. Intermediate Value Theorem',

      description:
        'Use continuity to guarantee that a function reaches values between two endpoint outputs.',

      learnFirst: {
        intuition:
          'A continuous curve connecting two heights cannot skip a height in between.',

        definition:
          'If f is continuous on [a,b] and N lies between f(a) and f(b), then there is at least one number c in [a,b] such that f(c)=N.',

        definitionMath: String.raw`
          \boxed{
          f(a)<N<f(b)
          \quad\Longrightarrow\quad
          f(c)=N
          \text{ for some }c\in(a,b)
          }
        `,

        decisionCue:
          'Verify continuity first. Then show the target value lies between the endpoint outputs.'
      },

      animation: {
        type: 'ivt-horizontal-line',

        description:
          'Display a continuous curve between two endpoint values. Move a horizontal line y=N between them and show that it must intersect the curve.',

        stages: [
          'Mark f(a).',
          'Mark f(b).',
          'Choose N between the endpoint values.',
          'Draw horizontal line y=N.',
          'Highlight at least one intersection point c.',
          'Display f(c)=N.'
        ]
      },

      examples: [
        {
          title: 'Guarantee a root',

          given: String.raw`
            f(1)=-2,\qquad f(4)=5
          `,

          assumption:
            'Suppose f is continuous on [1,4].',

          reasoning: [
            String.raw`
              -2<0<5
            `,
            'Zero lies between the endpoint outputs.',
            'By the Intermediate Value Theorem, the graph must cross y=0.'
          ],

          conclusion: String.raw`
            \boxed{
            \exists\,c\in(1,4)
            \text{ such that }f(c)=0
            }
          `
        },

        {
          title: 'Polynomial root existence',

          math: String.raw`
            f(x)=x^3+x-1
          `,

          work: [
            'Polynomials are continuous everywhere.',

            String.raw`
              f(0)=-1
            `,

            String.raw`
              f(1)=1
            `,

            String.raw`
              -1<0<1
            `
          ],

          conclusion:
            'Therefore, the IVT guarantees at least one root between 0 and 1.'
        }
      ],

      theoremWarning: [
        'The IVT guarantees existence, not uniqueness.',
        'The IVT does not tell you the exact value of c.',
        'Continuity on the entire interval is essential.',
        'The target value must lie between the endpoint outputs.'
      ],

      commonMistakes: [
        'Using IVT without mentioning continuity.',
        'Claiming there is exactly one root.',
        'Forgetting to evaluate both endpoints.',
        'Using endpoint x-values instead of endpoint function values.'
      ],

      takeaway:
        'IVT is an existence theorem: continuity + bracketing guarantees that a value occurs.',

      questions: [
        question(
          'ivt-basic',
          'Guaranteed root',
          'A continuous function has f(1)=-2 and f(4)=5. What value is guaranteed between the outputs?',
          ['0'],
          'Zero lies between -2 and 5, so the IVT guarantees at least one root in (1,4).'
        ),

        question(
          'ivt-uniqueness',
          'What does IVT guarantee?',
          'If IVT guarantees a root in an interval, does it guarantee exactly one root?',
          ['No'],
          'IVT guarantees at least one value c. It does not guarantee uniqueness.'
        )
      ]
    },

    // ============================================================
    // STATION 10
    // ============================================================

    {
      id: 'continuity-decision-tree',

      title: '10. Continuity Decision Tree',

      description:
        'Use one consistent process on exams and homework.',

      learnFirst: {
        intuition:
          'A good decision process prevents most continuity mistakes.',

        definition:
          'Start with the type of function and then investigate only the places where continuity could fail.',

        definitionMath: String.raw`
          \boxed{
          \text{Domain}
          \rightarrow
          \text{Possible breaks}
          \rightarrow
          \text{Three conditions}
          \rightarrow
          \text{Conclusion}
          }
        `,

        decisionCue:
          'Do not randomly calculate limits. First identify where a problem could occur.'
      },

      decisionTree: [
        {
          question: 'Is this a standard continuous function?',
          yes: 'Use direct substitution wherever it is defined.',
          no: 'Continue.'
        },
        {
          question: 'Is there a denominator?',
          yes: 'Check where the denominator equals zero.',
          no: 'Continue.'
        },
        {
          question: 'Is there a radical or logarithm?',
          yes: 'Check the domain.',
          no: 'Continue.'
        },
        {
          question: 'Is the function piecewise?',
          yes: 'Check each joining point.',
          no: 'Continue.'
        },
        {
          question: 'At a suspicious point a, does f(a) exist?',
          yes: 'Check the limit.',
          no: 'Discontinuous unless the point is repaired.'
        },
        {
          question: 'Do left and right limits agree?',
          yes: 'Compare the limit to f(a).',
          no: 'Discontinuous.'
        },
        {
          question: 'Does the limit equal f(a)?',
          yes: 'Continuous.',
          no: 'Discontinuous.'
        }
      ],

      takeaway:
        'Continuity problems become much easier when you follow the same checklist every time.'
    },

    // ============================================================
    // STATION 11
    // ============================================================

    {
      id: 'continuity-exam-practice',

      title: '11. Mixed Exam Practice',

      description:
        'Bring all continuity ideas together.',

      learnFirst: {
        intuition:
          'The goal is now recognition: identify which continuity idea each problem is testing.',

        definition:
          'Mixed problems may combine algebra, graphs, piecewise functions, limits, and the IVT.',

        definitionMath: String.raw`
          \text{Recognize}
          \rightarrow
          \text{Choose theorem}
          \rightarrow
          \text{Show conditions}
          \rightarrow
          \text{Conclude}
        `,

        decisionCue:
          'Before computing anything, say what concept the problem is testing.'
      },

      examples: [
        {
          title: 'Find and classify discontinuities',

          problem: String.raw`
            f(x)=\frac{x^2-9}{x^2-x-6}
          `,

          work: [
            String.raw`
              x^2-9=(x-3)(x+3)
            `,
            String.raw`
              x^2-x-6=(x-3)(x+2)
            `,
            String.raw`
              f(x)=\frac{x+3}{x+2},
              \qquad x\neq3
            `
          ],

          analysis: [
            'x=3 creates a removable discontinuity because the factor cancels.',
            'x=-2 creates an infinite discontinuity because the denominator remains zero.'
          ],

          conclusion: String.raw`
            \boxed{
            x=3\text{ removable},
            \qquad
            x=-2\text{ infinite}
            }
          `
        },

        {
          title: 'Determine continuity from data',

          given: [
            'f(5)=2',
            'left-hand limit at 5 = 2',
            'right-hand limit at 5 = 2'
          ],

          conclusion: String.raw`
            \boxed{f\text{ is continuous at }5}
          `
        }
      ],

      takeaway:
        'Always justify your conclusion with the appropriate definition or theorem.'
    }
  ],

  // ============================================================
  // GLOSSARY
  // ============================================================

  glossary: [
    {
      term: 'Continuous at a point',
      definition:
        'The function value exists, the limit exists, and the limit equals the function value.',
      math: String.raw`\lim_{x\to a}f(x)=f(a)`
    },
    {
      term: 'Discontinuity',
      definition:
        'A point where one or more continuity conditions fail.'
    },
    {
      term: 'Removable discontinuity',
      definition:
        'A hole where the limiting value exists and could be repaired by redefining the function.'
    },
    {
      term: 'Jump discontinuity',
      definition:
        'A discontinuity where the two one-sided limits are different.'
    },
    {
      term: 'Infinite discontinuity',
      definition:
        'A discontinuity where function values become unbounded near the point.'
    },
    {
      term: 'Intermediate Value Theorem',
      definition:
        'A continuous function assumes every value between its endpoint outputs.'
    }
  ],

  // ============================================================
  // FINAL SUMMARY
  // ============================================================

  finalSummary: {
    title: 'Continuity â€” What You Must Know',

    formulas: [
      String.raw`
        \boxed{
        \lim_{x\to a}f(x)=f(a)
        }
      `,
      String.raw`
        \boxed{
        \lim_{x\to a^-}f(x)
        =
        \lim_{x\to a^+}f(x)
        }
      `,
      String.raw`
        \boxed{
        \text{Piecewise continuity: Left = Right = Value}
        }
      `
    ],

    checklist: [
      'Can I state the three conditions for continuity?',
      'Can I identify holes, jumps, and vertical asymptotes?',
      'Can I determine where a formula is continuous?',
      'Can I test a piecewise function at its joining point?',
      'Can I find a parameter that makes a piecewise function continuous?',
      'Can I explain one-sided continuity at endpoints?',
      'Can I state the Intermediate Value Theorem?',
      'Can I verify the hypotheses before using IVT?',
      'Can I explain what IVT guarantees and what it does NOT guarantee?'
    ],

    finalMessage:
      'Do not memorize continuity as one formula. Understand the picture: the value the graph approaches must be the value the function actually has.'
  }
};

export const derivativesReview = {
  titleLines: ['Derivatives', 'Fundamental Review'],

  description:
    'Understand derivatives as rates of change and slopes, then master the derivative rules, chain rule, implicit differentiation, higher derivatives, and common applications.',

  topicLabel: 'Derivatives â€” Complete Review',

  topicDescription:
    'Work through the stations in order. Each station begins with intuition, then builds the mathematics with definitions, animations, worked examples, common mistakes, and practice.',

  overview: {
    bigIdea:
      'A derivative measures how fast one quantity changes compared with another.',

    studentGoal:
      'By the end of this review, you should be able to explain what a derivative means, compute derivatives efficiently, choose the correct differentiation rule, and interpret the result in context.',

    memoryLine:
      'Derivative = instantaneous rate of change = slope of the tangent line.',

    masterFormula: String.raw`
      \boxed{
      f'(a)
      =
      \lim_{h\to0}
      \frac{f(a+h)-f(a)}{h}
      }
    `,

    roadmap: [
      'Understand the derivative geometrically.',
      'Connect average and instantaneous rates of change.',
      'Understand the limit definition.',
      'Master the basic derivative rules.',
      'Differentiate products and quotients.',
      'Master the Chain Rule.',
      'Differentiate trig, exponential, and logarithmic functions.',
      'Use implicit differentiation.',
      'Understand higher derivatives.',
      'Apply derivatives to tangent lines, velocity, and rates of change.'
    ]
  },

  stations: [

    // ============================================================
    // STATION 1
    // ============================================================

    {
      id: 'derivative-intuition',

      title: '1. What Is a Derivative?',

      description:
        'Begin with the geometric and real-world meaning of a derivative.',

      learnFirst: {
        intuition:
          'A derivative tells us how quickly something is changing at one exact moment.',

        definition:
          'The derivative of a function at a point is the instantaneous rate of change of the function with respect to its input.',

        definitionMath: String.raw`
          \boxed{
          \text{Derivative}
          =
          \text{instantaneous rate of change}
          =
          \text{slope of the tangent line}
          }
        `,

        decisionCue:
          'Whenever you see words such as slope, velocity, marginal change, growth rate, or instantaneous rate, think derivative.'
      },

      visual: {
        type: 'secant-to-tangent',

        title: 'Watch the Secant Become a Tangent',

        description:
          'Animate two points on a curve. Keep one point fixed and move the second point closer until the secant line becomes the tangent line.',

        stages: [
          'Choose a point P on the graph.',
          'Choose a nearby point Q.',
          'Draw the secant line through P and Q.',
          'Move Q toward P.',
          'Watch the secant slope approach a limiting value.',
          'Replace the secant with the tangent line.',
          'Display: tangent slope = derivative.'
        ]
      },

      examples: [
        {
          title: 'Slope as a derivative',

          given:
            'Suppose the tangent line to y=f(x) at x=3 has slope 5.',

          conclusion: String.raw`
            \boxed{f'(3)=5}
          `,

          explanation:
            'This means that near x=3, the output is increasing approximately 5 units for every 1-unit increase in x.'
        },

        {
          title: 'Derivative from motion',

          given: String.raw`
            s(t)=t^2+2t
          `,

          explanation:
            'If s(t) represents position, then s′(t) represents instantaneous velocity.'
        }
      ],

      takeaway:
        'A derivative is not merely a formula. It describes how a function is changing right now.',

      questions: [
        question(
          'derivative-intuition-1',
          'Interpret a derivative',
          'If f′(4)=-3, is the function increasing or decreasing at x=4?',
          ['Decreasing'],
          'A negative derivative means the tangent slope is negative, so the function is decreasing at that point.'
        )
      ]
    },

    // ============================================================
    // STATION 2
    // ============================================================

    {
      id: 'average-vs-instantaneous',

      title: '2. Average vs. Instantaneous Rate of Change',

      description:
        'Connect secant-line slopes with tangent-line slopes.',

      learnFirst: {
        intuition:
          'Average rate measures change over an interval. Instantaneous rate measures change at one exact point.',

        definition:
          'Average rate of change is the slope of a secant line. Instantaneous rate of change is the slope of a tangent line.',

        definitionMath: String.raw`
          \text{Average rate}
          =
          \frac{f(b)-f(a)}{b-a}
        `,

        decisionCue:
          'Two distinct x-values â†’ average rate. One exact x-value â†’ derivative.'
      },

      visual: {
        type: 'average-to-instantaneous-rate',

        description:
          'Show an interval shrinking around x=a while the secant slope approaches the tangent slope.'
      },

      examples: [
        {
          title: 'Average velocity',

          math: String.raw`
            s(t)=t^2
          `,

          problem:
            'Find the average velocity from t=2 to t=5.',

          work: [
            String.raw`
              \frac{s(5)-s(2)}{5-2}
            `,
            String.raw`
              =
              \frac{25-4}{3}
            `,
            String.raw`
              =7
            `
          ],

          answer: String.raw`
            \boxed{7}
          `
        }
      ],

      takeaway:
        'The derivative is what the average rate approaches when the interval shrinks to zero.'
    },

    // ============================================================
    // STATION 3
    // ============================================================

    {
      id: 'derivative-definition',

      title: '3. The Limit Definition of the Derivative',

      description:
        'See where derivative formulas actually come from.',

      learnFirst: {
        intuition:
          'We cannot calculate slope at one point using two distinct points, so we begin with two points and let them merge.',

        definition:
          'The derivative of f at x=a is the limit of the difference quotient as the change in x approaches zero.',

        definitionMath: String.raw`
          \boxed{
          f'(a)
          =
          \lim_{h\to0}
          \frac{f(a+h)-f(a)}{h}
          }
        `,

        decisionCue:
          'The numerator measures change in output; h measures change in input.'
      },

      animation: {
        type: 'difference-quotient',

        description:
          'Color-code f(a+h)-f(a) as vertical change and h as horizontal change.',

        labels: [
          'Rise = f(a+h)-f(a)',
          'Run = h',
          'Secant slope',
          'Let h â†’ 0',
          'Tangent slope'
        ]
      },

      examples: [
        {
          title: 'Derive f′(x) for f(x)=xÂ²',

          math: String.raw`
            f(x)=x^2
          `,

          work: [
            String.raw`
              f'(x)
              =
              \lim_{h\to0}
              \frac{(x+h)^2-x^2}{h}
            `,
            String.raw`
              =
              \lim_{h\to0}
              \frac{x^2+2xh+h^2-x^2}{h}
            `,
            String.raw`
              =
              \lim_{h\to0}
              \frac{2xh+h^2}{h}
            `,
            String.raw`
              =
              \lim_{h\to0}
              (2x+h)
            `,
            String.raw`
              =2x
            `
          ],

          answer: String.raw`
            \boxed{f'(x)=2x}
          `
        },

        {
          title: 'Find the derivative at a point',

          math: String.raw`
            f(x)=x^2,\qquad x=3
          `,

          work: [
            String.raw`
              f'(x)=2x
            `,
            String.raw`
              f'(3)=6
            `
          ],

          interpretation:
            'The tangent line to y=xÂ² at x=3 has slope 6.'
        }
      ],

      commonMistakes: [
        'Substituting h=0 before simplifying.',
        'Forgetting parentheses around f(x+h).',
        'Not expanding correctly.',
        'Forgetting that the limit is taken only after simplifying.'
      ],

      takeaway:
        'The difference quotient is the bridge from secant slope to tangent slope.'
    },

    // ============================================================
    // STATION 4
    // ============================================================

    {
      id: 'basic-derivative-rules',

      title: '4. Basic Derivative Rules',

      description:
        'Build speed and confidence with the rules used most often.',

      learnFirst: {
        intuition:
          'Once the limit definition has been established, derivative rules let us differentiate efficiently.',

        definition:
          'Constants, powers, sums, and scalar multiples each have simple derivative rules.',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}(x^n)=nx^{n-1}
          }
        `,

        decisionCue:
          'For a polynomial, differentiate each term separately.'
      },

      rules: [
        {
          name: 'Constant Rule',
          math: String.raw`
            \frac{d}{dx}(c)=0
          `,
          meaning:
            'A horizontal line does not change.'
        },

        {
          name: 'Power Rule',
          math: String.raw`
            \frac{d}{dx}(x^n)=nx^{n-1}
          `,
          memory:
            'Bring the exponent down, then subtract 1.'
        },

        {
          name: 'Constant Multiple Rule',
          math: String.raw`
            \frac{d}{dx}[cf(x)]
            =
            cf'(x)
          `
        },

        {
          name: 'Sum/Difference Rule',
          math: String.raw`
            \frac{d}{dx}[f(x)\pm g(x)]
            =
            f'(x)\pm g'(x)
          `
        }
      ],

      animation: {
        type: 'power-rule-step',

        description:
          'Animate the exponent moving in front of the term and then decreasing by one.',

        example: String.raw`
          x^5
          \longrightarrow
          5x^4
        `
      },

      examples: [
        {
          title: 'Differentiate a polynomial',

          math: String.raw`
            f(x)=4x^5-3x^3+7x-9
          `,

          work: [
            String.raw`
              f'(x)
              =
              20x^4-9x^2+7
            `
          ],

          answer: String.raw`
            \boxed{20x^4-9x^2+7}
          `
        },

        {
          title: 'Negative and fractional exponents',

          math: String.raw`
            f(x)=x^{-3}+x^{1/2}
          `,

          work: [
            String.raw`
              f'(x)
              =
              -3x^{-4}
              +
              \frac12x^{-1/2}
            `
          ]
        }
      ],

      commonMistakes: [
        'Subtracting 1 from the coefficient instead of the exponent.',
        'Forgetting that the derivative of a constant is zero.',
        'Changing the exponent before multiplying by it.',
        'Avoiding negative or fractional exponents unnecessarily.'
      ],

      questions: [
        question(
          'power-rule-basic',
          'Power Rule',
          'Differentiate f(x)=x^7.',
          ['7x^6'],
          'Bring down the exponent 7 and reduce the exponent by 1.'
        )
      ]
    },

    // ============================================================
    // STATION 5
    // ============================================================

    {
      id: 'product-rule',

      title: '5. Product Rule',

      description:
        'Differentiate products without making the classic mistake.',

      learnFirst: {
        intuition:
          'The derivative of a product is NOT the product of the derivatives because both factors may be changing.',

        definition:
          'If y=f(x)g(x), differentiate one factor at a time while holding the other unchanged.',

        definitionMath: String.raw`
          \boxed{
          (fg)'=f'g+fg'
          }
        `,

        decisionCue:
          'Two changing expressions multiplied together â†’ Product Rule.'
      },

      animation: {
        type: 'product-rule-two-part',

        description:
          'Highlight the first factor changing while the second stays fixed, then reverse the roles.',

        memoryPhrase:
          'Derivative of first Ã— second + first Ã— derivative of second.'
      },

      examples: [
        {
          title: 'Basic Product Rule',

          math: String.raw`
            y=(x^2+1)(x^3-4)
          `,

          work: [
            String.raw`
              y'
              =
              (2x)(x^3-4)
              +
              (x^2+1)(3x^2)
            `,
            String.raw`
              =
              2x^4-8x
              +
              3x^4+3x^2
            `,
            String.raw`
              =
              5x^4+3x^2-8x
            `
          ],

          answer: String.raw`
            \boxed{5x^4+3x^2-8x}
          `
        }
      ],

      commonMistakes: [
        'Writing (fg)′=f′g′.',
        'Differentiating both factors at the same time.',
        'Forgetting the plus sign between the two product-rule terms.'
      ],

      takeaway:
        'A product creates two contributions to the total rate of change.'
    },

    // ============================================================
    // STATION 6
    // ============================================================

    {
      id: 'quotient-rule',

      title: '6. Quotient Rule',

      description:
        'Differentiate one changing quantity divided by another.',

      learnFirst: {
        intuition:
          'When both numerator and denominator change, their rates interact.',

        definition:
          'For a quotient, differentiate the top and bottom using the quotient rule.',

        definitionMath: String.raw`
          \boxed{
          \left(\frac{f}{g}\right)'
          =
          \frac{f'g-fg'}{g^2}
          }
        `,

        decisionCue:
          'A nontrivial function divided by another nontrivial function â†’ Quotient Rule.'
      },

      memoryAid: {
        phrase:
          'Low d-high minus high d-low, over low squared.',

        math: String.raw`
          \frac{
          (\text{bottom})(\text{derivative top})
          -
          (\text{top})(\text{derivative bottom})
          }{
          (\text{bottom})^2
          }
        `
      },

      examples: [
        {
          title: 'Differentiate a quotient',

          math: String.raw`
            y=
            \frac{x^2+1}{x-3}
          `,

          work: [
            String.raw`
              y'
              =
              \frac{
              (x-3)(2x)
              -
              (x^2+1)(1)
              }{
              (x-3)^2
              }
            `,
            String.raw`
              =
              \frac{
              2x^2-6x-x^2-1
              }{
              (x-3)^2
              }
            `,
            String.raw`
              =
              \frac{x^2-6x-1}{(x-3)^2}
            `
          ],

          answer: String.raw`
            \boxed{
            \frac{x^2-6x-1}{(x-3)^2}
            }
          `
        }
      ],

      commonMistakes: [
        'Reversing the subtraction order.',
        'Forgetting to square the denominator.',
        'Differentiating numerator and denominator separately as f′/g′.'
      ]
    },

    // ============================================================
    // STATION 7
    // ============================================================

    {
      id: 'chain-rule',

      title: '7. Chain Rule” The Most Important Rule',

      description:
        'Differentiate functions inside other functions.',

      learnFirst: {
        intuition:
          'A composite function changes in layers. The outer function changes because the inner function changes.',

        definition:
          'Differentiate the outside function while leaving the inside unchanged, then multiply by the derivative of the inside.',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}f(g(x))
          =
          f'(g(x))g'(x)
          }
        `,

        decisionCue:
          'If you see a function inside another function, think Chain Rule.'
      },

      animation: {
        type: 'chain-rule-layers',

        description:
          'Display nested boxes around a composite function and peel them away one layer at a time.',

        example: String.raw`
          (3x^2+1)^5
        `,

        stages: [
{ math: String.raw`\text{Outer function: }u^5` },
{ math: String.raw`\text{Inner function: }u=3x^2+1` },
{ math: String.raw`\text{Differentiate outer: }5u^4` },
          'Differentiate outer: 5uâ´',
          'Keep inner: 5(3xÂ²+1)â´',
          'Multiply by derivative of inner: 6x',
          'Final: 30x(3xÂ²+1)â´'
        ]
      },

      examples: [
        {
          title: 'Power with an inside function',

          math: String.raw`
            y=(3x^2+1)^5
          `,

          work: [
            String.raw`
              y'
              =
              5(3x^2+1)^4(6x)
            `,
            String.raw`
              =
              30x(3x^2+1)^4
            `
          ],

          answer: String.raw`
            \boxed{30x(3x^2+1)^4}
          `
        },

        {
          title: 'Trig Chain Rule',

          math: String.raw`
            y=\sin(x^3)
          `,

          work: [
            String.raw`
              y'
              =
              \cos(x^3)\cdot3x^2
            `
          ],

          answer: String.raw`
            \boxed{3x^2\cos(x^3)}
          `
        },

        {
          title: 'Multiple layers',

          math: String.raw`
            y=\sqrt{1+\cos(2x)}
          `,

          work: [
            String.raw`
              y=(1+\cos2x)^{1/2}
            `,
            String.raw`
              y'
              =
              \frac12(1+\cos2x)^{-1/2}
              (-\sin2x)(2)
            `,
            String.raw`
              =
              -\frac{\sin2x}{\sqrt{1+\cos2x}}
            `
          ]
        }
      ],

      commonMistakes: [
        'Differentiating the outside and stopping.',
        'Forgetting the derivative of the inside.',
        'Trying to expand complicated powers instead of using the Chain Rule.',
        'Missing multiple layers of composition.'
      ],

      takeaway:
        'Outside derivative Ã— inside derivative. Then repeat if more layers remain.',

      questions: [
        question(
          'chain-rule-basic',
          'Chain Rule',
          'Differentiate y=(xÂ²+4)^3.',
          ['6x(x^2+4)^2'],
          'Differentiate the outer cube first, then multiply by the derivative of xÂ²+4.'
        )
      ]
    },

    // ============================================================
    // STATION 8
    // ============================================================

    {
      id: 'trig-derivatives',

      title: '8. Trigonometric Derivatives',

      description:
        'Know the six essential trigonometric derivative formulas.',

      learnFirst: {
        intuition:
          'Trig functions have their own derivative patterns that appear constantly in calculus.',

        definition:
          'These formulas should become automatic.',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}(\sin x)=\cos x
          }
        `,

        decisionCue:
          'Recognize the trig function first, then check whether a Chain Rule is also needed.'
      },

      formulas: [
        String.raw`
          \frac{d}{dx}(\sin x)=\cos x
        `,
        String.raw`
          \frac{d}{dx}(\cos x)=-\sin x
        `,
        String.raw`
          \frac{d}{dx}(\tan x)=\sec^2x
        `,
        String.raw`
          \frac{d}{dx}(\cot x)=-\csc^2x
        `,
        String.raw`
          \frac{d}{dx}(\sec x)=\sec x\tan x
        `,
        String.raw`
          \frac{d}{dx}(\csc x)=-\csc x\cot x
        `
      ],

      animation: {
        type: 'trig-derivative-wheel',

        description:
          'Rotate through the six trig functions and reveal the corresponding derivative.'
      },

      examples: [
        {
          title: 'Trig + Chain Rule',

          math: String.raw`
            y=\cos(5x)
          `,

          work: [
            String.raw`
              y'=-\sin(5x)(5)
            `,
            String.raw`
              \boxed{-5\sin(5x)}
            `
          ]
        },

        {
          title: 'Power of a trig function',

          math: String.raw`
            y=\sin^3x
          `,

          note:
            'Interpret sinÂ³x as (sin x)Â³.',

          work: [
            String.raw`
              y'
              =
              3\sin^2x\cos x
            `
          ]
        }
      ],

      commonMistakes: [
        'Forgetting the negative sign in d/dx(cos x).',
        'Confusing secÂ²x with sec x tan x.',
        'Forgetting Chain Rule when the angle is not simply x.'
      ]
    },

    // ============================================================
    // STATION 9
    // ============================================================

    {
      id: 'exp-log-derivatives',

      title: '9. Exponential and Logarithmic Derivatives',

      description:
        'Differentiate exponential and logarithmic functions confidently.',

      learnFirst: {
        intuition:
          'The exponential function e^x is unique because it is its own derivative.',

        definition:
          'Exponential and logarithmic derivatives are especially powerful when combined with the Chain Rule.',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}(e^x)=e^x,
          \qquad
          \frac{d}{dx}(\ln x)=\frac1x
          }
        `,

        decisionCue:
          'For e^{u}, keep e^{u} and multiply by u′. For ln(u), use u′/u.'
      },

      formulas: [
        String.raw`
          \frac{d}{dx}(e^x)=e^x
        `,
        String.raw`
          \frac{d}{dx}(e^{u})=e^u u'
        `,
        String.raw`
          \frac{d}{dx}(a^x)=a^x\ln a
        `,
        String.raw`
          \frac{d}{dx}(\ln x)=\frac1x
        `,
        String.raw`
          \frac{d}{dx}(\ln|u|)=\frac{u'}{u}
        `
      ],

      examples: [
        {
          title: 'Exponential Chain Rule',

          math: String.raw`
            y=e^{x^2+3x}
          `,

          work: [
            String.raw`
              y'
              =
              e^{x^2+3x}(2x+3)
            `
          ],

          answer: String.raw`
            \boxed{(2x+3)e^{x^2+3x}}
          `
        },

        {
          title: 'Logarithmic Chain Rule',

          math: String.raw`
            y=\ln(x^2+1)
          `,

          work: [
            String.raw`
              y'
              =
              \frac{2x}{x^2+1}
            `
          ],

          answer: String.raw`
            \boxed{\frac{2x}{x^2+1}}
          `
        }
      ],

      takeaway:
        'For logarithms: derivative of inside divided by inside.'
    },

    // ============================================================
    // STATION 10
    // ============================================================

    {
      id: 'implicit-differentiation',

      title: '10. Implicit Differentiation',

      description:
        'Differentiate equations where y is not isolated.',

      learnFirst: {
        intuition:
          'Sometimes x and y are tied together in one equation. We can differentiate both sides without solving explicitly for y.',

        definition:
          'Differentiate both sides with respect to x, remembering that y is itself a function of x.',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}(y^n)
          =
          ny^{n-1}y'
          }
        `,

        decisionCue:
          'Every time you differentiate something containing y, multiply by y′.'
      },

      animation: {
        type: 'implicit-chain-rule',

        description:
          'Highlight every y-term and attach a y′ after differentiation.'
      },

      examples: [
        {
          title: 'Circle',

          math: String.raw`
            x^2+y^2=25
          `,

          work: [
            String.raw`
              2x+2yy'=0
            `,
            String.raw`
              2yy'=-2x
            `,
            String.raw`
              y'=-\frac{x}{y}
            `
          ],

          answer: String.raw`
            \boxed{\frac{dy}{dx}=-\frac{x}{y}}
          `
        },

        {
          title: 'Product involving x and y',

          math: String.raw`
            x^2+xy+y^2=7
          `,

          work: [
            String.raw`
              2x+(xy)'+2yy'=0
            `,
            String.raw`
              2x+(xy'+y)+2yy'=0
            `,
            String.raw`
              2x+y+xy'+2yy'=0
            `,
            String.raw`
              y'(x+2y)=-(2x+y)
            `,
            String.raw`
              \boxed{
              y'=-\frac{2x+y}{x+2y}
              }
            `
          ]
        }
      ],

      commonMistakes: [
        'Forgetting y′ after differentiating a y-term.',
        'Forgetting Product Rule on xy.',
        'Trying to solve for y before differentiating when it is unnecessary.'
      ]
    },

    // ============================================================
    // STATION 11
    // ============================================================

    {
      id: 'higher-derivatives',

      title: '11. Higher Derivatives',

      description:
        'Understand derivatives of derivatives.',

      learnFirst: {
        intuition:
          'The first derivative tells how a function changes. The second derivative tells how that rate of change itself changes.',

        definition:
          'The second derivative is the derivative of the first derivative.',

        definitionMath: String.raw`
          \boxed{
          f''(x)
          =
          \frac{d}{dx}f'(x)
          =
          \frac{d^2y}{dx^2}
          }
        `,

        decisionCue:
          'First derivative â†’ slope or velocity. Second derivative â†’ concavity or acceleration.'
      },

      examples: [
        {
          title: 'Position, velocity, acceleration',

          math: String.raw`
            s(t)=t^3-6t^2+9t
          `,

          work: [
            String.raw`
              v(t)=s'(t)=3t^2-12t+9
            `,
            String.raw`
              a(t)=v'(t)=6t-12
            `
          ],

          takeaway:
            'Position â†’ derivative â†’ velocity â†’ derivative â†’ acceleration.'
        }
      ],

      visual: {
        type: 'position-velocity-acceleration',

        stages: [
          'Position graph',
          'Slope creates velocity',
          'Slope of velocity creates acceleration'
        ]
      }
    },

    // ============================================================
    // STATION 12
    // ============================================================

    {
      id: 'tangent-lines',

      title: '12. Tangent Lines and Linear Approximation',

      description:
        'Use the derivative to build a line that locally approximates a curve.',

      learnFirst: {
        intuition:
          'If you zoom in far enough on a smooth curve, it begins to look like its tangent line.',

        definition:
          'The tangent line at x=a passes through (a,f(a)) and has slope f′(a).',

        definitionMath: String.raw`
          \boxed{
          y-f(a)=f'(a)(x-a)
          }
        `,

        decisionCue:
          'Need tangent line? Find the point and the derivative at that point.'
      },

      animation: {
        type: 'zoom-to-tangent',

        description:
          'Zoom repeatedly into a smooth curve until the curve visually merges with its tangent line.'
      },

      examples: [
        {
          title: 'Tangent line to y=xÂ²',

          problem:
            'Find the tangent line to y=xÂ² at x=2.',

          work: [
            String.raw`
              f(2)=4
            `,
            String.raw`
              f'(x)=2x
            `,
            String.raw`
              f'(2)=4
            `,
            String.raw`
              y-4=4(x-2)
            `,
            String.raw`
              y=4x-4
            `
          ],

          answer: String.raw`
            \boxed{y=4x-4}
          `
        }
      ]
    },

    // ============================================================
    // STATION 13
    // ============================================================

    {
      id: 'derivative-interpretation',

      title: '13. Reading Derivatives from Graphs',

      description:
        'Learn to interpret derivatives without computing formulas.',

      learnFirst: {
        intuition:
          'A derivative graph describes the slopes of the original graph.',

        definition:
          'The sign and size of f′(x) describe whether f is increasing, decreasing, or locally flat.',

        definitionMath: String.raw`
          f'(x)>0\Rightarrow f\text{ increasing}
          \qquad
          f'(x)<0\Rightarrow f\text{ decreasing}
        `,

        decisionCue:
          'Look at tangent slopes, not function heights.'
      },

      visual: {
        type: 'function-and-derivative-linked',

        description:
          'Move a point along f(x) and simultaneously display the tangent slope and corresponding point on f′(x).'
      },

      ideas: [
        {
          condition: String.raw`f'(x)>0`,
          meaning: 'f is increasing'
        },
        {
          condition: String.raw`f'(x)<0`,
          meaning: 'f is decreasing'
        },
        {
          condition: String.raw`f'(x)=0`,
          meaning: 'horizontal tangent / possible critical point'
        },
        {
          condition: 'large |f′(x)|',
          meaning: 'steep graph'
        },
        {
          condition: 'small |f′(x)|',
          meaning: 'nearly flat graph'
        }
      ],

      takeaway:
        'The derivative graph records slope, not height.'
    },

    // ============================================================
    // STATION 14
    // ============================================================

    {
      id: 'derivative-applications',

      title: '14. Derivatives in Real Life',

      description:
        'Connect derivative notation to physical and practical meaning.',

      learnFirst: {
        intuition:
          'The units of a derivative are output units divided by input units.',

        definition:
          'A derivative describes the rate at which one measured quantity changes relative to another.',

        definitionMath: String.raw`
          \boxed{
          \text{units of }f'
          =
          \frac{\text{units of output}}
               {\text{units of input}}
          }
        `,

        decisionCue:
          'Always interpret the derivative with units and context.'
      },

      applications: [
        {
          context: 'Position',
          quantity: String.raw`s(t)`,
          derivative: String.raw`s'(t)=v(t)`,
          meaning: 'Velocity'
        },
        {
          context: 'Velocity',
          quantity: String.raw`v(t)`,
          derivative: String.raw`v'(t)=a(t)`,
          meaning: 'Acceleration'
        },
        {
          context: 'Population',
          quantity: String.raw`P(t)`,
          derivative: String.raw`P'(t)`,
          meaning: 'Population growth rate'
        },
        {
          context: 'Cost',
          quantity: String.raw`C(x)`,
          derivative: String.raw`C'(x)`,
          meaning: 'Marginal cost'
        },
        {
          context: 'Temperature',
          quantity: String.raw`T(t)`,
          derivative: String.raw`T'(t)`,
          meaning: 'Rate of temperature change'
        }
      ],

      examples: [
        {
          title: 'Interpret units',

          given:
            'Suppose P(t) is measured in people and t is measured in years.',

          result: String.raw`
            P'(5)=1200
          `,

          interpretation:
            'At t=5 years, the population is increasing at approximately 1200 people per year.'
        }
      ]
    },

    // ============================================================
    // STATION 15
    // ============================================================

    {
      id: 'derivative-decision-tree',

      title: '15. Which Derivative Rule Should I Use?',

      description:
        'Use a consistent decision process instead of guessing.',

      learnFirst: {
        intuition:
          'Most derivative mistakes happen before any calculus is done â€” students choose the wrong rule.',

        definition:
          'Identify the outermost operation in the expression first.',

        definitionMath: String.raw`
          \boxed{
          \text{Recognize structure}
          \rightarrow
          \text{Choose rule}
          \rightarrow
          \text{Differentiate}
          }
        `,

        decisionCue:
          'Ask: What operation is holding the expression together?'
      },

      decisionTree: [
        {
          question: 'Is it a sum or difference?',
          action: 'Differentiate term-by-term.'
        },
        {
          question: 'Is it a power x^n?',
          action: 'Use the Power Rule.'
        },
        {
          question: 'Are two changing functions multiplied?',
          action: 'Use the Product Rule.'
        },
        {
          question: 'Is one changing function divided by another?',
          action: 'Use the Quotient Rule.'
        },
        {
          question: 'Is one function inside another?',
          action: 'Use the Chain Rule.'
        },
        {
          question: 'Is y mixed with x and not isolated?',
          action: 'Use implicit differentiation.'
        },
        {
          question: 'Are multiple structures present?',
          action:
            'Work from the outside inward and combine rules.'
        }
      ],

      visual: {
        type: 'rule-selector',

        description:
          'Show sample expressions and let students click the derivative rule they would use before solving.'
      },

      examples: [
        {
          expression: String.raw`(x^2+1)^7`,
          rule: 'Chain Rule'
        },
        {
          expression: String.raw`x^2\sin x`,
          rule: 'Product Rule'
        },
        {
          expression: String.raw`\frac{\ln x}{x^2+1}`,
          rule: 'Quotient Rule'
        },
        {
          expression: String.raw`\sin(x^3+1)`,
          rule: 'Chain Rule'
        },
        {
          expression: String.raw`x^2+y^2=25`,
          rule: 'Implicit Differentiation'
        }
      ]
    },

    // ============================================================
    // STATION 16
    // ============================================================

    {
      id: 'mixed-practice',

      title: '16. Mixed Derivative Practice',

      description:
        'Identify the rule first, then calculate.',

      learnFirst: {
        intuition:
          'Real calculus problems rarely announce which differentiation rule to use.',

        definition:
          'Mixed practice develops recognition as well as computational skill.',

        definitionMath: String.raw`
          \text{Recognize}
          \rightarrow
          \text{Differentiate}
          \rightarrow
          \text{Simplify}
          \rightarrow
          \text{Check}
        `,

        decisionCue:
          'Say the rule out loud before differentiating.'
      },

      examples: [
        {
          title: 'Product + Chain Rule',

          math: String.raw`
            y=x^2e^{3x}
          `,

          rule:
            'Product Rule outside, Chain Rule inside e^{3x}.',

          work: [
            String.raw`
              y'
              =
              2xe^{3x}
              +
              x^2(3e^{3x})
            `,
            String.raw`
              =
              e^{3x}(2x+3x^2)
            `
          ],

          answer: String.raw`
            \boxed{
            e^{3x}(2x+3x^2)
            }
          `
        },

        {
          title: 'Quotient + Chain Rule',

          math: String.raw`
            y=
            \frac{\sin(x^2)}{x+1}
          `,

          work: [
            String.raw`
              y'
              =
              \frac{
              (x+1)(2x\cos(x^2))
              -
              \sin(x^2)
              }{
              (x+1)^2
              }
            `
          ]
        },

        {
          title: 'Nested Chain Rule',

          math: String.raw`
            y=e^{\sin(4x)}
          `,

          work: [
            String.raw`
              y'
              =
              e^{\sin(4x)}
              \cos(4x)(4)
            `,
            String.raw`
              =
              \boxed{
              4e^{\sin(4x)}\cos(4x)
              }
            `
          ]
        }
      ]
    }
  ],

  // ============================================================
  // DERIVATIVE FORMULA LIBRARY
  // ============================================================

  formulaLibrary: {
    title: 'Derivative Formula Library',

    sections: [
      {
        title: 'Basic Rules',
        formulas: [
          String.raw`\frac{d}{dx}(c)=0`,
          String.raw`\frac{d}{dx}(x^n)=nx^{n-1}`,
          String.raw`(cf)'=cf'`,
          String.raw`(f\pm g)'=f'\pm g'`
        ]
      },

      {
        title: 'Product and Quotient',
        formulas: [
          String.raw`(fg)'=f'g+fg'`,
          String.raw`
            \left(\frac{f}{g}\right)'
            =
            \frac{f'g-fg'}{g^2}
          `
        ]
      },

      {
        title: 'Chain Rule',
        formulas: [
          String.raw`
            \frac{d}{dx}f(g(x))
            =
            f'(g(x))g'(x)
          `
        ]
      },

      {
        title: 'Trigonometric',
        formulas: [
          String.raw`(\sin x)'=\cos x`,
          String.raw`(\cos x)'=-\sin x`,
          String.raw`(\tan x)'=\sec^2x`,
          String.raw`(\cot x)'=-\csc^2x`,
          String.raw`(\sec x)'=\sec x\tan x`,
          String.raw`(\csc x)'=-\csc x\cot x`
        ]
      },

      {
        title: 'Exponential and Logarithmic',
        formulas: [
          String.raw`(e^x)'=e^x`,
          String.raw`(e^u)'=e^u u'`,
          String.raw`(a^x)'=a^x\ln a`,
          String.raw`(\ln x)'=\frac1x`,
          String.raw`
            (\ln|u|)'=\frac{u'}{u}
          `
        ]
      }
    ]
  },

  // ============================================================
  // COMMON MISTAKES
  // ============================================================

  commonMistakes: {
    title: 'Derivative Traps to Avoid',

    items: [
      {
        mistake:
          'Product of derivatives instead of Product Rule',
        wrong: String.raw`
          (fg)'=f'g'
        `,
        correct: String.raw`
          \boxed{(fg)'=f'g+fg'}
        `
      },

      {
        mistake:
          'Derivative of a quotient taken separately',
        wrong: String.raw`
          \left(\frac fg\right)'=\frac{f'}{g'}
        `,
        correct: String.raw`
          \boxed{
          \left(\frac fg\right)'
          =
          \frac{f'g-fg'}{g^2}
          }
        `
      },

      {
        mistake:
          'Forgetting the Chain Rule',
        wrong: String.raw`
          \frac{d}{dx}(x^2+1)^5
          =
          5(x^2+1)^4
        `,
        correct: String.raw`
          \boxed{
          10x(x^2+1)^4
          }
        `
      },

      {
        mistake:
          'Forgetting y′ in implicit differentiation',
        wrong: String.raw`
          \frac{d}{dx}(y^2)=2y
        `,
        correct: String.raw`
          \boxed{
          \frac{d}{dx}(y^2)=2yy'
          }
        `
      }
    ]
  },

  // ============================================================
  // GLOSSARY
  // ============================================================

  glossary: [
    {
      term: 'Derivative',
      definition:
        'The instantaneous rate of change of a function or the slope of its tangent line.',
      math: String.raw`
        f'(x)
      `
    },

    {
      term: 'Difference Quotient',
      definition:
        'The expression used to calculate a secant slope before taking a limit.',
      math: String.raw`
        \frac{f(x+h)-f(x)}{h}
      `
    },

    {
      term: 'Tangent Line',
      definition:
        'A line that locally follows a curve and has slope equal to the derivative.'
    },

    {
      term: 'Chain Rule',
      definition:
        'A rule for differentiating composite functions.'
    },

    {
      term: 'Implicit Differentiation',
      definition:
        'Differentiating an equation containing x and y without first solving explicitly for y.'
    },

    {
      term: 'Second Derivative',
      definition:
        'The derivative of the first derivative; often describes concavity or acceleration.',
      math: String.raw`
        f''(x)
      `
    }
  ],

  // ============================================================
  // FINAL SUMMARY
  // ============================================================

  finalSummary: {
    title: 'Derivatives â€” What You Must Know',

    bigIdeas: [
      'Derivative = instantaneous rate of change.',
      'Derivative = slope of the tangent line.',
      'The derivative comes from a limit of secant slopes.',
      'The structure of the function determines which differentiation rule to use.',
      'The Chain Rule handles functions inside functions.',
      'Implicit differentiation handles equations where y is not isolated.',
      'Higher derivatives describe how rates themselves are changing.',
      'Every derivative should be interpretable with meaning and units.'
    ],

    formulas: [
      String.raw`
        \boxed{
        f'(a)
        =
        \lim_{h\to0}
        \frac{f(a+h)-f(a)}{h}
        }
      `,

      String.raw`
        \boxed{
        (fg)'=f'g+fg'
        }
      `,

      String.raw`
        \boxed{
        \left(\frac fg\right)'
        =
        \frac{f'g-fg'}{g^2}
        }
      `,

      String.raw`
        \boxed{
        \frac{d}{dx}f(g(x))
        =
        f'(g(x))g'(x)
        }
      `,

      String.raw`
        \boxed{
        y-f(a)=f'(a)(x-a)
        }
      `
    ],

    checklist: [
      'Can I explain a derivative in words?',
      'Can I connect secant slopes to tangent slopes?',
      'Can I use the limit definition?',
      'Can I use the Power Rule correctly?',
      'Can I recognize when Product Rule is needed?',
      'Can I recognize when Quotient Rule is needed?',
      'Can I identify inner and outer functions for Chain Rule?',
      'Do I know the six trig derivatives?',
      'Can I differentiate exponential and logarithmic functions?',
      'Can I perform implicit differentiation?',
      'Can I find a second derivative?',
      'Can I write the equation of a tangent line?',
      'Can I interpret a derivative with units?',
      'Can I choose the correct rule before beginning the algebra?'
    ],

    finalMessage:
      'Do not think of differentiation as a list of formulas. First identify how the function is built, then choose the rule that matches that structure.'
  }
};

export const integralsReview = {
  titleLines: ['Integrals', 'Fundamental Review'],

  description:
    'Understand integrals as accumulation and signed area, connect Riemann sums to definite integrals, master the Fundamental Theorem of Calculus, compute antiderivatives, use substitution, and apply integration to area, motion, and total change.',

  topicLabel: 'Integrals â€” Complete Review',

  topicDescription:
    'Move through the stations in order. Begin with the meaning of accumulation, then connect geometry, limits, antiderivatives, the Fundamental Theorem of Calculus, substitution, and applications.',

  overview: {
    bigIdea:
      'A derivative measures how fast something is changing. An integral accumulates those changes to recover a total amount.',

    studentGoal:
      'By the end of this review, you should understand what an integral means, distinguish definite and indefinite integrals, evaluate integrals correctly, choose an appropriate technique, and interpret answers in context.',

    memoryLine:
      'Derivative = rate of change. Integral = accumulated change.',

    masterFormula: String.raw`
      \boxed{
      \int_a^b f(x)\,dx
      =
      F(b)-F(a)
      \qquad\text{where }F'(x)=f(x)
      }
    `,

    roadmap: [
      'Understand accumulation and signed area.',
      'Connect rectangles and Riemann sums to definite integrals.',
      'Understand definite-integral notation.',
      'Learn properties of definite integrals.',
      'Understand antiderivatives and indefinite integrals.',
      'Master the Fundamental Theorem of Calculus.',
      'Use the Net Change Theorem.',
      'Master basic integration formulas.',
      'Learn u-substitution as the reverse Chain Rule.',
      'Find area between curves.',
      'Apply integration to motion and physical quantities.',
      'Develop a reliable integration decision process.'
    ]
  },

  stations: [

    // ============================================================
    // STATION 1
    // ============================================================

    {
      id: 'integral-intuition',

      title: '1. What Is an Integral?',

      description:
        'Begin with the idea of accumulation before learning integration formulas.',

      learnFirst: {
        intuition:
          'Imagine continuously adding tiny pieces. An integral tells us the total amount obtained after all of those tiny contributions are accumulated.',

        definition:
          'A definite integral measures net accumulation over an interval. Geometrically, it can be interpreted as signed area between a graph and the x-axis.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b f(x)\,dx
          =
          \text{net accumulation of }f
          \text{ from }a\text{ to }b
          }
        `,

        decisionCue:
          'Whenever you see total change, accumulated amount, net area, distance from velocity, or mass from density, think integration.'
      },

      visual: {
        type: 'accumulation-sweep',

        title: 'Watch the Integral Accumulate',

        description:
          'Animate a vertical strip moving from x=a toward x=b. As each thin strip is added, display the accumulated total.',

        stages: [
          'Start at x=a with accumulated amount 0.',
          'Create a thin strip of width Î”x.',
          'Approximate its contribution by f(x)Î”x.',
          'Move across the interval adding more strips.',
          'Make the strips thinner.',
          'Display the limiting accumulated amount as the definite integral.'
        ]
      },

      examples: [
        {
          title: 'Constant accumulation',

          math: String.raw`
            \int_0^4 3\,dx
          `,

          intuition:
            'The graph y=3 forms a rectangle of height 3 and width 4.',

          work: [
            String.raw`
              \text{Area}=3(4)=12
            `
          ],

          answer: String.raw`
            \boxed{12}
          `
        },

        {
          title: 'Integral as total change',

          given:
            'Water enters a tank at a rate of 5 gallons per minute for 6 minutes.',

          work: [
            String.raw`
              \int_0^6 5\,dt
              =
              5(6)
              =
              30
            `
          ],

          interpretation:
            'The tank receives 30 gallons of water.'
        }
      ],

      takeaway:
        'An integral is fundamentally about adding many tiny contributions to produce one total amount.',

      questions: [
        question(
          'integral-intuition-basic',
          'What does an integral represent?',
          'If r(t) is measured in gallons per minute, what does the integral of r(t) over a time interval represent?',
          ['Total gallons'],
          'Rate Ã— time accumulates to an amount. The integral gives the total quantity of water added.'
        )
      ]
    },

    // ============================================================
    // STATION 2
    // ============================================================

    {
      id: 'signed-area',

      title: '2. Signed Area',

      description:
        'Understand why definite integrals are not always ordinary geometric area.',

      learnFirst: {
        intuition:
          'Area above the x-axis contributes positively. Area below the x-axis contributes negatively.',

        definition:
          'The definite integral represents signed or net area.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b f(x)\,dx
          =
          A_{\text{above}}
          -
          A_{\text{below}}
          }
        `,

        decisionCue:
          'Ask whether the graph lies above or below the x-axis.'
      },

      animation: {
        type: 'signed-area',

        description:
          'Shade regions above the x-axis as positive contributions and regions below as negative contributions.',

        stages: [
          'Shade a region above the x-axis.',
          'Label it +A.',
          'Shade a region below the x-axis.',
          'Label it âˆ’B.',
          'Show net integral = A âˆ’ B.',
          'Then show total geometric area = A + B.'
        ]
      },

      examples: [
        {
          title: 'Net area versus total area',

          given:
            'Suppose the graph encloses 7 square units above the axis and 3 square units below the axis.',

          work: [
            String.raw`
              \int_a^b f(x)\,dx
              =
              7-3
              =
              4
            `
          ],

          answer: String.raw`
            \boxed{\text{Net signed area}=4}
          `,

          totalArea: String.raw`
            \boxed{\text{Total geometric area}=7+3=10}
          `
        }
      ],

      commonMistakes: [
        'Treating all area as positive when evaluating a definite integral.',
        'Confusing net area with total geometric area.',
        'Forgetting that portions below the x-axis contribute negatively.'
      ],

      takeaway:
        'Integral means signed accumulation. Geometric area is always nonnegative.'
    },

    // ============================================================
    // STATION 3
    // ============================================================

    {
      id: 'riemann-sums',

      title: '3. From Rectangles to the Definite Integral',

      description:
        'See how infinitely many thin rectangles lead to exact accumulation.',

      learnFirst: {
        intuition:
          'We cannot usually add infinitely many pieces directly, so we approximate with finitely many rectangles and then take a limit.',

        definition:
          'A Riemann sum approximates a definite integral by adding areas of thin rectangles.',

        definitionMath: String.raw`
          \boxed{
          \sum_{i=1}^{n}
          f(x_i^*)\Delta x
          }
        `,

        decisionCue:
          'Height Ã— width for each rectangle, then add.'
      },

      visual: {
        type: 'riemann-rectangle-refinement',

        title: 'Make the Rectangles Thinner',

        stages: [
          'Start with n=4 rectangles.',
          'Increase to n=8.',
          'Increase to n=20.',
          'Increase to n=100.',
          'Show the approximation converging to the exact area.'
        ]
      },

      formulas: [
        String.raw`
          \Delta x=\frac{b-a}{n}
        `,

        String.raw`
          x_i=a+i\Delta x
        `,

        String.raw`
          \boxed{
          \int_a^b f(x)\,dx
          =
          \lim_{n\to\infty}
          \sum_{i=1}^{n}
          f(x_i^*)\Delta x
          }
        `
      ],

      examples: [
        {
          title: 'Right-endpoint approximation',

          problem:
            'Approximate the area under f(x)=xÂ² on [0,2] using four right-endpoint rectangles.',

          work: [
            String.raw`
              \Delta x
              =
              \frac{2-0}{4}
              =
              \frac12
            `,

            String.raw`
              x_1=\frac12,\quad
              x_2=1,\quad
              x_3=\frac32,\quad
              x_4=2
            `,

            String.raw`
              R_4
              =
              \frac12
              \left[
              \left(\frac12\right)^2
              +
              1^2
              +
              \left(\frac32\right)^2
              +
              2^2
              \right]
            `,

            String.raw`
              =
              \frac12
              \left(
              \frac14+1+\frac94+4
              \right)
            `,

            String.raw`
              =
              \frac{15}{4}
            `
          ],

          answer: String.raw`
            \boxed{R_4=\frac{15}{4}}
          `
        }
      ],

      commonMistakes: [
        'Forgetting Î”x.',
        'Using the wrong endpoints.',
        'Confusing number of rectangles with rectangle width.',
        'Thinking a finite Riemann sum is automatically the exact integral.'
      ],

      takeaway:
        'The definite integral is the limit of increasingly accurate accumulation approximations.'
    },

    // ============================================================
    // STATION 4
    // ============================================================

    {
      id: 'definite-integral-notation',

      title: '4. Reading Integral Notation',

      description:
        'Understand every symbol in a definite integral.',

      learnFirst: {
        intuition:
          'Integral notation tells us what to accumulate, where to start, where to stop, and which variable is changing.',

        definition:
          'The definite integral contains an integrand, bounds, and differential.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b f(x)\,dx
          }
        `,

        decisionCue:
          'Read it as: accumulate f(x) with respect to x from x=a to x=b.'
      },

      parts: [
        {
          symbol: String.raw`\int`,
          meaning: 'Integral sign â€” continuous summation'
        },
        {
          symbol: String.raw`a`,
          meaning: 'Lower bound'
        },
        {
          symbol: String.raw`b`,
          meaning: 'Upper bound'
        },
        {
          symbol: String.raw`f(x)`,
          meaning: 'Integrand'
        },
        {
          symbol: String.raw`dx`,
          meaning: 'Variable of integration'
        }
      ],

      takeaway:
        'The dx is not decorative. It tells us which variable is being accumulated.'
    },

    // ============================================================
    // STATION 5
    // ============================================================

    {
      id: 'integral-properties',

      title: '5. Properties of Definite Integrals',

      description:
        'Use integral properties to reason without always finding antiderivatives.',

      learnFirst: {
        intuition:
          'Definite integrals behave naturally when intervals are split, reversed, or scaled.',

        definition:
          'Basic algebraic and interval properties let us simplify definite integrals.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b [f(x)+g(x)]\,dx
          =
          \int_a^b f(x)\,dx
          +
          \int_a^b g(x)\,dx
          }
        `,

        decisionCue:
          'Look for opportunities to split functions or intervals.'
      },

      properties: [
        {
          name: 'Same Bounds',
          math: String.raw`
            \int_a^a f(x)\,dx=0
          `
        },

        {
          name: 'Reverse Bounds',
          math: String.raw`
            \int_b^a f(x)\,dx
            =
            -\int_a^b f(x)\,dx
          `
        },

        {
          name: 'Constant Multiple',
          math: String.raw`
            \int_a^b cf(x)\,dx
            =
            c\int_a^b f(x)\,dx
          `
        },

        {
          name: 'Sum Rule',
          math: String.raw`
            \int_a^b(f+g)\,dx
            =
            \int_a^b f\,dx
            +
            \int_a^b g\,dx
          `
        },

        {
          name: 'Additivity',
          math: String.raw`
            \boxed{
            \int_a^c f(x)\,dx
            =
            \int_a^b f(x)\,dx
            +
            \int_b^c f(x)\,dx
            }
          `
        }
      ],

      examples: [
        {
          title: 'Use known integral values',

          given: String.raw`
            \int_1^4 f(x)\,dx=6,
            \qquad
            \int_4^7 f(x)\,dx=-2
          `,

          work: [
            String.raw`
              \int_1^7 f(x)\,dx
              =
              6+(-2)
              =
              4
            `
          ],

          answer: String.raw`
            \boxed{4}
          `
        }
      ]
    },

    // ============================================================
    // STATION 6
    // ============================================================

    {
      id: 'antiderivatives',

      title: '6. Antiderivatives and Indefinite Integrals',

      description:
        'Reverse differentiation.',

      learnFirst: {
        intuition:
          'Differentiation asks: what is the rate? Integration can ask the reverse question: what function produced this rate?', 

        definition:
          'An antiderivative of f is a function F whose derivative is f.',

        definitionMath: String.raw`
          \boxed{
          F'(x)=f(x)
          }
        `,

        decisionCue:
          'Ask: What function differentiates to the integrand?'
      },

      formulas: [
        String.raw`
          \boxed{
          \int f(x)\,dx=F(x)+C
          }
        `,

        String.raw`
          \boxed{
          \int x^n\,dx
          =
          \frac{x^{n+1}}{n+1}+C,
          \qquad n\neq-1
          }
        `
      ],

      animation: {
        type: 'reverse-derivative',

        description:
          'Show xÂ³ differentiating to 3xÂ², then reverse the arrow and label it integration.'
      },

      examples: [
        {
          title: 'Basic antiderivative',

          math: String.raw`
            \int 6x^2\,dx
          `,

          work: [
            String.raw`
              =
              6\left(\frac{x^3}{3}\right)+C
            `,
            String.raw`
              =
              2x^3+C
            `
          ],

          answer: String.raw`
            \boxed{2x^3+C}
          `
        },

        {
          title: 'Integrate term by term',

          math: String.raw`
            \int(4x^3-6x+5)\,dx
          `,

          work: [
            String.raw`
              =
              x^4-3x^2+5x+C
            `
          ]
        }
      ],

      commonMistakes: [
        'Forgetting +C on an indefinite integral.',
        'Using the derivative Power Rule instead of the integration Power Rule.',
        'Forgetting to divide by the new exponent.',
        'Using the power rule when n=-1.'
      ],

      takeaway:
        'Indefinite integral = family of antiderivatives.'
    },

    // ============================================================
    // STATION 7
    // ============================================================

    {
      id: 'constant-of-integration',

      title: '7. Why Do We Need +C?',

      description:
        'Understand the constant of integration instead of memorizing it mechanically.',

      learnFirst: {
        intuition:
          'Many different functions can have exactly the same derivative because constants disappear when differentiated.',

        definition:
          'The constant C represents all possible vertical shifts of an antiderivative.',

        definitionMath: String.raw`
          \frac{d}{dx}(F(x)+C)
          =
          F'(x)
        `,

        decisionCue:
          'Indefinite integral? Include +C. Definite integral? Do not add +C to the final value.'
      },

      visual: {
        type: 'antiderivative-family',

        description:
          'Display several vertically shifted curves such as xÂ², xÂ²+2, xÂ²âˆ’3, all with identical derivative 2x.'
      },

      example: {
        math: String.raw`
          \int2x\,dx=x^2+C
        `,

        explanation:
          'xÂ², xÂ²+5, xÂ²âˆ’100, and every other vertical shift all differentiate to 2x.'
      },

      takeaway:
        '+C represents an entire family of functions.'
    },

    // ============================================================
    // STATION 8
    // ============================================================

    {
      id: 'fundamental-theorem',

      title: '8. Fundamental Theorem of Calculus',

      description:
        'Connect derivatives and integrals â€” the central bridge of Calculus.',

      learnFirst: {
        intuition:
          'Differentiation and integration are inverse processes.',

        definition:
          'The Fundamental Theorem of Calculus connects accumulation with antiderivatives.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b f(x)\,dx
          =
          F(b)-F(a)
          }
        `,

        decisionCue:
          'For a definite integral: find an antiderivative, evaluate at the top, subtract the value at the bottom.'
      },

      visual: {
        type: 'ftc-bridge',

        title: 'Derivative â†” Integral',

        stages: [
          'Start with F.',
          'Differentiate: F â†’ f.',
          'Integrate: f â†’ F.',
          'Display the two operations as inverse processes.'
        ]
      },

      examples: [
        {
          title: 'Evaluate a definite integral',

          math: String.raw`
            \int_1^3 2x\,dx
          `,

          work: [
            String.raw`
              F(x)=x^2
            `,
            String.raw`
              \left[x^2\right]_1^3
            `,
            String.raw`
              =3^2-1^2
            `,
            String.raw`
              =9-1=8
            `
          ],

          answer: String.raw`
            \boxed{8}
          `
        },

        {
          title: 'Polynomial example',

          math: String.raw`
            \int_0^2(3x^2+4)\,dx
          `,

          work: [
            String.raw`
              =
              \left[x^3+4x\right]_0^2
            `,
            String.raw`
              =
              (8+8)-(0)
            `,
            String.raw`
              =16
            `
          ],

          answer: String.raw`
            \boxed{16}
          `
        }
      ],

      commonMistakes: [
        'Doing bottom minus top instead of top minus bottom.',
        'Forgetting to evaluate every term at both bounds.',
        'Adding +C to a final definite-integral answer.',
        'Forgetting parentheses when substituting bounds.'
      ],

      memoryAid:
        'TOP minus BOTTOM.',

      takeaway:
        'The FTC transforms an accumulation problem into an antiderivative problem.'
    },

    // ============================================================
    // STATION 9
    // ============================================================

    {
      id: 'ftc-part-one',

      title: '9. Accumulation Functions and FTC Part I',

      description:
        'Differentiate an integral whose upper bound is a variable.',

      learnFirst: {
        intuition:
          'If an accumulation function grows by adding more area, its instantaneous rate of growth is simply the height of the graph at the moving endpoint.',

        definition:
          'If A(x) accumulates f from a fixed point to x, then A′(x)=f(x).',

        definitionMath: String.raw`
          \boxed{
          \frac{d}{dx}
          \left(
          \int_a^x f(t)\,dt
          \right)
          =
          f(x)
          }
        `,

        decisionCue:
          'Derivative outside an integral with upper bound x? FTC Part I.'
      },

      animation: {
        type: 'moving-upper-bound',

        description:
          'Move the upper boundary x to the right. Highlight the tiny new strip added and connect its height to f(x).'
      },

      examples: [
        {
          title: 'Direct FTC',

          math: String.raw`
            F(x)
            =
            \int_1^x(t^3+2t)\,dt
          `,

          work: [
            String.raw`
              \boxed{
              F'(x)=x^3+2x
              }
            `
          ],

          explanation:
            'No integration is necessary.'
        },

        {
          title: 'FTC + Chain Rule',

          math: String.raw`
            G(x)=
            \int_0^{x^2}\cos t\,dt
          `,

          work: [
            String.raw`
              G'(x)
              =
              \cos(x^2)(2x)
            `
          ],

          answer: String.raw`
            \boxed{2x\cos(x^2)}
          `,

          explanation:
            'FTC gives the integrand evaluated at xÂ², then Chain Rule contributes 2x.'
        }
      ],

      commonMistakes: [
        'Trying to evaluate the integral before differentiating.',
        'Forgetting Chain Rule when the upper bound is not simply x.',
        'Confusing the dummy variable t with x.'
      ]
    },

    // ============================================================
    // STATION 10
    // ============================================================

    {
      id: 'basic-integration-formulas',

      title: '10. Essential Integration Formulas',

      description:
        'Build the antiderivative library students should recognize immediately.',

      learnFirst: {
        intuition:
          'Integration becomes much easier when basic antiderivatives are automatic.',

        definition:
          'These formulas reverse familiar derivative formulas.',

        definitionMath: String.raw`
          \boxed{
          \int x^n\,dx
          =
          \frac{x^{n+1}}{n+1}+C
          }
        `,

        decisionCue:
          'Before choosing an advanced method, check whether the integral matches a basic formula.'
      },

      formulas: [
        String.raw`
          \int x^n\,dx
          =
          \frac{x^{n+1}}{n+1}+C,
          \quad n\neq-1
        `,

        String.raw`
          \int\frac1x\,dx
          =
          \ln|x|+C
        `,

        String.raw`
          \int e^x\,dx
          =
          e^x+C
        `,

        String.raw`
          \int a^x\,dx
          =
          \frac{a^x}{\ln a}+C
        `,

        String.raw`
          \int\cos x\,dx
          =
          \sin x+C
        `,

        String.raw`
          \int\sin x\,dx
          =
          -\cos x+C
        `,

        String.raw`
          \int\sec^2x\,dx
          =
          \tan x+C
        `,

        String.raw`
          \int\csc^2x\,dx
          =
          -\cot x+C
        `,

        String.raw`
          \int\sec x\tan x\,dx
          =
          \sec x+C
        `,

        String.raw`
          \int\csc x\cot x\,dx
          =
          -\csc x+C
        `
      ],

      visual: {
        type: 'derivative-integral-pairs',

        description:
          'Display derivative formulas on one side and their reversed integral forms on the other.'
      },

      questions: [
        question(
          'basic-integral-power',
          'Power Rule',
          'Evaluate the indefinite integral of x^6.',
          ['x^7/7 + C'],
          'Increase the exponent by one and divide by the new exponent.'
        )
      ]
    },

    // ============================================================
    // STATION 11
    // ============================================================

    {
      id: 'u-substitution',

      title: '11. u-Substitution â€” Reverse Chain Rule',

      description:
        'Recognize and undo composite-function derivatives.',

      learnFirst: {
        intuition:
          'When differentiation uses the Chain Rule, integration often reverses it using substitution.',

        definition:
          'Choose u to represent an inner expression, convert the remaining differential into du, integrate in u, then substitute back.',

        definitionMath: String.raw`
          \boxed{
          u=g(x),
          \qquad
          du=g'(x)\,dx
          }
        `,

        decisionCue:
          'Look for an inside function and something proportional to its derivative nearby.'
      },

      animation: {
        type: 'reverse-chain-rule',

        title: 'Spot the Inside Function',

        stages: [
          'Highlight the inner expression.',
          'Label it u.',
          'Differentiate it to find du.',
          'Replace the complicated expression with u.',
          'Integrate the simpler function.',
          'Substitute the original expression back.'
        ]
      },

      examples: [
        {
          title: 'Basic substitution',

          math: String.raw`
            \int2x(x^2+1)^5\,dx
          `,

          work: [
            String.raw`
              u=x^2+1
            `,
            String.raw`
              du=2x\,dx
            `,
            String.raw`
              \int u^5\,du
            `,
            String.raw`
              =
              \frac{u^6}{6}+C
            `,
            String.raw`
              =
              \frac{(x^2+1)^6}{6}+C
            `
          ],

          answer: String.raw`
            \boxed{
            \frac{(x^2+1)^6}{6}+C
            }
          `
        },

        {
          title: 'Logarithmic pattern',

          math: String.raw`
            \int\frac{2x}{x^2+4}\,dx
          `,

          work: [
            String.raw`
              u=x^2+4
            `,
            String.raw`
              du=2x\,dx
            `,
            String.raw`
              \int\frac1u\,du
            `,
            String.raw`
              =\ln|u|+C
            `,
            String.raw`
              =
              \ln(x^2+4)+C
            `
          ],

          answer: String.raw`
            \boxed{\ln(x^2+4)+C}
          `
        },

        {
          title: 'Trig substitution pattern',

          math: String.raw`
            \int\cos(3x)\,dx
          `,

          work: [
            String.raw`
              u=3x
            `,
            String.raw`
              du=3dx
            `,
            String.raw`
              dx=\frac13du
            `,
            String.raw`
              =
              \frac13\int\cos u\,du
            `,
            String.raw`
              =
              \frac13\sin u+C
            `,
            String.raw`
              =
              \frac13\sin(3x)+C
            `
          ]
        }
      ],

      commonMistakes: [
        'Choosing u but leaving x terms behind.',
        'Forgetting to convert dx.',
        'Forgetting constant factors.',
        'Substituting back too early.',
        'Using u-substitution when there is no useful inner-function relationship.'
      ],

      takeaway:
        'u-substitution is the Chain Rule running backward.',

      questions: [
        question(
          'u-sub-basic',
          'Choose u',
          'For the integral 6x(xÂ²+5)^4 dx, what is the most natural choice for u?',
          ['x^2+5'],
          'Choose the inner expression because its derivative 2x is already present up to a constant factor.'
        )
      ]
    },

    // ============================================================
    // STATION 12
    // ============================================================

    {
      id: 'definite-u-substitution',

      title: '12. u-Substitution in Definite Integrals',

      description:
        'Learn the two correct ways to handle bounds during substitution.',

      learnFirst: {
        intuition:
          'Once you change variables, the bounds must match the new variable unless you substitute back before evaluating.',

        definition:
          'For definite integrals, either change the bounds to u-values or return completely to x before using the original bounds.',

        definitionMath: String.raw`
          u=g(x)
          \quad\Longrightarrow\quad
          x=a,b
          \text{ must be converted if integrating in }u
        `,

        decisionCue:
          'Never use x-bounds on an integral written entirely in u.'
      },

      examples: [
        {
          title: 'Change the bounds',

          math: String.raw`
            \int_0^1 2x(x^2+1)^2\,dx
          `,

          work: [
            String.raw`
              u=x^2+1,\qquad du=2x\,dx
            `,
            String.raw`
              x=0\Rightarrow u=1
            `,
            String.raw`
              x=1\Rightarrow u=2
            `,
            String.raw`
              \int_1^2u^2\,du
            `,
            String.raw`
              =
              \left[\frac{u^3}{3}\right]_1^2
            `,
            String.raw`
              =
              \frac83-\frac13
              =
              \frac73
            `
          ],

          answer: String.raw`
            \boxed{\frac73}
          `
        }
      ],

      commonMistakes: [
        'Changing to u but keeping x-bounds.',
        'Changing bounds and then substituting back unnecessarily.',
        'Forgetting that bounds belong to the current variable.'
      ]
    },

    // ============================================================
    // STATION 13
    // ============================================================

    {
      id: 'net-change',

      title: '13. Net Change Theorem',

      description:
        'Recover total change from a known rate of change.',

      learnFirst: {
        intuition:
          'If you know how fast something changes at every moment, integration adds those changes together.',

        definition:
          'The integral of a rate of change gives net change.',

        definitionMath: String.raw`
          \boxed{
          \int_a^b F'(x)\,dx
          =
          F(b)-F(a)
          }
        `,

        decisionCue:
          'Given a rate and asked for total change? Integrate the rate.'
      },

      examples: [
        {
          title: 'Population growth',

          given:
            'A population grows at a rate P′(t)=100+20t people per year from t=0 to t=5.',

          work: [
            String.raw`
              \Delta P
              =
              \int_0^5(100+20t)\,dt
            `,
            String.raw`
              =
              \left[100t+10t^2\right]_0^5
            `,
            String.raw`
              =
              500+250
            `,
            String.raw`
              =750
            `
          ],

          interpretation:
            'The population increases by 750 people.'
        }
      ],

      takeaway:
        'Rate integrated over time gives accumulated change.'
    },

    // ============================================================
    // STATION 14
    // ============================================================

    {
      id: 'motion-integrals',

      title: '14. Position, Velocity, and Distance',

      description:
        'Use integrals to recover position and distinguish displacement from distance traveled.',

      learnFirst: {
        intuition:
          'Velocity tells how position changes. Integrating velocity gives displacement.',

        definition:
          'The integral of velocity gives net displacement. The integral of speed gives total distance traveled.',

        definitionMath: String.raw`
          \boxed{
          \text{Displacement}
          =
          \int_a^b v(t)\,dt
          }
        `,

        decisionCue:
          'Displacement uses v(t). Distance traveled uses |v(t)|.'
      },

      formulas: [
        String.raw`
          s(b)-s(a)
          =
          \int_a^b v(t)\,dt
        `,

        String.raw`
          \boxed{
          \text{Distance}
          =
          \int_a^b |v(t)|\,dt
          }
        `
      ],

      visual: {
        type: 'velocity-signed-area',

        description:
          'Show positive velocity contributing forward displacement and negative velocity contributing backward displacement.'
      },

      examples: [
        {
          title: 'Displacement',

          math: String.raw`
            v(t)=2t-4,
            \qquad
            0\le t\le4
          `,

          work: [
            String.raw`
              \int_0^4(2t-4)\,dt
            `,
            String.raw`
              =
              \left[t^2-4t\right]_0^4
            `,
            String.raw`
              =
              16-16
            `,
            String.raw`
              =0
            `
          ],

          interpretation:
            'The particle ends where it started, so displacement is zero.'
        },

        {
          title: 'But distance is not zero',

          explanation:
            'Velocity changes sign at t=2, so split the interval.',

          math: String.raw`
            \text{Distance}
            =
            \int_0^2|2t-4|\,dt
            +
            \int_2^4|2t-4|\,dt
          `,

          conclusion:
            'The particle moved even though its net displacement was zero.'
        }
      ],

      commonMistakes: [
        'Calling displacement distance.',
        'Ignoring intervals where velocity is negative.',
        'Using |âˆ«v| instead of âˆ«|v| for total distance.'
      ]
    },

    // ============================================================
    // STATION 15
    // ============================================================

    {
      id: 'area-between-curves',

      title: '15. Area Between Curves',

      description:
        'Use integration to find the region enclosed by two graphs.',

      learnFirst: {
        intuition:
          'Each thin vertical strip has height equal to the upper function minus the lower function.',

        definition:
          'Area between curves is obtained by integrating top minus bottom.',

        definitionMath: String.raw`
          \boxed{
          A=
          \int_a^b
          \left[
          f_{\text{top}}(x)
          -
          f_{\text{bottom}}(x)
          \right]dx
          }
        `,

        decisionCue:
          'Find intersections first, then determine which graph is on top.'
      },

      animation: {
        type: 'area-between-curves-strip',

        description:
          'Animate a vertical strip between two curves and label its height top âˆ’ bottom.'
      },

      examples: [
        {
          title: 'Area between y=x and y=xÂ²',

          problem:
            'Find the enclosed area between y=x and y=xÂ².',

          work: [
            'First find intersections:',

            String.raw`
              x=x^2
            `,

            String.raw`
              x(x-1)=0
            `,

            String.raw`
              x=0,\quad1
            `,

            'On [0,1], x is above xÂ².',

            String.raw`
              A
              =
              \int_0^1(x-x^2)\,dx
            `,

            String.raw`
              =
              \left[
              \frac{x^2}{2}
              -
              \frac{x^3}{3}
              \right]_0^1
            `,

            String.raw`
              =
              \frac12-\frac13
              =
              \frac16
            `
          ],

          answer: String.raw`
            \boxed{\frac16}
          `
        }
      ],

      commonMistakes: [
        'Using bottom minus top.',
        'Skipping the intersection calculation.',
        'Assuming the same function remains on top over the entire interval.',
        'Forgetting that area must be nonnegative.'
      ],

      takeaway:
        'Vertical strips: top minus bottom.'
    },

    // ============================================================
    // STATION 16
    // ============================================================

    {
      id: 'symmetry-integrals',

      title: '16. Symmetry Can Save Work',

      description:
        'Recognize even and odd functions before integrating.',

      learnFirst: {
        intuition:
          'Symmetric graphs often allow us to predict or simplify definite integrals.',

        definition:
          'Even functions mirror across the y-axis. Odd functions rotate symmetrically through the origin.',

        definitionMath: String.raw`
          f(-x)=f(x)
          \quad\text{or}\quad
          f(-x)=-f(x)
        `,

        decisionCue:
          'On [-a,a], check symmetry before integrating.'
      },

      properties: [
        {
          name: 'Even Function',
          math: String.raw`
            \boxed{
            \int_{-a}^{a}f(x)\,dx
            =
            2\int_0^a f(x)\,dx
            }
          `
        },

        {
          name: 'Odd Function',
          math: String.raw`
            \boxed{
            \int_{-a}^{a}f(x)\,dx=0
            }
          `
        }
      ],

      examples: [
        {
          title: 'Odd function shortcut',

          math: String.raw`
            \int_{-3}^{3}x^5\,dx
          `,

          reasoning:
            'xâµ is odd and the interval is symmetric.',

          answer: String.raw`
            \boxed{0}
          `
        },

        {
          title: 'Even function shortcut',

          math: String.raw`
            \int_{-2}^{2}x^2\,dx
          `,

          work: [
            String.raw`
              =
              2\int_0^2x^2\,dx
            `,
            String.raw`
              =
              2\left[\frac{x^3}{3}\right]_0^2
            `,
            String.raw`
              =
              \frac{16}{3}
            `
          ]
        }
      ]
    },

    // ============================================================
    // STATION 17
    // ============================================================

    {
      id: 'integral-decision-tree',

      title: '17. What Should I Do With This Integral?',

      description:
        'Develop a reliable decision process instead of guessing.',

      learnFirst: {
        intuition:
          'Integration is often a recognition problem. Before calculating, inspect the structure.',

        definition:
          'Choose the simplest method that matches the form of the integrand.',

        definitionMath: String.raw`
          \boxed{
          \text{Recognize}
          \rightarrow
          \text{Choose technique}
          \rightarrow
          \text{Integrate}
          \rightarrow
          \text{Check}
          }
        `,

        decisionCue:
          'Do not immediately manipulate the expression. First ask what structure you see.'
      },

      decisionTree: [
        {
          question: 'Does it match a basic antiderivative formula?',
          action: 'Integrate directly.'
        },

        {
          question: 'Is it a sum or difference?',
          action: 'Split the integral term by term.'
        },

        {
          question: 'Is there an inside function and its derivative?',
          action: 'Try u-substitution.'
        },

        {
          question: 'Is it definite?',
          action:
            'After finding an antiderivative, use the FTC: top minus bottom.'
        },

        {
          question: 'Is the problem asking for geometric area?',
          action:
            'Determine where the function changes sign or which curve is on top.'
        },

        {
          question: 'Does the interval have symmetry?',
          action:
            'Check whether the integrand is even or odd.'
        },

        {
          question: 'Is the expression more complicated than these methods handle?',
          action:
            'A later Calculus II technique may be required: integration by parts, trig integrals, trig substitution, or partial fractions.'
        }
      ],

      visual: {
        type: 'integration-method-selector',

        description:
          'Give students sample integrals and let them choose the method before revealing the solution.'
      },

      examples: [
        {
          expression: String.raw`
            \int x^7\,dx
          `,
          method: 'Basic Power Rule'
        },

        {
          expression: String.raw`
            \int2x(x^2+4)^6\,dx
          `,
          method: 'u-Substitution'
        },

        {
          expression: String.raw`
            \int_0^\pi\sin x\,dx
          `,
          method: 'Basic trig antiderivative + FTC'
        },

        {
          expression: String.raw`
            \int_{-2}^{2}x^3\,dx
          `,
          method: 'Odd-function symmetry'
        }
      ]
    },

    // ============================================================
    // STATION 18
    // ============================================================

    {
      id: 'mixed-integral-practice',

      title: '18. Mixed Integral Practice',

      description:
        'Identify the idea first, then calculate.',

      learnFirst: {
        intuition:
          'Real problems rarely announce which rule or theorem to use.',

        definition:
          'Mixed practice develops conceptual recognition as well as computational skill.',

        definitionMath: String.raw`
          \text{Meaning}
          \rightarrow
          \text{Method}
          \rightarrow
          \text{Calculation}
          \rightarrow
          \text{Interpretation}
        `,

        decisionCue:
          'Before calculating, say what the integral represents and which method you intend to use.'
      },

      examples: [
        {
          title: 'Direct antiderivative',

          math: String.raw`
            \int
            \left(
            3x^2-\frac4{x^2}+e^x
            \right)dx
          `,

          work: [
            String.raw`
              =
              \int
              \left(
              3x^2-4x^{-2}+e^x
              \right)dx
            `,

            String.raw`
              =
              x^3+4x^{-1}+e^x+C
            `
          ],

          answer: String.raw`
            \boxed{
            x^3+\frac4x+e^x+C
            }
          `
        },

        {
          title: 'Substitution',

          math: String.raw`
            \int xe^{x^2}\,dx
          `,

          work: [
            String.raw`
              u=x^2
            `,

            String.raw`
              du=2x\,dx
            `,

            String.raw`
              x\,dx=\frac12du
            `,

            String.raw`
              =
              \frac12\int e^u\,du
            `,

            String.raw`
              =
              \frac12e^u+C
            `,

            String.raw`
              =
              \boxed{
              \frac12e^{x^2}+C
              }
            `
          ]
        },

        {
          title: 'Definite integral',

          math: String.raw`
            \int_0^2(x+1)\,dx
          `,

          work: [
            String.raw`
              =
              \left[
              \frac{x^2}{2}+x
              \right]_0^2
            `,

            String.raw`
              =
              (2+2)-0
            `,

            String.raw`
              =
              \boxed{4}
            `
          ]
        }
      ]
    }
  ],

  // ============================================================
  // FORMULA LIBRARY
  // ============================================================

  formulaLibrary: {
    title: 'Integration Formula Library',

    sections: [
      {
        title: 'Power and Basic Functions',

        formulas: [
          String.raw`
            \int x^n\,dx
            =
            \frac{x^{n+1}}{n+1}+C,
            \quad n\neq-1
          `,

          String.raw`
            \int\frac1x\,dx
            =
            \ln|x|+C
          `,

          String.raw`
            \int e^x\,dx=e^x+C
          `,

          String.raw`
            \int a^x\,dx
            =
            \frac{a^x}{\ln a}+C
          `
        ]
      },

      {
        title: 'Trigonometric',

        formulas: [
          String.raw`
            \int\sin x\,dx=-\cos x+C
          `,

          String.raw`
            \int\cos x\,dx=\sin x+C
          `,

          String.raw`
            \int\sec^2x\,dx=\tan x+C
          `,

          String.raw`
            \int\csc^2x\,dx=-\cot x+C
          `,

          String.raw`
            \int\sec x\tan x\,dx=\sec x+C
          `,

          String.raw`
            \int\csc x\cot x\,dx=-\csc x+C
          `
        ]
      },

      {
        title: 'Fundamental Theorem',

        formulas: [
          String.raw`
            \int_a^b f(x)\,dx
            =
            F(b)-F(a)
          `,

          String.raw`
            \frac{d}{dx}
            \int_a^x f(t)\,dt
            =
            f(x)
          `
        ]
      },

      {
        title: 'Substitution',

        formulas: [
          String.raw`
            u=g(x),
            \qquad
            du=g'(x)\,dx
          `,

          String.raw`
            \int
            f(g(x))g'(x)\,dx
            =
            \int f(u)\,du
          `
        ]
      }
    ]
  },

  // ============================================================
  // CONNECTION TO DERIVATIVES
  // ============================================================

  derivativeConnection: {
    title: 'Derivatives and Integrals Are Partners',

    pairs: [
      {
        derivative: String.raw`
          \frac{d}{dx}(x^5)=5x^4
        `,
        integral: String.raw`
          \int5x^4\,dx=x^5+C
        `
      },

      {
        derivative: String.raw`
          \frac{d}{dx}(\sin x)=\cos x
        `,
        integral: String.raw`
          \int\cos x\,dx=\sin x+C
        `
      },

      {
        derivative: String.raw`
          \frac{d}{dx}(e^x)=e^x
        `,
        integral: String.raw`
          \int e^x\,dx=e^x+C
        `
      },

      {
        derivative: String.raw`
          \frac{d}{dx}\ln|x|=\frac1x
        `,
        integral: String.raw`
          \int\frac1x\,dx=\ln|x|+C
        `
      }
    ],

    memoryLine:
      'Differentiation breaks change into a rate. Integration rebuilds the accumulated change.'
  },

  // ============================================================
  // COMMON MISTAKES
  // ============================================================

  commonMistakes: {
    title: 'Integral Traps to Avoid',

    items: [
      {
        mistake:
          'Using the derivative Power Rule when integrating.',

        wrong: String.raw`
          \int x^5\,dx=5x^4
        `,

        correct: String.raw`
          \boxed{
          \int x^5\,dx=\frac{x^6}{6}+C
          }
        `
      },

      {
        mistake:
          'Forgetting the constant of integration.',

        wrong: String.raw`
          \int2x\,dx=x^2
        `,

        correct: String.raw`
          \boxed{
          \int2x\,dx=x^2+C
          }
        `
      },

      {
        mistake:
          'Using the power rule on 1/x.',

        wrong: String.raw`
          \int x^{-1}\,dx
          =
          \frac{x^0}{0}
        `,

        correct: String.raw`
          \boxed{
          \int\frac1x\,dx
          =
          \ln|x|+C
          }
        `
      },

      {
        mistake:
          'Evaluating definite integrals backwards.',

        wrong: String.raw`
          F(a)-F(b)
        `,

        correct: String.raw`
          \boxed{
          F(b)-F(a)
          }
        `
      },

      {
        mistake:
          'Assuming definite integral always means positive area.',

        correction:
          'A definite integral gives signed/net area.'
      },

      {
        mistake:
          'Using x-bounds after changing the integral to u.',

        correction:
          'Either convert the bounds to u or substitute back to x before evaluating.'
      }
    ]
  },

  // ============================================================
  // GLOSSARY
  // ============================================================

  glossary: [
    {
      term: 'Definite Integral',
      definition:
        'The net accumulation of a function over an interval.',
      math: String.raw`
        \int_a^b f(x)\,dx
      `
    },

    {
      term: 'Indefinite Integral',
      definition:
        'The family of all antiderivatives of a function.',
      math: String.raw`
        \int f(x)\,dx=F(x)+C
      `
    },

    {
      term: 'Integrand',
      definition:
        'The function being integrated.'
    },

    {
      term: 'Antiderivative',
      definition:
        'A function whose derivative equals the given function.',
      math: String.raw`
        F'(x)=f(x)
      `
    },

    {
      term: 'Riemann Sum',
      definition:
        'A finite sum of rectangle contributions used to approximate a definite integral.'
    },

    {
      term: 'Fundamental Theorem of Calculus',
      definition:
        'The theorem connecting definite integrals with antiderivatives and showing that differentiation and integration are inverse processes.'
    },

    {
      term: 'u-Substitution',
      definition:
        'An integration method that reverses the Chain Rule.'
    },

    {
      term: 'Net Change',
      definition:
        'The accumulated effect of a rate over an interval.'
    }
  ],

  // ============================================================
  // FINAL SUMMARY
  // ============================================================

  finalSummary: {
    title: 'Integrals â€” What You Must Know',

    bigIdeas: [
      'An integral represents accumulation.',
      'A definite integral represents net signed area.',
      'A Riemann sum approximates an integral using rectangles.',
      'An indefinite integral is a family of antiderivatives.',
      'Always include +C for indefinite integrals.',
      'The Fundamental Theorem of Calculus connects integration and differentiation.',
      'For definite integrals, evaluate antiderivatives using top minus bottom.',
      'u-substitution reverses the Chain Rule.',
      'The integral of a rate gives net change.',
      'Displacement and total distance are not the same.',
      'Area between curves is top minus bottom.',
      'Symmetry can simplify definite integrals.'
    ],

    formulas: [
      String.raw`
        \boxed{
        \int_a^b f(x)\,dx
        =
        \lim_{n\to\infty}
        \sum_{i=1}^{n}
        f(x_i^*)\Delta x
        }
      `,

      String.raw`
        \boxed{
        \int x^n\,dx
        =
        \frac{x^{n+1}}{n+1}+C
        }
      `,

      String.raw`
        \boxed{
        \int_a^b f(x)\,dx
        =
        F(b)-F(a)
        }
      `,

      String.raw`
        \boxed{
        \frac{d}{dx}
        \int_a^x f(t)\,dt
        =
        f(x)
        }
      `,

      String.raw`
        \boxed{
        u=g(x),
        \qquad
        du=g'(x)\,dx
        }
      `
    ],

    checklist: [
      'Can I explain what a definite integral means?',
      'Can I distinguish signed area from geometric area?',
      'Can I explain how Riemann sums lead to integrals?',
      'Can I distinguish definite and indefinite integrals?',
      'Do I know when +C is required?',
      'Can I apply the integration Power Rule?',
      'Do I recognize basic trig, exponential, and logarithmic antiderivatives?',
      'Can I use the Fundamental Theorem of Calculus?',
      'Can I differentiate an accumulation function?',
      'Can I recognize when u-substitution is appropriate?',
      'Can I correctly change bounds during substitution?',
      'Can I calculate net change from a rate?',
      'Can I distinguish displacement from total distance?',
      'Can I find area between two curves?',
      'Can I exploit even/odd symmetry?',
      'Can I identify the correct integration strategy before calculating?'
    ],

    finalMessage:
      'Do not think of an integral as simply â€œthe opposite of a derivative.â€ Think of it as accumulation. Antiderivatives are the powerful tool that the Fundamental Theorem gives us for calculating that accumulation.'
  }
};

export const flattenReviewQuestions = (review) =>
  (review?.stations || []).flatMap((station) =>
    (station.questions || []).map((item) => ({ ...item, stationId: station.id })),
  )
