import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/storage';
import { BlogPost } from '../types';
import { Clock, Calendar, ArrowRight, Tag, ArrowDownUp, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

  const filteredAndSortedPosts = [...posts]
    .filter(post => selectedTag === 'all' || post.tags.includes(selectedTag))
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createdAt - a.createdAt;
      }
      return a.createdAt - b.createdAt;
    });

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-10">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
          Thoughts, Stories & Ideas.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          A collection of writings enhanced by artificial intelligence. 
          Exploring the intersection of creativity and technology.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
           {selectedTag === 'all' ? 'Latest Posts' : `Posts in "${selectedTag}"`}
        </h2>
        
        <div className="flex flex-wrap items-center gap-6">
           <div className="flex items-center gap-2 group">
             <Filter size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
             <select 
               value={selectedTag} 
               onChange={(e) => setSelectedTag(e.target.value)}
               className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer hover:text-gray-900 transition-colors py-1 pr-8"
               aria-label="Filter by tag"
             >
               <option value="all">All Topics</option>
               {allTags.map(tag => (
                 <option key={tag} value={tag}>{tag}</option>
               ))}
             </select>
           </div>

           <div className="flex items-center gap-2 group">
              <ArrowDownUp size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer hover:text-gray-900 transition-colors py-1 pr-8"
                aria-label="Sort posts"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid gap-10">
        {filteredAndSortedPosts.map((post) => (
          <article key={post.id} className="group grid md:grid-cols-12 gap-6 items-start border-b border-gray-100 pb-10 last:border-0">
            {post.coverImage && (
              <div className="md:col-span-4 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className={`${post.coverImage ? 'md:col-span-8' : 'md:col-span-12'} space-y-3`}>
              <div className="flex items-center gap-3 text-xs font-semibold text-primary-600 uppercase tracking-wider">
                {post.tags[0] && <span>{post.tags[0]}</span>}
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-gray-400 font-normal normal-case flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(post.createdAt)}
                </span>
              </div>
              
              <Link to={`/post/${post.id}`} className="block">
                <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <Link 
                  to={`/post/${post.id}`} 
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  Read full story <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start writing your first AI-assisted blog post.</p>
            <Link to="/editor/new" className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition">
              Create Post
            </Link>
          </div>
        )}

        {posts.length > 0 && filteredAndSortedPosts.length === 0 && (
           <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
             <p className="text-gray-500 mt-2 mb-6">No posts match the selected tag.</p>
             <button onClick={() => setSelectedTag('all')} className="text-primary-600 font-medium hover:underline">
               Clear filter
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Home;