# 技术博客自动化系统 🚀

## 📋 系统说明

这是一个自动化的技术博客系统，每天自动抓取最新技术资讯并生成博客文章。支持**文章头图**、**语言图标**、**热度标记**等丰富视觉效果。

## 🔄 数据来源

- **GitHub Trending** - 热门开源项目（带语言图标 📘🐍🦀）
- **Hacker News** - 技术新闻（带热度标记 🔥⭐）

> ⚠️ 稀土掘金已移除（API 不稳定）

## ⏰ 更新时间

- **每天 9:00** 自动更新（Asia/Shanghai 时区）
- Cron 任务 ID: `76087eb5-e616-4b5c-be41-84e5addf7b10`

## 📁 文件结构

```
/home/admin/openclaw/workspace/
├── scripts/
│   ├── tech_blog_updater.py    # 主更新脚本
│   ├── monitor_http.sh         # HTTP 服务器监控（30 秒检查）
│   └── update_blog.sh          # Shell 包装脚本
├── website/
│   ├── index.html              # 主页（带动画和特效）
│   ├── js/
│   │   └── marked.min.js       # Markdown 解析器（本地托管）
│   └── blog/
│       ├── index.html          # 博客列表页
│       ├── view.html           # 文章阅读页
│       ├── blog-list.json      # 博客索引
│       ├── README.md           # 本文档
│       └── YYYY-MM-DD.md       # 每日文章（带头图和图标）
└── memory/
    ├── blog_state.json         # 运行状态
    └── evolution_protocol.md   # 自进化协议
```

## ✨ 功能特性

### 视觉效果
- ✅ **文章头图** - 自动生成漂亮的渐变色头图
- ✅ **文章图标** - 每篇文章有专属 emoji 图标
- ✅ **语言图标** - 15 种编程语言图标映射
- ✅ **热度标记** - 高分 HN 文章自动标记 🔥
- ✅ **浮动粒子** - 背景粒子动画效果
- ✅ **鼠标光晕** - 鼠标移动光晕跟随
- ✅ **滚动动画** - 元素进入视口淡入
- ✅ **打字机效果** - 5 种角色循环显示

### 交互功能
- ✅ **访客统计** - 真实访问计数（localStorage）
- ✅ **运行时间** - 系统运行时长显示
- ✅ **回到顶部** - 平滑滚动回顶部
- ✅ **键盘快捷键** - Home/End 快速导航
- ✅ **点击特效** - 头像点击爆炸特效
- ✅ **控制台彩蛋** - 多种提示信息

### 技术特性
- ✅ **本地托管** - marked.js 不依赖 CDN
- ✅ **自动监控** - HTTP 服务器 30 秒自动检查
- ✅ **真实统计** - 访客计数器基于本地存储
- ✅ **响应式设计** - 支持移动端和桌面端

## 🚀 手动更新

```bash
# 运行更新脚本
bash /home/admin/openclaw/workspace/scripts/update_blog.sh

# 或直接运行 Python 脚本
python3 /home/admin/openclaw/workspace/scripts/tech_blog_updater.py
```

## 🌐 访问地址

- **主页**: https://imply-carotidal-velda.ngrok-free.dev
- **博客列表**: https://imply-carotidal-velda.ngrok-free.dev/blog/
- **最新文章**: https://imply-carotidal-velda.ngrok-free.dev/blog/view.html?file=2026-03-12.md

## 📊 Cron 任务管理

```bash
# 查看任务
openclaw cron list

# 立即运行
openclaw cron run 76087eb5-e616-4b5c-be41-84e5addf7b10

# 禁用任务
openclaw cron update 76087eb5-e616-4b5c-be41-84e5addf7b10 --enabled=false
```

## 🛠️ 监控和维护

```bash
# 检查 HTTP 服务器状态
ps aux | grep http.server

# 查看监控日志
tail -f /tmp/http_monitor.log

# 重启 HTTP 服务器
cd /home/admin/openclaw/workspace/website
python3 -m http.server 8080 &
```

## 📈 更新日志

### 2026-03-12
- ✅ 添加文章头图（placehold.co 生成）
- ✅ 添加文章图标和语言图标
- ✅ 添加 HN 热度标记
- ✅ 移除稀土掘金（API 不稳定）
- ✅ 访客计数器改为真实统计
- ✅ marked.js 本地托管
- ✅ 修复 JavaScript 错误

### 2026-03-11
- ✅ 创建自动化博客系统
- ✅ 设置 Cron 定时任务
- ✅ 配置 Ngrok 隧道
- ✅ 创建 OpenClaw Skill

## 🎯 下一步进化

- [ ] 添加更多数据源（InfoQ、机器之心等）
- [ ] 支持 Markdown → HTML 静态生成
- [ ] 添加评论系统
- [ ] 支持 RSS 订阅
- [ ] 添加搜索功能
- [ ] 添加文章分享功能

## 📝 文章格式示例

```markdown
---
title: 技术日报 2026-03-12
date: 2026-03-12
tags: [技术资讯，GitHub, Hacker News]
cover: https://placehold.co/1200x400/161b22/58a6ff?text=Tech+Daily
icon: 📰
---

# 📰 技术日报 2026-03-12
```

---

**最后更新**: 2026-03-12 09:35  
**状态**: 🟢 运行中  
**维护**: OpenClaw 自动化系统
