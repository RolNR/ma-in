'use client'

import { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextType | null>(null)

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
  children: React.ReactNode
}

export function Accordion({
  type = 'single',
  defaultValue,
  className,
  children,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('divide-y divide-gray-200', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('AccordionItem must be used within Accordion')

  const isOpen = context.openItems.includes(value)

  return (
    <div
      className={cn('py-4', className)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionTrigger({ value, className, children }: AccordionTriggerProps) {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be used within Accordion')

  const isOpen = context.openItems.includes(value)

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between text-left font-medium text-gray-900 hover:text-primary transition-colors',
        className
      )}
      onClick={() => context.toggleItem(value)}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 text-gray-500 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionContent({ value, className, children }: AccordionContentProps) {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('AccordionContent must be used within Accordion')

  const isOpen = context.openItems.includes(value)

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('text-gray-600', className)}>
        {children}
      </div>
    </div>
  )
}
