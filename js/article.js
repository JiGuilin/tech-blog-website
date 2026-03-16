const parseFM=md=>{const m=md.match(/^---\n([\s\S]*?)\n---\n/);if(!m)return{fm:{},content:md};const fm={};m[1].split('\n').forEach(l=>{const[k,...v]=l.split(':');if(k&&v.length){let s=v.join(':').trim();if(s.startsWith('[')&&s.endsWith(']'))s=s.slice(1,-1).split(',').map(x=>x.trim());fm[k.trim()]=s}});return{fm,content:md.replace(/^---\n[\s\S]*?\n---\n/,'')}};
const copy=async(txt)=>{try{await navigator.clipboard.writeText(txt)}catch(e){}};

let lastMod=null;
function loadArticle(){
  const file=new URLSearchParams(window.location.search).get('file');
  if(!file){$('article-title').textContent='文章未找到';return}
  fetch(file+'?t='+Date.now()).then(r=>{if(!r.ok)throw 0;lastMod=r.headers.get('last-modified')||lastMod;return r.text()})
  .then(md=>{
    const{fm,content}=parseFM(md);
    $('article-content').innerHTML=marked.parse(content);
    const title=fm.title||(md.match(/^#\s+(.+)$/m)||[])[1];
    if(title){$('article-title').textContent=title;document.title=title+' | 博客';const h=$('article-content')?.querySelector('h1');if(h&&h.textContent.includes(title))h.remove()}
    if(fm.date)$('publish-date').textContent=fm.date;
    if(fm.tags){const t=Array.isArray(fm.tags)?fm.tags:[fm.tags];$('article-tags').innerHTML=t.map(x=>`<span class="tag">${x}</span>`).join(' ')}
    $$('pre').forEach(pre=>{
      const btn=document.createElement('button');btn.className='copy-code-btn';btn.innerHTML='<i class="fas fa-copy"></i>';
      btn.onclick=()=>{copy(pre.textContent);btn.innerHTML='<i class="fas fa-check"></i>';setTimeout(()=>btn.innerHTML='<i class="fas fa-copy"></i>',2e3)};
      pre.parentNode.insertBefore(btn,pre);
    });
    setTimeout(()=>{genTOC();calcTime()},100);
  }).catch(()=>{$('article-title').textContent='加载失败';$('article-content').innerHTML='<p>加载失败</p>'});
}

function genTOC(){
  const c=$('article-content'),list=$('toc-list'),box=$('toc-container');
  if(!c||!list)return;const h=$$('h2,h3,h4',c);
  if(!h.length){box.style.display='none';return}
  h.forEach((x,i)=>{if(!x.id)x.id='h-'+i});
  list.innerHTML=[...h].map((x,i)=>`<li class="toc-${x.tagName.toLowerCase()}"><a href="#${x.id}">${x.textContent}</a></li>`).join('');
  box.classList.add('show');
}

function calcTime(){
  const c=$('article-content'),w=c?c.innerText.length:0,m=Math.ceil(w/300);
  const t=$('reading-time-value'),e=$('word-count');
  if(t)t.textContent=m<1?'<1 分':m+'分';if(e)e.textContent=w.toLocaleString()+'字';
}

$('theme-toggle')?.addEventListener('click',e=>{e.preventDefault();theme.toggle()});
document.addEventListener('keydown',e=>{if(e.key==='t'||e.key==='T'){e.preventDefault();theme.toggle()}});
theme.init();loadArticle();
