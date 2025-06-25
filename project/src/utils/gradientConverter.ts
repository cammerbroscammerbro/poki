interface GradientStop {
  color: string;
  position?: number;
}

interface ParsedGradient {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  direction?: string;
  stops: GradientStop[];
  shape?: string;
  size?: string;
  position?: string;
}

export function parseCssGradient(cssGradient: string): ParsedGradient {
  // Remove whitespace and normalize
  const gradient = cssGradient.trim().replace(/\s+/g, ' ');
  
  // Check gradient type
  const isLinear = gradient.startsWith('linear-gradient');
  const isRadial = gradient.startsWith('radial-gradient');
  const isConic = gradient.startsWith('conic-gradient');
  const isRepeating = gradient.includes('repeating-');
  
  if (!isLinear && !isRadial && !isConic) {
    throw new Error('Not a valid gradient');
  }
  
  // Extract content between parentheses
  const match = gradient.match(/\((.*)\)/);
  if (!match) {
    throw new Error('Invalid gradient format');
  }
  
  const content = match[1];
  const parts = splitGradientParts(content);
  
  let angle: number | undefined;
  let direction: string | undefined;
  let shape: string | undefined;
  let size: string | undefined;
  let position: string | undefined;
  let colorStartIndex = 0;
  
  // Parse different gradient types
  if (isLinear && parts.length > 1) {
    const firstPart = parts[0].trim();
    
    if (firstPart.includes('deg')) {
      angle = parseFloat(firstPart.replace('deg', ''));
      colorStartIndex = 1;
    } else if (firstPart.includes('rad')) {
      angle = parseFloat(firstPart.replace('rad', '')) * (180 / Math.PI);
      colorStartIndex = 1;
    } else if (firstPart.includes('turn')) {
      angle = parseFloat(firstPart.replace('turn', '')) * 360;
      colorStartIndex = 1;
    } else if (firstPart.startsWith('to ')) {
      direction = firstPart;
      colorStartIndex = 1;
      angle = directionToAngle(firstPart);
    }
  } else if (isRadial && parts.length > 1) {
    // Parse radial gradient parameters
    const firstPart = parts[0].trim();
    if (!isColor(firstPart)) {
      const radialParams = parseRadialParams(firstPart);
      shape = radialParams.shape;
      size = radialParams.size;
      position = radialParams.position;
      colorStartIndex = 1;
    }
  } else if (isConic && parts.length > 1) {
    // Parse conic gradient parameters
    const firstPart = parts[0].trim();
    if (!isColor(firstPart)) {
      if (firstPart.includes('from ')) {
        const angleMatch = firstPart.match(/from\s+([0-9.-]+)(deg|rad|turn)?/);
        if (angleMatch) {
          let parsedAngle = parseFloat(angleMatch[1]);
          const unit = angleMatch[2] || 'deg';
          
          if (unit === 'rad') parsedAngle *= (180 / Math.PI);
          if (unit === 'turn') parsedAngle *= 360;
          
          angle = parsedAngle;
        }
      }
      if (firstPart.includes('at ')) {
        const posMatch = firstPart.match(/at\s+([^,]+)/);
        if (posMatch) {
          position = posMatch[1].trim();
        }
      }
      colorStartIndex = 1;
    }
  }
  
  // Parse color stops
  const stops: GradientStop[] = [];
  for (let i = colorStartIndex; i < parts.length; i++) {
    const stop = parts[i].trim();
    const colorData = extractColorWithPosition(stop);
    if (colorData) {
      stops.push(colorData);
    }
  }
  
  return {
    type: isLinear ? 'linear' : isRadial ? 'radial' : 'conic',
    angle,
    direction,
    stops,
    shape,
    size,
    position
  };
}

function splitGradientParts(content: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    }
    
    if (!inQuotes) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }
    }
    
    current += char;
  }
  
  if (current.trim()) {
    parts.push(current.trim());
  }
  
  return parts;
}

function parseRadialParams(param: string): { shape?: string; size?: string; position?: string } {
  const result: { shape?: string; size?: string; position?: string } = {};
  
  // Shape
  if (param.includes('circle')) result.shape = 'circle';
  if (param.includes('ellipse')) result.shape = 'ellipse';
  
  // Size
  const sizeKeywords = ['closest-side', 'closest-corner', 'farthest-side', 'farthest-corner'];
  for (const size of sizeKeywords) {
    if (param.includes(size)) {
      result.size = size;
      break;
    }
  }
  
  // Position
  if (param.includes('at ')) {
    const posMatch = param.match(/at\s+([^,]+)/);
    if (posMatch) {
      result.position = posMatch[1].trim();
    }
  }
  
  return result;
}

function isColor(str: string): boolean {
  return /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|[a-zA-Z]+)/.test(str.trim());
}

function extractColorWithPosition(colorStop: string): GradientStop | null {
  const color = extractColor(colorStop);
  if (!color) return null;
  
  // Extract position if present
  const positionMatch = colorStop.match(/(\d+(?:\.\d+)?%|\d+(?:\.\d+)?(?:px|em|rem|vh|vw))/);
  const position = positionMatch ? parseFloat(positionMatch[1]) : undefined;
  
  return { color, position };
}

function directionToAngle(direction: string): number {
  const directions: { [key: string]: number } = {
    'to top': 0,
    'to top right': 45,
    'to right': 90,
    'to bottom right': 135,
    'to bottom': 180,
    'to bottom left': 225,
    'to left': 270,
    'to top left': 315
  };
  
  return directions[direction] || 180;
}

function extractColor(colorStop: string): string | null {
  // Handle hex colors (3, 4, 6, 8 digits)
  const hexMatch = colorStop.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) return hexMatch[0];
  
  // Handle rgb/rgba colors
  const rgbMatch = colorStop.match(/rgba?\([^)]+\)/);
  if (rgbMatch) return rgbMatch[0];
  
  // Handle hsl/hsla colors
  const hslMatch = colorStop.match(/hsla?\([^)]+\)/);
  if (hslMatch) return hslMatch[0];
  
  // Handle CSS color functions
  const colorFunctionMatch = colorStop.match(/(lab|lch|oklab|oklch|color)\([^)]+\)/);
  if (colorFunctionMatch) return colorFunctionMatch[0];
  
  // Handle named colors (comprehensive list)
  const namedColors = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond',
    'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue',
    'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
    'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
    'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
    'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
    'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred',
    'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
    'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
    'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime',
    'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
    'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
    'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
    'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff',
    'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon',
    'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey',
    'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
    'whitesmoke', 'yellow', 'yellowgreen'
  ];
  
  const lowerStop = colorStop.toLowerCase();
  for (const namedColor of namedColors) {
    if (lowerStop.includes(namedColor)) {
      return namedColor;
    }
  }
  
  return null;
}

export function convertToTailwind(parsed: ParsedGradient): string {
  // Handle conic gradients
  if (parsed.type === 'conic') {
    return convertConicToTailwind(parsed);
  }
  
  // Handle radial gradients
  if (parsed.type === 'radial') {
    return convertRadialToTailwind(parsed);
  }
  
  // Handle linear gradients
  return convertLinearToTailwind(parsed);
}

function convertLinearToTailwind(parsed: ParsedGradient): string {
  let direction = 'to-r';
  
  if (parsed.angle !== undefined) {
    direction = angleToTailwindDirection(parsed.angle);
  }
  
  const colors = parsed.stops.slice(0, 3); // Tailwind supports up to 3 colors
  let tailwindClass = `bg-gradient-${direction}`;
  
  if (colors.length >= 1) {
    const fromColor = colorToTailwind(colors[0].color);
    tailwindClass += ` from-${fromColor}`;
  }
  
  if (colors.length >= 3) {
    const viaColor = colorToTailwind(colors[1].color);
    tailwindClass += ` via-${viaColor}`;
  }
  
  if (colors.length >= 2) {
    const toColor = colorToTailwind(colors[colors.length - 1].color);
    tailwindClass += ` to-${toColor}`;
  }
  
  return tailwindClass;
}

function convertRadialToTailwind(parsed: ParsedGradient): string {
  // Tailwind doesn't have native radial gradient support
  // Convert to closest linear equivalent or suggest custom CSS
  const colors = parsed.stops.slice(0, 3);
  let tailwindClass = 'bg-gradient-to-br'; // Default to bottom-right for radial feel
  
  if (colors.length >= 1) {
    const fromColor = colorToTailwind(colors[0].color);
    tailwindClass += ` from-${fromColor}`;
  }
  
  if (colors.length >= 3) {
    const viaColor = colorToTailwind(colors[1].color);
    tailwindClass += ` via-${viaColor}`;
  }
  
  if (colors.length >= 2) {
    const toColor = colorToTailwind(colors[colors.length - 1].color);
    tailwindClass += ` to-${toColor}`;
  }
  
  return `${tailwindClass} /* Note: Radial gradient converted to linear. Use custom CSS for true radial effect. */`;
}

function convertConicToTailwind(parsed: ParsedGradient): string {
  // Tailwind doesn't have native conic gradient support
  // Provide a linear alternative with a note
  const colors = parsed.stops.slice(0, 3);
  let tailwindClass = 'bg-gradient-to-r'; // Default direction
  
  if (colors.length >= 1) {
    const fromColor = colorToTailwind(colors[0].color);
    tailwindClass += ` from-${fromColor}`;
  }
  
  if (colors.length >= 3) {
    const viaColor = colorToTailwind(colors[1].color);
    tailwindClass += ` via-${viaColor}`;
  }
  
  if (colors.length >= 2) {
    const toColor = colorToTailwind(colors[colors.length - 1].color);
    tailwindClass += ` to-${toColor}`;
  }
  
  return `${tailwindClass} /* Note: Conic gradient converted to linear. Use custom CSS for true conic effect. */`;
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

function colorToTailwind(color: string): string {
  // Enhanced color mapping with more comprehensive Tailwind colors
  const exactColorMap: { [key: string]: string } = {
    // Reds
    '#ff6b6b': 'red-400',
    '#ff5252': 'red-500',
    '#f44336': 'red-600',
    '#d32f2f': 'red-700',
    '#c62828': 'red-800',
    '#ef4444': 'red-500',
    '#dc2626': 'red-600',
    '#b91c1c': 'red-700',
    
    // Blues  
    '#3b82f6': 'blue-500',
    '#2563eb': 'blue-600',
    '#1d4ed8': 'blue-700',
    '#1e40af': 'blue-800',
    '#667eea': 'blue-400',
    '#4ecdc4': 'teal-400',
    '#45b7d1': 'sky-400',
    '#60a5fa': 'blue-400',
    '#3b82f6': 'blue-500',
    
    // Purples
    '#8b5cf6': 'purple-500',
    '#7c3aed': 'purple-600',
    '#6d28d9': 'purple-700',
    '#764ba2': 'purple-600',
    '#a855f7': 'purple-500',
    '#9333ea': 'purple-600',
    
    // Greens
    '#10b981': 'emerald-500',
    '#059669': 'emerald-600',
    '#047857': 'emerald-700',
    '#56ab2f': 'green-500',
    '#22c55e': 'green-500',
    '#16a34a': 'green-600',
    '#15803d': 'green-700',
    
    // Oranges
    '#f59e0b': 'amber-500',
    '#ff9a56': 'orange-400',
    '#fb923c': 'orange-400',
    '#f97316': 'orange-500',
    '#ea580c': 'orange-600',
    
    // Pinks
    '#ff6b9d': 'pink-400',
    '#f472b6': 'pink-400',
    '#ec4899': 'pink-500',
    '#db2777': 'pink-600',
    
    // Yellows
    '#facc15': 'yellow-400',
    '#eab308': 'yellow-500',
    '#ca8a04': 'yellow-600',
    
    // Teals/Cyans
    '#06b6d4': 'cyan-500',
    '#0891b2': 'cyan-600',
    '#0e7490': 'cyan-700',
    '#14b8a6': 'teal-500',
    '#0d9488': 'teal-600',
    
    // Grays
    '#6b7280': 'gray-500',
    '#4b5563': 'gray-600',
    '#374151': 'gray-700',
    '#1f2937': 'gray-800',
    '#111827': 'gray-900',
  };
  
  const lowerColor = color.toLowerCase();
  if (exactColorMap[lowerColor]) {
    return exactColorMap[lowerColor];
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return rgbToTailwind(r, g, b);
    }
  }
  
  // Handle hsl colors
  if (color.startsWith('hsla(') || color.startsWith('hsl(')) {
    const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]);
      const l = parseInt(hslMatch[3]);
      return hslToTailwind(h, s, l);
    }
  }
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    let r: number, g: number, b: number;
    
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return 'gray-500';
    }
    
    return rgbToTailwind(r, g, b);
  }
  
  // Handle named colors
  const namedColorMap: { [key: string]: string } = {
    'red': 'red-500',
    'blue': 'blue-500',
    'green': 'green-500',
    'yellow': 'yellow-500',
    'purple': 'purple-500',
    'pink': 'pink-500',
    'orange': 'orange-500',
    'teal': 'teal-500',
    'cyan': 'cyan-500',
    'indigo': 'indigo-500',
    'gray': 'gray-500',
    'black': 'gray-900',
    'white': 'white',
  };
  
  if (namedColorMap[lowerColor]) {
    return namedColorMap[lowerColor];
  }
  
  return 'gray-500';
}

function rgbToTailwind(r: number, g: number, b: number): string {
  // Calculate brightness for weight selection
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const weight = brightness > 200 ? '300' : brightness > 160 ? '400' : brightness > 120 ? '500' : brightness > 80 ? '600' : brightness > 40 ? '700' : '800';
  
  // Enhanced color detection
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  if (diff < 30) {
    // Grayscale
    if (brightness > 240) return 'gray-100';
    if (brightness > 200) return 'gray-300';
    if (brightness > 160) return 'gray-400';
    if (brightness > 120) return 'gray-500';
    if (brightness > 80) return 'gray-600';
    if (brightness > 40) return 'gray-700';
    return 'gray-800';
  }
  
  // Determine dominant color
  if (r === max) {
    if (g > b + 30) return `orange-${weight}`;
    if (b > g + 30) return `pink-${weight}`;
    return `red-${weight}`;
  } else if (g === max) {
    if (r > b + 30) return `yellow-${weight}`;
    if (b > r + 30) return `teal-${weight}`;
    return `green-${weight}`;
  } else {
    if (r > g + 30) return `purple-${weight}`;
    if (g > r + 30) return `cyan-${weight}`;
    return `blue-${weight}`;
  }
}

function hslToTailwind(h: number, s: number, l: number): string {
  // Convert HSL to approximate Tailwind color
  const weight = l > 80 ? '300' : l > 60 ? '400' : l > 40 ? '500' : l > 25 ? '600' : l > 15 ? '700' : '800';
  
  if (s < 10) {
    // Low saturation = gray
    return `gray-${weight}`;
  }
  
  // Determine color based on hue
  if (h < 15 || h >= 345) return `red-${weight}`;
  if (h < 45) return `orange-${weight}`;
  if (h < 75) return `yellow-${weight}`;
  if (h < 105) return `lime-${weight}`;
  if (h < 135) return `green-${weight}`;
  if (h < 165) return `emerald-${weight}`;
  if (h < 195) return `teal-${weight}`;
  if (h < 225) return `cyan-${weight}`;
  if (h < 255) return `blue-${weight}`;
  if (h < 285) return `indigo-${weight}`;
  if (h < 315) return `purple-${weight}`;
  return `pink-${weight}`;
}