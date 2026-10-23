// Browser check of the preserved parent tools. No actual microphone or audio recognition runs.
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:8082';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const evidence=[];
try {
 for (const lang of ['es','en']) {
  const es=lang==='es';
  const context=await browser.newContext({viewport:{width:720,height:800}});
  await context.addInitScript(({lang})=>{
   localStorage.setItem('kitewise.v1.legal',JSON.stringify({version:'2026-10-22-borrador',acceptedAt:new Date().toISOString(),lang}));
   localStorage.setItem('kitewise.v1.pin','1234');
   localStorage.setItem('kitewise.v1.profiles',JSON.stringify([{id:'tools',name:'Noah',language:lang,level:3,dailyGoalMinutes:15,avatar:'sunDiag',askEnergy:false,freeReading:true,focus:{mode:'off'}}]));
  },{lang});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await page.getByRole('button',{name:'Noah',exact:true}).click();
  await page.getByRole('button',{name:es?'Padres':'Parents',exact:true}).click();
  for(const n of ['1','2','3','4'])await page.getByRole('button',{name:n,exact:true}).click();
  await page.getByRole('button',{name:es?'Listo':'Done',exact:true}).click();
  await page.getByRole('button',{name:es?'Ajustes':'Settings',exact:true}).click();
  await page.getByRole('button',{name:es?'Probar el micrófono':'Test microphone',exact:true}).click();
  await page.getByText(es?'Prueba de voz':'Voice test',{exact:true}).waitFor();
  await page.getByRole('radio',{name:'Android',exact:true}).click();
  await page.getByRole('radio',{name:'Whisper',exact:true}).click();
  const modelLabels=await page.getByRole('radio').allTextContents();
  assert.ok(modelLabels.includes(es?'Rápido':'Fast'));
  assert.ok(modelLabels.includes(es?'Preciso':'Accurate'));
  for(const [width,height]of [[360,800],[720,800],[844,390],[1280,800]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.getByRole('button',{name:es?'Volver':'Back',exact:true}).click();
  await page.getByRole('button',{name:es?'Probar el audio del taller':'Test workshop audio',exact:true}).click();
  await page.getByText(es?'Prueba de audio':'Audio test',{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  evidence.push({language:lang,microphoneToolAvailable:true,androidAndWhisperOptions:true,modelLabels,audioWorkshopToolAvailable:true,voiceToolSizes:4,errors});
  await context.close();
 }
}finally{await browser.close();}
fs.writeFileSync('/tmp/kitewise-voice-tools-evidence.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
