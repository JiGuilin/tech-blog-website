/**
 * 博客列表页面 JavaScript
 */

// ========== 全局变量 ==========
let allPosts = [];
let currentPage = 1;
const postsPerPage = 10;

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
}

function updateThemeText() {
    const themeText = document.getElementById('theme-text');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeText) {
        themeText.textContent = currentTheme === 'light' ? '浅色' : '深色';
    }
}

// ========== 博客加载 ==========
function loadBlogPosts() {
    fetch('blog-list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('加载失败');
            }
            return response.json();
        })
        .then(posts => {
            allPosts = posts;
            renderBlogList(posts);
            updateStats(posts);
        })
        .catch(error => {
            console.error('加载博客列表失败:', error);
            document.getElementById('blog-list').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>加载失败</h3>
                    <p>无法加载文章列表，请稍后重试</p>
                </div>
            `;
        });
}

// ========== 渲染博客列表 ==========
function renderBlogList(posts) {
    const blogList = document.getElementById('blog-list');
    
    if (!posts || posts.length === 0) {
        blogList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>暂无文章</h3>
                <p>博主正在努力创作中，敬请期待！</p>
            </div>
        `;
        return;
    }
    
    const html = posts.map(post => {
        const tags = post.tags ? post.tags.split(',').map(tag => 
            `<span class="tag">${tag.trim()}</span>`
        ).join('') : '';
        
        return `
            <a href="${post.url}" class="blog-card">
                <h2 class="blog-title">${post.title}</h2>
                <p class="blog-excerpt">${post.excerpt || ''}</p>
                <div class="blog-tags" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    ${tags}
                </div>
                <div class="blog-meta">
                    <span class="blog-date">
                        <i class="fas fa-calendar"></i>
                        ${post.date}
                    </span>
                    <span class="blog-word-count">
                        <i class="fas fa-font"></i>
                        ${post.words ? post.words.toLocaleString() : '0'} 字
                    </span>
                    ${post.githubCount ? `
                    <span class="blog-github">
                        <i class="fab fa-github"></i>
                        ${post.githubCount}
                    </span>
                    ` : ''}
                    ${post.hnCount ? `
                    <span class="blog-hn">
                        <i class="fas fa-fire"></i>
                        ${post.hnCount}
                    </span>
                    ` : ''}
                </div>
            </a>
        `;
    }).join('');
    
    blogList.innerHTML = html;
}

// ========== 更新统计 ==========
function updateStats(posts) {
    const totalPosts = document.getElementById('total-posts');
    const totalGithub = document.getElementById('total-github');
    const totalHn = document.getElementById('total-hn');
    
    if (totalPosts) {
        totalPosts.textContent = posts.length;
    }
    
    if (totalGithub) {
        const githubCount = posts.reduce((sum, post) => sum + (post.githubCount || 0), 0);
        totalGithub.textContent = githubCount;
    }
    
    if (totalHn) {
        const hnCount = posts.reduce((sum, post) => sum + (post.hnCount || 0), 0);
        totalHn.textContent = hnCount;
    }
}

// ========== 搜索功能 ==========
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            renderBlogList(allPosts);
            return;
        }
        
        const filtered = allPosts.filter(post => {
            const title = post.title.toLowerCase();
            const excerpt = (post.excerpt || '').toLowerCase();
            const tags = (post.tags || '').toLowerCase();
            
            return title.includes(query) || 
                   excerpt.includes(query) || 
                   tags.includes(query);
        });
        
        renderBlogList(filtered);
    });
}

// ========== 页面加载进度条 ==========
function showPageProgress() {
    const progressBar = document.getElementById('page-progress');
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20 + 5;
        if (progress >= 90) {
            progress = 90;
            clearInterval(interval);
        }
        progressBar.style.width = progress + '%';
    }, 100);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            progressBar.style.width = '100%';
            progressBar.classList.add('complete');
            setTimeout(() => progressBar.remove(), 500);
        }, 300);
    });
}

// ========== 回到顶部 ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 博客列表页面初始化...');
    
    // 初始化主题
    initTheme();
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
    
    // T 键切换主题
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // 显示页面加载进度
    showPageProgress();
    
    // 加载博客列表
    loadBlogPosts();
    
    // 初始化搜索
    initSearch();
    
    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        // 回到顶部按钮
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Home') {
            e.preventDefault();
            scrollToTop();
        }
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
    
    // 控制台信息
    console.log('%c📝 博客列表页面', 'font-size: 16px; font-weight: bold; color: #58a6ff;');
    console.log('%c💡 按 T 键切换主题', 'font-size: 12px; color: #d29922;');
});
