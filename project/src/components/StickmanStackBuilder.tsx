import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Zap, Target } from 'lucide-react';

declare global {
  interface Window {
    CrazyGames?: any;
  }
}

interface GameObject {
  x: number;
  y: number;
}

interface Stickman extends GameObject {
  vx: number;
  vy: number;
  isJumping: boolean;
  isOnGround: boolean;
  animationFrame: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Box extends GameObject {
  width: number;
  height: number;
  direction: number;
  speed: number;
  placed: boolean;
  color: string;
  glow: number;
  wobble: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'star' | 'circle' | 'trail';
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 700;
const GROUND_Y = 620;
const STICKMAN_WIDTH = 24;
const STICKMAN_HEIGHT = 48;
const BOX_WIDTH = 90;
const BOX_HEIGHT = 35;
const GRAVITY = 0.9;
const JUMP_FORCE = -16;
const CAMERA_MARGIN_TOP = 180; // How much space above stickman

const BOX_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const StickmanStackBuilder: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const jumpSfxRef = useRef<HTMLAudioElement | null>(null);
  const coinSfxRef = useRef<HTMLAudioElement | null>(null);
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const playAreaContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('stickman-high-score');
    return saved ? parseInt(saved) : 0;
  });
  const [lastMidgameAdScore, setLastMidgameAdScore] = useState(0); // Track last score at which ad was shown
  const [isMidgameAdPlaying, setIsMidgameAdPlaying] = useState(false); // Prevent input during ad
  const [midgameAdPending, setMidgameAdPending] = useState(false);
  // Track how many blocks have been stacked (for sky height)
  const [skyBlocks, setSkyBlocks] = useState(0);

  const lastAdBlockRef = useRef(0);
  
  const gameStateRef = useRef({
    stickman: {
      x: CANVAS_WIDTH / 2,
      y: GROUND_Y - STICKMAN_HEIGHT,
      vx: 0,
      vy: 0,
      isJumping: false,
      isOnGround: true,
      animationFrame: 0,
      trail: []
    } as Stickman,
    currentBox: {
      x: 100,
      y: GROUND_Y - BOX_HEIGHT,
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      direction: 1,
      speed: 2.5,
      placed: false,
      color: BOX_COLORS[0],
      glow: 0,
      wobble: 0
    } as Box,
    stack: [] as Box[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    cameraShake: 0,
    backgroundOffset: 0,
    perfectLandings: 0,
    lastTime: 0,
    stars: [] as Array<{ x: number; y: number; twinkle: number }>
  });

  // Initialize background stars
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT * 0.7,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    gameStateRef.current.stars = stars;
  }, []);

  const createParticles = useCallback((x: number, y: number, type: 'success' | 'perfect' | 'fail' = 'success') => {
    const particles: Particle[] = [];
    const count = type === 'perfect' ? 20 : type === 'success' ? 12 : 15;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = type === 'perfect' ? 8 : 6;
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        life: type === 'perfect' ? 60 : 40,
        maxLife: type === 'perfect' ? 60 : 40,
        color: type === 'fail' ? '#FF4757' : type === 'perfect' ? '#FFD700' : '#00D2FF',
        size: type === 'perfect' ? 4 : 3,
        type: type === 'perfect' ? 'star' : type === 'fail' ? 'spark' : 'circle'
      });
    }
    
    gameStateRef.current.particles.push(...particles);
  }, []);

  const createFloatingText = useCallback((x: number, y: number, text: string, color: string = '#FFD700') => {
    gameStateRef.current.floatingTexts.push({
      x,
      y,
      text,
      life: 90,
      maxLife: 90,
      color,
      size: text.includes('PERFECT') ? 24 : 18
    });
  }, []);

  const updateParticles = useCallback((particles: Particle[]) => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.4;
      particle.vx *= 0.98;
      particle.life--;
      
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }, []);

  const updateFloatingTexts = useCallback((texts: FloatingText[]) => {
    for (let i = texts.length - 1; i >= 0; i--) {
      const text = texts[i];
      text.y -= 2;
      text.life--;
      
      if (text.life <= 0) {
        texts.splice(i, 1);
      }
    }
  }, []);

  const checkCollision = useCallback((stickman: Stickman, box: Box): boolean => {
    return (
      stickman.x < box.x + box.width &&
      stickman.x + STICKMAN_WIDTH > box.x &&
      stickman.y < box.y + box.height &&
      stickman.y + STICKMAN_HEIGHT > box.y
    );
  }, []);

  const jump = useCallback(() => {
    if (gameState !== 'playing') return;
    const { stickman } = gameStateRef.current;
    if (stickman.isOnGround) {
      stickman.vy = JUMP_FORCE;
      stickman.isJumping = true;
      stickman.isOnGround = false;
      // Play jump sound effect (force replay)
      if (jumpSfxRef.current) {
        jumpSfxRef.current.pause();
        jumpSfxRef.current.currentTime = 0;
        jumpSfxRef.current.play();
      }
      // Create jump particles
      createParticles(stickman.x + STICKMAN_WIDTH / 2, stickman.y + STICKMAN_HEIGHT, 'success');
    }
  }, [gameState, createParticles]);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      stickman: {
        x: CANVAS_WIDTH / 2,
        y: GROUND_Y - STICKMAN_HEIGHT,
        vx: 0,
        vy: 0,
        isJumping: false,
        isOnGround: true,
        animationFrame: 0,
        trail: []
      },
      currentBox: {
        x: 100,
        y: GROUND_Y - BOX_HEIGHT,
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        direction: 1,
        speed: 2.5,
        placed: false,
        color: BOX_COLORS[0],
        glow: 0,
        wobble: 0
      },
      stack: [],
      particles: [],
      floatingTexts: [],
      cameraShake: 0,
      backgroundOffset: 0,
      perfectLandings: 0,
      lastTime: 0,
      stars: gameStateRef.current.stars
    };
    setScore(0);
    setCombo(0);
    setGameState('playing');
  }, []);

  // Helper to show midgame ad every 10 blocks
  const maybeShowMidgameAd = useCallback((currentScore: number) => {
    if (
      currentScore > 0 &&
      currentScore % 10 === 0 &&
      currentScore !== lastMidgameAdScore &&
      window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ad
    ) {
      setIsMidgameAdPlaying(true);
      // Mute audio
      if (audioRef.current) audioRef.current.muted = true;
      if (jumpSfxRef.current) jumpSfxRef.current.muted = true;
      if (coinSfxRef.current) coinSfxRef.current.muted = true;
      const callbacks = {
        adFinished: () => {
          setIsMidgameAdPlaying(false);
          setLastMidgameAdScore(currentScore);
          // Unmute audio
          if (audioRef.current) audioRef.current.muted = false;
          if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
          if (coinSfxRef.current) coinSfxRef.current.muted = false;
        },
        adError: (error: any) => {
          setIsMidgameAdPlaying(false);
          setLastMidgameAdScore(currentScore);
          // Unmute audio
          if (audioRef.current) audioRef.current.muted = false;
          if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
          if (coinSfxRef.current) coinSfxRef.current.muted = false;
        },
        adStarted: () => {
          // Already muted above
        },
      };
      window.CrazyGames.SDK.ad.requestAd('midgame', callbacks);
    }
  }, [lastMidgameAdScore]);

  const gameLoop = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { stickman, currentBox, stack, particles, floatingTexts } = gameStateRef.current;
    const deltaTime = currentTime - gameStateRef.current.lastTime;
    gameStateRef.current.lastTime = currentTime;

    if (gameState === 'playing') {
      // Prevent input/game update during midgame ad
      if (isMidgameAdPlaying) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      // Update stickman physics
      stickman.vy += GRAVITY;
      stickman.x += stickman.vx;
      stickman.y += stickman.vy;
      stickman.animationFrame += 0.2;

      // Update stickman trail
      stickman.trail.unshift({ x: stickman.x + STICKMAN_WIDTH / 2, y: stickman.y + STICKMAN_HEIGHT / 2, alpha: 1 });
      if (stickman.trail.length > 8) stickman.trail.pop();
      stickman.trail.forEach((point, index) => {
        point.alpha = 1 - (index / stickman.trail.length);
      });

      // Check ground collision
      const currentStackHeight = stack.length * BOX_HEIGHT;
      const groundLevel = GROUND_Y - currentStackHeight - STICKMAN_HEIGHT;
      
      if (stickman.y >= groundLevel) {
        stickman.y = groundLevel;
        stickman.vy = 0;
        stickman.isOnGround = true;
        stickman.isJumping = false;
      }

      // Update moving box with dynamic speed
      if (!currentBox.placed) {
        // Speed increases every 10 blocks (first 10 blocks are now normal speed)
        // Make base speed faster and increment a bit more
        const speed = 4.0 + Math.floor(stack.length / 10) * 1.0;
        currentBox.speed = speed;
        currentBox.x += currentBox.direction * currentBox.speed;
        currentBox.glow = Math.sin(currentTime * 0.01) * 0.5 + 0.5;
        currentBox.wobble = Math.sin(currentTime * 0.02) * 2;
        if (currentBox.x <= 0 || currentBox.x >= CANVAS_WIDTH - currentBox.width) {
          currentBox.direction *= -1;
        }
      }

      // Check if stickman lands on moving box
      if (stickman.isJumping && stickman.vy > 0 && checkCollision(stickman, currentBox)) {
        const boxCenterX = currentBox.x + currentBox.width / 2;
        const stickmanCenterX = stickman.x + STICKMAN_WIDTH / 2;
        const offset = Math.abs(boxCenterX - stickmanCenterX);
        
        if (offset < 40) {
          // Play coin sound for any successful landing
          if (coinSfxRef.current) {
            coinSfxRef.current.pause();
            coinSfxRef.current.currentTime = 0;
            coinSfxRef.current.play().catch(() => {});
          }
          currentBox.placed = true;
          stack.push({ ...currentBox });
          setSkyBlocks(stack.length); // Update sky height after each block
          // --- Midgame Ad Trigger ---
          const newBlockCount = stack.length;
          if (
            newBlockCount > 0 &&
            newBlockCount % 10 === 0 &&
            lastAdBlockRef.current !== newBlockCount &&
            !midgameAdPending
          ) {
            setMidgameAdPending(true);
            lastAdBlockRef.current = newBlockCount;
          }
          // Update stickman position
          stickman.y = currentBox.y - STICKMAN_HEIGHT;
          stickman.vy = 0;
          stickman.isOnGround = true;
          stickman.isJumping = false;
          
          // Check for perfect landing
          const isPerfect = offset < 15;
          if (isPerfect) {
            gameStateRef.current.perfectLandings++;
            setCombo(prev => prev + 1);
            createParticles(currentBox.x + currentBox.width / 2, currentBox.y, 'perfect');
            createFloatingText(currentBox.x + currentBox.width / 2, currentBox.y - 30, 'PERFECT!', '#FFD700');
          } else {
            setCombo(0);
            createParticles(currentBox.x + currentBox.width / 2, currentBox.y, 'success');
          }
          
          // Update score with combo multiplier
          const basePoints = 10;
          const comboBonus = combo > 0 ? combo * 5 : 0;
          const perfectBonus = isPerfect ? 20 : 0;
          const totalPoints = basePoints + comboBonus + perfectBonus;
          
          const newScore = score + totalPoints;
          setScore(newScore);
          // --- Show midgame ad every 10 blocks ---
          maybeShowMidgameAd(newScore);
          
          if (totalPoints > basePoints) {
            createFloatingText(currentBox.x + currentBox.width / 2, currentBox.y - 60, `+${totalPoints}`, '#00FF88');
          }
          
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('stickman-high-score', newScore.toString());
          }
          
          // Create new box with random color
          const colorIndex = Math.floor(Math.random() * BOX_COLORS.length);
          const speed = 4.0 + Math.floor((stack.length + 1) / 10) * 1.0;
          gameStateRef.current.currentBox = {
            x: Math.random() > 0.5 ? 50 : CANVAS_WIDTH - 50 - BOX_WIDTH,
            y: GROUND_Y - BOX_HEIGHT - (stack.length * BOX_HEIGHT),
            width: BOX_WIDTH,
            height: BOX_HEIGHT,
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: speed,
            placed: false,
            color: BOX_COLORS[colorIndex],
            glow: 0,
            wobble: 0
          };
          
          // Camera shake
          gameStateRef.current.cameraShake = isPerfect ? 8 : 5;
        } else {
          // Failed landing - game over
          setGameState('gameOver');
          createParticles(stickman.x + STICKMAN_WIDTH / 2, stickman.y + STICKMAN_HEIGHT / 2, 'fail');
          createFloatingText(stickman.x + STICKMAN_WIDTH / 2, stickman.y, 'MISSED!', '#FF4757');
        }
      }

      // Check if stickman falls off screen
      if (stickman.y > CANVAS_HEIGHT + 100) {
        setGameState('gameOver');
      }

      // Update particles and floating texts
      updateParticles(particles);
      updateFloatingTexts(floatingTexts);
      
      // Update camera shake
      if (gameStateRef.current.cameraShake > 0) {
        gameStateRef.current.cameraShake *= 0.85;
        if (gameStateRef.current.cameraShake < 0.1) {
          gameStateRef.current.cameraShake = 0;
        }
      }

      // Update background
      gameStateRef.current.backgroundOffset += 0.5;
    }

    // Render
    ctx.save();
    // --- REMOVE cameraY/camera-follow logic ---
    // ctx.translate(0, cameraY); // REMOVE THIS LINE
    
    // Animated gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    const time = currentTime * 0.001;
    gradient.addColorStop(0, `hsl(${240 + Math.sin(time) * 20}, 70%, 15%)`);
    gradient.addColorStop(0.3, `hsl(${260 + Math.cos(time * 0.7) * 15}, 60%, 25%)`);
    gradient.addColorStop(0.7, `hsl(${280 + Math.sin(time * 0.5) * 10}, 50%, 35%)`);
    gradient.addColorStop(1, `hsl(${300 + Math.cos(time * 0.3) * 25}, 40%, 20%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw animated stars
    gameStateRef.current.stars.forEach((star, index) => {
      star.twinkle += 0.05;
      const alpha = (Math.sin(star.twinkle) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.fillRect(star.x, star.y, 2, 2);
    });

    // Draw ground with glow effect
    const groundGradient = ctx.createLinearGradient(0, GROUND_Y - 20, 0, CANVAS_HEIGHT);
    groundGradient.addColorStop(0, 'rgba(100, 50, 200, 0.8)');
    groundGradient.addColorStop(1, 'rgba(50, 25, 100, 1)');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, GROUND_Y - 20, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 20);
    
    // Ground line with glow
    ctx.shadowColor = '#00D2FF';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00D2FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw stacked boxes with enhanced visuals
    stack.forEach((box, index) => {
      ctx.save();
      
      // Box glow
      ctx.shadowColor = box.color;
      ctx.shadowBlur = 15;
      
      // Box gradient
      const boxGradient = ctx.createLinearGradient(box.x, box.y, box.x, box.y + box.height);
      boxGradient.addColorStop(0, box.color);
      boxGradient.addColorStop(1, box.color + '80');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(box.x, box.y, box.width, box.height);
      
      // Box highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(box.x, box.y, box.width, 8);
      
      // Box outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      ctx.restore();
    });

    // Draw current moving box with enhanced effects
    if (!currentBox.placed) {
      ctx.save();
      
      // Moving box glow
      ctx.shadowColor = currentBox.color;
      ctx.shadowBlur = 20 + currentBox.glow * 10;
      
      // Box position with wobble
      const boxX = currentBox.x;
      const boxY = currentBox.y + currentBox.wobble;
      
      // Box gradient
      const boxGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + currentBox.height);
      boxGradient.addColorStop(0, currentBox.color);
      boxGradient.addColorStop(1, currentBox.color + '60');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(boxX, boxY, currentBox.width, currentBox.height);
      
      // Box highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + currentBox.glow * 0.3})`;
      ctx.fillRect(boxX, boxY, currentBox.width, 10);
      
      // Movement indicator with glow
      ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + currentBox.glow * 0.4})`;
      if (currentBox.direction > 0) {
        ctx.fillRect(boxX + currentBox.width - 12, boxY + 8, 6, currentBox.height - 16);
      } else {
        ctx.fillRect(boxX + 6, boxY + 8, 6, currentBox.height - 16);
      }
      
      // Speed indicator
      const speedBars = Math.min(5, Math.floor(currentBox.speed / 2));
      for (let i = 0; i < speedBars; i++) {
        ctx.fillStyle = `rgba(255, ${255 - i * 40}, 0, ${0.8 - i * 0.1})`;
        ctx.fillRect(boxX + 10 + i * 8, boxY - 15, 4, 8);
      }
      
      ctx.restore();
    }

    // Draw stickman trail
    stickman.trail.forEach((point, index) => {
      ctx.fillStyle = `rgba(0, 210, 255, ${point.alpha * 0.3})`;
      const size = 4 * point.alpha;
      ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    });

    // Draw enhanced stickman
    ctx.save();
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    
    // Head with glow
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(stickman.x + STICKMAN_WIDTH / 2, stickman.y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(stickman.x + STICKMAN_WIDTH / 2 - 3, stickman.y + 6, 2, 2);
    ctx.fillRect(stickman.x + STICKMAN_WIDTH / 2 + 1, stickman.y + 6, 2, 2);
    
    // Body with animation
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineCap = 'round';
    
    const bodyOffset = Math.sin(stickman.animationFrame) * 2;
    ctx.beginPath();
    ctx.moveTo(stickman.x + STICKMAN_WIDTH / 2, stickman.y + 16);
    ctx.lineTo(stickman.x + STICKMAN_WIDTH / 2 + bodyOffset, stickman.y + 35);
    ctx.stroke();
    
    // Arms with animation
    const armOffset = Math.sin(stickman.animationFrame + Math.PI) * 3;
    ctx.beginPath();
    ctx.moveTo(stickman.x + STICKMAN_WIDTH / 2 - 10 + armOffset, stickman.y + 22);
    ctx.lineTo(stickman.x + STICKMAN_WIDTH / 2 + 10 - armOffset, stickman.y + 22);
    ctx.stroke();
    
    // Legs with animation
    const legOffset = stickman.isJumping ? 5 : Math.sin(stickman.animationFrame * 2) * 2;
    ctx.beginPath();
    ctx.moveTo(stickman.x + STICKMAN_WIDTH / 2, stickman.y + 35);
    ctx.lineTo(stickman.x + STICKMAN_WIDTH / 2 - 8 + legOffset, stickman.y + STICKMAN_HEIGHT);
    ctx.moveTo(stickman.x + STICKMAN_WIDTH / 2, stickman.y + 35);
    ctx.lineTo(stickman.x + STICKMAN_WIDTH / 2 + 8 - legOffset, stickman.y + STICKMAN_HEIGHT);
    ctx.stroke();
    
    ctx.restore();

    // Draw particles with different types
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      
      switch (particle.type) {
        case 'star':
          ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.life * 0.1);
          ctx.fillRect(-particle.size, -1, particle.size * 2, 2);
          ctx.fillRect(-1, -particle.size, 2, particle.size * 2);
          break;
        case 'spark':
          ctx.strokeStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.vx, particle.y - particle.vy);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
          break;
        default:
          ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.restore();
    });

    // Draw floating texts
    floatingTexts.forEach(text => {
      const alpha = text.life / text.maxLife;
      ctx.fillStyle = text.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.font = `bold ${text.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(text.text, text.x, text.y);
    });

    ctx.restore();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, combo, highScore, checkCollision, createParticles, createFloatingText, updateParticles, updateFloatingTexts, midgameAdPending]);

  // --- Show CrazyGames midgame ad when pending ---
  useEffect(() => {
    if (!midgameAdPending) return;
    // Pause game
    setGameState('paused');
    // Mute audio
    if (audioRef.current) audioRef.current.muted = true;
    if (jumpSfxRef.current) jumpSfxRef.current.muted = true;
    if (coinSfxRef.current) coinSfxRef.current.muted = true;
    // Show ad
    if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ad) {
      const callbacks = {
        adFinished: () => {
          if (audioRef.current) audioRef.current.muted = false;
          if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
          if (coinSfxRef.current) coinSfxRef.current.muted = false;
          setGameState('playing');
          setMidgameAdPending(false);
        },
        adError: (error: any) => {
          if (audioRef.current) audioRef.current.muted = false;
          if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
          if (coinSfxRef.current) coinSfxRef.current.muted = false;
          setGameState('playing');
          setMidgameAdPending(false);
        },
        adStarted: () => {
          // Already muted above
        },
      };
      window.CrazyGames.SDK.ad.requestAd('midgame', callbacks);
    } else {
      // If SDK not available, just resume
      setTimeout(() => {
        if (audioRef.current) audioRef.current.muted = false;
        if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
        if (coinSfxRef.current) coinSfxRef.current.muted = false;
        setGameState('playing');
        setMidgameAdPending(false);
      }, 1000);
    }
  }, [midgameAdPending]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Ensure background music starts after first user interaction
  useEffect(() => {
    const tryPlayMusic = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', tryPlayMusic);
      window.removeEventListener('keydown', tryPlayMusic);
    };
    window.addEventListener('pointerdown', tryPlayMusic);
    window.addEventListener('keydown', tryPlayMusic);
    return () => {
      window.removeEventListener('pointerdown', tryPlayMusic);
      window.removeEventListener('keydown', tryPlayMusic);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (gameState === 'playing') {
      // Only play if not already playing
      if (audioRef.current.paused) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {}); // Ignore autoplay errors
        }
      }
    } else {
      audioRef.current.pause();
    }
  }, [gameState]);

  const handleCanvasClick = () => {
    jump();
  };

  // --- CrazyGames Rewarded Ad Integration for Revive ---
  const [reviveAvailable, setReviveAvailable] = useState(true); // Only allow 1 revive per game
  const handleRevive = () => {
    if (!window.CrazyGames || !window.CrazyGames.SDK || !window.CrazyGames.SDK.ad) {
      // If SDK not available, just revive (for local/dev)
      doRevive();
      return;
    }
    const callbacks = {
      adFinished: () => {
        console.log('End rewarded ad');
        doRevive();
      },
      adError: (error: any) => {
        console.log('Error rewarded ad', error);
        doRevive();
      },
      adStarted: () => {
        console.log('Start rewarded ad');
        if (audioRef.current) audioRef.current.muted = true;
        if (jumpSfxRef.current) jumpSfxRef.current.muted = true;
        if (coinSfxRef.current) coinSfxRef.current.muted = true;
      },
    };
    window.CrazyGames.SDK.ad.requestAd('rewarded', callbacks);
  };
  function doRevive() {
    // Unmute audio
    if (audioRef.current) audioRef.current.muted = false;
    if (jumpSfxRef.current) jumpSfxRef.current.muted = false;
    if (coinSfxRef.current) coinSfxRef.current.muted = false;
    // Actually revive: reset stickman to top of stack, keep score/stack
    const { stack } = gameStateRef.current;
    if (stack.length > 0) {
      gameStateRef.current.stickman.x = stack[stack.length - 1].x + (BOX_WIDTH - STICKMAN_WIDTH) / 2;
      gameStateRef.current.stickman.y = stack[stack.length - 1].y - STICKMAN_HEIGHT;
      gameStateRef.current.stickman.vx = 0;
      gameStateRef.current.stickman.vy = 0;
      gameStateRef.current.stickman.isJumping = false;
      gameStateRef.current.stickman.isOnGround = true;
      setGameState('playing');
      setReviveAvailable(false);
    } else {
      // If no stack, just restart
      resetGame();
    }
  }

  // --- Scroll play area up after every 10 blocks ---
  useEffect(() => {
    if (score > 0 && score % 100 === 0 && playAreaContainerRef.current) {
      // Each 10 blocks = 100 points (10 per block)
      playAreaContainerRef.current.scrollTop += 120; // Scroll up by 120px (tweak as needed)
    }
  }, [score]);

  // --- Grow sky and scroll to bottom after each block ---
  useEffect(() => {
    if (playAreaContainerRef.current) {
      // Increase sky height and scroll to bottom
      playAreaContainerRef.current.scrollTop = playAreaContainerRef.current.scrollHeight;
    }
  }, [skyBlocks]);

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col items-center justify-center p-0 m-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background music audio element */}
      <audio ref={audioRef} src="/candy-upbeat-funky-trailer-music-125829.mp3" loop />
      {/* Jump sound effect audio element */}
      <audio ref={jumpSfxRef} src="/cartoon-jump-6462.mp3" preload="auto" />
      {/* Coin sound effect audio element */}
      <audio ref={coinSfxRef} src="/coin-recieved-230517.mp3" preload="auto" />
      <div
        ref={playAreaContainerRef}
        className="bg-black/20 backdrop-blur-xl rounded-3xl p-0 shadow-2xl border border-white/10 max-w-4xl w-full flex flex-col items-center justify-center"
        style={{ minHeight: '90vh', overflow: 'auto', maxHeight: '90vh' }}
      >
        {/* Sky spacer grows as blocks are stacked */}
        <div style={{ height: skyBlocks * BOX_HEIGHT }} />
        <div className="text-center mb-4 mt-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-0">
            Stickman Stack Builder
          </h1>
        </div>
        <div className="relative flex-1 w-full flex flex-col items-center justify-center" style={{ minWidth: CANVAS_WIDTH, minHeight: CANVAS_HEIGHT }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-white/20 rounded-2xl cursor-pointer shadow-2xl"
            onClick={handleCanvasClick}
          />
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center text-white w-full flex flex-col items-center justify-center">
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Stickman Stack Builder
                </h2>
                <button
                  onClick={resetGame}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-2xl hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto text-lg"
                >
                  <Play size={24} />
                  Start Game
                </button>
              </div>
            </div>
          )}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">💥</div>
                <h2 className="text-4xl font-bold mb-3 text-red-400">Game Over!</h2>
                <p className="text-2xl mb-2">Final Score: <span className="font-bold text-cyan-400">{score}</span></p>
                <p className="text-lg mb-2">Speed Reached: <span className="font-bold text-orange-400">{(4.0 + Math.floor(score / 10) * 1.0).toFixed(1)}x</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-400 mb-6 text-xl font-bold">🏆 NEW HIGH SCORE!</p>
                )}
                <div className="flex flex-col gap-4 items-center">
                  <button
                    onClick={resetGame}
                    className="px-10 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-bold rounded-2xl hover:from-red-600 hover:via-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto text-lg"
                  >
                    <RotateCcw size={24} />
                    Try Again
                  </button>
                  {reviveAvailable && (
                    <button
                      onClick={handleRevive}
                      className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white font-bold rounded-2xl hover:from-yellow-500 hover:via-orange-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto text-lg"
                    >
                      <span role="img" aria-label="revive">❤️‍🔥</span>
                      Revive
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-6 justify-center">
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            >
              <Pause size={18} />
              Pause
            </button>
          )}
          {gameState === 'paused' && (
            <button
              onClick={() => setGameState('playing')}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            >
              <Play size={18} />
              Resume
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
          >
            <RotateCcw size={18} />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickmanStackBuilder;
