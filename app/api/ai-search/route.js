import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
})

export async function POST(request) {
    try {
        const { query } = await request.json()

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ suggestions: [] })
        }

        const response = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gemini-2.0-flash',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful ecommerce search assistant. When given a search query, return exactly 5 short, relevant search suggestions that a user might want to search for in an online store. 
                    Return ONLY a JSON array of strings, nothing else. Example: ["wireless headphones", "bluetooth earbuds", "noise cancelling headphones", "gaming headset", "over ear headphones"]`
                },
                {
                    role: 'user',
                    content: `Search query: "${query}"`
                }
            ],
            max_tokens: 200,
            temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content?.trim()

        // Parse the JSON array from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
            return NextResponse.json({ suggestions: [] })
        }

        const suggestions = JSON.parse(jsonMatch[0])
        return NextResponse.json({ suggestions: suggestions.slice(0, 5) })

    } catch (error) {
        console.error('AI Search error:', error)
        return NextResponse.json({ suggestions: [] })
    }
}
