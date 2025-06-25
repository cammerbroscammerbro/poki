import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, disabled = false }) => {
  return (
    <div className="relative">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-12 h-12 rounded-xl border-2 border-gray-600 cursor-pointer transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500 hover:shadow-sm'
        }`}
        style={{ backgroundColor: color }}
        aria-label={`Color picker for ${color}`}
      />
    </div>
  );
};

export default ColorPicker;