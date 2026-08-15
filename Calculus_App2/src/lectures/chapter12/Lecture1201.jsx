import DimensionExplorer from '../../visualizations/DimensionExplorer'
import CoordinateSystem3D from '../../visualizations/CoordinateSystem3D'
import CoordinatePlanes3D from '../../visualizations/CoordinatePlanes3D'
import OctantExplorer from '../../visualizations/OctantExplorer'
import PointProjectionLab3D from '../../visualizations/PointProjectionLab3D'
import SphereExplorer3D from '../../visualizations/SphereExplorer3D'
import { MathDisplay, MathInline } from '../../components/MathDisplay'
import { ExitTicket, HintChallenge, MistakeCard, SphereQuestion, StepByStepSolution, WhyButton } from '../../components/LectureActivities'
import AudioNarrator from '../../components/AudioNarrator'
import { lecture1201Narration } from '../../data/lecture1201Narration'

function Lecture1201({ course, onHome, onChapterMenu }) {
  return (
    <div className="lecture-workspace">
      <nav className="lecture-toolbar" aria-label="Lecture navigation">
        <div>
          <button className="text-button" type="button" onClick={onHome}>Home</button>
          <button className="text-button" type="button" onClick={onChapterMenu}>Chapter Menu</button>
        </div>
        <span>Section 12.1 · Lecture 01</span>
      </nav>
      <div className="lecture-progress" aria-label="Lecture progress"><span /></div>

      <header className="lecture-hero">
        <div>
          <p className="eyebrow">{course} · Chapter 12</p>
          <p className="lecture-kicker">Vectors and the Geometry of Space</p>
          <h1>Three-Dimensional<br />Coordinate Systems</h1>
          <p>How does adding one number create an entirely new direction?</p>
        </div>
        <div className="lecture-index" aria-hidden="true">12.1</div>
      </header>

      <div className="lecture-audio-wrap"><AudioNarrator sections={lecture1201Narration} /></div>

      <section className="lesson-section">
        <div className="lesson-heading">
          <div><span>01</span><p>Opening · Visual intuition</p></div>
          <h2>From one dimension to three</h2>
          <p>A coordinate is not merely another number. Each independent coordinate gives a point a new way to move.</p>
        </div>

        <div className="intuition-card">
          <span className="card-label">Intuition</span>
          <h3>Degrees of freedom count independent choices.</h3>
          <p>On a number line, choosing <em>x</em> fixes the point. In a plane, <em>x</em> is not enough—we also choose <em>y</em>. In space, a third choice, <em>z</em>, moves the point above or below the plane.</p>
        </div>

        <DimensionExplorer />

        <aside className="connection-card">
          <span className="card-label">Connection</span>
          <div><h3>Why this matters</h3><p>Later, vectors will describe motion in these independent directions. Multivariable calculus will study quantities that change as any of these coordinates change.</p></div>
        </aside>
      </section>

      <section className="lesson-section coordinate-system-section">
        <div className="lesson-heading">
          <div><span>02</span><p>Concept development</p></div>
          <h2>The 3D coordinate system</h2>
          <p>Three number lines meet at one origin. Rotate the model and notice that the axes remain perpendicular even when perspective makes an angle look compressed on screen.</p>
        </div>
        <CoordinateSystem3D />
        <aside className="common-misconception">
          <span className="misconception-mark" aria-hidden="true">!</span>
          <div><span className="card-label">Visual caution</span><h3>Perspective changes appearance, not geometry.</h3><p>On a flat screen, the axes may not look like they meet at 90°. In the 3D model, each pair is still mathematically perpendicular.</p></div>
        </aside>
      </section>

      <section className="lesson-section">
        <div className="lesson-heading"><div><span>03</span><p>Visual intuition</p></div><h2>Coordinate planes</h2><p>Each pair of axes spans a flat surface. The unused coordinate must be zero.</p></div>
        <CoordinatePlanes3D />
        <div className="room-analogy"><span className="card-label">Classroom analogy</span><h3>Imagine the corner of a room</h3><div><p><b>Floor</b><MathInline>{'xy plane: z=0'}</MathInline></p><p><b>Side wall</b><MathInline>{'xz plane: y=0'}</MathInline></p><p><b>Back wall</b><MathInline>{'yz plane: x=0'}</MathInline></p></div></div>
        <WhyButton>On the <MathInline>{'xy'}</MathInline>-plane, a point can move in the <MathInline>{'x'}</MathInline> and <MathInline>{'y'}</MathInline> directions but has no height above or below the plane. Therefore <MathInline>{'z=0'}</MathInline>. The same reasoning applies to the other two planes.</WhyButton>
        <div className="example-card"><span className="card-label">Deck example · Surfaces and solids</span><h3>What surfaces are represented?</h3><MathDisplay>{String.raw`\text{(a) } z=3 \qquad \text{(b) } y=5`}</MathDisplay><StepByStepSolution steps={[String.raw`z=3\text{ fixes the height but leaves }x\text{ and }y\text{ free.}`, String.raw`z=3\text{ is a plane parallel to the }xy\text{-plane.}`, String.raw`y=5\text{ is a plane parallel to the }xz\text{-plane.}`]} /><p className="general-rule">In general: <MathInline>{'x=k'}</MathInline> is parallel to the <MathInline>{'yz'}</MathInline>-plane; <MathInline>{'y=k'}</MathInline> is parallel to <MathInline>{'xz'}</MathInline>; <MathInline>{'z=k'}</MathInline> is parallel to <MathInline>{'xy'}</MathInline>.</p></div>
      </section>

      <section className="lesson-section alternate-section">
        <div className="lesson-heading"><div><span>04</span><p>Concept development</p></div><h2>Octants and signs</h2><p>The three coordinate planes divide space into eight sign regions called octants. Only the first octant has a standard name students need here.</p></div>
        <OctantExplorer />
        <div className="definition-strip"><span>Definition</span><p>The <strong>first octant</strong> is the set of points satisfying</p><MathDisplay>{String.raw`x>0,\quad y>0,\quad z>0`}</MathDisplay></div>
      </section>

      <section className="lesson-section">
        <div className="lesson-heading"><div><span>05</span><p>Professor-guided example</p></div><h2>Plotting points in space</h2><p>An ordered triple <MathInline>{'P=(a,b,c)'}</MathInline> records position in the order <MathInline>{'x,y,z'}</MathInline>.</p></div>
        <div className="coordinate-meaning"><span><b>a</b>x-coordinate</span><span><b>b</b>y-coordinate</span><span><b>c</b>z-coordinate</span></div>
        <PointProjectionLab3D target={{x:-1,y:2,z:-3}} />
        <div className="example-grid"><div className="example-card"><span className="card-label">Professor demo A</span><MathDisplay>{'(-4,3,-5)'}</MathDisplay><StepByStepSolution steps={[String.raw`\text{Move }4\text{ units in the negative }x\text{-direction.}`, String.raw`\text{Move }3\text{ units parallel to positive }y.`, String.raw`\text{Move }5\text{ units parallel to negative }z.`]} /></div><div className="example-card"><span className="card-label">Professor demo B</span><MathDisplay>{'(3,-2,-6)'}</MathDisplay><StepByStepSolution steps={[String.raw`\text{Move }3\text{ units in positive }x.`, String.raw`\text{Move }2\text{ units parallel to negative }y.`, String.raw`\text{Move }6\text{ units parallel to negative }z.`]} /></div></div>
      </section>

      <section className="lesson-section alternate-section">
        <div className="lesson-heading"><div><span>06</span><p>Interactive exploration</p></div><h2>Projections and the rectangular box</h2><p>A point <MathInline>{'P=(a,b,c)'}</MathInline> determines a rectangular box. Dropping a perpendicular to a coordinate plane gives a projection.</p></div>
        <PointProjectionLab3D projectionMode />
        <div className="projection-formulas"><MathDisplay>{'P_{xy}=(a,b,0)'}</MathDisplay><MathDisplay>{'P_{yz}=(0,b,c)'}</MathDisplay><MathDisplay>{'P_{xz}=(a,0,c)'}</MathDisplay></div>
        <WhyButton>Projection keeps the two directions that lie within the chosen plane and removes perpendicular displacement. For the <MathInline>{'xy'}</MathInline>-plane, that removed displacement is the <MathInline>{'z'}</MathInline>-coordinate.</WhyButton>
      </section>

      <section className="lesson-section">
        <div className="lesson-heading"><div><span>07</span><p>Definitions and practice</p></div><h2>Distance in three dimensions</h2><p>Use the Pythagorean theorem twice: first for horizontal displacement, then include vertical displacement.</p></div>
        <div className="derivation-card"><div><span>Horizontal</span><MathDisplay>{'d_{xy}^2=(x_2-x_1)^2+(y_2-y_1)^2'}</MathDisplay></div><div><span>Add vertical</span><MathDisplay>{'d^2=d_{xy}^2+(z_2-z_1)^2'}</MathDisplay></div><div className="formula-final"><span>Distance formula</span><MathDisplay>{String.raw`d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}`}</MathDisplay></div></div>
        <div className="example-card"><span className="card-label">Deck example</span><h3>Distance from <MathInline>{'P(2,-1,7)'}</MathInline> to <MathInline>{'Q(1,-3,5)'}</MathInline></h3><StepByStepSolution steps={[String.raw`\Delta x=1-2=-1,\quad \Delta y=-3-(-1)=-2,\quad \Delta z=5-7=-2`, String.raw`d=\sqrt{(-1)^2+(-2)^2+(-2)^2}`, String.raw`d=\sqrt{1+4+4}=3`]} /></div>
        <HintChallenge title="Find the distance" prompt={String.raw`P_1=(-1,2,4),\quad P_2=(3,-1,4)`} answer="5" hints={['Compute each coordinate difference separately.','The z-coordinates are equal, so Δz = 0.']} solution={String.raw`d=\sqrt{(3+1)^2+(-1-2)^2+(4-4)^2}=\sqrt{16+9}=5`} />
      </section>

      <section className="lesson-section alternate-section">
        <div className="lesson-heading"><div><span>08</span><p>Concept development</p></div><h2>Spheres</h2><p>A sphere is the set of every point a fixed distance <MathInline>{'r'}</MathInline> from a center <MathInline>{'C=(a,b,c)'}</MathInline>.</p></div>
        <div className="derivation-card"><div><span>Fixed distance</span><MathDisplay>{String.raw`\sqrt{(x-a)^2+(y-b)^2+(z-c)^2}=r`}</MathDisplay></div><div className="formula-final"><span>Square both sides</span><MathDisplay>{'(x-a)^2+(y-b)^2+(z-c)^2=r^2'}</MathDisplay></div><p>If the center is the origin: <MathInline>{'x^2+y^2+z^2=r^2'}</MathInline>.</p></div>
        <SphereExplorer3D />
        <SphereQuestion />
        <div className="example-card"><span className="card-label">Deck example · Completing the square</span><h3>Write in standard form; find center and radius.</h3><MathDisplay>{'x^2+y^2+z^2+2x-6y-2z=14'}</MathDisplay><StepByStepSolution steps={['(x^2+2x)+(y^2-6y)+(z^2-2z)=14','(x^2+2x+1)+(y^2-6y+9)+(z^2-2z+1)=14+1+9+1','(x+1)^2+(y-3)^2+(z-1)^2=25', String.raw`C=(-1,3,1),\qquad r=5`]} /></div>
      </section>

      <section className="lesson-section">
        <div className="lesson-heading"><div><span>09</span><p>Error analysis</p></div><h2>Common mistakes</h2><p>Diagnosing a believable error builds stronger understanding than memorizing a warning.</p></div>
        <div className="mistake-grid"><MistakeCard title="Reading the center's sign" wrongWork={String.raw`(x+3)^2\Rightarrow a=3`} choices={['The center sign was not reversed','The expression should be expanded','The radius was squared']} answer="The center sign was not reversed" explanation="Since x+3=x-(-3), the x-coordinate of the center is −3." /><MistakeCard title="Projecting onto the xy-plane" wrongWork={String.raw`(a,b,c)\mapsto(a,0,c)`} choices={['The x-coordinate should be zero','The y-coordinate should be zero','The z-coordinate should be zero']} answer="The z-coordinate should be zero" explanation="The xy-plane is defined by z=0." /><MistakeCard title="Changing coordinate order" wrongWork={String.raw`(2,-3,4)\mapsto x=2,\ y=4,\ z=-3`} choices={['The y- and z-coordinates were swapped','Every sign must reverse','Coordinates should be alphabetized']} answer="The y- and z-coordinates were swapped" explanation="Ordered triples always follow x, y, z order." /></div>
      </section>

      <section className="lesson-section exit-section">
        <div className="lesson-heading"><div><span>10</span><p>Exit ticket · Summary</p></div><h2>Show what you know</h2><p>Answer all three before checking. Use the feedback to decide what to review.</p></div>
        <ExitTicket />
        <div className="objectives"><span className="card-label">Today you should be able to</span><ul><li>interpret a 3D coordinate system</li><li>identify coordinate planes</li><li>locate points in space</li><li>determine projections</li><li>calculate distance in <MathInline>{String.raw`\mathbb{R}^3`}</MathInline></li><li>interpret equations of spheres</li></ul></div>
      </section>

      <div className="next-section-preview"><p className="eyebrow">Next</p><h2>12.2 Vectors</h2><p>Magnitude, direction, components, and vector operations.</p></div>
    </div>
  )
}

export default Lecture1201
