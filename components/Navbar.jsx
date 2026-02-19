'use client'
import { PackageIcon, HeartIcon, ShoppingCart, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"
import SmartSearch from "./SmartSearch";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LoyaltyBadge from "./LoyaltyBadge";

const Navbar = () => {

    const { user } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userData, setUserData] = useState(null)

    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.items.length)

    useEffect(() => {
        if (user) {
            fetch('/api/user/data')
                .then(res => res.json())
                .then(data => setUserData(data.user))
        }
    }, [user])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'About', href: '/' },
        { name: 'Contact', href: '/' },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm"
        >
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    {/* Logo */}
                    <Link href="/" className="relative text-3xl sm:text-4xl font-bold text-slate-800">
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">go</span>
                        cart
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent text-4xl sm:text-5xl leading-0">.</span>
                        <Protect plan='plus'>
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute text-[9px] font-bold -top-1 -right-9 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white tracking-wide"
                            >
                                PLUS
                            </motion.span>
                        </Protect>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-7">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                whileHover={{ y: -2 }}
                            >
                                <Link
                                    href={link.href}
                                    className="relative group text-sm text-slate-600 hover:text-orange-500 transition-colors font-medium"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            </motion.div>
                        ))}

                        {/* AI Smart Search */}
                        <div className="hidden xl:block">
                            <SmartSearch />
                        </div>

                        {/* Wishlist Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/wishlist" className="relative flex items-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors">
                                <HeartIcon size={19} />
                                <AnimatePresence>
                                    {wishlistCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 text-[8px] text-white bg-gradient-to-r from-red-500 to-pink-500 size-4 rounded-full flex items-center justify-center font-bold shadow-md"
                                        >
                                            {wishlistCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>

                        {/* Cart Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors">
                                <ShoppingCart size={19} />
                                <span className="text-sm font-medium">Cart</span>
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 left-3 text-[8px] text-white bg-gradient-to-r from-slate-700 to-slate-900 size-4 rounded-full flex items-center justify-center font-bold shadow"
                                >
                                    {cartCount}
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Auth */}
                        {!user ? (
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={openSignIn}
                                className="px-7 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
                            >
                                Login
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-5">
                                <Protect plan='plus'>
                                    <LoyaltyBadge points={userData?.loyaltyPoints} />
                                </Protect>
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                        <UserButton.Action labelIcon={<HeartIcon size={16} />} label="Wishlist" onClick={() => router.push('/wishlist')} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </div>
                        )}
                    </div>

                    {/* Mobile Actions */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Protect plan='plus'>
                            <LoyaltyBadge points={userData?.loyaltyPoints} />
                        </Protect>
                        {/* Mobile Wishlist */}
                        <Link href="/wishlist" className="relative">
                            <HeartIcon size={20} className="text-slate-600" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-red-500 size-3.5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        {/* Mobile Cart */}
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={20} className="text-slate-600" />
                            <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount}</span>
                        </Link>
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<ShoppingCart size={16} />} label="Cart" onClick={() => router.push('/cart')} />
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                    <UserButton.Action labelIcon={<HeartIcon size={16} />} label="Wishlist" onClick={() => router.push('/wishlist')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button onClick={openSignIn} className="px-6 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-sm text-white rounded-xl font-medium">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </motion.nav>
    )
}

export default Navbar