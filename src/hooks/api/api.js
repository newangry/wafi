'use client'
import axios from "axios";
import { toast } from 'react-toastify';
import {useRouter} from "next/navigation";

const axiosParams = {
    // baseURL: 'http://64.226.125.111:8000/'
    baseURL: 'https://fdb5-95-217-124-180.ngrok-free.app/'
}

const axiosInstance = axios.create(axiosParams);

const api = {
    get: async (url, config = {}) => {
        try {
            const response = await axiosInstance.get(url, {
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                }
            });
            return response.data
        } catch (error) {
            if (error.response.status === 401) {
                window.location.href = "/login"
            }else {
                toast.error("the connection has error!", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    },
    
    delete: async (url, config = {}) => {
        try {
            const response = await axiosInstance.delete(url, {
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                }
            });

            return response.data
        } catch (error) {
            if (error.response.status === 401) {
                window.location.href = "/login"
            }else {
                toast.error("the connection has error!", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    },

    post: async (url, body, config = {}) => {
        try {
            const response = await axiosInstance.post(url,body, {
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                }
            });

            return response.data
        } catch (error) {

            if (error.response.status === 401) {
                window.location.href = "/login"
            }else {
                toast.error("the connection has error!", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    },
    postFile: async (url, body, config = {}) => {
        try {
            const response = await axiosInstance.post(url,body, {
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data
        } catch (error) {
            if (error.response.status === 401) {
                window.location.href = "/login"
            }else {
                toast.error("the connection has errrrrrrror!", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    },
    put: async (url, body, config = {}) => {
        try {
            const response = await axiosInstance.put(url,body, {
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                }
            });

            return response.data
        } catch (error) {

            if (error.response.status === 401) {
                window.location.href = "/login"
            }else {
                toast.error("the connection has error!", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }
}

export default api;