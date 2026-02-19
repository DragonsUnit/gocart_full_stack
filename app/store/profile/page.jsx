'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import { CameraIcon, StoreIcon, MailIcon, PhoneIcon, MapPinIcon, InfoIcon, SaveIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SellerProfile() {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [storeInfo, setStoreInfo] = useState({
        name: '',
        description: '',
        address: '',
        logo: '',
        email: '',
        contact: ''
    })

    const fetchStoreInfo = async () => {
        try {
            const token = await getToken()
            const res = await axios.get('/api/store/is-seller', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStoreInfo(res.data.storeInfo)
        } catch (error) {
            toast.error("Failed to load store information")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStoreInfo()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = await getToken()
            const res = await axios.post('/api/store/update', storeInfo, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                toast.success("Profile updated successfully")
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <StoreIcon className="text-orange-500" />
                    Store Profile
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage your public store information and branding.</p>
            </motion.div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-8"
                >
                    <div className="relative group">
                        <div className="size-32 rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-200 group-hover:border-orange-500 transition-colors">
                            {storeInfo.logo ? (
                                <img src={storeInfo.logo} alt="Store Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <StoreIcon size={48} />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            className="absolute -bottom-2 -right-2 p-2.5 bg-orange-500 text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-colors group-hover:scale-110"
                        >
                            <CameraIcon size={18} />
                        </button>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-slate-800">Store Logo</h3>
                        <p className="text-sm text-slate-500 mt-1">Enhance your brand visibility with a high-quality logo. PNG or JPG recommended.</p>
                        <input
                            type="text"
                            placeholder="Logo URL (temporary placeholder for upload)"
                            className="mt-4 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all"
                            value={storeInfo.logo}
                            onChange={(e) => setStoreInfo({ ...storeInfo, logo: e.target.value })}
                        />
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Basic Info */}
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                            <InfoIcon size={18} className="text-orange-500" />
                            Basic Information
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Store Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all"
                                value={storeInfo.name}
                                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all resize-none"
                                value={storeInfo.description}
                                onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                            <PhoneIcon size={18} className="text-orange-500" />
                            Contact Details
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <MailIcon size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all"
                                value={storeInfo.email}
                                onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <PhoneIcon size={14} /> Contact Number
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all"
                                value={storeInfo.contact}
                                onChange={(e) => setStoreInfo({ ...storeInfo, contact: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <MapPinIcon size={14} /> Shop Address
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-orange-500 outline-none text-sm transition-all"
                                value={storeInfo.address}
                                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Footer Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-end gap-4"
                >
                    <button
                        type="button"
                        onClick={fetchStoreInfo}
                        className="px-6 py-3 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <SaveIcon size={18} />
                                Save Profile
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </div>
    )
}
