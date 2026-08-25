const note=(type,title,content,math)=>({type,title,content,...(math?{math}:{})})
// CALCULUS III LIVE PRESENTATIONS: 12.1, 12.2, AND 12.3
// Edit the `slides` array inside chapter121Lecture, chapter122Lecture, or chapter123Lecture.
const slide=(id,type,title,content=[],options={})=>({id,type,title,presentationContent:content,presenterNotes:options.presenterNotes||[],studentNotes:options.studentNotes||[],revealSteps:options.revealSteps||[],layoutMode:'slide',theme:'classic-math',level:options.level||'essential',courses:['calc2','calc3'],recommendedFor:['calc2','calc3'],visualization:options.visualization,question:options.question,solutionFor:options.solutionFor})
const text=(value)=>({kind:'text',value}), math=(value,options={})=>({kind:'math',value,...options}), list=(value)=>({kind:'list',value}), callout=(value)=>({kind:'callout',value})
const viz=(id,title,stage,content=[],options={})=>slide(id,'visualization',title,content,{...options,visualization:`chapter12:${stage}`})
const check=(id,title,prompt,options,correctAnswer,content=[])=>slide(id,'live-question',title,content,{question:{type:'multiple-choice',prompt,options,correctAnswer},presenterNotes:[note('answer','Debrief',`Correct answer: ${options[correctAnswer]}`)]})

export const chapter121Lecture={
  id:'chapter-12-1',title:'12.1 Three-Dimensional Coordinate Systems',course:'Calculus III',chapter:'Chapter 12',section:'12.1',status:'ready',sourceCodeAlwaysWins:true,
  description:'Build three-dimensional space from dimensions, then connect points, planes, projections, distance, surfaces, and spheres.',
  objectives:['Orient and plot in a right-handed 3D coordinate system.','Interpret coordinate planes, octants, projections, and equations in space.','Derive and apply distance and sphere equations.'],
  slides:[
    slide('c121-opening','title','How does one extra number create a new direction?',[{kind:'eyebrow',value:'12.1 Â· Vectors and the Geometry of Space'},callout('Today we build the geometric foundation for planes, distances, forces, and motion.')],{presenterNotes:[note('opening','Quick recall','Ask: how many numbers locate a point on a line, in a plane, and in space?')] }),
    viz('c121-dimensions','R â†’ RÂ² â†’ RÂ³','dimensions',[list(['â„: one coordinate, one degree of freedom','â„Â²: ordered pairs (x,y)','â„Â³: ordered triples (x,y,z)'])],{presenterNotes:[note('teaching','Key language','Each independent coordinate adds a degree of freedom.')] }),
    viz('c121-axes','A right-handed coordinate system','axes',[callout('The x-, y-, and z-axes are mutually perpendicular.')],{presenterNotes:[note('demo','Right-hand rule','Curl fingers from +x toward +y; the thumb points toward +z. Orientation fixes what positive z means.')] }),
    viz('c121-planes','Three coordinate planes','planes',[math(String.raw`xy:\ z=0\qquad xz:\ y=0\qquad yz:\ x=0`)]),
    check('c121-plane-check','Which plane?','Which coordinate plane contains (0,5,-4)?',['xy-plane','xz-plane','yz-plane','none'],2,[math(String.raw`(0,5,-4)`)]),
    viz('c121-octants','Eight rooms meet at the origin','octants',[text('The coordinate planes divide space into eight octants.'),math(String.raw`\text{First octant: }x>0,\ y>0,\ z>0`)]),
    viz('c121-point','Plot a point by coordinated movement','point',[math(String.raw`P=(-4,3,-5)`)],{presenterNotes:[note('demo','Physical path','From the origin move âˆ’4 in x, +3 parallel to y, and âˆ’5 parallel to z. The route may vary; the endpoint does not.')] }),
    viz('c121-projection','Projection removes one perpendicular component','projection',[math(String.raw`P_{xy}=(a,b,0),\quad P_{xz}=(a,0,c),\quad P_{yz}=(0,b,c)`)]),
    check('c121-projection-check','Projection check','What is the projection of (3,-2,6) onto the xz-plane?',['(3,-2,0)','(3,0,6)','(0,-2,6)','(3,0,0)'],1),
    viz('c121-equations','The meaning of an equation depends on dimension','surfaces',[math(String.raw`x=3`),list(['In â„: a point','In â„Â²: a vertical line','In â„Â³: a plane parallel to the yz-plane'])]),
    viz('c121-cylinder','A missing variable is free','cylinder',[math(String.raw`x^2+y^2=4`),callout('Because z is unrestricted, the circle extends into a circular cylinder of radius 2 about the z-axis.')]),
    viz('c121-distance','Derive distance with Pythagoras twice','distance',[math(String.raw`d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}`)],{revealSteps:['Horizontal displacement','Vertical displacement','Combine the squares','Take the nonnegative square root']}),
    slide('c121-triangle','worked-example','Classify triangle PQR',[math(String.raw`P=(7,-1,2),\ Q=(9,0,4),\ R=(10,-2,2)`),math(String.raw`|PQ|=3,\quad |QR|=3,\quad |RP|=\sqrt{10}`),callout('It is isosceles, but not right.')],{presenterNotes:[note('solution','Check','Squared lengths are 9, 9, and 10; no pair sums to the third.')] }),
    viz('c121-sphere','A sphere is a fixed-distance surface','sphere',[math(String.raw`(x-h)^2+(y-k)^2+(z-\ell)^2=r^2`)]),
    slide('c121-sphere-example','worked-example','Complete the square',[math(String.raw`x^2+y^2+z^2+10x-6y+4z+29=0`),math(String.raw`(x+5)^2+(y-3)^2+(z+2)^2=9`),callout('Center (âˆ’5,3,âˆ’2); radius 3.')],{revealSteps:['Group variables','Complete each square','Balance the equation','Read center and radius']}),
    check('c121-region','Solid-region check','What does 1â‰¤xÂ²+yÂ²+zÂ²â‰¤4 with zâ‰¤0 describe?',['A solid lower hemisphere','A lower half-shell between radii 1 and 2','A disk of radius 2','A full spherical shell'],1),
    slide('c121-plane-intersections','worked-example','Intersect a sphere with coordinate planes',[math(String.raw`(x-3)^2+(y+7)^2+(z-4)^2=25`),math(String.raw`xy:\ (x-3)^2+(y+7)^2=9`),math(String.raw`xz:\ (x-3)^2+(z-4)^2=-24\Rightarrow\mathrm{DNE}`),math(String.raw`yz:\ (y+7)^2+(z-4)^2=16`)],{presenterNotes:[note('accuracy','Interpretation','Substitute z=0, y=0, or x=0. A negative squared-radius means there is no real intersection.')] }),
    slide('c121-summary','summary','Space has structure',[list(['Coordinates locate points; vectors will describe movement.','Setting one coordinate constant creates a plane.','A missing variable remains free.','Distance drives the equation of a sphere.']),callout('Next: turn displacement into vector algebra.')])
  ]
}

export const chapter122Lecture={
  id:'chapter-12-2',title:'12.2 Vectors',course:'Calculus III',chapter:'Chapter 12',section:'12.2',status:'ready',sourceCodeAlwaysWins:true,description:'Develop vectors as movable directed displacements, then calculate with components and unit vectors.',
  objectives:['Distinguish points, scalars, and vectors.','Perform vector operations geometrically and component-wise.','Find displacement, magnitude, position, basis, and unit vectors.'],
  slides:[
    slide('c122-opening','title','Points are locations. Vectors are movements.',[{kind:'eyebrow',value:'12.2 · Magnitude and direction'},{kind:'comparison',value:[{label:'Point',formula:'P(x,y,z)',characteristic:'Fixed location in space',behavior:'Position relative to the origin; cannot be translated.'},{label:'Vector',formula:'\\mathbf v=\\langle v_1,v_2,v_3\\rangle',characteristic:'Displacement or movement',behavior:'Magnitude (length) and direction; a free vector can be translated anywhere.'}]},callout('A vector is determined by magnitude and direction—not by where it is drawn.')],{presenterNotes:[note('contrast','Point versus vector','A point identifies a fixed location. A vector records a change in coordinates, so translating the arrow without rotating or resizing it produces an equivalent vector.'),note('notation','Notation consistency','Use bold vector notation such as \\mathbf v throughout projected mathematics; reserve ordinary italic letters for scalars.')] }),
    viz('c122-equivalent','A vector can slide without changing','equivalent-vectors',[math(String.raw`\mathbf v=\langle3,2\rangle`),text('Every displayed arrow has the same length and direction.')]),
    slide('c122-notation','definition','Read the notation precisely',[math(String.raw`\vec a\text{ or }\mathbf a:\ \text{vector}\qquad \hat a:\ \text{unit vector}\qquad a:\ \text{scalar}`),callout('Context and typography matter: a vector is not the same object as its magnitude.')]),
    viz('c122-addition','Vector addition is tip-to-tail','addition',[math(String.raw`\mathbf u+\mathbf v`),text('The parallelogram diagonal and the tip-to-tail resultant are the same vector.')],{revealSteps:['Show u','Translate v to the tip of u','Draw the resultant','Complete the parallelogram']}),
    viz('c122-scaling','Scalar multiplication stretches or reverses','scaling',[math(String.raw`c\mathbf v`),list(['c>0: same direction','c<0: opposite direction','|c| changes the length'])]),
    slide('c122-components','definition','Components turn geometry into algebra',[math(String.raw`\langle a_1,a_2,a_3\rangle`),math(String.raw`\overrightarrow{AB}=\langle x_2-x_1,y_2-y_1,z_2-z_1\rangle`),callout('Terminal minus initial.')]),
    slide('c122-ab-example','worked-example','Vector from A to B',[math(String.raw`A=(-2,2),\quad B=(3,4)`),math(String.raw`\overrightarrow{AB}=\langle3-(-2),4-2\rangle=\langle5,2\rangle`)]),
    slide('c122-operations','property','Operate component by component',[math(String.raw`\mathbf a+\mathbf b=\langle a_1+b_1,a_2+b_2,a_3+b_3\rangle`),math(String.raw`c\mathbf a=\langle ca_1,ca_2,ca_3\rangle`),math(String.raw`\|\mathbf a\|=\sqrt{a_1^2+a_2^2+a_3^2}`)]),
    slide('c122-computation','worked-example','Combine vectors and compare lengths',[math(String.raw`\mathbf a=\langle2,1,-2\rangle,\quad\mathbf b=\langle8,-2,1\rangle`),math(String.raw`\mathbf a+\mathbf b=\langle10,-1,-1\rangle`),math(String.raw`4\mathbf a+2\mathbf b=\langle24,0,-6\rangle`),math(String.raw`\|\mathbf a\|=3,\quad\|\mathbf a-\mathbf b\|=\sqrt{54}=3\sqrt6`)],{revealSteps:['Add a+b','Compute 4a','Compute 2b and add','Find both magnitudes']}),
    viz('c122-basis','The standard basis builds every vector','basis',[math(String.raw`\mathbf i=\langle1,0,0\rangle,\ \mathbf j=\langle0,1,0\rangle,\ \mathbf k=\langle0,0,1\rangle`),math(String.raw`\langle a_1,a_2,a_3\rangle=a_1\mathbf i+a_2\mathbf j+a_3\mathbf k`)]),
    viz('c122-unit','Normalize to keep direction only','unit-vector',[math(String.raw`\hat{\mathbf a}=\frac{\mathbf a}{\|\mathbf a\|}`)]),
    slide('c122-unit-example','worked-example','Unit vector in a given direction',[math(String.raw`\mathbf a=4\mathbf i-\mathbf j+8\mathbf k`),math(String.raw`\|\mathbf a\|=\sqrt{16+1+64}=9`),math(String.raw`\hat{\mathbf a}=\left\langle\frac49,-\frac19,\frac89\right\rangle`)]),
    viz('c122-projectile','Resolve velocity into components','angle-components',[math(String.raw`\mathbf v=\langle v\cos\theta,v\sin\theta\rangle`),math(String.raw`v=50,\ \theta=55^\circ\Rightarrow\langle28.7,41.0\rangle\text{ ft/s}`)]),
    slide('c122-tangent','application','Tangent and normal unit vectors',[math(String.raw`y=8\sin x,\quad y'=8\cos x`),math(String.raw`x=\pi/6:\ \mathbf t=\langle1,4\sqrt3\rangle`),math(String.raw`\hat{\mathbf t}=\pm\frac{\langle1,4\sqrt3\rangle}{7},\qquad \hat{\mathbf n}=\pm\frac{\langle-4\sqrt3,1\rangle}{7}`)],{presenterNotes:[note('accuracy','Why denominator 7','The tangent direction has magnitude √(1+48)=7.')] }),
    check('c122-check','Concept check','Which operation produces a unit vector in the direction of nonzero v?',['Multiply by â€–vâ€–','Divide v by â€–vâ€–','Subtract â€–vâ€–','Divide â€–vâ€– by v'],1),
    slide('c122-laws','property','Vector operations obey familiar laws',[math(String.raw`\mathbf a+\mathbf b=\mathbf b+\mathbf a`),math(String.raw`(\mathbf a+\mathbf b)+\mathbf c=\mathbf a+(\mathbf b+\mathbf c)`),math(String.raw`r(\mathbf a+\mathbf b)=r\mathbf a+r\mathbf b`),math(String.raw`(r+s)\mathbf a=r\mathbf a+s\mathbf a`)]),
    slide('c122-equilibrium','application','Forces in equilibrium',[math(String.raw`\mathbf T_1+\mathbf T_2+\mathbf W=\mathbf0`),text('For a symmetric hanging chain, horizontal tension components cancel and the two upward vertical components balance its weight.'),callout('A numerical weight requires the angles from the missing diagram; tension magnitude alone is not enough.')],{presenterNotes:[note('accuracy','Do not invent missing data','The pasted problem names 25 N tensions but its figure/angles are absent, so no unique numerical answer can be verified.')] }),
    slide('c122-summary','summary','Vector algebra preserves geometry',[list(['Components record directional change.','Add, subtract, and scale component-wise.','Magnitude is the distance formula.','Unit vectors encode direction without size.']),callout('Next: measure how strongly two directions align.')])
  ]
}

export const chapter123Lecture={
  id:'chapter-12-3',title:'12.3 Dot Product',course:'Calculus III',chapter:'Chapter 12',section:'12.3',status:'ready',sourceCodeAlwaysWins:true,description:'Interpret the dot product as alignment and use it for angles, orthogonality, direction cosines, projections, and work.',
  objectives:['Compute and geometrically interpret dot products.','Find angles, test orthogonality, and calculate direction cosines.','Compute scalar/vector projections and work.'],
  slides:[
    slide('c123-opening','title','12.3 Dot Product (Alignmet & Meaning)',[{kind:'eyebrow',value:'Why we need it?'},callout('The dot product turns two vectors into one scalar that measures directional alignment.')]),
    slide('c123-definition','definition','Component definition',[math(String.raw`\mathbf a\cdot\mathbf b=a_1b_1+a_2b_2+a_3b_3`),callout('Multiply corresponding components, then add.')]),
    slide('c123-example','worked-example','Compute a dot product',[math(String.raw`\mathbf a=\langle4,1,\tfrac13\rangle,\quad\mathbf b=\langle7,-2,-6\rangle`),math(String.raw`\mathbf a\cdot\mathbf b=28-2-2=24`)]),
    viz('c123-alignment','Cosine measures alignment','dot-alignment',[math(String.raw`\mathbf a\cdot\mathbf b=\|\mathbf a\|\|\mathbf b\|\cos\theta`),list(['positive: acute angle','zero: perpendicular','negative: obtuse angle'])]),
    check('c123-sign','Predict before calculating','If aÂ·b<0, what must be true about the angle between nonzero a and b?',['It is acute','It is 90Â°','It is obtuse','The vectors are parallel'],2),
    slide('c123-magnitude-angle','worked-example','Use magnitudes and the included angle',[math(String.raw`\|\mathbf a\|=60,\quad\|\mathbf b\|=30,\quad\theta=\frac{3\pi}{4}`),math(String.raw`\mathbf a\cdot\mathbf b=60(30)\cos\frac{3\pi}{4}=-900\sqrt2`)]),
    slide('c123-angle','worked-example','Find the angle between vectors',[math(String.raw`\mathbf a=\langle4,-1,8\rangle,\quad\mathbf b=\langle0,12,6\rangle`),math(String.raw`\cos\theta=\frac{36}{9(6\sqrt5)}=\frac{2}{3\sqrt5}`),math(String.raw`\theta\approx72.7^\circ\approx73^\circ`)]),
    viz('c123-orthogonal','Orthogonality is zero alignment','orthogonality',[math(String.raw`\mathbf a\perp\mathbf b\iff\mathbf a\cdot\mathbf b=0`)]),
    slide('c123-classify','worked-example','Orthogonal, parallel, or neither?',[math(String.raw`\langle-6,4,-7\rangle\cdot\langle4,4,-1\rangle=-1`),callout('Not zero and not scalar multiples: neither.'),math(String.raw`\langle15,-12,9\rangle=-\tfrac32\langle-10,8,-6\rangle`),callout('Parallel, opposite directions.')]),
    viz('c123-direction','Direction cosines are normalized components','direction-cosines',[math(String.raw`\cos\alpha=\frac{a_1}{\|\mathbf a\|},\quad\cos\beta=\frac{a_2}{\|\mathbf a\|},\quad\cos\gamma=\frac{a_3}{\|\mathbf a\|}`),math(String.raw`\hat{\mathbf a}=\langle\cos\alpha,\cos\beta,\cos\gamma\rangle`)]),
    slide('c123-identity','live-question','Kahoot Challenge: Direction Cosines',[math(String.raw`\mathbf a=\langle2,-3,6\rangle`),text('Which ordered triple gives the direction cosines of a?'),callout('Submit from your device. A correct answer earns more points when it is submitted faster.')],{question:{type:'multiple-choice',prompt:'For a = <2,-3,6>, which ordered triple gives the direction cosines?',options:['<2/7, -3/7, 6/7>','<2/49, -3/49, 6/49>','<2/sqrt(13), -3/sqrt(13), 6/sqrt(13)>','<2, -3, 6>'],correctAnswer:0,timer:60,scoring:'speed',topic:'12.3 Direction Cosines',explanation:'The magnitude is 7, so divide every component by 7.'},presenterNotes:[note('timing','Kahoot-style scoring','Open the question for 60 seconds. Correct answers earn 500–1000 points; faster correct submissions earn more.'),note('answer','Do not reveal early','Correct choice: <2/7,-3/7,6/7>. Move to the next slide for the complete solution.')] }),
    slide('c123-projection','solution','Complete Solution: Direction Cosines',[math(String.raw`\|\mathbf a\|=\sqrt{2^2+(-3)^2+6^2}=\sqrt{49}=7`),math(String.raw`\cos\alpha=\frac{2}{7},\qquad\cos\beta=-\frac{3}{7},\qquad\cos\gamma=\frac{6}{7}`),math(String.raw`\left\langle\cos\alpha,\cos\beta,\cos\gamma\right\rangle=\left\langle\frac27,-\frac37,\frac67\right\rangle`),math(String.raw`\left(\frac27\right)^2+\left(-\frac37\right)^2+\left(\frac67\right)^2=\frac{4+9+36}{49}=1`),callout('Correct answer: ⟨2/7, −3/7, 6/7⟩. The sum-of-squares check confirms that this is a unit vector.')],{solutionFor:'c123-identity',presenterNotes:[note('solution','Complete reasoning','Compute the magnitude, divide each component by 7, and verify that the squared direction cosines sum to 1.'),note('mistake','Common mistake','Do not divide by 49. Direction cosines use the magnitude ||a||, not ||a||².')] }),
    slide('c123-projection-example','worked-example','Project b onto a',[math(String.raw`\mathbf a=\langle1,3,4\rangle,\quad\mathbf b=\langle7,0,-1\rangle`),math(String.raw`\mathbf a\cdot\mathbf b=3,\quad\|\mathbf a\|=\sqrt{26}`),math(String.raw`\operatorname{comp}_{\mathbf a}\mathbf b=\frac{3}{\sqrt{26}}`),math(String.raw`\operatorname{proj}_{\mathbf a}\mathbf b=\frac{3}{26}\langle1,3,4\rangle`)]),
    viz('c123-work','Only force along displacement does work','work',[math(String.raw`W=\mathbf F\cdot\mathbf d=\|\mathbf F\|\|\mathbf d\|\cos\theta`),list(['Î¸=0Â°: maximum positive work','Î¸=90Â°: zero work','Î¸>90Â°: negative work'])]),
    slide('c123-work-example','application','Pulling a wagon',[math(String.raw`\|\mathbf F\|=50\text{ N},\quad \|\mathbf d\|=12\text{ m},\quad\theta=30^\circ`),math(String.raw`W=50(12)\cos30^\circ=300\sqrt3\text{ J}\approx519.6\text{ J}`)]),
    check('c123-work-check','Work check','You carry a box horizontally at constant height. What work does your upward supporting force do?',['Positive','Negative','Zero','Cannot be determined'],2),
    slide('c123-summary','summary','One geometry, three views',[list(['Dot product measures alignment.','Direction cosines compare a vector with the coordinate axes.','Projection extracts the aligned part.','Work measures force aligned with displacement.']),callout('The dot product is how mathematics measures useful direction.')])
  ]
}

export const chapter124Lecture = {
  id: 'chapter-12-4',
  title: '12.4 Cross Product',
  course: 'Calculus III',
  chapter: 'Chapter 12',
  section: '12.4',
  status: 'ready',
  sourceCodeAlwaysWins: true,

  description:
    'Understand the cross product geometrically and algebraically, compute cross products, determine direction with the right-hand rule, find perpendicular vectors, calculate areas, find normal vectors, and apply the cross product to torque and geometric problems.',

  objectives: [
    'Understand the geometric meaning of the cross product.',
    'Compute the cross product of two vectors in three-dimensional space.',
    'Use the right-hand rule to determine the direction of a cross product.',
    'Determine when two vectors are parallel using the cross product.',
    'Use the magnitude of a cross product to find areas of parallelograms and triangles.',
    'Find vectors perpendicular to two given vectors.',
    'Use cross products to find normal vectors to planes.',
    'Apply the cross product to physical applications such as torque.'
  ],

  slides: [

  // ============================================================
  // OPENING
  // ============================================================

  slide(
    'c124-opening',
    'title',
    '12.4 Cross Product — Direction, Area & Perpendicularity',
    [
      {
        kind: 'eyebrow',
        value: 'From alignment to perpendicularity'
      },

      callout(
        'The dot product tells us how much two vectors point in the SAME direction. The cross product gives us a vector that points PERPENDICULAR to both.'
      ),

      math(
        String.raw`\displaystyle \mathbf a\cdot\mathbf b\;\longrightarrow\;\text{scalar}`
      ),

      math(
        String.raw`\displaystyle \mathbf a\times\mathbf b\;\longrightarrow\;\text{vector}`
      )
    ],
    {
      presenterNotes: [
        note(
          'connection',
          'Connect to Section 12.3',
          'Students already know the dot product. Begin by contrasting the two operations: dot product gives a scalar; cross product gives a vector.'
        ),
        note(
          'question',
          'Opening question',
          'Ask: If I give you two vectors in space, how could we construct a third vector perpendicular to BOTH of them?'
        )
      ]
    }
  ),

  // ============================================================
  // WHY CROSS PRODUCT?
  // ============================================================

  slide(
    'c124-why',
    'concept',
    'Why Do We Need the Cross Product?',
    [
      text(
        'Suppose two vectors lie in the same plane. Sometimes we need a vector that points perpendicular to that entire plane.'
      ),

      math(
        String.raw`\mathbf a\cdot\mathbf b=\text{scalar}`
      ),
      math(
        String.raw`\mathbf{a}\times\mathbf{b}=\mathbf{n}, \qquad \mathbf{n}\perp\mathbf{a},\qquad\mathbf{n}\perp\mathbf{b}`
      ),

      callout(
        'The new vector n supplies the perpendicular direction that the dot product cannot provide.'
      ),

      list([
        'Finding a normal vector to a plane',
        'Finding areas of parallelograms and triangles',
        'Determining whether vectors are parallel',
        'Computing torque in physics',
        'Describing orientation in three-dimensional space'
      ])
    ]
  ),

  // ============================================================
  // GEOMETRIC DEFINITION
  // ============================================================

  viz(
    'c124-geometric',
    'Geometric Meaning of the Cross Product',
    'cross-product-geometry',
    [
      math(
        String.raw`\boxed{
        \|\mathbf a\times\mathbf b\|
        =
        \|\mathbf a\|\|\mathbf b\|\sin\theta
        }`
      ),

      text(
        'The magnitude tells us how strongly the vectors spread apart.'
      ),

      callout(
        'Direction: perpendicular to both vectors. Magnitude: area of the parallelogram formed by the vectors.'
      )
    ]
  ),

  // ============================================================
  // DOT VS CROSS
  // ============================================================

  slide(
    'c124-dot-vs-cross',
    'comparison',
    'Dot Product vs. Cross Product',
    [
      math(
        String.raw`\Large \mathbf{a}\cdot\mathbf{b}=\mathbf{0},  \qquad \mathbf{b}\perp\mathbf{a}`
      ),
      callout(
        'DOT PRODUCT: produces a SCALAR and measures alignment.'
      ),

      math(
        String.raw`\Large \mathbf{a}\times\mathbf{b}=\mathbf{n},  \qquad \mathbf{n}\perp\mathbf{a}, \qquad \mathbf{n}\perp\mathbf{b}`
      ),

      callout(
        'CROSS PRODUCT: produces a VECTOR perpendicular to both vectors; its magnitude measures area.'
      ),

      list([
        'Dot product → cosine → alignment',
        'Cross product → sine → perpendicularity and area'
      ])
    ]
  ),

  // ============================================================
  // COMPONENT DEFINITION
  // ============================================================

  slide(
    'c124-definition',
    'definition',
    'Computing the Cross Product',
    [
      math(
        String.raw` \Large \mathbf a = \langle a_1,a_2,a_3\rangle, \qquad
       \Large \mathbf b = \langle b_1,b_2,b_3\rangle`
      ),


      math(
        String.raw` \Large \mathbf a\times\mathbf b = \left\langle a_2b_3-a_3b_2,\; a_3b_1-a_1b_3,\; a_1b_2-a_2b_1 \right\rangle`
      ),


      callout(
        'Compute one component at a time. The result is a vector perpendicular to both a and b.'
      )
    ],
    {
      presenterNotes: [
        note(
          'background',
          'Required background',
          'Present the component formula first. The next slide explains the determinant notation and why its vertical bars are not absolute-value bars.'
        )
      ]
    }
  ),

  // ============================================================
  // DETERMINANT EXPANSION
  // ============================================================

  slide(
    'c124-expansion',
    'derivation',
    'Expand the Determinant Carefully',
    [
      math(
        String.raw`\Large \displaystyle \mathbf{a}\times\mathbf{b}
        =\begin{array}{|ccc|}
        \hat{\mathbf{i}}&\hat{\mathbf{j}}&\hat{\mathbf{k}}\\
        a_1&a_2&a_3\\
        b_1&b_2&b_3
        \end{array}
        =\hat{\mathbf{i}}\begin{array}{|cc|}a_2&a_3\\b_2&b_3\end{array}
        -\hat{\mathbf{j}}\begin{array}{|cc|}a_1&a_3\\b_1&b_3\end{array}
        +\hat{\mathbf{k}}\begin{array}{|cc|}a_1&a_2\\b_1&b_2\end{array}`,
        { spaceAfter: 28 }
      ),

      math(
        String.raw`\Large \displaystyle
        =\underbrace{(a_2b_3-a_3b_2)}_{\mathbf{i}\text{-component}}\hat{\mathbf{i}}
        +\underbrace{(a_3b_1-a_1b_3)}_{\mathbf{j}\text{-component}}\hat{\mathbf{j}}
        +\underbrace{(a_1b_2-a_2b_1)}_{\mathbf{k}\text{-component}}\hat{\mathbf{k}}`,
        { spaceAfter: 18 }
      ),

      math(
        String.raw`\Large \boxed{\mathbf{a}\times\mathbf{b}
        =\left\langle
        a_2b_3-a_3b_2,\;
        a_3b_1-a_1b_3,\;
        a_1b_2-a_2b_1
        \right\rangle}`,
        { spaceAfter: 12 }
      ),

      callout(
        'Component definition: the three labeled coefficients become the first, second, and third components of the answer. Expand across the first row using the sign pattern +, −, +.'
      )
    ]
  ),

  // ============================================================
  // FIRST WORKED EXAMPLE
  // ============================================================

  slide(
    'c124-example1',
    'worked-example',
    'Example 1: Compute a Cross Product',
    [
      math(
        String.raw`\mathbf a=\langle2,3,-1\rangle,
        \qquad
        \mathbf b=\langle1,-2,4\rangle`
      ),

      math(
        String.raw`\mathbf a\times\mathbf b
        =
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        2&3&-1\\
        1&-2&4
        \end{array}`
      ),

      math(
        String.raw`=
        \mathbf i
        \begin{array}{|cc|}
        3&-1\\
        -2&4
        \end{array}
        -
        \mathbf j
        \begin{array}{|cc|}
        2&-1\\
        1&4
        \end{array}
        +
        \mathbf k
        \begin{array}{|cc|}
        2&3\\
        1&-2
        \end{array}`
      ),

      math(
        String.raw`=
        \mathbf i(12-2)
        -
        \mathbf j(8+1)
        +
        \mathbf k(-4-3)`
      ),

      math(
        String.raw`\boxed{
        \mathbf a\times\mathbf b
        =
        \langle10,-9,-7\rangle
        }`
      )
    ]
  ),

  // ============================================================
  // VERIFY PERPENDICULAR
  // ============================================================

  slide(
    'c124-check-perpendicular',
    'worked-example',
    'How Do We Know the Answer Is Perpendicular?',
    [
      text(
        'A vector is perpendicular to another vector when their dot product is zero.'
      ),

      math(
        String.raw`(\mathbf a\times\mathbf b)\cdot\mathbf a`
      ),

      math(
        String.raw`=
        \langle10,-9,-7\rangle
        \cdot
        \langle2,3,-1\rangle`
      ),

      math(
        String.raw`=20-27+7=0`
      ),

      math(
        String.raw`(\mathbf a\times\mathbf b)\cdot\mathbf b`
      ),

      math(
        String.raw`=
        10+18-28=0`
      ),

      callout(
        'The cross product is perpendicular to BOTH original vectors.'
      )
    ]
  ),

  // ============================================================
  // RIGHT HAND RULE
  // ============================================================

  viz(
    'c124-right-hand',
    'Which Direction Does the Cross Product Point?',
    'right-hand',
    [
      list([
        'Point the fingers of your right hand in the direction of a.',
        'Curl your fingers toward b through the smaller angle.',
        'Your thumb points in the direction of a × b.'
      ]),

      callout(
        'ORDER MATTERS: reversing the vectors reverses the direction.'
      )
    ]
  ),

  // ============================================================
  // ANTI-COMMUTATIVE
  // ============================================================

  slide(
    'c124-order',
    'property',
    'Order Matters!',
    [
      math(
        String.raw`\boxed{
        \mathbf b\times\mathbf a
        =
        -(\mathbf a\times\mathbf b)
        }`
      ),

      math(
        String.raw`\mathbf a\times\mathbf b
        =
        \langle10,-9,-7\rangle`
      ),

      math(
        String.raw`\mathbf b\times\mathbf a
        =
        \langle-10,9,7\rangle`
      ),

      callout(
        'The magnitude stays the same, but the direction reverses.'
      )
    ]
  ),

  // ============================================================
  // KAHOOT 1
  // ============================================================

  slide(
    'c124-kahoot1',
    'live-question',
    'Kahoot Challenge: Cross Product Direction',
    [
      text(
        'If a × b points upward, what direction does b × a point?'
      ),

      callout(
        'Think about what happens when the order of a cross product is reversed.'
      )
    ],
    {
      question: {
        type: 'multiple-choice',
        prompt:
          'If a × b points upward, what direction does b × a point?',
        options: [
          'Upward',
          'Downward',
          'Same direction as a',
          'Same direction as b'
        ],
        correctAnswer: 1,
        timer: 45,
        scoring: 'speed',
        topic: '12.4 Cross Product'
      },

      presenterNotes: [
        note(
          'answer',
          'Do not reveal early',
          'Correct answer: Downward. Reversing the order reverses the direction.'
        )
      ]
    }
  ),

  // ============================================================
  // KAHOOT SOLUTION
  // ============================================================

  slide(
    'c124-kahoot1-solution',
    'solution',
    'Solution: Why Does the Direction Reverse?',
    [
      math(
        String.raw`\mathbf b\times\mathbf a
        =
        -(\mathbf a\times\mathbf b)`
      ),

      text(
        'Multiplication by −1 reverses the direction of a vector.'
      ),

      callout(
        'Therefore, if a × b points upward, b × a points downward.'
      )
    ],
    {
      solutionFor: 'c124-kahoot1'
    }
  ),

  // ============================================================
  // PARALLEL VECTORS
  // ============================================================

  viz(
    'c124-parallel',
    'What Happens When the Vectors Are Parallel?',
    'cross-product-parallel',
    [
      math(
        String.raw`\|\mathbf a\times\mathbf b\|
        =
        \|\mathbf a\|\|\mathbf b\|\sin\theta; 
        \boxed{
        \mathbf a\times\mathbf b=\mathbf 0
        }`
      ),

      math(
        String.raw`\theta=0
        \quad\text{or}\quad
        \theta=\pi;
        \sin0=\sin\pi=0`
      ),


      callout(
        'For nonzero vectors: a × b = 0 exactly when a and b are parallel.'
      )
    ]
  ),

  // ============================================================
  // AREA
  // ============================================================

  viz(
    'c124-area',
    'Cross Product and Area',
    'cross-area',
    [
      math(
        String.raw`\boxed{
        A_{\text{parallelogram}}
        =
        \|\mathbf a\times\mathbf b\|
        }`
      ),

      text(
        'Why? The usual area formula is base × height.'
      ),

      math(
        String.raw`\text{base}=\|\mathbf a\|`
      ),

      math(
        String.raw`\text{height}=\|\mathbf b\|\sin\theta`
      ),

      math(
        String.raw`A
        =
        \|\mathbf a\|
        \|\mathbf b\|\sin\theta`
      ),

      callout(
        'That is exactly the magnitude of the cross product.'
      )
    ]
  ),

  // ============================================================
  // AREA EXAMPLE
  // ============================================================

  slide(
    'c124-area-example',
    'worked-example',
    'Example 2: Area of a Parallelogram',
    [
      math(
        String.raw`\mathbf a=\langle1,2,3\rangle,
        \qquad
        \mathbf b=\langle2,-1,1\rangle`
      ),

      math(
        String.raw`\mathbf a\times\mathbf b
        =
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        1&2&3\\
        2&-1&1
        \end{array}`
      ),

      math(
        String.raw`=
        \langle
        2(1)-3(-1),\,
        3(2)-1(1),\,
        1(-1)-2(2)
        \rangle`
      ),

      math(
        String.raw`=
        \langle5,5,-5\rangle`
      ),

      math(
        String.raw`A
        =
        \|\mathbf a\times\mathbf b\|`
      ),

      math(
        String.raw`=
        \sqrt{5^2+5^2+(-5)^2}
        =
        \sqrt{75}
        =
        5\sqrt3`
      ),

      math(
        String.raw`\boxed{
        A_{\text{parallelogram}}=5\sqrt3
        }`
      )
    ]
  ),

  // ============================================================
  // TRIANGLE AREA
  // ============================================================

  slide(
    'c124-triangle',
    'concept',
    'Area of a Triangle',
    [
      text(
        'Two vectors form a parallelogram. A triangle determined by those same vectors occupies exactly half of that parallelogram.'
      ),

      math(
        String.raw`\boxed{
        A_{\triangle}
        =
        \frac12
        \|\mathbf a\times\mathbf b\|
        }`
      ),

      callout(
        'Parallelogram → full magnitude. Triangle → one-half of the magnitude.'
      )
    ]
  ),

  // ============================================================
  // THREE POINT TRIANGLE
  // ============================================================

  slide(
    'c124-three-points',
    'worked-example',
    'Example 3: Triangle Determined by Three Points',
    [
      math(
        String.raw`P=(1,0,0),\quad
        Q=(3,1,0),\quad
        R=(2,0,2)`
      ),

      text(
        'First create two vectors that begin at the SAME point.'
      ),

      math(
        String.raw`\overrightarrow{PQ}
        =
        Q-P
        =
        \langle2,1,0\rangle`
      ),

      math(
        String.raw`\overrightarrow{PR}
        =
        R-P
        =
        \langle1,0,2\rangle`
      ),

      math(
        String.raw`\overrightarrow{PQ}
        \times
        \overrightarrow{PR}
        =
        \langle2,-4,-1\rangle`
      ),

      math(
        String.raw`\|
        \overrightarrow{PQ}
        \times
        \overrightarrow{PR}
        \|
        =
        \sqrt{4+16+1}
        =
        \sqrt{21}`
      ),

      math(
        String.raw`\boxed{
        A_{\triangle}
        =
        \frac{\sqrt{21}}{2}
        }`
      ),

      callout(
        'When given three points, first create TWO vectors with the same initial point.'
      )
    ]
  ),

  // ============================================================
  // NORMAL VECTOR
  // ============================================================

  slide(
    'c124-normal',
    'application',
    'Finding a Normal Vector to a Plane',
    [
      text(
        'If two nonparallel vectors lie in a plane, their cross product is perpendicular to both vectors and therefore perpendicular to the plane.'
      ),

      math(
        String.raw`\mathbf n
        =
        \mathbf a\times\mathbf b`
      ),

      callout(
        'The cross product gives us a NORMAL VECTOR to the plane.'
      )
    ]
  ),

  // ============================================================
  // NORMAL VECTOR EXAMPLE
  // ============================================================

  slide(
    'c124-normal-example',
    'worked-example',
    'Example 4: Find a Vector Perpendicular to Two Vectors',
    [
      math(
        String.raw`\mathbf a=\langle1,2,-1\rangle,
        \qquad
        \mathbf b=\langle3,0,2\rangle`
      ),

      math(
        String.raw`\mathbf a\times\mathbf b
        =
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        1&2&-1\\
        3&0&2
        \end{array}`
      ),

      math(
        String.raw`=
        \langle4,-5,-6\rangle`
      ),

      math(
        String.raw`\boxed{
        \mathbf n=\langle4,-5,-6\rangle
        }`
      ),

      text(
        'Check the answer using dot products:'
      ),

      math(
        String.raw`\mathbf n\cdot\mathbf a
        =
        4-10+6=0`
      ),

      math(
        String.raw`\mathbf n\cdot\mathbf b
        =
        12-12=0`
      ),

      callout(
        'The zero dot products verify that n is perpendicular to both vectors.'
      )
    ]
  ),

  // ============================================================
  // ANGLE USING CROSS PRODUCT
  // ============================================================

  slide(
    'c124-angle',
    'concept',
    'Finding the Angle Using a Cross Product',
    [
      math(
        String.raw`\|\mathbf a\times\mathbf b\|
        =
        \|\mathbf a\|\|\mathbf b\|\sin\theta`
      ),

      text(
        'Solve for sin θ:'
      ),

      math(
        String.raw`\boxed{
        \sin\theta
        =
        \frac{\|\mathbf a\times\mathbf b\|}
        {\|\mathbf a\|\|\mathbf b\|}
        }`
      ),

      callout(
        'The dot product uses cosine. The cross product magnitude uses sine.'
      )
    ]
  ),

  // ============================================================
  // UNIT VECTOR PERPENDICULAR
  // ============================================================

  slide(
    'c124-unit-normal',
    'concept',
    'Unit Vector Perpendicular to Both Vectors',
    [
      text(
        'The cross product gives the correct direction, but it is usually not a unit vector.'
      ),

      math(
        String.raw`\mathbf n
        =
        \mathbf a\times\mathbf b`
      ),

      text(
        'Normalize it by dividing by its magnitude:'
      ),

      math(
        String.raw`\boxed{
        \hat{\mathbf n}
        =
        \frac{\mathbf a\times\mathbf b}
        {\|\mathbf a\times\mathbf b\|}
        }`
      ),

      text(
        'There are actually TWO unit vectors perpendicular to the plane:'
      ),

      math(
        String.raw`\boxed{
        \pm
        \frac{\mathbf a\times\mathbf b}
        {\|\mathbf a\times\mathbf b\|}
        }`
      )
    ]
  ),

  // ============================================================
  // TORQUE
  // ============================================================

  viz(
    'c124-torque',
    'Application: Torque',
    'torque-cross-product',
    [
      math(
        String.raw`\boxed{
        \boldsymbol\tau
        =
        \mathbf r\times\mathbf F }; 
        \|\boldsymbol\tau\|
        =
        \|\mathbf r\|\|\mathbf F\|\sin\theta`
      ),

      text(
        'Torque measures the rotational effect of a force.'
      ),

      callout(
        'A force perpendicular to the lever arm produces maximum torque.'
      )
    ]
  ),

  // ============================================================
  // TORQUE EXAMPLE
  // ============================================================

  slide(
    'c124-torque-example',
    'worked-example',
    'Example 5: Torque',
    [
      math(
        String.raw`\mathbf r=\langle2,0,0\rangle\text{ m}`
      ),

      math(
        String.raw`\mathbf F=\langle0,5,0\rangle\text{ N}`
      ),

      math(
        String.raw`\boldsymbol\tau
        =
        \mathbf r\times\mathbf F`
      ),

      math(
        String.raw`=
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        2&0&0\\
        0&5&0
        \end{array}`
      ),

      math(
        String.raw`=
        \langle0,0,10\rangle`
      ),

      math(
        String.raw`\boxed{
        \boldsymbol\tau
        =
        \langle0,0,10\rangle
        \text{ N}\cdot\text{m}
        }`
      ),

      callout(
        'The positive k-direction describes the axis and orientation of rotation.'
      )
    ]
  ),

  // ============================================================
  // PROPERTIES
  // ============================================================

  slide(
    'c124-properties',
    'summary',
    'Important Cross Product Properties',
    [
      math(
        String.raw`\mathbf a\times\mathbf b
        =
        -(\mathbf b\times\mathbf a)`
      ),

      math(
        String.raw`\mathbf a\times\mathbf a
        =
        \mathbf 0`
      ),

      math(
        String.raw`\mathbf a\times\mathbf 0
        =
        \mathbf 0`
      ),

      math(
        String.raw`\mathbf a\times(\mathbf b+\mathbf c)
        =
        \mathbf a\times\mathbf b
        +
        \mathbf a\times\mathbf c`
      ),

      math(
        String.raw`(c\mathbf a)\times\mathbf b
        =
        c(\mathbf a\times\mathbf b)`
      ),

      callout(
        'Cross product is NOT commutative. Order matters.'
      )
    ]
  ),

  // ============================================================
  // UNIT VECTOR CROSS PRODUCTS
  // ============================================================

  slide(
    'c124-unit-vectors',
    'definition',
    'Cross Products of i, j, and k',
    [
      math(
        String.raw`\boxed{
        \mathbf i\times\mathbf j=\mathbf k
        }`
      ),

      math(
        String.raw`\boxed{
        \mathbf j\times\mathbf k=\mathbf i
        }`
      ),

      math(
        String.raw`\boxed{
        \mathbf k\times\mathbf i=\mathbf j
        }`
      ),

      text(
        'Reverse the order and the sign changes:'
      ),

      math(
        String.raw`\mathbf j\times\mathbf i=-\mathbf k`
      ),

      math(
        String.raw`\mathbf k\times\mathbf j=-\mathbf i`
      ),

      math(
        String.raw`\mathbf i\times\mathbf k=-\mathbf j`
      ),

      callout(
        'Forward cyclic order i → j → k → i is positive. Reverse order is negative.'
      )
    ]
  ),

  // ============================================================
  // KAHOOT 2
  // ============================================================

  slide(
    'c124-kahoot2',
    'live-question',
    'Kahoot Challenge: Area',
    [
      math(
        String.raw`\mathbf a=\langle1,0,0\rangle,
        \qquad
        \mathbf b=\langle0,4,0\rangle`
      ),

      text(
        'What is the area of the parallelogram determined by a and b?'
      )
    ],
    {
      question: {
        type: 'multiple-choice',
        prompt:
          'What is the area of the parallelogram determined by a=<1,0,0> and b=<0,4,0>?',
        options: ['1', '2', '4', '8'],
        correctAnswer: 2,
        timer: 60,
        scoring: 'speed',
        topic: '12.4 Cross Product Area'
      }
    }
  ),

  // ============================================================
  // KAHOOT 2 SOLUTION
  // ============================================================

  slide(
    'c124-kahoot2-solution',
    'solution',
    'Complete Solution: Area',
    [
      math(
        String.raw`\mathbf a\times\mathbf b
        =
        \langle0,0,4\rangle`
      ),

      math(
        String.raw`\|\mathbf a\times\mathbf b\|
        =
        \sqrt{0^2+0^2+4^2}
        =
        4`
      ),

      math(
        String.raw`\boxed{
        A_{\text{parallelogram}}=4
        }`
      ),

      callout(
        'Because the vectors are perpendicular, this also agrees with base × height = 1(4) = 4.'
      )
    ],
    {
      solutionFor: 'c124-kahoot2'
    }
  ),

  // ============================================================
  // COMMON MISTAKES
  // ============================================================

  slide(
    'c124-mistakes',
    'warning',
    'Common Cross Product Mistakes',

    [
      list([
        'Forgetting the negative sign on the j-component.',
        'Assuming a × b = b × a.',
        'Giving only the magnitude when the problem asks for the vector.',
        'Forgetting the factor 1/2 when finding the area of a triangle.',
        'Using cosine instead of sine in the cross-product magnitude formula.',
        'Forgetting to normalize when the problem asks for a UNIT vector.',
        'Creating vectors from three points that do not share the same initial point.'
      ]),
      callout(
        'Always ask: Do I need a vector, a magnitude, an area, or a unit vector?'
      )
    ]
  ),

  // ============================================================
  // EXAM STRATEGY
  // ============================================================

  slide(
    'c124-exam',
    'summary',
    'How to Recognize a Cross Product Problem',
    [
      text(
        'Think CROSS PRODUCT when you see words such as:'
      ),

      list([
        'perpendicular to both vectors',
        'normal vector',
        'area of a parallelogram',
        'area of a triangle in 3D',
        'torque',
        'parallel-vector test',
        'orientation or right-hand rule'
      ]),

      callout(
        'If the problem asks about alignment, projection, work, or perpendicularity through a scalar test, think DOT PRODUCT instead.'
      )
    ]
  ),

  // ============================================================
  // FINAL CHECK
  // ============================================================

  check(
    'c124-final-check',
    'Exit Check',
    'If two nonzero vectors have a cross product equal to the zero vector, what can you conclude?',
    [
      'They are perpendicular',
      'They are parallel',
      'They have equal magnitude',
      'Their dot product must be zero'
    ],
    1
  ),

  // ============================================================
  // SUMMARY
  // ============================================================

  slide(
    'c124-summary',
    'summary',
    '12.4 Cross Product — What You Need to Know',
    [
      math(
        String.raw`\boxed{
        \mathbf a\times\mathbf b
        =
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        a_1&a_2&a_3\\
        b_1&b_2&b_3
        \end{array}
        }`
      ),

      math(
        String.raw`\boxed{
        \|\mathbf a\times\mathbf b\|
        =
        \|\mathbf a\|\|\mathbf b\|\sin\theta
        }`
      ),

      list([
        'The cross product is a vector.',
        'a × b is perpendicular to both a and b.',
        'Use the right-hand rule for direction.',
        'Reversing the order reverses the direction.',
        'a × b = 0 for parallel nonzero vectors.',
        '||a × b|| gives the area of a parallelogram.',
        '½||a × b|| gives the area of a triangle.',
        'Cross products produce normal vectors to planes.',
        'Torque is r × F.'
      ]),

      callout(
        'DOT PRODUCT asks: How much do these vectors point together? CROSS PRODUCT asks: What is perpendicular to them, and how much area do they create?'
      )
    ],
    {
      presenterNotes: [
        note(
          'closing',
          'Final emphasis',
          'Have students say aloud: dot → scalar → cosine; cross → vector → sine.'
        )
      ]
    }
  )
  ]
}

export const chapter125Lecture = {
  id: 'chapter-12-5',
  title: '12.5 Equations of Lines and Planes',
  course: 'Calculus III',
  chapter: 'Chapter 12',
  section: '12.5',
  status: 'ready',
  sourceCodeAlwaysWins: true,

  description:
    'Build equations of lines and planes in three-dimensional space using points, direction vectors, and normal vectors. Convert among vector, parametric, symmetric, and scalar forms; determine intersections, angles, parallelism, and distances.',

  objectives: [
    'Write vector and parametric equations of lines in three-dimensional space.',
    'Convert between vector, parametric, and symmetric forms of a line.',
    'Construct a line through one or two points.',
    'Understand the geometric role of a direction vector.',
    'Write an equation of a plane using a point and a normal vector.',
    'Construct a plane through three noncollinear points.',
    'Determine whether lines and planes are parallel, perpendicular, or intersecting.',
    'Find intersections between lines and planes.',
    'Find angles between planes and between a line and a plane.',
    'Compute the distance from a point to a plane.'
  ],

  slides: [

  // ============================================================
  // OPENING
  // ============================================================

  slide(
    'c125-opening',
    'title',
    '12.5 Equations of Lines and Planes',
    [
      {
        kind: 'eyebrow',
        value: 'How do we describe geometry in 3D?'
      },

      callout(
        'In two dimensions, two points determine a line. In three dimensions, we also need direction and orientation to describe lines and planes.'
      ),

      math(
        String.raw`\text{LINE: point + direction}`
      ),

      math(
        String.raw`\text{PLANE: point + normal vector}`
      ),

      callout(
        'This simple distinction organizes almost everything in Section 12.5.'
      )
    ],
    {
      presenterNotes: [
        note(
          'opening',
          'Start geometrically',
          'Ask students: What information would you need to describe a line in space? Then ask: What information determines the orientation of a plane?'
        ),
        note(
          'connection',
          'Connection to 12.4',
          'The cross product from Section 12.4 becomes extremely useful because it can create a normal vector to a plane.'
        )
      ]
    }
  ),

  // ============================================================
  // BIG PICTURE
  // ============================================================

  slide(
    'c125-big-picture',
    'concept',
    'Two Geometric Objects — Two Different Vectors',
    [
      text('For a line, we need a vector that points ALONG the line.'),

      math(
        String.raw`\boxed{\text{Line}=\text{point}+\text{direction vector}}`
      ),

      text('For a plane, we need a vector that points PERPENDICULAR to the plane.'),

      math(
        String.raw`\boxed{\text{Plane}=\text{point}+\text{normal vector}}`
      ),

      callout(
        'Direction vector → lies along a line. Normal vector → sticks straight out of a plane.'
      )
    ]
  ),

  // ============================================================
  // LINES
  // ============================================================

  viz(
    'c125-line-geometry',
    'A Line in Three-Dimensional Space',
    'line-point-direction',
    [
      math(
        String.raw`P_0=(x_0,y_0,z_0)`
      ),

      math(
        String.raw`\mathbf v=\langle a,b,c\rangle`
      ),

      callout(
        'Start at P₀ and move any scalar multiple of the direction vector v.'
      ),

      math(
        String.raw`\mathbf r=\mathbf r_0+t\mathbf v`
      )
    ]
  ),

  // ============================================================
  // VECTOR EQUATION
  // ============================================================

  slide(
    'c125-line-vector',
    'definition',
    'Vector Equation of a Line',
    [
      text('Suppose a line passes through'),

      math(
        String.raw`P_0=(x_0,y_0,z_0)`
      ),

      text('and is parallel to the direction vector'),

      math(
        String.raw`\mathbf v=\langle a,b,c\rangle.`
      ),

      text('Then every point on the line can be written as'),

      math(
        String.raw`\boxed{
        \mathbf r(t)
        =
        \mathbf r_0+t\mathbf v
        }`
      ),

      math(
        String.raw`\boxed{
        \langle x,y,z\rangle
        =
        \langle x_0,y_0,z_0\rangle
        +
        t\langle a,b,c\rangle
        }`
      ),

      callout(
        'The parameter t tells us how far and in which direction we travel along the line.'
      )
    ]
  ),

  // ============================================================
  // PARAMETRIC
  // ============================================================

  slide(
    'c125-parametric',
    'definition',
    'Parametric Equations of a Line',
    [
      math(
        String.raw`\langle x,y,z\rangle
        =
        \langle x_0,y_0,z_0\rangle
        +
        t\langle a,b,c\rangle`
      ),

      text('Match corresponding components:'),

      math(
        String.raw`\boxed{
        x=x_0+at
        }`
      ),

      math(
        String.raw`\boxed{
        y=y_0+bt
        }`
      ),

      math(
        String.raw`\boxed{
        z=z_0+ct
        }`
      ),

      callout(
        'Same line, different notation. Vector form and parametric form contain exactly the same information.'
      )
    ]
  ),

  // ============================================================
  // SYMMETRIC FORM
  // ============================================================

  slide(
    'c125-symmetric',
    'definition',
    'Symmetric Equations of a Line',
    [
      math(
        String.raw`x=x_0+at,\qquad
        y=y_0+bt,\qquad
        z=z_0+ct`
      ),

      text('Solve each equation for t:'),

      math(
        String.raw`t=
        \frac{x-x_0}{a}
        =
        \frac{y-y_0}{b}
        =
        \frac{z-z_0}{c}`
      ),

      math(
        String.raw`\boxed{
        \frac{x-x_0}{a}
        =
        \frac{y-y_0}{b}
        =
        \frac{z-z_0}{c}
        }`
      ),

      callout(
        'Symmetric form is useful when all direction-vector components are nonzero.'
      )
    ]
  ),

  // ============================================================
  // LINE EXAMPLE
  // ============================================================

  slide(
    'c125-line-example1',
    'worked-example',
    'Example 1: Line Through a Point with a Given Direction',
    [
      text('Find equations of the line through'),

      math(
        String.raw`P=(2,-1,4)`
      ),

      text('parallel to'),

      math(
        String.raw`\mathbf v=\langle3,2,-5\rangle.`
      ),

      text('Vector form:'),

      math(
        String.raw`\boxed{
        \mathbf r
        =
        \langle2,-1,4\rangle
        +
        t\langle3,2,-5\rangle
        }`
      ),

      text('Parametric form:'),

      math(
        String.raw`\boxed{
        x=2+3t,\quad
        y=-1+2t,\quad
        z=4-5t
        }`
      ),

      text('Symmetric form:'),

      math(
        String.raw`\boxed{
        \frac{x-2}{3}
        =
        \frac{y+1}{2}
        =
        \frac{z-4}{-5}
        }`
      )
    ]
  ),

  // ============================================================
  // TWO POINTS
  // ============================================================

  slide(
    'c125-two-points',
    'concept',
    'Line Through Two Points',
    [
      text('Suppose the line passes through'),

      math(
        String.raw`P_1=(x_1,y_1,z_1)`
      ),

      text('and'),

      math(
        String.raw`P_2=(x_2,y_2,z_2).`
      ),

      text('We are not given the direction vector — so CREATE it:'),

      math(
        String.raw`\boxed{
        \mathbf v
        =
        \overrightarrow{P_1P_2}
        =
        P_2-P_1
        }`
      ),

      math(
        String.raw`\mathbf v
        =
        \langle
        x_2-x_1,\,
        y_2-y_1,\,
        z_2-z_1
        \rangle`
      ),

      callout(
        'Two points give us the direction automatically: subtract the coordinates.'
      )
    ]
  ),

  // ============================================================
  // TWO-POINT EXAMPLE
  // ============================================================

  slide(
    'c125-two-point-example',
    'worked-example',
    'Example 2: Find the Line Through Two Points',
    [
      math(
        String.raw`P=(1,2,-1),\qquad
        Q=(4,-2,5)`
      ),

      text('Step 1: Find a direction vector.'),

      math(
        String.raw`\mathbf v
        =
        Q-P`
      ),

      math(
        String.raw`=
        \langle4-1,-2-2,5-(-1)\rangle`
      ),

      math(
        String.raw`=
        \langle3,-4,6\rangle`
      ),

      text('Step 2: Use either point as the starting point.'),

      math(
        String.raw`\boxed{
        \mathbf r
        =
        \langle1,2,-1\rangle
        +
        t\langle3,-4,6\rangle
        }`
      ),

      text('Parametric equations:'),

      math(
        String.raw`\boxed{
        x=1+3t,\qquad
        y=2-4t,\qquad
        z=-1+6t
        }`
      ),

      callout(
        'Using Q instead of P gives a different-looking equation but the SAME geometric line.'
      )
    ]
  ),

  // ============================================================
  // KAHOOT LINE
  // ============================================================

  slide(
    'c125-kahoot-line',
    'live-question',
    'Kahoot Challenge: Find the Direction Vector',
    [
      math(
        String.raw`P=(2,1,-3),\qquad Q=(5,-1,4)`
      ),

      text('Which vector can be used as a direction vector for the line through P and Q?'),

      callout('Subtract one point from the other.')
    ],
    {
      question: {
        type: 'multiple-choice',
        prompt:
          'Which vector is a direction vector for the line through P=(2,1,-3) and Q=(5,-1,4)?',
        options: [
          '<3,-2,7>',
          '<7,0,1>',
          '<-3,-2,7>',
          '<3,2,-7>'
        ],
        correctAnswer: 0,
        timer: 60,
        scoring: 'speed',
        topic: '12.5 Lines'
      },

      presenterNotes: [
        note(
          'answer',
          'Do not reveal early',
          'Q-P=<5-2,-1-1,4-(-3)>=<3,-2,7>. The negative of this vector would also describe the same line.'
        )
      ]
    }
  ),

  slide(
    'c125-kahoot-line-solution',
    'solution',
    'Complete Solution: Direction Vector',
    [
      math(
        String.raw`\mathbf v=Q-P`
      ),

      math(
        String.raw`=
        \langle5-2,\,-1-1,\,
        4-(-3)\rangle`
      ),

      math(
        String.raw`=
        \boxed{\langle3,-2,7\rangle}`
      ),

      callout(
        'Any nonzero scalar multiple also works. For example, ⟨−3,2,−7⟩ points along the same line in the opposite direction.'
      )
    ],
    {
      solutionFor: 'c125-kahoot-line'
    }
  ),

  // ============================================================
  // PARALLEL LINES
  // ============================================================

  slide(
    'c125-parallel-lines',
    'concept',
    'When Are Two Lines Parallel?',
    [
      text('Two lines are parallel when their direction vectors are parallel.'),

      math(
        String.raw`\mathbf v_1=c\mathbf v_2`
      ),

      callout(
        'Check the direction vectors — not the points.'
      ),

      text('If the vectors are scalar multiples, the lines are parallel or possibly the same line.')
    ]
  ),

  // ============================================================
  // PLANES INTRO
  // ============================================================

  viz(
    'c125-plane-geometry',
    'A Plane Needs a Normal Vector',
    'plane-normal-vector',
    [
      text('A direction vector lies ALONG a line.'),

      text('A normal vector points PERPENDICULAR to a plane.'),

      math(
        String.raw`\mathbf n=\langle a,b,c\rangle`
      ),

      callout(
        'Knowing one point on a plane and one normal vector completely determines the plane.'
      )
    ]
  ),

  // ============================================================
  // PLANE DERIVATION
  // ============================================================

  slide(
    'c125-plane-derivation',
    'derivation',
    'Where Does the Equation of a Plane Come From?',
    [
      text('Let'),

      math(
        String.raw`P_0=(x_0,y_0,z_0)`
      ),

      text('be a fixed point on the plane and'),

      math(
        String.raw`\mathbf n=\langle a,b,c\rangle`
      ),

      text('be a normal vector.'),

      text('Take any other point'),

      math(
        String.raw`P=(x,y,z)`
      ),

      text('on the plane.'),

      text('The vector from P₀ to P lies IN the plane:'),

      math(
        String.raw`\overrightarrow{P_0P}
        =
        \langle
        x-x_0,\,
        y-y_0,\,
        z-z_0
        \rangle`
      ),

      text('Since n is perpendicular to the plane:'),

      math(
        String.raw`\mathbf n\cdot\overrightarrow{P_0P}=0`
      ),

      math(
        String.raw`\boxed{
        a(x-x_0)+
        b(y-y_0)+
        c(z-z_0)=0
        }`
      ),

      callout(
        'The plane equation comes directly from the dot-product test for perpendicular vectors.'
      )
    ]
  ),

  // ============================================================
  // PLANE STANDARD FORM
  // ============================================================

  slide(
    'c125-plane-standard',
    'definition',
    'Scalar Equation of a Plane',
    [
      math(
        String.raw`\boxed{
        a(x-x_0)
        +
        b(y-y_0)
        +
        c(z-z_0)=0
        }`
      ),

      text('Expanding gives the familiar form'),

      math(
        String.raw`\boxed{
        ax+by+cz=d
        }`
      ),

      callout(
        'The coefficients a, b, and c are the components of a normal vector.'
      ),

      math(
        String.raw`\boxed{
        \mathbf n=\langle a,b,c\rangle
        }`
      )
    ]
  ),

  // ============================================================
  // PLANE EXAMPLE
  // ============================================================

  slide(
    'c125-plane-example1',
    'worked-example',
    'Example 3: Plane Through a Point with a Given Normal',
    [
      text('Find the plane through'),

      math(
        String.raw`P=(2,-1,3)`
      ),

      text('with normal vector'),

      math(
        String.raw`\mathbf n=\langle4,2,-5\rangle.`
      ),

      text('Use point-normal form:'),

      math(
        String.raw`4(x-2)+2(y+1)-5(z-3)=0`
      ),

      text('Expand:'),

      math(
        String.raw`4x-8+2y+2-5z+15=0`
      ),

      math(
        String.raw`4x+2y-5z+9=0`
      ),

      math(
        String.raw`\boxed{
        4x+2y-5z=-9
        }`
      ),

      callout(
        'You can immediately read the normal vector from the coefficients: ⟨4,2,−5⟩.'
      )
    ]
  ),

  // ============================================================
  // PLANE THROUGH 3 POINTS
  // ============================================================

  slide(
    'c125-three-points-intro',
    'concept',
    'Plane Through Three Points',
    [
      text('Three noncollinear points determine a plane.'),

      math(
        String.raw`P,\qquad Q,\qquad R`
      ),

      text('But the plane equation requires a NORMAL vector.'),

      text('So we first create two vectors lying in the plane:'),

      math(
        String.raw`\overrightarrow{PQ}=Q-P`
      ),

      math(
        String.raw`\overrightarrow{PR}=R-P`
      ),

      text('Then use the cross product:'),

      math(
        String.raw`\boxed{
        \mathbf n=
        \overrightarrow{PQ}
        \times
        \overrightarrow{PR}
        }`
      ),

      callout(
        'This is why the cross product from Section 12.4 matters!'
      )
    ]
  ),

  // ============================================================
  // THREE-POINT EXAMPLE
  // ============================================================

  slide(
    'c125-three-points-example',
    'worked-example',
    'Example 4: Plane Through Three Points',
    [
      math(
        String.raw`P=(1,0,2),\quad
        Q=(3,1,1),\quad
        R=(2,-1,4)`
      ),

      text('Step 1: Build two vectors in the plane.'),

      math(
        String.raw`\overrightarrow{PQ}
        =
        \langle2,1,-1\rangle`
      ),

      math(
        String.raw`\overrightarrow{PR}
        =
        \langle1,-1,2\rangle`
      ),

      text('Step 2: Find a normal vector.'),

      math(
        String.raw`\mathbf n
        =
        \overrightarrow{PQ}
        \times
        \overrightarrow{PR}`
      ),

      math(
        String.raw`=
        \begin{array}{|ccc|}
        \mathbf i&\mathbf j&\mathbf k\\
        2&1&-1\\
        1&-1&2
        \end{array}`
      ),

      math(
        String.raw`=
        \langle1,-5,-3\rangle`
      ),

      text('Step 3: Use point-normal form with P.'),

      math(
        String.raw`1(x-1)-5(y-0)-3(z-2)=0`
      ),

      math(
        String.raw`x-1-5y-3z+6=0`
      ),

      math(
        String.raw`\boxed{
        x-5y-3z=-5
        }`
      )
    ]
  ),

  // ============================================================
  // PARALLEL PLANES
  // ============================================================

  slide(
    'c125-parallel-planes',
    'concept',
    'Parallel Planes',
    [
      text('Planes are parallel when their normal vectors are parallel.'),

      math(
        String.raw`\mathbf n_1=c\mathbf n_2`
      ),

      text('Example:'),

      math(
        String.raw`2x-4y+6z=7`
      ),

      math(
        String.raw`x-2y+3z=-5`
      ),

      text('Normals:'),

      math(
        String.raw`\mathbf n_1=\langle2,-4,6\rangle`
      ),

      math(
        String.raw`\mathbf n_2=\langle1,-2,3\rangle`
      ),

      math(
        String.raw`\mathbf n_1=2\mathbf n_2`
      ),

      callout('Therefore the planes are parallel.')
    ]
  ),

  // ============================================================
  // PERP PLANES
  // ============================================================

  slide(
    'c125-perpendicular-planes',
    'concept',
    'Perpendicular Planes',
    [
      text('Planes are perpendicular when their normal vectors are perpendicular.'),

      math(
        String.raw`\boxed{
        \mathbf n_1\cdot\mathbf n_2=0
        }`
      ),

      callout(
        'Again, the dot product from Section 12.3 tells us about perpendicularity.'
      )
    ]
  ),

  // ============================================================
  // ANGLE BETWEEN PLANES
  // ============================================================

  slide(
    'c125-angle-planes',
    'definition',
    'Angle Between Two Planes',
    [
      text(
        'The angle between two planes is determined by the angle between their normal vectors.'
      ),

      math(
        String.raw`\cos\theta
        =
        \frac{|\mathbf n_1\cdot\mathbf n_2|}
        {\|\mathbf n_1\|\|\mathbf n_2\|}`
      ),

      callout(
        'The absolute value gives the acute angle between the planes.'
      )
    ]
  ),

  // ============================================================
  // ANGLE EXAMPLE
  // ============================================================

  slide(
    'c125-angle-example',
    'worked-example',
    'Example 5: Angle Between Two Planes',
    [
      math(
        String.raw`2x-y+2z=4`
      ),

      math(
        String.raw`x+2y-2z=7`
      ),

      text('Normal vectors:'),

      math(
        String.raw`\mathbf n_1=\langle2,-1,2\rangle`
      ),

      math(
        String.raw`\mathbf n_2=\langle1,2,-2\rangle`
      ),

      math(
        String.raw`\mathbf n_1\cdot\mathbf n_2
        =
        2-2-4=-4`
      ),

      math(
        String.raw`\|\mathbf n_1\|=3,\qquad
        \|\mathbf n_2\|=3`
      ),

      math(
        String.raw`\cos\theta
        =
        \frac{|-4|}{9}
        =
        \frac49`
      ),

      math(
        String.raw`\boxed{
        \theta=\cos^{-1}\left(\frac49\right)
        \approx63.6^\circ
        }`
      )
    ]
  ),

  // ============================================================
  // LINE PLANE INTERSECTION
  // ============================================================

  slide(
    'c125-line-plane-intersection',
    'concept',
    'Intersection of a Line and a Plane',
    [
      text('A line is given parametrically:'),

      math(
        String.raw`x=x_0+at,\quad
        y=y_0+bt,\quad
        z=z_0+ct`
      ),

      text('A plane is given by:'),

      math(
        String.raw`Ax+By+Cz=D`
      ),

      text('Substitute the line equations into the plane equation.'),

      callout(
        'This produces ONE equation in ONE unknown: t.'
      ),

      text('Solve for t, then substitute back into the line to find the intersection point.')
    ]
  ),

  // ============================================================
  // INTERSECTION EXAMPLE
  // ============================================================

  slide(
    'c125-intersection-example',
    'worked-example',
    'Example 6: Where Does the Line Hit the Plane?',
    [
      text('Line:'),

      math(
        String.raw`x=1+2t,\quad
        y=-1+t,\quad
        z=3-t`
      ),

      text('Plane:'),

      math(
        String.raw`x+y+z=6`
      ),

      text('Substitute:'),

      math(
        String.raw`(1+2t)+(-1+t)+(3-t)=6`
      ),

      math(
        String.raw`3+2t=6`
      ),

      math(
        String.raw`t=\frac32`
      ),

      text('Substitute back:'),

      math(
        String.raw`x=1+2\left(\frac32\right)=4`
      ),

      math(
        String.raw`y=-1+\frac32=\frac12`
      ),

      math(
        String.raw`z=3-\frac32=\frac32`
      ),

      math(
        String.raw`\boxed{
        \left(4,\frac12,\frac32\right)
        }`
      )
    ]
  ),

  // ============================================================
  // LINE AND PLANE RELATIONSHIP
  // ============================================================

  slide(
    'c125-line-plane-relations',
    'concept',
    'Line vs. Plane: What Can Happen?',
    [
      text('Compare the line direction vector v with the plane normal n.'),

      math(
        String.raw`\mathbf v\cdot\mathbf n`
      ),

      list([
        'If v · n ≠ 0 → the line crosses the plane.',
        'If v · n = 0 → the line is parallel to the plane OR lies entirely inside it.',
        'If v is parallel to n → the line is perpendicular to the plane.'
      ]),

      callout(
        'Always distinguish between “parallel to the plane” and “contained in the plane.”'
      )
    ]
  ),

  // ============================================================
  // DISTANCE POINT TO PLANE
  // ============================================================

  slide(
    'c125-distance',
    'definition',
    'Distance from a Point to a Plane',
    [
      text('Plane:'),

      math(
        String.raw`Ax+By+Cz+D=0`
      ),

      text('Point:'),

      math(
        String.raw`P=(x_0,y_0,z_0)`
      ),

      math(
        String.raw`\boxed{
        d=
        \frac{
        |Ax_0+By_0+Cz_0+D|
        }{
        \sqrt{A^2+B^2+C^2}
        }
        }`
      ),

      callout(
        'Distance must be nonnegative, which is why the numerator uses absolute value.'
      )
    ]
  ),

  // ============================================================
  // DISTANCE EXAMPLE
  // ============================================================

  slide(
    'c125-distance-example',
    'worked-example',
    'Example 7: Distance from a Point to a Plane',
    [
      text('Find the distance from'),

      math(
        String.raw`P=(1,-2,3)`
      ),

      text('to'),

      math(
        String.raw`2x-y+2z-4=0.`
      ),

      math(
        String.raw`d=
        \frac{
        |2(1)-(-2)+2(3)-4|
        }{
        \sqrt{2^2+(-1)^2+2^2}
        }`
      ),

      math(
        String.raw`=
        \frac{|2+2+6-4|}{3}`
      ),

      math(
        String.raw`=
        \frac63`
      ),

      math(
        String.raw`\boxed{d=2}`
      )
    ]
  ),

  // ============================================================
  // KAHOOT PLANE
  // ============================================================

  slide(
    'c125-kahoot-plane',
    'live-question',
    'Kahoot Challenge: Read the Normal Vector',
    [
      math(
        String.raw`3x-4y+7z=12`
      ),

      text('Which vector is normal to this plane?')
    ],
    {
      question: {
        type: 'multiple-choice',
        prompt:
          'Which vector is normal to the plane 3x - 4y + 7z = 12?',
        options: [
          '<3,-4,7>',
          '<3,4,7>',
          '<12,12,12>',
          '<1,1,1>'
        ],
        correctAnswer: 0,
        timer: 45,
        scoring: 'speed',
        topic: '12.5 Planes'
      }
    }
  ),

  slide(
    'c125-kahoot-plane-solution',
    'solution',
    'Complete Solution: Normal Vector',
    [
      math(
        String.raw`Ax+By+Cz=D`
      ),

      text('The coefficients give the normal vector:'),

      math(
        String.raw`\mathbf n=\langle A,B,C\rangle`
      ),

      math(
        String.raw`\boxed{
        \mathbf n=\langle3,-4,7\rangle
        }`
      ),

      callout(
        'Do not include the constant 12. It determines the location of the plane, not its orientation.'
      )
    ],
    {
      solutionFor: 'c125-kahoot-plane'
    }
  ),

  // ============================================================
  // COMMON MISTAKES
  // ============================================================

  slide(
    'c125-mistakes',
    'warning',
    'Common Mistakes',
    [
      list([
        'Using a normal vector as the direction vector of a line.',
        'Using a direction vector as the normal vector of a plane.',
        'Forgetting to subtract coordinates when a line is defined by two points.',
        'Forgetting the cross product when finding a plane through three points.',
        'Using points instead of normal vectors to compare planes.',
        'Using direction vectors instead of normal vectors to find the angle between planes.',
        'Forgetting the absolute value in the point-to-plane distance formula.',
        'Assuming two lines in 3D must intersect if they are not parallel.'
      ]),

      callout(
        'Always identify first: Am I working with a LINE or a PLANE? Then ask which vector I need.'
      )
    ]
  ),

  // ============================================================
  // SKEW LINES
  // ============================================================

  slide(
    'c125-skew-lines',
    'concept',
    'A New 3D Idea: Skew Lines',
    [
      text(
        'In a plane, two distinct lines either intersect or are parallel. In three-dimensional space, there is a third possibility.'
      ),

      math(
        String.raw`\boxed{\text{Skew lines}}`
      ),

      text(
        'Skew lines are lines that are not parallel and do not intersect.'
      ),

      callout(
        'They miss each other because they lie in different planes.'
      )
    ]
  ),

  // ============================================================
  // FINAL RECOGNITION GUIDE
  // ============================================================

  slide(
    'c125-recognition',
    'summary',
    'How to Recognize What the Problem Wants',
    [
      list([
        'Line + point + direction → r = r₀ + tv',
        'Line through two points → subtract points to get v',
        'Plane + point + normal → a(x−x₀)+b(y−y₀)+c(z−z₀)=0',
        'Plane through three points → create two vectors, then cross product',
        'Parallel lines → compare direction vectors',
        'Parallel planes → compare normal vectors',
        'Perpendicular planes → normal vectors have dot product 0',
        'Angle between planes → angle between normal vectors',
        'Line-plane intersection → substitute parametric equations into plane',
        'Distance point to plane → use point-to-plane distance formula'
      ])
    ]
  ),

  // ============================================================
  // FINAL CHECK
  // ============================================================

  check(
    'c125-final-check',
    'Exit Check',
    'You are given three noncollinear points and asked to find the equation of the plane containing them. What should you do first?',
    [
      'Find the dot product of the three points',
      'Create two vectors in the plane',
      'Find the distance between the points',
      'Write x+y+z=0'
    ],
    1
  ),

  // ============================================================
  // SUMMARY
  // ============================================================

  slide(
    'c125-summary',
    'summary',
    '12.5 — The Entire Section in Two Ideas',
    [
      math(
        String.raw`\boxed{
        \text{LINE}
        =
        \text{POINT}
        +
        \text{DIRECTION}
        }`
      ),

      math(
        String.raw`\boxed{
        \text{PLANE}
        =
        \text{POINT}
        +
        \text{NORMAL}
        }`
      ),

      list([
        'Direction vectors tell us how a line travels.',
        'Normal vectors tell us how a plane is oriented.',
        'Two points create a direction vector.',
        'Two vectors in a plane create a normal vector through the cross product.',
        'Dot products detect perpendicularity and angles.',
        'Cross products create normals.',
        'Parametric equations are especially useful for intersections.',
        'The coefficients of ax + by + cz = d form a normal vector.'
      ]),

      callout(
        'If you remember only one thing: LINE → direction vector; PLANE → normal vector.'
      )
    ],
    {
      presenterNotes: [
        note(
          'closing',
          'Connect Chapters 12.3–12.5',
          'Point out that students are now combining everything: dot product determines angles/perpendicularity, cross product creates normals, and Section 12.5 uses both to describe lines and planes.'
        ),
        note(
          'exam',
          'Exam emphasis',
          'Make students practice recognizing what vector they need BEFORE calculating anything.'
        )
      ]
    }
  )
  ]
}

/*
 * Archived duplicate block.
 *
 * The definitions below were accidentally appended after the complete 12.4
 * and 12.5 lectures above. They redeclare shared helpers and lecture exports,
 * which prevents Vite from parsing this module. Section 12.6 is maintained in
 * chapter12AdvancedLectures.js.
 *
const note=(type,title,content,math)=>({type,title,content,...(math?{math}:{})})
const item=(kind,value)=>({kind,value})
const slide=(id,type,title,content=[],options={})=>({id,type,title,presentationContent:content,presenterNotes:options.presenterNotes||[note('timing','Time budget',options.minutes?`${options.minutes} minutes`:'3–5 minutes')],studentNotes:options.studentNotes||[],revealSteps:options.revealSteps||[],layoutMode:'slide',theme:'classic-math',level:'essential',courses:['calc2','calc3'],recommendedFor:['calc2','calc3'],visualization:options.visualization,question:options.question,minutes:options.minutes||4})
const viz=(id,title,stage,content,minutes=6)=>slide(id,'visualization',title,content,{visualization:`chapter12:${stage}`,minutes,presenterNotes:[note('action','Instructor controls','Use Play, Pause, Step, and Reset. Pause before each mathematical reveal.'),note('timing','Time budget',`${minutes} minutes`)]})
const question=(id,title,prompt,options,correctAnswer,minutes=4)=>slide(id,'live-question',title,[item('callout','Predict privately, then defend your reasoning.')],{minutes,question:{type:'multiple-choice',prompt,options,correctAnswer},presenterNotes:[note('answer','Debrief',`Correct answer: ${options[correctAnswer]}`),note('timing','Time budget',`${minutes} minutes including discussion.`)]})

export const chapter124Lecture={id:'chapter-12-4',title:'12.4 Cross Product',course:'Calculus II & III',chapter:'Chapter 12',section:'12.4',status:'ready',description:'A curated 80-minute geometric story about perpendicular direction, orientation, area, volume, and torque.',objectives:['Compute and interpret cross products','Use right-hand orientation','Connect magnitude to area','Use triple products and torque'],slides:[
 slide('c124-open','title','How can two directions create a third?', [item('eyebrow','12.4 · Cross Product'),item('callout','The dot product returned a number. Today two vectors produce a perpendicular vector.')],{minutes:4,presenterNotes:[note('opening','Curiosity','Hold two pencils in different directions. Ask students to point in a direction perpendicular to both.'),note('timing','Time','4 minutes')]}),
 viz('c124-perpendicular','A perpendicular vector appears','cross-product',[item('math',String.raw`\mathbf a\times\mathbf b\perp\mathbf a,\mathbf b`)],7),
 question('c124-output','Output check','What kind of object is a×b?',['Scalar','Vector','Plane','Angle'],1,4),
 slide('c124-components','definition','Component computation',[item('math',String.raw`\mathbf a\times\mathbf b=\begin{array}{|ccc|}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{array}`),item('callout','The middle cofactor carries a minus sign.')],{minutes:7,presenterNotes:[note('derivation','Professor derivation','Expand along the first row, then verify the result dots to zero with both inputs.'),note('timing','Time','7 minutes')]}),
 slide('c124-example','worked-example','Compute and verify',[item('math',String.raw`\langle1,2,3\rangle\times\langle2,-1,4\rangle=\langle11,2,-5\rangle`),item('math',String.raw`\langle11,2,-5\rangle\cdot\langle1,2,3\rangle=0`)],{minutes:8,revealSteps:['Set up determinant','Expand components','Check perpendicularity']}),
 viz('c124-hand','Order controls direction','right-hand',[item('math',String.raw`\mathbf b\times\mathbf a=-(\mathbf a\times\mathbf b)`)],7),
 question('c124-order','Reverse the order','If a×b=<1,2,3>, what is b×a?',['<1,2,3>','<-1,-2,-3>','0','Cannot know'],1,4),
 viz('c124-area','Sine becomes area','cross-area',[item('math',String.raw`\|\mathbf a\times\mathbf b\|=\|\mathbf a\|\|\mathbf b\|\sin\theta`)],7),
 slide('c124-area-example','worked-example','Triangle area from two sides',[item('math',String.raw`A=(0,0,0),\ B=(2,0,1),\ C=(0,3,1)`),item('math',String.raw`\text{Area}=\tfrac12\|\overrightarrow{AB}\times\overrightarrow{AC}\|=\tfrac12\sqrt{46}`)],{minutes:8}),
 slide('c124-triple','theorem','Scalar triple product measures volume',[item('math',String.raw`V=|\mathbf a\cdot(\mathbf b\times\mathbf c)|`),item('callout','Volume zero is the coplanarity test.')],{minutes:7,presenterNotes:[note('derivation','Why','Cross product gives base area and its unit normal; the dot product supplies signed height.'),note('timing','Time','7 minutes')]}),
 viz('c124-torque','Torque: perpendicular force turns best','torque',[item('math',String.raw`\boldsymbol\tau=\mathbf r\times\mathbf F`)],6),
 slide('c124-smile','connection','A mathematical smile',[item('text','Cross products are very particular about order—they always insist on being right-handed.'),item('callout','Application: longer wrench handles increase |r| and therefore torque.')],{minutes:3}),
 question('c124-exit','Exit Check','Why is the cross product zero for parallel nonzero vectors?',['Their dot product is zero','sin θ=0','cos θ=0','Their lengths are zero'],1,4),
]}

export const chapter125Lecture={id:'chapter-12-5',title:'12.5 Lines and Planes',course:'Calculus II & III',chapter:'Chapter 12',section:'12.5',status:'ready',description:'A curated 80-minute journey built around point + direction and point + normal.',objectives:['Parameterize lines','Build plane equations','Find geometric angles','Compute point-plane distance'],slides:[
 slide('c125-open','title','What information pins down a line or a plane?', [item('eyebrow','12.5 · Lines and Planes'),item('callout','Line = point + direction. Plane = point + normal.')],{minutes:5,presenterNotes:[note('opening','Curiosity','Ask why one point is not enough to determine either object.'),note('timing','Time','5 minutes')]}),
 viz('c125-line','A point travels along a line','line-motion',[item('math',String.raw`\mathbf r(t)=\mathbf r_0+t\mathbf v`)],8),
 slide('c125-parametric','derivation','Read the vector equation componentwise',[item('math',String.raw`x=x_0+at,\quad y=y_0+bt,\quad z=z_0+ct`),item('callout','If a direction component is zero, that coordinate stays constant.')],{minutes:6}),
 question('c125-t','Parameter meaning','At t=0, where is r(t)=r₀+tv?',['At the origin','At r₀','At v','Undefined'],1,4),
 slide('c125-line-example','worked-example','Line through two points',[item('math',String.raw`P=(1,0,-2),\ Q=(3,4,1)`),item('math',String.raw`\mathbf r=\langle1,0,-2\rangle+t\langle2,4,3\rangle`)],{minutes:7}),
 slide('c125-symmetric','connection','Eliminate the parameter carefully',[item('math',String.raw`\frac{x-x_0}{a}=\frac{y-y_0}{b}=\frac{z-z_0}{c}`),item('callout','Never divide by a zero direction component; keep that coordinate constant instead.')],{minutes:5}),
 viz('c125-plane','A normal defines a plane','plane-normal',[item('math',String.raw`\mathbf n\cdot(\mathbf r-\mathbf r_0)=0`)],8),
 slide('c125-plane-example','worked-example','Point-normal to scalar form',[item('math',String.raw`P=(2,-1,3),\ \mathbf n=\langle1,4,-2\rangle`),item('math',String.raw`(x-2)+4(y+1)-2(z-3)=0\Rightarrow x+4y-2z+8=0`)],{minutes:8}),
 question('c125-linear','Concept trap','One linear equation in x,y,z usually represents what?',['A point','A line','A plane','A sphere'],2,4),
 viz('c125-angle','Plane angles come from normals','plane-angle',[item('math',String.raw`\cos\theta=\frac{|\mathbf n_1\cdot\mathbf n_2|}{\|\mathbf n_1\|\|\mathbf n_2\|}`)],6),
 viz('c125-distance','Distance is a normal projection','point-plane-distance',[item('math',String.raw`D=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}`)],7),
 slide('c125-smile','connection','A mathematical smile',[item('text','A line has direction; a plane has standards—specifically, a normal standard.'),item('callout','Air traffic paths and computer graphics use these same point-direction and point-normal structures.')],{minutes:3}),
 question('c125-exit','Exit Check','Which information determines a plane?',['One point only','One direction only','A point and a normal','Two unrelated points'],2,4),
]}

export const chapter126Lecture={id:'chapter-12-6',title:'12.6 Cylinders and Quadric Surfaces',course:'Calculus II & III',chapter:'Chapter 12',section:'12.6',status:'ready',description:'A visual, curated 80-minute investigation of missing variables, traces, and quadric morphology.',objectives:['Recognize cylinders','Use traces as evidence','Classify standard quadrics','Connect surfaces to applications'],slides:[
 slide('c126-open','title','What does an equation hide when a variable disappears?', [item('eyebrow','12.6 · Cylinders and Quadric Surfaces'),item('callout','A missing variable is not zero—it is free.')],{minutes:5,presenterNotes:[note('opening','Spark','Show y=x² and ask what changes when the same equation lives in space.'),note('timing','Time','5 minutes')]}),
 viz('c126-extrude','From parabola to parabolic cylinder','missing-variable',[item('math',String.raw`y=x^2\quad(z\text{ is free})`)],8),
 question('c126-circle','Dimension trap','In R³, what is x²+y²=64?',['A circle','A sphere','A circular cylinder','A disk'],2,4),
 slide('c126-cylinder-types','definition','The missing axis gives the ruling direction',[item('list',['y=x²: parabolic cylinder parallel to z','x²+y²=64: circular cylinder parallel to z','x²-y²=1: hyperbolic cylinder parallel to z'])],{minutes:6}),
 viz('c126-traces','Slice a surface to reveal its traces','trace-explorer',[item('math',String.raw`x=k,\quad y=k,\quad z=k`)],9),
 slide('c126-trace-example','worked-example','Read a saddle from traces',[item('math',String.raw`z=x^2-y^2`),item('list',['y=0 gives z=x²','x=0 gives z=-y²','z=k gives hyperbolas (or crossing lines at k=0)'])],{minutes:8}),
 viz('c126-gallery','Quadric morphology gallery','quadric-gallery',[item('list',['Ellipsoid','Cone','Elliptic paraboloid','Hyperbolic paraboloid','One-sheet hyperboloid','Two-sheet hyperboloid'])],9),
 question('c126-sign','Sign-pattern check','Which surface has one squared term with the opposite sign and equals 1?',['Ellipsoid','Cone','One-sheet hyperboloid','Elliptic paraboloid'],2,4),
 viz('c126-slices','Reconstruct a surface from slices','surface-slices',[item('callout','Move the slicing plane; compare its highlighted intersection with the 2D trace.')],7),
 slide('c126-classify','worked-example','Normalize before classifying',[item('math',String.raw`4x^2+9y^2-z^2=36`),item('math',String.raw`\frac{x^2}{9}+\frac{y^2}{4}-\frac{z^2}{36}=1`),item('callout','Hyperboloid of one sheet, axis along z.')],{minutes:7}),
 slide('c126-facts','connection','Geometry built into the world',[item('list',['Earth is closer to an ellipsoid than a sphere.','Paraboloids focus signals in dishes and telescopes.','Hyperboloid forms appear in cooling towers and structures.'])],{minutes:4}),
 slide('c126-smile','connection','A mathematical smile',[item('text','A missing variable is not absent-minded—it is extending its options in another dimension.')],{minutes:2}),
 question('c126-exit','Exit Check','If z is missing from a surface equation, what should you inspect first?',['Set z=0 permanently','Extension parallel to z','A sphere centered on z','No real points'],1,4),
]}
// CALCULUS III LIVE PRESENTATIONS: 12.4, 12.5, AND 12.6
// Edit the `slides` array inside chapter124Lecture, chapter125Lecture, or chapter126Lecture.
*/
