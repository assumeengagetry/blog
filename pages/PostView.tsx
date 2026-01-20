import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, addComment } from '../services/storage';
import { BlogPost } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Comments from '../components/Comments';
import { Edit2, Trash2, ArrowLeft, Calendar } from 'lucide-react';

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | undefined>();

  useEffect(() => {
    if (id) {
      const found = getPostById(id);
      if (found) {
        setPost(found);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (id && confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      navigate('/');
    }
  };

  const handleAddComment = (author: string, content: string) => {
    if (post) {
      const newComment = addComment(post.id, { author, content });
      setPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev);
    }
  };

  if (!post) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <article className="max-w-3xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to posts
      </Link>

      <header className="mb-10 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
            {post.tags[0] || 'Uncategorized'}
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg mt-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="prose prose-lg prose-slate mx-auto font-serif">
        <MarkdownRenderer content={post.content} />
      </div>

      <hr className="my-12 border-gray-200" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="text-sm text-gray-500">
          <p>Written by <span className="font-semibold text-gray-900">{post.author}</span></p>
          <p className="text-xs mt-1">Last updated {new Date(post.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/editor/${post.id}`} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <Edit2 size={16} /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <Comments comments={post.comments || []} onAddComment={handleAddComment} />
    </article>
  );
};

export default PostView;