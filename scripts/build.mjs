import {cp,mkdir,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';

const root=resolve(import.meta.dirname,'..'),out=resolve(root,'dist');
if(out!==resolve(root,'dist'))throw Error('Unexpected output directory');
await rm(out,{recursive:true,force:true});
await mkdir(resolve(out,'src'),{recursive:true});
for(const file of await readdir(resolve(root,'src'))){
 if(!['.js','.css','.svg'].includes(extname(file)))continue;
 const source=await readFile(resolve(root,'src',file),'utf8');
 await writeFile(resolve(out,'src',file),source.replaceAll('../node_modules/','../vendor/'));
}
await writeFile(resolve(out,'src/publication.js'),'export const localBooks = false;\n');
await writeFile(resolve(out,'index.html'),(await readFile(resolve(root,'index.html'),'utf8')).replaceAll('node_modules/','vendor/'));
for(const path of ['lucide/dist/umd/lucide.min.js','lucide/LICENSE','@fontsource/jetbrains-mono/files','@fontsource/jetbrains-mono/LICENSE']){
 await mkdir(resolve(out,'vendor',path,'..'),{recursive:true});
 await cp(resolve(root,'node_modules',path),resolve(out,'vendor',path),{recursive:true});
}
await writeFile(resolve(out,'.nojekyll'),'');
console.log('Public build ready: authored course and assets only; no PDFs or extracted textbooks.');
