export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function matchesTerms(text,terms){
 const normalize=s=>String(s).toLowerCase().replace(/[\u2010-\u2015\u2212]/g,'-');
 const normalized=normalize(text);
 return terms.every(term=>new RegExp('(^|[^a-z0-9_])'+normalize(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(normalized));
}
export function icon(name,size=16){
  if(name==='Github')return `<img class="icon github-brand-icon" src="src/github-mark.svg" width="${size}" height="${size}" alt="" aria-hidden="true">`;
  const lucide=typeof window==='undefined'?null:window.lucide;
  const data=lucide?.[name]||lucide?.icons?.[name]||[];
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${data.map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escapeHTML(v)}"`).join(' ')}></${tag}>`).join('')}</svg>`;
}
export function readStored(key,fallback){try{return JSON.parse(localStorage.getItem('embedded:'+key))??fallback;}catch{return fallback;}}
export function writeStored(key,value){try{localStorage.setItem('embedded:'+key,JSON.stringify(value));}catch{}}
