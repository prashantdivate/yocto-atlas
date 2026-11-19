import {escapeHTML as esc,icon,matchesTerms} from './ui.js';
import {localBooks} from './publication.js';
export const textbookCatalog=localBooks?await fetch('textbooks/catalog.json').then(r=>r.ok?r.json():{books:[],chapters:[],totalWords:0}).catch(()=>({books:[],chapters:[],totalWords:0})):{books:[],chapters:[],totalWords:0};
const documents=new Map();
let searchData=null;
export async function searchTextbooks(query){
 if(!textbookCatalog.chapters.length)return [];
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);if(!terms.length)return [];
 if(!searchData)searchData=fetch('textbooks/search.json').then(r=>r.json());
 const records=await searchData;
 return records.filter(c=>matchesTerms(c.title+' '+c.text,terms))
  .sort((a,b)=>Number(matchesTerms(b.title,terms))-Number(matchesTerms(a.title,terms)))
  .slice(0,8).map(c=>({id:c.id,title:c.title,book:c.book}));
}
let pdfModule=null;
const sourceHints={
 'threat-model':['Trusted Execution','Security'],'cve-triage':['Security','License Compliance'],'sbom-verify':['License Compliance','Security'],'remediation-evidence':['Security','Updating'],
 'shell-lab':['Work Environment','Processes and Threads'],'localconf-lab':['Preparing the Build Host','Understanding BitBake Metadata'],
 'assignment-lab':['Understanding BitBake Metadata'],'hello-recipe-lab':['Creating Custom Layers','Recipes:'],
 'patch-lab':['Customizing Existing Recipes'],'runtime-dependency-lab':['Dependencies','Packaging'],
 'runtime-alias-lab':['Dependencies'],'package-image-lab':['Packaging','Images and Root'],
 'service-recipe-lab':['init Program','systemd'],'readonly-overlay':['Building a Root Filesystem','Storage Strategy'],
 'power-management':['Power Management','Managing Power'],'python-applications':['Python'],
 'qt-graphics':['Qt','Graphics'],'container-applications':['Container'],'rust-applications':['Rust'],
 'linux-start':['Starting Out','Architecture and Its Use Cases'], 'shell-files':['Building a Root Filesystem'],
 'shell-pipes':['Work Environment'],permissions:['Building a Root Filesystem'],processes:['Processes and Threads'],
 'network-basics':['Networking','Distributed Systems'], 'c-build':['Toolchains'], 'git-workflow':['Workflow','Developing with Yocto'],
 'build-tools':['Toolchains'],toolchain:['Toolchains','standard SDK'], 'hardware-map':['Pragmatic Approach','Starting Out'],
 boot:['Bootloaders','Boot-Up Procedure'],uboot:['Bootloaders','Learning About U-Boot'],'kernel-build':['Configuring and Building the Kernel'],
 'device-tree':['Describing Hardware','Bootloaders'],'driver-model':['Device Drivers'],buses:['Local Bus Interfaces','General-Purpose Peripherals'],drivers:['Device Drivers','Real-Time'],
 rootfs:['Building a Root Filesystem'],initramfs:['Building a Root Filesystem'],'flash-storage':['Storage Strategy'],
 'build-system-choice':['Selecting a Build System'], 'first-build':['Baking Our First','Preparing the Build Host'],layers:['External Layers','Layers and Metadata'],
 metadata:['Understanding BitBake Metadata'], 'recipe-authoring':['Creating Custom Layers','Recipes:'],fetchers:['Grasping the BitBake'],classes:['Understanding BitBake Metadata'],
 tasks:['Yocto under the Hood','Grasping the BitBake'],dependencies:['Dependencies','Grasping the BitBake'],
 'native-sysroots':['Temporary Build Directory','standard SDK'],packaging:['Packaging','Images and Root'],
 'pseudo-qa':['Fakeroot','Packaging'],sstate:['Assimilating Packaging','Grasping the BitBake'],'build-debug':['Debugging with the Yocto'],
 'custom-layer':['Creating Custom Layers'],appends:['Customizing Existing Recipes'], 'distro-machine':['Creating Custom Layers','Multiple MACHINE'],
 'kernel-yocto':['Developing with Yocto','Configuring and Building'], 'image-policy':['Packaging','Creating Custom Layers'],
 sdk:['standard SDK','Devtool workflows'],esdk:['extensible SDK','Developing with the Yocto'],systemd:['init Program','systemd'],ipc:['Processes and Threads'],
 debug:['Debugging with GDB','Debugging with the Yocto'],memory:['Managing Memory'],gdb:['Debugging with GDB'],tracing:['Profiling and Tracing'],
 'boot-time':['init Program','Real-Time'],realtime:['Real-Time Programming'],security:['Trusted Execution','License Compliance','Securing Code'],
 'licenses-sbom':['License Compliance'],ota:['RAUC','Updating Software'], 'ci-release':['Continuous Integration','Best Practices'],
 'gateway-design':['Architectural Patterns','Distributed Systems','Project 1'], 'bsp-design':['Bootloaders','Custom Embedded Linux'],
 'fleet-design':['Updating Software','Container Images','Best Practices']
};
export function readingsFor(lesson){
 const hints=sourceHints[lesson.id]||[lesson.title];
 return textbookCatalog.chapters.map(c=>({c,score:hints.reduce((s,h)=>s+(matchesTerms(c.title,h.toLowerCase().split(/\s+/))?10:0),0)+(c.file===lesson.source?3:0)}))
  .filter(x=>x.score>3).sort((a,b)=>b.score-a.score||b.c.words-a.c.words).slice(0,5).map(x=>x.c);
}
function bookName(id){return textbookCatalog.books.find(b=>b.id===id)?.title||id;}
export function readingSupplement(lesson){const items=readingsFor(lesson);return `<section class="source-reading-section"><div class="eyebrow">FULL-LENGTH TEXTBOOK READING</div><h2>Study this topic in depth</h2><p>The guided sections above establish the mental model. Continue with the complete technical chapters below, extracted from your supplied books and shown here with their original page references.</p><div class="reading-source-list">${items.map((c,i)=>`<button data-source-inline="${c.id}" class="${i===0?'chosen':''}"><strong>${esc(c.title)}</strong><span>${esc(bookName(c.book))} · ${c.words.toLocaleString()} words · PDF pp. ${c.startPage}–${c.endPage}</span></button>`).join('')}</div><div id="inline-book-reader" data-default-chapter="${items[0]?.id||''}"></div></section>`;}
export function textbookLibrary(filter=''){const q=filter.toLowerCase();return `<main class="full-page textbook-library" id="main"><div class="eyebrow">COMPLETE TEXTBOOK CURRICULUM</div><h1>${textbookCatalog.chapters.length} technical chapters. The full detail.</h1><p class="lead">${textbookCatalog.totalWords.toLocaleString()} words of source material from all 12 supplied PDFs, alongside the guided course. Read the original explanations and code inside this website, or inspect the original pages with their diagrams and tables. Each source retains its own version context.</p><label class="field-label">Find a chapter or subject<input id="textbook-filter" type="search" value="${esc(filter)}" placeholder="Try power management, Rust, Qt, sysroot, packaging…"></label><div id="textbook-list">${chapterList(q)}</div></main>`;}
export function chapterList(q=''){return textbookCatalog.books.map(b=>{const cs=textbookCatalog.chapters.filter(c=>c.book===b.id&&matchesTerms(`${c.title} ${b.title} ${c.sections.map(s=>s.title).join(' ')}`,q.split(/\s+/).filter(Boolean)));if(!cs.length)return '';return `<section class="textbook-book"><header><div>${icon('BookOpenText',24)}<h2>${esc(b.title)}</h2></div><p>${esc(b.author)} · ${esc(b.edition)}</p><span>${cs.length} chapters · ${b.pages} source pages</span></header><ol>${cs.map(c=>`<li><a href="#/textbook/${c.id}"><div><strong>${esc(c.title)}</strong><small>${c.sections.length?esc(c.sections.slice(0,4).map(s=>s.title).join(' · ')):esc(b.edition)}</small></div><span>${c.words.toLocaleString()} words<br>pp. ${c.startPage}–${c.endPage}</span>${icon('ArrowRight',15)}</a></li>`).join('')}</ol></section>`;}).join('')||'<p class="empty">No chapters match. Try another subject.</p>';}
async function getChapter(id){const r=await fetch(`textbooks/${encodeURIComponent(id)}.json`);if(!r.ok)throw Error('Could not load this chapter.');return r.json();}
export async function mountBookReader(host,id,{inline=false}={}){
 if(!host||!id)return;
 const token=Symbol();host.readerToken=token;
 host.innerHTML='<p class="loading-reader">Loading complete chapter…</p>';
 try{
 const c=await getChapter(id);if(!host.isConnected||host.readerToken!==token)return;
 let page=c.startPage,format='text',rendered=0;
 function draw(){
  if(!host.isConnected||host.readerToken!==token)return;
  host.innerHTML=`<section class="book-reader ${inline?'inline-reader':''}"><header class="book-reader-head"><div class="eyebrow">${inline?'DETAILED READING':'TEXTBOOK CHAPTER'} / ${esc(c.edition)}</div><h2>${esc(c.title)}</h2><p>${esc(bookName(c.book))} · ${esc(c.author)}</p><div class="book-reader-stats"><span>${c.words.toLocaleString()} words</span><span>${c.endPage-c.startPage+1} source pages</span><a href="Resources/${encodeURIComponent(c.file)}#page=${page}" target="_blank" rel="noopener">Original PDF ${icon('ArrowUpRight',12)}</a></div></header><div class="book-tools"><div class="book-formats"><button data-format="text" class="${format==='text'?'selected':''}">${icon('AlignLeft',14)} Reading text</button><button data-format="pages" class="${format==='pages'?'selected':''}">${icon('Images',14)} Original pages & figures</button></div><label>Page <select class="book-page-select" aria-label="Source PDF page">${c.pages.map(p=>`<option value="${p.number}" ${p.number===page?'selected':''}>${p.number}</option>`).join('')}</select></label></div><p class="source-attribution">Source text supplied by you; authorship remains with the credited source. Text extraction can flatten tables or code layout. Use “Original pages & figures” for exact formatting. Commands retain the source book’s release and hardware assumptions.</p><div class="book-reading-grid"><article class="book-text"><div class="source-pages"></div><button class="load-pages" data-more>Read the next pages ${icon('ArrowDown',14)}</button></article><nav class="book-sections" aria-label="Source chapter sections"><strong>IN THE SOURCE CHAPTER</strong>${c.sections.slice(0,70).map(s=>`<button data-source-page="${s.page}">${esc(s.title)}<small>p. ${s.page}</small></button>`).join('')||`<p>PDF pages ${c.startPage}–${c.endPage}</p>`}</nav></div></section>`;
  host.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>{format=b.dataset.format;draw();});
  host.querySelector('.book-page-select').onchange=e=>{page=Number(e.target.value);draw();};
  host.querySelectorAll('[data-source-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.sourcePage);draw();});
  host.querySelector('[data-more]').onclick=appendPages;
  rendered=c.pages.findIndex(p=>p.number===page);appendPages();
 }
 async function appendPages(){
  const target=host.querySelector('.source-pages');if(!target)return;
  const limit=format==='text'?4:2;
  const slice=c.pages.slice(rendered,rendered+limit);rendered+=slice.length;
  for(const p of slice){
   const el=document.createElement('section');el.className='source-page';el.dataset.page=p.number;
   el.innerHTML=`<header><span>${esc(c.title)}</span><a href="Resources/${encodeURIComponent(c.file)}#page=${p.number}" target="_blank" rel="noopener">PDF page ${p.number} ${icon('ExternalLink',11)}</a></header>${format==='text'?p.blocks.map(b=>b.type==='heading'?`<h3>${esc(b.text)}</h3>`:b.type==='code'?`<pre><code>${esc(b.text)}</code></pre>`:`<p>${esc(b.text)}</p>`).join(''):`<div class="pdf-page-render"><span>Rendering original page ${p.number}…</span><canvas aria-label="Original source page ${p.number}"></canvas></div>`}`;
   target.appendChild(el);
   if(format==='pages')renderOriginal(el,c.file,p.number).catch(error=>{if(el.isConnected)el.querySelector('.pdf-page-render').innerHTML=`<p>Could not render this page. <a href="Resources/${encodeURIComponent(c.file)}#page=${p.number}" target="_blank" rel="noopener">Open original PDF</a></p>`;console.error(error);});
  }
  const more=host.querySelector('[data-more]');if(more){more.hidden=rendered>=c.pages.length;more.innerHTML=`Read the next pages (${c.pages.length-rendered} remaining) ${icon('ArrowDown',14)}`;}
 }
 draw();
 }catch(error){host.innerHTML=`<p class="reader-error">${esc(error.message)} Refresh the page or inspect the local textbook files.</p>`;}
}
async function renderOriginal(element,file,pageNumber){
 if(!pdfModule){pdfModule=import('/node_modules/pdfjs-dist/build/pdf.mjs').then(module=>{module.GlobalWorkerOptions.workerSrc='/node_modules/pdfjs-dist/build/pdf.worker.mjs';return module;});}
 const pdfjs=await pdfModule;
 if(!documents.has(file))documents.set(file,pdfjs.getDocument({url:`Resources/${encodeURIComponent(file)}`}).promise);
 const doc=await documents.get(file),page=await doc.getPage(pageNumber);
 if(!element.isConnected)return;
 const canvas=element.querySelector('canvas');if(!canvas)return;
 const base=page.getViewport({scale:1}),width=Math.min(1200,Math.max(400,element.clientWidth*devicePixelRatio)),viewport=page.getViewport({scale:width/base.width});
 canvas.width=viewport.width;canvas.height=viewport.height;canvas.style.width='100%';canvas.style.height='auto';
 await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
 element.querySelector('.pdf-page-render>span')?.remove();
}
