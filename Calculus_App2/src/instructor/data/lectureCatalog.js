import { trigonometryLecture } from './trigonometryLecture'
import { hyperbolicLecture, inverseTrigLecture } from './calculus2TrigLectures'
import { geometryLecture } from './geometryLecture'
import { applyLectureRequirements } from '../services/lectureRequirements'
import { exponentialGrowthLecture } from './exponentialGrowthLecture'
import { chapter121Lecture, chapter122Lecture, chapter123Lecture } from './chapter12Lectures'

const note = (type, title, content, math) => ({ type, title, content, math })

const slide = (id, type, title, presentationContent, options = {}) => ({
  id, type, title, presentationContent, presenterNotes: [], studentNotes: [], revealSteps: [], ...options,
})

const legacyRealNumbersSlides = [
  slide('rn-title', 'title', 'Real Numbers & Algebra', [
    { kind: 'eyebrow', value: 'Review Week · Instructor Lecture' },
    { kind: 'text', value: 'Building the number system calculus needs' },
  ], { presenterNotes: [note('teaching', 'Opening story', 'Begin with counting—not a finished diagram of every number set. We will enlarge one number line each time an operation exposes something missing.')] }),
  slide('rn-objectives', 'section', 'Today’s mathematical story', [
    { kind: 'list', value: ['Build natural, integer, rational, and real number systems from arithmetic needs.', 'Distinguish dense from complete.', 'Explain why the real numbers support limiting processes in calculus.'] },
  ], { presenterNotes: [note('connection', 'Course connection', 'Return to these ideas when limits, sequences, the Intermediate Value Theorem, and existence arguments appear.')] }),
  slide('rn-natural', 'definition', 'Start with counting', [
    { kind: 'math', value: '\\mathbb{N}=\\{1,2,3,4,\\ldots\\}' },
    { kind: 'callout', value: 'For this lecture, the natural numbers begin with 1.' },
  ], { presenterNotes: [note('definition', 'Natural numbers', 'The numbers used to count discrete objects.'), note('ask', 'Ask students', 'What arithmetic operation can we perform without leaving this set?')] }),
  slide('rn-addition', 'visualization', 'Addition stays inside the natural numbers', [], {
    visualization: 'natural-addition',
    presenterNotes: [note('teaching', 'Discover closure', 'Choose a and b. Move b steps from a, then name the pattern only after students see that the result remains natural.'), note('formula', 'Closure under addition', '', 'a,b\\in\\mathbb N\\implies a+b\\in\\mathbb N')],
  }),
  slide('rn-subtraction-question', 'live-question', 'What happens with subtraction?', [
    { kind: 'math', value: '2-5=-3' }, { kind: 'text', value: 'Is the result still a natural number?' },
  ], { question: { type: 'multiple-choice', prompt: 'What does 2 − 5 tell us about the natural numbers?', options: ['They are closed under subtraction', 'They are not closed under subtraction', 'Subtraction is undefined'], correctAnswer: 1 }, presenterNotes: [note('discussion', 'Discuss', 'An operation can be meaningful even when its result is outside the current set.')] }),
  slide('rn-integers', 'animation', 'Extend the same number line', [
    { kind: 'math', value: '\\mathbb Z=\\{\\ldots,-3,-2,-1,0,1,2,3,\\ldots\\}' }, { kind: 'math', value: '\\mathbb N\\subset\\mathbb Z' },
  ], { visualization: 'integer-extension', revealSteps: ['Add zero', 'Add negative integers', 'Name the integers', 'Show the containment relationship'], presenterNotes: [note('teaching', 'Keep one story', 'Do not replace the number line. Visually extend it left so the need for integers feels inevitable.')] }),
  slide('rn-inverse', 'worked-example', 'Subtraction is addition of an inverse', [
    { kind: 'math', value: 'a-b=a+(-b)' }, { kind: 'math', value: 'a+(-a)=0' },
  ], { revealSteps: ['Start at a', 'Reflect b to locate −b', 'Add −b', 'Identify 0 as the additive identity'], presenterNotes: [note('definition', 'Additive inverse', 'The additive inverse of a is −a because their sum is the additive identity 0.')] }),
  slide('rn-division', 'live-question', 'Are integers enough for division?', [
    { kind: 'math', value: '1\\div2=\\frac12' }, { kind: 'text', value: 'The result is not an integer.' },
  ], { question: { type: 'true-false', prompt: 'The integers are closed under division.', options: ['True', 'False'], correctAnswer: 1 } }),
  slide('rn-rationals', 'definition', 'Insert fractions into the number line', [
    { kind: 'math', value: '\\mathbb Q=\\left\\{\\frac pq:p,q\\in\\mathbb Z,\\ q\\ne0\\right\\}' },
    { kind: 'math', value: '\\mathbb N\\subset\\mathbb Z\\subset\\mathbb Q' },
  ], { visualization: 'rational-line', presenterNotes: [note('common-mistake', 'Denominator restriction', 'q = 0 is excluded. Division by zero is not a rational number operation.')] }),
  slide('rn-reciprocal', 'professor-example', 'Division by a rational number', [
    { kind: 'math', value: '\\frac ab\\div\\frac cd=\\frac ab\\cdot\\frac dc' },
  ], { revealSteps: ['Require b ≠ 0 and d ≠ 0', 'Require c ≠ 0 because the divisor is nonzero', 'Multiply by the reciprocal', 'Simplify'], presenterNotes: [note('important', 'Important', 'Q is already a field. Irrational numbers are not needed to make it a field.'), note('formula', 'Multiplicative inverse', '', '\\frac ab\\cdot\\frac ba=1\\quad(a,b\\ne0)')] }),
  slide('rn-field', 'property', 'What does field mean?', [
    { kind: 'text', value: 'A field is an arithmetic system where addition, subtraction, multiplication, and division by nonzero elements behave consistently.' },
  ], { revealSteps: ['Closure', 'Commutativity', 'Associativity', 'Distributivity', 'Additive and multiplicative identities', 'Additive inverses', 'Multiplicative inverses for nonzero elements'], presenterNotes: [note('teaching', 'Progressive reveal', 'Build the axioms from operations; avoid presenting the entire list at once.')] }),
  slide('rn-dense', 'visualization', 'The rationals are dense', [
    { kind: 'text', value: 'Between any two distinct real numbers there is a rational number.' }, { kind: 'callout', value: 'Dense does not mean complete.' },
  ], { visualization: 'density', presenterNotes: [note('common-mistake', 'Visual caution', 'Never draw a large empty interval and imply rationals are absent there. Zooming always reveals more rationals.')] }),
  slide('rn-sqrt2', 'derivation', 'A missing limiting value', [
    { kind: 'math', value: '1,\\ 1.4,\\ 1.41,\\ 1.414,\\ 1.4142,\\ 1.41421,\\ldots' },
    { kind: 'math', value: '\\longrightarrow\\sqrt2' },
  ], { revealSteps: ['1', '1.4', '1.41', '1.414', '1.4142', '1.41421', '√2 is not rational'], presenterNotes: [note('teaching', 'Dense versus complete', 'Every displayed finite decimal is rational. Their natural limiting value √2 is missing from Q.')] }),
  slide('rn-irrational', 'definition', 'Irrational numbers are still real', [
    { kind: 'math', value: '\\sqrt2,\\quad\\sqrt3,\\quad\\pi,\\quad e' },
    { kind: 'callout', value: '“Irrational” does not mean “not real.”' },
  ], { visualization: 'irrational-line', presenterNotes: [note('definition', 'Irrational number', 'A real number that cannot be written as p/q for integers p and q with q ≠ 0.')] }),
  slide('rn-real-line', 'animation', 'Complete the real line', [
    { kind: 'math', value: '\\mathbb N\\subset\\mathbb Z\\subset\\mathbb Q\\subset\\mathbb R' },
    { kind: 'text', value: 'The real line has no missing limiting points.' },
  ], { revealSteps: ['Natural numbers', 'Integers', 'Rational numbers', 'Irrational numbers', 'The continuous real line'] }),
  slide('rn-lub', 'theorem', 'Least Upper Bound Property', [
    { kind: 'text', value: 'Every nonempty subset of ℝ that is bounded above has a least upper bound in ℝ.' },
    { kind: 'math', value: '\\sup S' },
  ], { presenterNotes: [note('definition', 'Upper bound', 'A number M such that x ≤ M for every x in S.'), note('definition', 'Supremum', 'The least of all upper bounds; it need not belong to the set.')] }),
  slide('rn-completeness', 'visualization', 'Why ℚ is not complete', [
    { kind: 'math', value: 'S=\\{x\\in\\mathbb Q:x^2<2\\}' },
    { kind: 'math', value: '\\sup_{\\mathbb R}S=\\sqrt2' },
  ], { visualization: 'supremum', presenterNotes: [note('teaching', 'Compare systems', 'In Q the natural boundary √2 is missing. In R it exists and is the supremum.')] }),
  slide('rn-max-sup', 'comprehension-check', 'Maximum versus supremum', [
    { kind: 'math', value: '[0,3]\\colon\\max=3,\\quad\\sup=3' },
    { kind: 'math', value: '[0,3)\\colon\\text{no maximum},\\quad\\sup=3' },
  ], { question: { type: 'multiple-choice', prompt: 'Which statement is true for [0, 3)?', options: ['Maximum 3 and supremum 3', 'No maximum and supremum 3', 'No maximum and no supremum'], correctAnswer: 1 } }),
  slide('rn-cof', 'summary', 'ℝ is a complete ordered field', [
    { kind: 'comparison', value: [{ label: 'ℚ', field: 'Yes', ordered: 'Yes', complete: 'No' }, { label: 'ℝ', field: 'Yes', ordered: 'Yes', complete: 'Yes' }] },
  ], { presenterNotes: [note('connection', 'Three words', 'Field describes arithmetic. Ordered describes compatible comparison. Complete guarantees required boundary and limiting values.')] }),
  slide('rn-calculus', 'connection', 'Why completeness matters in calculus', [
    { kind: 'list', value: ['Limits and sequences', 'Infinite series', 'Intermediate and Extreme Value Theorems', 'Suprema, infima, and existence arguments'] },
    { kind: 'callout', value: 'Calculus studies processes that approach values. ℝ contains the limiting values ordinary calculus needs.' },
  ]),
  slide('rn-exit', 'exit-ticket', 'Exit check', [
    { kind: 'list', value: ['Why are natural numbers not closed under subtraction?', 'Explain: dense does not mean complete.', 'Why can [0, 3) have a supremum but no maximum?'] },
  ], { question: { type: 'short-answer', prompt: 'What was the least clear part of today’s lecture?' }, presenterNotes: [note('next-question', 'Continue the lecture', 'The next sequence develops inequalities, field properties, exponent rules, coordinate systems, functions, polynomials, the binomial theorem, exponentials, and logarithms from the available course material.')] }),
]

const openingNote = note('teaching', 'Teaching goal', 'Do not begin with formal notation or a finished number line. Let each operation expose a limitation and motivate a larger set.')
const redesignedOpening = [
  slide('rn-sets-opening','title','At the foundation of mathematics lies the idea of a set',[{kind:'eyebrow',value:'Foundations of Mathematics'},{kind:'text',value:'A set is a collection of objects considered together. Sets of numbers give us language to count, measure, compare, and describe quantities.'},{kind:'callout',value:'Let us build the number system.'}],{presenterNotes:[openingNote,note('teaching','Opening','Keep the statement brief. Move immediately from sets in general to building sets of numbers.')] }),
  slide('rn-natural-build','animation','Start with counting',[],{visualization:'number-story:natural-objects',revealSteps:['1','2','3','4','5','Natural Numbers','ℕ = {1, 2, 3, 4, 5, …}'],presenterNotes:[openingNote,note('teaching','Natural numbers','Start with counting. Ask students for examples. Reveal the individual objects progressively; do not draw a line.')] }),
  slide('rn-natural-addition','visualization','Try addition',[],{visualization:'number-story:natural-addition',question:{type:'multiple-choice',prompt:'If a,b ∈ ℕ, which displayed operation is guaranteed to remain in ℕ?',options:['a + b','a − b','a ÷ b'],correctAnswer:0},presenterNotes:[note('teaching','Discover closure','Let students try several pairs. Name closure only after they observe every result remains among the natural objects.'),note('formula','Closure under addition','', 'a,b\\in\\mathbb N\\Longrightarrow a+b\\in\\mathbb N')]}),
  slide('rn-subtraction-need','live-question','Are natural numbers enough for subtraction?',[],{visualization:'number-story:subtraction-need',question:{type:'multiple-choice',prompt:'Why do we need integers?',options:['To count faster','Because subtraction such as 2 − 5 leaves ℕ','Because addition leaves ℕ'],correctAnswer:1},presenterNotes:[note('ask','Pause and ask','Where is −3? Leave time before revealing the result.'),note('teaching','Transition to ℤ','The operation is meaningful, but the answer is absent from the current set.')] }),
  slide('rn-integer-build','animation','Grow the set into the integers',[],{visualization:'number-story:integer-objects',revealSteps:['Add 0','Add −1','Add −2','Add −3','Name the integers','Show ℕ ⊂ ℤ'],presenterNotes:[openingNote,note('teaching','Keep the objects','New integer objects appear to the left. The natural-number objects remain visible inside the larger set. Still no continuous line.')] }),
  slide('rn-integer-operations','visualization','Subtraction and additive inverses',[],{visualization:'number-story:integer-explorer',presenterNotes:[note('definition','Additive inverse','Every integer a has an additive inverse −a, and a + (−a) = 0.'),note('teaching','Animation','Choose 3, highlight −3, and conceptually bring both toward the additive identity 0.')] }),
  slide('rn-multiplication-need','visualization','Multiplication reveals the next need',[],{visualization:'number-story:multiplication-need',revealSteps:['Integers are closed under multiplication','Choose 2','Ask what multiplies by 2 to give 1','Reveal 1/2','Observe 1/2 ∉ ℤ'],presenterNotes:[note('ask','Transition to ℚ','What must I multiply 2 by to obtain 1?'),note('teaching','Multiplicative inverse','Integers are not enough when every nonzero element must have a multiplicative inverse.')] }),
  slide('rn-rational-build','animation','Insert fractions between the integers',[],{visualization:'number-story:rational-objects',revealSteps:['±1/2','±2/3','±3/2','5/4','−7/3','Name the rational numbers','Show ℕ ⊂ ℤ ⊂ ℚ'],question:{type:'true-false',prompt:'Every integer is rational because n = n/1.',options:['True','False'],correctAnswer:0},presenterNotes:[note('teaching','Grow ℚ','Insert fraction objects among the existing integers. Do not draw a solid line.'),note('common-mistake','Denominator','The denominator q cannot be zero.')] }),
  slide('rn-rational-inverses','visualization','Multiplicative inverses',[],{visualization:'number-story:rational-inverse',question:{type:'multiple-choice',prompt:'What is the multiplicative inverse of 3/5?',options:['−3/5','5/3','3'],correctAnswer:1},presenterNotes:[note('important','Mathematical accuracy','ℚ is already a field. Irrational numbers are needed to pass from the incomplete ordered field ℚ to the complete ordered field ℝ.'),note('teaching','Try examples','Use 2/3, −4/5, and 3.')] }),
  slide('rn-what-makes-field','property','What makes a field?',[{kind:'text',value:'A field is a number system where arithmetic stays inside the set and follows the usual arithmetic laws.'}],{visualization:'field:axioms',revealSteps:['Closure under addition','Closure under multiplication','Additive identity 0','Multiplicative identity 1 and 0 ≠ 1','Additive inverses','Multiplicative inverses for a ≠ 0','Commutative laws','Associative laws','Distributive law','Compact field summary'],presenterNotes:[note('teaching','Teaching goal','Separate field structure from completeness. Connect the formal axioms to the earlier construction of ℕ, ℤ, ℚ, and ℝ.'),note('teaching','What to say','We enlarged our number systems whenever arithmetic created a number we did not already have. Now ask what rules make arithmetic behave properly.'),note('important','Formal definition','A field is not defined only as closure under +, −, ×, ÷. Its axioms use addition and multiplication with identities, inverses, and laws. Subtraction and nonzero division are derived.'),note('common-mistake','Do not say','Do not say ℚ is not a field because irrational numbers are missing. Correct: ℚ is a field, but it is not complete.')] }),
  slide('rn-test-field','visualization','Is this set a field?',[],{visualization:'field:tester',presenterNotes:[note('ask','Ask students','Are the natural numbers a field? What fails? Expected: additive inverses; 2 ∈ ℕ but −2 ∉ ℕ.'),note('ask','Follow-up','Are the integers a field? Expected: no; nonzero integers do not always have multiplicative inverses inside ℤ.'),note('teaching','Write on slide','Write 2 ∈ ℤ and 1/2 ∉ ℤ. This is exactly why fractions appeared earlier.'),note('ask','Transition','What happens in ℚ? Every nonzero rational has a rational reciprocal, so ℚ satisfies the field axioms.')] }),
  slide('rn-field-question-one','live-question','Which set is not a field?',[{kind:'math',value:'\\mathbb Q,\\quad\\mathbb R,\\quad\\mathbb Z'}],{question:{type:'multiple-choice',prompt:'Which of the following is NOT a field?',options:['ℚ','ℝ','ℤ','Both ℚ and ℝ'],correctAnswer:2},presenterNotes:[note('pause','Pause','Let every student answer before showing the anonymous distribution.'),note('discussion','After responses','Reveal ℤ. Addition and multiplication work, and additive inverses exist, but nonzero multiplicative inverses can leave ℤ.')] }),
  slide('rn-field-question-two','live-question','Why is ℤ not a field?',[{kind:'math',value:'2\\times\\ ?=1'}],{question:{type:'multiple-choice',prompt:'Why is ℤ not a field?',options:['Addition is not commutative.','Integers do not have additive inverses.','Nonzero integers do not always have multiplicative inverses inside ℤ.','Multiplication is not associative.'],correctAnswer:2},revealSteps:['The missing factor is 1/2','2 × 1/2 = 1','1/2 ∉ ℤ'],presenterNotes:[note('teaching','Illustrate','Write 2 × ? = 1, reveal 1/2, then emphasize that 1/2 is not an integer.'),note('ask','Final question','If ℚ is already a field, why did we need ℝ? Expected: ℚ is not complete.')] }),
  slide('rn-field-transition','section','Field structure is not completeness',[{kind:'comparison',value:[{label:'\\mathbb Q',field:'Yes',ordered:'Yes',complete:'No'},{label:'\\mathbb R',field:'Yes',ordered:'Yes',complete:'Yes'}]},{kind:'callout',value:'ℚ is an ordered field. ℝ is a complete ordered field.'}],{presenterNotes:[note('teaching','Transition','Exactly. The difference is not field structure. The deeper distinction is completeness.'),note('next-question','Next section','What does complete mean? Return to the rational approximations of √2.')] }),
  slide('rn-rational-density','visualization','Rational numbers are everywhere',[],{visualization:'number-story:density',presenterNotes:[note('teaching','Zoom repeatedly','Add tenths, then finer fractions. The objects become dense but never become a solid line.'),note('important','Dense','Between any two distinct real numbers lies a rational number. Dense does not mean complete.')] }),
  slide('rn-are-we-finished','derivation','Are we finished?',[],{visualization:'number-story:sqrt2',question:{type:'multiple-choice',prompt:'Which displayed number is irrational?',options:['3/4','−5','√2','0.25'],correctAnswer:2},presenterNotes:[note('ask','Pause','These rational approximations are getting closer and closer to what?'),note('teaching','Key moment','Every finite decimal shown is rational, but the exact limiting value √2 is not rational. Do not imply a visible interval around √2 has no rationals.')] }),
  slide('rn-irrational-build','definition','Irrational numbers are real',[],{visualization:'number-story:irrationals',presenterNotes:[note('definition','Irrational number','A real number that cannot be written as p/q for integers p and q with q ≠ 0.'),note('common-mistake','Language','Irrational does not mean not real. Place each example at its appropriate approximate location.')] }),
  slide('rn-real-line-reveal','animation','Only now: the real number line',[],{visualization:'number-story:real-line',revealSteps:['Combine rational numbers','Combine irrational numbers','Increase the density','Reveal the continuous line','Name ℝ'],presenterNotes:[note('teaching','Most important transition','Only now allow the separate points to merge visually into a continuous real line.'),note('ask','What have we gained?','Invite intuitive answers, then introduce completeness: no missing limiting or boundary values.')] }),
  slide('rn-complete-ordered-field','property','The real numbers: a complete ordered field',[{kind:'text',value:'Build each word progressively.'}],{revealSteps:['FIELD — arithmetic structure','Closure under + and ×','Commutativity and associativity','Distributivity, identities, and inverses','ORDERED — compatible comparison','a < b ⇒ a + c < b + c','0 < a and 0 < b ⇒ 0 < ab','COMPLETE — least upper bounds exist'],presenterNotes:[note('teaching','Field','Reveal properties in related groups instead of a giant static list.'),note('definition','Ordered','Numbers can be compared by <, ≤, >, ≥ in ways compatible with arithmetic.'),note('theorem','Least Upper Bound Property','Every nonempty subset of ℝ bounded above has a least upper bound in ℝ. Use the notation sup S.')] }),
  slide('rn-q-versus-r','live-question','Field, ordered, complete',[{kind:'comparison',value:[{label:'\\mathbb Q',field:'Yes',ordered:'Yes',complete:'No'},{label:'\\mathbb R',field:'Yes',ordered:'Yes',complete:'Yes'}]},{kind:'callout',value:'ℝ is a complete ordered field.'}],{question:{type:'multiple-choice',prompt:'Which statement is correct?',options:['ℚ is not a field.','ℚ is a field but is not complete.','ℝ is not ordered.','Irrational numbers are not real.'],correctAnswer:1},presenterNotes:[note('important','Final message','Field describes arithmetic, ordered describes compatible comparison, and complete supplies required limiting and boundary values.')] }),
  slide('rn-calculus-motivation','connection','Why does calculus use ℝ?',[{kind:'text',value:'Calculus studies quantities that approach limiting values.'},{kind:'list',value:['Limits and sequences','Infinite series','Suprema and infima','Continuity and existence theorems']},{kind:'callout',value:'Completeness ensures that required boundary and limiting values are present.'}],{presenterNotes:[note('connection','Keep it motivational','This is not yet a theorem lecture. Establish why completeness matters and return to the details later.')] }),
]

// Retained as a migration reference while the new story sequence becomes the active lecture.
void redesignedOpening

const mathematicalStorySlides = [
  slide('rn-story-hook','title','Are the numbers we currently have enough?',[],{visualization:'number-story:opening-challenges',presenterNotes:[note('teaching','Teaching goal','Establish that number systems grow because the numbers already available are sometimes not enough.'),note('script','What to say',"Today I do not want to begin with a list of types of numbers. Instead, let us ask a more interesting question: Are the numbers we currently have enough?"),note('action','Action','Show all three challenges. Ask whether counting numbers can solve every one, then launch the prediction.'),note('transition','Transition','Keep your answers in mind. We are going to build the number system one need at a time.')] }),
  slide('rn-story-prediction','live-question','If we may use only 1, 2, 3, 4, ...',[{kind:'math',value:'2-5,\\qquad 1\\div2,\\qquad x^2=2'},{kind:'callout',value:'Can we solve all three problems?'}],{question:{type:'multiple-choice',prompt:'If the only numbers allowed are 1, 2, 3, 4, ... can we solve all three problems?',options:['Yes','No','Only the first two','Only some of them'],correctAnswer:1},presenterNotes:[note('pause','Do not reveal yet','Collect responses privately. Let the class keep its prediction while the number systems are built.')] }),
  slide('rn-story-natural','definition','Natural numbers',[{kind:'math',value:'\\mathbb N=\\{1,2,3,4,\\ldots\\}'},{kind:'math',value:'0\\notin\\mathbb N'}],{presenterNotes:[note('script','What to say','Suppose the only numbers we have are counting numbers. Let us see what arithmetic behaves nicely.'),note('ask','Ask students','Give me two natural numbers.')] }),
  slide('rn-story-addition','visualization','Try addition',[],{visualization:'number-story:natural-addition',revealSteps:['Choose a and b','Observe the sum','Name closure under addition'],presenterNotes:[note('ask','Before naming the property','Can you find two natural numbers whose sum is not natural?'),note('formula','Closure under addition','','a,b\\in\\mathbb N\\Longrightarrow a+b\\in\\mathbb N')]}),
  slide('rn-story-challenge-one','derivation','Return to challenge 1',[{kind:'math',value:'2-5=\\ ?'},{kind:'math',value:'2-5=-3'},{kind:'callout',value:'THE NUMBERS WE HAVE ARE NOT ENOUGH. WE NEED TO ENLARGE THE SET.'}],{revealSteps:['Show 2 - 5','Reveal -3','Ask whether -3 is natural','Reveal the need to enlarge'],presenterNotes:[note('ask','Pause','Is -3 in the natural numbers?'),note('transition','Transition','The operation is meaningful, but its answer is absent from our current set.')] }),
  slide('rn-story-integers','animation','Grow the set into the integers',[],{visualization:'number-story:integer-objects',revealSteps:['Add 0','Add -1','Add -2','Add -3','Name the integers','Show N contained in Z'],presenterNotes:[note('teaching','Visual direction','Keep the natural-number objects visible while zero and the negative integers appear.')] }),
  slide('rn-story-inverse','visualization','Subtraction and additive inverses',[],{visualization:'number-story:integer-explorer',presenterNotes:[note('formula','Subtraction as addition','','a-b=a+(-b)'),note('example','Professor example','Use the explorer to show 2-5=2+(-5)=-3.'),note('definition','Additive inverse','For every integer a, a+(-a)=0.')] }),
  slide('rn-story-inverse-question','live-question','Additive inverse',[{kind:'math',value:'7+\\ ?=0'}],{question:{type:'multiple-choice',prompt:'What number must be added to 7 to get 0?',options:['7','-7','1/7','0'],correctAnswer:1},presenterNotes:[note('answer','Answer','-7, because 7+(-7)=0.')] }),
  slide('rn-story-challenge-two','derivation','Return to challenge 2',[{kind:'math',value:'1\\div2=\\frac12'},{kind:'callout',value:'Is 1/2 an integer? THE NUMBERS WE HAVE ARE NOT ENOUGH.'}],{revealSteps:['Show 1 divided by 2','Reveal 1/2','Ask whether 1/2 is an integer'],presenterNotes:[note('transition','Transition','Integers solved the subtraction problem, but division creates a new need.')] }),
  slide('rn-story-rationals','definition','Rational numbers',[{kind:'math',value:'\\mathbb Q=\\left\\{\\frac pq:p,q\\in\\mathbb Z,\\ q\\ne0\\right\\}'},{kind:'text',value:'A rational number is a ratio of integers.'},{kind:'math',value:'3=\\frac31\\qquad\\mathbb Z\\subset\\mathbb Q'}],{visualization:'number-story:rational-objects',presenterNotes:[note('important','Notation','Emphasize q is not zero and every integer is rational.')] }),
  slide('rn-story-reciprocal','visualization','Reciprocal explorer',[],{visualization:'number-story:rational-inverse',presenterNotes:[note('formula','Multiplicative inverse','','\\frac ab\\cdot\\frac ba=1'),note('example','Examples','Use 2/3 times 3/2 and 3 times 1/3.')] }),
  slide('rn-story-field','property','The rational numbers form a field',[{kind:'math',value:'\\boxed{\\mathbb Q\\text{ is a field}}'},{kind:'text',value:'Within Q, we can add, subtract, multiply, and divide by any nonzero number and stay inside Q.'}],{presenterNotes:[note('important','Mathematical accuracy','Do not say irrational numbers are required to make a field. Q is already a field.'),note('detail','Instructor sheet','Use the formal field axioms here if the class is ready; keep them off the default projector view.')] }),
  slide('rn-story-challenge-three', 'derivation', 'Return to challenge 3', [{ kind: 'math', value: 'x^2=2' }], {
    visualization: 'number-story:square-root-mystery',
    revealSteps: [
      'Step 1 — derive the diagonal length with the Pythagorean theorem',
      'Step 2 — prove that the diagonal length is irrational by contradiction',
    ],
    presenterNotes: [
      note('script', 'What to say', 'This very simple square produces a number that caused a serious historical problem.'),
      note(
        'proof',
        'Step 1 — Diagonal length',
        'The diagonal is a length, so take the positive square root.',
        String.raw`1^2+1^2=d^2\Longrightarrow d^2=2\Longrightarrow d=\sqrt2`,
      ),
      note(
        'proof',
        'Step 2 — Irrationality by contradiction',
        'Assume a/b is fully reduced. Since a squared is even, a is even, so write a = 2k. Substitution then makes b squared even, hence b is even. Thus 2 divides both a and b, contradicting that the fraction was in lowest terms. Therefore the diagonal length is irrational.',
        String.raw`\sqrt2=\frac ab,\ \gcd(a,b)=1\Longrightarrow a^2=2b^2\Longrightarrow a=2k\Longrightarrow b^2=2k^2\Longrightarrow\sqrt2\notin\mathbb Q`,
      ),
    ],
  }),
  slide('rn-story-sqrt-prediction','live-question','The mystery of sqrt(2)',[{kind:'math',value:'\\sqrt2=\\frac pq\\ ?\\qquad p,q\\in\\mathbb Z,\\ q\\ne0'}],{question:{type:'multiple-choice',prompt:'Can sqrt(2) be written exactly as p/q for integers p and q, q not zero?',options:['Yes','No','Only approximately','Not enough information'],correctAnswer:1},presenterNotes:[note('pause','Do not reveal immediately','Collect predictions and allow discussion.'),note('answer','Reveal after discussion','sqrt(2) is not rational.')] }),
  slide('rn-story-irrational','definition','Irrational numbers are real',[{kind:'text',value:'An irrational number is a real number that cannot be expressed as p/q with integers p and q, q not zero.'},{kind:'math',value:'\\sqrt2,\\qquad\\sqrt3,\\qquad\\pi,\\qquad e'},{kind:'callout',value:'Irrational does not mean not real.'}],{visualization:'number-story:irrationals',presenterNotes:[note('common-mistake','Language','Irrational numbers are real numbers.')] }),
  slide('rn-story-finished','section','Are we finished?',[{kind:'math',value:'1,\\quad1.4,\\quad1.41,\\quad1.414,\\quad1.4142,\\quad1.41421,\\ldots\\longrightarrow\\sqrt2'},{kind:'text',value:'Every displayed finite decimal is rational. The limiting value is irrational.'}],{visualization:'number-story:sqrt2',presenterNotes:[note('ask','Ask','What do you notice?'),note('teaching','Key distinction','Approximation and density do not guarantee the limiting value belongs to Q.')] }),
  slide('rn-story-density','visualization','Q is dense but not complete',[{kind:'math',value:'\\boxed{\\mathbb Q\\text{ is dense but not complete}}'},{kind:'text',value:'Rational numbers can approximate certain values arbitrarily closely without containing the limiting or boundary value itself.'}],{visualization:'number-story:density',presenterNotes:[note('important','Visual caution','Do not draw irrational values as large holes. Between any two distinct real numbers there is a rational number.')] }),
  slide('rn-story-real-line','animation','The real numbers',[],{visualization:'number-story:real-line',revealSteps:['Combine rational numbers','Combine irrational numbers','Increase density','Reveal the continuous line','Name the real numbers'],presenterNotes:[note('definition','Real numbers','R is Q union the irrational numbers.'),note('transition','What do we gain?','The real numbers contain the limiting and boundary values needed for calculus.')] }),
  slide('rn-story-structure','property','A complete ordered field',[],{visualization:'number-story:structure-comparison',presenterNotes:[note('definition','Field','Arithmetic structure.'),note('definition','Ordered','Numbers can be compared consistently.'),note('definition','Complete','Every nonempty subset of R bounded above has a least upper bound in R.')] }),
  slide('rn-story-calculus','connection','Why calculus needs R',[{kind:'list',value:['LIMITS','SEQUENCES','SERIES','CONTINUITY','SUPREMA / INFIMA','EXISTENCE THEOREMS']}],{presenterNotes:[note('connection','Explanation','Completeness supports the existence of the boundary and limiting values used throughout calculus.')] }),
  slide('rn-story-joke','visualization','A mathematical callback',[],{visualization:'number-story:rational-joke',presenterNotes:[note('script','What to say','Now you finally know enough mathematics to understand this terrible joke.'),note('pause','Do not explain immediately','Let students interpret both lines before launching the final question.')] }),
  slide('rn-story-final-question','live-question','Why is this mathematically funny?',[{kind:'math',value:'\\pi\\notin\\mathbb Q,\\qquad\\pi\\in\\mathbb R,\\qquad i\\notin\\mathbb R'}],{question:{type:'multiple-choice',prompt:'Why is “Be rational ... Get real!” mathematically funny?',options:['pi is not rational','pi is real','i is not real','All of the above'],correctAnswer:3},presenterNotes:[note('answer','Debrief','Pi is irrational but real; i is not a real number. Do not begin a full complex-number lecture.')] }),
  slide('rn-story-summary','summary','Are the numbers we have enough?',[{kind:'math',value:'\\mathbb N\\subset\\mathbb Z\\subset\\mathbb Q\\subset\\mathbb R'},{kind:'text',value:'Subtraction created integers. Division created rationals. The equation x squared equals 2 exposed irrational numbers. Completeness explains why calculus uses R.'},{kind:'math',value:'\\mathbb Q\\text{ is an ordered field but not complete}'},{kind:'math',value:'\\mathbb R\\text{ is a complete ordered field}'}],{presenterNotes:[note('exit','Final message','Students should leave understanding why the number system had to grow, not merely memorizing its categories.')] }),
]

const fieldStructureSlide = slide('rn-field-vs-completeness','property','Field structure is not completeness',[],{visualization:'number-story:field-completeness',presenterNotes:[note('teaching','Teaching goal','Separate field structure from completeness. Prevent students from thinking irrational numbers are needed to make Q a field.'),note('script','What to say','The rational numbers already have perfectly good arithmetic. Adding, subtracting, multiplying, or dividing by a nonzero rational stays rational. So Q is already a field.'),note('ask','Ask students','Does Q fail because 2 does not have a reciprocal? Expected: No, because 1/2 is rational.'),note('transition','Transition',"Q has the arithmetic structure we want, but it is missing certain limiting or boundary values. Let us see what 'missing' means."),note('formal','Full field axioms','For all a,b,c in F: closure, associativity, commutativity, identities 0 and 1 with 0 not equal to 1, additive inverses, nonzero multiplicative inverses, and a(b+c)=ab+ac.')]})
const fieldCheckSlide = slide('rn-field-check','live-question','Field or complete?',[{kind:'math',value:'\\mathbb Q\\subset\\mathbb R'}],{question:{type:'multiple-choice',prompt:'Which statement is correct?',options:['Q is not a field because it does not contain sqrt(2).','Q is a field, but it is not complete.','R becomes a field only after irrational numbers are added.','Q is complete because rational numbers are dense.'],correctAnswer:1},presenterNotes:[note('answer','Correct answer','B. Q is an ordered field, but it is not complete.')]})
const denseCompleteSlide = slide('rn-dense-not-complete','visualization','Why is Q not complete?',[],{visualization:'number-story:dense-not-complete',presenterNotes:[note('teaching','Teaching goal','Give the intuitive approximation example first and reveal the formal least-upper-bound version only if appropriate.'),note('script','What to say','The rationals are not sparse. We can approximate sqrt(2) as accurately as we want, but getting arbitrarily close is not the same as containing the number.'),note('important','Visual accuracy','Never show a large hole around sqrt(2). Q is dense; rational numbers occur arbitrarily close to sqrt(2).')]})
const denseCheckSlide = slide('rn-dense-complete-check','live-question','Dense versus complete',[{kind:'math',value:'\\mathbb Q\\text{ is dense, but not complete.}'}],{question:{type:'multiple-choice',prompt:'Which statement best describes the difference between dense and complete?',options:['Dense means every number is rational.','Complete means every number is an integer.','Dense means points occur arbitrarily close; complete means required least-upper-bound values are contained.','They mean the same thing.'],correctAnswer:2},presenterNotes:[note('answer','Correct answer','C. Density concerns arbitrarily close points; completeness guarantees required least-upper-bound values exist in the system.')]})

const realNumbersSlides = [...mathematicalStorySlides.flatMap((item)=>{
  if(item.id==='rn-story-field') return [fieldStructureSlide,fieldCheckSlide]
  if(item.id==='rn-story-density') return [denseCompleteSlide,denseCheckSlide]
  return [item]
}), ...legacyRealNumbersSlides.slice(20)]

export const realNumbersLecture = {
  id: 'real-numbers', title: 'Real Numbers & Algebra', course: 'Review Week', chapter: 'Foundations', section: 'Number systems', status: 'ready',
  description: 'Build the real number system as one continuous mathematical story, then connect completeness to calculus.',
  objectives: ['Construct the nested number systems from arithmetic needs.', 'Distinguish field, order, density, and completeness.', 'Connect real-number completeness to calculus.'],
  slides: realNumbersSlides,
}

const shell = (id, title, course, chapter, topics) => ({
  id, title, course, chapter, section: 'Instructor Lecture', status: 'shell',
  description: 'A presentation-ready lecture shell awaiting course-specific source material.', objectives: topics,
  slides: [slide(`${id}-title`, 'title', title, [{ kind: 'eyebrow', value: `${course} · ${chapter}` }, { kind: 'text', value: 'CONTENT TO BE ADDED' }]), slide(`${id}-outline`, 'section', 'Planned lecture sequence', [{ kind: 'list', value: topics }], { presenterNotes: [note('reminder', 'Source material', 'Add definitions, proofs, examples, and course-specific wording only from approved source material.')] })],
})

export const lectureCatalog = [
  realNumbersLecture,
  exponentialGrowthLecture,
  geometryLecture,
  trigonometryLecture,
  inverseTrigLecture,
  hyperbolicLecture,
  shell('limits', 'Limits', 'Calculus II', 'Calculus I Foundations', ['Approaching behavior and one-sided limits', 'Infinite limits and limit laws', 'Epsilon-delta definition after intuition']),
  shell('continuity', 'Continuity', 'Calculus II', 'Calculus I Foundations', ['The three continuity conditions', 'Removable discontinuities and piecewise functions', 'Intermediate Value Theorem connections']),
  shell('derivatives', 'Derivatives', 'Calculus II', 'Calculus I Foundations', ['Secant lines approaching a tangent', 'Derivative as a limit and geometric rate', 'Derivative rules and higher derivatives']),
  shell('integrals', 'Integrals', 'Calculus II', 'Calculus I Foundations', ['Antiderivatives and +C', 'Riemann sums and signed accumulation', 'Fundamental Theorem of Calculus']),
  chapter121Lecture,
  chapter122Lecture,
  chapter123Lecture,
  shell('chapter-12-4', '12.4 Cross Product', 'Calculus II & III', 'Chapter 12', ['Cross product and the right-hand rule', 'Area, volume, and coplanarity', 'Scalar triple product and torque']),
  shell('chapter-12-5', '12.5 Lines and Planes', 'Calculus II & III', 'Chapter 12', ['Vector, parametric, and symmetric line equations', 'Planes and normal vectors', 'Angles and point-plane distance']),
  shell('chapter-12-6', '12.6 Cylinders and Quadric Surfaces', 'Calculus II & III', 'Chapter 12', ['Traces and cylinders', 'Ellipsoids, paraboloids, and hyperboloids', 'Applications and interactive surfaces']),
  shell('chapter-13-overview', '13: Vector Functions', 'Calculus II & III', 'Chapter 13', ['Vector-valued functions and space curves', 'Derivatives, integrals, velocity, and acceleration', 'Arc length, curvature, and motion in space']),
  shell('chapter-14-overview', '14: Partial Derivatives', 'Calculus II & III', 'Chapter 14', ['Functions of several variables and level sets', 'Partial derivatives, tangent planes, and the chain rule', 'Directional derivatives, gradients, and optimization']),
  shell('chapter-15-overview', '15: Multiple Integrals', 'Calculus II & III', 'Chapter 15', ['Double and triple integrals', 'Polar, cylindrical, and spherical coordinates', 'Applications, mass, moments, and change of variables']),
  shell('chapter-16-overview', '16: Vector Calculus', 'Calculus II & III', 'Chapter 16', ['Vector fields and line integrals', 'Green’s theorem, curl, and divergence', 'Surface integrals and the fundamental integral theorems']),
  shell('chapter-17-overview', '17: Second-Order Differential Equations', 'Calculus II & III', 'Chapter 17', ['Second-order linear differential equations', 'Homogeneous and nonhomogeneous solution methods', 'Oscillations, mechanical systems, and applications']),
]

export const getLecture = (lectureId) => applyLectureRequirements(lectureCatalog.find((lecture) => lecture.id === lectureId) || realNumbersLecture)
