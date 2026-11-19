"""Turn the supplied local PDFs into attributed, chapter-addressable site content."""
import json
import re
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
out = root / 'textbooks'
out.mkdir(exist_ok=True)
catalog = []
books = []
search = []
names = {
 'Mastering-Embedded-Linux-Development-4th-Edition': ('Mastering Embedded Linux Development', 'Frank Vasquez & Chris Simmonds', 'Fourth edition · Linux 6.6 / Scarthgap'),
 'Mastering-Embedded-Linux-Programming-3rd-Edition': ('Mastering Embedded Linux Programming', 'Frank Vasquez & Chris Simmonds', 'Third edition · Linux 5.4 / Dunfell'),
 'Embedded-Linux-Development-Using-Yocto-Project-4th-Edition': ('Embedded Linux Development Using Yocto Project', 'Otavio Salvador & Daiane Angolini', 'Fourth edition · Yocto 6.0 / Wrynose'),
 'Embedded-Linux-Essentials-Handbook': ('Embedded Linux Essentials Handbook', 'Mohammed Billoo', '2026 edition'),
 'Embedded-Systems-Architecture-2nd-Edition': ('Embedded Systems Architecture', 'Daniele Lacamera', 'Second edition · includes microcontroller/RTOS material'),
 'Yocto-Project-Scarthgap-Learning-Handbook': ('Yocto Project Scarthgap Learning Handbook', 'Sajad Mosayebi', 'Yocto 5.0 / Scarthgap'),
 'Yocto-SDK-Extensible-SDK-and-Devtool': ('Yocto SDK, Extensible SDK and Devtool', 'RAHALI Rahma', 'Technical tutorial'),
 'Yocto-Metadata-Dependencies-and-Recipe-Providers': ('Yocto Metadata, Dependencies and Recipe Providers', 'RAHALI Rahma', 'Technical tutorial'),
 'Yocto-Packaging-and-Image-Generation': ('Yocto Packaging and Image Generation', 'RAHALI Rahma', 'Technical tutorial'),
 'Understanding-Fakeroot-and-Pseudo-in-Yocto': ('Understanding Fakeroot and Pseudo in Yocto', 'Supplied technical reference', 'Technical article'),
 'RAUC-Bundle-Creation-Verification-and-Installation': ('RAUC Bundle Creation, Verification and Installation', 'Supplied technical reference', 'Technical article'),
 'The-Impact-of-Your-Choices-on-Yocto-Project-Systems': ('The Impact of Your Choices on Yocto Project Systems', 'Marco Cavallini · KOAN', 'Yocto Project Dev Day · 2026')
}
def norm(text):
 return ' '.join(str(text).replace('\u00ad', '').split())

def flatten(reader, outline, depth=0):
 result = []
 for item in outline:
  if isinstance(item,list):
   result.extend(flatten(reader,item,depth+1))
  else:
   page = reader.get_destination_page_number(item)
   if page is not None:
    result.append({'title':norm(item.title),'page':page+1,'depth':depth})
 return result

def category(title,book):
 t=title.lower()
 if any(s in t for s in ['real-time','profil','tracing','debugging','managing memory']): return 'diagnosis'
 if any(s in t for s in ['update','rauc','security','securing','trusted','license','sbom','bill of materials','integration/continuous','best practices']): return 'release'
 if any(s in t for s in ['yocto','bitbake','packaging support','layer','metadata','recipe','package','local.conf','configuration','reproducib']): return 'yocto'
 if any(s in t for s in ['driver','kernel','devicetree','device tree','peripheral','bus interface']): return 'kernel'
 if any(s in t for s in ['boot','starting up','init program','runit']): return 'boot'
 if any(s in t for s in ['root filesystem','storage','filesystem','power management','managing power','energy']): return 'storage'
 if any(s in t for s in ['toolchain','work environment','rust']): return 'development'
 if any(s in t for s in ['python','qt','application','threads','parallel','container','scheduling','sdk','network','graphics']): return 'applications'
 if any(s in t for s in ['project','architectur','distributed','future','workflow']): return 'systems'
 return 'linux'

def blocks(text, headings):
 text=re.sub(r'(\w)-\n([a-z])',r'\1\2',text.replace('\u00ad',''))
 lines=text.splitlines(); result=[]; prose=[]; code=[]
 def flush_prose():
  if prose: result.append({'type':'paragraph','text':' '.join(prose)});prose.clear()
 def flush_code():
  if code: result.append({'type':'code','text':'\n'.join(code)});code.clear()
 for raw in lines:
  line=raw.strip()
  if not line:
   flush_prose();flush_code();continue
  if re.fullmatch(r'\d{1,4}',line):continue
  if '\ufffd' in line and line.count('\ufffd')>len(line)*.2:continue
  is_heading=norm(line) in headings or bool(re.fullmatch(r'(?:Summary|Technical requirements|Further (?:study|reading)|IMPORTANT NOTE|Example\s*\d*\s*:?)',line,re.I))
  is_code=bool(re.match(r'^(?:\$ |#\s*(?:include|define|!|[A-Za-z_]+=)|(?:SRC_URI|SRCREV|LICENSE|DEPENDS|RDEPENDS|FILES|IMAGE_|PACKAGE|MACHINE|DISTRO|inherit |require |include |do_[a-z_]+\s*\(|[A-Z_]+\s*[?:+.]?=)|[{}]|(?:int|void|char|struct|static|return|printf)\b|(?:bitbake|devtool|make|gcc|sudo|cd|git|install|systemctl|journalctl|mount|cp|ls)\s)',line))
  if is_heading:
   flush_prose();flush_code();result.append({'type':'heading','text':line})
  elif is_code:
   flush_prose();code.append(raw)
  else:
   flush_code();prose.append(line)
 flush_prose();flush_code()
 return result

for path in sorted((root/'Resources').glob('*.pdf')):
 reader=PdfReader(path)
 cached=root/'.research'/(path.stem+'.json')
 pages=json.loads(cached.read_text(encoding='utf-8')) if cached.exists() else [p.extract_text() or '' for p in reader.pages]
 entries=flatten(reader,reader.outline)
 tops=[e for e in entries if e['depth']==0]
 starts=[e for e in tops if re.match(r'^Chapter\s+\d+\s*:',e['title'],re.I) and not re.search('Unlock.*Benefits',e['title'],re.I)]
 if path.stem=='Embedded-Linux-Development-Using-Yocto-Project-4th-Edition':
  starts=[]
  for i,e in enumerate(tops[:-1]):
   if e['title'].isdigit() and 1<=int(e['title'])<=18:
    nxt=tops[i+1]
    if nxt['page']==e['page']:starts.append({'title':f"Chapter {e['title']}: {nxt['title']}",'page':e['page'],'depth':0})
 elif path.stem=='Yocto-Project-Scarthgap-Learning-Handbook':
  starts=[e for e in tops if e['page']<44]
 elif path.stem=='Yocto-SDK-Extensible-SDK-and-Devtool':
  starts=[{'title':'SDK introduction and target environment','page':2,'depth':0},{'title':'The standard SDK','page':5,'depth':0},{'title':'The extensible SDK','page':11,'depth':0},{'title':'Devtool workflows and examples','page':18,'depth':0}]
 elif not starts and tops:
  starts=tops
 if not starts:
  starts=[{'title':names[path.stem][0],'page':1,'depth':0}]
 title,author,edition=names[path.stem]
 book={'id':path.stem,'file':path.name,'title':title,'author':author,'edition':edition,'pages':len(pages),'chapters':[]}
 boundaries=[e['page'] for e in tops if re.match(r'^(?:Index|Other Books|About Packt|Chapter \d+: Unlock|Unlock Your Exclusive)',e['title'],re.I)]
 for i,start in enumerate(starts):
  end=starts[i+1]['page']-1 if i+1<len(starts) else min([b-1 for b in boundaries if b>start['page']]+[len(pages)])
  end=max(start['page'],end)
  chapter_id=f'{path.stem}--{i+1:02d}'
  section_entries=[e for e in entries if start['page']<=e['page']<=end and e['title']!=start['title'] and not e['title'].isdigit()]
  seen=set();sections=[]
  for e in section_entries:
   key=(e['title'],e['page'])
   if key not in seen:sections.append({'title':e['title'],'page':e['page']});seen.add(key)
  heads={e['title'] for e in section_entries}
  chapter_pages=[{'number':n,'text':pages[n-1],'blocks':blocks(pages[n-1],heads)} for n in range(start['page'],end+1)]
  words=sum(len(p['text'].split()) for p in chapter_pages)
  record={'id':chapter_id,'book':book['id'],'title':re.sub(r'^Chapter\s+\d+\s*:\s*','',start['title']),'sourceTitle':start['title'],'author':author,'edition':edition,'file':path.name,'startPage':start['page'],'endPage':end,'words':words,'category':category(start['title'],path.stem),'sections':sections}
  (out/(chapter_id+'.json')).write_text(json.dumps({**record,'pages':chapter_pages},ensure_ascii=False),encoding='utf-8')
  catalog.append(record);book['chapters'].append(chapter_id)
  search.append({'id':chapter_id,'title':record['title'],'book':title,'text':' '.join(p['text'] for p in chapter_pages)})
 books.append(book)
 print(f'{title}: {len(starts)} technical chapters, {sum(c["words"] for c in catalog if c["book"]==book["id"]):,} words',flush=True)
(out/'catalog.json').write_text(json.dumps({'books':books,'chapters':catalog,'totalWords':sum(c['words'] for c in catalog)},ensure_ascii=False),encoding='utf-8')
(out/'search.json').write_text(json.dumps(search,ensure_ascii=False),encoding='utf-8')
print(f'Published locally: {len(catalog)} attributed technical chapters / {sum(c["words"] for c in catalog):,} words')
