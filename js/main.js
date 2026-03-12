/**
 * 主页 JavaScript
 * 包含公共功能和主页特定交互
 */

// ========== 主题切换功能 ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();
    
    // 默认根据时间自动切换（6:00-18:00 亮色，其他时间暗色）
    let defaultTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    
    // 如果用户有保存的偏好，使用保存的
    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(defaultTheme, false);
    }
    
    updateThemeText();
}

// 设置主题
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

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// 更新主题按钮文字
function updateThemeText() {
    const themeText = document.getElementById('theme-text');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeText) {
        themeText.textContent = currentTheme === 'light' ? '浅色' : '深色';
    }
}

// 初始化主题切换按钮
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // T 键快速切换
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            toggleTheme();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themeName = currentTheme === 'light' ? '浅色' : '深色';
            console.log(`🎨 已切换到${themeName}主题`);
        }
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
    
    // 页面加载完成后完成进度条
    window.addEventListener('load', () => {
        setTimeout(() => {
            progressBar.style.width = '100%';
            progressBar.classList.add('complete');
            setTimeout(() => progressBar.remove(), 500);
        }, 300);
    });
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
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== 快捷键帮助 ==========
function showShortcutsHelp() {
    const help = `
⌨️  快捷键帮助

Home  - 回到顶部
End   - 滚动到底部
T     - 切换明暗主题
?     - 显示此帮助

💡 更多功能开发中...
    `.trim();
    console.log(help);
    alert(help);
}

// ========== 回到顶部 ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();
    initThemeToggle();
    
    // 显示页面加载进度
    showPageProgress();
    
    // 导航栏滚动效果
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
            nav.style.background = 'rgba(13, 17, 23, 0.98)';
        } else {
            nav.classList.remove('scrolled');
            nav.style.background = 'rgba(13, 17, 23, 0.95)';
        }
        
        // 导航栏隐藏/显示
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
        
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
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Home 键 - 回到顶部
        if (e.key === 'Home') {
            e.preventDefault();
            scrollToTop();
        }
        // End 键 - 滚动到底部
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        // ? 键 - 显示快捷键帮助
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            showShortcutsHelp();
        }
    });
    
    // 控制台欢迎信息
    console.log('%c👋 欢迎来到我的个人博客！', 'font-size: 20px; font-weight: bold; color: #58a6ff;');
    console.log('%c🤖 自动化技术博客系统运行中', 'font-size: 14px; color: #3fb950;');
    console.log('%c💡 提示：按 T 键切换主题，按 ? 查看快捷键', 'font-size: 12px; color: #d29922;');
});
