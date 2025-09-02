'use client';

import { useEffect } from 'react';

export default function SakuraAnimation() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = document.getElementById('sakuraParticles');
    if (!container) return;

    const particles: HTMLElement[] = [];
    const particleCount = 15; // Low particle count for performance

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'sakura-particle';
      
      // Random initial position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '-10px';
      
      // Random animation duration (slow for gentle effect)
      const duration = (Math.random() * 10 + 15) * 1000; // 15-25 seconds
      particle.style.animationDuration = duration + 'ms';
      
      // Random delay
      const delay = Math.random() * 5000;
      particle.style.animationDelay = delay + 'ms';
      
      // Random opacity
      particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Remove particle after animation completes
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
          const index = particles.indexOf(particle);
          if (index > -1) {
            particles.splice(index, 1);
          }
        }
      }, duration + delay);
    };

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => createParticle(), Math.random() * 10000);
    }

    // Continuously create new particles
    const interval = setInterval(() => {
      if (particles.length < particleCount) {
        createParticle();
      }
    }, 2000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return null;
}