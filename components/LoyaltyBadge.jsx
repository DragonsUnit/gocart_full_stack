'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

const LoyaltyBadge = ({ points }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-md"
        >
            <div className="p-1 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20">
                <Trophy size={12} className="text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Loyalty Points</span>
                <span className="text-xs font-black text-slate-800">{points || 0}</span>
            </div>
        </motion.div>
    )
}

export default LoyaltyBadge
