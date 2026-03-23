'use client'

import { useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

async function lookupCP(cp: string): Promise<{ city: string; state: string; abbr: string } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/MX/${cp}`)
    if (!res.ok) return null
    const data = await res.json()
    const place = data.places?.[0]
    if (!place) return null
    return {
      city: place['place name'] ?? '',
      state: place['state'] ?? '',
      abbr: place['state abbreviation'] ?? '',
    }
  } catch {
    return null
  }
}

interface CPInputProps {
  name: string
  cityRef: React.RefObject<HTMLInputElement | null>
  stateRef: React.RefObject<HTMLInputElement | null>
  abbrRef?: React.RefObject<HTMLInputElement | null>
  inputRef?: React.Ref<HTMLInputElement>
  defaultValue?: string
}

export function CPInput({ name, cityRef, stateRef, abbrRef, inputRef, defaultValue }: CPInputProps) {
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cp = e.target.value.trim()
    if (timer.current) clearTimeout(timer.current)
    if (cp.length !== 5) return
    timer.current = setTimeout(async () => {
      setLoading(true)
      const result = await lookupCP(cp)
      setLoading(false)
      if (!result) return
      if (cityRef.current)  cityRef.current.value  = result.city
      if (stateRef.current) stateRef.current.value = result.state
      if (abbrRef?.current) abbrRef.current.value  = result.abbr
    }, 400)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        name={name}
        className={inputClass}
        placeholder="Código postal"
        maxLength={10}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
      {loading && (
        <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-primary-500 animate-pulse" />
      )}
    </div>
  )
}
