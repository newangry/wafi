'use client'
import { apiSlice } from "../api/apiSlice"

export const listOfChatSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getChats: builder.query({
            query: () => '/chats',
        })
    })
})

export const {useGetChatsQuery} = listOfChatSlice