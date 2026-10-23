// Expo web must be running. Touch input is dispatched through Chromium's native touch protocol.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const evidence=[];
fs.mkdirSync('/tmp/illustration-zoom',{recursive:true});
try {
 for (const lang of ['es','en']) {
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await context.addInitScript(lang=>{
   if(!localStorage.getItem('zoom-seeded')){
    localStorage.setItem('zoom-seeded','yes');
    localStorage.setItem('kitewise.v1.legal',JSON.stringify({version:'2026-10-22-borrador',acceptedAt:new Date().toISOString(),lang}));
    localStorage.setItem('kitewise.v1.profiles',JSON.stringify([{id:'zoom',name:'Noah',language:lang,level:6,dailyGoalMinutes:15,avatar:'sunDiag',askEnergy:false,freeReading:true,focus:{mode:'off'}}]));
    localStorage.setItem('kitewise.v1.reading.zoom',JSON.stringify({summaries:[],resumes:[{storyId:`mapa-de-la-puerta-desaparecida-${lang}-n6`,pageIndex:0,updatedAt:new Date().toISOString()}]}));
   }
   window.testSpeech=[];window.SpeechSynthesisUtterance=class{};
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],speak:u=>window.testSpeech.push(u.text),cancel(){}}});
  },lang);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const es=lang==='es';const button=name=>page.getByRole('button',{name,exact:true});
  await page.goto(process.argv[2]??'http://localhost:8082',{timeout:90000});
  await button('Noah').click();await button(es?'Seguir ›':'Continue ›').click();await button(es?'Empezar a leer':'Start reading').click();
  const open=es?'Ampliar ilustración':'Enlarge illustration';const more=es?'Acercar imagen':'Zoom in';const less=es?'Alejar imagen':'Zoom out';const close=es?'Volver a leer':'Back to reading';const reset=es?'Ajustar':'Fit';
  for (const [width,height] of [[390,844],[844,390],[800,1280],[1280,800],[853,690],[690,853]]) {
   await page.setViewportSize({width,height});await button(open).click();
   await page.getByText('100%',{exact:true}).waitFor();
   assert.equal(await button(less).isDisabled(),true);
   const viewport=page.getByTestId('illustration-viewport');const base=await viewport.locator('img').boundingBox();
   await button(more).click();await page.getByText('150%',{exact:true}).waitFor();
   assert.ok((await viewport.locator('img').boundingBox()).width>base.width*1.4);
   for(let n=0;n<5;n++)await button(more).click();
   await page.getByText('400%',{exact:true}).waitFor();assert.equal(await button(more).isDisabled(),true);
   await button(reset).click();await page.getByText('100%',{exact:true}).waitFor();
   // Real two-finger pinch, then one-finger pan.
   const box=await viewport.boundingBox();const x=box.x+box.width/2,y=box.y+box.height/2;
   const cdp=await context.newCDPSession(page);
   const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y],id)=>({x,y,id}))});
   await touch('touchStart',[[x-30,y],[x+30,y]]);
   for(let d=35;d<=90;d+=5)await touch('touchMove',[[x-d,y],[x+d,y]]);
   await touch('touchEnd',[]);
   const zoom=Number((await page.getByText(/^\d+%$/).innerText()).replace('%',''));
   assert.ok(zoom>150,`pinch should zoom: ${lang} ${width}x${height}, got ${zoom}`);
   const before=await viewport.locator('img').boundingBox();
   await touch('touchStart',[[x,y]]);await touch('touchMove',[[x+40,y+20]]);await touch('touchEnd',[]);
   const after=await viewport.locator('img').boundingBox();assert.ok(after.x!==before.x||after.y!==before.y,'pan moves zoomed art');
   if(width===390||width===844||width===853)await page.screenshot({path:`/tmp/illustration-zoom/${lang}-${width}x${height}.png`});
   await page.setViewportSize({width:height,height:width});await page.getByText('100%',{exact:true}).waitFor();
   await button(close).click();await page.getByText(new RegExp(`^${es?'Fragmento':'Part'} 1 `)).waitFor();
   evidence.push({lang,width,height,pinchPercent:zoom,pan:true,resize:true});await cdp.detach();
  }
  await button(open).click();await page.keyboard.press('Escape');await button(open).waitFor();
  await button('Inés').first().click();assert.ok((await page.evaluate(()=>window.testSpeech)).length>0);
  await button(es?'Seguir leyendo':'Keep reading').last().click();
  assert.deepEqual(errors,[]);await context.close();
 }
 fs.mkdirSync('/tmp/illustration-zoom',{recursive:true});fs.writeFileSync('/tmp/illustration-zoom/verification.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
} finally {await browser.close();}
