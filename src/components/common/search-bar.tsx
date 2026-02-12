/**
 * SearchBar Component
 *
 * 검색 바 컴포넌트 (debounced)
 */

'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  debounce?: number
}

export function SearchBar({ 
  value = '', 
  onChange, 
  placeholder = '검색...', 
  debounce = 300 
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, debounce)

    return () => clearTimeout(timer)
  }, [localValue, onChange, debounce])

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
