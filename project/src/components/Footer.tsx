import React from 'react';
import { Heart, Sparkles, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-slate-800/50 py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                CSS to Tailwind Tool
              </span>
            </div>
            
            <p className="text-slate-300 flex items-center justify-center md:justify-start space-x-2 mb-3">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" aria-label="love" />
              <span>for developers</span>
            </p>
            
            <p className="text-sm text-slate-400 mb-4">
              Convert CSS gradients to Tailwind classes and create beautiful gradients visually
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Free Forever</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>No Registration</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Open Source</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                <span>Privacy Focused</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/blog" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Blog & Guides
              </Link>
              <Link to="/about" className="block text-slate-300 hover:text-blue-400 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold text-white mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <a 
                href="mailto:trixzonai@gmail.com" 
                className="flex items-center justify-center md:justify-end space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>trixzonai@gmail.com</span>
              </a>
              <a 
                href="https://twitter.com/RudranshAw4794" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-end space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>@RudranshAw4794</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2024 CSS to Tailwind Tool. Built by Jack Higar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;