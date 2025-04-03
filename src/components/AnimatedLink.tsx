'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export default function AnimatedLink({ href, children, className }: AnimatedLinkProps) {
  return (
    <Link href={href} passHref>
      <div
        className={`transform transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${className || ''}`}
      >
        {children}
      </div>
    </Link>
  )
} 