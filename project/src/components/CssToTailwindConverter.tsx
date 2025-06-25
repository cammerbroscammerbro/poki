import React, { useState, useEffect } from 'react';
import { ArrowRight, Copy, Check, AlertCircle, Zap, Code2 } from 'lucide-react';
import { parseCssGradient, convertToTailwind } from '../utils/gradientConverter';
import CopyButton from './CopyButton';
import GradientPreview from './GradientPreview';

const CssToTailwindConverter: React.FC = () => {
  const [cssInput, setCssInput] = useState('');
  const [tailwindOutput, setTailwindOutput] = useState('');
  const [previewGradient, setPreviewGradient] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleConvert = () => {
    if (!cssInput.trim()) {
      setError('Please enter a CSS gradient');
      return;
    }

    try {
      const parsed = parseCssGradient(cssInput);
      const tailwindClass = convertToTailwind(parsed);
      setTailwindOutput(tailwindClass);
      setPreviewGradient(cssInput);
      setError('');
      
      // Set warning for unsupported gradient types
      if (parsed.type === 'conic' || parsed.type === 'radial') {
        setWarning(`${parsed.type === 'conic' ? 'Conic' : 'Radial'} gradients are not natively supported in Tailwind CSS. The output shows a linear gradient approximation.`);
      } else {
        setWarning('');
      }
    } catch (err) {
      setError('Invalid CSS gradient format. Please check your syntax.');
      setTailwindOutput('');
      setPreviewGradient('');
      setWarning('');
    }
  };

  useEffect(() => {
    if (cssInput.trim()) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setTailwindOutput('');
      setPreviewGradient('');
      setError('');
      setWarning('');
    }
  }, [cssInput]);

  const exampleGradients = [
    { name: 'Linear', gradient: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', color: 'from-red-400 to-teal-400' },
    { name: 'Multi-Color', gradient: 'linear-gradient(135deg, #667eea, #764ba2, #ff9a56)', color: 'from-blue-400 via-purple-500 to-orange-400' },
    { name: 'Conic', gradient: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1)', color: 'from-red-400 to-sky-400' },
    { name: 'Radial', gradient: 'radial-gradient(circle, #667eea, #764ba2)', color: 'from-blue-400 to-purple-600' },
    { name: 'RGBA', gradient: 'linear-gradient(90deg, rgba(255,107,107,0.8), rgba(78,205,196,0.8))', color: 'from-red-400/80 to-teal-400/80' },
  ];

  return (
    <section className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Convert CSS Gradient to Tailwind Class
              </h2>
              <p className="text-slate-400 mt-1">
                Paste your CSS gradient and get the equivalent Tailwind CSS class instantly
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
              ✓ Linear Gradients
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
              ✓ Radial Gradients
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
              ✓ Conic Gradients
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full border border-orange-500/30">
              ✓ RGBA/HSLA Colors
            </span>
          </div>
        </header>

        {previewGradient && (
          <div className="mb-8">
            <GradientPreview gradient={previewGradient} />
          </div>
        )}

        {warning && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl flex items-start space-x-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-300 font-semibold">Note:</p>
              <p className="text-yellow-200 text-sm">{warning}</p>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <label htmlFor="css-input" className="block text-lg font-bold text-white mb-3">
              CSS Gradient Input
            </label>
            <div className="relative">
              <textarea
                id="css-input"
                value={cssInput}
                onChange={(e) => setCssInput(e.target.value)}
                placeholder="linear-gradient(45deg, #ff6b6b, #4ecdc4)&#10;conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1)&#10;radial-gradient(circle, #667eea, #764ba2)"
                className="w-full h-40 px-4 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none font-mono text-sm transition-all duration-300 hover:border-slate-600/50 text-white placeholder-slate-400 shadow-inner"
                aria-describedby="css-input-help"
              />
              <div className="absolute top-3 right-3">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            
            <div id="css-input-help">
              <p className="text-sm font-semibold text-slate-300 mb-3">Try these examples:</p>
              <div className="grid gap-2" role="group" aria-label="Example gradients">
                {exampleGradients.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setCssInput(example.gradient)}
                    className="group flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/30 hover:border-slate-600/50"
                    aria-label={`Use ${example.name} gradient example`}
                    title={example.gradient}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${example.color} shadow-sm`}></div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{example.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-48">{example.gradient}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="tailwind-output" className="block text-lg font-bold text-white">
                Tailwind CSS Class
              </label>
              {tailwindOutput && <CopyButton text={tailwindOutput.replace(/\/\*.*?\*\//g, '').trim()} />}
            </div>
            
            <div className="relative">
              <div 
                id="tailwind-output"
                className="w-full h-40 px-4 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl font-mono text-sm overflow-y-auto transition-all duration-300 shadow-inner"
                role="textbox"
                aria-readonly="true"
                aria-live="polite"
              >
                {error ? (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 font-medium">{error}</span>
                  </div>
                ) : tailwindOutput ? (
                  <div className="space-y-2">
                    <span className="text-emerald-400 font-semibold whitespace-pre-wrap">{tailwindOutput}</span>
                    {!warning && (
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">Ready to use in your project!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-slate-400 font-medium text-center">
                      Tailwind class will appear here...
                      <br />
                      <span className="text-xs">Start typing a CSS gradient above</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CssToTailwindConverter;