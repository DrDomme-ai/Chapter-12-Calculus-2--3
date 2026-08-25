const interactiveQuestion=(id,prompt,options,correctAnswer,metadata={})=>Object.freeze({
  id,registryType:'kahoot-interactive',course:'Calculus II',chapter:6,section:'6.7',topic:'Hyperbolic Functions',type:'multiple-choice',prompt,options,correctAnswer,difficulty:'medium',timer:60,scoring:'speed',sourceCollection:'Calculus II · Chapter 6 · Section 6.7 Hyperbolic Functions',...metadata,
})

export const hyperbolicKahootQuestions=Object.freeze([
  interactiveQuestion('hy-kahoot-sinh-over-x-limit','Evaluate lim(x→0) sinh(x)/x.',['0','1','∞','The limit does not exist'],1,{reference:'Section 6.7 Hyperbolic Functions review',learningObjective:'Use the local behavior or derivative of sinh at zero.'}),
  interactiveQuestion('hy-kahoot-artanh-x8-derivative','If y = tanh⁻¹(x⁸), what is y′?',['8x⁷/(1−x¹⁶)','8x⁷/(1+x¹⁶)','x⁷/(1−x⁸)','8x⁸/(1−x¹⁶)'],0,{reference:'Section 6.7 Inverse Hyperbolic Functions review',learningObjective:'Differentiate an inverse-hyperbolic composition with the Chain Rule.'}),
  interactiveQuestion('hy-kahoot-even-function','Which function is even?',['x³','x²','eˣ','x+1'],1,{difficulty:'easy',timer:45,learningObjective:'Recognize even and odd symmetry before decomposing the exponential function.'}),
  interactiveQuestion('hy-kahoot-reconstruct-exponential','Why does eˣ = cosh x + sinh x?',['Their e⁻ˣ terms cancel','Their eˣ terms cancel','Cosh and sinh are reciprocals','It is true only at x=0'],0,{learningObjective:'Reconstruct the exponential function from its even and odd components.'}),
  interactiveQuestion('hy-kahoot-catenary','Which curve does an ideal hanging cable make?',['Circle','Parabola','Catenary','Hyperbola'],2,{difficulty:'easy',timer:45,learningObjective:'Connect hyperbolic cosine to the catenary.'}),
  interactiveQuestion('hy-kahoot-cosh-even','Which hyperbolic function is even?',['sinh','cosh','tanh','arsinh'],1,{learningObjective:'Identify symmetry properties of the hyperbolic functions.'}),
])

export const kahootQuestionCollections=Object.freeze({'calc2.chapter6.hyperbolic-functions':Object.freeze({id:'calc2.chapter6.hyperbolic-functions',registryType:'kahoot-interactive-collection',course:'Calculus II',chapter:6,section:'6.7',title:'Hyperbolic Functions · Kahoot / Interactive Questions',description:'Reusable active-learning questions for live checkpoints, review, and optional student practice. This collection is separate from the Exam Question Pool.',lectureId:'hyperbolic-functions',questions:hyperbolicKahootQuestions})})
export const getKahootCollectionForLecture=(lectureId)=>Object.values(kahootQuestionCollections).find(collection=>collection.lectureId===lectureId)||null
export const getKahootQuestionsForLecture=(lectureId)=>getKahootCollectionForLecture(lectureId)?.questions||[]
