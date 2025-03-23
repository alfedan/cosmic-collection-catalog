
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const requestIdRef = useRef<number>(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create stars
    const stars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      const star: Star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.01,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2
      };
      stars.push(star);
    }
    starsRef.current = stars;
  };

  const drawStars = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    starsRef.current.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Move stars slightly
      star.y = (star.y + star.speed) % canvas.height;
    });
    
    // Create subtle blue nebula effect
    ctx.fillStyle = 'rgba(99, 179, 237, 0.003)';
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 100 + 50;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create subtle purple nebula effect
    ctx.fillStyle = 'rgba(159, 122, 234, 0.002)';
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 120 + 80;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const animate = (time: number) => {
    drawStars(time);
    requestIdRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      initCanvas();
    }
  };

  useEffect(() => {
    initCanvas();
    requestIdRef.current = requestAnimationFrame(animate);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #0B0E18, #121A2D 80%, #1E2A4A)' }}
    />
  );
};

export default StarryBackground;
