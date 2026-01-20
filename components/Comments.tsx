import React, { useState } from 'react';
import { Comment } from '../types';
import { User, MessageCircle, Send } from 'lucide-react';

interface Props {
  comments: Comment[];
  onAddComment: (author: string, content: string) => void;
}

const Comments: React.FC<Props> = ({ comments, onAddComment }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && content.trim()) {
      onAddComment(author, content);
      setAuthor('');
      setContent('');
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-2">
        <MessageCircle size={24} className="text-primary-600" />
        Comments ({comments.length})
      </h3>

      {/* List */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                    <User size={16} />
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-gray-700 text-sm ml-10 leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-medium text-gray-900 mb-4">Leave a comment</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
            <input 
              type="text" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-sm border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500 px-3 py-2"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Comment</label>
            <textarea 
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500 px-3 py-2"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <Send size={14} /> Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comments;