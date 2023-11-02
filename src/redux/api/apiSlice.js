'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../auth/authSlice'
import {useRouter} from "next/navigation";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://wafi-api.onrender.com/',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().auth.access_token
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    const router = useRouter()
    let result = await baseQuery(args, api, extraOptions)
    console.log(result)
    if (result?.error?.originalStatus === 403) {
        api.dispatch(logOut())
        router.push("/login")
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({

    })
})