import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const appUrl=process.argv[2]||'http://127.0.0.1:5180/#/instructor/lectures/inverse-trigonometric-functions/edit'
const profile=await mkdtemp(join(tmpdir(),'inverse-trig-validation-')),port=9341
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--window-size=1440,1000','--force-device-scale-factor=1','--disable-gpu','about:blank'],{stdio:'ignore'})
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));let socket,id=0;const pending=new Map()
async function json(url,options){for(let i=0;i<50;i++){try{const response=await fetch(url,options);if(response.ok)return response.json()}catch{}await wait(100)}throw new Error(`Could not connect to ${url}`)}
function command(method,params={}){const next=++id;socket.send(JSON.stringify({id:next,method,params}));return new Promise((resolve,reject)=>pending.set(next,{resolve,reject}))}
async function evaluate(expression){const result=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});return result.result.value}

try{
  const target=await json(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(appUrl)}`,{method:'PUT'})
  socket=new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject})
  socket.onmessage=({data})=>{const message=JSON.parse(data),request=pending.get(message.id);if(!request)return;pending.delete(message.id);message.error?request.reject(new Error(message.error.message)):request.resolve(message.result)}
  await command('Runtime.enable');await wait(1800)
  await evaluate(`document.querySelectorAll('.slide-rail article')[4]?.click()`);await wait(500)
  const click=async(name)=>{await evaluate(`[...document.querySelectorAll('.trig-advanced-explorer button')].find(button=>button.textContent.trim()==='${name}')?.click()`);await wait(250);return evaluate(`(()=>{const root=document.querySelector('.trig-advanced-explorer');return{kind:root?.dataset.function,interval:root?.querySelector('label strong')?.textContent,reflection:root?.querySelector('[data-axis="y=x"]')?.getAttribute('d'),source:root?.querySelector('[data-curve$="-source"]')?.getAttribute('data-curve'),inverse:root?.querySelector('[data-curve$="-inverse"]')?.getAttribute('data-curve'),sourcePoints:root?.querySelectorAll('.source-point').length,inversePoints:root?.querySelectorAll('.inverse-point').length,asymptotes:[...root?.querySelectorAll('[data-asymptote]')||[]].map(node=>node.dataset.asymptote)}})()`)}
  const cosine=await click('cos'),tangent=await click('tan')
  const origin=await evaluate(`(()=>{const svg=document.querySelector('.trig-advanced-explorer svg').getBoundingClientRect(),axis=document.querySelector('[data-axis="y=x"]').getBoundingClientRect();return{svg:{width:svg.width,height:svg.height},axis:{width:axis.width,height:axis.height},slopeRatio:axis.width?axis.height/axis.width:null}})()`)
  const report={cosine,tangent,origin,checks:{cosineState:cosine.kind==='cos'&&cosine.interval==='[0, π]'&&cosine.source==='cos-source'&&cosine.inverse==='arccos-inverse',cosineMappings:cosine.sourcePoints===2&&cosine.inversePoints===2,tangentState:tangent.kind==='tan'&&tangent.interval==='(-π/2, π/2)'&&tangent.source==='tan-source'&&tangent.inverse==='arctan-inverse',tangentAsymptotes:tangent.asymptotes.length===4,reflection45:Math.abs(origin.slopeRatio-1)<.02}}
  const screenshot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('inverse-trig-explorer-validation.png',Buffer.from(screenshot.data,'base64'))
  console.log(JSON.stringify(report,null,2));if(Object.values(report.checks).some(value=>!value))process.exitCode=1
}finally{
  socket?.close();browser.kill();await Promise.race([new Promise(resolve=>browser.once('exit',resolve)),wait(2000)])
  for(let i=0;i<5;i++){try{await rm(profile,{recursive:true,force:true});break}catch{await wait(200)}}
}
