'use client'
import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { BellIcon, SearchIcon, MenuIcon, GlobeIcon } from "lucide-react"
import { motion } from "framer-motion"

const StoreNavbar = () => {

    const { user } = useUser()

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between px-6 lg:px-10 py-3 bg-white border-b border-slate-100 backdrop-blur-sm"
        >
            {/* Left — Logo */}
            <div className="flex items-center gap-4">
                <Link href="/store" className="relative text-2xl lg:text-3xl font-bold text-slate-800">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">go</span>
                    cart
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">.</span>
                    <span className="absolute -top-1 -right-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white tracking-wide">
                        SELLER
                    </span>
                </Link>
            </div>

            {/* Center — Search (desktop only) */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-80 transition-all focus-within:border-orange-300 focus-within:bg-white focus-within:shadow-sm">
                <SearchIcon size={16} className="text-slate-400" />
                <input
                    className="bg-transparent w-full text-sm outline-none placeholder-slate-400 text-slate-700"
                    placeholder="Search orders, products, customers..."
                />
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
                {/* Store link */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 border border-slate-200 px-3 py-2 rounded-xl transition hover:border-orange-200"
                    >
                        <GlobeIcon size={13} />
                        Visit Store
                    </Link>
                </motion.div>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition"
                >
                    <BellIcon size={17} className="text-slate-500" />
                    <span className="absolute top-2 right-2 size-2 bg-orange-500 rounded-full ring-2 ring-white" />
                </motion.button>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-slate-700">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[10px] text-slate-400">Seller Account</p>
                    </div>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'w-9 h-9 ring-2 ring-orange-200'
                            }
                        }}
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default StoreNavbar