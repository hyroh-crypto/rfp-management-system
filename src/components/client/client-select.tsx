/**
 * ClientSelect Component
 *
 * 고객사 선택 드롭다운 (Autocomplete)
 */

'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Client } from '@/types/client'

interface ClientSelectProps {
  clients: Client[]
  value?: string
  onChange: (clientId: string) => void
  label?: string
  placeholder?: string
  error?: string
}

export function ClientSelect({ 
  clients, 
  value, 
  onChange, 
  label = '고객사',
  placeholder = '고객사를 선택하세요',
  error 
}: ClientSelectProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selectedClient = clients.find(c => c.id === value)

  const filteredClients = useMemo(() => {
    if (!search) return clients
    
    const searchLower = search.toLowerCase()
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      client.industry.toLowerCase().includes(searchLower)
    )
  }, [clients, search])

  const handleSelect = (clientId: string) => {
    onChange(clientId)
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Label>{label}</Label>
      
      <div className="relative">
        <Input
          value={selectedClient ? selectedClient.name : search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={error ? 'border-red-500' : ''}
        />
        
        {isOpen && filteredClients.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleSelect(client.id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{client.industry}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* 클릭 외부 영역 감지 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
