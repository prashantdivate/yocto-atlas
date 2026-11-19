export const chapters = [
  ['linux','Linux from zero','Beginner','sand'],['development','C, Git & cross development','Beginner','green'],
  ['boot','Hardware, boot & BSPs','Intermediate','violet'],['kernel','Kernel & device drivers','Intermediate','orange'],
  ['storage','Root filesystems & storage','Intermediate','blue'],['yocto','Your first Yocto system','Beginner','teal'],
  ['bitbake','BitBake in depth','Intermediate','rose'],['product','Building a product with Yocto','Advanced','olive'],
  ['applications','Applications & integration','Intermediate','sand'],['diagnosis','Debugging, performance & real time','Advanced','violet'],
  ['release','Security, updates & release','Advanced','green'],['systems','Design complete systems','Advanced','orange']
].map(([id,title,level,color],i)=>({id,title,level,color,label:`${String(i+1).padStart(2,'0')}. ${title}`}));

export function defineLesson({id,chapter,title,description,scene='board',source='Mastering-Embedded-Linux-Development-4th-Edition.pdf',sourceChapter,goals,steps,lab,quiz,prerequisites=[]}){
  const c=chapters.find(c=>c.id===chapter);
  return {id,chapter,group:c.label,title,description,scene,source,sourceChapter,level:c.level,minutes:Math.max(15,steps.length*4),goals,prerequisites,
    steps:steps.map(([label,title,body,idea,command,output],i)=>({label,title,body,idea,command,output,phase:i===0?'Context':i===steps.length-1?'Apply':'Technique'})),lab,quiz};
}
