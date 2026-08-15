import { useRef } from 'react'
import HeroSection from './home/HeroSection'
import CourseCard from './home/CourseCard'
import ReadinessCallout from './home/ReadinessCallout'
import LearningMethods from './home/LearningMethods'
import { courses } from './home/courseData'

function CourseHome({ onSelectCourse, onStartReview, onOpenReadiness }) {
  const courseSectionRef = useRef(null)
  const openReview = onStartReview || onOpenReadiness

  const scrollToCourses = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page home-page">
      <HeroSection onScrollToCourses={scrollToCourses} onOpenReadiness={openReview} />

      <ReadinessCallout onOpenReadiness={openReview} />

      <section ref={courseSectionRef} className="course-section" aria-labelledby="choose-course">
        <div className="section-heading">
          <p className="eyebrow">Choose your course</p>
          <h2 id="choose-course">Choose your course</h2>
          <p>
            Enter MATH 243 or MATH 344 to continue into the course curriculum.
          </p>
        </div>
        <div className="course-grid course-grid--home">
          {courses.map((card) => (
            <CourseCard
              key={card.title}
              code={card.code}
              title={card.title}
              descriptor={card.descriptor}
              description={card.description}
              path={card.path}
              actionLabel={card.actionLabel}
              onBegin={() => onSelectCourse?.(card.route)}
            />
          ))}
        </div>
      </section>

      <LearningMethods />
    </div>
  )
}

export default CourseHome
