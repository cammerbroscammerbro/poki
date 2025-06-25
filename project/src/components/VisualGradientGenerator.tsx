import React, { useState, useEffect } from 'react';
import { Sliders, Copy, Palette, Wand2 } from 'lucide-react';
import { generateCssGradient, generateTailwindGradient } from '../utils/gradientGenerator';
import CopyButton from './CopyButton';
import GradientPreview from './GradientPreview';
import ColorPicker from './ColorPicker';
import AngleSlider from './AngleSlider';

const VisualGradientGenerator: React.FC = () => {
  const [colors, setColors] = useState(['#3B82F6', '#8B5CF6', '#EF4444']);
  const [angle, setAngle] = useState(45);
  const [opacity, setOpacity] = useState(100);
  const [activeColors, setActiveColors] = useState(2);
  const [cssOutput, setCssOutput] = useState('');
  const [tailwindOutput, setTailwindOutput] = useState('');

  useEffect(() => {
    const usedColors = colors.slice(0, activeColors);
    const css = generateCssGradient(usedColors, angle, opacity);
    const tailwind = generateTailwindGradient(usedColors, angle);
    
    setCssOutput(css);
    setTailwindOutput(tailwind);
  }, [colors, angle, opacity, activeColors]);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const presets = [
    { name: 'Ocean Breeze', colors: ['#667eea', '#764ba2'], gradient: 'from-blue-400 to-purple-600' },
    { name: 'Sunset Glow', colors: ['#ff9a56', '#ff6b9d'], gradient: 'from-orange-400 to-pink-400' },
    { name: 'Forest Mist', colors: ['#56ab2f', '#a8e6cf'], gradient: 'from-green-500 to-emerald-300' },
    { name: 'Fire Burst', colors: ['#ff416c', '#ff4b2b'], gradient: 'from-pink-500 to-red-500' },
    { name: 'Arctic Dawn', colors: ['#74b9ff', '#0984e3'], gradient: 'from-blue-300 to-blue-600' },
    { name: 'Golden Hour', colors: ['#fdcb6e', '#e17055'], gradient: 'from-yellow-300 to-orange-500' },
  ];

  return (
    <section className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 lg:p-10">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Create Custom Gradient
              </h2>
              <p className="text-slate-400 mt-1">
                Build gradients visually and get both CSS and Tailwind outputs
              </p>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <GradientPreview gradient={cssOutput} />
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-400" />
                <span>Gradient Controls</span>
              </h3>
              
              <div className="space-y-6">
                <fieldset>
                  <legend className="block text-sm font-bold text-slate-200 mb-4">
                    Colors ({activeColors} active)
                  </legend>
                  <div className="space-y-4">
                    {colors.slice(0, 3).map((color, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <ColorPicker
                          color={color}
                          onChange={(newColor) => handleColorChange(index, newColor)}
                          disabled={index >= activeColors}
                        />
                        <div className="flex-1">
                          <span className="text-sm text-slate-300 font-mono font-semibold block" aria-label={`Color ${index + 1}`}>
                            {color.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">
                            {index === 0 ? 'Start' : index === 1 ? 'Middle' : 'End'} Color
                          </span>
                        </div>
                        {index === 2 && (
                          <button
                            onClick={() => setActiveColors(activeColors === 3 ? 2 : 3)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                              activeColors === 3 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                            }`}
                            aria-label={activeColors === 3 ? 'Remove third color' : 'Add third color'}
                          >
                            {activeColors === 3 ? 'Remove' : 'Add 3rd'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <AngleSlider angle={angle} onChange={setAngle} />
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <label htmlFor="opacity-slider" className="block text-sm font-bold text-slate-200 mb-3">
                    Opacity: {opacity}%
                  </label>
                  <input
                    id="opacity-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="Gradient opacity"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-pink-400" />
                <span>Quick Presets</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Gradient presets">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setColors([...preset.colors, colors[2]]);
                      setActiveColors(2);
                    }}
                    className="group p-4 text-left bg-slate-700/30 border border-slate-600/30 rounded-xl hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg hover:bg-slate-700/50"
                    aria-label={`Apply ${preset.name} gradient preset`}
                  >
                    <div 
                      className={`w-full h-12 rounded-lg mb-3 border border-slate-600/50 bg-gradient-to-r ${preset.gradient} group-hover:scale-105 transition-transform duration-300`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="css-code" className="block text-lg font-bold text-slate-200">
                  CSS Code
                </label>
                <CopyButton text={cssOutput} />
              </div>
              <div 
                id="css-code"
                className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl min-h-[100px] backdrop-blur-sm"
                role="textbox"
                aria-readonly="true"
              >
                <code className="text-sm font-mono text-emerald-400 break-all font-medium leading-relaxed">
                  background: {cssOutput};
                </code>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="tailwind-code" className="block text-lg font-bold text-slate-200">
                  Tailwind CSS Class
                </label>
                <CopyButton text={tailwindOutput} />
              </div>
              <div 
                id="tailwind-code"
                className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl min-h-[100px] backdrop-blur-sm"
                role="textbox"
                aria-readonly="true"
              >
                <code className="text-sm font-mono text-blue-400 break-all font-medium leading-relaxed">
                  className="{tailwindOutput}"
                </code>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-bold text-blue-300 mb-2">💡 Pro Tips</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>• Use 2-3 colors for best visual impact</li>
                <li>• Adjust opacity for subtle overlay effects</li>
                <li>• Try different angles for unique directions</li>
                <li>• Copy CSS for custom implementations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualGradientGenerator;