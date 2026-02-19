'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'
import Title from './Title'

const RecommendationCarousel = ({ productId, category }) => {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await axios.get(`/api/products/recommendations?productId=${productId}&category=${category}`)
                setRecommendations(data.recommendations)
            } catch (error) {
                console.error("Failed to fetch recommendations", error)
            } finally {
                setLoading(false)
            }
        }

        if (productId && category) {
            fetchRecommendations()
        }
    }, [productId, category])

    if (loading || recommendations.length === 0) return null

    return (
        <div className="py-20">
            <Title heading="You Might Also Like" text="Top rated products in this category" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10"
            >
                {recommendations.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </motion.div>
        </div>
    )
}

export default RecommendationCarousel
