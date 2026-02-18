'use client'
import Image from "next/image";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import { CheckCircleIcon, CircleIcon, PackageIcon, TruckIcon, ShoppingBagIcon } from "lucide-react";

const ORDER_STEPS = [
    { key: 'ORDER_PLACED', label: 'Order Placed', icon: ShoppingBagIcon },
    { key: 'PROCESSING', label: 'Processing', icon: PackageIcon },
    { key: 'SHIPPED', label: 'Shipped', icon: TruckIcon },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircleIcon },
]

const STATUS_COLORS = {
    ORDER_PLACED: 'text-blue-500 bg-blue-100',
    PROCESSING: 'text-yellow-600 bg-yellow-100',
    SHIPPED: 'text-purple-600 bg-purple-100',
    DELIVERED: 'text-green-600 bg-green-100',
}

const OrderTimeline = ({ status }) => {
    const currentIndex = ORDER_STEPS.findIndex(s => s.key === status)

    return (
        <div className="flex items-center gap-0 mt-3 mb-1">
            {ORDER_STEPS.map((step, index) => {
                const isDone = index <= currentIndex
                const isCurrent = index === currentIndex
                const Icon = step.icon

                return (
                    <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={`size-7 rounded-full flex items-center justify-center transition-all ${isDone
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-100 text-slate-300'
                                } ${isCurrent ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
                                <Icon size={13} />
                            </div>
                            <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${isDone ? 'text-green-600' : 'text-slate-300'}`}>
                                {step.label}
                            </span>
                        </div>
                        {index < ORDER_STEPS.length - 1 && (
                            <div className={`h-0.5 w-8 sm:w-12 mx-0.5 mb-3 transition-all ${index < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'text-slate-500 bg-slate-100'}`}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {order.status.split('_').join(' ')}
                    </div>
                    {/* Timeline */}
                    <OrderTimeline status={order.status} />
                </td>
            </tr>

            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'text-slate-500 bg-slate-100'}`}>
                            <span className="size-1.5 rounded-full bg-current" />
                            {order.status.replace(/_/g, ' ')}
                        </span>
                        <OrderTimeline status={order.status} />
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem