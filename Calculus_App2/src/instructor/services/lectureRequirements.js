const content=(kind,value)=>({kind,value})

const sparkByLecture={
  'real-numbers':'The rational numbers are dense, yet they still omit limiting values such as √2; density and completeness are different ideas.',
  geometry:'A sphere is determined by one center and one radius, but its two-dimensional surface lives in three-dimensional space.',
  trigonometry:'Radians make the derivative of sin x equal cos x with no conversion factor.',
  'inverse-trigonometric-functions':'Inverse trigonometric functions require restricted domains because periodic functions are not one-to-one.',
  'hyperbolic-functions':'A hanging cable forms a catenary described by hyperbolic cosine—not a parabola.',
  'chapter-12-3':'A perpendicular force does zero work because its projection along the displacement is zero.',
  'exponential-growth-decay':'Carbon-14 decay lets scientists estimate the age of once-living material because its relative decay rate is approximately constant.',
  limits:'l’Hospital’s Rule compares relative rates; it does not mean “differentiate the quotient.”',
}

const smileByLecture={
  'real-numbers':'Be rational—but when the limit demands it, get real.',geometry:'Vectors have direction. Unlike some group projects.',
  trigonometry:'Trigonometry keeps coming full circle.','inverse-trigonometric-functions':'Inverse trig is very particular about its domain—it has boundaries.',
  'hyperbolic-functions':'Cosh is what happens when exponentials agree to hang out symmetrically.','chapter-12-3':'The dot product is a scalar because sometimes two vectors just need a number between them.',
  'exponential-growth-decay':'Exponential functions are very confident. Give them a little time and they think they can take over everything.',
  limits:'0/0 isn’t zero. It’s calculus saying: “I need more information.”',
}

const exitPromptsByLecture={
  'inverse-trigonometric-functions':['Why must sine be restricted before arcsine is defined as a function?','What is the principal range of arcsine?','Differentiate y=arctan(3x).','Why is sin⁻¹x not the same as csc x?'],
  'hyperbolic-functions':['State the fundamental identity relating cosh x and sinh x.','Which hyperbolic function is even, and why?','Why must cosh be restricted before defining its inverse?','What is the derivative of sinh x?'],
  limits:['Why does the form 0/0 not determine a limit?','When can l’Hospital’s Rule be applied directly?','What must be done with a 0·∞ form before using the rule?','Why are logarithms useful for a 1^∞ power limit?'],
  'chapter-12-3':['What disappears when projecting onto the xy-plane?','What does a·b=0 mean geometrically?','Why does a perpendicular force do no work?','Is W=F·d a scalar or a vector?'],
  'chapter-12-4':[
    'Explain how the magnitude ‖a×b‖ relates to the area of a parallelogram formed by vectors a and b.',
    'Why is the area of a triangle spanned by vectors a and b equal to ½‖a×b‖?',
    'How do you use the cross product a×b to find a vector perpendicular (normal) to a plane containing two intersecting lines?',
    'In physics, torque is defined as τ=r×F. How does the angle θ between the wrench and the force affect the magnitude of the torque?',
  ],
}

const slide=(id,type,title,presentationContent,options={})=>({id,type,title,presentationContent,presenterNotes:[],studentNotes:[],revealSteps:[],layoutMode:'slide',theme:'classic-math',level:'essential',...options})

function exitQuestion(lecture,index,kind,prompt){
  return slide(`${lecture.id}-master-exit-${index}`,'live-question',`Exit Check ${index}: ${kind}`,[content('eyebrow','EXIT CHECK · IF TIME ALLOWS'),content('text',prompt)],{question:{type:'short-answer',prompt,topic:`${lecture.title} Exit Check`,category:'exit-check',graded:false,privacy:'aggregate'}})
}

function addLiveQuizSequences(slides){
  const result=[]
  for(let index=0;index<slides.length;index+=1){
    const item=slides[index],question=item.question,next=slides[index+1],choices=question?.choices||question?.options||[]
    if(question?.type!=='multiple-choice'||!choices.length){result.push(item);continue}
    const correctIndex=Number.isInteger(question.correctAnswer)?question.correctAnswer:choices.findIndex(choice=>String(choice.id)===String(question.correctChoiceId))
    const answer=typeof choices[correctIndex]==='string'?choices[correctIndex]:choices[correctIndex]?.text
    const quizSolution=question.solution||{correctAnswer:answer,steps:question.solutionSteps||[],explanation:question.explanation||`The correct choice is “${answer}.” Use the governing definition to justify it.`}
    result.push({...item,question:{id:item.id,timer:60,pointsPossible:1000,scoring:'speed',...question}});
    result.push(slide(`${item.id}-leaderboard`,'live-leaderboard','Fastest Correct Answers',[],{liveQuizView:'leaderboard',sourceQuestionId:item.id,masterRequirement:'question-leaderboard'}));
    if(next?.solutionFor===item.id){
      result.push({...next,liveQuizView:'solution',sourceQuestionId:item.id,quizSolution});
      index+=1;
      continue;
    }
    result.push(slide(`${item.id}-solution`,'solution',`${item.title}: Solution`,[content('eyebrow','CORRECT ANSWER'),content('callout',answer),content('text',quizSolution.explanation)],{liveQuizView:'solution',sourceQuestionId:item.id,quizSolution,solutionFor:item.id,masterRequirement:'question-solution'}));
  }
  return result
}

const chapter12Retrievals={
  'chapter-12-1':[
    {title:'Retrieval: The 2D Distance Formula',prompt:'Given A=(1,-2) and B=(5,1), find the distance.',options:['3','4','5','7'],answer:2,reveal:'d=√((5-1)²+(1-(-2))²)=√(16+9)=5.'},
    {title:'Prerequisite Bridge: Complete the Square',prompt:'Which pair correctly completes x²+2x and y²-6y?',options:['(x+1)² after adding 1; (y-3)² after adding 9','(x+2)² after adding 4; (y-6)² after adding 36','(x-1)² after adding 1; (y+3)² after adding 9','Neither expression can be completed'],answer:0,reveal:'x²+2x+1=(x+1)² and y²-6y+9=(y-3)². We will use this to recognize spheres.'},
  ],
  'chapter-12-2':[
    {title:'Retrieval from 12.1: Coordinate Changes',prompt:'Given A=(2,-3,4) and B=(-2,1,1), compute B-A.',options:['⟨4,-4,3⟩','⟨-4,4,-3⟩','⟨0,-2,5⟩','⟨-4,-2,-3⟩'],answer:1,reveal:'B-A=⟨-2-2,1-(-3),1-4⟩=⟨-4,4,-3⟩.'},
    {title:'Prerequisite Bridge: Scalar or Direction?',prompt:'Which listed quantity is a scalar?',options:['5 m/s east','20 N upward','70°F','A displacement toward the door'],answer:2,reveal:'70°F has magnitude but no direction, so it is scalar.'},
  ],
  'chapter-12-3':[
    {title:'Retrieval from 12.2: Components and Magnitude',prompt:'For a=⟨2,-1,3⟩ and b=⟨-1,4,2⟩, which gives a+b and ‖a‖?',options:['⟨1,3,5⟩ and √14','⟨3,-5,1⟩ and 14','⟨1,3,5⟩ and 14','⟨-2,-4,6⟩ and √14'],answer:0,reveal:'a+b=⟨1,3,5⟩ and ‖a‖=√14.'},
    {title:'Prerequisite Bridge: Cosine Signs',prompt:'Which sequence is cos 0, cos(π/2), cos π?',options:['1,0,-1','0,1,0','-1,0,1','1,-1,0'],answer:0,reveal:'cos 0=1, cos(π/2)=0, and cos π=-1.'},
  ],
  'chapter-12-4':[
    {title:'Dot Product Bridge: Orthogonality',prompt:'For nonzero vectors, what does a·b = 0 mean geometrically?',choices:[{id:'orthogonal',text:'The vectors are orthogonal (perpendicular).'},{id:'parallel',text:'The vectors are parallel.'},{id:'same-magnitude',text:'The vectors have the same magnitude.'},{id:'45-degrees',text:'The angle between the vectors is 45°.'}],correctChoiceId:'orthogonal',answer:0,reveal:'Because both vectors are nonzero, |a||b|>0. Thus a·b=|a||b|cos θ=0 requires cos θ=0, so θ=π/2=90° and the vectors are orthogonal.',solution:{correctAnswer:'Orthogonal (perpendicular)',steps:[String.raw`\mathbf a\cdot\mathbf b=\|\mathbf a\|\,\|\mathbf b\|\cos\theta`,String.raw`\mathbf a\ne\mathbf0,\ \mathbf b\ne\mathbf0\Longrightarrow\|\mathbf a\|>0,\ \|\mathbf b\|>0`,String.raw`\mathbf a\cdot\mathbf b=0\Longrightarrow\cos\theta=0`,String.raw`\theta=\frac{\pi}{2}=90^\circ`,String.raw`\boxed{\mathbf a\perp\mathbf b}`],explanation:'Parallel vectors have cosine ±1; equal magnitude does not determine angle; and cos 45°=√2/2≠0.',visual:'right-angle-vectors'}},
    {title:'Prerequisite Bridge: 2×2 Determinants',prompt:'What is the value of the 2×2 determinant with rows (a,b) and (c,d)?',mathPrompt:String.raw`\begin{array}{|cc|}a&b\\c&d\end{array}`,choices:[{id:'ad-minus-bc',text:'ad − bc'},{id:'ac-minus-bd',text:'ac − bd'},{id:'ab-minus-cd',text:'ab − cd'},{id:'ad-plus-bc',text:'ad + bc'}],optionMath:[String.raw`ad-bc`,String.raw`ac-bd`,String.raw`ab-cd`,String.raw`ad+bc`],correctChoiceId:'ad-minus-bc',answer:0,reveal:'Multiply the main diagonal a·d, multiply the other diagonal b·c, and subtract: ad−bc.',solution:{correctAnswer:'ad − bc',steps:[String.raw`\begin{array}{|cc|}a&b\\c&d\end{array}`,String.raw`a\cdot d=ad`,String.raw`b\cdot c=bc`,String.raw`\boxed{ad-bc}`,String.raw`\text{main diagonal product}-\text{other diagonal product}`],explanation:'The expression ac−bd multiplies vertically; ab−cd multiplies across rows; and ad+bc uses the right products but the wrong operation.',visual:'determinant-diagonals'}},
  ],
  'chapter-12-5':[
    {title:'Retrieval from 12.4: A Perpendicular Vector',prompt:'Which construction produces a vector perpendicular to both a and b?',options:['a·b','a+b','a×b','‖a-b‖'],answer:2,reveal:'a×b is perpendicular to both input vectors.'},
    {title:'Prerequisite Bridge: A Line in 2D',prompt:'What information determines a line?',options:['A point only','A direction only','A point and a direction','Two slopes'],answer:2,reveal:'A line is determined by a point and a direction.'},
  ],
  'chapter-12-6':[
    {title:'Retrieval from 12.5: Equations in Space',prompt:'What does x=3 represent in ℝ³?',options:['A point','A line','A plane','A sphere'],answer:2,reveal:'In ℝ³, x=3 produces a plane.'},
    {title:'Prerequisite Bridge: Conic Sections',prompt:'Which equation represents a hyperbola?',options:['x²+y²=1','x²/4+y²/9=1','y=x²','x²/4-y²/9=1'],answer:3,reveal:'Opposite signs on the squared terms identify the hyperbola.'},
  ],
}

const chapter12Supplemental={
  'chapter-12-1':[
    ['Rectangular Box Idea','Use dashed edges from P(a,b,c) to its coordinate-plane projections to make all three coordinates visible.'],
    ['Professor Distance Example','Find a three-dimensional distance first on the board; reveal the verified solution only after discussion.'],
    ['Student Distance Question','Apply the 3D distance formula to a new pair of points and submit a numerical response.'],
    ['Professor Synthesis Problem','Complete three squares, identify the sphere’s center and radius, and interpret the result geometrically.'],
  ],
  'chapter-12-2':[
    ['Zero Vector','The zero vector has magnitude 0 and no specific direction.'],['Displacement Story','Travel A→B and then B→C; the resultant A→C is the net displacement.'],['Position Vector','The arrow from the origin to P(a₁,a₂,a₃) is ⟨a₁,a₂,a₃⟩.'],['Parallel Vectors','Two nonzero vectors are parallel exactly when one is a scalar multiple of the other.'],['Why Normalize?','Dividing by magnitude preserves direction while changing length to 1.'],['Synthesis Example','From two points, find AB, its magnitude, and the unit vector in the same direction.'],
  ],
  'chapter-12-3':[
    ['Component Pairing Animation','Pair a₁b₁, a₂b₂, and a₃b₃, then add to produce one scalar.'],['Rotating Dot Product Explorer','As the included angle rotates, compare positive, zero, and negative dot products.'],['Acute, Right, or Obtuse?','Use the sign of a·b to classify the angle before calculating it.'],['Projection Hook','How much of one vector points in the direction of another?'],['Force Decomposition','Separate force into components parallel and perpendicular to displacement.'],['Synthesis Question','Connect angle, orthogonality, projection, and work in one vector situation.'],
  ],
  'chapter-12-4':[
    ['Dot Product versus Cross Product','Dot: vector × vector → scalar. Cross: vector × vector → perpendicular vector.'],['Right-Hand Rule','Use the right hand to determine the orientation of a×b.'],['Reverse Order','Reversing the inputs reverses direction: b×a=−(a×b).'],['Determinant Method','Expand the 3×3 determinant carefully and protect the negative middle cofactor.'],['Common Sign Error','A missing negative sign in the j-component changes the computed normal.'],['Verify Orthogonality','Check the result by dotting a×b with both a and b.'],['Parallel Test','Nonzero vectors are parallel exactly when their cross product is zero.'],['Coplanarity','Three vectors are coplanar when their scalar triple product is zero.'],['Concept Trap','The cross product is neither commutative nor associative.'],
  ],
  'chapter-12-5':[
    ['What Does t Do?','The parameter moves through every point on the line in both directions.'],['Nonuniqueness','Different base points and nonzero scalar multiples of a direction can describe the same line.'],['Zero Component Case','If a direction component is zero, keep that coordinate constant instead of dividing by zero.'],['Line Segment','Restrict 0≤t≤1 to travel from one endpoint to the other.'],['Why a Normal Works','Every displacement lying in a plane is perpendicular to its normal vector.'],['Intercepts','Set the other two coordinates to zero to locate an axis intercept when it exists.'],['Parallel Planes','Parallel planes have parallel normal vectors.'],['Intersection of Planes','Two nonparallel planes meet in a line whose direction is the cross product of their normals.'],['Distance Derivation','Point-to-plane distance is the absolute scalar projection onto a unit normal.'],
  ],
  'chapter-12-6':[
    ['Definition of Trace','A trace is the intersection of a surface with a plane.'],['Missing Variable Mystery','A missing variable is free, so the curve extrudes parallel to that coordinate axis.'],['Extrusion Animation','Move a familiar plane curve through the missing direction to create a cylinder.'],['Elliptic Cylinder','Recognize an ellipse extended parallel to the missing-variable axis.'],['Parabolic Cylinder','Recognize a parabola extended parallel to the missing-variable axis.'],['Quadric Surface Idea','Use signs, squared variables, and traces to classify a second-degree surface.'],['Cone','Horizontal traces scale while vertical traces reveal intersecting lines.'],['Reconstruct the Surface','Combine several two-dimensional traces to identify the hidden three-dimensional surface.'],['Distance Locus','Translate an equal-distance condition into an equation, simplify it, and identify the resulting cone.'],
  ],
}

const supplementalSlides=lecture=>(chapter12Supplemental[lecture.id]||[]).map(
  ([title,description],index)=>slide(
    `${lecture.id}-supplemental-${index+1}`,
    'connection',
    title,
    [content('eyebrow','ADDITIVE 36-SLIDE SEQUENCE'),content('text',description)],
    {
      presenterNotes:[
        {type:'teaching',title:'TEACHING GOAL',content:description},
        {type:'reveal',title:'WHAT TO REVEAL',content:'Reveal the visual or statement only after students predict what should happen.'},
        {type:'transition',title:'TRANSITION',content:'Connect this state to the next existing lecture slide without replacing either one.'},
      ],
      masterRequirement:'chapter-12-supplemental',
    },
  ),
)

const chapter124ConsolidatedSlides=()=>[
  slide('chapter-12-4-consolidated-meaning','summary','Cross Product: Meaning and Direction',[
    content('list',[
      'Dot product: vector × vector → scalar. Cross product: vector × vector → perpendicular vector.',
      'Use the right-hand rule to determine the orientation of a × b.',
      'Reversing the inputs reverses direction: b × a = −(a × b).',
    ]),
  ],{masterRequirement:'chapter-12-4-consolidated'}),
  slide('chapter-12-4-consolidated-computation','summary','Cross Product: Computation and Verification',[
    content('list',[
      'Expand the 3 × 3 determinant carefully and protect the negative middle cofactor.',
      'A missing negative sign in the j-component changes the computed normal vector.',
      'Verify the result by checking that a × b has dot product zero with both a and b.',
    ]),
  ],{masterRequirement:'chapter-12-4-consolidated'}),
  slide('chapter-12-4-consolidated-tests','summary','Cross Product: Structural Tests and Reminders',[
    content('list',[
      'Parallel test: nonzero vectors are parallel exactly when their cross product is the zero vector.',
      'Coplanarity test: three vectors are coplanar when their scalar triple product is zero.',
      'Concept trap: the cross product is neither commutative nor associative.',
      'Geometric spark: magnitude measures the area created by two directions.',
      'Mathematical smile: cross products always insist on taking a side—and the right hand decides which one.',
    ]),
  ],{masterRequirement:'chapter-12-4-consolidated'}),
]

export function applyLectureRequirements(lecture){
  if(!lecture||lecture.masterRequirementsApplied)return lecture
  const objectives=lecture.objectives?.length?lecture.objectives:[`Explain the central idea of ${lecture.title}.`]
  const instructionalSlides=addLiveQuizSequences(lecture.slides||[])
  const focus=index=>objectives[Math.min(index,objectives.length-1)]
  const exitPrompts=exitPromptsByLecture[lecture.id]||[`In your own words, explain this central idea: ${focus(0)}`,`What visual or geometric meaning helps you understand: ${focus(1)}`,`Why is the main conclusion in today’s ${lecture.title} lecture mathematically reasonable?`,`Give one application or later-calculus connection for: ${focus(2)}`]
  const configured=(chapter12Retrievals[lecture.id]||[]).map((item,index)=>{
    const base=slide(`${lecture.id}-master-retrieval-${index+1}`,'live-question',item.title,[content('eyebrow',index===0?'RETRIEVAL FROM THE PREVIOUS CLASS':'PREREQUISITE BRIDGE'),content('text',item.prompt)],{question:{type:'multiple-choice',prompt:item.prompt,options:item.options,correctAnswer:item.answer,explanation:item.reveal,category:index===0?'retrieval':'prerequisite-bridge'},revealSteps:['THINK','VOTE / ANSWER','DISCUSS',`REVEAL: ${item.reveal}`],masterRequirement:index===0?'retrieval':'prerequisite-bridge'})
    if(!item.choices)return base
    const determinant=index===1&&lecture.id==='chapter-12-4'
    return {...base,question:{...base.question,choices:item.choices,optionMath:item.optionMath,mathPrompt:item.mathPrompt,correctChoiceId:item.correctChoiceId,solution:item.solution,timer:60,pointsPossible:1000,scoring:'speed',topic:lecture.section},presenterNotes:[{type:'script',title:'Before question',content:determinant?'Before we use determinants in our cross-product formula, let’s make sure everyone remembers how to evaluate a 2×2 determinant.':'Before we introduce the cross product, recall what the dot product tells us about the angle between two vectors.'},{type:'timing',title:'Question timing',content:'Open for 60 seconds. Students submit exactly once.'},{type:'answer',title:'After revealing',content:item.reveal},{type:'transition',title:'Transition to cross product',content:determinant?'This small determinant calculation will appear repeatedly when we compute the components of a cross product.':'Keep perpendicularity in mind. The cross product will give us something new: a vector perpendicular to both original vectors.'}]}
  })
  const retrievalSlides=addLiveQuizSequences(configured)
  const additions=lecture.id==='chapter-12-4'?chapter124ConsolidatedSlides():supplementalSlides(lecture)
  const inherited=[
    slide(`${lecture.id}-master-welcome`,'welcome','Welcome to Calculus',[],{visualization:'lecture-opening',visualizationSettings:{lessonTitle:lecture.title,message:lecture.openingMessage,musicTrack:lecture.openingMusicTrack,fact:sparkByLecture[lecture.id]||`${lecture.title} connects a local mathematical idea to a broader pattern used throughout calculus.`,joke:smileByLecture[lecture.id]||'Calculus: where “and so on” can still lead to an exact answer.',warmup:`In one minute, write down one idea from a previous course that you expect to use in ${lecture.title}.`},masterRequirement:'welcome'}),
    slide(`${lecture.id}-master-spark`,'mathematical-spark','Mathematical Spark',[content('eyebrow','DID YOU KNOW?'),content('callout',sparkByLecture[lecture.id]||`${lecture.title} connects a local mathematical idea to a broader pattern used throughout calculus.`)],{masterRequirement:'spark'}),
    slide(`${lecture.id}-master-smile`,'mathematical-smile','Mathematical Smile',[content('eyebrow','MATH MOMENT'),content('callout',smileByLecture[lecture.id]||'Calculus: where “and so on” can still lead to an exact answer.')],{masterRequirement:'smile'}),
    exitQuestion(lecture,1,'Concept',exitPrompts[0]),exitQuestion(lecture,2,'Meaning',exitPrompts[1]),exitQuestion(lecture,3,'Reasoning',exitPrompts[2]),exitQuestion(lecture,4,'Connection',exitPrompts[3]),
    slide(`${lecture.id}-master-reflection`,'live-question','Exit Reflection',[content('eyebrow','OPEN REFLECTION'),content('text','One thing that finally made sense today?')],{question:{type:'short-answer',prompt:'One thing that finally made sense today?',topic:`${lecture.title} Reflection`,category:'reflection',graded:false,privacy:'anonymous-by-default',shareableAnonymously:true}}),
    slide(`${lecture.id}-master-confidence`,'live-question','Exit Confidence Poll',[content('eyebrow','UN-GRADED · PRIVATE BY DEFAULT'),content('text',`How confident are you with today’s ${lecture.title} lecture?`)],{question:{type:'confidence',prompt:`How confident are you with today’s ${lecture.title} lecture?`,options:['Very confident','Mostly confident','Unsure','Very confused'],topic:`${lecture.title} Confidence`,category:'confidence',graded:false,privacy:'aggregate'}}),
    slide(`${lecture.id}-master-feedback`,'student-feedback','Student Ideas & Feedback',[],{visualization:'studentFeedback',visualizationSettings:{moduleId:`lecture:${lecture.id}`,moduleTitle:lecture.title},masterRequirement:'feedback'}),
    slide(`${lecture.id}-master-final-podium`,'live-podium',"Today's Top 3",[],{liveQuizView:'final-podium',masterRequirement:'final-podium'}),
  ]
  const existingIds=new Set(instructionalSlides.map(item=>item.id)),welcome=inherited[0],removed=new Set(lecture.removedSlideIds||[])
  const trailingRequirements=inherited.slice(1).filter(item=>lecture.id!=='chapter-12-4'||!['spark','smile'].includes(item.masterRequirement))
  const assembled=[...(existingIds.has(welcome.id)?[]:[welcome]),...retrievalSlides.filter(item=>!existingIds.has(item.id)),...instructionalSlides,...additions.filter(item=>!existingIds.has(item.id)),...trailingRequirements.filter(item=>!existingIds.has(item.id))]
  return {...lecture,masterRequirementsApplied:true,slides:assembled.filter(item=>!removed.has(item.id))}
}
