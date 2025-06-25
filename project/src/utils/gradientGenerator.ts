export function generateCssGradient(colors: string[], angle: number, opacity: number): string {
  const colorStops = colors.map(color => {
    if (opacity < 100) {
      // Convert hex to rgba
      const hex = color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
    }
    return color;
  }).join(', ');
  
  return `linear-gradient(${angle}deg, ${colorStops})`;
}

export function generateTailwindGradient(colors: string[], angle: number): string {
  const direction = angleToTailwindDirection(angle);
  const tailwindColors = colors.map(hexToTailwindColor);
  
  let gradientClass = `bg-gradient-${direction}`;
  
  if (tailwindColors.length >= 1) {
    gradientClass += ` from-${tailwindColors[0]}`;
  }
  
  if (tailwindColors.length >= 3) {
    gradientClass += ` via-${tailwindColors[1]}`;
  }
  
  if (tailwindColors.length >= 2) {
    gradientClass += ` to-${tailwindColors[tailwindColors.length - 1]}`;
  }
  
  return gradientClass;
}

function angleToTailwindDirection(angle: number): string {
  // Normalize angle to 0-360
  angle = ((angle % 360) + 360) % 360;
  
  if (angle >= 337.5 || angle < 22.5) return 'to-t';
  if (angle >= 22.5 && angle < 67.5) return 'to-tr';
  if (angle >= 67.5 && angle < 112.5) return 'to-r';
  if (angle >= 112.5 && angle < 157.5) return 'to-br';
  if (angle >= 157.5 && angle < 202.5) return 'to-b';
  if (angle >= 202.5 && angle < 247.5) return 'to-bl';
  if (angle >= 247.5 && angle < 292.5) return 'to-l';
  if (angle >= 292.5 && angle < 337.5) return 'to-tl';
  
  return 'to-r';
}

function hexToTailwindColor(color: string): string {
  // Enhanced color mapping with more comprehensive Tailwind colors
  const colorMap: { [key: string]: string } = {
    // Reds
    '#ff6b6b': 'red-400',
    '#ff5252': 'red-500',
    '#f44336': 'red-600',
    '#d32f2f': 'red-700',
    '#c62828': 'red-800',
    
    // Blues  
    '#3b82f6': 'blue-500',
    '#2563eb': 'blue-600',
    '#1d4ed8': 'blue-700',
    '#1e40af': 'blue-800',
    '#667eea': 'blue-400',
    
    // Purples
    '#8b5cf6': 'purple-500',
    '#7c3aed': 'purple-600',
    '#6d28d9': 'purple-700',
    '#764ba2': 'purple-600',
    
    // Greens
    '#10b981': 'emerald-500',
    '#059669': 'emerald-600',
    '#047857': 'emerald-700',
    '#56ab2f': 'green-500',
    '#4ecdc4': 'teal-400',
    
    // Others
    '#f59e0b': 'amber-500',
    '#ff9a56': 'orange-400',
    '#ff6b9d': 'pink-400',
    '#ef4444': 'red-500',
  };
  
  const lowerColor = color.toLowerCase();
  if (colorMap[lowerColor]) {
    return colorMap[lowerColor];
  }
  
  // Enhanced color analysis
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Calculate brightness for weight selection
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const weight = brightness > 180 ? '400' : brightness > 120 ? '500' : brightness > 80 ? '600' : '700';
    
    // Enhanced color detection
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff < 30) {
      // Grayscale
      return brightness > 200 ? 'gray-300' : brightness > 150 ? 'gray-400' : brightness > 100 ? 'gray-500' : 'gray-600';
    }
    
    if (r === max) {
      if (g > b) return `orange-${weight}`;
      return `red-${weight}`;
    } else if (g === max) {
      if (r > b) return `yellow-${weight}`;
      return `green-${weight}`;
    } else {
      if (r > g) return `purple-${weight}`;
      return `blue-${weight}`;
    }
  }
  
  return 'gray-500';
}