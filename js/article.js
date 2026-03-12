/**
 * 文章页 JavaScript
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
}

function updateThemeText() {
    const themeText = document.getElementById('theme-text');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeText) {
        themeText.textContent = currentTheme === 'light' ? '浅色' : '深色';
    }
}

// ========== Toast 提示 ==========
function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 0.95rem;
        animation: toastIn 0.3s ease-out;
    `;
    
    // 添加动画样式
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes toastOut {
                from { opacity: 1; transform: translateX(-50%) translateY(0); }
                to { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== 文章目录 ==========
function generateTOC() {
    const articleContent = document.getElementById('article-content');
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('toc-container');
    
    if (!articleContent || !tocList) return;
    
    // 获取所有 H2/H3/H4 标题
    const headings = articleContent.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) {
        tocContainer.style.display = 'none';
        return;
    }
    
    // 为每个标题添加 ID
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
    
    // 生成目录
    tocList.innerHTML = Array.from(headings).map(heading => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent.trim();
        return `
            <li class="toc-${level}">
                <a href="#${heading.id}" data-target="${heading.id}">${text}</a>
            </li>
        `.trim();
    }).join('');
    
    // 显示目录
    tocContainer.classList.add('show');
    
    // 监听滚动高亮
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 150;
        
        headings.forEach((heading, index) => {
            const headingTop = heading.offsetTop;
            const headingHeight = heading.offsetHeight;
            
            if (scrollPosition >= headingTop && scrollPosition < headingTop + headingHeight) {
                tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                const activeLink = tocList.querySelector(`a[data-target="${heading.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // 平滑滚动
    tocList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========== 阅读时间计算 ==========
function calculateReadingTime() {
    const articleContent = document.getElementById('article-content');
    const readingTimeEl = document.getElementById('reading-time-value');
    
    if (!articleContent || !readingTimeEl) return;
    
    // 获取文本内容
    const text = articleContent.innerText || articleContent.textContent;
    const wordCount = text.length;
    
    // 中文阅读速度：约 300 字/分钟
    const readingSpeed = 300;
    const readingTimeMinutes = Math.ceil(wordCount / readingSpeed);
    
    // 更新显示
    if (readingTimeMinutes < 1) {
        readingTimeEl.textContent = '< 1 分钟';
    } else if (readingTimeMinutes < 60) {
        readingTimeEl.textContent = `${readingTimeMinutes} 分钟`;
    } else {
        const hours = Math.floor(readingTimeMinutes / 60);
        const mins = readingTimeMinutes % 60;
        readingTimeEl.textContent = `${hours}小时${mins}分钟`;
    }
    
    // 更新字数统计
    const wordCountEl = document.getElementById('word-count');
    if (wordCountEl) {
        wordCountEl.textContent = `${wordCount.toLocaleString()} 字`;
    }
}

// ========== 分享功能 ==========

// 复制链接
function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('📋 链接已复制到剪贴板');
    }).catch(() => {
        // 降级方案
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('📋 链接已复制');
    });
}

// 分享到微信
function shareToWeixin() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    showToast('💬 请打开微信，粘贴链接分享给好友');
}

// 分享到微博
function shareToWeibo() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const shareUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
    window.open(shareUrl, '_blank');
}

// 分享到 Twitter
function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    window.open(shareUrl, '_blank');
}

// 复制代码
function copyCode(btn) {
    const pre = btn.closest('div').querySelector('pre');
    const code = pre.querySelector('code') || pre;
    navigator.clipboard.writeText(code.textContent).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
        }, 2000);
    });
}

// 回到顶部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // T 键切换主题
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // 滚动进度条
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // 回到顶部按钮
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });
});
