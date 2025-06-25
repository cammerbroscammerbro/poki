import React from 'react';
import { RotateCw } from 'lucide-react';

interface AngleSliderProps {
  angle: number;
  onChange: (angle: number) => void;
}

const AngleSlider: React.FC<AngleSliderProps> = ({ angle, onChange }) => {
  const commonAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <RotateCw className="w-4 h-4 text-gray-400" />
        <label htmlFor="angle-slider" className="block text-sm font-bold text-gray-200">
          Angle: {angle}°
        </label>
      </div>
      <input
        id="angle-slider"
        type="range"
        min="0"
        max="360"
        value={angle}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider mb-3"
        aria-label="Gradient angle"
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Common angles">
        {commonAngles.map((commonAngle) => (
          <button
            key={commonAngle}
            onClick={() => onChange(commonAngle)}
            className={`px-2 py-1.5 text-xs rounded-full transition-all duration-200 font-medium border ${
              angle === commonAngle
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:border-gray-500'
            }`}
            aria-label={`Set angle to ${commonAngle} degrees`}
          >
            {commonAngle}°
          </button>
        ))}
      </div>
    </div>
  );
};

export default AngleSlider;