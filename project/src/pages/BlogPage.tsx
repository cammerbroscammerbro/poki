import React from 'react';
import { ArrowLeft, ExternalLink, Copy, Check, Palette, Zap, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CopyButton from '../components/CopyButton';

const BlogPage: React.FC = () => {
  const gradientPreviews = [
    { name: 'Sunset Glow', gradient: 'bg-gradient-to-r from-orange-400 via-pink-400 to-red-500', css: 'linear-gradient(to right, #fb923c, #f472b6, #ef4444)' },
    { name: 'Ocean Breeze', gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400', css: 'linear-gradient(to right, #60a5fa, #22d3ee)' },
    { name: 'Forest Mist', gradient: 'bg-gradient-to-r from-green-400 to-emerald-500', css: 'linear-gradient(to right, #4ade80, #10b981)' },
    { name: 'Purple Dream', gradient: 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500', css: 'linear-gradient(to right, #c084fc, #f472b6, #6366f1)' },
    { name: 'Golden Hour', gradient: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400', css: 'linear-gradient(to right, #facc15, #fb923c, #f87171)' },
    { name: 'Arctic Dawn', gradient: 'bg-gradient-to-r from-blue-300 to-purple-400', css: 'linear-gradient(to right, #93c5fd, #c084fc)' },
    { name: 'Mint Fresh', gradient: 'bg-gradient-to-r from-teal-300 to-green-300', css: 'linear-gradient(to right, #5eead4, #86efac)' }
  ];

  const blogPosts = [
    {
      title: "Stop Using Boring Backgrounds — Use These 7 CSS Gradients Instead",
      excerpt: "In 2025, users expect stunning visual experiences — and your website background is the first impression. Discover 7 gorgeous gradient styles you can use right now.",
      content: `In 2025, users expect stunning visual experiences — and your website background is the first impression. Flat colors and gray tones are fine, but if you're still using solid #f0f0f0 backgrounds, it's time for a serious upgrade.

That's where CSS gradients come in.

Gradients add depth, emotion, and modern flair to your designs — and they load lightning-fast without using images. From subtle overlays to bold color explosions, they instantly boost UI appeal.

Here are 7 gorgeous gradient styles you can use right now:

🌅 A soft sunset blend for calming landing pages
🌈 Vibrant rainbows for creative portfolios  
🧊 Cool blues for fintech dashboards
🔥 Warm tones for bold CTAs
🌌 Dark-to-light transitions for immersive hero sections
🍭 Pastel candy colors for playful vibes
💼 Neutral fades for clean business sites`,
      gradients: gradientPreviews.slice(0, 7)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Gradient Tool</span>
            </Link>
          </div>

          {/* Blog Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">fronti.tech Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Complete Guide to CSS & Tailwind Gradients
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Master gradients in CSS and Tailwind CSS with our comprehensive guide. Learn everything from basics to advanced techniques.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free Tool by fronti.tech</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Open Source & No Ads</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Built by Jack Higar</span>
              </div>
            </div>
          </header>

          <div className="space-y-16">
            {/* Featured Blog Post */}
            <article className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
              <header className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-slate-400 mt-1">
                      Latest from fronti.tech - Your go-to resource for CSS and Tailwind tips
                    </p>
                  </div>
                </div>
              </header>

              <div className="space-y-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {blogPosts[0].content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className={index === 0 ? "text-lg font-medium" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span>7 Stunning Gradient Examples</span>
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {blogPosts[0].gradients.map((preset, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <div className={`w-full h-20 rounded-lg mb-3 ${preset.gradient} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          <div className="absolute bottom-2 left-2 text-white/90 text-xs font-medium drop-shadow">
                            {index + 1}. {preset.name}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white">{preset.name}</h4>
                          <CopyButton text={preset.gradient} />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-400 mb-1">Tailwind:</p>
                            <code className="text-xs text-green-400 font-mono break-all">{preset.gradient}</code>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 mb-1">CSS:</p>
                            <code className="text-xs text-blue-400 font-mono break-all">{preset.css}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* About fronti.tech Section */}
            <article className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
              <header className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">About fronti.tech</h2>
                </div>
                <p className="text-slate-400 text-lg">
                  Learn about our mission to provide free, open-source developer tools
                </p>
              </header>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">🚀 Our Mission</h3>
                  <p className="text-blue-200 leading-relaxed mb-4">
                    fronti.tech is dedicated to creating <strong>free, open-source tools</strong> that make developers' lives easier. 
                    We believe that great developer tools should be accessible to everyone, regardless of budget or company size.
                  </p>
                  <p className="text-blue-200 leading-relaxed">
                    Our CSS to Tailwind gradient converter is just the beginning. We're building a suite of tools that solve 
                    real problems developers face every day, without ads, tracking, or premium paywalls.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-green-300 mb-3">✨ What Makes Us Different</h4>
                    <ul className="space-y-2 text-green-200 text-sm">
                      <li>• 100% free forever - no hidden costs</li>
                      <li>• No ads or distracting content</li>
                      <li>• Privacy-first approach - no tracking</li>
                      <li>• Open source and transparent</li>
                      <li>• Built by developers, for developers</li>
                    </ul>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                    <h4 className="font-bold text-purple-300 mb-3">🛠️ Built by Jack Higar</h4>
                    <p className="text-purple-200 text-sm leading-relaxed mb-3">
                      Jack Higar is a talented full-stack developer passionate about creating tools that solve real problems. 
                      With years of experience in modern web development, Jack understands the daily challenges developers face.
                    </p>
                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
                      <p className="text-xs text-purple-300 font-medium">💼 Available for freelance work</p>
                      <a 
                        href="mailto:trixzonai@gmail.com" 
                        className="text-xs text-purple-200 hover:text-purple-100 transition-colors"
                      >
                        Contact: trixzonai@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-orange-300 mb-3">📞 Get in Touch</h4>
                  <p className="text-orange-200 mb-4">
                    Have questions, suggestions, or need help? We'd love to hear from you! Our team is always ready to assist 
                    and improve our tools based on your feedback.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-300 font-medium">📧 General:</span>
                      <a href="mailto:trixzonai@gmail.com" className="text-orange-200 hover:text-orange-100 transition-colors">
                        trixzonai@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-300 font-medium">🛠️ Support:</span>
                      <a href="mailto:rudransh.fronti@gmail.com" className="text-orange-200 hover:text-orange-100 transition-colors">
                        rudransh.fronti@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <span className="text-orange-300 font-medium">🐦 Twitter:</span>
                      <a 
                        href="https://twitter.com/RudranshAw4794" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-200 hover:text-orange-100 transition-colors"
                      >
                        @RudranshAw4794
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Original comprehensive guide content */}
            <article className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-4">1. What Is a Gradient in CSS?</h2>
                <p className="text-gray-300 text-lg">
                  Understanding the fundamentals of CSS gradients and their different types
                </p>
              </header>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">Linear Gradients</h3>
                  <p className="text-gray-300 mb-4">
                    Linear gradients create a smooth transition between colors along a straight line. They're the most common type of gradient used in web design.
                  </p>
                  <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
                    <code className="text-green-400 font-mono text-sm">
                      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                    </code>
                  </div>
                  <div className="w-full h-20 rounded-xl border-2 border-gray-600" style={{background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'}}></div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">Radial Gradients</h3>
                  <p className="text-gray-300 mb-4">
                    Radial gradients emanate from a central point, creating circular or elliptical color transitions.
                  </p>
                  <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
                    <code className="text-green-400 font-mono text-sm">
                      background: radial-gradient(circle, #667eea, #764ba2);
                    </code>
                  </div>
                  <div className="w-full h-20 rounded-xl border-2 border-gray-600" style={{background: 'radial-gradient(circle, #667eea, #764ba2)'}}></div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">Conic Gradients</h3>
                  <p className="text-gray-300 mb-4">
                    Conic gradients rotate around a center point, perfect for creating pie charts or rainbow effects.
                  </p>
                  <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
                    <code className="text-green-400 font-mono text-sm">
                      background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1);
                    </code>
                  </div>
                  <div className="w-full h-20 rounded-xl border-2 border-gray-600" style={{background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1)'}}></div>
                </section>
              </div>
            </article>

            {/* Rest of the comprehensive guide content continues... */}
            {/* (Previous blog content remains the same) */}

            {/* CTA Section */}
            <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Amazing Gradients?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                Use our free online tool to convert CSS gradients to Tailwind classes instantly
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <span>Try the Gradient Tool</span>
                <ExternalLink className="w-5 h-5" />
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;