'use client'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import { HeartOffIcon, ShoppingCartIcon, StarIcon, TrashIcon } from 'lucide-react'

export default function WishlistPage() {
    const dispatch = useDispatch()
    const wishlistIds = useSelector(state => state.wishlist.items)
    const products = useSelector(state => state.product.list)
    const cartItems = useSelector(state => state.cart.cartItems)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const wishlistProducts = products.filter(p => wishlistIds.includes(p.id))

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist({ productId }))
    }

    const handleMoveToCart = (productId) => {
        dispatch(addToCart({ productId }))
        dispatch(removeFromWishlist({ productId }))
    }

    return (
        <div className='min-h-[70vh] mx-6 py-10'>
            <div className='max-w-5xl mx-auto'>
                <h1 className='text-2xl font-semibold text-slate-800 mb-2'>
                    My <span className='text-red-500'>Wishlist</span>
                </h1>
                <p className='text-slate-500 text-sm mb-8'>{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>

                {wishlistProducts.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-24 text-center'>
                        <HeartOffIcon size={56} className='text-slate-200 mb-4' />
                        <p className='text-slate-500 text-lg font-medium mb-2'>Your wishlist is empty</p>
                        <p className='text-slate-400 text-sm mb-6'>Save items you love by clicking the heart icon on any product</p>
                        <Link href='/shop' className='bg-slate-800 text-white px-8 py-2.5 rounded-full text-sm hover:bg-slate-900 transition'>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {wishlistProducts.map(product => {
                            const rating = product.rating.length > 0
                                ? Math.round(product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length)
                                : 0
                            const discount = product.mrp > product.price
                                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                                : 0
                            const inCart = !!cartItems[product.id]

                            return (
                                <div key={product.id} className='bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow'>
                                    {/* Image */}
                                    <Link href={`/product/${product.id}`}>
                                        <div className='relative bg-slate-50 rounded-xl flex items-center justify-center h-44 mb-4 overflow-hidden group'>
                                            {discount > 0 && (
                                                <span className='absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                                    -{discount}%
                                                </span>
                                            )}
                                            {!product.inStock && (
                                                <div className='absolute inset-0 bg-white/70 flex items-center justify-center'>
                                                    <span className='text-xs text-slate-500 border border-slate-300 px-3 py-1 rounded-full'>Out of Stock</span>
                                                </div>
                                            )}
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={160}
                                                height={160}
                                                className='max-h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300'
                                            />
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <Link href={`/product/${product.id}`}>
                                        <p className='font-medium text-slate-800 line-clamp-2 text-sm mb-1'>{product.name}</p>
                                    </Link>

                                    <div className='flex items-center gap-0.5 mb-2'>
                                        {Array(5).fill('').map((_, i) => (
                                            <StarIcon key={i} size={11} className='text-transparent' fill={rating >= i + 1 ? '#00C950' : '#E5E7EB'} />
                                        ))}
                                        <span className='text-[10px] text-slate-400 ml-1'>({product.rating.length})</span>
                                    </div>

                                    <div className='flex items-baseline gap-2 mb-4'>
                                        <span className='text-base font-bold text-slate-800'>{currency}{product.price}</span>
                                        {product.mrp > product.price && (
                                            <span className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleMoveToCart(product.id)}
                                            disabled={!product.inStock}
                                            className='flex-1 flex items-center justify-center gap-1.5 bg-slate-800 text-white text-xs py-2 rounded-lg hover:bg-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed'
                                        >
                                            <ShoppingCartIcon size={13} />
                                            {inCart ? 'In Cart ✓' : 'Move to Cart'}
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className='p-2 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition'
                                        >
                                            <TrashIcon size={14} className='text-slate-400 hover:text-red-400' />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
