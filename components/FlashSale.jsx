'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { ClockIcon, ZapIcon } from 'lucide-react'

const FlashSale = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const products = useSelector(state => state.product.list)

    // Get top 4 products with highest discount %
    const saleProducts = [...products]
        .filter(p => p.mrp > p.price && p.inStock)
        .sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp))
        .slice(0, 4)

    // Countdown timer — resets every 24h from midnight
    const getTimeLeft = () => {
        const now = new Date()
        const midnight = new Date()
        midnight.setHours(24, 0, 0, 0)
        const diff = midnight - now
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        return { h, m, s }
    }

    const [timeLeft, setTimeLeft] = useState(getTimeLeft())

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (saleProducts.length === 0) return null

    const pad = (n) => String(n).padStart(2, '0')

    return (
        <div className='px-6 my-20 max-w-7xl mx-auto'>
            {/* Header */}
            <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold'>
                        <ZapIcon size={14} fill='white' />
                        FLASH SALE
                    </div>
                    <h2 className='text-2xl font-semibold text-slate-800'>Today's Best Deals</h2>
                </div>

                {/* Countdown */}
                <div className='flex items-center gap-2 text-slate-600'>
                    <ClockIcon size={16} className='text-red-500' />
                    <span className='text-sm'>Ends in:</span>
                    <div className='flex items-center gap-1'>
                        {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((unit, i) => (
                            <span key={i} className='flex items-center gap-1'>
                                <span className='bg-slate-800 text-white text-sm font-mono font-bold px-2.5 py-1 rounded-md min-w-[2.2rem] text-center'>
                                    {unit}
                                </span>
                                {i < 2 && <span className='text-slate-500 font-bold'>:</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {saleProducts.map((product) => {
                    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
                    return (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className='group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200/60'
                        >
                            {/* Discount Badge */}
                            <div className='absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10'>
                                -{discount}%
                            </div>

                            {/* Product Image */}
                            <div className='flex items-center justify-center h-32 mb-3'>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={120}
                                    height={120}
                                    className='max-h-28 w-auto object-contain group-hover:scale-105 transition-transform duration-300'
                                />
                            </div>

                            {/* Info */}
                            <p className='text-sm font-medium text-slate-700 line-clamp-2 mb-2'>{product.name}</p>

                            <div className='flex items-baseline gap-2'>
                                <span className='text-base font-bold text-slate-800'>{currency}{product.price}</span>
                                <span className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</span>
                            </div>

                            {/* Progress bar (fake urgency) */}
                            <div className='mt-3'>
                                <div className='flex justify-between text-[10px] text-slate-400 mb-1'>
                                    <span>Selling fast!</span>
                                    <span>{Math.floor(Math.random() * 30 + 10)} left</span>
                                </div>
                                <div className='h-1.5 bg-slate-200 rounded-full overflow-hidden'>
                                    <div
                                        className='h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full'
                                        style={{ width: `${Math.floor(Math.random() * 40 + 50)}%` }}
                                    />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default FlashSale
