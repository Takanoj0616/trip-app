'use client';

import { useEffect } from 'react';

export default function QnaBodyClassHandler() {
  useEffect(() => {
    // Add class to body
    document.body.classList.add('qna-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('qna-page');
    };
  }, []);

  return null; // This component doesn't render anything
}