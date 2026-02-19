'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const StoreLayout = ({ children }) => {

    const { getToken } = useAuth()

    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const fetchIsSeller = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/is-seller', { headers: { Authorization: `Bearer ${token}` } })
            setIsSeller(data.isSeller)
            setStoreInfo(data.storeInfo)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [])

    return loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loading />
        </div>
    ) : isSeller ? (
        <div className="flex flex-col h-screen bg-[#f8f9fb]">
            <SellerNavbar />
            <div className="flex flex-1 overflow-hidden">
                <SellerSidebar storeInfo={storeInfo} />
                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex-1 overflow-y-auto p-5 lg:p-8"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-slate-50 to-white">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="max-w-md"
            >
                <div className="size-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-200/50">
                    <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Seller Access Required</h1>
                <p className="text-slate-500 mb-8">You need a store account to access the seller dashboard. Create your store or return to shopping.</p>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                    <Link href="/create-store" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-2 px-8 py-3 rounded-xl font-medium shadow-lg shadow-orange-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Create Store
                    </Link>
                    <Link href="/" className="text-slate-600 flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                        Go Home <ArrowRightIcon size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default StoreLayout