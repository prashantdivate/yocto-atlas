import {readdir,readFile,writeFile,rename,access} from 'node:fs/promises';
import {join,resolve,basename} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const mapping={
 'yocto-handbook-scarthgap.pdf':'Yocto-Project-Scarthgap-Learning-Handbook.pdf',
 '9781803232591.pdf':'Mastering-Embedded-Linux-Development-4th-Edition.pdf',
 '9781789530384.pdf':'Mastering-Embedded-Linux-Programming-3rd-Edition.pdf',
 '9781803239545.pdf':'Embedded-Systems-Architecture-2nd-Edition.pdf',
 '9781806695072.pdf':'Embedded-Linux-Development-Using-Yocto-Project-4th-Edition.pdf',
 '9781835469309.pdf':'Embedded-Linux-Essentials-Handbook.pdf',
 '1763284374976.pdf':'Yocto-Metadata-Dependencies-and-Recipe-Providers.pdf',
 '1765975286303.pdf':'Yocto-Packaging-and-Image-Generation.pdf',
 '1777234980708.pdf':'Yocto-SDK-Extensible-SDK-and-Devtool.pdf',
 '1790016198998.pdf':'Understanding-Fakeroot-and-Pseudo-in-Yocto.pdf',
 '1792145106648.pdf':'The-Impact-of-Your-Choices-on-Yocto-Project-Systems.pdf',
 '1792343449151.pdf':'RAUC-Bundle-Creation-Verification-and-Installation.pdf'
};
const exists=async path=>{try{await access(path);return true;}catch{return false;}};
const digest=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
for(const [oldName,newName] of Object.entries(mapping)){
 const source=join(root,'Resources',oldName),target=join(root,'Resources',newName);
 if(!await exists(source)){if(await exists(target))continue;throw Error(`Missing source: ${oldName}`);}
 if(await exists(target))throw Error(`Destination already exists: ${newName}`);
 const before=await digest(source);await rename(source,target);
 if(await digest(target)!==before)throw Error(`Content changed: ${newName}`);
 const oldIndex=join(root,'.research',oldName.replace(/\.pdf$/,'.json'));
 const newIndex=join(root,'.research',newName.replace(/\.pdf$/,'.json'));
 if(await exists(oldIndex)&&!await exists(newIndex))await rename(oldIndex,newIndex);
 console.log(`${oldName} -> ${newName} [SHA-256 verified]`);
}
async function updateReferences(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(['Resources','node_modules','.git'].includes(entry.name))continue;
  const path=join(dir,entry.name);
  if(entry.isDirectory()){await updateReferences(path);continue;}
  if(path===import.meta.filename||!(/\.(js|mjs|json|md|py|html)$/.test(entry.name)))continue;
  const original=await readFile(path,'utf8');let updated=original;
  for(const [from,to] of Object.entries(mapping))updated=updated.replaceAll(from,to);
  if(updated!==original)await writeFile(path,updated);
 }
}
await updateReferences(root);
console.log('Updated source, library links, tests and research catalog references.');
