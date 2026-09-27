'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Term = {
  id: number
  english: string
  spanish: string
  category: string
  definition_en: string
  definition_es: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Term[]>([])
  const [searched, setSearched] = useState(false)
  const isEmptySearchQuery = query.trim().length === 0;

  async function search(e: React.FormEvent) {
    e.preventDefault()
  
    const { data } = await supabase
      .from('terms')
      .select('*')
      // Search for terms where either the English or Spanish field contains the query
      .or(`english.ilike.%${query}%,spanish.ilike.%${query}%`)
    console.log("Search results:", data)
    setResults(data ?? [])
    setSearched(true)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Léxico</h1>
        <p className="text-zinc-400 mb-8">Bilingual English–Spanish legal glossary</p>

        <form onSubmit={search} className="flex gap-2 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in English or Spanish…"
            className="flex-1 px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-zinc-500"
          />
          <button className="px-6 py-2 rounded bg-white text-black font-medium" disabled={isEmptySearchQuery}>
            Search
          </button>
        </form>

        {searched && results.length === 0 && (
          <p className="text-zinc-500">No terms found yet — add some below.</p>
        )}

        <div className="space-y-4">
          {results.map((t) => (
            <div key={t.id} className="p-4 rounded border border-zinc-800 bg-zinc-900">
              <div className="flex justify-between items-baseline gap-4">
                <h2 className="text-xl font-semibold">{t.english}</h2>
                <span className="text-xl text-right">{t.spanish}</span>
              </div>
              {t.category && (
                <p className="text-xs text-zinc-500 mt-1 uppercase">{t.category}</p>
              )}
              {t.definition_en && <p className="text-zinc-400 mt-2">{t.definition_en}</p>}
              {t.definition_es && <p className="text-zinc-400">{t.definition_es}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
