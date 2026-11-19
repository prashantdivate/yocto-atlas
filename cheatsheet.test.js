import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cheatCommands,cheatSources,filterCheats} from './src/cheatsheet.js';
import {engineeringGuides} from './src/engineering-guides.js';
import {lessons} from './src/course.js';
test('Cheatsheet preserves attribution, command effects and searchable categories',()=>{
 assert.ok(cheatCommands.length>=40);assert.ok(cheatSources.some(s=>s.id==='elinux'&&s.detail.includes('blocked')));
 for(const c of cheatCommands){assert.ok(cheatSources.some(s=>s.id===c.source));assert.ok(c.note);assert.ok(c.risk);assert.ok(!c.command.includes('rm -Rf'));}
 assert.ok(filterCheats('RDEPENDS').some(c=>c.category==='Metadata'));
 assert.ok(filterCheats('','Cleaning').every(c=>c.risk.startsWith('removes')));
 assert.equal(filterCheats('no-such-command').length,0);
});
test('Vendor engineering notes connect original explanations and evidence to valid lessons',()=>{
 assert.equal(engineeringGuides.length,33);
 for(const g of engineeringGuides){assert.ok(g.url.startsWith('https://'));assert.ok(g.context);assert.ok(g.sections.length>=2);assert.ok(g.deliverable);for(const id of g.lessons)assert.ok(lessons.some(l=>l.id===id),id);}
});
