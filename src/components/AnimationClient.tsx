'use client';

import { useEffect } from 'react';

export default function AnimationClient() {
  useEffect(() => {
    // Mouse tracking for animated background
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;
      
      document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
      document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
    };

    // Scroll tracking
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll', scrollY.toString());
    };

    // Create sakura particles
    const createSakura = () => {
      const sakuraContainer = document.getElementById('sakuraContainer');
      if (!sakuraContainer) return;
      
      const sakura = document.createElement('div');
      sakura.className = 'sakura';
      
      // Random starting position and animation duration
      const startX = Math.random() * 100;
      const duration = Math.random() * 15 + 10; // 10-25 seconds
      const delay = Math.random() * 5; // 0-5 seconds delay
      const size = Math.random() * 8 + 8; // 8-16px
      
      sakura.style.left = startX + '%';
      sakura.style.animationDuration = duration + 's';
      sakura.style.animationDelay = delay + 's';
      sakura.style.width = size + 'px';
      sakura.style.height = size + 'px';
      
      sakuraContainer.appendChild(sakura);
      
      // Remove sakura after animation
      setTimeout(() => {
        if (sakura && sakura.parentNode && sakuraContainer.contains(sakura)) {
          sakuraContainer.removeChild(sakura);
        }
      }, (duration + delay) * 1000);
    };

    // Initialize animations
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);
    
    // Create periodic sakura particles
    const sakuraInterval = setInterval(createSakura, 800);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      clearInterval(sakuraInterval);
      
      // Clear sakura particles
      const sakuraContainer = document.getElementById('sakuraContainer');
      if (sakuraContainer) {
        sakuraContainer.innerHTML = '';
      }
    };
  }, []);

  return null;
}