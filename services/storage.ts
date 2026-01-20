import { BlogPost, Comment } from '../types';

const STORAGE_KEY = 'mindstream_posts';

// Seed data to ensure the blog isn't empty on first load
const SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    title: 'Welcome to MindStream',
    excerpt: 'This is a local-first, AI-powered blogging platform built with React and Gemini.',
    content: `# Welcome to MindStream

This blog uses **localStorage** to save your posts, meaning everything stays in your browser.

## Features

- **AI Writing Assistant**: Use Gemini to draft posts or fix grammar.
- **AI Image Generation**: Create unique cover art for your stories.
- **Markdown Support**: Write in clean, formatted text.

Enjoy writing!`,
    tags: ['Welcome', 'Guide'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    published: true,
    author: 'Admin',
    coverImage: 'https://picsum.photos/800/400',
    comments: [
      {
        id: 'c1',
        author: 'MindStream User',
        content: 'This looks amazing! Can not wait to start writing.',
        createdAt: Date.now()
      }
    ]
  }
];

export const getPosts = (): BlogPost[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse posts", e);
    return [];
  }
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.id === id);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === post.id);
  if (index >= 0) {
    posts[index] = { ...post, updatedAt: Date.now() };
  } else {
    posts.unshift({ ...post, createdAt: Date.now(), updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const addComment = (postId: string, comment: { author: string; content: string }): Comment => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === postId);
  
  if (index === -1) throw new Error("Post not found");

  const newComment: Comment = {
    id: crypto.randomUUID(),
    author: comment.author,
    content: comment.content,
    createdAt: Date.now()
  };

  if (!posts[index].comments) {
    posts[index].comments = [];
  }
  
  posts[index].comments.push(newComment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  
  return newComment;
};