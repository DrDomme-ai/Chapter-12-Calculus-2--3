import fs from 'node:fs'
import path from 'node:path'

const sampleRate=22050
const hz={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,'D#4':311.13,E4:329.63,F4:349.23,'F#4':369.99,G4:392,'G#4':415.3,A4:440,B4:493.88,C5:523.25,D5:587.33,'D#5':622.25,E5:659.25,'F#5':739.99,G5:783.99}
const works=[
  ['fur-elise-project-recording.wav',76,[['E5',.5],['D#5',.5],['E5',.5],['D#5',.5],['E5',.5],['B4',.5],['D5',.5],['C5',.5],['A4',1.5],['C4',.5],['E4',.5],['A4',.5],['B4',1.5],['E4',.5],['G#4',.5],['B4',.5],['C5',1.5],['E4',.5],['E5',.5],['D#5',.5],['E5',.5],['D#5',.5],['E5',.5],['B4',.5],['D5',.5],['C5',.5],['A4',1.5]]],
  ['eine-kleine-nachtmusik-project-recording.wav',112,[['G4',1],['D4',.5],['G4',.5],['B4',.5],['D5',.5],['G5',1],['D5',1],['G4',1],['D4',.5],['G4',.5],['B4',.5],['D5',.5],['G5',1],['D5',1],['G5',.75],['F#5',.25],['E5',.5],['D5',.5],['C5',1],['C5',.75],['B4',.25],['A4',.5],['G4',.5],['F#4',1],['D4',1]]],
  ['bach-prelude-c-major-project-recording.wav',92,[['C3',.5],['E3',.5],['G3',.5],['C4',.5],['E4',.5],['G3',.5],['C4',.5],['E4',.5],['C3',.5],['D3',.5],['A3',.5],['D4',.5],['F4',.5],['A3',.5],['D4',.5],['F4',.5],['B3',.5],['D4',.5],['G4',.5],['D4',.5],['F4',.5],['G4',.5],['D4',.5],['F4',.5],['C3',.5],['E3',.5],['G3',.5],['C4',.5],['E4',.5],['G3',.5],['C4',.5],['E4',.5]]],
]

function render([file,bpm,notes]){
  const beat=60/bpm,phrase=notes.reduce((sum,[,length])=>sum+length*beat,0),duration=Math.max(48,phrase*3),frames=Math.ceil(sampleRate*duration),bytes=frames*2,buffer=Buffer.alloc(44+bytes)
  buffer.write('RIFF',0);buffer.writeUInt32LE(36+bytes,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(bytes,40)
  const events=[];let cursor=0
  while(cursor<duration)for(const [name,length] of notes){const seconds=length*beat;events.push({start:cursor,end:cursor+seconds,frequency:hz[name]});cursor+=seconds;if(cursor>=duration)break}
  let eventIndex=0
  for(let i=0;i<frames;i++){const t=i/sampleRate;while(events[eventIndex]?.end<t)eventIndex++;const event=events[eventIndex],local=t-event.start,length=event.end-event.start,envelope=Math.min(1,local*18)*Math.exp(-2.3*local/length),phase=2*Math.PI*event.frequency*local,value=.38*envelope*(Math.sin(phase)+.3*Math.sin(phase*2)+.12*Math.sin(phase*3));buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+i*2)}
  fs.writeFileSync(path.resolve('public/audio',file),buffer)
}
fs.mkdirSync(path.resolve('public/audio'),{recursive:true});works.forEach(render)
