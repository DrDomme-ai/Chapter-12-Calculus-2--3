import { useEffect, useRef, useState } from 'react'
import LectureJoinQRCode from '../../components/LectureJoinQRCode'

const FADE_DURATION=4000
const TRACKS=[
  {title:'Für Elise',composer:'Ludwig van Beethoven',src:'/audio/fur-elise-project-recording.wav'},
  {title:'Eine kleine Nachtmusik',composer:'Wolfgang Amadeus Mozart',src:'/audio/eine-kleine-nachtmusik-project-recording.wav'},
  {title:'Prelude in C major, BWV 846',composer:'Johann Sebastian Bach',src:'/audio/bach-prelude-c-major-project-recording.wav'},
]

export default function LectureOpeningSlide({settings={},joinUrl,sessionCode,onBegin}){
  const audioRef=useRef(null),fadeRef=useRef(null)
  const [volume,setVolume]=useState(.18),[muted,setMuted]=useState(false),[playing,setPlaying]=useState(false),[autoplayBlocked,setAutoplayBlocked]=useState(false)
  const [today]=useState(()=>new Date())
  const date=new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(today)
  const day=Math.floor(today.getTime()/86400000)
  const seed=[...String(settings.lessonTitle||'Calculus')].reduce((sum,character)=>sum+character.charCodeAt(0),day)
  const track=TRACKS[Number.isInteger(settings.musicTrack)?settings.musicTrack%TRACKS.length:Math.abs(seed)%TRACKS.length]
  const fadeOut=()=>{const audio=audioRef.current;if(!audio||audio.paused)return;cancelAnimationFrame(fadeRef.current);const initial=audio.volume,start=performance.now();const step=(now)=>{const progress=Math.min(1,(now-start)/FADE_DURATION);audio.volume=initial*(1-progress);if(progress<1)fadeRef.current=requestAnimationFrame(step);else{audio.pause();setPlaying(false)}};fadeRef.current=requestAnimationFrame(step)}
  useEffect(()=>{const audio=audioRef.current;if(!audio)return undefined;audio.volume=volume;audio.play().then(()=>{setPlaying(true);setAutoplayBlocked(false)}).catch(()=>setAutoplayBlocked(true));const timer=setTimeout(fadeOut,180000);const handleBegin=()=>fadeOut();window.addEventListener('calculus:begin-lecture',handleBegin);return()=>{clearTimeout(timer);window.removeEventListener('calculus:begin-lecture',handleBegin);cancelAnimationFrame(fadeRef.current);audio.pause()}
  // Playback begins only when the opening slide mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  useEffect(()=>{if(audioRef.current)audioRef.current.volume=muted?0:volume},[muted,volume])
  const toggle=async()=>{const audio=audioRef.current;if(audio.paused){audio.volume=muted?0:volume;await audio.play();setPlaying(true);setAutoplayBlocked(false)}else{audio.pause();setPlaying(false)}}
  const begin=()=>{fadeOut();onBegin?.()}
  return <div className="lecture-opening"><audio ref={audioRef} src={track.src} loop preload="auto"/><section className="opening-copy"><p className="opening-date">{date}</p><h3>Welcome to Calculus</h3><h4>{settings.lessonTitle}</h4>{settings.message&&<p className="opening-message">{settings.message}</p>}<div className="opening-cards"><article><strong>Interesting fact</strong><span>{settings.fact}</span></article><article><strong>Math smile</strong><span>{settings.joke}</span></article><article className="warmup"><strong>One-minute warm-up</strong><span>{settings.warmup}</span></article></div></section><aside className="opening-join">{joinUrl?<LectureJoinQRCode joinUrl={joinUrl} sessionCode={sessionCode} size={150}/>:<div className="qr-placeholder" aria-label="QR code appears when a live session starts">Start Live Lecture<br/>to display the QR code</div>}<span>Scan to join</span><div className="music-controls" aria-label="Background music controls"><p className="now-playing"><strong>{track.title}</strong><span>Composed by {track.composer}</span><a href="/audio/LICENSE.md" target="_blank" rel="noreferrer">Music credits and license</a></p><button type="button" onClick={toggle}>{playing?'Pause music':'Play music'}</button><button type="button" onClick={()=>setMuted(value=>!value)}>{muted?'Unmute':'Mute'}</button><label>Volume <input type="range" min="0" max="0.4" step="0.01" value={volume} onChange={event=>setVolume(Number(event.target.value))}/></label>{autoplayBlocked&&<small>Press Play music to allow audio in this browser.</small>}</div><button className="begin-lecture" type="button" onClick={begin}>Begin Lecture</button></aside></div>
}
