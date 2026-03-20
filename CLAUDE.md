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
gh-pages index.html
Vite config exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MindStream AI Blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              serif: ['Merriweather', 'serif'],
            },
            colors: {
              primary: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
                900: '#0c4a6e',
              }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: #f8fafc;
      }
    </style>

  <script type="importmap">
{
  "imports": {
    "react-router-dom": "https://esm.sh/react-router-dom@^7.12.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "lucide-react": "https://esm.sh/lucide-react@^0.562.0",
    "@google/genai": "https://esm.sh/@google/genai@^1.37.0",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3"
  }
}
</script>
  <script type="module" crossorigin src="/blog/assets/index-D4WIFAjJ.js"></script>
</head>
  <body>
    <div id="root"></div>
  </body>
</html>
