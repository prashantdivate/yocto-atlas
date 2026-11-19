import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
test('Public documentation does not expose a workstation user directory',()=>{
 const readme=readFileSync(new URL('./README.md',import.meta.url),'utf8');
 assert.doesNotMatch(readme,/[A-Za-z]:[\\/]Users[\\/][^\s]+/i);
 assert.match(readme,/cd yocto-atlas/);
});
test('Public build excludes books, research, credentials and private catalogs',()=>{
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:import.meta.dirname});
 const files=readdirSync(new URL('./dist/',import.meta.url),{recursive:true}).map(String);
 assert.ok(!files.some(f=>/Resources|textbooks|\.research|\.env|\.pdf$/i.test(f)));
 assert.equal(readFileSync(new URL('./dist/src/publication.js',import.meta.url),'utf8').trim(),'export const localBooks = false;');
 const html=readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
 for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))assert.ok(existsSync(new URL('./dist/'+match[1],import.meta.url)),match[1]);
 assert.ok(existsSync(new URL('./dist/vendor/lucide/LICENSE',import.meta.url)));
 assert.ok(existsSync(new URL('./dist/.nojekyll',import.meta.url)));
});
