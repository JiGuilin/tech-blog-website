/**
 * 博客列表页面 JavaScript
 */

// ========== 主题切换 ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    let defaultTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(defaultTheme, false);
    }
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
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('🎨 主题已切换：' + newTheme);
}

function updateThemeText() {
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        themeText.textContent = currentTheme === 'light' ? '浅色' : '深色';
    }
}

// ========== 博客加载 ==========
function loadBlogPosts() {
    fetch('blog-list.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            renderBlogList(posts);
            updateStats(posts);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('blog-list').innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>加载失败</h3></div>';
        });
}

function renderBlogList(posts) {
    const blogList = document.getElementById('blog-list');
    if (!posts || posts.length === 0) {
        blogList.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>暂无文章</h3></div>';
        return;
    }
    blogList.innerHTML = posts.map(post => `
        <a href="${post.url}" class="blog-card">
            <h2 class="blog-title">${post.title}</h2>
            <p class="blog-excerpt">${post.excerpt || ''}</p>
            <div class="blog-tags" style="display:flex;gap:0.5rem;margin-bottom:1rem;">
                ${(post.tags || '').split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}
            </div>
            <div class="blog-meta">
                <span class="blog-date"><i class="fas fa-calendar"></i> ${post.date}</span>
                <span class="blog-word-count"><i class="fas fa-font"></i> ${(post.words || 0).toLocaleString()} 字</span>
                ${post.githubCount ? `<span><i class="fab fa-github"></i> ${post.githubCount}</span>` : ''}
                ${post.hnCount ? `<span><i class="fas fa-fire"></i> ${post.hnCount}</span>` : ''}
            </div>
        </a>
    `).join('');
}

function updateStats(posts) {
    const el = id => document.getElementById(id);
    if (el('total-posts')) el('total-posts').textContent = posts.length;
    if (el('total-github')) el('total-github').textContent = posts.reduce((s, p) => s + (p.githubCount || 0), 0);
    if (el('total-hn')) el('total-hn').textContent = posts.reduce((s, p) => s + (p.hnCount || 0), 0);
}

// ========== 搜索 ==========
function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const filtered = q ? allPosts.filter(p => 
            (p.title || '').toLowerCase().includes(q) || 
            (p.excerpt || '').toLowerCase().includes(q) ||
            (p.tags || '').toLowerCase().includes(q)
        ) : allPosts;
        renderBlogList(filtered);
    });
}

// ========== 初始化 ==========
let allPosts = [];
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 博客列表初始化');
    initTheme();
    
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', e => { e.preventDefault(); toggleTheme(); });
    }
    
    document.addEventListener('keydown', e => {
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
    });
    
    loadBlogPosts();
    initSearch();
});
