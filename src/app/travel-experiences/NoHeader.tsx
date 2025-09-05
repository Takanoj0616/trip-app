'use client'

import { useEffect } from 'react'

export default function NoHeader() {
  useEffect(() => {
    document.body.classList.add('no-header')
    return () => {
      document.body.classList.remove('no-header')
    }
  }, [])
  return null
}

