'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, Truck, Home, Clock } from 'lucide-react'

const OrderProgressStepper = ({ status }) => {
    const steps = [
        { label: 'Placed', icon: Clock, value: 'ORDER_PLACED' },
        { label: 'Processing', icon: Package, value: 'PROCESSING' },
        { label: 'Shipped', icon: Truck, value: 'SHIPPED' },
        { label: 'Delivered', icon: Home, value: 'DELIVERED' }
    ]

    const currentIndex = steps.findIndex(step => step.value === status)

    return (
        <div className="w-full py-8 px-4">
            <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />

                {/* Active Progress Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 -translate-y-1/2 rounded-full"
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex
                    const isActive = index === currentIndex
                    const Icon = step.icon

                    return (
                        <div key={step.value} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isCompleted || isActive ? '#f97316' : '#fff',
                                    borderColor: isCompleted || isActive ? '#f97316' : '#e2e8f0',
                                    color: isCompleted || isActive ? '#fff' : '#94a3b8'
                                }}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors duration-500`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 size={18} />
                                ) : (
                                    <Icon size={18} />
                                )}
                            </motion.div>
                            <motion.span
                                animate={{
                                    color: isActive ? '#1e293b' : '#94a3b8',
                                    fontWeight: isActive ? 700 : 500
                                }}
                                className="absolute top-12 whitespace-nowrap text-[10px] uppercase tracking-widest"
                            >
                                {step.label}
                            </motion.span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderProgressStepper
