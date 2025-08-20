'use client';

import { useEffect, useRef, useState } from 'react';

interface SakuraParticle {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
}

const SakuraBackground = () => {
  const [particles, setParticles] = useState<SakuraParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const createSakura = () => {
      const newParticle: SakuraParticle = {
        id: particleIdRef.current++,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 10,
        animationDelay: Math.random() * 5,
        size: Math.random() * 8 + 8,
      };

      setParticles(prev => [...prev, newParticle]);

      // Remove particle after animation completes
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, (newParticle.animationDuration + newParticle.animationDelay) * 1000);
    };

    // Start creating particles
    intervalRef.current = setInterval(createSakura, 800);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setParticles([]);
    };
  }, []);

  return (
    <div 
      className="sakura-container" 
      id="sakuraContainer" 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden'
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="sakura"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `sakuraFall ${particle.animationDuration}s linear ${particle.animationDelay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraBackground;