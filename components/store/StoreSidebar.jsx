'use client'
import { usePathname } from "next/navigation"
import {
    HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon,
    BarChart3Icon, SettingsIcon, HelpCircleIcon, LogOutIcon, GlobeIcon,
    ChevronLeftIcon, ChevronRightIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"

const StoreSidebar = ({ storeInfo }) => {

    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const mainLinks = [
        { name: 'Dashboard', href: '/store', icon: HomeIcon },
        { name: 'Profile', href: '/store/profile', icon: SettingsIcon },
        { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
        { name: 'Manage Products', href: '/store/manage-product', icon: SquarePenIcon },
        { name: 'Orders', href: '/store/orders', icon: LayoutListIcon },
    ]

    const bottomLinks = [
        { name: 'Visit Store', href: '/shop', icon: GlobeIcon },
        { name: 'Help', href: '#', icon: HelpCircleIcon },
    ]

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-slate-950 flex flex-col shrink-0 overflow-hidden border-r border-white/5 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 opacity-80" />
            {/* Store Branding */}
            <div className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {storeInfo?.logo ? (
                            <Image
                                className="size-10 rounded-xl object-cover shadow-lg ring-2 ring-white/10"
                                src={storeInfo.logo}
                                alt=""
                                width={40}
                                height={40}
                            />
                        ) : (
                            <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                S
                            </div>
                        )}
                    </motion.div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="overflow-hidden"
                            >
                                <p className="text-sm font-semibold text-white truncate max-w-[140px]">{storeInfo?.name || 'My Store'}</p>
                                <p className="text-[10px] text-emerald-400 font-medium">● Active</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-3 h-px bg-white/10" />

            {/* Main Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold px-3 mb-2"
                        >
                            Menu
                        </motion.p>
                    )}
                </AnimatePresence>

                {mainLinks.map((link, index) => {
                    const isActive = pathname === link.href
                    return (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive
                                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <motion.span
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}
                                >
                                    <link.icon size={16} className={isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-white'} />
                                </motion.div>

                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {link.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="px-2 pb-3 space-y-1">
                <div className="mx-1 h-px bg-white/10 mb-2" />

                <AnimatePresence>
                    {!collapsed && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold px-3 mb-2"
                        >
                            Other
                        </motion.p>
                    )}
                </AnimatePresence>

                {bottomLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
                    >
                        <link.icon size={15} />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="whitespace-nowrap"
                                >
                                    {link.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </div>

            {/* Collapse Toggle */}
            <div className="px-2 pb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition text-xs"
                >
                    {collapsed ? <ChevronRightIcon size={16} /> : (
                        <>
                            <ChevronLeftIcon size={14} />
                            <AnimatePresence>
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Collapse
                                </motion.span>
                            </AnimatePresence>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.aside>
    )
}

export default StoreSidebar