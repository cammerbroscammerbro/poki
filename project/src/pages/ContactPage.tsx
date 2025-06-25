import React from 'react';
import { ArrowLeft, Mail, Twitter, MessageCircle, Send, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
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
              <MessageCircle className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions, suggestions, or need help? We'd love to hear from you!
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <section className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-300 mb-1">Primary Contact</h3>
                      <a 
                        href="mailto:trixzonai@gmail.com" 
                        className="text-blue-200 hover:text-blue-100 transition-colors"
                      >
                        trixzonai@gmail.com
                      </a>
                      <p className="text-sm text-blue-200/70 mt-1">For general inquiries and freelance work</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <Mail className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-300 mb-1">Support Contact</h3>
                      <a 
                        href="mailto:rudransh.fronti@gmail.com" 
                        className="text-green-200 hover:text-green-100 transition-colors"
                      >
                        rudransh.fronti@gmail.com
                      </a>
                      <p className="text-sm text-green-200/70 mt-1">For technical support and bug reports</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <Twitter className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-purple-300 mb-1">Follow Us</h3>
                      <a 
                        href="https://twitter.com/RudranshAw4794" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-200 hover:text-purple-100 transition-colors"
                      >
                        @RudranshAw4794
                      </a>
                      <p className="text-sm text-purple-200/70 mt-1">Updates, tips, and community discussions</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Response Times</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-300">General Inquiries</span>
                    <span className="text-green-400 font-medium">24-48 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-300">Bug Reports</span>
                    <span className="text-blue-400 font-medium">12-24 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-300">Freelance Projects</span>
                    <span className="text-purple-400 font-medium">Same day</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Send a Message</h2>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="freelance">Freelance Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> This form will open your default email client. 
                  You can also email us directly at the addresses listed above.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-12 bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-green-300 mb-2">Is this tool really free?</h3>
                  <p className="text-sm text-gray-300">Yes! Completely free, no hidden costs, no premium plans. We believe great tools should be accessible to everyone.</p>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-blue-300 mb-2">Do you collect my data?</h3>
                  <p className="text-sm text-gray-300">No. We don't track users, collect personal data, or use cookies. Your privacy is completely protected.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-purple-300 mb-2">Can I suggest new features?</h3>
                  <p className="text-sm text-gray-300">Absolutely! We love hearing from our users. Send us your ideas and we'll consider them for future updates.</p>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-orange-300 mb-2">Is the source code available?</h3>
                  <p className="text-sm text-gray-300">Yes! This is an open-source project. You can view and contribute to the code on our repository.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;