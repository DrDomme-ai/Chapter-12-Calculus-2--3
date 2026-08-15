import AdditionAnimation from '../../components/animations/AddtionAnimation'
import NumberSystemExplorer from '../../components/review/algebra/NumberSystemExplorer'
import RealNumberLine from '../../components/review/algebra/RealNumberLine'
import FieldExplorer from './FieldExplorer'
import NumberSystemStory from './NumberSystemStory'
import AngleRadiansExplorer from '../../components/review/trigonometry/AngleRadiansExplorer'
import InteractiveUnitCircle from '../../components/review/trigonometry/InteractiveUnitCircle'
import ExactValuePractice from '../../components/review/trigonometry/ExactValuePractice'
import { HyperbolicExplorer, InverseTrigExplorer } from './TrigAdvancedExplorers'
import LectureHooks from './LectureHooks'

export function RegisteredComponent({componentKey,revealCount=0,settings={}}) {
  if(componentKey==='additionAnimation') return <AdditionAnimation {...settings}/>
  if(componentKey==='numberSystemExplorer') return <NumberSystemExplorer {...settings}/>
  if(componentKey==='realNumberLine') return <RealNumberLine {...settings}/>
  if(componentKey==='angleExplorer') return <AngleRadiansExplorer {...settings}/>
  if(componentKey==='unitCircleExplorer') return <InteractiveUnitCircle {...settings}/>
  if(componentKey==='exactValuePractice') return <ExactValuePractice {...settings}/>
  if(componentKey==='inverseTrigExplorer') return <InverseTrigExplorer {...settings}/>
  if(componentKey==='hyperbolicExplorer') return <HyperbolicExplorer {...settings}/>
  if(componentKey==='fieldTester'||componentKey==='field:tester') return <FieldExplorer stage="tester" revealCount={revealCount}/>
  const story={naturalAddition:'natural-addition',integerSubtraction:'integer-explorer',rationalReciprocal:'rational-inverse'}[componentKey]
  if(story)return <NumberSystemStory stage={story} revealCount={revealCount}/>
  if(componentKey?.startsWith('number-story:'))return <NumberSystemStory stage={componentKey.split(':')[1]} revealCount={revealCount}/>
  if(componentKey?.startsWith('field:'))return <FieldExplorer stage={componentKey.split(':')[1]} revealCount={revealCount}/>
  if(componentKey?.startsWith('lecture-hook:'))return <LectureHooks stage={componentKey.split(':')[1]}/>
  return <div className="editor-placeholder"><strong>{componentKey||'Custom component'}</strong><span>Registered lecture component</span></div>
}
