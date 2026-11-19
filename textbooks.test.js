import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('./',import.meta.url);
const available=existsSync(new URL('textbooks/catalog.json',root));
const catalog=available?JSON.parse(readFileSync(new URL('textbooks/catalog.json',root),'utf8')):null;
test('All supplied PDFs have attributed in-site technical chapters and valid page ranges',{skip:!available},()=>{
 assert.equal(catalog.books.length,12);assert.equal(catalog.chapters.length,136);assert.ok(catalog.totalWords>600000);
 assert.equal(new Set(catalog.chapters.map(c=>c.id)).size,catalog.chapters.length);
 for(const b of catalog.books){assert.ok(b.chapters.length);assert.ok(existsSync(new URL('Resources/'+b.file,root)));}
 for(const c of catalog.chapters){
  const book=catalog.books.find(b=>b.id===c.book);assert.ok(book);assert.ok(c.startPage>=1&&c.endPage<=book.pages);
  const data=JSON.parse(readFileSync(new URL(`textbooks/${c.id}.json`,root),'utf8'));
  assert.equal(data.pages.length,c.endPage-c.startPage+1);assert.ok(data.pages.some(p=>p.text.trim()));
  for(const p of data.pages)assert.ok(p.number>=c.startPage&&p.number<=c.endPage);
 }
});
