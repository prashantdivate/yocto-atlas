import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from './src/course.js';
import {sceneFor,nodeBounds,connectionRoute} from './src/scenes.js';
import {languages,translateLabel} from './src/languages.js';
import {brandName,navigation,creatorCredit} from './src/app-chrome.js';
import {authorArticles} from './src/author-articles.js';
test('Brand and navigation use the requested name and sequence',()=>{
 assert.equal(brandName,'Yocto Atlas');assert.deepEqual(navigation.map(n=>n[0]),['learn','lab','practice','cheats','resources']);assert.equal(navigation[1][2],'Architecture Playground');
 assert.equal(creatorCredit(),'');
});
test('Every lesson step has non-overlapping, in-bounds artwork and label reservations',()=>{
 let count=0;
 for(const l of lessons)for(let i=0;i<l.steps.length;i++){
  const s=sceneFor(l,i),bounds=s.nodes.map(nodeBounds);count++;
  for(const b of bounds){assert.ok(b.left>=0&&b.right<=s.width&&b.top>=0&&b.bottom<=s.height,`${l.id}/${i}: frame`);}
  for(let a=0;a<bounds.length;a++)for(let b=a+1;b<bounds.length;b++){const x=bounds[a],y=bounds[b];assert.ok(x.right<=y.left||y.right<=x.left||x.bottom<=y.top||y.bottom<=x.top,`${l.id}/${i}: node collision`);}
  const lookup=Object.fromEntries(s.nodes.map(n=>[n.id,n]));
  for(const e of s.edges){assert.ok(lookup[e.from]&&lookup[e.to]);const route=connectionRoute(lookup[e.from],lookup[e.to]);assert.ok(!route.includes('NaN'));const points=route.match(/-?\d+(?:\.\d+)?/g).map(Number);for(let p=0;p<points.length-2;p+=2){const [x1,y1,x2,y2]=points.slice(p,p+4);for(const b of bounds){const intersects=x1===x2?x1>b.left&&x1<b.right&&Math.max(y1,y2)>b.top&&Math.min(y1,y2)<b.bottom:y1>b.top&&y1<b.bottom&&Math.max(x1,x2)>b.left&&Math.min(x1,x2)<b.right;assert.equal(intersects,false,`${l.id}/${i}: route crosses artwork`);}}}
 }
 assert.equal(count,392);
});
test('All 21 reference language choices have localized navigation',()=>{
 assert.equal(languages.length,21);
 for(const [code] of languages)for(const [, ,label] of navigation){assert.ok(translateLabel(label,code));if(code!=='en')assert.notEqual(translateLabel(label,code),label,`${code}: ${label}`);}
 assert.equal(translateLabel('RDEPENDS:${PN}','hi'),'RDEPENDS:${PN}');
});
test('All five supplied Medium collection articles have mapped studies and safety context',()=>{
 assert.equal(authorArticles.length,5);
 for(const a of authorArticles){assert.ok(a.url.startsWith('https://prashant-divate.medium.com/'));assert.ok(a.sections.length>=3);assert.ok(a.deliverable);for(const id of a.lessons)assert.ok(lessons.some(l=>l.id===id));}
});
