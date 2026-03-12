/**
 * 文章页 JavaScript
 */

// ========== 主题切换 ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    let defaultTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    if (savedTheme) setTheme(savedTheme, false);
    else setTheme(defaultTheme, false);
    updateThemeText();
}

function setTheme(theme, save = true) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    if (save) {
        localStorage.setItem('theme', theme);
        updateThemeText();
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
}

function updateThemeText() {
    const el = document.getElementById('theme-text');
    if (el) {
        const current = document.documentElement.getAttribute('data-theme');
        el.textContent = current === 'light' ? '浅色' : '深色';
    }
}

// ========== Toast ==========
function showToast(msg, dur = 2000) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--bg-card);color:var(--text-primary);padding:0.75rem 1.5rem;border-radius:8px;border:1px solid var(--border);box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;font-size:0.95rem;animation:toastIn 0.3s';
    document.body.appendChild(t);
    setTimeout(() => { t.style.animation = 'toastOut 0.3s'; setTimeout(() => t.remove(), 300); }, dur);
}

// ========== 加载文章 ==========
function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    
    if (!file) {
        document.getElementById('article-title').textContent = '文章未找到';
        document.getElementById('article-content').innerHTML = '<p>请指定文章文件名</p>';
        return;
    }
    
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error('文章加载失败');
            return res.text();
        })
        .then(markdown => {
            // 解析 front matter
            const frontMatter = {};
            let content = markdown;
            
            const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/);
            if (fmMatch) {
                const fmLines = fmMatch[1].split('\n');
                fmLines.forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    if (key && valueParts.length > 0) {
                        let value = valueParts.join(':').trim();
                        // 处理数组格式 [tag1, tag2]
                        if (value.startsWith('[') && value.endsWith(']')) {
                            value = value.slice(1, -1).split(',').map(s => s.trim());
                        }
                        frontMatter[key.trim()] = value;
                    }
                });
                // 移除 front matter
                content = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
            }
            
            const html = marked.parse(content);
            document.getElementById('article-content').innerHTML = html;
            
            // 使用 front matter 或 markdown 标题
            const title = frontMatter.title || (markdown.match(/^#\s+(.+)$/m) || [])[1];
            if (title) {
                document.getElementById('article-title').textContent = title;
                document.title = title + ' | 我的博客';
                
                // 移除文章内容中的第一个 H1（避免和 banner 标题重复）
                const articleContent = document.getElementById('article-content');
                const firstH1 = articleContent.querySelector('h1');
                if (firstH1 && firstH1.textContent.includes(title)) {
                    firstH1.remove();
                }
            }
            
            // 移除文章内容中的重复元素
            setTimeout(() => {
                const articleContent = document.getElementById('article-content');
                
                // 移除"本文由自动化脚本生成"（底部已有）
                const elements = articleContent.querySelectorAll('p, em, div, span');
                elements.forEach(el => {
                    const text = el.textContent;
                    if (text.includes('自动化脚本生成') || text.includes('最后更新') || text.includes('🤖')) {
                        el.remove();
                    }
                });
                
                // 移除引言 blockquote（banner 已有标题和元信息）
                const firstBlockquote = articleContent.querySelector('blockquote');
                if (firstBlockquote && firstBlockquote.textContent.includes('每日精选技术资讯')) {
                    firstBlockquote.remove();
                }
                
                // 移除头图（banner 已有）
                const images = articleContent.querySelectorAll('img');
                images.forEach(img => {
                    if (img.alt && (img.alt.includes('头图') || img.alt.includes('header'))) {
                        img.closest('p')?.remove();
                    }
                });
            }, 150);
            
            // 更新元信息
            if (frontMatter.date) {
                document.getElementById('publish-date').textContent = frontMatter.date;
            }
            if (frontMatter.tags) {
                const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [frontMatter.tags];
                document.getElementById('article-tags').innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join(' ');
            }
            
            // 添加代码复制按钮
            document.querySelectorAll('pre').forEach(pre => {
                const btn = document.createElement('button');
                btn.className = 'copy-code-btn';
                btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
                btn.onclick = () => copyCode(btn);
                pre.parentNode.insertBefore(btn, pre);
            });
            
            // 生成目录和计算阅读时间
            setTimeout(() => {
                generateTOC();
                calcReadingTime();
            }, 100);
        })
        .catch(err => {
            console.error('加载失败:', err);
            document.getElementById('article-title').textContent = '加载失败';
            document.getElementById('article-content').innerHTML = '<p>文章加载失败，请稍后重试</p>';
        });
}

// ========== 目录 ==========
function generateTOC() {
    const content = document.getElementById('article-content');
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('toc-container');
    if (!content || !tocList) return;
    
    const headings = content.querySelectorAll('h2,h3,h4');
    if (headings.length === 0) { tocContainer.style.display = 'none'; return; }
    
    headings.forEach((h, i) => { if (!h.id) h.id = 'heading-' + i; });
    
    tocList.innerHTML = Array.from(headings).map(h => 
        `<li class="toc-${h.tagName.toLowerCase()}"><a href="#${h.id}" data-target="${h.id}">${h.textContent}</a></li>`
    ).join('');
    
    tocContainer.classList.add('show');
    
    window.addEventListener('scroll', () => {
        const pos = window.scrollY + 150;
        headings.forEach(h => {
            if (pos >= h.offsetTop && pos < h.offsetTop + h.offsetHeight) {
                tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                const link = tocList.querySelector(`a[data-target="${h.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    });
}

// ========== 阅读时间 ==========
function calcReadingTime() {
    const content = document.getElementById('article-content');
    const timeEl = document.getElementById('reading-time-value');
    const wordEl = document.getElementById('word-count');
    if (!content) return;
    
    const words = content.innerText.length;
    const mins = Math.ceil(words / 300);
    if (timeEl) timeEl.textContent = mins < 1 ? '< 1 分钟' : mins + ' 分钟';
    if (wordEl) wordEl.textContent = words.toLocaleString() + ' 字';
}

// ========== 分享 ==========
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => showToast('📋 链接已复制'));
}

function shareToWeixin() { showToast('💬 请打开微信分享'); }

function shareToWeibo() {
    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(document.title)}`, '_blank');
}

function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`, '_blank');
}

function copyCode(btn) {
    const code = btn.closest('div').querySelector('pre code') || btn.closest('div').querySelector('pre');
    navigator.clipboard.writeText(code.textContent).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> 复制', 2000);
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 文章页初始化');
    initTheme();
    loadArticle();
    
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); toggleTheme(); });
    
    document.addEventListener('keydown', e => {
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
    });
});
