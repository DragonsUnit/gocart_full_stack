'use client'
import { HeartIcon, ShoppingCartIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const cartItems = useSelector(state => state.cart.cartItems)

    const isWishlisted = wishlistItems.includes(product.id)
    const inCart = !!cartItems[product.id]

    // calculate the average rating of the product
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
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto relative'>
            <div className='relative bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden'>
                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <span className='absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>
                        -{discountPercent}%
                    </span>
                )}

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                    <div className='absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg'>
                        <span className='text-xs font-semibold text-slate-500 border border-slate-300 px-3 py-1 rounded-full'>Out of Stock</span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className='absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition opacity-0 group-hover:opacity-100'
                >
                    <HeartIcon
                        size={14}
                        className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-400'}
                    />
                </button>

                {/* Product Image */}
                <Image
                    width={500}
                    height={500}
                    className='max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition duration-300'
                    src={product.images[0]}
                    alt={product.name}
                />

                {/* Quick Add to Cart */}
                {product.inStock && (
                    <button
                        onClick={handleAddToCart}
                        className='absolute bottom-0 left-0 right-0 bg-slate-800 text-white text-xs py-2 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300'
                    >
                        <ShoppingCartIcon size={12} />
                        {inCart ? 'In Cart ✓' : 'Quick Add'}
                    </button>
                )}
            </div>

            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p className='font-medium line-clamp-1'>{product.name}</p>
                    <div className='flex items-center gap-1 mt-0.5'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={12} className='text-transparent' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                        <span className='text-[10px] text-slate-400 ml-1'>({product.rating.length})</span>
                    </div>
                </div>
                <div className='text-right shrink-0'>
                    <p className='font-semibold'>{currency}{product.price}</p>
                    {product.mrp > product.price && (
                        <p className='text-[11px] text-slate-400 line-through'>{currency}{product.mrp}</p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard