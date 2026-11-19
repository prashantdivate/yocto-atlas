import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matchesTerms} from './src/ui.js';
import {communityLabs} from './src/community-labs.js';
import {boardLabs,boardRelease} from './src/board-labs.js';
import {lessons} from './src/course.js';
test('Book search handles PDF hyphens and does not match Rust inside trusted',()=>{
 assert.ok(matchesTerms('Rust cross‑compilation',['rust','cross-compilation']));
 assert.equal(matchesTerms('Trusted execution environment',['rust']),false);
 assert.ok(matchesTerms('RDEPENDS:${PN} example',['RDEPENDS:${PN}']));
});
test('Reviewed community tutorials map to existing guided lessons',()=>{
 assert.equal(communityLabs.length,15);
 for(const lab of communityLabs){assert.ok(lab.path.endsWith('.md'));assert.ok(lab.tasks.length>=3);assert.ok(lab.note);for(const id of lab.ids)assert.ok(lessons.some(l=>l.id===id),id);}
});
test('Board labs identify the hardware release and retain safety/evidence boundaries',()=>{
 assert.equal(boardRelease,'mx8m-yocto-scarthgap-6.6.y_2.2.2-v1.1');
 assert.equal(boardLabs.length,9);
 for(const lab of boardLabs){for(const field of ['title','objective','requirements','commands','evidence','caution'])assert.ok(lab[field],field);assert.ok(lab.tasks.length>=3);assert.ok(!lab.path.includes('..'));for(const id of lab.ids)assert.ok(lessons.some(l=>l.id===id),id);}
});
test('New repository-informed lessons retain explicit source mappings',()=>{
 for(const id of ['localconf-lab','assignment-lab','hello-recipe-lab','patch-lab','runtime-dependency-lab','runtime-alias-lab','package-image-lab','service-recipe-lab'])assert.ok(communityLabs.some(l=>l.ids.includes(id)),id);
});
