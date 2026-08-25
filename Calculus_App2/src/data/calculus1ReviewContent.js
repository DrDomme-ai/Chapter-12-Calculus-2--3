// EDIT CALCULUS I FUNDAMENTAL REVIEW CONTENT HERE.
// Add a station by copying one object in `stations`. Add an activity by copying
// a question inside that station. Every question needs a unique `id`.

const question=(id,title,prompt,acceptedAnswers,explanation,math)=>({
  id,type:'expression',title,prompt,math,acceptedAnswers,hints:['Identify the relevant definition or theorem.','Write the governing equation before simplifying.'],explanation,
})

export const continuityReview={
  titleLines:['Continuity','Fundamental Review'],
  description:'Connect limits, function values, discontinuities, and the Intermediate Value Theorem.',
  topicLabel:'Continuity topics',
  topicDescription:'Add definitions, examples, and activities to the stations below.',
  stations:[
    {id:'continuity-at-a-point',title:'Continuity at a point',description:'Check the three continuity conditions.',learnFirst:{intuition:'A continuous graph can be drawn locally without lifting the pencil.',definition:'A function is continuous at a when f(a) exists, the limit exists, and the limit equals f(a).',definitionMath:String.raw`\lim_{x\to a}f(x)=f(a)`,decisionCue:'Check function value, limit, then equality.'},questions:[question('continuity-basic','Evaluate a continuous limit','If f is continuous and f(2)=7, find the limit as x approaches 2.',['7'],'Continuity allows direct substitution: the limit equals f(2)=7.',String.raw`\lim_{x\to2}f(x)`)]},
    {id:'ivt',title:'Intermediate Value Theorem',description:'Use continuity to guarantee values between endpoint outputs.',learnFirst:{intuition:'A continuous curve connecting two heights must pass through every height between them.',definition:'If f is continuous on [a,b], every value between f(a) and f(b) occurs.',definitionMath:String.raw`f(c)=N\text{ for some }c\in[a,b]`,decisionCue:'Verify continuity and bracket the target value.'},questions:[question('ivt-basic','Guaranteed root','A continuous function has f(1)=-2 and f(4)=5. What value is guaranteed between the outputs?',['0'],'Zero lies between -2 and 5, so the IVT guarantees at least one root in (1,4).')]},
  ],
}

export const derivativeApplicationsReview={
  titleLines:['Applications of','Derivatives'],description:'Use derivatives to analyze shape, optimize quantities, and connect related rates.',topicLabel:'Derivative applications',topicDescription:'Add application scenarios and complete solutions here.',stations:[
    {id:'critical-points',title:'Critical points and extrema',description:'Use the sign of the derivative to classify behavior.',learnFirst:{intuition:'The derivative records whether the function rises or falls.',definition:'Critical numbers occur where f′=0 or f′ does not exist, provided f exists.',definitionMath:String.raw`f'(c)=0`,decisionCue:'Find critical numbers, create a sign chart, and check endpoints when required.'},questions:[question('critical-basic','Find a critical number','Find the critical number of f(x)=x²−4x.',['2'],'f′(x)=2x−4. Setting the derivative equal to zero gives x=2.',String.raw`f(x)=x^2-4x`)]},
    {id:'optimization',title:'Optimization',description:'Translate constraints before differentiating.',learnFirst:{intuition:'Optimization reduces a situation to one objective function of one variable.',definition:'Absolute extrema occur at critical numbers or endpoints on a closed interval.',definitionMath:String.raw`\text{candidates}=\{\text{critical numbers, endpoints}\}`,decisionCue:'Define variables, write the constraint, reduce the objective, differentiate, and compare candidates.'},questions:[question('optimization-basic','Maximum product','Two positive numbers sum to 10. What number should each be to maximize their product?',['5'],'Let the numbers be x and 10−x. The product x(10−x) has derivative 10−2x, so x=5.',String.raw`P(x)=x(10-x)`)]},
  ]}

export const integralFoundationsReview={
  titleLines:['Integral','Foundations'],description:'Connect antiderivatives, signed accumulation, definite integrals, and the Fundamental Theorem of Calculus.',topicLabel:'Integral foundations',topicDescription:'Add accumulation models, area examples, and FTC exercises here.',stations:[
    {id:'antiderivatives',title:'Antiderivatives',description:'Reverse differentiation and include the constant of integration.',learnFirst:{intuition:'An antiderivative asks which function could have produced the given derivative.',definition:'F is an antiderivative of f when F′=f.',definitionMath:String.raw`\int f(x)\,dx=F(x)+C`,decisionCue:'Reverse the power rule and include +C.'},questions:[question('antiderivative-basic','Reverse the power rule','Find an antiderivative of 3x².',['x^3','x^3+c'],'Because d(x³)/dx=3x², the antiderivatives are x³+C.',String.raw`\int3x^2\,dx`)]},
    {id:'ftc',title:'Fundamental Theorem of Calculus',description:'Evaluate accumulation using endpoint values of an antiderivative.',learnFirst:{intuition:'The FTC converts total accumulation into a change in an antiderivative.',definition:'If F′=f, then the definite integral from a to b is F(b)−F(a).',definitionMath:String.raw`\int_a^b f(x)\,dx=F(b)-F(a)`,decisionCue:'Find an antiderivative, evaluate upper minus lower, and keep the sign.'},questions:[question('ftc-basic','Evaluate a definite integral','Evaluate the integral of 2x from 0 to 3.',['9'],'An antiderivative is x². Therefore 3²−0²=9.',String.raw`\int_0^3 2x\,dx`)]},
  ]}

export const flattenReviewQuestions=review=>review.stations.flatMap(station=>station.questions.map(item=>({...item,stationId:station.id})))
