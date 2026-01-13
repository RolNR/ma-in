'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui'
import { faqData, faqCategories, getFAQByCategory, searchFAQ } from '@/data/faq'
import type { FAQItem, FAQCategory } from '@/data/faq'
import {
  Truck,
  MapPin,
  Package,
  CreditCard,
  User,
  HelpCircle,
  Search,
} from 'lucide-react'

interface FAQProps {
  items?: FAQItem[]
  showCategories?: boolean
  showSearch?: boolean
  limit?: number
  className?: string
}

const categoryIcons = {
  truck: Truck,
  'map-pin': MapPin,
  package: Package,
  'credit-card': CreditCard,
  user: User,
  'help-circle': HelpCircle,
}

export function FAQ({
  items,
  showCategories = true,
  showSearch = true,
  limit,
  className,
}: FAQProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get FAQ items based on category, search, or provided items
  const getFAQItems = (): FAQItem[] => {
    if (items) return items

    if (searchQuery.trim()) {
      return searchFAQ(searchQuery)
    }

    if (activeCategory) {
      return getFAQByCategory(activeCategory)
    }

    return faqData
  }

  const displayItems = limit ? getFAQItems().slice(0, limit) : getFAQItems()

  return (
    <div className={cn('', className)}>
      {/* Search bar */}
      {showSearch && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en preguntas frecuentes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value.trim()) {
                setActiveCategory(null)
              }
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      )}

      {/* Categories */}
      {showCategories && !searchQuery && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Todas
          </button>
          {faqCategories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || HelpCircle

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-600 mb-4">
          {displayItems.length} resultado{displayItems.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
        </p>
      )}

      {/* FAQ Items */}
      {displayItems.length > 0 ? (
        <Accordion type="single" className="bg-white rounded-xl shadow-soft">
          {displayItems.map((item) => (
            <AccordionItem key={item.id} value={`faq-${item.id}`}>
              <AccordionTrigger
                value={`faq-${item.id}`}
                className="text-left"
              >
                <span className="pr-8">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent value={`faq-${item.id}`}>
                <p>{item.answer}</p>
                {!searchQuery && (
                  <span className="inline-block mt-3 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {faqCategories.find(c => c.id === item.category)?.name}
                  </span>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No se encontraron resultados
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-primary font-medium hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  )
}
