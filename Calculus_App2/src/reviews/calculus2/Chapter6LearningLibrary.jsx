import { useMemo, useState } from "react";
import { MathDisplay } from "../../components/MathDisplay";
import SlideCanvas from "../../instructor/components/SlideCanvas";
import ExamQuestionView from "../../instructor/components/ExamQuestionView";
import { getLecture } from "../../instructor/data/lectureCatalog";
import { getKahootCollectionForLecture } from "../../instructor/data/kahootQuestionCollections";
import "./chapter6-learning-library.css";

const moduleIds = [
  "exponential-growth-decay",
  "inverse-trigonometric-functions",
  "hyperbolic-functions",
  "limits",
  "chapter-6-exam-questions",
];
const labels = {
  "exponential-growth-decay": "6.5 Exponential Growth & Decay",
  "inverse-trigonometric-functions": "6.6 Inverse Trigonometric Functions",
  "hyperbolic-functions": "6.7 Hyperbolic Functions",
  limits: "6.8 Limits & L’Hospital’s Rule",
  "chapter-6-exam-questions": "Exam Questions",
};
const prerequisites = {
  "exponential-growth-decay":
    "Exponents, logarithms, derivatives, initial values, and algebraic equation solving.",
  "inverse-trigonometric-functions":
    "Function composition, one-to-one functions, trigonometric graphs, identities, implicit differentiation, and the Chain Rule.",
  "hyperbolic-functions":
    "Exponential functions, even and odd symmetry, derivatives, integrals, identities, and inverse functions.",
  limits:
    "Limits, continuity, derivatives, algebraic rewriting, logarithms, and indeterminate forms.",
  "chapter-6-exam-questions":
    "Modules 6.5–6.8. Try each question before requesting any solution part.",
};
const times = {
  "exponential-growth-decay": "75–100 minutes",
  "inverse-trigonometric-functions": "75–100 minutes",
  "hyperbolic-functions": "90–120 minutes",
  limits: "75–100 minutes",
  "chapter-6-exam-questions": "60–90 minutes",
};

const ProjectedContent = ({ items = [] }) => (
  <>
    {items.map((item, index) =>
      item.kind === "math" ? (
        <MathDisplay key={index}>{item.value}</MathDisplay>
      ) : item.kind === "list" ? (
        <ul key={index}>
          {item.value.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      ) : item.kind === "comparison" ? (
        <div className="c6-comparison" key={index}>
          {item.value.map((row) => (
            <article key={row.label}>
              <strong>{row.label}</strong>
              <p>{row.characteristic || row.field}</p>
              <p>{row.behavior || row.complete}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className={item.kind === "callout" ? "c6-callout" : ""} key={index}>
          {item.value}
        </p>
      ),
    )}
  </>
);
const PracticeQuestion = ({ question }) =>
  question.sourceQuestion ? (
    <ExamQuestionView question={question} />
  ) : (
    <section id="c6-practice" className="c6-practice">
      <h3>{question.prompt}</h3>
      <ol type="A">
        {question.options?.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ol>
      <details>
        <summary>Hint and solution</summary>
        <p>
          {question.explanation ||
            `Correct answer: ${question.options?.[question.correctAnswer]}`}
        </p>
      </details>
    </section>
  );

export default function Chapter6LearningLibrary({ onBack }) {
  const [moduleId, setModuleId] = useState(moduleIds[0]),
    [completed, setCompleted] = useState(() =>
      JSON.parse(
        localStorage.getItem("interactive-calculus:chapter-6-library") || "{}",
      ),
    ),
    [aiOpen, setAiOpen] = useState(false),
    [question, setQuestion] = useState("");
  const lecture = useMemo(() => getLecture(moduleId), [moduleId]),
    kahootCollection = useMemo(() => getKahootCollectionForLecture(moduleId), [moduleId]),
    done = Object.values(completed).filter(Boolean).length,
    total = moduleIds.length;
  const markComplete = () => {
    const next = { ...completed, [moduleId]: true };
    setCompleted(next);
    localStorage.setItem(
      "interactive-calculus:chapter-6-library",
      JSON.stringify(next),
    );
  };
  return (
    <main className="chapter6-library">
      <nav>
        <button onClick={onBack}>← Calculus II</button>
        <strong>Chapter 6 Learning Library</strong>
        <span>
          {done}/{total} modules complete
        </span>
      </nav>
      <header>
        <p>Inverse Functions, Exponential and Logarithmic Functions</p>
        <h1>{labels[moduleId]}</h1>
        <p>{lecture.description}</p>
        <progress max={total} value={done}>
          {done}/{total}
        </progress>
      </header>
      <div className="c6-library-layout">
        <aside>
          {moduleIds.map((id) => (
            <button
              className={id === moduleId ? "active" : ""}
              onClick={() => {
                setModuleId(id);
                setAiOpen(false);
              }}
              key={id}
            >
              <span>{completed[id] ? "✓" : "○"}</span>
              {labels[id]}
            </button>
          ))}
        </aside>
        <div className="c6-library-content">
          {kahootCollection && <section className="c6-interactive-collection" aria-labelledby="kahoot-collection-title">
            <p>Kahoot / Interactive Questions</p>
            <h2 id="kahoot-collection-title">{kahootCollection.title}</h2>
            <p>{kahootCollection.description}</p>
            <p><strong>{kahootCollection.questions.length} reusable questions</strong> · optional practice and instructor-selected live checkpoints</p>
            {kahootCollection.questions.map((item,index)=><details className="c6-learning-card c6-type-live-question" key={item.id}><summary><span>{index+1}</span><strong>{item.prompt}</strong><small>{item.difficulty} · {item.timer} seconds</small></summary><PracticeQuestion question={item}/><p><strong>Learning objective:</strong> {item.learningObjective}</p><small>{item.sourceCollection}</small></details>)}
          </section>}
          <section className="c6-orientation">
            <article>
              <h2>Learning objectives</h2>
              <ul>
                {lecture.objectives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article>
              <h2>What should I already know?</h2>
              <p>{prerequisites[moduleId]}</p>
              <strong>Estimated study time: {times[moduleId]}</strong>
            </article>
          </section>
          <div className="c6-section-tabs" aria-label="Learning modes">
            {[
              "Learn",
              "Visualize",
              "Derive",
              "Examples",
              "Practice",
              "Common Mistakes",
              "Formula Summary",
              "Ask AI",
              "Mastery Check",
            ].map((item) => (
              <a
                href={`#c6-${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>
          <section id="c6-learn">
            <h2>Complete module</h2>
            <p>
              Work from top to bottom. Every original lecture item remains
              available; expandable cards keep the page readable without
              removing content.
            </p>
            {lecture.slides.map((slide, index) => (
              <details
                className={`c6-learning-card c6-type-${slide.type}`}
                open={index === 0}
                key={slide.id}
              >
                <summary>
                  <span>{index + 1}</span>
                  <strong>{slide.title}</strong>
                  <small>{slide.type.replaceAll("-", " ")}</small>
                </summary>
                <div>
                  <ProjectedContent items={slide.presentationContent} />
                  {(slide.visualization || slide.examQuestion) && (
                    <div className="c6-slide-preview">
                      <SlideCanvas slide={slide} />
                    </div>
                  )}
                  {slide.revealSteps?.length > 0 && (
                    <section id="c6-derive">
                      <h3>Progressive derivation / animation states</h3>
                      <ol>
                        {slide.revealSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </section>
                  )}
                  {slide.studentNotes?.length > 0 && (
                    <details>
                      <summary>Why this works · Complete explanation</summary>
                      {slide.studentNotes.map((note, noteIndex) => (
                        <article
                          className="c6-explanation"
                          key={`${note.title}-${noteIndex}`}
                        >
                          <h3>{note.title}</h3>
                          {note.math && <MathDisplay>{note.math}</MathDisplay>}
                          <p>{note.content}</p>
                        </article>
                      ))}
                    </details>
                  )}
                  {slide.question && (
                    <PracticeQuestion question={slide.question} />
                  )}
                </div>
              </details>
            ))}
          </section>
          <section id="c6-ask-ai" className="c6-ai">
            <h2>Ask AI about {labels[moduleId]}</h2>
            <button onClick={() => setAiOpen((value) => !value)}>
              {aiOpen ? "Close AI help" : "Ask AI about this topic"}
            </button>
            {aiOpen && (
              <div>
                <p>
                  The tutor context includes this module’s{" "}
                  {lecture.slides.length} slides, definitions, derivations,
                  examples, visualizations, questions, and instructor
                  explanations.
                </p>
                <label>
                  Your question
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Where did this formula come from? Why does this graph move that way?"
                  />
                </label>
                <p className="c6-ai-response">
                  {question
                    ? "AI question prepared with the complete module context. Connect the configured tutor service to generate the response."
                    : "Select an equation, visualization, or example and ask what you want explained."}
                </p>
              </div>
            )}
          </section>
          <section id="c6-mastery-check" className="c6-mastery">
            <h2>Mastery check</h2>
            <p>
              I can explain the central ideas, reconstruct the formulas, solve
              the examples without opening the solutions, interpret the visuals,
              and avoid the documented common mistakes.
            </p>
            <button onClick={markComplete}>
              {completed[moduleId]
                ? "Module completed ✓"
                : "Mark module complete"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
