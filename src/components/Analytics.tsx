'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_ID } from '@/lib/site'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    const w: any = typeof window !== 'undefined' ? (window as any) : undefined
    if (w && w.gtag) {
      w.gtag('config', GA_ID, {
        page_path: url,
        page_title: document?.title,
        page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      })
    }
  }, [pathname, searchParams])

  return null
}

