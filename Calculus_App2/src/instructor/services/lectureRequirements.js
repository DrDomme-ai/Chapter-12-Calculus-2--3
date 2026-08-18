const content=(kind,value)=>({kind,value})

const sparkByLecture={
  'real-numbers':'The rational numbers are dense, yet they still omit limiting values such as √2; density and completeness are different ideas.',
  geometry:'A sphere is determined by one center and one radius, but its two-dimensional surface lives in three-dimensional space.',
  trigonometry:'Radians make the derivative of sin x equal cos x with no conversion factor.',
  'inverse-trigonometric-functions':'Inverse trigonometric functions require restricted domains because periodic functions are not one-to-one.',
  'hyperbolic-functions':'A hanging cable forms a catenary described by hyperbolic cosine—not a parabola.',
  'chapter-12-3':'A perpendicular force does zero work because its projection along the displacement is zero.',
  'exponential-growth-decay':'Carbon-14 decay lets scientists estimate the age of once-living material because its relative decay rate is approximately constant.',
}

const smileByLecture={
  'real-numbers':'Be rational—but when the limit demands it, get real.',
  geometry:'Vectors have direction. Unlike some group projects.',
  trigonometry:'Trigonometry keeps coming full circle.',
  'inverse-trigonometric-functions':'Inverse trig is very particular about its domain—it has boundaries.',
  'hyperbolic-functions':'Cosh is what happens when exponentials agree to hang out symmetrically.',
  'chapter-12-3':'The dot product is a scalar because sometimes two vectors just need a number between them.',
  'exponential-growth-decay':'Exponential functions are very confident. Give them a little time and they think they can take over everything.',
}

const slide=(id,type,title,presentationContent,options={})=>({
  id,type,title,presentationContent,presenterNotes:[],studentNotes:[],revealSteps:[],
  layoutMode:'slide',theme:'classic-math',level:'essential',...options,
})

function addImmediateSolutions(slides){
  const result=[]
  slides.forEach((item,index)=>{
    result.push(item)
    const question=item.question,next=slides[index+1]
    const hasAnswer=question&&Number.isInteger(question.correctAnswer)&&Array.isArray(question.options)
    if(!hasAnswer||next?.solutionFor===item.id)return
    const answer=question.options[question.correctAnswer]
    result.push(slide(`${item.id}-solution`,'solution',`${item.title}: Solution`,[
      content('eyebrow','CORRECT ANSWER'),content('callout',answer),
      content('text',question.explanation||`The correct choice is “${answer}.” Connect it directly to the definition or model used in the preceding question.`),
      content('text',`Common mistake: ${question.commonMistake||'Choosing from surface features without checking the governing definition, sign, units, or assumptions.'}`),
      content('callout',`KEY IDEA: ${question.keyIdea||'Use the mathematical structure—not a memorized keyword—to justify the answer.'}`),
    ],{solutionFor:item.id,masterRequirement:'question-solution',recommendedFor:item.recommendedFor,courses:item.courses}) )
  })
  return result
}

function exitQuestion(lecture,index,kind,prompt){
  return slide(`${lecture.id}-master-exit-${index}`,'live-question',`Exit Check ${index}: ${kind}`,[
    content('eyebrow','EXIT CHECK · IF TIME ALLOWS'),content('text',prompt),
  ],{question:{type:'short-answer',prompt,topic:`${lecture.title} Exit Check`,category:'exit-check',graded:false,privacy:'aggregate'}})
}

export function applyLectureRequirements(lecture){
  if(!lecture||lecture.masterRequirementsApplied)return lecture
  const objectives=lecture.objectives?.length?lecture.objectives:[`Explain the central idea of ${lecture.title}.`]
  const instructionalSlides=addImmediateSolutions(lecture.slides||[])
  const focus=(index)=>objectives[Math.min(index,objectives.length-1)]
  const inherited=[
    slide(`${lecture.id}-master-welcome`,'welcome','Welcome to Calculus',[],{visualization:'lecture-opening',visualizationSettings:{lessonTitle:lecture.title,message:lecture.openingMessage,musicTrack:lecture.openingMusicTrack,fact:sparkByLecture[lecture.id]||`${lecture.title} connects a local mathematical idea to a broader pattern used throughout calculus.`,joke:smileByLecture[lecture.id]||'Calculus: where “and so on” can still lead to an exact answer.',warmup:`In one minute, write down one idea from a previous course that you expect to use in ${lecture.title}.`},masterRequirement:'welcome'}),
    slide(`${lecture.id}-master-spark`,'mathematical-spark','Mathematical Spark',[content('eyebrow','DID YOU KNOW?'),content('callout',sparkByLecture[lecture.id]||`${lecture.title} connects a local mathematical idea to a broader pattern used throughout calculus.`)],{masterRequirement:'spark'}),
    slide(`${lecture.id}-master-smile`,'mathematical-smile','Mathematical Smile',[content('eyebrow','MATH MOMENT'),content('callout',smileByLecture[lecture.id]||`Calculus: where “and so on” can still lead to an exact answer.`)],{masterRequirement:'smile'}),
    exitQuestion(lecture,1,'Concept',`In your own words, explain this central idea: ${focus(0)}`),
    exitQuestion(lecture,2,'Meaning',`What visual or geometric meaning helps you understand: ${focus(1)}`),
    exitQuestion(lecture,3,'Reasoning',`Why is the main conclusion in today’s ${lecture.title} lecture mathematically reasonable?`),
    exitQuestion(lecture,4,'Connection',`Give one application or later-calculus connection for: ${focus(2)}`),
    slide(`${lecture.id}-master-reflection`,'live-question','Exit Reflection',[content('eyebrow','OPEN REFLECTION'),content('text','One thing that finally made sense today?')],{question:{type:'short-answer',prompt:'One thing that finally made sense today?',topic:`${lecture.title} Reflection`,category:'reflection',graded:false,privacy:'anonymous-by-default',shareableAnonymously:true}}),
    slide(`${lecture.id}-master-confidence`,'live-question','Exit Confidence Poll',[content('eyebrow','UN-GRADED · PRIVATE BY DEFAULT'),content('text',`How confident are you with today’s ${lecture.title} lecture?`)],{question:{type:'confidence',prompt:`How confident are you with today’s ${lecture.title} lecture?`,options:['Very confident','Mostly confident','Unsure','Very confused'],topic:`${lecture.title} Confidence`,category:'confidence',graded:false,privacy:'aggregate'}}),
    slide(`${lecture.id}-master-feedback`,'student-feedback','Student Ideas & Feedback',[],{visualization:'studentFeedback',visualizationSettings:{moduleId:`lecture:${lecture.id}`,moduleTitle:lecture.title},masterRequirement:'feedback'}),
  ]
  const existingIds=new Set(instructionalSlides.map(item=>item.id))
  const welcome=inherited[0]
  return {...lecture,masterRequirementsApplied:true,slides:[...(existingIds.has(welcome.id)?[]:[welcome]),...instructionalSlides,...inherited.slice(1).filter(item=>!existingIds.has(item.id))]}
}
