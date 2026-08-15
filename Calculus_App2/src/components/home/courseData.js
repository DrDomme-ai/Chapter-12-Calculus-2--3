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
    descriptor: 'Vectors • Multivariable Calculus • Vector Calculus',
    description: 'Vectors, three-dimensional geometry, vector-valued functions, multivariable calculus, multiple integration, and vector calculus.',
    path: ['Fundamental Review', 'Chapter 12', 'Vector Functions', 'Partial Derivatives', 'Multiple Integrals', 'Vector Calculus'],
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
    title: 'VECTORS & 3D SPACE',
    status: 'available',
  },
])

const chapter12Mapping = courseChapterMappings.find(({ id }) => id === '05')

export const courseProfiles = Object.freeze({
  calc2: {
    ...courses[0],
    eyebrow: 'MATH 243 course home',
    introduction: 'Build strategic integration skills, model geometric and physical applications, and develop the infinite-process thinking used in sequences and series.',
    roadmap: ['Fundamental Review', 'Integration & Applications', 'Parametric & Polar', 'Sequences & Series', 'Vectors & 3D Space'],
    chapters: courseChapterMappings,
    continueLabel: 'Continue to Chapter 12',
  },
  calc3: {
    ...courses[1],
    eyebrow: 'MATH 344 course home',
    introduction: 'Extend single-variable calculus into space through vectors, three-dimensional geometry, multivariable functions, multiple integration, and vector calculus.',
    roadmap: ['Fundamental Review', 'Vectors & 3D Space', 'Vector Functions', 'Partial Derivatives', 'Multiple Integrals', 'Vector Calculus'],
    chapters: [
      chapter12Mapping,
      { id: 'vector-functions', chapterLabel: null, title: 'Vector Functions', status: 'planned' },
      { id: 'partial-derivatives', chapterLabel: null, title: 'Partial Derivatives', status: 'planned' },
      { id: 'multiple-integrals', chapterLabel: null, title: 'Multiple Integrals', status: 'planned' },
      { id: 'vector-calculus', chapterLabel: null, title: 'Vector Calculus', status: 'planned' },
    ],
    continueLabel: 'Continue to Chapter 12',
  },
})

export function getCourseProfile(courseId) {
  return courseProfiles[courseId] || courseProfiles.calc2
}
