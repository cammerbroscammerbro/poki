import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                CSS to Tailwind Tool
              </h1>
              <p className="text-xs text-slate-400 -mt-1">Free Online Converter</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link 
              to="/blog" 
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/blog' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/about' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                location.pathname === '/contact' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              Contact
            </Link>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-300">Live</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;