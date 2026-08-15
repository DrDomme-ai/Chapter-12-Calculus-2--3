import { lectureCatalog } from './data/lectureCatalog'
import './styles/instructor.css'

const groups = ['Review Week', 'Calculus II', 'Calculus II & III']

export default function InstructorHome({ onHome, onOpenLecture, onJoin }) {
  return <div className="instructor-home">
    <nav className="instructor-breadcrumb"><button type="button" onClick={onHome}>← Home</button><button type="button" onClick={onJoin}>Join Live Class</button></nav>
    <header className="instructor-home-hero"><p>Classroom teaching system</p><h1>Instructor Lectures</h1><span>Build, present, annotate, question, and assess from one lecture workspace.</span></header>
    {groups.map((group) => {
      const lectures = lectureCatalog.filter((lecture) => lecture.course === group || (group === 'Calculus II' && ['Calculus II'].includes(lecture.course)))
      if (!lectures.length) return null
      return <section className="lecture-group" key={group}><header><p>{group === 'Calculus II & III' ? 'Shared course material' : 'Course collection'}</p><h2>{group === 'Calculus II & III' ? 'Calculus III · Chapter 12' : group}</h2></header><div className="lecture-card-grid">
        {lectures.map((lecture) => <article className={`lecture-card lecture-card-${lecture.status}`} key={lecture.id}>
          <div className="lecture-card-badges">{(lecture.badges||[lecture.chapter]).map((badge)=><span key={badge}>{badge}</span>)}<span>{lecture.slides.length} slides</span></div><h3>{lecture.title}</h3><p>{lecture.description}</p>
          {lecture.status === 'shell' && <strong>Content to be added</strong>}
          <div className="lecture-card-actions"><button onClick={() => onOpenLecture(lecture.id, 'presenter')}>Open Lecture</button><button onClick={() => onOpenLecture(lecture.id, 'edit')}>Edit Lecture</button><button onClick={() => onOpenLecture(lecture.id, 'presenter')}>Present</button><button className="primary" onClick={() => onOpenLecture(lecture.id, 'live')}>Start Live Lecture</button><button onClick={onJoin}>Student Join Live Class</button></div>
        </article>)}
      </div></section>
    })}
  </div>
}
