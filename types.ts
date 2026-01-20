export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string; // Base64 or URL
  tags: string[];
  createdAt: number;
  updatedAt: number;
  published: boolean;
  author: string;
  comments?: Comment[];
}

export type AIModelType = 'text' | 'image';

export interface AIRequestState {
  loading: boolean;
  error: string | null;
}

export interface AIGeneratedContent {
  text?: string;
  image?: string;
}