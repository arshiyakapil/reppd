'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface NotebookLayoutProps {
  children: React.ReactNode
  className?: string
  showMargin?: boolean
  showLines?: boolean
  showHolePunch?: boolean
}

export function NotebookLayout({ 
  children, 
  className,
  showMargin = true,
  showLines = true,
  showHolePunch = true
}: NotebookLayoutProps) {
  return (
    <div 
      className={cn(
        "min-h-screen bg-amber-50 relative",
        showLines && "notebook-lines",
        className
      )}
    >
      {/* Red margin line */}
      {showMargin && (
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-red-50 border-r-2 border-red-300">
          {/* Hole punches */}
          {showHolePunch && (
            <>
              <div className="absolute left-6 top-12 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-inner"></div>
              <div className="absolute left-6 top-24 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-inner"></div>
              <div className="absolute left-6 top-36 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-inner"></div>
              <div className="absolute left-6 top-48 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-inner"></div>
            </>
          )}
        </div>
      )}
      
      {/* Main content area */}
      <div className={cn(
        "relative",
        showMargin ? "ml-20 pl-8" : "px-8"
      )}>
        {children}
      </div>
    </div>
  )
}

interface NotebookPageProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function NotebookPage({ children, title, className }: NotebookPageProps) {
  return (
    <div className={cn(
      "bg-amber-50 border-l-4 border-l-red-400 border-r border-t border-b border-blue-200",
      "shadow-lg rounded-r-lg relative overflow-hidden min-h-96",
      "notebook-lines",
      className
    )}>
      {/* Red margin */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-red-50 border-r border-red-300">
        {/* Hole punches */}
        <div className="absolute left-4 top-6 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
        <div className="absolute left-4 top-16 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
        <div className="absolute left-4 top-26 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
      </div>
      
      {/* Content area */}
      <div className="ml-16 pl-6 pr-6 py-6">
        {title && (
          <h1 className="text-2xl font-handwriting text-blue-900 mb-6 border-b-2 border-blue-300 pb-2">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  )
}

interface StickyNoteProps {
  children: React.ReactNode
  color?: 'yellow' | 'pink' | 'blue' | 'green'
  className?: string
  rotation?: number
}

export function StickyNote({ 
  children, 
  color = 'yellow', 
  className,
  rotation = 0 
}: StickyNoteProps) {
  const colorClasses = {
    yellow: 'bg-yellow-200 border-yellow-300',
    pink: 'bg-pink-200 border-pink-300',
    blue: 'bg-blue-200 border-blue-300',
    green: 'bg-green-200 border-green-300'
  }

  return (
    <div 
      className={cn(
        "p-4 border-2 shadow-md font-handwriting text-sm",
        "transform transition-transform hover:scale-105",
        colorClasses[color],
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </div>
  )
}

interface PaperClipProps {
  className?: string
}

export function PaperClip({ className }: PaperClipProps) {
  return (
    <div className={cn(
      "absolute -top-2 -right-2 w-8 h-12 bg-gray-300 rounded-t-lg",
      "border-2 border-gray-400 shadow-md",
      "before:absolute before:top-2 before:left-1 before:right-1 before:h-2",
      "before:bg-gray-400 before:rounded",
      className
    )}>
      <div className="absolute top-1 left-1 right-1 h-1 bg-gray-400 rounded"></div>
      <div className="absolute top-3 left-1 right-1 h-1 bg-gray-400 rounded"></div>
    </div>
  )
}
