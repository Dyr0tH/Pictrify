/*
	jsrepo 1.37.0
	Installed from https://reactbits.dev/ts/tailwind/
	2-18-2025
*/
"use client"

import { useEffect, useRef, useState, ReactNode } from 'react'

interface AnimatedContentProps {
  children: ReactNode
  distance?: number
  direction?: 'vertical' | 'horizontal'
  reverse?: boolean
  threshold?: number
  initialOpacity?: number
  animateOpacity?: boolean
  scale?: number
  config?: any // Not used in this version but kept for API compatibility
}

export default function AnimatedContent({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  threshold = 0.2,
  initialOpacity = 0.2,
  animateOpacity = true,
  scale = 1,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const getTransform = () => {
    if (!isVisible) {
      const translateValue = reverse ? -distance : distance
      const translateProp = direction === 'vertical' ? 'translateY' : 'translateX'
      return `${translateProp}(${translateValue}px) scale(${scale})`
    }
    return 'translateY(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  )
}
