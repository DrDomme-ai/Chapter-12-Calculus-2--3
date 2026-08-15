import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'

export default function PointProjectionLab3D({ target = null, projectionMode = false }) {
  const [point, setPoint] = useState(target || {x:-1,y:2,z:-3})
  const [projection, setProjection] = useState('xy')
  const [feedback, setFeedback] = useState('')
  const projected = { xy:[point.x,point.y,0], yz:[0,point.y,point.z], xz:[point.x,0,point.z] }[projection]
  const data = useMemo(() => {
    const path = { type:'scatter3d',mode:'lines+markers',x:[0,point.x,point.x,point.x],y:[0,0,point.y,point.y],z:[0,0,0,point.z],line:{color:'#0d766e',width:7},marker:{size:3,color:'#0d766e'},hoverinfo:'skip',showlegend:false }
    const p = { type:'scatter3d',mode:'markers+text',x:[point.x],y:[point.y],z:[point.z],marker:{size:8,color:'#243b53'},text:[`P (${point.x}, ${point.y}, ${point.z})`],textposition:'top center',showlegend:false }
    if (!projectionMode) return [path,p]
    return [p,{type:'scatter3d',mode:'lines+markers+text',x:[point.x,projected[0]],y:[point.y,projected[1]],z:[point.z,projected[2]],line:{color:'#d99a3b',width:6,dash:'dash'},marker:{size:[2,7],color:'#d99a3b'},text:['',`(${projected.join(', ')})`],textposition:'bottom center',showlegend:false}]
  },[point,projected,projectionMode])
  const check = () => { if (!target) return; const differences = ['x','y','z'].filter(axis => point[axis] !== target[axis]); setFeedback(differences.length === 0 ? `Correct — the point has ${target.x<0?'negative':'positive'} x, ${target.y<0?'negative':'positive'} y, and ${target.z<0?'negative':'positive'} z.` : `Move ${differences.map(axis => `${axis} ${point[axis] < target[axis] ? 'higher' : 'lower'}`).join(', ')}.`) }
  return <div className="point-lab"><div className="plot-wrap"><Plot data={data} layout={{autosize:true,margin:{l:0,r:0,t:0,b:0},paper_bgcolor:'#fffdf8',scene:{aspectmode:'cube',camera:{eye:{x:1.45,y:1.45,z:1.2}},xaxis:{title:'x',range:[-6,6]},yaxis:{title:'y',range:[-6,6]},zaxis:{title:'z',range:[-6,6]}}}} config={{responsive:true,displaylogo:false,scrollZoom:true}} useResizeHandler style={{width:'100%',height:'100%'}} /></div>{projectionMode ? <div className="projection-controls">{['xy','yz','xz'].map(name => <button type="button" className={projection===name?'active':''} onClick={()=>setProjection(name)} key={name}>Project onto {name}</button>)}<p>Coordinate made zero: <strong>{projection==='xy'?'z':projection==='yz'?'x':'y'} = 0</strong></p></div> : <div className="point-controls">{['x','y','z'].map(axis => <label key={axis}>{axis}<input type="number" min="-6" max="6" value={point[axis]} onChange={e=>setPoint({...point,[axis]:Number(e.target.value)})}/><input type="range" min="-6" max="6" value={point[axis]} onChange={e=>setPoint({...point,[axis]:Number(e.target.value)})}/></label>)}{target && <button type="button" onClick={check}>Check Position</button>}{feedback && <p role="status" className={feedback.startsWith('Correct')?'correct':'try-again'}>{feedback}</p>}</div>}</div>
}

