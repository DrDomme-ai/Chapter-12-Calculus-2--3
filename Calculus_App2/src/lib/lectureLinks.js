// Simple mapping from lecture identifiers or titles to instructor lecture routes
export function getInstructorRouteForLecture(lecture) {
  if (!lecture) return null
  const id = (lecture.id || '').toString().toLowerCase()
  const title = (lecture.title || '').toString().toLowerCase()

  if (id.includes('real') || title.includes('real numbers') || title.includes('real numbers & algebra')) return '#/instructor/real-numbers'
  // add future mappings here

  return null
}
