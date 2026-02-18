'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, SlidersHorizontalIcon, GridIcon, ListIcon, XIcon, ChevronDownIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rated', value: 'rating' },
    { label: 'Biggest Discount', value: 'discount' },
]

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortBy, setSortBy] = useState('newest')
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
    const [showFilters, setShowFilters] = useState(false)

    // Get unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
        return cats.sort()
    }, [products])

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange({ min: '', max: '' })
        setSortBy('newest')
    }

    const activeFilterCount = selectedCategories.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0)

    // Apply filters + sort
    const filteredProducts = useMemo(() => {
        let result = [...products]

        // Search filter
        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        }

        // Category filter
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category))
        }

        // Price filter
        if (priceRange.min !== '') {
            result = result.filter(p => p.price >= Number(priceRange.min))
        }
        if (priceRange.max !== '') {
            result = result.filter(p => p.price <= Number(priceRange.max))
        }

        // Sort
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price)
                break
            case 'price_desc':
                result.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                result.sort((a, b) => {
                    const rA = a.rating.length ? a.rating.reduce((s, r) => s + r.rating, 0) / a.rating.length : 0
                    const rB = b.rating.length ? b.rating.reduce((s, r) => s + r.rating, 0) / b.rating.length : 0
                    return rB - rA
                })
                break
            case 'discount':
                result.sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp))
                break
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
        }

        return result
    }, [products, search, selectedCategories, priceRange, sortBy])

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className="min-h-[70vh] mx-6 py-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h1
                        onClick={() => router.push('/shop')}
                        className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"
                    >
                        {search && <MoveLeftIcon size={20} />}
                        All <span className="text-slate-700 font-medium">Products</span>
                        <span className="text-sm text-slate-400 font-normal ml-1">({filteredProducts.length})</span>
                    </h1>

                    <div className="flex items-center gap-3">
                        {/* Filter toggle (mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition lg:hidden"
                        >
                            <SlidersHorizontalIcon size={15} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-green-500 text-white text-[10px] size-4 rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="appearance-none text-sm text-slate-600 border border-slate-200 px-3 py-2 pr-8 rounded-lg bg-white hover:bg-slate-50 transition cursor-pointer outline-none"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDownIcon size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* View mode */}
                        <div className="hidden sm:flex border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <GridIcon size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <ListIcon size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCategories.map(cat => (
                            <span key={cat} className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                                {cat}
                                <button onClick={() => toggleCategory(cat)}><XIcon size={11} /></button>
                            </span>
                        ))}
                        {priceRange.min && (
                            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                                Min: {currency}{priceRange.min}
                                <button onClick={() => setPriceRange(p => ({ ...p, min: '' }))}><XIcon size={11} /></button>
                            </span>
                        )}
                        {priceRange.max && (
                            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                                Max: {currency}{priceRange.max}
                                <button onClick={() => setPriceRange(p => ({ ...p, max: '' }))}><XIcon size={11} /></button>
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-slate-600 underline">Clear all</button>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Sidebar Filters — desktop always visible, mobile toggle */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-56 shrink-0`}>
                        <div className="sticky top-6 space-y-6">

                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="accent-green-500 size-4 rounded"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition capitalize">{cat}</span>
                                        </label>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="text-xs text-slate-400">No categories found</p>
                                    )}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 transition"
                                    />
                                    <span className="text-slate-400 text-sm">–</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 transition"
                                    />
                                </div>
                            </div>

                            {/* In Stock Only */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Availability</h3>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" className="accent-green-500 size-4" />
                                    <span className="text-sm text-slate-600">In Stock Only</span>
                                </label>
                            </div>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full text-sm text-slate-500 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 transition"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <p className="text-slate-400 text-lg mb-2">No products found</p>
                                <p className="text-slate-300 text-sm mb-4">Try adjusting your filters or search term</p>
                                <button onClick={clearFilters} className="text-sm text-green-600 hover:underline">Clear all filters</button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-8 mb-32">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="flex flex-col gap-3 mb-32">
                                {filteredProducts.map((product) => {
                                    const currency2 = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
                                    const discount = product.mrp > product.price
                                        ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
                                    return (
                                        <a key={product.id} href={`/product/${product.id}`}
                                            className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl p-3 hover:shadow-md transition-shadow"
                                        >
                                            <div className="bg-slate-50 rounded-lg size-20 flex items-center justify-center shrink-0">
                                                <img src={product.images[0]} alt={product.name} className="max-h-16 w-auto object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 text-sm truncate">{product.name}</p>
                                                <p className="text-xs text-slate-400 capitalize mt-0.5">{product.category}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-slate-800">{currency2}{product.price}</p>
                                                {discount > 0 && (
                                                    <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">-{discount}%</span>
                                                )}
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-slate-400">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}