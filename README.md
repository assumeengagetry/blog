
<div align="center">
  <img width="800" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mindstream AI Blog

> 一个基于 React + Vite 的 AI 博客平台，支持 Gemini API 智能内容生成，支持本地开发与 GitHub Actions 自动化部署。

---

## ✨ 功能特性

- 博客文章的增删改查
- Markdown 渲染与富文本编辑
- 评论系统
- 支持 Gemini API 智能内容生成（需配置 API KEY）
- 响应式设计，适配多端
- 一键自动化部署到 GitHub Pages

---

## 📦 技术栈

- React 19
- Vite 6
- TypeScript
- React Router DOM 7
- @google/genai (Gemini API)

---

## 🚀 本地运行

### 环境要求

- Node.js 18+（建议 20.x）

### 步骤

1. 安装依赖：
   ```bash
   npm install
   # 或 pnpm install
   ```
2. 新建 `.env.local` 文件，写入你的 Gemini API Key：
   ```env
   GEMINI_API_KEY=你的_Gemini_API_Key
   ```
3. 启动开发环境：
   ```bash
   npm run dev
   ```
4. 访问 http://localhost:3000

---

## 🛠️ 构建与预览

1. 构建生产包：
   ```bash
   npm run build
   ```
2. 本地预览生产包：
   ```bash
   npm run preview
   ```

---

## ⚙️ 环境变量说明

| 变量名           | 说明                | 必填 | 示例                |
|------------------|---------------------|------|---------------------|
| GEMINI_API_KEY   | Gemini API 密钥     | 是   | sk-xxxxxxx          |

---

## 🚢 GitHub Actions 自动化部署（CI/CD）

本项目已内置 GitHub Actions 工作流，支持自动构建并部署到 GitHub Pages。

### 步骤

1. **Fork 或上传本项目到你的 GitHub 仓库**
2. **在仓库 Settings → Secrets and variables → Actions → Repository secrets** 新增：
   - `GEMINI_API_KEY`（你的 Gemini API 密钥）
3. **推送到 main 分支**，GitHub Actions 会自动执行 `.github/workflows/deploy.yml`：
   - 安装依赖
   - 构建项目
   - 自动发布到 GitHub Pages（`gh-pages` 分支）

### 访问部署结果

部署完成后，可在仓库的 Settings → Pages 查看访问地址，通常为：

```
https://<你的GitHub用户名>.github.io/<仓库名>/
```

---

## 📁 目录结构

```
├── components/         # 组件
├── pages/              # 页面
├── services/           # API/工具
├── types.ts            # 类型定义
├── App.tsx             # 应用入口
├── index.tsx           # 入口文件
├── vite.config.ts      # Vite 配置
├── package.json        # 项目配置
└── ...
```

---

## 📝 License

MIT
