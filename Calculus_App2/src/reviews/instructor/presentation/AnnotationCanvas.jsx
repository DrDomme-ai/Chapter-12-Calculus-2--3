import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

// A responsive annotation canvas that fills its parent container.
const AnnotationCanvas = forwardRef(function AnnotationCanvas({ tool = 'pen', color = '#d00', lineWidth = 3, onChange }, ref) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [paths, setPaths] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [currentPath, setCurrentPath] = useState(null)

  // Resize canvas to match wrapper size and device pixel ratio
  const resize = () => {
    const canvas = canvasRef.current
    const wrap = wrapperRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const w = Math.max(1, Math.floor(rect.width))
    const h = Math.max(1, Math.floor(rect.height))
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.width = w * devicePixelRatio
    canvas.height = h * devicePixelRatio
    const ctx = canvas.getContext('2d')
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    redraw(ctx, paths)
  }

  useEffect(() => {
    resize()
    const ro = new ResizeObserver(resize)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    window.addEventListener('resize', resize)
    return () => { ro.disconnect(); window.removeEventListener('resize', resize) }
  }, [paths])

  function redraw(ctx, allPaths) {
    if (!ctx) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    allPaths.forEach((p) => {
      ctx.beginPath()
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = p.tool === 'eraser' ? '#ffffff' : p.color
      ctx.lineWidth = p.lineWidth
      p.points.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)))
      ctx.stroke()
    })
  }

  const toPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const handlePointerDown = (e) => {
    if (!canvasRef.current) return
    setIsDrawing(true)
    const p = { tool, color, lineWidth, points: [toPoint(e)] }
    setCurrentPath(p)
    setPaths((s) => [...s, p])
    setRedoStack([])
    onChange?.(paths)
  }

  const handlePointerMove = (e) => {
    if (!isDrawing || !currentPath) return
    const pt = toPoint(e)
    currentPath.points.push(pt)
    setCurrentPath({ ...currentPath })
    setPaths((s) => {
      const copy = [...s]
      copy[copy.length - 1] = currentPath
      const ctx = canvasRef.current.getContext('2d')
      redraw(ctx, copy)
      return copy
    })
  }

  const handlePointerUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    setCurrentPath(null)
    onChange?.(paths)
  }

  const undo = () => setPaths((s) => {
    if (s.length === 0) return s
    const last = s[s.length - 1]
    setRedoStack((r) => [last, ...r])
    return s.slice(0, -1)
  })

  const redo = () => setRedoStack((r) => {
    if (r.length === 0) return r
    const [first, ...rest] = r
    setPaths((p) => [...p, first])
    return rest
  })

  const clear = () => { setPaths([]); setRedoStack([]) }

  useImperativeHandle(ref, () => ({ undo, redo, clear, getPaths: () => paths }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    redraw(ctx, paths)
  }, [paths])

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, zIndex: 10, touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, background: 'transparent' }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
    </div>
  )

})

export default AnnotationCanvas
