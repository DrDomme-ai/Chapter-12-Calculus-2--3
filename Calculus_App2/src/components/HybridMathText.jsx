import { Fragment } from 'react'
import { MathDisplay, MathInline } from './MathDisplay'

const mathPattern=/(\\begin\{aligned\}[\s\S]*?\\end\{aligned\}|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?!\$)[^$\n]+?\$|\\\([\s\S]*?\\\))/g
const stylePattern=/(<span\s+style=["'][^"']+["']>[\s\S]*?<\/span>|<mark(?:\s+style=["'][^"']+["'])?>[\s\S]*?<\/mark>|\\textcolor\{[^{}]+\}\{[^{}]*\}|\\color\{[^{}]+\}\{[^{}]*\}|\\textbf\{[^{}]*\}|\\textit\{[^{}]*\}|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/gi
const safeColor=(value,fallback='inherit')=>/^(?:#[0-9a-f]{3,8}|[a-z]+)$/i.test(String(value).trim())?String(value).trim():fallback

function StyledToken({token}){
  if(token.startsWith('**'))return <strong>{token.slice(2,-2)}</strong>
  if(token.startsWith('*'))return <em>{token.slice(1,-1)}</em>
  if(token.startsWith('`'))return <code>{token.slice(1,-1)}</code>
  let match=token.match(/^\\textbf\{([\s\S]*)\}$/i);if(match)return <strong>{match[1]}</strong>
  match=token.match(/^\\textit\{([\s\S]*)\}$/i);if(match)return <em>{match[1]}</em>
  match=token.match(/^\\(?:textcolor|color)\{([^{}]+)\}\{([\s\S]*)\}$/i);if(match)return <span style={{color:safeColor(match[1])}}>{match[2]}</span>
  match=token.match(/^<mark(?:\s+style=["']([^"']*)["'])?>([\s\S]*)<\/mark>$/i);if(match){const color=match[1]?.match(/background(?:-color)?\s*:\s*([^;]+)/i)?.[1];return <mark style={{backgroundColor:safeColor(color,'#fff1a8')}}>{match[2]}</mark>}
  match=token.match(/^<span\s+style=["']([^"']+)["']>([\s\S]*)<\/span>$/i);if(match){const color=match[1].match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)?.[1],background=match[1].match(/background(?:-color)?\s*:\s*([^;]+)/i)?.[1],size=match[1].match(/font-size\s*:\s*([0-9]+(?:\.[0-9]+)?)(px|pt|em|rem)/i);return <span style={{color:color?safeColor(color):undefined,backgroundColor:background?safeColor(background,'transparent'):undefined,fontSize:size?`${size[1]}${size[2]}`:undefined}}>{match[2]}</span>}
  return token
}

function MarkdownText({source}){
  const lines=String(source).split('\n')
  return lines.map((line,lineIndex)=><Fragment key={`line-${lineIndex}`}>{line.split(stylePattern).filter(Boolean).map((part,index)=><Fragment key={index}><StyledToken token={part}/></Fragment>)}{lineIndex<lines.length-1&&<br/>}</Fragment>)
}

function RenderFormula({formula,display=false}){
  const aligned=formula.match(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/)
  if(aligned){const rows=aligned[1].split(/\\\\/).map(row=>row.replaceAll('&','').trim()).filter(Boolean);return <div className="discrete-solution-math">{rows.map((row,index)=><MathDisplay key={index}>{row}</MathDisplay>)}</div>}
  return display?<MathDisplay>{formula}</MathDisplay>:<MathInline>{formula}</MathInline>
}

export default function HybridMathText({source,defaultMath=false}){
  const value=String(source??'')
  const matches=[...value.matchAll(mathPattern)]
  if(defaultMath&&!matches.length){const rows=value.split(/\r?\n/).map(row=>row.trim()).filter(Boolean);return rows.length>1?<div className="discrete-solution-math">{rows.map((row,index)=><RenderFormula formula={row} display key={index}/>)}</div>:<RenderFormula formula={value} display/>}
  const parts=[];let cursor=0
  matches.forEach((match,index)=>{
    if(match.index>cursor)parts.push(<MarkdownText source={value.slice(cursor,match.index)} key={`text-${index}`}/>)
    const token=match[0],bareAligned=token.startsWith('\\begin{aligned}'),display=bareAligned||token.startsWith('$$')||token.startsWith('\\[')
    const formula=bareAligned?token:display?token.slice(2,-2):token.startsWith('$')?token.slice(1,-1):token.slice(2,-2)
    parts.push(<RenderFormula formula={formula} display={display} key={`math-${index}`}/>)
    cursor=match.index+token.length
  })
  if(cursor<value.length)parts.push(<MarkdownText source={value.slice(cursor)} key="text-last"/>)
  return <div className="hybrid-math-text">{parts.length?parts:<MarkdownText source={value}/>}</div>
}
