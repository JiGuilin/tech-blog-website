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
    console.log('🎨 主题：' + next);
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

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 文章页初始化');
    initTheme();
    
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); toggleTheme(); });
    
    document.addEventListener('keydown', e => {
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
    });
    
    generateTOC();
    calcReadingTime();
});
