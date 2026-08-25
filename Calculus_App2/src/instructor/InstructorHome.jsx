import { lectureCatalog } from './data/lectureCatalog'
import './styles/instructor.css'

const calc2Chapters=[
  {number:6,title:'Inverse Functions, Exponential and Logarithmic Functions',ids:['exponential-growth-decay','inverse-trigonometric-functions','hyperbolic-functions','limits','chapter-6-exam-questions']},
  {number:12,title:'Vectors and the Geometry of Space',match:lecture=>lecture.id.startsWith('chapter-12-')},
  {number:7,title:'Integration Techniques'},
  {number:8,title:'Applications of Integrals'},
  {number:9,title:'Parametric and Polar Calculus'},
  {number:10,title:'Sequences and Series'},
  {number:11,title:'Power Series'},
]
const calc3Chapters=[
  {number:12,title:'Vectors and the Geometry of Space',match:lecture=>lecture.id.startsWith('chapter-12-')},
  {number:13,title:'Vector Functions',ids:['chapter-13-overview']},
  {number:14,title:'Partial Derivatives',ids:['chapter-14-overview']},
  {number:15,title:'Multiple Integrals',ids:['chapter-15-overview']},
  {number:16,title:'Vector Calculus',ids:['chapter-16-overview']},
  {number:17,title:'Second-Order Differential Equations',ids:['chapter-17-overview']},
]

function lecturesFor(chapter){return lectureCatalog.filter(lecture=>chapter.ids?.includes(lecture.id)||chapter.match?.(lecture))}
function LectureCard({lecture,onOpenLecture,onJoin}){return <article className={`lecture-card lecture-card-${lecture.status}`}><h4>{lecture.title.replace(/^\d+(?:\.\d+)?\s*[:–-]?\s*/,'')}</h4><p>{lecture.description}</p>{lecture.status==='shell'&&<strong>Content to be added</strong>}<div className="lecture-card-actions"><button onClick={()=>onOpenLecture(lecture.id,'presenter')}>Open Lecture</button><button onClick={()=>onOpenLecture(lecture.id,'edit')}>Edit Lecture</button><button onClick={()=>onOpenLecture(lecture.id,'presenter')}>Present</button><button className="primary" onClick={()=>onOpenLecture(lecture.id,'live')}>Start Live Lecture</button><button onClick={onJoin}>Student Join Live Class</button></div></article>}
function CourseChapters({title,chapters,onOpenLecture,onJoin}){return <section className="lecture-group"><header><p>Course collection</p><h2>{title}</h2></header><div className="chapter-accordion-list">{chapters.map(chapter=>{const lectures=lecturesFor(chapter);return <details className="chapter-accordion" key={chapter.number}><summary><span>Chapter {chapter.number}</span><strong>{chapter.title}</strong></summary><div className="chapter-lecture-list">{lectures.length?lectures.map(lecture=><LectureCard lecture={lecture} onOpenLecture={onOpenLecture} onJoin={onJoin} key={lecture.id}/>):<p className="chapter-empty">Lectures will appear here as chapter materials are added.</p>}</div></details>})}</div></section>}

export default function InstructorHome({onHome,onOpenLecture,onJoin}){
  const reviewLectures=lectureCatalog.filter(lecture=>lecture.course==='Review Week')
  return <div className="instructor-home"><nav className="instructor-breadcrumb"><button type="button" onClick={onHome}>← Home</button><button type="button" onClick={onJoin}>Join Live Class</button></nav><header className="instructor-home-hero"><p>Classroom teaching system</p><h1>Instructor Lectures</h1><span>Build, present, annotate, question, and assess from one lecture workspace.</span></header>{reviewLectures.length>0&&<section className="lecture-group"><header><p>Shared preparation</p><h2>Fundamental Review</h2></header><details className="chapter-accordion"><summary><strong>Prerequisite Review</strong></summary><div className="chapter-lecture-list">{reviewLectures.map(lecture=><LectureCard lecture={lecture} onOpenLecture={onOpenLecture} onJoin={onJoin} key={lecture.id}/>)}</div></details></section>}<CourseChapters title="Calculus II" chapters={calc2Chapters} onOpenLecture={onOpenLecture} onJoin={onJoin}/><CourseChapters title="Calculus III" chapters={calc3Chapters} onOpenLecture={onOpenLecture} onJoin={onJoin}/></div>
}
