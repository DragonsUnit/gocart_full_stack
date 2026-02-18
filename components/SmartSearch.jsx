'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, SparklesIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const SmartSearch = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const debounceRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([])
            setOpen(false)
            return
        }

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const { data } = await axios.post('/api/ai-search', { query })
                setSuggestions(data.suggestions || [])
                setOpen(true)
            } catch {
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(debounceRef.current)
    }, [query])

    const handleSearch = (term) => {
        setOpen(false)
        setQuery(term)
        router.push(`/shop?search=${encodeURIComponent(term)}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) handleSearch(query.trim())
    }

    return (
        <div className='relative'>
            <form onSubmit={handleSubmit} className='flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full'>
                <Search size={18} className='text-slate-500 shrink-0' />
                <input
                    ref={inputRef}
                    className='w-full bg-transparent outline-none placeholder-slate-500 text-slate-700'
                    type='text'
                    placeholder='Search products...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setOpen(true)}
                />
                {query && (
                    <button type='button' onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }}>
                        <XIcon size={14} className='text-slate-400 hover:text-slate-600' />
                    </button>
                )}
                {loading && (
                    <div className='size-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin shrink-0' />
                )}
            </form>

            {/* Suggestions Dropdown */}
            {open && suggestions.length > 0 && (
                <div className='absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden'>
                    <div className='flex items-center gap-1.5 px-3 py-2 border-b border-slate-100'>
                        <SparklesIcon size={12} className='text-green-500' />
                        <span className='text-[10px] text-slate-400 font-medium uppercase tracking-wide'>AI Suggestions</span>
                    </div>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSearch(s)}
                            className='w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors'
                        >
                            <Search size={13} className='text-slate-300' />
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SmartSearch
