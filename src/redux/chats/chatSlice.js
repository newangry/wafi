import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpen: true,
}

export const chatSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.isOpen = (!state.isOpen)
        },
    },
})

export const { toggleMenu } = chatSlice.actions

export default chatSlice.reducer