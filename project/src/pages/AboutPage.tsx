import React from 'react';
import { ArrowLeft, Heart, Code, Zap, Shield, Users, Coffee, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
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
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Hero Section */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full mb-6">
              <Heart className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Made with Love</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Our Tool
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A free, open-source tool built by developers, for developers. No ads, no tracking, just pure functionality.
            </p>
          </header>

          <div className="space-y-12">
            {/* Mission Section */}
            <section className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  We believe that great developer tools should be <strong className="text-blue-400">free</strong>, 
                  <strong className="text-purple-400"> accessible</strong>, and 
                  <strong className="text-green-400"> easy to use</strong>. That's why we created this CSS to Tailwind gradient converter.
                </p>
                
                <p>
                  Converting CSS gradients to Tailwind classes manually is time-consuming and error-prone. Our tool automates this process, 
                  allowing developers to focus on what matters most - building amazing user experiences.
                </p>

                <div className="grid gap-4 md:grid-cols-2 mt-8">
                  <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-300 mb-1">Privacy First</h3>
                      <p className="text-sm text-blue-200">No tracking, no data collection, no cookies. Your privacy is our priority.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <Code className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-300 mb-1">Open Source</h3>
                      <p className="text-sm text-green-200">Built in the open, for the community. Transparent and trustworthy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <Users className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-purple-300 mb-1">Community Driven</h3>
                      <p className="text-sm text-purple-200">Built by developers who understand the daily challenges you face.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <Star className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-orange-300 mb-1">Always Free</h3>
                      <p className="text-sm text-orange-200">No premium plans, no paywalls. Quality tools should be accessible to everyone.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Developer Section */}
            <section className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Meet the Developer</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    JH
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Jack Higar</h3>
                    <p className="text-blue-200 mb-4">Talented Full-Stack Developer & Open Source Enthusiast</p>
                    
                    <div className="space-y-3 text-gray-300">
                      <p>
                        Jack is a passionate developer who believes in creating tools that make other developers' lives easier. 
                        With years of experience in web development and a deep understanding of modern CSS frameworks, 
                        Jack built this tool to solve a real problem he faced daily.
                      </p>
                      
                      <p>
                        When not coding, Jack enjoys contributing to open-source projects, mentoring junior developers, 
                        and exploring new technologies that push the boundaries of web development.
                      </p>
                    </div>

                    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <h4 className="font-bold text-green-300 mb-2">🚀 Available for Freelance Work</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Looking for a skilled developer for your next project? Jack is available for freelance work 
                        and would love to help bring your ideas to life.
                      </p>
                      <a 
                        href="mailto:trixzonai@gmail.com" 
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      >
                        <span>Get in Touch</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Why Choose Our Tool?</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 font-medium">Instant conversion - no waiting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 font-medium">Supports complex gradients</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300 font-medium">Live preview functionality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-pink-300 font-medium">Visual gradient generator</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-orange-300 font-medium">No ads or distractions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-teal-300 font-medium">Works offline after first load</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="text-indigo-300 font-medium">Mobile-friendly design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-300 font-medium">Copy-paste ready code</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Convert Your Gradients?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                Join thousands of developers who trust our tool for their daily workflow
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <span>Start Converting Now</span>
                <span>→</span>
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;