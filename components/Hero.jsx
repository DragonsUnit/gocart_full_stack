'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { motion } from 'framer-motion'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>

                {/* Main Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className='relative flex-1 flex flex-col bg-white overflow-hidden rounded-[2.5rem] border border-slate-200/50 shadow-2xl'
                >
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 opacity-70" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-40 -right-40 size-96 rounded-full bg-orange-200/40 blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 50, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 -left-20 size-80 rounded-full bg-amber-200/30 blur-[80px]"
                    />

                    <div className='p-8 sm:p-20 relative z-10'>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-xs sm:text-sm font-medium text-orange-600 mb-6'
                        >
                            <span className='relative flex h-2 w-2'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75'></span>
                                <span className='relative inline-flex rounded-full h-2 w-2 bg-orange-500'></span>
                            </span>
                            New Travel Season 2026
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className='text-4xl sm:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight max-w-2xl'
                        >
                            Adventure <span className='text-orange-500 italic font-serif'>awaits</span> you.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className='text-slate-500 text-lg sm:text-xl mt-6 max-w-lg leading-relaxed'
                        >
                            Equip yourself with the world's best travel gear. Designed for the bold, built for the journey.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap items-center gap-4 mt-10"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, shadow: "0 20px 25px -5px rgb(249 115 22 / 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                className='bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all'
                            >
                                Shop Gears
                            </motion.button>
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 text-slate-600 font-semibold px-6 py-5 group"
                            >
                                View Lookbook <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className='sm:absolute bottom-0 right-0 lg:right-10 w-full sm:max-w-md pointer-events-none'
                    >
                        <Image className='w-full' src={assets.hero_model_img} alt="" />
                    </motion.div>
                </motion.div>

                {/* Side Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-6 w-full xl:max-w-sm'>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ y: -8 }}
                        className='flex-1 relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 group cursor-pointer shadow-xl'
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
                        <div className="relative z-10">
                            <p className='text-3xl font-black text-white leading-tight'>Global<br />Shipping</p>
                            <span className='mt-4 inline-flex items-center gap-2 text-orange-400 text-sm font-bold'>
                                Explore <ArrowRightIcon size={16} />
                            </span>
                        </div>
                        <Image className='absolute -bottom-4 -right-4 w-40 opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500' src={assets.hero_product_img1} alt="" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ y: -8 }}
                        className='flex-1 relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 group cursor-pointer shadow-sm hover:shadow-2xl transition-all'
                    >
                        <div className="relative z-10">
                            <p className='text-3xl font-black text-slate-900 leading-tight'>Weekly<br />Offers</p>
                            <span className='mt-4 inline-flex items-center gap-2 text-slate-500 text-sm font-bold'>
                                Save 20% <ArrowRightIcon size={16} />
                            </span>
                        </div>
                        <Image className='absolute -bottom-4 -right-4 w-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500' src={assets.hero_product_img2} alt="" />
                    </motion.div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero