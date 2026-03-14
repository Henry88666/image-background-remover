# Image Background Remover

一个轻量级的在线图片背景移除工具，基于 Cloudflare Workers 和 Remove.bg API 构建。

## 功能特性

- 🚀 快速抠图 - 5秒内完成背景移除
- 🖼️ 支持拖拽上传 - 便捷的图片上传体验
- 👀 实时预览 - 左右对比原图和结果
- 💾 一键下载 - 透明背景 PNG 格式
- 🔒 隐私安全 - 图片不持久化存储

## 技术栈

- **前端**: 原生 HTML/CSS/JS
- **后端**: Cloudflare Worker
- **AI 服务**: Remove.bg API
- **部署**: Cloudflare Pages + Workers

## 项目结构

```
image-background-remover/
├── src/
│   ├── worker.js          # Cloudflare Worker 后端代码
│   └── index.html         # 前端页面
├── wrangler.toml          # Cloudflare 配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 设置 Remove.bg API Key
wrangler secret put REMOVE_BG_API_KEY
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 部署

```bash
npm run deploy
```

## 开发计划

### Week 1: 核心功能
- [ ] 搭建 Cloudflare Worker
- [ ] 对接 Remove.bg API
- [ ] 开发前端页面
- [ ] 联调测试

### Week 2: 优化上线
- [ ] 响应式适配
- [ ] 错误处理完善
- [ ] 性能优化
- [ ] 部署上线

## 成本估算

| 项目 | 费用 | 说明 |
|------|------|------|
| Cloudflare Workers | 免费 | 10万次/天 |
| Cloudflare Pages | 免费 | 无限流量 |
| Remove.bg API | ~$0.09/张 | 按量付费 |

## 许可证

MIT
