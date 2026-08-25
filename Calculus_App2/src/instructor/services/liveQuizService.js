export const LIVE_QUIZ_STATES={NOT_STARTED:'not-started',ACCEPTING:'open',CLOSED:'closed',LEADERBOARD:'results',SOLUTION:'answer-revealed'}

export function normalizeQuizQuestion(question={}){
  const raw=question.choices||question.options||[]
  const choices=raw.map((choice,index)=>typeof choice==='string'?{id:String(index),text:choice,label:String.fromCharCode(65+index)}:{label:String.fromCharCode(65+index),...choice,id:String(choice.id??index)})
  const indexed=Number.isInteger(question.correctAnswer)?choices[question.correctAnswer]?.id:undefined
  const correctChoiceId=String(question.correctChoiceId??indexed??question.correct_option_index??'')
  return {...question,type:question.type||'multiple-choice',choices,options:choices.map(choice=>choice.text),choiceIds:choices.map(choice=>choice.id),correctChoiceId,correctAnswer:Math.max(0,choices.findIndex(choice=>choice.id===correctChoiceId)),pointsPossible:Number(question.pointsPossible||1000),timer:Number(question.timeLimitSeconds||question.timer||60),attempts:1,scoring:question.graded===false?question.scoring:'speed'}
}

export function calculateQuizScore({isCorrect,responseTimeMs,timeLimitMs,pointsPossible=1000,minimumCorrectScore}={}){
  if(!isCorrect)return 0
  const maximum=Math.max(1,Math.round(pointsPossible)),minimum=Math.max(1,Math.min(maximum,Math.round(minimumCorrectScore??maximum*.5)))
  const elapsed=Math.max(0,Number(responseTimeMs)||0),limit=Math.max(1,Number(timeLimitMs)||60000),speedRatio=Math.max(0,1-Math.min(elapsed,limit)/limit)
  return Math.max(minimum,Math.min(maximum,Math.round(minimum+(maximum-minimum)*speedRatio)))
}

export function rankFastestCorrect(responses=[],participants=[],limit=5){
  const people=new Map(participants.map(person=>[person.id,person]))
  return responses.filter(response=>response.correct).sort((a,b)=>Number(a.response_time_ms)-Number(b.response_time_ms)||String(a.submitted_at).localeCompare(String(b.submitted_at))||String(a.participant_id).localeCompare(String(b.participant_id))).slice(0,limit).map((response,index)=>({rank:index+1,displayName:people.get(response.participant_id)?.display_name||'Anonymous',points:Number(response.points||0),responseTimeMs:Number(response.response_time_ms||0)}))
}
