import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 border ${
        copied 
          ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/10' 
          : 'bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600/50 border-slate-600/50 hover:border-slate-500/50 backdrop-blur-sm'
      }`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;