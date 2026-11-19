import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultDesign,designPresets,updateStrategies,normalizeDesign,evaluateDesign} from './src/design-model.js';
test('All update approaches and presets produce bounded, finite design reviews',()=>{
 assert.equal(updateStrategies.length,11);assert.equal(designPresets.length,9);
 assert.ok(designPresets.every(p=>!/variscite|toradex|torizon|phytec/i.test(p.label)),'Scenario titles are vendor-neutral');
 for(const p of designPresets){const r=evaluateDesign(p.values);assert.ok(r.valid,p.id);assert.ok(Number.isFinite(r.estimatedGiB));assert.ok(r.notes.length>=2);assert.ok(r.tests.length>=4);}
 const r=evaluateDesign(defaultDesign);assert.equal(r.copies,2);assert.equal(r.warnings.length,0);assert.equal(r.rawMiB,10*64*24*3600/1048576);
});
test('Design review flags conflicting recovery, trust, data and delivery choices',()=>{
 const r=evaluateDesign({...defaultDesign,boot:'manual',health:'early',data:'forward',network:'airgap',delivery:'https',rollout:'all'});
 for(const word of ['trial-boot','PID 1','migration','air-gapped','canary'])assert.ok(r.warnings.some(w=>w.includes(word)),word);
 assert.ok(evaluateDesign({...defaultDesign,update:'packages'}).warnings.some(w=>w.includes('writable')));
 assert.ok(evaluateDesign({...defaultDesign,update:'containers'}).warnings.some(w=>w.includes('host OS')));
 assert.ok(evaluateDesign({...defaultDesign,capacity:0.1}).warnings.some(w=>w.includes('exceeds')));
});
test('Invalid numeric inputs never produce misleading budget values',()=>{
 for(const value of ['',-1,Infinity,NaN,'abc',100001]){const r=evaluateDesign({...defaultDesign,rate:value});assert.equal(r.valid,false);assert.equal(r.estimatedGiB,null);}
 assert.equal(evaluateDesign({...defaultDesign,hours:0}).rawMiB,0);
 assert.equal(normalizeDesign({update:'unknown'}).update,defaultDesign.update);
});
