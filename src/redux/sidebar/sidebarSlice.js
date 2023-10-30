import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpen: true,
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.isOpen = (!state.isOpen)
        },
    },
})

export const { toggleMenu } = sidebarSlice.actions

export default sidebarSlice.reducer