'use client';

import { useEffect } from 'react';

export default function BodyClassHandler() {
  useEffect(() => {
    // Add class to body
    document.body.classList.add('travel-experiences-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('travel-experiences-page');
    };
  }, []);

  return null; // This component doesn't render anything
}