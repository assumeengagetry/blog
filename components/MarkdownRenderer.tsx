import React from 'react';

interface Props {
  content: string;
}

// A simple regex-based parser for basic markdown to avoid heavy dependencies in this environment.
// Supports: Headers, Bold, Italic, Lists, Links, Blockquotes, Images.
const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  
  const renderLine = (line: string, index: number) => {
    // Headers
    if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-6 mb-4 font-serif">{parseInline(line.slice(2))}</h1>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-semibold text-gray-800 mt-5 mb-3 font-serif">{parseInline(line.slice(3))}</h2>;
    if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-medium text-gray-800 mt-4 mb-2 font-serif">{parseInline(line.slice(4))}</h3>;
    
    // Blockquote
    if (line.startsWith('> ')) return <blockquote key={index} className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">{parseInline(line.slice(2))}</blockquote>;

    // List items (basic support)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={index} className="ml-4 list-disc text-gray-700 mb-1 leading-relaxed">{parseInline(line.slice(2))}</li>;
    }

    // Empty line
    if (!line.trim()) return <div key={index} className="h-4"></div>;

    // Paragraph
    return <p key={index} className="text-gray-700 leading-relaxed mb-4 font-serif text-lg">{parseInline(line)}</p>;
  };

  const parseInline = (text: string): React.ReactNode[] => {
    // Split by regex capturing groups for Markdown syntax
    // Matches: Images, Bold, Italic, Code
    const parts = text.split(/(!\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(\*.*?\*)|(`.*?`)/g).filter(Boolean);
    
    return parts.map((part, i) => {
      // Image: ![alt](url)
      if (part.startsWith('![') && part.endsWith(')')) {
        const match = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
           return <img key={i} src={match[2]} alt={match[1]} className="max-w-full h-auto rounded-lg shadow-sm my-4 block" />;
        }
      }

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      
      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      
      // Code: `text`
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-gray-100 text-sm p-1 rounded font-mono text-red-600">{part.slice(1, -1)}</code>;
      
      return part;
    });
  };

  const lines = content.split('\n');
  
  return (
    <article className="prose max-w-none">
      {lines.map((line, i) => renderLine(line, i))}
    </article>
  );
};

export default MarkdownRenderer;