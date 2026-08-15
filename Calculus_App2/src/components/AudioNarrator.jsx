import { useEffect, useRef, useState } from 'react'

const voiceOptions = [
  { id: 'natural-m', label: 'Natural English (m)', locale: 'en', hints: ['male', 'david', 'mark', 'guy', 'george', 'daniel'] },
  { id: 'natural-f', label: 'Natural English (f)', locale: 'en', hints: ['female', 'samantha', 'zira', 'aria', 'sonia', 'serena'] },
]

export default function AudioNarrator({ sections }) {
  const [selected, setSelected] = useState(sections[0].id)
  const [voicePreset, setVoicePreset] = useState('natural-m')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('Choose a concept, then press Play explanation.')
  const audioRef = useRef(null)
  const objectUrlRef = useRef(null)

  const section = sections.find((item) => item.id === selected) || sections[0]
  const selectedVoice = voiceOptions.find((item) => item.id === voicePreset) || voiceOptions[0]

  const stop = () => {
    audioRef.current?.pause()
    window.speechSynthesis?.cancel()
    setStatus('idle')
    setMessage('Playback stopped.')
  }

  useEffect(() => () => {
    audioRef.current?.pause()
    window.speechSynthesis?.cancel()
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
  }, [])

  const browserFallback = () => {
    if (!('speechSynthesis' in window)) {
      setStatus('error')
      setMessage('Speech is unavailable in this browser. Add an OpenAI API key to enable generated audio.')
      return
    }
    const utterance = new SpeechSynthesisUtterance(section.text)
    const installedVoices = window.speechSynthesis.getVoices()
    const localeVoices = installedVoices.filter((voice) => voice.lang.toLowerCase().startsWith(selectedVoice.locale.toLowerCase()))
    utterance.voice = localeVoices.find((voice) => selectedVoice.hints.some((hint) => voice.name.toLowerCase().includes(hint))) || localeVoices[0] || installedVoices[0] || null
    utterance.lang = utterance.voice?.lang || 'en-US'
    utterance.rate = 0.93
    utterance.pitch = 1
    utterance.onend = () => { setStatus('idle'); setMessage('Explanation finished · browser voice fallback') }
    utterance.onerror = () => { setStatus('error'); setMessage('The browser could not play this explanation.') }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setStatus('playing')
    setMessage('Playing with the browser voice fallback.')
  }

  const play = async () => {
    stop()
    setStatus('loading')
    setMessage('Generating the explanation…')
    try {
      const response = await fetch('/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: section.text, voicePreset }) })
      if (!response.ok) throw new Error(await response.text())
      const blob = await response.blob()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = URL.createObjectURL(blob)
      const audio = new Audio(objectUrlRef.current)
      audioRef.current = audio
      audio.onended = () => { setStatus('idle'); setMessage('AI explanation finished.') }
      audio.onerror = () => { setStatus('error'); setMessage('The generated audio could not be played.') }
      await audio.play()
      setStatus('playing')
      setMessage('Playing AI-generated voice · OpenAI')
    } catch {
      browserFallback()
    }
  }

  return <aside className="audio-narrator" aria-label="Audio concept explanations">
    <div className="narrator-icon" aria-hidden="true">♪</div>
    <div className="narrator-main"><span className="card-label">Audio guide</span><h2>Hear the concept explained</h2><div className="narrator-selectors"><label>Concept<select value={selected} onChange={(event) => { stop(); setSelected(event.target.value) }}>{sections.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><label>Voice<select value={voicePreset} onChange={(event) => { stop(); setVoicePreset(event.target.value) }}>{voiceOptions.map((voice) => <option value={voice.id} key={voice.id}>{voice.label}</option>)}</select></label></div><p className="narrator-status" role="status">{status === 'loading' && <span className="audio-pulse" />} {message}</p><small>OpenAI narration is AI-generated. Browser fallback uses the closest matching English voice installed on the viewer’s device.</small></div>
    <div className="narrator-actions"><button type="button" onClick={play} disabled={status === 'loading'}>{status === 'loading' ? 'Generating…' : status === 'playing' ? 'Restart' : '▶ Play explanation'}</button><button className="stop-audio" type="button" onClick={stop} disabled={status !== 'playing' && status !== 'loading'}>■ Stop</button></div>
  </aside>
}
