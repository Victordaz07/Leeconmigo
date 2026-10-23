// Generates explicit, reviewable scene manifests from the existing editorial layouts.
// No story text or source artwork is rewritten. Review the resulting crops before shipping.
import fs from 'node:fs';
import path from 'node:path';
import { expandStory } from '../packages/story-engine/src/templates.ts';
const root=path.resolve(import.meta.dirname,'..');
const sourceDir=path.join(root,'packages/story-engine/stories');
const editionsDir=path.join(root,'packages/story-engine/reading-editions');
const existingPilots=new Set(['el-puente-de-las-luciernagas','mapa-de-la-puerta-desaparecida']);
const stories=['es','en'].flatMap(lang=>fs.readdirSync(path.join(sourceDir,lang)).map(f=>JSON.parse(fs.readFileSync(path.join(sourceDir,lang,f),'utf8')))).filter(s=>!s.dev);
const families=[...new Set(stories.map(s=>s.familyId??s.id))];
const inset=6;
function cropFor(page,block,family,index){
 const a=page.illustration;
 // This story predates the balloon layouts. These explicit art regions were checked against all twelve pages.
 if(family==='la-puerta-que-deje-entreabierta'){
  const crops=[[0,0,960,1024],[0,0,1536,660],null,[0,0,1536,660],[0,0,960,1024],[0,0,1536,660],null,[0,0,1536,660],null,[0,0,1536,1024],null,[0,0,960,1024]];
  const r=crops[index];return r?{x:r[0],y:r[1],width:r[2],height:r[3]}:undefined;
 }
 const panel=block.layout?.panel??{x0:0,y0:0,x1:a.width,y1:a.height};
 let {x0,y0,x1,y1}=panel;
 const b=block.layout?.balloon;
 // Diagonal/burst panels keep their full action, including incidental empty balloon edges.
 if (['slant-3','burst-2','bolt-2'].includes(page.template)) return {x:panel.x0,y:panel.y0,width:panel.x1-panel.x0,height:panel.y1-panel.y0};
 if(b){
  // Choose the largest uninterrupted region outside the narration balloon.
  const candidates=[
   {x0,y0,x1:Math.min(x1,b.x-inset),y1},
   {x0:Math.max(x0,b.x+b.width+inset),y0,x1,y1},
   {x0,y0,x1,y1:Math.min(y1,b.y-inset)},
   {x0,y0:Math.max(y0,b.y+b.height+inset),x1,y1},
  ].filter(r=>r.x1>r.x0&&r.y1>r.y0);
  candidates.sort((a,b)=>(b.x1-b.x0)*(b.y1-b.y0)-(a.x1-a.x0)*(a.y1-a.y0));
  if(candidates.length)({x0,y0,x1,y1}=candidates[0]);
 }else if(family==='la-luna-y-la-puerta-azul'){
  // Original irregular comic: preserve each panel and omit its empty top caption.
  y0+=Math.min(70,Math.floor((y1-y0)*.25));
 }
 x0=Math.max(0,Math.ceil(x0));y0=Math.max(0,Math.ceil(y0));x1=Math.min(a.width,Math.floor(x1));y1=Math.min(a.height,Math.floor(y1));
 return {x:x0,y:y0,width:x1-x0,height:y1-y0};
}
let generated=0;
for(const family of families){
 if(existingPilots.has(family))continue;
 const variants=stories.filter(s=>(s.familyId??s.id)===family);
 const source=variants.find(s=>s.language==='es')??variants[0];
 const layoutPath=path.join(root,'packages/story-engine/layouts',family+'.layout.json');
 const presentationSource=family==='luna-y-el-tren-de-los-objetos-perdidos'?{...source,pages:source.pages.map(p=>p.id==='p02'?{...p,template:'book-3'}:p)}:source;
 const expanded=expandStory(presentationSource,fs.existsSync(layoutPath)?JSON.parse(fs.readFileSync(layoutPath,'utf8')):undefined);
 const scenes=expanded.pages.flatMap((p,index)=>p.blocks.map(b=>{
  const blank=p.illustration.src==='stories/_shared/reading-pause.webp';
  const alt=Object.fromEntries(variants.map(s=>[s.language,s.pages.find(other=>other.id===p.id)?.illustration.alt || s.pages.find(other=>other.illustration.src===p.illustration.src && other.illustration.alt)?.illustration.alt || s.title]));
  const crop=blank?undefined:cropFor({...p,template:source.pages[index].template},b,family,index);
  return {pageId:p.id,blockId:b.id,illustration:{...p.illustration,alt:alt[source.language]},...(crop?{crop}:{}),...(blank?{artHidden:true}:{}),alt};
 }));
 fs.writeFileSync(path.join(editionsDir,family+'.json'),JSON.stringify({version:1,familyId:family,maxWordsPerUnit:source.level<=3?70:100,scenes},null,2)+'\n');generated++;
}
console.log(`Prepared ${generated} additional families (${families.length} total, ${stories.length} language/level variants).`);
