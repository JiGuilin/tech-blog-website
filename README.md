# 🚀 个人技术博客网站

> 自动化技术新闻聚合与博客生成系统

[![Status](https://img.shields.io/badge/status-active-success)](https://github.com/JiGuilin/tech-blog-website)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Updated](https://img.shields.io/badge/updated-daily-success)](https://imply-carotidal-velda.ngrok-free.dev)

---

## 📋 项目简介

这是一个**全自动化的技术博客系统**，每天自动抓取最新技术资讯并生成精美的博客文章。

### ✨ 核心特性

- 🤖 **自动化更新** - 每天 9:00 自动发布技术日报
- 📰 **多源聚合** - GitHub Trending + Hacker News
- 🎨 **精美设计** - 深色科技风，带动画特效
- 📊 **实时监控** - 系统状态一目了然
- 🚀 **快速部署** - Ngrok 隧道，无需公网 IP

---

## 🌐 在线访问

| 页面 | 链接 |
|------|------|
| **主页** | https://imply-carotidal-velda.ngrok-free.dev |
| **博客** | https://imply-carotidal-velda.ngrok-free.dev/blog/ |
| **状态** | https://imply-carotidal-velda.ngrok-free.dev/status.html |
| **功能** | https://imply-carotidal-velda.ngrok-free.dev/FEATURES.md |

---

## 🎨 功能特性

### 视觉效果
- ✅ 浮动粒子背景
- ✅ 鼠标光晕跟随
- ✅ 滚动动画
- ✅ 打字机效果
- ✅ 卡片悬停特效
- ✅ 文章头图自动生成
- ✅ 语言图标映射（15 种）
- ✅ 热度标记系统

### 交互功能
- ✅ 访客统计（真实数据）
- ✅ 系统运行时间
- ✅ 键盘快捷键
- ✅ 回到顶部
- ✅ 双击导航

### 自动化
- ✅ 每日 9:00 自动更新
- ✅ HTTP 服务器监控（30 秒）
- ✅ 故障自动重启
- ✅ 状态日志记录

---

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| **前端** | HTML5, CSS3, JavaScript |
| **后端** | Python 3, http.server |
| **部署** | Ngrok Tunnel |
| **自动化** | Cron, Shell Scripts |
| **监控** | Custom Health Check |

---

## 📦 项目结构

```
tech-blog-website/
├── index.html              # 主页（带动画特效）
├── status.html             # 系统状态监控
├── FEATURES.md             # 功能清单
├── UPDATE_LOG.md           # 更新日志
├── js/
│   └── marked.min.js       # Markdown 解析器
├── snow-effect.js          # 雪花特效
└── blog/
    ├── index.html          # 博客列表页
    ├── view.html           # 文章阅读页
    ├── README.md           # 博客系统文档
    ├── blog-list.json      # 博客索引
    └── YYYY-MM-DD.md       # 每日文章
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/JiGuilin/tech-blog-website.git
cd tech-blog-website
```

### 2. 启动 HTTP 服务器

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

### 3. 配置 Ngrok

```bash
ngrok http 8080
```

### 4. 访问网站

打开浏览器访问 ngrok 显示的 URL

---

## ⏰ 自动化配置

### Cron 定时任务

```bash
# 每天 9:00 自动更新
0 9 * * * cd /path/to/website && python3 scripts/tech_blog_updater.py
```

### 监控脚本

```bash
# 每 30 秒检查 HTTP 服务器
while true; do
  curl -s http://localhost:8080 > /dev/null || echo "Server down!" | mail -s "Alert" admin@example.com
  sleep 30
done
```

---

## 📊 系统状态

| 组件 | 状态 | 说明 |
|------|------|------|
| HTTP 服务器 | 🟢 | 端口 8080 |
| Ngrok 隧道 | 🟢 | 外部访问 |
| 博客系统 | 🟢 | 自动更新 |
| 监控脚本 | 🟢 | 30 秒检查 |

---

## 📝 更新日志

### 2026-03-12
- ✅ 添加文章头图和图标
- ✅ 语言图标映射（15 种）
- ✅ HN 热度标记
- ✅ 系统状态监控页面
- ✅ 快捷键支持
- ✅ 双击导航
- ✅ 部署配置更新（ngrok 8080 端口）

### 2026-03-11
- ✅ 项目初始化
- ✅ 自动化博客系统
- ✅ Cron 定时任务
- ✅ Ngrok 隧道配置

---

## 🔧 常用命令

```bash
# 查看 git 状态
git status

# 查看提交历史
git log --oneline

# 推送更新
git add -A && git commit -m "feat: xxx" && git push

# 检查 HTTP 服务器
curl -I http://localhost:8080

# 查看 ngrok 隧道
curl -s http://localhost:4040/api/tunnels | python3 -m json.tool

# 查看监控日志
tail -f /tmp/http_monitor.log
```

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 👨‍💻 作者

**JiGuilin**

- GitHub: [@JiGuilin](https://github.com/JiGuilin)
- WeChat: Linden7552

---

## 🙏 致谢

- [OpenClaw](https://openclaw.ai) - AI 自动化框架
- [Ngrok](https://ngrok.com) - 内网穿透服务
- [Hacker News](https://news.ycombinator.com) - 技术新闻源
- [GitHub Trending](https://github.com/trending) - 开源项目趋势

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

*最后更新：2026-03-12 11:55*
