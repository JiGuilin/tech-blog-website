let posts=[];
const load=()=>fetch('blog-list.json?t='+Date.now()).then(r=>r.json()).then(d=>{posts=d;render(d);stats(d)}).catch(()=>$('blog-list').innerHTML='<div class="empty-state"><i class="fas fa-inbox"></i><h3>加载失败</h3></div>');
const render=ps=>{
  const b=$('blog-list');if(!ps?.length){b.innerHTML='<div class="empty-state"><i class="fas fa-inbox"></i><h3>暂无文章</h3></div>';return}
  b.innerHTML=ps.map(p=>`<a href="view.html?file=${p.url.split('=')[1]}" class="blog-card"><h2 class="blog-title">${p.title}</h2><div class="blog-tags">${(p.tags||'').split(',').map(t=>`<span class="tag">${t.trim()}</span>`).join('')}</div><div class="blog-meta"><span><i class="fas fa-calendar"></i> ${p.date}</span><span><i class="fas fa-font"></i> ${(p.words||0).toLocaleString()}字</span>${p.githubCount?`<span><i class="fab fa-github"></i> ${p.githubCount}</span>`:''}${p.hnCount?`<span><i class="fas fa-fire"></i> ${p.hnCount}</span>`:''}</div></a>`).join('')
};
const stats=ps=>{const s=(i,v)=>{const e=$(i);if(e)e.textContent=v};s('total-posts',ps.length);s('total-github',ps.reduce((a,b)=>a+(b.githubCount||0),0));s('total-hn',ps.reduce((a,b)=>a+(b.hnCount||0),0))};
const search=()=>{const i=$('search-input');if(!i)return;i.addEventListener('input',e=>{const q=e.target.value.toLowerCase();render(q?posts.filter(p=>(p.title+p.excerpt+p.tags).toLowerCase().includes(q)):posts)});};
$('theme-toggle')?.addEventListener('click',e=>{e.preventDefault();theme.toggle()});
document.addEventListener('keydown',e=>{if(e.key==='t'||e.key==='T'){e.preventDefault();theme.toggle()}});
theme.init();load();search();
