'use client'
import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { access_token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { access_token } = action.payload
            state.access_token = access_token
        },
        logOut: (state, action) => {
            state.access_token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer
