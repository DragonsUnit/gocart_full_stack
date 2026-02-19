'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import RatingModal from "./RatingModal"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')
    const { getToken, userId } = useAuth()
    const [isEligible, setIsEligible] = useState(false)
    const [orderId, setOrderId] = useState(null)
    const [ratingModal, setRatingModal] = useState(null)

    const checkEligibility = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(`/api/products/review-status?productId=${product.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setIsEligible(data.eligible)
            setOrderId(data.orderId)
        } catch (error) {
            console.error("Error checking review eligibility", error)
        }
    }

    useEffect(() => {
        if (userId) {
            checkEligibility()
        }
    }, [userId, product.id])

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-14">
                    {isEligible && (
                        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-emerald-900 font-semibold text-lg">You purchased this item! 📦</p>
                                <p className="text-emerald-700 text-xs mt-1">Share your experience to help other travelers.</p>
                            </div>
                            <button
                                onClick={() => setRatingModal({ productId: product.id, orderId })}
                                className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
                            >
                                Write a Review
                            </button>
                        </div>
                    )}
                    {product.rating.length === 0 ? (
                        <div className="py-20 text-center text-slate-300">
                            <StarIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        product.rating.map((item, index) => (
                            <div key={index} className="flex gap-5 mb-10">
                                <Image src={item.user.image} alt="" className="size-10 rounded-full" width={100} height={100} />
                                <div>
                                    <div className="flex items-center" >
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={18} className='text-transparent mt-0.5' fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                    <p className="text-sm max-w-lg my-4">{item.review}</p>
                                    <p className="font-medium text-slate-800">{item.user.name}</p>
                                    <p className="mt-3 font-light">{new Date(item.createdAt).toDateString()}</p>
                                </div>
                            </div>
                        )))}
                </div>
            )}

            {/* Store Page */}
            <div className="flex gap-3 mt-14">
                <Image src={product.store.logo} alt="" className="size-11 rounded-full ring ring-slate-400" width={100} height={100} />
                <div>
                    <p className="font-medium text-slate-600">Product by {product.store.name}</p>
                    <Link href={`/shop/${product.store.username}`} className="flex items-center gap-1.5 text-green-500"> view store <ArrowRight size={14} /></Link>
                </div>
            </div>

            {/* Rating Modal */}
            {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
        </div>
    )
}

export default ProductDescription