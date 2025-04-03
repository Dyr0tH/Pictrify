'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#000000] opacity-0 animate-fadeIn"
        style={{ animationFillMode: 'forwards' }}
      />
      
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#FF3366]/5 blur-[100px] transition-all duration-500 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
        }}
      />
      
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-[#FF33A8]/5 blur-[80px] transition-all duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
        }}
      />
    </div>
  )
} 