import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const edge='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const base=process.argv[2]||'http://127.0.0.1:5173'
const profile=await mkdtemp(join(tmpdir(),'hyperbolic-lecture-audit-'))
const port=9352
const browser=spawn(edge,['--headless=new',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--window-size=1600,1000','--force-device-scale-factor=1','--disable-gpu','about:blank'],{stdio:'ignore'})
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))
let socket,sequence=0
const pending=new Map(),consoleErrors=[]

async function getJson(url,options){for(let attempt=0;attempt<60;attempt+=1){try{const response=await fetch(url,options);if(response.ok)return response.json()}catch{}await wait(100)}throw new Error(`Could not connect to ${url}`)}
function command(method,params={}){const id=++sequence;socket.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))}
async function evaluate(expression){const result=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value}
async function navigate(mode){
  await command('Page.navigate',{url:`${base}/#/instructor/lectures/hyperbolic-functions/${mode}`})
  await wait(1800)
  return evaluate(`(async()=>{
    localStorage.removeItem('lecture:hyperbolic-functions');
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const close=document.querySelector('.join-close');if(close)close.click();
    const rails=[...document.querySelectorAll('.slide-rail article')];
    const failures=[];const ids=[];
    for(const rail of rails){rail.click();await wait(20);const canvas=document.querySelector('[data-slide-id]');const opening=document.querySelector('.lecture-opening');if(!canvas&&!opening)failures.push(rail.textContent.trim().slice(0,80));else ids.push(canvas?.dataset.slideId||'welcome')}
    const required=['hy-origin-title','hy-exp-reflection','hy-even-odd-decomposition','hy-discover-definitions','hy-circle-to-hyperbola','hy-sector-parameter','hy-identity-full','hy-cable-hook','hy-proof','hy-chain','hy-catenary','hy-inverses','hy-joke','hy-fact','hy-concept-map','hy-exit'];
    return{mode:${JSON.stringify(mode)},slideCount:rails.length,uniqueRendered:new Set(ids).size,failures,missingRequired:required.filter(id=>!ids.includes(id)),toolbar:[...document.querySelectorAll('.mode-switch button')].map(button=>button.textContent.trim()),notesVisible:Boolean(document.querySelector('.presenter-notes'))};
  })()`)
}

try{
  const target=await getJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${base}/#/instructor/lectures/hyperbolic-functions/edit`)}`,{method:'PUT'})
  socket=new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject})
  socket.onmessage=({data})=>{const message=JSON.parse(data);if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')consoleErrors.push(message.params.args.map(arg=>arg.value||arg.description).join(' '));const request=pending.get(message.id);if(!request)return;pending.delete(message.id);message.error?request.reject(new Error(message.error.message)):request.resolve(message.result)}
  await command('Runtime.enable');await command('Page.enable')
  const reports=[]
  for(const mode of ['edit','presenter','live'])reports.push(await navigate(mode))
  const liveInteraction=await evaluate(`(async()=>{const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));document.querySelector('.join-close')?.click();const collectionOptions=[...document.querySelectorAll('.live-question-launcher option')].filter(option=>option.textContent.includes('Interactive collection'));const rail=[...document.querySelectorAll('.slide-rail article')].find(item=>item.textContent.includes('Quick symmetry check'));rail?.click();await wait(100);const ask=[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Ask Class');ask?.click();await wait(150);return{questionSlideFound:Boolean(rail),askButtonFound:Boolean(ask),projectorOpened:Boolean(document.querySelector('.live-question-projector')),teachingSlidesStillVisible:document.querySelectorAll('.slide-rail article').length,selectableCollectionQuestions:collectionOptions.length};})()`)
  await command('Page.navigate',{url:`${base}/#/calc2/chapter-6`});await wait(1600)
  const resourceSeparation=await evaluate(`(async()=>{const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));const buttons=[...document.querySelectorAll('.c6-library-layout aside button')];buttons.find(button=>button.textContent.includes('Hyperbolic Functions'))?.click();await wait(200);const collectionCount=document.querySelectorAll('.c6-interactive-collection details').length;const collectionText=document.querySelector('.c6-interactive-collection')?.textContent||'';buttons.find(button=>button.textContent.includes('Exam Questions'))?.click();await wait(200);const examViews=document.querySelectorAll('.exam-question-view').length;const examText=document.querySelector('.c6-library-content')?.textContent||'';return{collectionCount,collectionVisible:collectionText.includes('Kahoot / Interactive Questions'),examViews,examHasSolutionControls:examText.includes('Show detailed solution'),kahootLeakedIntoExam:examText.includes('hy-kahoot-')||examText.includes('Interactive collection ·')};})()`)
  const report={reports,liveInteraction,resourceSeparation,consoleErrors}
  console.log(JSON.stringify(report,null,2))
  const failed=reports.some(item=>item.slideCount<42||item.uniqueRendered!==item.slideCount||item.failures.length||item.missingRequired.length||!item.notesVisible)||!liveInteraction.questionSlideFound||!liveInteraction.askButtonFound||!liveInteraction.projectorOpened||liveInteraction.teachingSlidesStillVisible<42||liveInteraction.selectableCollectionQuestions<4||resourceSeparation.collectionCount<4||!resourceSeparation.collectionVisible||resourceSeparation.examViews<1||!resourceSeparation.examHasSolutionControls||resourceSeparation.kahootLeakedIntoExam||consoleErrors.length
  if(failed)process.exitCode=1
}finally{
  socket?.close();browser.kill();await Promise.race([new Promise(resolve=>browser.once('exit',resolve)),wait(2000)])
  for(let attempt=0;attempt<5;attempt+=1){try{await rm(profile,{recursive:true,force:true});break}catch{await wait(200)}}
}
