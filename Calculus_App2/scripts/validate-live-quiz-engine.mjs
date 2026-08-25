import live from '../src/lib/mockLive.js'
import { calculateQuizScore, normalizeQuizQuestion } from '../src/instructor/services/liveQuizService.js'

const assert=(condition,message)=>{if(!condition)throw new Error(message)}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
const normalized=normalizeQuizQuestion({id:'cross-product-dot-product-orthogonality',choices:[{id:'orthogonal',text:'Orthogonal'},{id:'parallel',text:'Parallel'},{id:'same-magnitude',text:'Same magnitude'},{id:'45-degrees',text:'45 degrees'}],correctChoiceId:'orthogonal',timeLimitSeconds:20})
assert(normalized.correctChoiceId==='orthogonal','Orthogonal must be correct')
assert(normalized.correctAnswer===0,'Orthogonal must resolve to choice A')
assert(normalized.choices[1].id==='parallel'&&normalized.correctChoiceId!=='parallel','Parallel must be incorrect')
assert(calculateQuizScore({isCorrect:false,responseTimeMs:1,timeLimitMs:20000})===0,'Incorrect answers must score zero')
assert(calculateQuizScore({isCorrect:true,responseTimeMs:100,timeLimitMs:20000})>calculateQuizScore({isCorrect:true,responseTimeMs:10000,timeLimitMs:20000}),'Faster correct answers must score more')

const session=live.createSession({lectureId:'chapter-12-4'})
const students=['Maya','Alex','Jordan','Carlos','Emma','Wrong'].map((name,index)=>live.joinStudentByCode(session.join_code,{id:`student-${index}`,true_student_id:`student-${index}`,true_student_name:name,display_mode:'firstName'}).participants[0])
const question=live.openQuestion(session.id,normalized)
for(let index=0;index<students.length;index+=1){await sleep(3);const response=live.submitResponse(session.id,{participant_id:students[index].id,question_id:question.id,answer:index===5?1:0});assert(response,'First response should be accepted');assert((index===5&&response.points===0)||(index<5&&response.points>0),'Correctness scoring failed');assert(live.submitResponse(session.id,{participant_id:students[index].id,question_id:question.id,answer:0})===null,'Second response must be rejected')}
live.showQuestionResults(session.id)
const projector=live.getProjectorSession(session.id)
assert(projector.question_leaderboard.length===5,'Top Five must contain five correct students')
assert(projector.question_leaderboard.every(row=>row.displayName!=='Wrong'),'Incorrect students must not appear in Top Five')
assert(projector.question_leaderboard.every((row,index,rows)=>index===0||rows[index-1].responseTimeMs<=row.responseTimeMs),'Top Five must be ordered by elapsed response time')
const totals=live.getLeaderboard(session.id)
assert(totals[0].score>0&&totals.at(-1).score===0,'Cumulative scores must persist and rank correctly')
live.changeSlide(session.id,3);live.changeSlide(session.id,2)
assert(live.getProjectorSession(session.id).question_leaderboard.length===5,'Slide navigation must not erase scores')
const beforeSecond=live.getLeaderboard(session.id).find(row=>row.participant.display_name==='Maya').score
const determinant=live.openQuestion(session.id,{id:'cross-product-2x2-determinant',choices:[{id:'ad-minus-bc',text:'ad-bc'},{id:'ac-minus-bd',text:'ac-bd'},{id:'ab-minus-cd',text:'ab-cd'},{id:'ad-plus-bc',text:'ad+bc'}],correctChoiceId:'ad-minus-bc',timer:60,pointsPossible:1000})
const determinantCorrect=live.submitResponse(session.id,{participant_id:students[0].id,question_id:determinant.id,answer:0}),determinantWrong=live.submitResponse(session.id,{participant_id:students[5].id,question_id:determinant.id,answer:3})
assert(determinant.correctChoiceId==='ad-minus-bc'&&determinantCorrect.points>0&&determinantWrong.points===0,'Determinant stable-ID scoring failed')
const afterSecond=live.getLeaderboard(session.id).find(row=>row.participant.display_name==='Maya').score
assert(afterSecond===beforeSecond+determinantCorrect.points,'Second-question points must accumulate')
console.log(JSON.stringify({correctChoiceId:normalized.correctChoiceId,parallelIsCorrect:false,determinantCorrectChoiceId:determinant.correctChoiceId,topFive:projector.question_leaderboard,cumulative:live.getLeaderboard(session.id).map(row=>({name:row.participant.display_name,score:row.score,correct:row.correct}))},null,2))
process.exit(0)
