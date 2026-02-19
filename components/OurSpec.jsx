'use client'
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'
import { motion } from 'framer-motion'

const OurSpecs = () => {

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.08, duration: 0.4 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-2xl group shadow-sm hover:shadow-lg transition-shadow'
                                style={{ backgroundColor: spec.accent + '08', borderColor: spec.accent + '25' }}
                            >
                                <h3 className='text-slate-800 font-semibold'>{spec.title}</h3>
                                <p className='text-sm text-slate-500 mt-3 leading-relaxed'>{spec.description}</p>
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-xl transition-shadow'
                                    style={{ backgroundColor: spec.accent }}
                                >
                                    <spec.icon size={20} />
                                </motion.div>
                            </motion.div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OurSpecs