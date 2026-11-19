import {escapeHTML as esc,icon,readStored,writeStored} from './ui.js';
const N=(id,label,type,x,y,tone='paper',at=0)=>({id,label,type,x,y,tone,at});
const E=(from,to,label,at=0)=>({from,to,label,at});
const tones={paper:['#fbf6ef','#ddd3c5','#f1e8db'],green:['#e7efd9','#b2d491','#cfe3b2'],violet:['#ebe3f1','#d5c8e2','#e7ddf5'],orange:['#fbe5bd','#d5b07a','#fcdcbd'],blue:['#d6e5f6','#64728a','#d6e5f6'],mint:['#dff0de','#7fc278','#dcefd2'],rose:['#fbebe7','#ebbcb3','#f6cfc7']};
const family=(l)=>l.scene;
export function sceneFor(l,index){
  let nodes=[],edges=[];const f=family(l),labels=l.nodes||[];
  if(f==='power'){
    nodes=[N('host','Power + workload evidence','laptop',175,410),N('cpu','CPU frequency policy','chip',425,205,'orange'),N('device','Runtime PM device','board',730,240,'green',1),N('kernel','Linux PM core','stack',470,420,'violet',1),N('wake','Wake source','sensor',780,510,'blue',3),N('test','Resume + functional tests','queue',445,615,'mint',4)];
    edges=[E('host','cpu','measure completed work'),E('cpu','kernel','policy + constraints',1),E('kernel','device','idle / runtime resume',1),E('wake','kernel','configured wake event',3),E('kernel','test','validate recovery',4)];
  }else if(f==='graphics'){
    nodes=[N('host','Matching Qt SDK','laptop',165,420),N('app','Qt application','package',410,205,'violet'),N('compositor','Wayland compositor','service',475,415,'green',1),N('driver','DRM / graphics driver','stack',750,270,'blue',2),N('display','Display + input','board',765,520,'orange',3),N('evidence','Pixels + latency evidence','queue',450,620,'mint',4)];
    edges=[E('host','app','build + package'),E('app','compositor','platform plugin',1),E('compositor','driver','render + present',2),E('driver','display','scan out',3),E('display','evidence','observe + interact',4)];
  }else if(f==='containers'){
    nodes=[N('host','Host image + kernel','board',175,420,'green'),N('image','Pinned application image','package',425,205,'violet'),N('runtime','Container runtime','server',480,415,'orange',1),N('app','Isolated application','service',755,260,'blue',2),N('data','Explicit writable data','storage',775,530,'paper',3),N('policy','Device + capability policy','shield',440,625,'mint',4)];
    edges=[E('host','runtime','shared kernel',1),E('image','runtime','verified input',1),E('runtime','app','namespaces + limits',2),E('app','data','bounded state',3),E('policy','app','least privilege',4)];
  }else if(['boot','hardware','kernel','driver','interrupt','sensor'].includes(f)){
    nodes=[N('host','Developer','laptop',170,430,'paper'),N('board','Target board','board',465,385,'green'),N('rom',f==='sensor'?'I2C controller':'Boot ROM','chip',390,220,'orange',0),N('ram',f==='interrupt'?'IRQ controller':'DRAM','ram',645,235,'blue',1),N('kernel',f==='driver'?'Device driver':'Linux kernel','stack',740,415,'violet',2),N('app',f==='sensor'?'Sensor readings':'Userspace','service',620,570,'mint',4)];
    if(f==='sensor')nodes.push(N('sensor','Temperature sensor','sensor',225,210,'orange',0));
    edges=[E('host','board','UART console',0),E('rom','board',f==='sensor'?'bus transfers':'first-stage boot',0),E('board','ram',f==='interrupt'?'interrupt':'initialize RAM',1),E('ram','kernel',f==='driver'?'match + probe':'load + hand off',2),E('kernel','app',f==='sensor'?'IIO interface':'system calls',3)];
    if(f==='sensor')edges.push(E('sensor','rom','sample',0));
  }else if(['build','recipe','compile','sdk'].includes(f)){
    nodes=[N('host',f==='sdk'?'SDK host':'Build host','laptop',175,410),N('src','Source tree','folder',390,200,'paper'),N('engine',f==='compile'?'Cross compiler':f==='sdk'?'SDK toolchain':'BitBake','server',485,390,'orange',0),N('sysroot','Target sysroot','stack',700,205,'violet',1),N('package',f==='sdk'?'Application ELF':'Packages','package',745,425,'blue',3),N('target','Target image','board',525,575,'green',4)];
    edges=[E('host','engine','configure',0),E('src','engine','sources',0),E('sysroot','engine','headers + libraries',1),E('engine','package',f==='compile'?'compile + link':'install + package',2),E('package','target',f==='sdk'?'deploy + test':'compose image',4)];
  }else if(['layers','metadata','dependencies','cache','image','packages'].includes(f)){
    nodes=[N('host','Developer','laptop',165,450),N('bsp',f==='metadata'?'Configuration':'BSP layer','stack',365,205,'orange'),N('distro',f==='dependencies'?'Library recipe':'Distro policy','stack',600,175,'violet',1),N('engine',f==='cache'?'Task signatures':'BitBake graph','server',485,405,'paper'),N('product',f==='metadata'?'Overrides':'Product layer','stack',800,315,'green',2),N('output',f==='packages'?'Root filesystem':'Image + SDK','storage',745,555,'blue',4)];
    edges=[E('host','engine','build request'),E('bsp','engine',f==='metadata'?'parse variables':'hardware metadata'),E('distro','engine',f==='dependencies'?'DEPENDS':'distribution policy',1),E('product','engine',f==='dependencies'?'RDEPENDS':'product metadata',2),E('engine','output',f==='cache'?'reuse / execute':'package + assemble',3)];
    if(f==='cache'){nodes.push(N('cache','Shared-state cache','storage',250,640,'mint',1));edges.push(E('cache','engine','restore valid output',1));}
  }else if(f==='recovery'){
    nodes=[N('source','Authenticated service media','package',180,270,'violet'),N('recovery','Protected recovery system','board',465,390,'green'),N('verify','Compatibility + signature','shield',470,175,'orange',1),N('main','Main system image','storage',760,300,'blue',2),N('data','Preserved identity + data','storage',780,550,'paper',3),N('test','Boot + functional tests','queue',450,625,'mint',4)];
    edges=[E('source','verify','load candidate',1),E('verify','recovery','accepted input',1),E('recovery','main','install while offline',2),E('recovery','data','preserve / migrate',3),E('main','test','boot + validate',4)];
  }else if(f==='deployments'){
    nodes=[N('source','Versioned system content','package',165,310,'violet'),N('store','Content-addressed store','storage',455,200,'blue'),N('new','Candidate deployment','stack',750,290,'orange',1),N('old','Retained deployment','stack',465,425,'green',2),N('data','Shared persistent data','storage',775,555,'paper',3),N('boot','Boot selection + health','service',445,645,'mint',4)];
    edges=[E('source','store','verified content'),E('store','new','stage deployment',1),E('store','old','retain known-good',2),E('new','data','schema contract',3),E('new','boot','trial + confirm',4),E('old','boot','rollback path',4)];
  }else if(f==='ota'||f==='fleet'){
    nodes=[N('host','Release workstation','laptop',165,380),N('bundle','Signed bundle','package',380,190,'violet'),N('verify','Verify + install','shield',470,390,'orange',1),N('a','Slot A · known-good','storage',735,240,'green',0),N('b','Slot B · candidate','storage',770,470,'blue',2),N('health','Application health','service',485,610,index===4?'rose':'mint',3)];
    edges=[E('host','bundle','build + sign'),E('bundle','verify','authenticated input',1),E('verify','b','write inactive slot',2),E('b','health','trial boot',3),E('health',index>=4?'a':'b',index===4?'failed · keep unconfirmed':index>=5?'fallback to known-good':'health check',3)];
    if(f==='fleet'){nodes.push(N('fleet','Device fleet','fleet',845,630,'green',3));edges.push(E('health','fleet','staged rollout',3));}
  }else if(['network','gateway','ipc','services'].includes(f)){
    nodes=[N('sensor','Sensor input','sensor',180,250,'orange'),N('board','Linux device','board',430,400,'green'),N('worker',f==='ipc'?'Producer':'Acquisition service','service',450,180,'violet',1),N('queue',f==='services'?'Service dependencies':'Bounded queue','queue',715,310,'blue',2),N('cloud',f==='services'?'Ready / watchdog':'Network endpoint','cloud',820,515,'mint',3),N('data','Persistent data','storage',450,610,'paper',3)];
    edges=[E('sensor','board','hardware events'),E('board','worker','subsystem ABI',1),E('worker','queue',f==='ipc'?'publish + signal':'validated samples',2),E('queue','cloud',f==='services'?'health notification':'delivery + backpressure',3),E('worker','data','durable state',3)];
  }else if(['debug','trace','realtime','memory','process'].includes(f)){
    nodes=[N('host','Observation tools','laptop',170,420),N('app','Application','service',450,220,'green'),N('kernel','Kernel + scheduler','stack',485,440,'violet',1),N('resource',f==='memory'?'Physical pages':f==='realtime'?'Priority + mutex':'Device / syscall','chip',775,300,'orange',2),N('trace',f==='memory'?'Mappings + RSS / PSS':'Trace evidence','queue',750,550,'blue',3)];
    edges=[E('host','app',f==='debug'?'GDB / symbols':'controlled workload'),E('app','kernel','syscalls / scheduling',1),E('kernel','resource',f==='memory'?'page mapping':'execute / wait',2),E('resource','trace','timestamped evidence',3),E('trace','host','inspect + explain',3)];
  }else if(f==='filesystem'||f==='storage'){
    nodes=[N('host','Application','laptop',160,400),N('vfs','Filesystem tree','folder',440,205,'paper'),N('kernel','VFS / kernel','stack',460,420,'violet',1),N('root','Root filesystem','storage',735,255,'green',2),N('data','Persistent data','storage',790,480,'blue',3),N('cache','Memory / page cache','ram',460,610,'orange',3)];
    edges=[E('host','vfs','path + operation'),E('vfs','kernel','lookup / permissions',1),E('kernel','root','read system files',2),E('kernel','data','write mutable state',3),E('kernel','cache','buffered I/O',3)];
  }else if(f==='security'||f==='ci'){
    nodes=[N('host','Source + metadata','laptop',150,420),N('build','Controlled build','server',400,250,'orange'),N('inventory','SBOM + licenses','folder',655,160,'paper',1),N('trust','Trust policy','shield',665,415,'violet',2),N('artifact','Release artifact','package',850,560,'blue',3),N('target','Validated target','board',440,620,'green',4)];
    edges=[E('host','build','pinned inputs'),E('build','inventory','record components',1),E('build','trust','test + review',2),E('trust','artifact','sign + identify',3),E('artifact','target','deploy + validate',4)];
  }else{
    nodes=[N('host','You · development host','laptop',180,410),N('app','Programs + shell','service',465,200,'violet',0),N('kernel','Linux kernel','stack',500,410,'blue',1),N('board','Hardware','board',770,485,'green',2),N('storage','Files + persistent state','storage',480,625,'orange',3)];
    if(f==='git'){nodes[1].label='Working tree';nodes[2].label='Staged changes';nodes[3].label='Recorded commit';nodes[4].label='Patch + release identity';}
    if(f==='pipeline'){nodes[1].label='Shell + arguments';nodes[2].label='Program + streams';nodes[3].label='Next program';nodes[4].label='Output + status';}
    edges=[E('host','app',f==='git'?'edit + diff':'commands'),E('app','kernel',f==='git'?'stage selected change':'system calls',1),E('kernel','board',f==='git'?'commit':'drivers + resources',2),E('kernel','storage',f==='git'?'retain exact revision':'filesystem operations',3)];
  }
  const rows=Math.ceil(nodes.length/3),height=rows*370+40;
  nodes=nodes.map((n,i)=>({...n,x:190+(i%3)*360,y:190+Math.floor(i/3)*370}));
  const progress=index/(l.steps.length-1),limit=Math.min(4,Math.ceil(progress*4));
  nodes=nodes.filter(n=>n.at<=limit);const ids=new Set(nodes.map(n=>n.id));edges=edges.filter(e=>ids.has(e.from)&&ids.has(e.to)&&e.at<=limit);
  return {nodes,edges,width:1100,height,status:l.id==='ota'&&index===4?'Health check failed · candidate unconfirmed':l.steps[index].title,warning:l.id==='ota'&&index===4};
}
export function nodeBounds(n){const width=Math.max(230,n.label.length*7.2+46);return {left:n.x-width/2,right:n.x+width/2,top:n.y-165,bottom:n.y+170};}
export function connectionRoute(a,b,index=0){
 const aa=nodeBounds(a),bb=nodeBounds(b),right=b.x>=a.x,ax=right?aa.right+8:aa.left-8,bx=right?bb.left-8:bb.right+8,ay=a.y-20,by=b.y-20;
 if(a.y===b.y&&Math.abs(a.x-b.x)<=360)return `M ${ax} ${ay} L ${bx} ${by}`;
 const lane=a.y===b.y?a.y-178:Math.min(a.y,b.y)+185;
 return `M ${ax} ${ay} L ${ax+(right?10:-10)} ${ay} L ${ax+(right?10:-10)} ${lane} L ${bx+(right?-10:10)} ${lane} L ${bx+(right?-10:10)} ${by} L ${bx} ${by}`;
}
function tag(text,x,y,tone='paper',small=false){const w=Math.max(74,text.length*(small?6.2:7.2)+26),h=small?25:30;return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${tones[tone]?.[0]||tones.paper[0]}" stroke="#46413b" stroke-width="1.8"/><text text-anchor="middle" dominant-baseline="central" font-size="${small?9:11}" font-weight="600" fill="#29251f">${esc(text)}</text></g>`;}
function slab(width=95,depth=24,tone='paper'){const [top,left,right]=tones[tone]||tones.paper;return `<path d="M ${-width} 0 L 0 -48 L ${width} 0 L 0 48 Z" fill="${top}"/><path d="M ${-width} 0 L 0 48 L 0 ${48+depth} L ${-width} ${depth} Z" fill="${left}"/><path d="M 0 48 L ${width} 0 L ${width} ${depth} L 0 ${48+depth} Z" fill="${right}"/><path d="M ${-width} 0 L 0 -48 L ${width} 0 L ${width} ${depth} L 0 ${48+depth} L ${-width} ${depth} Z M ${-width} 0 L 0 48 L ${width} 0 M 0 48 V ${48+depth}" stroke="#46413b" stroke-width="2" stroke-linejoin="round" fill="none"/>`;}
function glyph(name,x,y,size=25){return `<g transform="translate(${x-size/2},${y-size/2})" color="#34302b">${icon(name,size)}</g>`;}
function art(n){const [top,left,right]=tones[n.tone]||tones.paper;let drawing='';
  if(n.type==='laptop'){
    drawing=`${slab(100,19,'paper')}<g transform="translate(-4,-25)"><path d="M -66 4 L 8 -35 L 76 0 L 1 42 Z" fill="#d7ccbd" stroke="#46413b" stroke-width="2"/><path d="M -61 0 L -61 -87 Q -61 -93 -55 -96 L 15 -132 Q 22 -135 22 -128 L 22 -44 Z" fill="#59524b" stroke="#29251f" stroke-width="2.5"/><path d="M -54 -4 L -54 -86 L 14 -122 L 14 -43 Z" fill="#fbf7f1" stroke="#1d1b18"/><path d="M -49 -75 L 9 -106 V -91 L -49 -60 Z" fill="#d9c9ed"/><path d="M -49 -52 L -5 -76 M -49 -42 L 5 -70 M -49 -32 L -15 -50" stroke="#9a9286" stroke-width="3"/><path d="M -40 7 L 8 -19 L 46 1 L -1 26 Z" fill="#f8f0e6" stroke="#8b847a"/><path d="M -31 8 L 8 -12 M -21 13 L 18 -7 M -11 18 L 28 -2 M -17 0 L 11 15 M -4 -7 L 24 8 M 9 -13 L 37 1" stroke="#b9b0a3"/><path d="M 9 29 L 27 19 L 42 27 L 24 37 Z" fill="#fbf7f1" stroke="#8b847a"/></g>`;
  }else if(n.type==='board'){
    drawing=`${slab(105,17,n.tone)}<g transform="translate(0,-10)"><path d="M -77 0 L 0 -39 L 77 0 L 0 39 Z" fill="#b2d491" stroke="#6f8756" stroke-width="1.5"/><path d="M -38 -3 L 0 -22 L 38 -3 L 0 16 Z" fill="#404a34" stroke="#29251f" stroke-width="2"/><path d="M -38 -3 L 0 16 L 38 -3 V 8 L 0 28 L -38 8 Z" fill="#626d45" stroke="#29251f"/><path d="M -65 -2 L -35 13 M -55 -16 L -26 -1 M 43 -14 L 65 -3 M 35 18 L 61 5" stroke="#e7efd9" stroke-width="3"/>${Array.from({length:7},(_,i)=>`<path d="M ${-76+i*10} ${18+i*5} v 7" stroke="#8f8478" stroke-width="4"/>`).join('')}<rect x="48" y="-7" width="25" height="14" rx="2" fill="#c6bbac" stroke="#46413b"/><circle cx="-64" cy="-6" r="3" fill="#e8a33a"/><circle class="board-led" cx="56" cy="10" r="3" fill="#3fa456"/></g>`;
  }else if(n.type==='stack'){
    drawing=`<g transform="translate(0,20)">${slab(82,15,n.tone)}</g><g transform="translate(0,0)">${slab(82,15,n.tone)}</g><g transform="translate(0,-20)">${slab(82,15,n.tone)}</g>${glyph('Layers',0,-36,28)}`;
  }else if(n.type==='storage'){
    drawing=`<path d="M -63 -27 V 48 C -63 77 63 77 63 48 V -27" fill="${right}" stroke="#46413b" stroke-width="2"/><ellipse cx="0" cy="-27" rx="63" ry="28" fill="${top}" stroke="#46413b" stroke-width="2"/><path d="M -63 -2 C -63 26 63 26 63 -2 M -63 22 C -63 50 63 50 63 22" fill="none" stroke="#46413b" stroke-width="1.4"/>${glyph('Database',0,-27,26)}`;
  }else if(n.type==='chip'||n.type==='ram'){
    drawing=`${slab(72,22,n.tone)}${Array.from({length:6},(_,i)=>`<path d="M ${-68+i*11} ${9+i*5.5} l -12 6 M ${10+i*11} ${35-i*5.5} l 12 6" stroke="#8b847a" stroke-width="4"/>`).join('')}${glyph(n.type==='ram'?'MemoryStick':'Cpu',0,-4,36)}`;
  }else if(n.type==='folder'){
    drawing=`${slab(78,16,n.tone)}<path d="M -57 4 V -67 L -25 -84 L -6 -74 L 47 -101 V -45 L -20 -11 Z" fill="${top}" stroke="#46413b" stroke-width="2"/><path d="M -51 -18 L 48 -69 L 63 -56 L 10 -4 Z" fill="${left}" stroke="#46413b" stroke-width="2"/>${glyph('FileCode2',-9,-45,25)}`;
  }else if(n.type==='queue'){
    drawing=`${slab(91,18,n.tone)}${[-45,-15,15,45].map((x,i)=>`<g transform="translate(${x},${-x*.45-20})"><rect x="-15" y="-18" width="27" height="39" rx="4" fill="${i===0?'#cfe3b2':top}" stroke="#46413b" stroke-width="1.6"/><path d="M -9 -6 h 15 M -9 1 h 15 M -9 8 h 9" stroke="#8b847a"/></g>`).join('')}`;
  }else if(n.type==='cloud'){
    drawing=`${slab(86,15,n.tone)}<path d="M -58 -14 C -83 -47 -49 -73 -27 -62 C -25 -104 35 -108 43 -69 C 82 -76 92 -24 59 -12 Z" fill="${top}" stroke="#46413b" stroke-width="2.3"/>${glyph('Network',5,-49,30)}`;
  }else if(n.type==='sensor'){
    drawing=`${slab(65,16,n.tone)}<rect x="-29" y="-87" width="58" height="79" rx="10" fill="${top}" stroke="#46413b" stroke-width="2"/><circle cx="0" cy="-60" r="16" fill="${right}" stroke="#46413b" stroke-width="1.5"/><path d="M -13 -24 h 26 M -13 -16 h 26" stroke="#8b847a"/>${glyph('Thermometer',0,-60,23)}`;
  }else if(n.type==='fleet'){
    drawing=`<g transform="translate(-46,-20) scale(.7)">${slab(60,25,'green')}</g><g transform="translate(46,-20) scale(.7)">${slab(60,25,'blue')}</g><g transform="translate(0,24) scale(.7)">${slab(60,25,'violet')}</g>${glyph('Network',0,-35,28)}`;
  }else if(n.type==='package'){
    drawing=`${slab(65,66,n.tone)}<path d="M -16 -40 L 16 -24 L 16 40 L 0 48 L -16 40 V -8 L -47 -24 Z" fill="#b99d7544"/>${glyph('Package',0,-3,30)}`;
  }else{
    const name=n.type==='shield'?'ShieldCheck':n.type==='service'?'Settings2':'Server';
    drawing=`${slab(77,62,n.tone)}${glyph(name,0,-3,33)}<path d="M 13 58 L 54 37 M 13 67 L 54 46" stroke="#46413b" stroke-width="1.3"/><circle cx="-45" cy="20" r="3" fill="#5fae57"/>`;
  }
  return `${drawing}${tag(n.label,0,150,n.tone)}`;
}
export class Scene {
  constructor(container,lesson,index=0){this.container=container;this.lesson=lesson;this.index=index;this.paused=false;this.zoom=Math.max(.5,Math.min(2.5,Number(readStored('zoom:'+lesson.id,1))||1));this.frame=0;this.last=0;this.render(index);}
  render(index){this.index=index;this.data=sceneFor(this.lesson,index);const {nodes,edges,status,warning}=this.data;const lookup=Object.fromEntries(nodes.map(n=>[n.id,n]));
    const routes=edges.map((e,i)=>({...e,d:connectionRoute(lookup[e.from],lookup[e.to],i)}));
    this.container.innerHTML=`<svg class="world" viewBox="0 0 1000 790" role="img" aria-label="${esc(this.lesson.title+' — '+this.lesson.steps[index].title)}"><defs><pattern id="iso-grid" width="48" height="28" patternUnits="userSpaceOnUse"><path d="M 0 0 L 48 28 M 48 0 L 0 28" stroke="#c6bbac" stroke-width=".65" opacity=".65"/></pattern><radialGradient id="grid-fade"><stop offset="0" stop-color="white"/><stop offset=".62" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="floor-mask"><ellipse cx="500" cy="435" rx="500" ry="310" fill="url(#grid-fade)"/></mask><filter id="ground-shadow"><feGaussianBlur stdDeviation="8"/></filter><marker id="route-arrow" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 1 1 L 10 5 L 1 9" fill="none" stroke="#46413b" stroke-width="1.7"/></marker></defs><g class="camera"><rect x="0" y="115" width="1000" height="620" fill="url(#iso-grid)" mask="url(#floor-mask)"/><g class="scene-routes">${routes.map((e,i)=>`<path id="route-${i}" d="${e.d}" class="scene-link" marker-end="url(#route-arrow)"/><circle class="packet" r="5" fill="${warning&&i===routes.length-1?'#d0683a':i%2?'#7fc278':'#b59bd5'}" data-route="${i}"/><g class="edge-tag">${tag(e.label,(lookup[e.from].x+lookup[e.to].x)/2,(lookup[e.from].y+lookup[e.to].y)/2-18,'paper',true)}</g>`).join('')}</g>${nodes.map((n,i)=>`<g class="entity" data-entity="${n.id}" style="--delay:${i*65}ms" transform="translate(${n.x},${n.y})"><ellipse cx="3" cy="61" rx="77" ry="25" fill="#503c23" opacity=".13" filter="url(#ground-shadow)"/>${art(n)}${warning&&n.id==='b'?`<g transform="translate(0,-90)">${tag('UNCONFIRMED',0,0,'rose')}</g>`:''}</g>`).join('')}</g></svg><div class="scene-caption ${warning?'warn':''}">${esc(status)}</div>`;
    this.resizeObserver?.disconnect();
    this.container.classList.add('interactive-scene');
    const svg=this.container.querySelector('.world');svg.setAttribute('viewBox',`0 0 ${this.data.width} ${this.data.height}`);
    this.container.querySelectorAll('.edge-tag').forEach(e=>e.remove());
    const viewport=document.createElement('div'),plane=document.createElement('div');viewport.className='scene-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','Diagram viewport');plane.className='scene-plane';plane.append(svg);viewport.append(plane);this.container.prepend(viewport);
    this.container.insertAdjacentHTML('beforeend',`<div class="scene-scale" data-no-translate><button data-scale="less" class="icon-button" title="Zoom out">${icon('Minus',13)}</button><label>${icon('ZoomIn',13)}<input type="range" min="50" max="250" step="5" value="${Math.round(this.zoom*100)}" aria-label="Diagram zoom"></label><output>${Math.round(this.zoom*100)}%</output><button data-scale="more" class="icon-button" title="Zoom in">${icon('Plus',13)}</button><button data-scale="fit" class="icon-button" title="Fit entire diagram">${icon('Scan',13)}</button></div><details class="scene-connections"><summary>${icon('ListTree',13)} Connections (${edges.length})</summary><ol>${edges.map(e=>`<li><strong>${esc(lookup[e.from].label)} → ${esc(lookup[e.to].label)}</strong><span>${esc(e.label)}</span></li>`).join('')}</ol></details>`);
    this.container.querySelector('[type=range]').oninput=e=>this.setScale(Number(e.target.value)/100);
    this.container.querySelectorAll('[data-scale]').forEach(b=>b.onclick=()=>b.dataset.scale==='fit'?this.setScale(1):this.setZoom(b.dataset.scale==='more'?.1:-.1));
    let drag=null;
    viewport.onpointerdown=e=>{if(e.button!==0)return;const box=viewport.getBoundingClientRect();this.focus={x:e.clientX-box.left,y:e.clientY-box.top};drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');};
    viewport.onpointermove=e=>{const box=viewport.getBoundingClientRect();this.focus={x:e.clientX-box.left,y:e.clientY-box.top};if(drag){viewport.scrollLeft=drag.left-(e.clientX-drag.x);viewport.scrollTop=drag.top-(e.clientY-drag.y);}};
    const release=()=>{drag=null;viewport.classList.remove('dragging');};viewport.onpointerup=release;viewport.onpointercancel=release;viewport.onlostpointercapture=release;
    viewport.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();const box=viewport.getBoundingClientRect();this.focus={x:e.clientX-box.left,y:e.clientY-box.top};this.setZoom(e.deltaY<0?.1:-.1);}},{passive:false});
    this.resizeObserver=new ResizeObserver(()=>this.applyZoom());this.resizeObserver.observe(viewport);
    this.paths=[...this.container.querySelectorAll('.scene-link')];this.packets=[...this.container.querySelectorAll('.packet')];this.applyZoom();cancelAnimationFrame(this.frame);this.start=performance.now();this.animate(this.start);
  }
  animate(now){if(!this.paused){const elapsed=(now-this.start)/1000;this.packets.forEach((packet,i)=>{const path=this.paths[i],length=path.getTotalLength(),phase=(elapsed*.25+i*.23)%1,p=path.getPointAtLength(phase*length);packet.setAttribute('cx',p.x);packet.setAttribute('cy',p.y);packet.style.opacity=phase<.08||phase>.94?.1:1;});}this.frame=requestAnimationFrame(t=>this.animate(t));}
  setPaused(value){if(this.paused&&!value)this.start+=performance.now()-this.pauseAt;this.paused=value;this.pauseAt=performance.now();this.container.classList.toggle('paused',value);}
  replay(){this.render(this.index);}
  setZoom(delta){this.setScale(this.zoom+delta);}
  setScale(value){const viewport=this.container.querySelector('.scene-viewport'),svg=this.container.querySelector('.world'),focus=this.focus||{x:viewport.clientWidth/2,y:viewport.clientHeight/2},before=svg.getBoundingClientRect(),box=viewport.getBoundingClientRect(),point={x:(box.left+focus.x-before.left)/before.width,y:(box.top+focus.y-before.top)/before.height};this.zoom=Math.max(.5,Math.min(2.5,value));writeStored('zoom:'+this.lesson.id,this.zoom);this.applyZoom();const after=svg.getBoundingClientRect();viewport.scrollLeft+=after.left+point.x*after.width-box.left-focus.x;viewport.scrollTop+=after.top+point.y*after.height-box.top-focus.y;if(this.zoom===1){viewport.scrollLeft=0;viewport.scrollTop=0;}}
  applyZoom(){const viewport=this.container.querySelector('.scene-viewport'),svg=this.container.querySelector('.world'),plane=this.container.querySelector('.scene-plane');if(!viewport||!svg)return;const fit=Math.min((viewport.clientWidth-12)/this.data.width,(viewport.clientHeight-12)/this.data.height),width=Math.max(1,this.data.width*fit*this.zoom),height=Math.max(1,this.data.height*fit*this.zoom);svg.style.width=width+'px';svg.style.height=height+'px';plane.style.width=Math.max(viewport.clientWidth,width)+'px';plane.style.height=Math.max(viewport.clientHeight,height)+'px';svg.querySelector('.camera').removeAttribute('transform');const range=this.container.querySelector('[type=range]'),output=this.container.querySelector('output');if(range)range.value=Math.round(this.zoom*100);if(output)output.textContent=Math.round(this.zoom*100)+'%';}
  destroy(){cancelAnimationFrame(this.frame);this.resizeObserver?.disconnect();}
}
