# Image Background Remover

一个轻量级的在线图片背景移除工具，基于 Next.js + Tailwind CSS + Remove.bg API 构建。

## 功能特性

- 🚀 快速抠图 - 5秒内完成背景移除
- 🖼️ 支持拖拽上传 - 便捷的图片上传体验
- 👀 实时预览 - 左右对比原图和结果
- 💾 一键下载 - 透明背景 PNG 格式
- 🔒 隐私安全 - 图片不持久化存储
- 📱 响应式设计 - 支持移动端

## 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **后端**: Next.js API Routes
- **AI 服务**: Remove.bg API
- **部署**: Vercel / 任何支持 Node.js 的平台

## 项目结构

```
image-background-remover/
├── app/
│   ├── api/remove-bg/
│   │   └── route.ts       # API 路由（后端）
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── docs/
│   └── MVP-Requirements.md # 需求文档
├── .gitignore
├── next.config.js         # Next.js 配置
├── package.json
├── postcss.config.js      # PostCSS 配置
├── tailwind.config.ts     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

获取 API Key: https://www.remove.bg/api

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建

```bash
npm run build
```

### 5. 部署到 Vercel

```bash
npm i -g vercel
vercel
```

## 开发计划

### Week 1: 核心功能
- [x] 搭建 Next.js 项目
- [x] 配置 Tailwind CSS
- [x] 开发前端页面（上传、预览、下载）
- [x] 对接 Remove.bg API
- [ ] 联调测试

### Week 2: 优化上线
- [x] 响应式适配
- [x] 错误处理完善
- [ ] 性能优化
- [ ] 部署上线

## 成本估算

| 项目 | 费用 | 说明 |
|------|------|------|
| Vercel Hobby | 免费 | 个人项目足够 |
| Remove.bg API | ~$0.09/张 | 按量付费 |
| **月度预估** | <$10 | 100张以内几乎免费 |

## 许可证

MIT
