'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { ZapIcon, ClockIcon, ArrowRightIcon, FlameIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FlashSale = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const products = useSelector(state => state.product.list)

    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)
            const diff = endOfDay - now

            return {
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            }
        }

        setTimeLeft(calculateTimeLeft())
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
        return () => clearInterval(timer)
    }, [])

    const flashProducts = products
        .filter(p => p.inStock && p.mrp > p.price)
        .sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp))
        .slice(0, 4)

    if (flashProducts.length === 0) return null

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className='mx-6 my-16'
        >
            <div className='max-w-7xl mx-auto bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl relative'>

                {/* Decorative elements */}
                <div className="absolute -top-32 -right-32 size-80 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-amber-500/10 blur-3xl" />

                <div className='relative z-10 p-8 sm:p-12'>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10'>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className='flex items-center gap-2 mb-2'
                            >
                                <div className='p-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg'>
                                    <ZapIcon size={14} className='text-white' />
                                </div>
                                <span className='text-orange-400 text-xs font-bold tracking-widest uppercase'>Flash Sale</span>
                            </motion.div>
                            <h2 className='text-2xl sm:text-3xl font-bold text-white'>Deals of the Day</h2>
                            <p className='text-slate-400 text-sm mt-1'>Grab them before they're gone!</p>
                        </div>

                        {/* Timer */}
                        <div className='flex items-center gap-3'>
                            <ClockIcon size={16} className='text-orange-400' />
                            <div className='flex gap-2'>
                                {[
                                    { value: timeLeft.hours, label: 'Hrs' },
                                    { value: timeLeft.minutes, label: 'Min' },
                                    { value: timeLeft.seconds, label: 'Sec' },
                                ].map((t, i) => (
                                    <div key={i} className='text-center'>
                                        <motion.div
                                            key={t.value}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className='bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 min-w-[50px]'
                                        >
                                            <span className='text-lg font-bold text-white font-mono'>
                                                {String(t.value).padStart(2, '0')}
                                            </span>
                                        </motion.div>
                                        <p className='text-[10px] text-slate-500 mt-1'>{t.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        {flashProducts.map((product, index) => {
                            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
                            const claimed = Math.floor(Math.random() * 40) + 55 // Mock progress

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -6 }}
                                >
                                    <Link
                                        href={`/product/${product.id}`}
                                        className='block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group'
                                    >
                                        {/* Image */}
                                        <div className='relative bg-white/5 rounded-xl p-4 mb-3 flex items-center justify-center h-32'>
                                            <span className='absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1'>
                                                <FlameIcon size={10} /> -{discount}%
                                            </span>
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                                className='max-h-24 w-auto group-hover:scale-110 transition-transform duration-500'
                                            />
                                        </div>

                                        {/* Info */}
                                        <p className='text-white text-sm font-semibold line-clamp-1 mb-1'>{product.name}</p>
                                        <div className='flex items-end gap-2 mb-3'>
                                            <span className='text-orange-400 font-bold text-lg'>{currency}{product.price}</span>
                                            <span className='text-slate-500 text-xs line-through mb-0.5'>{currency}{product.mrp}</span>
                                        </div>

                                        {/* Progress */}
                                        <div>
                                            <div className='flex justify-between text-[10px] text-slate-400 mb-1'>
                                                <span>Claimed</span>
                                                <span className='text-orange-400 font-medium'>{claimed}%</span>
                                            </div>
                                            <div className='h-1.5 bg-white/10 rounded-full overflow-hidden'>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${claimed}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: index * 0.15 }}
                                                    className='h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full'
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Footer Link */}
                    <div className='mt-8 text-center'>
                        <Link
                            href='/shop'
                            className='inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition group'
                        >
                            View All Deals
                            <ArrowRightIcon size={14} className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default FlashSale
