import React from 'react';
import { Eye } from 'lucide-react';

interface GradientPreviewProps {
  gradient: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ gradient }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Eye className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Live Preview</h3>
      </div>
      <div className="relative group">
        <div 
          className="w-full h-40 rounded-2xl border-2 border-slate-700/50 shadow-2xl relative overflow-hidden"
          style={{ background: gradient }}
          role="img"
          aria-label="Gradient preview"
        >
          {/* Overlay pattern for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          {/* Corner indicators */}
          <div className="absolute top-3 left-3 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-3 right-3 w-2 h-2 bg-white/30 rounded-full"></div>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/90 font-bold text-lg drop-shadow-lg">
                Gradient Preview
              </div>
              <div className="text-white/70 text-sm drop-shadow">
                Your gradient in action
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10"
          style={{ background: gradient }}
        ></div>
      </div>
    </div>
  );
};

export default GradientPreview;