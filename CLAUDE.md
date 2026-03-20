# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (Vite, port 3000)
- `npm run build` - Build production bundle to `./dist`
- `npm run preview` - Preview production build locally

## Architecture

**Tech Stack:**
- React 19 + TypeScript + Vite 6
- React Router DOM (HashRouter) for routing
- @google/genai for AI content generation
- Tailwind CSS for styling (via class names)

**Project Structure:**
```
├── components/         # Shared UI components (Layout, Comments, MarkdownRenderer)
├── pages/              # Route components (Home, PostView, Editor)
├── services/           # Business logic
│   ├── gemini.ts       # Gemini API integration (text + image generation)
│   └── storage.ts      # localStorage persistence for blog posts
├── types.ts            # TypeScript interfaces (BlogPost, Comment, AI types)
├── App.tsx             # Root component with routing
└── index.tsx           # Entry point
```

**Key Patterns:**
- **Local-first storage**: All blog posts/comments stored in localStorage via `storage.ts`
- **AI features**: `gemini.ts` provides `generateBlogContent`, `generateBlogIdeas`, `generateCoverImage`
- **Routing**: Uses HashRouter with paths: `/`, `/post/:id`, `/editor/:id`
- **Markdown**: Blog content written/stored as Markdown, rendered via `MarkdownRenderer.tsx`

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on push to `main` branch.

## Environment

Create `.env.local` for local development:
```
GEMINI_API_KEY=your_key_here
```

Vite config exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.