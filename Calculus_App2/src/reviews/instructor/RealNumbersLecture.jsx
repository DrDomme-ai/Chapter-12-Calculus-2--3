import React, { useState } from 'react'
import PresentationWorkspace from './presentation/PresentationWorkspace'

function LectureHeading({ course, chapter, section, title, number, time }) {
  return (
    <header className="lecture-heading">
      <p className="lecture-meta">{course} — {chapter} • {section}</p>
      <h1>{title}</h1>
      <p className="lecture-submeta">Lecture {number} • Estimated class time: {time}</p>
    </header>
  )
}

function DefinitionBlock({ children }) {
  return (
    <article className="lecture-block lecture-definition">
      <p className="lecture-block-label">Definition</p>
      <div>{children}</div>
    </article>
  )
}

function AxiomBlock({ children }) {
  return (
    <article className="lecture-block lecture-axiom">
      <p className="lecture-block-label">Axioms / Properties</p>
      <div>{children}</div>
    </article>
  )
}

function ExampleBlock({ title, children }) {
  return (
    <article className="lecture-block lecture-example">
      <p className="lecture-block-label">Example</p>
      {title && <h3>{title}</h3>}
      <div>{children}</div>
    </article>
  )
}

export default function RealNumbersLecture({ onHome, onInstructorHome }) {
  // Replace static lecture with the interactive presentation workspace
  return (
    <div className="page instructor-lecture">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="text-button" type="button" onClick={onInstructorHome}><span aria-hidden>←</span> Instructor Lectures</button>
        <div>
          <button className="text-button" onClick={onHome}>Home</button>
        </div>
      </div>

      <PresentationWorkspace lectureId="real-numbers" />
    </div>
  )
}
