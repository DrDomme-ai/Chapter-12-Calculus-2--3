export const courses = [
  {
    code: 'MATH 243',
    title: 'Calculus II',
    descriptor: 'Integration • Parametric & Polar • Series',
    description: 'Integration techniques, applications of integration, parametric and polar equations, sequences, series, power series, and Taylor series.',
    path: ['Fundamental Review', 'Chapter 12', 'Integration', 'Applications', 'Parametric & Polar', 'Series'],
    route: 'calc2',
  },
  {
    code: 'MATH 344',
    title: 'Calculus III',
    descriptor: 'Vectors • Multivariable Calculus • Vector Calculus • Differential Equations',
    description: 'Vectors and geometry of space, vector-valued functions, partial derivatives, multiple integration, vector calculus, and second-order differential equations.',
    path: ['Fundamental Review', 'Chapter 12', 'Vector Functions', 'Partial Derivatives', 'Multiple Integrals', 'Vector Calculus', 'Second-Order Differential Equations'],
    route: 'calc3',
  },
]

// The two-digit values are application/content identifiers, not textbook
// chapter numbers. Keep that distinction explicit wherever these appear.
export const courseChapterMappings = Object.freeze([
  {
    id: '01',
    chapterLabel: 'CHAPTER 7',
    title: 'Integration Techniques',
    status: 'planned',
  },
  {
    id: '02',
    chapterLabel: 'CHAPTER 8',
    title: 'Applications of Integrals',
    status: 'planned',
  },
  {
    id: '03',
    chapterLabel: 'CHAPTER 9',
    title: 'Parametric & Polar Calculus',
    status: 'planned',
  },
  {
    id: '04',
    chapterLabel: null,
    title: 'Sequences & Series',
    status: 'planned',
  },
  {
    id: '05',
    chapterLabel: 'CHAPTER 12',
    title: 'VECTORS AND THE GEOMETRY OF SPACE',
    status: 'available',
  },
])

const chapter12Mapping = courseChapterMappings.find(({ id }) => id === '05')
const calculus2Chapters = [
  { id:'chapter-6',chapterLabel:'CHAPTER 6',title:'Inverse Functions, Exponential and Logarithmic Functions',status:'available',subchapters:['Exponential Growth and Decay','Inverse Trigonometric Functions','Hyperbolic Functions','Limits'] },
  { ...chapter12Mapping,title:'VECTORS AND THE GEOMETRY OF SPACE',subchapters:['Three-Dimensional Coordinate Systems','Vectors','Dot Product','Cross Product','Lines and Planes','Cylinders and Quadric Surfaces'] },
  { id:'chapter-7',chapterLabel:'CHAPTER 7',title:'Integration Techniques',status:'planned',subchapters:[] },
  { id:'chapter-8',chapterLabel:'CHAPTER 8',title:'Applications of Integrals',status:'planned',subchapters:[] },
  { id:'chapter-9',chapterLabel:'CHAPTER 9',title:'Parametric and Polar Calculus',status:'planned',subchapters:[] },
  { id:'chapter-10',chapterLabel:'CHAPTER 10',title:'Sequences and Series',status:'planned',subchapters:[] },
  { id:'chapter-11',chapterLabel:'CHAPTER 11',title:'Power Series',status:'planned',subchapters:[] },
]
const calculus3Chapters = [
  { ...chapter12Mapping,title:'VECTORS AND THE GEOMETRY OF SPACE',subchapters:['Three-Dimensional Coordinate Systems','Vectors','Dot Product','Cross Product','Lines and Planes','Cylinders and Quadric Surfaces'] },
  { id:'vector-functions',chapterLabel:'CHAPTER 13',title:'Vector Functions',status:'planned',subchapters:[] },
  { id:'partial-derivatives',chapterLabel:'CHAPTER 14',title:'Partial Derivatives',status:'planned',subchapters:[] },
  { id:'multiple-integrals',chapterLabel:'CHAPTER 15',title:'Multiple Integrals',status:'planned',subchapters:[] },
  { id:'vector-calculus',chapterLabel:'CHAPTER 16',title:'Vector Calculus',status:'planned',subchapters:[] },
  { id:'second-order-differential-equations',chapterLabel:'CHAPTER 17',title:'Second-Order Differential Equations',status:'planned',subchapters:[] },
]

export const courseProfiles = Object.freeze({
  calc2: {
    ...courses[0],
    eyebrow: 'MATH 243 course home',
    introduction: 'Build strategic integration skills, model geometric and physical applications, and develop the infinite-process thinking used in sequences and series.',
    roadmap: ['Fundamental Review', 'Integration & Applications', 'Parametric & Polar', 'Sequences & Series', 'Vectors & 3D Space'],
    chapters: calculus2Chapters,
    continueLabel: 'Continue to Chapter 12',
  },
  calc3: {
    ...courses[1],
    eyebrow: 'MATH 344 course home',
    introduction: 'Extend single-variable calculus into space through vectors, three-dimensional geometry, multivariable functions, multiple integration, and vector calculus.',
    roadmap: ['Fundamental Review', 'Vectors and the Geometry of Space', 'Vector Functions', 'Partial Derivatives', 'Multiple Integrals', 'Vector Calculus', 'Second-Order Differential Equations'],
    chapters: calculus3Chapters,
    continueLabel: 'Continue to Chapter 12',
  },
})

export function getCourseProfile(courseId) {
  return courseProfiles[courseId] || courseProfiles.calc2
}
