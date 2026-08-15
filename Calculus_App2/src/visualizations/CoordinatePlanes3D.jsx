import { useState } from 'react'
import Plot from 'react-plotly.js'

const colors = { xy: '#0d766e', xz: '#d99a3b', yz: '#6177a3' }
const planeTrace = (plane) => {
  const same = [[-5,5],[-5,5]], sweep = [[-5,-5],[5,5]], zero = [[0,0],[0,0]]
  const coords = plane === 'xy' ? { x: same, y: sweep, z: zero } : plane === 'xz' ? { x: same, y: zero, z: sweep } : { x: zero, y: same, z: sweep }
  return { type: 'surface', ...coords, name: `${plane}-plane`, showscale: false, opacity: .58, colorscale: [[0, colors[plane]], [1, colors[plane]]], hovertemplate: `${plane}-plane<extra></extra>` }
}
export default function CoordinatePlanes3D() {
  const [visible, setVisible] = useState(['xy'])
  const choose = (plane) => setVisible(plane === 'all' ? ['xy','xz','yz'] : [plane])
  return <div className="plane-lab"><div className="lab-toolbar"><div className="view-buttons">{['xy','xz','yz','all'].map((plane) => <button type="button" className={(plane === 'all' ? visible.length === 3 : visible.length === 1 && visible[0] === plane) ? 'active' : ''} onClick={() => choose(plane)} key={plane}>Show {plane === 'all' ? 'all' : `${plane}-plane`}</button>)}</div></div><div className="plot-wrap"><Plot data={visible.map(planeTrace)} layout={{ autosize:true, margin:{l:0,r:0,t:0,b:0}, paper_bgcolor:'#fffdf8', scene:{aspectmode:'cube',camera:{eye:{x:1.5,y:1.5,z:1.15}},xaxis:{title:'x',range:[-5,5]},yaxis:{title:'y',range:[-5,5]},zaxis:{title:'z',range:[-5,5]}}}} config={{responsive:true,displaylogo:false,scrollZoom:true}} useResizeHandler style={{width:'100%',height:'100%'}} /></div><div className="plane-equations">{visible.map((plane) => <span key={plane}><i style={{background:colors[plane]}} />{plane}-plane: <b>{plane === 'xy' ? 'z = 0' : plane === 'xz' ? 'y = 0' : 'x = 0'}</b></span>)}</div></div>
}
