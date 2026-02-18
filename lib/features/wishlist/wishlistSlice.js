import { createSlice } from '@reduxjs/toolkit'

const loadFromStorage = () => {
    try {
        const saved = localStorage.getItem('gocart_wishlist')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const saveToStorage = (items) => {
    try {
        localStorage.setItem('gocart_wishlist', JSON.stringify(items))
    } catch { }
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [], // array of product IDs
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const { productId } = action.payload
            const index = state.items.indexOf(productId)
            if (index === -1) {
                state.items.push(productId)
            } else {
                state.items.splice(index, 1)
            }
            saveToStorage(state.items)
        },
        loadWishlist: (state) => {
            state.items = loadFromStorage()
        },
        removeFromWishlist: (state, action) => {
            const { productId } = action.payload
            state.items = state.items.filter(id => id !== productId)
            saveToStorage(state.items)
        },
        clearWishlist: (state) => {
            state.items = []
            saveToStorage([])
        },
    },
})

export const { toggleWishlist, loadWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
