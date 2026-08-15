import { useState } from 'react'

const octants = [['+','+','+'],['-','+','+'],['-','-','+'],['+','-','+'],['+','+','-'],['-','+','-'],['-','-','-'],['+','-','-']]
export default function OctantExplorer() {
  const [selected, setSelected] = useState(0)
  const signs = octants[selected]
  return <div className="octant-explorer"><div className="octant-buttons">{octants.map((item, index) => <button className={selected === index ? 'active' : ''} type="button" onClick={() => setSelected(index)} key={item.join('')}>{index === 0 ? 'First octant' : `Sign region ${index + 1}`}<small>({item.join(', ')})</small></button>)}</div><div className="sign-display"><p>{selected === 0 ? 'The first octant' : 'Selected region'}</p><div><span><b>x</b>{signs[0]}</span><span><b>y</b>{signs[1]}</span><span><b>z</b>{signs[2]}</span></div><strong>{signs.map((sign, i) => `${['x','y','z'][i]} ${sign === '+' ? '>' : '<'} 0`).join(' · ')}</strong></div></div>
}

