import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cybersecurityLessons,securityStudies} from './src/cybersecurity.js';
import {lessons} from './src/course.js';
import {languageOptions,languages,languageNames} from './src/languages.js';
test('Cybersecurity path includes substantive labs, source mappings and accountable decisions',()=>{
 assert.equal(cybersecurityLessons.length,4);
 for(const l of cybersecurityLessons){assert.equal(l.steps.length,5);assert.ok(l.steps.every(s=>s.body.length>200));assert.ok(l.lab.deliverable);assert.ok(lessons.includes(l));}
 for(const g of securityStudies){assert.ok(g.sections.length>=3);for(const id of g.lessons)assert.ok(lessons.some(l=>l.id===id),id);}
 assert.match(securityStudies[0].url,/prashantdivate\/yocto-lens$/);
 assert.match(securityStudies[1].url,/prashantdivate\/VulnTrack$/);
});
test('Language dropdown exposes all native and English labels with one selected option',()=>{
 assert.equal(languageNames.length,languages.length);
 const html=languageOptions('hi');assert.equal((html.match(/role="menuitemradio"/g)||[]).length,21);assert.equal((html.match(/aria-checked="true"/g)||[]).length,1);assert.match(html,/Hindi/);assert.match(html,/data-language="hi"/);
});
