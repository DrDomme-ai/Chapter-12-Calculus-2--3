import { lazy, Suspense, useEffect, useState } from 'react'
import Layout from './components/Layout'
import CourseHome from './components/CourseHome'
import CourseOverview from './components/CourseOverview'
import ChapterMenu from './components/ChapterMenu'
import FundamentalReviewPage from './components/review/FundamentalReviewPage'
import StudentProjectSystem from './project/StudentProjectSystem'
import usePersistentState from './hooks/usePersistentState'
import StudentFeedbackPrompt from './components/feedback/StudentFeedbackPrompt'
import { continuityReview, derivativesReview, derivativeApplicationsReview, integralFoundationsReview } from './data/courseReviews/calculus1'
import './App.css'

const Lecture1201 = lazy(() => import('./lectures/chapter12/Lecture1201'))
const LectureJsonPage = lazy(() => import('./lectures/chapter12/LectureJsonPage'))
const TrigonometryReview = lazy(() => import('./reviews/fundamental/TrigonometryReview'))
const AnglesRadiansLesson = lazy(() => import('./reviews/fundamental/AnglesRadiansLesson'))
const UnitCircleLesson = lazy(() => import('./reviews/fundamental/UnitCircleLesson'))
const SixTrigFunctionsLesson = lazy(() => import('./reviews/fundamental/SixTrigFunctionsLesson'))
const CofunctionLesson = lazy(() => import('./reviews/fundamental/CofunctionLesson'))
const AdvancedTrigLesson = lazy(() => import('./reviews/fundamental/AdvancedTrigLesson'))
const TrigReadinessReview = lazy(() => import('./reviews/calculus2/TrigReadinessReview'))
const LimitsReadinessReview = lazy(() => import('./reviews/calculus2/LimitsReadinessReview'))
const ExpLogReadinessReview = lazy(() => import('./reviews/calculus2/ExpLogReadinessReview'))
const Calculus1EditableReview = lazy(() => import('./reviews/fundamental/Calculus1EditableReview'))
const HyperbolicStudyLecture = lazy(() => import('./reviews/calculus2/HyperbolicStudyLecture'))
const Chapter6LearningLibrary = lazy(() => import('./reviews/calculus2/Chapter6LearningLibrary'))
const Chapter12Review = lazy(() => import('./reviews/calc3/Chapter12Review'))
const AlgebraReview = lazy(() => import('./reviews/fundamental/AlgebraReview'))
const InstructorHome = lazy(() => import('./instructor/InstructorHome'))
const LectureStudio = lazy(() => import('./instructor/LectureStudio'))
const LiveInstructor = lazy(() => import('./reviews/instructor/LiveInstructor'))
const LiveStudent = lazy(() => import('./reviews/instructor/LiveStudent'))
const MockLiveInstructor = lazy(() => import('./reviews/instructor/MockLiveInstructor'))
const MockLiveStudent = lazy(() => import('./reviews/instructor/MockLiveStudent'))

const courseLabels = {
  calc2: 'MATH 243 · Calculus II',
  calc3: 'MATH 344 · Calculus III',
}

const defaultReviewProgress = {
  algebra: {},
  functions: {},
  trig: {},
  trigAngles: {},
  trigUnitCircle: {},
  trigSixFunctions: {},
  trigCofunctions: {},
  trigAdvanced: {},
  limits: {},
  continuity: {},
  derivatives: {},
  derivativeApplications: {},
  integrals: {},
  expLog: {},
  integrationTechniques: {},
  parametric: {},
  polar: {},
  series: {},
  taylorSeries: {},
  // Preserved for compatibility with progress saved by earlier builds.
  calc3: {},
}

const reviewFeedbackTitles={
  'fundamental-algebra':'Algebra Review','calc2-trig':'Trigonometry Review','trig-angles-radians':'Angles and Radians','trig-unit-circle':'Unit Circle','trig-six-functions':'Six Trigonometric Functions','trig-cofunctions':'Cofunction Relationships','trig-readiness-practice':'Trigonometry Practice','calc2-limits':'Limits Review','calc2-derivatives':'Derivatives Review','calc2-exp-log':'Exponential, Logarithmic, and Inverse Trig Review',
}
const isReviewModuleView=(view)=>view==='fundamental-algebra'||view.startsWith('trig-')||view.startsWith('calc2-')||view.startsWith('calc3-')

function scrollAndFocusMain() {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  window.requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
}

const routeByView = {
  home: '/',
  'review-path': '/review',
  project: '/project',
  chapter: '/chapter-12',
  'lecture-12-1': '/chapter-12/12-1',
  'lecture-json': '/chapter-12/data-demo',
  instructor: '/instructor',
}

const sharedReviewPaths = {
  'fundamental-algebra': 'algebra',
  'calc2-trig': 'trigonometry',
  'trig-angles-radians': 'trigonometry/angles-radians',
  'trig-unit-circle': 'trigonometry/unit-circle',
  'trig-six-functions': 'trigonometry/six-functions',
  'trig-cofunctions': 'trigonometry/cofunctions',
  'trig-advanced-pythagorean-identities':'trigonometry/pythagorean-identities',
  'trig-advanced-symmetry':'trigonometry/symmetry',
  'trig-advanced-graphs':'trigonometry/graphs',
  'trig-advanced-periodicity':'trigonometry/periodicity',
  'trig-advanced-transformations':'trigonometry/transformations',
  'trig-advanced-angle-identities':'trigonometry/angle-identities',
  'trig-advanced-combined-sinusoid':'trigonometry/combined-sinusoid',
  'trig-advanced-inverse-trig':'trigonometry/inverse-trig',
  'hyperbolic-study':'trigonometry/hyperbolic',
  'trig-readiness-practice': 'trigonometry/practice',
  'calc2-limits': 'calculus-i/limits',
  'calc2-continuity': 'calculus-i/continuity',
  'calc2-derivatives': 'calculus-i/derivatives',
  'calc2-derivative-applications': 'calculus-i/applications-of-derivatives',
  'calc2-integrals': 'calculus-i/integral-foundations',
  'calc2-exp-log': 'calculus-i/exp-log-inverse-trig',
}

const legacyReviewPaths = {
  trigonometry: 'calc2-trig',
  limits: 'calc2-limits',
  derivatives: 'calc2-derivatives',
  'exp-log-inverse-trig': 'calc2-exp-log',
}

function getCombinedTrigProgress(progress) {
  const combined = { ...(progress.trig || {}) }
  const lessonGoals = [
    ['angles-practice', progress.trigAngles?.practice],
    ['angles-mastery', progress.trigAngles?.mastery],
    ['unit-circle-exact-practice', progress.trigUnitCircle?.exactPractice],
    ['unit-circle-guided-practice', progress.trigUnitCircle?.practice],
    ['unit-circle-mastery', progress.trigUnitCircle?.mastery],
    ['six-functions-reviewed', progress.trigSixFunctions?.reviewed],
    ['cofunctions-reviewed', progress.trigCofunctions?.reviewed],
  ]

  lessonGoals.forEach(([key, complete]) => {
    if (complete) combined[key] = true
  })
  return combined
}

function getRouteHash(view, courseId) {
  if (view.startsWith('chapter-12-review-')) return `#/${courseId || 'calc3'}/chapter-12/review/${view.replace('chapter-12-review-','')}`
  if (sharedReviewPaths[view]) return `#/review/${sharedReviewPaths[view]}`
  if (view === 'course-home') return `#/${courseId || 'calc2'}`
  if (view === 'chapter-6-library') return '#/calc2/chapter-6'
  if (view === 'chapter' || view.startsWith('lecture-')) {
    return `#/${courseId || 'calc2'}${routeByView[view]}`
  }
  if (view === 'instructor') return `#${routeByView[view] || '/instructor'}`
  if (view === 'instructor-real-numbers') return '#/instructor/real-numbers'
  return `#${routeByView[view] || '/'}`
}

function parseRouteHash(hash) {
  const rawPath = hash.replace(/^#/, '') || '/'
  const [path,queryString=''] = rawPath.split('?')
  const query=new URLSearchParams(queryString)
  const sharedEntry = Object.entries(sharedReviewPaths).find(([, slug]) => path === `/review/${slug}`)
  const courseMatch = path.match(/^\/(calc2|calc3)(?:\/|$)/)
  const parsedCourseId = courseMatch?.[1] || null
  const legacyReviewMatch = path.match(/^\/(calc2|calc3)\/review\/(trigonometry|limits|derivatives|exp-log-inverse-trig)$/)

  if (sharedEntry) return { view: sharedEntry[0], courseId: null }
  if (legacyReviewMatch) return { view: legacyReviewPaths[legacyReviewMatch[2]], courseId: null }
  if (path === '/calc2/review' || path === '/calc3/review' || path === '/review-center') {
    return { view: 'review-path', courseId: null }
  }
  if (path === '/instructor') return { view: 'instructor', courseId: null }
  if (path === '/instructor/live') return { view: 'instructor-live', courseId: null }
  if (path.startsWith('/instructor/join')) return { view: 'instructor-join', courseId: null }
  if (path === '/instructor/mock/live') return { view: 'instructor-mock-live', courseId: null }
  if (path === '/instructor/mock/join') return { view: 'instructor-mock-join', courseId: null }
  if (path === '/student') return { view: 'instructor-mock-join', courseId: null, joinCode: query.get('code')||'' }
  const instructorLectureMatch = path.match(/^\/instructor\/lectures\/([^/]+)\/(edit|presenter|live)$/)
  if (instructorLectureMatch) return { view: 'instructor-lecture', courseId: null, lectureId: decodeURIComponent(instructorLectureMatch[1]), lectureMode: instructorLectureMatch[2] }
  // Legacy student links remain readable, but all newly shared links use the
  // canonical public /student route above.
  const joinMatch = path.match(/^\/join\/(.+)$/)
  const mockJoinMatch = path.match(/^\/instructor\/mock\/join\/(.+)$/)
  if (joinMatch) return { view: 'instructor-mock-join', courseId: null, joinCode: decodeURIComponent(joinMatch[1]) }
  if (mockJoinMatch) return { view: 'instructor-mock-join', courseId: null, joinCode: decodeURIComponent(mockJoinMatch[1]) }
  if (/^\/(calc2|calc3)\/chapter-12\/12-1$/.test(path)) return { view: 'lecture-12-1', courseId: parsedCourseId }
  if (/^\/(calc2|calc3)\/chapter-12\/data-demo$/.test(path)) return { view: 'lecture-json', courseId: parsedCourseId }
  const chapter12ReviewMatch=path.match(/^\/(calc2|calc3)\/chapter-12\/review\/(12-[1-6])$/)
  if(chapter12ReviewMatch)return {view:`chapter-12-review-${chapter12ReviewMatch[2]}`,courseId:parsedCourseId}
  if (/^\/(calc2|calc3)\/chapter-12$/.test(path)) return { view: 'chapter', courseId: parsedCourseId }
  if (path === '/calc2/chapter-6') return { view: 'chapter-6-library', courseId: 'calc2' }
  if (path === '/calc2' || path === '/calc3') return { view: 'course-home', courseId: parsedCourseId }
  if (path === '/review') return { view: 'review-path', courseId: null }
  if (path === '/project') return { view: 'project', courseId: null }
  return { view: 'home', courseId: null }
}

// A small hash router provides refresh-safe URLs and browser back/forward
// navigation without adding a routing dependency during the foundation phase.
function App() {
  const initialRoute = parseRouteHash(window.location.hash)
  const [view, setView] = useState(initialRoute.view)
  const [courseId, setCourseId] = useState(initialRoute.courseId)
  const [joinCodeParam, setJoinCodeParam] = useState(initialRoute.joinCode || '')
  const [instructorLecture, setInstructorLecture] = useState({ id: initialRoute.lectureId || 'real-numbers', mode: initialRoute.lectureMode || 'edit' })
  const [reviewProgress, setReviewProgress] = usePersistentState(
    'interactive-calculus:review-progress',
    defaultReviewProgress,
    { version: 1 },
  )
  const [user, setUser] = useState({ role: 'student' })
  const course = courseLabels[courseId] || ''
  const sharedReviewProgress = {
    ...reviewProgress,
    trig: getCombinedTrigProgress(reviewProgress),
  }

  useEffect(() => {
    const syncFromHistory = () => {
      const route = parseRouteHash(window.location.hash)
      setView(route.view)
      setCourseId(route.courseId)
      setJoinCodeParam(route.joinCode || '')
      if (route.lectureId) setInstructorLecture({ id: route.lectureId, mode: route.lectureMode || 'edit' })
      scrollAndFocusMain()
    }

    window.addEventListener('popstate', syncFromHistory)
    return () => window.removeEventListener('popstate', syncFromHistory)
  }, [])

  const navigate = (requestedView, nextCourseId = courseId) => {
    const nextView=requestedView==='trig-advanced-hyperbolic'?'hyperbolic-study':requestedView
    const nextHash = getRouteHash(nextView, nextCourseId)
    if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash)
    setCourseId(nextCourseId)
    setView(nextView)
    scrollAndFocusMain()
  }

  const openCourse = (selectedCourseId) => {
    navigate('course-home', selectedCourseId)
  }

  const updateProgress = (key, value) => {
    setReviewProgress((current) => ({ ...current, [key]: value }))
  }
  const navigationSection = view === 'home'
    ? 'home'
    : view === 'project'
      ? 'project'
      : view === 'review-path' || view.includes('review') || view.includes('practice') || view.startsWith('trig-') || view.startsWith('calc2-') || view.startsWith('calc3-')
        ? 'review-path'
        : undefined

  return (
    <Layout
      onHome={() => navigate('home', null)}
      onReview={() => navigate('review-path', null)}
      onProject={() => navigate('project', null)}
      onInstructor={() => navigate('instructor', null)}
      activeView={navigationSection}
    >
      {view === 'home' && (
        <CourseHome
          onSelectCourse={openCourse}
          onStartReview={() => navigate('review-path', null)}
        />
      )}
      {view === 'review-path' && (
        <FundamentalReviewPage
          progress={sharedReviewProgress}
          onHome={() => navigate('home', null)}
          onOpenModule={(routeId) => navigate(routeId, null)}
          onOpenCourse={openCourse}
        />
      )}
      {view === 'course-home' && (
        <CourseOverview
          courseId={courseId || 'calc2'}
          reviewProgress={sharedReviewProgress}
          onHome={() => navigate('home', null)}
          onOpenReview={() => navigate('review-path', null)}
          onOpenChapter={() => navigate('chapter', courseId || 'calc2')}
          onOpenChapter6={() => navigate('chapter-6-library','calc2')}
          onOpenProject={() => navigate('project', null)}
        />
      )}
      {view === 'project' && <StudentProjectSystem onHome={() => navigate('home', null)} />}
      {view==='chapter-6-library'&&<Suspense fallback={<div className="lecture-loading" role="status">Preparing the complete Chapter 6 learning library…</div>}><Chapter6LearningLibrary onBack={()=>navigate('course-home','calc2')}/></Suspense>}

      {view === 'fundamental-algebra' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the Algebra review…</div>}>
          <AlgebraReview
            completed={reviewProgress.algebra}
            onCompletedChange={(value) => updateProgress('algebra', value)}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
          />
        </Suspense>
      )}
      {view === 'review-path' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the Review…</div>}>
          <FundamentalReviewPage
            progress={sharedReviewProgress}
            onHome={() => navigate('home', null)}
            onOpenModule={(routeId) => navigate(routeId, null)}
            onOpenCourse={openCourse}
            onOpenInstructor={() => navigate('instructor', null)}
          />
        </Suspense>
      )}

      {view === 'calc2-trig' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the trigonometry review…</div>}>
          <TrigonometryReview
            completed={sharedReviewProgress.trig}
            totalActivities={25}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
            onPrevious={() => navigate('fundamental-algebra', null)}
            onNext={() => navigate('calc2-limits', null)}
            onOpenAngles={() => navigate('trig-angles-radians', null)}
            onOpenUnitCircle={() => navigate('trig-unit-circle', null)}
            onOpenSixFunctions={() => navigate('trig-six-functions', null)}
            onOpenCofunctions={() => navigate('trig-cofunctions', null)}
            onOpenModule={(id) => navigate(id==='hyperbolic'?'hyperbolic-study':`trig-advanced-${id}`,null)}
            onOpenPractice={() => navigate('trig-readiness-practice', null)}
          />
        </Suspense>
      )}
      {view === 'trig-angles-radians' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the angle and radian lesson…</div>}>
          <AnglesRadiansLesson
            completed={reviewProgress.trigAngles}
            onCompletedChange={(value) => updateProgress('trigAngles', value)}
            onOverview={() => navigate('calc2-trig', null)}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
            onNext={() => navigate('trig-unit-circle', null)}
            onPractice={() => navigate('trig-readiness-practice', null)}
          />
        </Suspense>
      )}
      {view === 'trig-unit-circle' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the interactive unit circle…</div>}>
          <UnitCircleLesson
            completed={reviewProgress.trigUnitCircle}
            onCompletedChange={(value) => updateProgress('trigUnitCircle', value)}
            onOverview={() => navigate('calc2-trig', null)}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
            onPrevious={() => navigate('trig-angles-radians', null)}
            onNext={() => navigate('trig-six-functions', null)}
            onPractice={() => navigate('trig-readiness-practice', null)}
          />
        </Suspense>
      )}
      {view === 'trig-six-functions' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the six trigonometric functions lesson…</div>}>
          <SixTrigFunctionsLesson
            completed={reviewProgress.trigSixFunctions}
            onCompletedChange={(value) => updateProgress('trigSixFunctions', value)}
            onOverview={() => navigate('calc2-trig', null)}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
            onPrevious={() => navigate('trig-unit-circle', null)}
            onNext={() => navigate('trig-cofunctions', null)}
          />
        </Suspense>
      )}
      {view === 'trig-cofunctions' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the cofunction relationships lesson…</div>}>
          <CofunctionLesson
            completed={reviewProgress.trigCofunctions}
            onCompletedChange={(value) => updateProgress('trigCofunctions', value)}
            onOverview={() => navigate('calc2-trig', null)}
            onReviewHome={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
            onPrevious={() => navigate('trig-six-functions', null)}
            onNext={() => navigate('calc2-trig', null)}
          />
        </Suspense>
      )}
      {view === 'trig-readiness-practice' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the trigonometry practice…</div>}>
          <TrigReadinessReview
            completed={reviewProgress.trig}
            onCompletedChange={(value) => updateProgress('trig', value)}
            onReviewCenter={() => navigate('calc2-trig', null)}
            onHome={() => navigate('home', null)}
            backLabel="Trigonometry Overview"
          />
        </Suspense>
      )}
      {view.startsWith('trig-advanced-')&&(()=>{const lessonId=view.replace('trig-advanced-',''),order=['pythagorean-identities','symmetry','graphs','periodicity','transformations','angle-identities','combined-sinusoid','inverse-trig','hyperbolic'],position=order.indexOf(lessonId);return <Suspense fallback={<div className="lecture-loading" role="status">Preparing the interactive trigonometry lesson…</div>}><AdvancedTrigLesson lessonId={lessonId} completed={reviewProgress.trigAdvanced} onCompletedChange={(value)=>updateProgress('trigAdvanced',value)} onOverview={()=>navigate('calc2-trig',null)} onHome={()=>navigate('home',null)} onPrevious={()=>navigate(position>0?`trig-advanced-${order[position-1]}`:'calc2-trig',null)} onNext={()=>navigate(position<order.length-1?`trig-advanced-${order[position+1]}`:'calc2-trig',null)}/></Suspense>})()}
      {view==='hyperbolic-study'&&<Suspense fallback={<div className="lecture-loading" role="status">Preparing the complete Hyperbolic Functions lecture…</div>}><HyperbolicStudyLecture completed={reviewProgress.trigAdvanced} onCompletedChange={(value)=>updateProgress('trigAdvanced',value)} onOverview={()=>navigate('calc2-trig',null)} onHome={()=>navigate('home',null)}/></Suspense>}
      {view === 'calc2-limits' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the limits review…</div>}>
          <LimitsReadinessReview
            completed={reviewProgress.limits}
            onCompletedChange={(value) => updateProgress('limits', value)}
            onReviewCenter={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
          />
        </Suspense>
      )}
      {view === 'calc2-derivatives' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the derivatives review…</div>}>
          <Calculus1EditableReview
            review={derivativesReview}
            completed={reviewProgress.derivatives}
            onCompletedChange={(value) => updateProgress('derivatives', value)}
            onReviewCenter={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
          />
        </Suspense>
      )}
      {view === 'calc2-continuity' && <Suspense fallback={<div className="lecture-loading" role="status">Preparing the continuity review…</div>}><Calculus1EditableReview review={continuityReview} completed={reviewProgress.continuity} onCompletedChange={(value)=>updateProgress('continuity',value)} onReviewCenter={()=>navigate('review-path',null)} onHome={()=>navigate('home',null)}/></Suspense>}
      {view === 'calc2-derivative-applications' && <Suspense fallback={<div className="lecture-loading" role="status">Preparing derivative applications…</div>}><Calculus1EditableReview review={derivativeApplicationsReview} completed={reviewProgress.derivativeApplications} onCompletedChange={(value)=>updateProgress('derivativeApplications',value)} onReviewCenter={()=>navigate('review-path',null)} onHome={()=>navigate('home',null)}/></Suspense>}
      {view === 'calc2-integrals' && <Suspense fallback={<div className="lecture-loading" role="status">Preparing integral foundations…</div>}><Calculus1EditableReview review={integralFoundationsReview} completed={reviewProgress.integrals} onCompletedChange={(value)=>updateProgress('integrals',value)} onReviewCenter={()=>navigate('review-path',null)} onHome={()=>navigate('home',null)}/></Suspense>}
      {view === 'calc2-exp-log' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the exponential and logarithmic review…</div>}>
          <ExpLogReadinessReview
            completed={reviewProgress.expLog}
            onCompletedChange={(value) => updateProgress('expLog', value)}
            onReviewCenter={() => navigate('review-path', null)}
            onHome={() => navigate('home', null)}
          />
        </Suspense>
      )}

      {view === 'chapter' && (
        <ChapterMenu
          course={course}
          onBack={() => navigate('course-home', courseId || 'calc2')}
          backLabel="Course Home"
          onOpenLecture={() => navigate('lecture-12-1')}
          onOpenJsonDemo={() => navigate('lecture-json')}
          onOpenReview={() => navigate('chapter-12-review-12-1', courseId || 'calc3')}
          reviewLabel="Open complete Chapter 12 review"
        />
      )}
      {view === 'lecture-12-1' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the interactive lecture…</div>}>
          <Lecture1201 course={course} onHome={() => navigate('home')} onChapterMenu={() => navigate('chapter')} />
        </Suspense>
      )}
      {view === 'lecture-json' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading the JSON lecture…</div>}>
          <LectureJsonPage
            course={course}
            onHome={() => navigate('home')}
            onChapterMenu={() => navigate('chapter')}
            user={user}
            onChangeRole={(role) => setUser({ role })}
          />
        </Suspense>
      )}
      {view.startsWith('chapter-12-review-')&&(
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing the complete Chapter 12 review…</div>}>
          <Chapter12Review sectionId={view.replace('chapter-12-review-','')} onBack={()=>navigate('chapter',courseId||'calc3')} onOpenSection={(id)=>navigate(`chapter-12-review-${id}`,courseId||'calc3')}/>
        </Suspense>
      )}
      {view === 'instructor' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading Instructor Lectures…</div>}>
          <InstructorHome
            onHome={() => navigate('home', null)}
            onJoin={() => { window.location.hash = '#/student' }}
            onOpenLecture={(id, mode) => {
              setInstructorLecture({ id, mode })
              window.history.pushState(null, '', `#/instructor/lectures/${id}/${mode}`)
              setView('instructor-lecture')
              scrollAndFocusMain()
            }}
          />
        </Suspense>
      )}
      {view === 'instructor-lecture' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Preparing Instructor Lecture…</div>}>
          <LectureStudio key={`${instructorLecture.id}-${instructorLecture.mode}`} lectureId={instructorLecture.id} initialMode={instructorLecture.mode} onBack={() => navigate('instructor', null)} />
        </Suspense>
      )}
      {view === 'instructor-live' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading Instructor live session…</div>}>
          <LiveInstructor />
        </Suspense>
      )}
      {view === 'instructor-join' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading Student join…</div>}>
          <LiveStudent />
        </Suspense>
      )}
      {view === 'instructor-mock-live' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading instructor live session…</div>}>
          <MockLiveInstructor />
        </Suspense>
      )}
      {view === 'instructor-mock-join' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading student join…</div>}>
          <MockLiveStudent joinCodeProp={joinCodeParam} />
        </Suspense>
      )}
      {view === 'instructor-real-numbers' && (
        <Suspense fallback={<div className="lecture-loading" role="status">Loading Real Numbers lecture…</div>}>
          <LectureStudio lectureId="real-numbers" initialMode="edit" onBack={() => navigate('instructor', null)} />
        </Suspense>
      )}
      {isReviewModuleView(view)&&<StudentFeedbackPrompt moduleId={`review:${view}`} moduleTitle={reviewFeedbackTitles[view]||view.replaceAll('-',' ')}/>}
    </Layout>
  )
}

export default App
