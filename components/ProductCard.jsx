'use client'
import { HeartIcon, ShoppingCartIcon, StarIcon, EyeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const cartItems = useSelector(state => state.cart.cartItems)

    const isWishlisted = wishlistItems.includes(product.id)
    const inCart = !!cartItems[product.id]

    const rating = product.rating.length > 0
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0;

    const discountPercent = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    const handleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleWishlist({ productId: product.id }))
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group"
        >
            <Link href={`/product/${product.id}`} className='relative block'>
                <div className='relative glass-morphism rounded-3xl flex items-center justify-center overflow-hidden h-64 sm:h-72 ring-1 ring-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:shadow-2xl group-hover:bg-white/50 transition-all duration-500'>

                    {/* Discount Badge */}
                    <AnimatePresence>
                        {discountPercent > 0 && (
                            <motion.span
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className='absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20'
                            >
                                {discountPercent}% OFF
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                        <div className='absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex items-center justify-center'>
                            <span className='text-xs font-bold text-slate-600 border border-slate-200 px-5 py-2 rounded-full bg-white/90 shadow-xl uppercase tracking-wider'>
                                Sold Out
                            </span>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className='absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out'>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWishlist}
                            className='w-10 h-10 rounded-full glass-morphism flex items-center justify-center shadow-lg'
                        >
                            <HeartIcon
                                size={18}
                                className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-600'}
                            />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                            whileTap={{ scale: 0.9 }}
                            className='w-10 h-10 rounded-full glass-morphism flex items-center justify-center shadow-lg'
                        >
                            <EyeIcon size={18} className='text-slate-600' />
                        </motion.button>
                    </div>

                    {/* Product Image */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className='relative w-4/5 h-4/5 flex items-center justify-center'
                    >
                        <Image
                            width={400}
                            height={400}
                            className='object-contain w-full h-full drop-shadow-2xl'
                            src={product.images[0]}
                            alt={product.name}
                        />
                    </motion.div>

                    {/* Quick Add Button */}
                    {product.inStock && (
                        <motion.button
                            onClick={handleAddToCart}
                            initial={false}
                            className='absolute bottom-0 left-0 right-0 py-4 bg-slate-900/90 backdrop-blur-xl text-white text-xs font-bold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out'
                        >
                            <ShoppingCartIcon size={16} />
                            {inCart ? 'IN CART' : 'ADD TO CART'}
                        </motion.button>
                    )}
                </div>

                {/* Content Section */}
                <div className='mt-5 px-1'>
                    <div className='flex justify-between items-start gap-3'>
                        <div className='flex-1'>
                            <h3 className='text-slate-900 font-bold text-base line-clamp-1 group-hover:text-orange-600 transition-colors'>
                                {product.name}
                            </h3>
                            <div className='flex items-center gap-1.5 mt-1.5'>
                                <div className='flex'>
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            size={12}
                                            className={i < rating ? "text-orange-400 fill-orange-400" : "text-slate-200"}
                                        />
                                    ))}
                                </div>
                                <span className='text-[11px] font-medium text-slate-400 tracking-tight'>
                                    ({product.rating.length} Reviews)
                                </span>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-lg font-black text-slate-900 leading-none'>
                                {currency}{product.price}
                            </p>
                            {product.mrp > product.price && (
                                <p className='text-xs font-medium text-slate-400 line-through mt-1 opacity-70'>
                                    {currency}{product.mrp}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProductCard