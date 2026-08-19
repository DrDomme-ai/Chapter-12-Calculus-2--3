import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const appUrl = process.argv[2] || 'http://127.0.0.1:5175/#/instructor/lectures/trigonometry/presenter'
const profile = await mkdtemp(join(tmpdir(), 'slide4-layout-'))
const port = 9334
const browser = spawn(edge, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--window-size=1440,1000', '--force-device-scale-factor=1', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' })

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
let sequence = 0
const pending = new Map()

async function getJson(url, options) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response.json()
    } catch { /* Browser is still starting. */ }
    await wait(100)
  }
  throw new Error(`Timed out connecting to ${url}`)
}

function command(method, params = {}) {
  const id = ++sequence
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

try {
  const target = await getJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(appUrl)}`, { method: 'PUT' })
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (!message.id || !pending.has(message.id)) return
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    message.error ? reject(new Error(message.error.message)) : resolve(message.result)
  }
  await command('Runtime.enable')
  await wait(1800)
  await command('Runtime.evaluate', { expression: `document.querySelectorAll('.slide-rail article')[3]?.click()` })
  await wait(1000)

  const expression = `(() => {
    const canvas = document.querySelector('[data-slide-id="trig-angle"]');
    if (!canvas) return { error: 'Slide 4 canvas was not rendered' };
    const rect = (node) => { const r=node.getBoundingClientRect(); return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
    const overlaps = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const canvasRect=rect(canvas), safe={left:canvasRect.left+canvasRect.width*.05,top:canvasRect.top+canvasRect.height*.05,right:canvasRect.right-canvasRect.width*.05,bottom:canvasRect.bottom-canvasRect.height*.05};
    const elements=[...canvas.querySelectorAll(':scope > .slide-element')].map(node=>({id:node.dataset.elementId,rect:rect(node),overflow:node.scrollWidth>node.clientWidth+2||node.scrollHeight>node.clientHeight+2}));
    const safeAreaOverflow=elements.filter(({rect:r})=>r.left<safe.left-1||r.top<safe.top-1||r.right>safe.right+1||r.bottom>safe.bottom+1).map(x=>x.id);
    const collisions=[]; for(let i=0;i<elements.length;i++) for(let j=i+1;j<elements.length;j++) if(overlaps(elements[i].rect,elements[j].rect)) collisions.push([elements[i].id,elements[j].id]);
    const named=[...canvas.querySelectorAll('.structured-title,.angle-radians-heading h3,.angle-radians-heading p,.angle-radians-equivalence,.angle-control-panel,.angle-circle-panel')].map(node=>({name:node.className||node.tagName,rect:rect(node)}));
    const namedCollisions=[]; for(let i=0;i<named.length;i++) for(let j=i+1;j<named.length;j++) if(overlaps(named[i].rect,named[j].rect)) namedCollisions.push([named[i].name,named[j].name]);
    return {slideId:canvas.dataset.slideId,safeAreaOverflow,collisions,namedCollisions,internalOverflow:elements.filter(x=>x.overflow).map(x=>x.id),elements};
  })()`
  const result = await command('Runtime.evaluate', { expression, returnByValue: true })
  const report = result.result.value
  const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile('slide4-layout-validation.png', Buffer.from(shot.data, 'base64'))
  console.log(JSON.stringify(report, null, 2))
  if (report.error || report.safeAreaOverflow.length || report.collisions.length || report.namedCollisions.length || report.internalOverflow.length) process.exitCode = 1
} finally {
  socket?.close()
  browser.kill()
  await Promise.race([
    new Promise((resolve) => browser.once('exit', resolve)),
    wait(2000),
  ])
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try { await rm(profile, { recursive: true, force: true }); break } catch { await wait(200) }
  }
}
