import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, BookOpen, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg transform transition group-hover:rotate-12">
              <BookOpen size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-gray-900">MindStream</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Read
            </Link>
            <Link 
              to="/editor/new" 
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
                isActive('/editor/new') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow'
              }`}
            >
              <PenTool size={16} />
              <span>Write</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MindStream Blog.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Powered by Gemini 2.5 & 3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;