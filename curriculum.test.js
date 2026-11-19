import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessons,chapters,parseRoute} from './src/course.js';

test('Curriculum has a continuous beginner-to-advanced path and complete labs',()=>{
 assert.equal(lessons.length,76);
 assert.equal(lessons[0].id,'linux-start');
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
 assert.equal(chapters.length,36);
 const assigned=chapters.flatMap(c=>c.lessonIds);
 assert.equal(assigned.length,lessons.length);
 assert.equal(new Set(assigned).size,assigned.length,'Every lesson belongs to exactly one course');
 for(const c of chapters){assert.ok(c.description);assert.ok(c.outcomes.length>=2);assert.ok(lessons.some(l=>l.chapter===c.id),`${c.title} has content`);}
 for(const [i,l] of lessons.entries()){
  assert.equal(l.number,i+1);
  assert.ok(chapters.some(c=>c.id===l.chapter));
  assert.ok(l.steps.length>=5,l.id);
  assert.ok(l.scene,l.id);
  if(existsSync(new URL('./Resources/',import.meta.url)))assert.ok(existsSync(new URL(`./Resources/${l.source}`,import.meta.url)),`${l.id}: source exists`);
  for(const s of l.steps)for(const key of ['label','title','body','idea','command','output'])assert.ok(s[key],`${l.id}: ${key}`);
  for(const key of ['objective','setup','commands','expected','troubleshooting','deliverable'])assert.ok(l.lab[key],`${l.id}: lab ${key}`);
  assert.ok(l.quiz.options[l.quiz.answer]);assert.ok(l.quiz.why);
 }
});
test('Deep links and malformed step inputs resolve to valid existing steps',()=>{
 assert.equal(parseRoute('#/ota/4').index,3);
 assert.equal(parseRoute('#/missing/999').lesson.id,'linux-start');
 for(const hash of ['#/boot/-4','#/boot/Infinity','#/boot/NaN','#/boot/2.5','#/boot/999','']){
  const {lesson,index}=parseRoute(hash);assert.ok(Number.isInteger(index));assert.ok(lesson.steps[index]);
 }
});
