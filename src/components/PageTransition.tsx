'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [prevPathname, setPrevPathname] = useState(pathname)
  
  useEffect(() => {
    // Only run animation when path changes
    if (pathname !== prevPathname) {
      // Path changed, start transition
      setIsVisible(false)
      
      // After fade out completes, update pathname and fade in
      const timer = setTimeout(() => {
        setPrevPathname(pathname)
        setIsVisible(true)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])
  
  return (
    <div 
      className="transition-all duration-300 ease-out min-h-screen"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
      }}
    >
      {children}
    </div>
  )
} 