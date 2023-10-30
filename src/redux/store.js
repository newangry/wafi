import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer  from "@/redux/sidebar/sidebarSlice";
import authReducer from "@/redux/auth/authSlice";
import logger from 'redux-logger'
import { apiSlice } from "../redux/api/apiSlice"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        sidebar:sidebarReducer,
        auth:authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})