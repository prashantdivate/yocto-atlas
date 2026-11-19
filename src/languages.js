import {escapeHTML as esc,icon,readStored,writeStored} from './ui.js';
export const languages=[['en','English'],['es','Español'],['pt','Português'],['fr','Français'],['it','Italiano'],['de','Deutsch'],['nl','Nederlands'],['pl','Polski'],['tr','Türkçe'],['id','Bahasa Indonesia'],['vi','Tiếng Việt'],['el','Ελληνικά'],['uk','Українська'],['ru','Русский'],['zh','简体中文'],['zh-Hant','繁體中文'],['ja','日本語'],['ko','한국어'],['hi','हिन्दी'],['ar','العربية'],['he','עברית']];
const keys=['Learn','Architecture Playground','Practice','Cheatsheets','Library','Explore','Read chapter','Hands-on lab','Knowledge check','Back','Next','Language','Apply language','Close'];
const rows={
 en:keys,
 es:['Aprender','Explorador de arquitectura','Práctica','Guías rápidas','Biblioteca','Explorar','Leer capítulo','Laboratorio práctico','Evaluación','Atrás','Siguiente','Idioma','Aplicar idioma','Cerrar'],
 pt:['Aprender','Explorador de arquitetura','Prática','Referências rápidas','Biblioteca','Explorar','Ler capítulo','Laboratório prático','Avaliação','Voltar','Próximo','Idioma','Aplicar idioma','Fechar'],
 fr:['Apprendre','Atelier d’architecture','Exercices','Aide-mémoire','Bibliothèque','Explorer','Lire le chapitre','Travaux pratiques','Évaluation','Retour','Suivant','Langue','Appliquer la langue','Fermer'],
 it:['Impara','Laboratorio di architettura','Esercizi','Guide rapide','Biblioteca','Esplora','Leggi il capitolo','Laboratorio pratico','Verifica','Indietro','Avanti','Lingua','Applica lingua','Chiudi'],
 de:['Lernen','Architektur-Spielplatz','Übungen','Kurzreferenzen','Bibliothek','Erkunden','Kapitel lesen','Praxislabor','Wissenstest','Zurück','Weiter','Sprache','Sprache anwenden','Schließen'],
 nl:['Leren','Architectuurwerkplaats','Oefenen','Naslagkaarten','Bibliotheek','Verkennen','Hoofdstuk lezen','Praktijklab','Kennistoets','Terug','Volgende','Taal','Taal toepassen','Sluiten'],
 pl:['Nauka','Pracownia architektury','Ćwiczenia','Ściągawki','Biblioteka','Eksploruj','Czytaj rozdział','Laboratorium','Sprawdź wiedzę','Wstecz','Dalej','Język','Zastosuj język','Zamknij'],
 tr:['Öğren','Mimari çalışma alanı','Alıştırma','Hızlı başvuru','Kütüphane','Keşfet','Bölümü oku','Uygulama laboratuvarı','Bilgi kontrolü','Geri','İleri','Dil','Dili uygula','Kapat'],
 id:['Belajar','Ruang desain arsitektur','Latihan','Referensi ringkas','Pustaka','Jelajahi','Baca bab','Praktik langsung','Uji pengetahuan','Kembali','Berikutnya','Bahasa','Terapkan bahasa','Tutup'],
 vi:['Học','Không gian kiến trúc','Thực hành','Tra cứu nhanh','Thư viện','Khám phá','Đọc chương','Bài thực hành','Kiểm tra kiến thức','Quay lại','Tiếp theo','Ngôn ngữ','Áp dụng ngôn ngữ','Đóng'],
 el:['Μάθηση','Εργαστήριο αρχιτεκτονικής','Εξάσκηση','Σύντομες αναφορές','Βιβλιοθήκη','Εξερεύνηση','Ανάγνωση κεφαλαίου','Πρακτικό εργαστήριο','Έλεγχος γνώσεων','Πίσω','Επόμενο','Γλώσσα','Εφαρμογή γλώσσας','Κλείσιμο'],
 uk:['Навчання','Майстерня архітектури','Практика','Шпаргалки','Бібліотека','Огляд','Читати розділ','Практична робота','Перевірка знань','Назад','Далі','Мова','Застосувати мову','Закрити'],
 ru:['Обучение','Мастерская архитектуры','Практика','Шпаргалки','Библиотека','Обзор','Читать главу','Практическая работа','Проверка знаний','Назад','Далее','Язык','Применить язык','Закрыть'],
 zh:['学习','架构设计工作台','练习','速查表','资料库','探索','阅读章节','动手实验','知识测验','返回','下一步','语言','应用语言','关闭'],
 'zh-Hant':['學習','架構設計工作臺','練習','速查表','資料庫','探索','閱讀章節','動手實驗','知識測驗','返回','下一步','語言','套用語言','關閉'],
 ja:['学習','アーキテクチャ設計室','練習','早見表','ライブラリ','探索','章を読む','実習','理解度チェック','戻る','次へ','言語','言語を適用','閉じる'],
 ko:['학습','아키텍처 설계 공간','연습','빠른 참조','자료실','탐색','장 읽기','실습','지식 확인','뒤로','다음','언어','언어 적용','닫기'],
 hi:['सीखें','आर्किटेक्चर प्रयोगशाला','अभ्यास','त्वरित संदर्भ','पुस्तकालय','अन्वेषण','अध्याय पढ़ें','व्यावहारिक प्रयोग','ज्ञान जाँच','वापस','अगला','भाषा','भाषा लागू करें','बंद करें'],
 ar:['تعلّم','مساحة تصميم البنية','تدريب','مراجع سريعة','المكتبة','استكشاف','قراءة الفصل','مختبر عملي','اختبار المعرفة','رجوع','التالي','اللغة','تطبيق اللغة','إغلاق'],
 he:['למידה','סדנת ארכיטקטורה','תרגול','דפי עזר','ספרייה','סיור','קריאת הפרק','מעבדה מעשית','בדיקת ידע','חזרה','הבא','שפה','החלת שפה','סגירה']
};
const compact={en:'Playground',es:'Taller',pt:'Oficina',fr:'Atelier',it:'Laboratorio',de:'Werkstatt',nl:'Werkplaats',pl:'Pracownia',tr:'Atölye',id:'Desain',vi:'Thiết kế',el:'Εργαστήριο',uk:'Майстерня',ru:'Мастерская',zh:'设计台','zh-Hant':'設計臺',ja:'設計室',ko:'설계실',hi:'प्रयोगशाला',ar:'التصميم',he:'סדנה'};
export function translateLabel(text,code='en'){if(text==='Playground')return compact[code]||compact.en;const i=keys.indexOf(text);return i<0?text:(rows[code]||rows.en)[i];}
let locale=readStored('language','en');if(!languages.some(([id])=>id===locale))locale='en';
let translator=null,generation=0,observer=null,timer=null;
const originals=new WeakMap(),cache=new Map();
export const currentLanguage=()=>locale;
export const languageNames=['English','Spanish','Portuguese','French','Italian','German','Dutch','Polish','Turkish','Indonesian','Vietnamese','Greek','Ukrainian','Russian','Chinese (Simplified)','Chinese (Traditional)','Japanese','Korean','Hindi','Arabic','Hebrew'];
const languageBadge=code=>code==='zh'?'简':code==='zh-Hant'?'繁':code==='uk'?'UA':code.toUpperCase();
export function languageOptions(selected='en'){return languages.map(([code,name],i)=>`<button type="button" role="menuitemradio" aria-checked="${code===selected}" data-language="${code}" class="language-option ${code===selected?'selected':''}"><span class="language-badge">${code===selected?icon('Check',16):languageBadge(code)}</span><span><strong lang="${code}" dir="auto">${esc(name)}</strong><small>${languageNames[i]}</small></span></button>`).join('');}
function status(text){const el=document.querySelector('#language-status');if(el)el.textContent=text;}
function skipped(node){return !!node.parentElement?.closest('pre,code,kbd,svg,script,style,textarea,input,.brand,[data-no-translate]');}
async function translatePage(){
 const token=generation,root=document.querySelector('#app');if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node;while(node=walker.nextNode())if(node.textContent.trim()&&!skipped(node))nodes.push(node);
 for(const node of nodes){if(token!==generation)return;if(!node.isConnected)continue;const original=originals.get(node)??node.textContent;originals.set(node,original);const raw=original.trim();let translated=translateLabel(raw,locale);
  if(locale!=='en'&&translated===raw&&translator&&raw.length>2&&node.parentElement.closest('#content,.course-tree')){
   const key=locale+':'+raw;try{if(!cache.has(key))cache.set(key,await translator.translate(raw));translated=cache.get(key);}catch{continue;}
  }
  if(token!==generation)return;const value=original.replace(raw,translated);if(node.isConnected&&node.textContent!==value)node.textContent=value;
 }
}
export function refreshLanguage(){document.documentElement.lang=locale;document.documentElement.dir=['ar','he'].includes(locale)?'rtl':'ltr';clearTimeout(timer);timer=setTimeout(translatePage,40);}
export function bindLanguages(){
 const app=document.querySelector('#app');
 app.insertAdjacentHTML('beforeend',`<div id="language-menu" popover="auto" data-no-translate><h2>LANGUAGE</h2><div class="language-grid" role="menu" aria-label="Language">${languageOptions(locale)}</div><p id="language-status" role="status">On-device chapter translation where supported. Code and original PDFs remain unchanged.</p></div>`);
 const opener=document.querySelector('#language-open'),menu=document.querySelector('#language-menu');
 opener.classList.add('language-trigger');opener.setAttribute('popovertarget','language-menu');opener.setAttribute('aria-haspopup','menu');opener.setAttribute('aria-expanded','false');
 function updateTrigger(){opener.innerHTML=`${icon('Globe',16)}<span>${languageBadge(locale)}</span>${icon('ChevronDown',12)}`;opener.title='Language: '+languages.find(([id])=>id===locale)[1];opener.setAttribute('aria-label',opener.title);}
 updateTrigger();
 menu.addEventListener('toggle',e=>{opener.setAttribute('aria-expanded',String(e.newState==='open'));if(e.newState==='open'){const r=opener.getBoundingClientRect();menu.style.top=Math.min(r.bottom+10,window.innerHeight-150)+'px';menu.style.left=Math.max(12,Math.min(r.right-560,window.innerWidth-Math.min(560,window.innerWidth-24)-12))+'px';menu.querySelector('[aria-checked="true"]')?.focus();}});
 menu.addEventListener('keydown',e=>{const buttons=[...menu.querySelectorAll('[data-language]')],i=buttons.indexOf(document.activeElement);let next;if(e.key==='ArrowDown')next=(i+1)%buttons.length;if(e.key==='ArrowUp')next=(i+buttons.length-1)%buttons.length;if(e.key==='ArrowRight')next=Math.min(i+11,buttons.length-1);if(e.key==='ArrowLeft')next=Math.max(i-11,0);if(e.key==='Home')next=0;if(e.key==='End')next=buttons.length-1;if(next!==undefined){e.preventDefault();buttons[next].focus();}});
 menu.addEventListener('click',e=>{const button=e.target.closest('[data-language]');if(button)select(button.dataset.language);});
 async function select(code){generation++;translator?.destroy?.();translator=null;locale=code;writeStored('language',locale);refreshLanguage();updateTrigger();menu.querySelector('.language-grid').innerHTML=languageOptions(locale);menu.hidePopover();opener.focus();
  if(code==='en'){status('Original English restored.');return;}
  if(!('Translator' in window)){status('Navigation translated. Full chapter translation is unavailable in this browser. Use a compatible desktop Chrome browser with on-device translation; original PDF pages and code stay unchanged.');return;}
  status('Preparing on-device translation…');const selected=generation;
  try{const model=await window.Translator.create({sourceLanguage:'en',targetLanguage:code,monitor(m){m.addEventListener('downloadprogress',e=>{if(selected===generation)status(`Downloading language model: ${Math.round(e.loaded*100)}%`);});}});if(selected!==generation){model.destroy?.();return;}translator=model;status('On-device machine translation is active. Verify technical meaning against the English source. Code and original PDF pages remain unchanged.');refreshLanguage();}
  catch{if(selected===generation)status('This language model could not be loaded. Navigation is localized; chapter prose remains in English. Retry in a supported desktop browser.');}
 }
 if(!observer){observer=new MutationObserver(()=>refreshLanguage());observer.observe(app,{childList:true,subtree:true});}
 refreshLanguage();
}
