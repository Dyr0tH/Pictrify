'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface TransitionTemplateProps {
  children: ReactNode
}

export default function TransitionTemplate({ children }: TransitionTemplateProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isMounted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 