import {test} from 'node:test';
import assert from 'node:assert/strict';
import {releases,hardwareFamilies,ecosystemGuides,releaseContext} from './src/ecosystem.js';
import {evaluateDesign,defaultDesign,designChoices} from './src/design-model.js';
test('Study contexts cover multiple release eras and hardware families without implying support',()=>{
 assert.equal(releases.length,10);assert.equal(hardwareFamilies.length,9);
 assert.ok(releaseContext('dunfell','x86').syntax.includes('RDEPENDS_${PN}'));
 assert.ok(releaseContext('wrynose','imx').syntax.includes('RDEPENDS:${PN}'));
 assert.ok(releaseContext('styhead','stm32mp').source.includes('UNPACKDIR'));
 assert.equal(releaseContext('missing','missing').release.id,'vendor');
 for(const r of releases)for(const h of hardwareFamilies){const d=evaluateDesign({...defaultDesign,release:r.id,hardware:h.id});assert.ok(d.valid);assert.ok(d.notes.some(n=>n.includes('compatibility remains unverified')));}
});
test('Managed platforms retain distinct recovery and compatibility checks',()=>{
 for(const update of ['qbee-rauc','balena','mender-ab'])assert.ok(designChoices.update.options.some(([id])=>id===update));
 assert.ok(evaluateDesign({...defaultDesign,update:'qbee-rauc',boot:'manual'}).warnings.some(w=>w.includes('trial-boot')));
 assert.ok(evaluateDesign({...defaultDesign,update:'balena'}).notes.some(n=>n.includes('retained host images')));
 assert.ok(evaluateDesign({...defaultDesign,update:'mender-ab',release:'kirkstone'}).warnings.some(w=>w.includes('maintenance evidence')));
});
test('Ecosystem content has original studies, primary sources and lab deliverables',()=>{
 for(const term of ['mender','balena','qbee','nxp','ti','stm32','release-porting'])assert.ok(ecosystemGuides.some(g=>g.id.includes(term)),term);
 for(const g of ecosystemGuides){assert.ok(g.sections.length>=2);assert.ok(g.command);assert.ok(g.deliverable);assert.ok(g.context);}
});
