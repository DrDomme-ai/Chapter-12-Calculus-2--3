import React from 'react'
import LectureCard from '../../components/LectureCard'

const showDevControls = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

const lectures = [
  {
    id: 'real-numbers',
    title: 'Real Numbers & Algebra',
    description: 'Review foundational concepts through definitions, examples, visualizations, and interactive class questions.',
    meta: ['Review Week', 'Fundamental Concepts', 'Interactive Lecture'],
    status: 'ready',
    routeOpen: '#/instructor/real-numbers',
    routeStartLive: '#/instructor/mock/live',
    routeJoin: '#/instructor/mock/join',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    description: 'Coming soon — interactive lecture card scaffolded for future content.',
    meta: ['Review Week', 'Fundamental Concepts', 'Interactive Lecture'],
    status: 'coming-soon',
  },
]

export default function InstructorHome({ onHome, onOpenLecture }) {
  return (
    <div className="page instructor-home-page">
      <button className="text-button" type="button" onClick={onHome}>
        <span aria-hidden="true">←</span> Home
      </button>

      <header className="instructor-hero">
        <p className="eyebrow">Instructor Lectures</p>
        <h1>Instructor Lectures</h1>
        <p className="lead">Interactive classroom lectures with definitions, worked examples, visualizations, live questions, and student comprehension checks.</p>
      </header>

      <section className="instructor-grid">
        {lectures.map((lec) => (
          <LectureCard
            key={lec.id}
            title={lec.title}
            description={lec.description}
            meta={lec.meta}
            status={lec.status}
            onOpen={() => window.location.hash = lec.routeOpen || '#/instructor'}
            onStartLive={() => window.location.hash = lec.routeStartLive || '#/instructor'}
            onJoin={() => window.location.hash = lec.routeJoin || '#/instructor'}
            disabled={lec.status !== 'ready'}
          />
        ))}

        {/* Course sections scaffold for future expansion */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ margin: '8px 0' }}>Calculus II</h3>
          <p style={{ margin: '0 0 12px' }}>Chapter 12</p>
          <div style={{ color: '#666', padding: 12 }}>Chapter lectures will appear here once added.</div>
        </div>
      </section>
    </div>
  )
}
