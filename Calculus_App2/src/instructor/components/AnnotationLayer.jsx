import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

const AnnotationLayer = forwardRef(function AnnotationLayer({ active = true, tool = 'pointer', color = '#c53d32', width = 4, paths = [], onChange }, ref) {
  const canvasRef = useRef(null)
  const [history, setHistory] = useState(paths)
  const [redo, setRedo] = useState([])
  const drawing = useRef(null)
  const historyRef = useRef(paths)

  const paint = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
      canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio)
    }
    const ctx = canvas.getContext('2d')
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    history.forEach((path) => {
      if (path.points.length < 2) return
      ctx.beginPath(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.globalAlpha = path.tool === 'highlighter' ? .28 : 1
      ctx.strokeStyle = path.color; ctx.lineWidth = path.tool === 'eraser' ? path.width * 5 : path.width
      path.points.forEach((point, index) => index ? ctx.lineTo(point.x * rect.width, point.y * rect.height) : ctx.moveTo(point.x * rect.width, point.y * rect.height))
      ctx.stroke()
    })
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
  }

  useEffect(paint, [history])
  useEffect(() => { historyRef.current=paths||[];setHistory(paths || []); setRedo([]) }, [paths])
  useEffect(() => { const observer = new ResizeObserver(paint); if (canvasRef.current) observer.observe(canvasRef.current); return () => observer.disconnect() })

  const point = (event) => { const rect = canvasRef.current.getBoundingClientRect(); return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height, pressure:event.pressure||.5 } }
  const down = (event) => {
    if (!active || tool === 'pointer') return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = { tool, color, width, points: [point(event)] }
    setHistory((current) => {const next=[...current,drawing.current];historyRef.current=next;return next}); setRedo([])
  }
  const move = (event) => {
    if (!drawing.current) return
    const samples=event.getCoalescedEvents?.()||[event]
    drawing.current = { ...drawing.current, points: [...drawing.current.points,...samples.map(point)] }
    setHistory((current) => {const next=[...current.slice(0,-1),drawing.current];historyRef.current=next;return next})
  }
  const up = () => { if (!drawing.current) return; drawing.current = null; onChange?.(historyRef.current) }
  const update = useCallback((nextHistory, nextRedo = redo) => { historyRef.current=nextHistory;setHistory(nextHistory); setRedo(nextRedo); onChange?.(nextHistory) }, [onChange, redo])

  useImperativeHandle(ref, () => ({
    undo: () => history.length && update(history.slice(0, -1), [history.at(-1), ...redo]),
    redo: () => redo.length && update([...history, redo[0]], redo.slice(1)),
    clear: () => update([], []),
    getPaths: () => history,
  }), [history, redo, update])

  return <canvas ref={canvasRef} className={`annotation-layer ${tool === 'pointer' ? 'is-pointer' : ''}`} aria-label="Slide annotation layer" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
})

export default AnnotationLayer
