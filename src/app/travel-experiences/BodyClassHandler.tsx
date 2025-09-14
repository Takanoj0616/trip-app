'use client';

import { useEffect } from 'react';

export default function BodyClassHandler() {
  useEffect(() => {
    // Remove any existing page classes and add the new one
    document.body.classList.remove('page-travel-experiences', 'page-qna', 'page-realtime', 'travel-experiences-page');
    document.body.classList.add('page-travel-experiences');

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('page-travel-experiences');
    };
  }, []);

  return null; // This component doesn't render anything
}