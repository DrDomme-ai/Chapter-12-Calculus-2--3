import LectureView from '../../components/LectureView'
import lectureData from './chapter12.json'

export default function LectureJsonPage({ onHome, onChapterMenu, user, onChangeRole }) {
  return (
    <LectureView
      lecture={lectureData}
      user={user}
      onHome={onHome}
      onChapterMenu={onChapterMenu}
      onChangeRole={onChangeRole}
    />
  )
}
