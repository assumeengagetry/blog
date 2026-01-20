import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, savePost } from '../services/storage';
import { generateBlogContent, generateBlogIdeas, generateCoverImage } from '../services/gemini';
import { BlogPost } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Save, Wand2, Image as ImageIcon, Sparkles, Loader2, ArrowLeft, Upload } from 'lucide-react';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const [loading, setLoading] = useState(false);
  const [aiIdeas, setAiIdeas] = useState<string[]>([]);
  const [showIdeas, setShowIdeas] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const post = getPostById(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCoverImage(post.coverImage || '');
        setTags(post.tags.join(', '));
        setExcerpt(post.excerpt);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!title || !content) {
      alert("Title and Content are required");
      return;
    }

    // Preserve existing comments if editing
    const existingPost = id && id !== 'new' ? getPostById(id) : undefined;

    const post: BlogPost = {
      id: id === 'new' || !id ? crypto.randomUUID() : id,
      title,
      content,
      excerpt: excerpt || content.slice(0, 150) + '...',
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'Admin', // In a real app, this comes from auth
      published: true,
      createdAt: id !== 'new' && id ? (existingPost?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now(),
      comments: existingPost?.comments || []
    };

    savePost(post);
    navigate(`/post/${post.id}`);
  };

  const handleGenerateContent = async () => {
    if (!title && !content) {
        alert("Please enter a title or some initial content for the AI to work with.");
        return;
    }
    setLoading(true);
    try {
      const generated = await generateBlogContent(title || "Untitled", content);
      setContent(generated);
      if (!title) {
        // Simple heuristic to extract title if generated text starts with header
        const lines = generated.split('\n');
        if (lines[0].startsWith('# ')) {
            setTitle(lines[0].replace('# ', '').trim());
        }
      }
    } catch (e) {
      alert("Failed to generate content. Please check API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setLoading(true);
    try {
      const ideas = await generateBlogIdeas();
      setAiIdeas(ideas);
      setShowIdeas(true);
    } catch (e) {
      alert("Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!title) return alert("Enter a title first to generate a relevant image.");
    setLoading(true);
    try {
      const imgData = await generateCoverImage(title);
      setCoverImage(imgData);
    } catch (e) {
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader and Canvas to resize image and convert to Base64
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800; // Constrain width to save LocalStorage space
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const markdownImage = `\n![${file.name}](${dataUrl})\n`;

        // Insert at cursor position
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + markdownImage + content.substring(end);
            setContent(newContent);
            
            // Re-focus logic could go here, but React state update re-renders component
        } else {
            setContent(prev => prev + markdownImage);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft size={16} /> Cancel
        </button>
        <button 
          onClick={handleSave} 
          className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition shadow flex items-center gap-2"
        >
          <Save size={16} /> Save Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
           {/* Cover Image Preview */}
           {coverImage && (
            <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button 
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <span className="sr-only">Remove</span>
                    &times;
                </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-serif font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 px-0 bg-transparent"
          />

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-100 bg-gray-50/50 pr-2">
              <div>
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'write' ? 'bg-white text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('write')}
                >
                  Write
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'preview' ? 'bg-white text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
              </div>
              
              {activeTab === 'write' && (
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageFileChange}
                    />
                    <button 
                        onClick={triggerImageUpload}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                        title="Upload and insert image"
                    >
                        <Upload size={16} />
                        <span className="hidden sm:inline">Insert Image</span>
                    </button>
                </div>
              )}
            </div>

            {activeTab === 'write' ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your story here... Markdown is supported."
                className="flex-grow w-full p-6 resize-none focus:outline-none font-mono text-base text-gray-800 leading-relaxed"
              />
            ) : (
              <div className="flex-grow w-full p-6 prose prose-slate max-w-none overflow-y-auto">
                <MarkdownRenderer content={content || '*Nothing to preview*'} />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-primary-600" /> AI Assistant
            </h3>

            <div className="space-y-3">
              <button
                disabled={loading}
                onClick={handleGenerateContent}
                className="w-full flex items-center justify-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 p-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                {content ? 'Expand / Refine Text' : 'Draft Post from Title'}
              </button>

              <button
                disabled={loading}
                onClick={handleGenerateImage}
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                 Generate Cover Art
              </button>
              
              <button
                disabled={loading}
                onClick={handleGenerateIdeas}
                className="w-full text-left text-sm text-gray-600 hover:text-gray-900 underline decoration-dotted"
              >
                Need inspiration? Get ideas.
              </button>
            </div>

            {showIdeas && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2">Topic Ideas</h4>
                <ul className="space-y-2">
                  {aiIdeas.map((idea, i) => (
                    <li key={i} className="text-sm text-gray-800 cursor-pointer hover:underline" onClick={() => {
                        setTitle(idea);
                        setShowIdeas(false);
                    }}>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <hr className="my-6 border-gray-100" />
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Excerpt</label>
                <textarea 
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-sm border-gray-200 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Short summary..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full text-sm border-gray-200 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Tech, AI, Lifestyle"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;