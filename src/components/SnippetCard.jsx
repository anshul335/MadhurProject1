import React from 'react';
import { Copy, Code, Tag, User } from 'lucide-react';
import { LANGUAGES } from '../config/firebase-config';

export const SnippetCard = ({ snippet }) => {
  const languageConfig = LANGUAGES[snippet.language.toLowerCase()] || LANGUAGES['generic'];
  
  const handleCopy = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = snippet.code;
    document.body.appendChild(tempElement);
    tempElement.select();
    try {
      document.execCommand('copy');
      alert('Code copied to clipboard!'); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(tempElement);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 transition duration-300 hover:shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white truncate">{snippet.title}</h3>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition duration-200 shadow-md"
          title="Copy Code"
        >
          <Copy size={16} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm mb-3">
        <span className={`px-2 py-0.5 rounded-full font-medium ${languageConfig.color} bg-gray-700 flex items-center`}>
          <Code size={14} className="mr-1" /> {languageConfig.name}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-700 flex items-center" title="User ID">
            <User size={12} className="mr-1" /> {snippet.authorId}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{snippet.description}</p>

      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm font-mono flex-grow">
        <pre className={`whitespace-pre-wrap ${languageConfig.color}`}>{snippet.code}</pre>
      </div>

      {snippet.tags && snippet.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {snippet.tags.map((tag, index) => (
            <span key={index} className="px-2 py-0.5 text-xs text-gray-300 bg-indigo-800/50 rounded-full flex items-center">
              <Tag size={10} className="mr-1" />{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};