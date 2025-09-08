'use client';

import { useEffect } from 'react';

export default function BodyClassHandler() {
  useEffect(() => {
    document.body.classList.add('realtime-page');
    return () => {
      document.body.classList.remove('realtime-page');
    };
  }, []);

  return null;
}

