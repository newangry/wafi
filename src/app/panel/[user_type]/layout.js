"use client"
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'react-redux'
import { toggleMenu } from '../../../redux/sidebar/sidebarSlice'
import { useEffect } from "react";
import React, { useState } from "react";

import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../../../style/spinnerLoaging.css"
import api from "@/hooks/api/api";
export default function RootLayout({ children }) {
    const router = useRouter()

    const user_type = children.props.segmentPath[3][1]; 
    const [chats, setChats] = useState([])

    const getChats = async () => {
        try {
            const res = await api.get(`chats?user_type=user&chat_id=-1`)
            setChats(res)
        } catch (err) {
            toast.error("the connection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    useEffect(() => {
        getChats()
    }, [])


    const handleNewchat = async () => {
        try {
            const res = await api.postFile(`chats/new_chat`)
            toast.success("New chat was created!", {
                position: toast.POSITION.TOP_CENTER
            });
            getChats()
            router.push(`/panel/${user_type}/${res.ID}`)
        } catch (err) {
            console.log(err)
            toast.error("the connection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            // setUploadLoading(false)
        }
    }

    const isOpen = useSelector((state) => state.sidebar.isOpen)
    const dispatch = useDispatch()
    const [menuStyle, setMenuStyle] = useState({
        display: 'block'
    })
    const [chatStyle, setChatStyle] = useState({
        display: 'block'
    })
    useEffect(() => {
        if (window.innerWidth > 768) {
            setMenuStyle({ display: 'block' })
            setChatStyle({ display: 'block' })
        } else {
            if (isOpen) {
                setMenuStyle({ display: 'block' })
                setChatStyle({ display: 'none' })
            } else {
                setMenuStyle({ display: 'none' })
                setChatStyle({ display: 'block' })
            }
        }
    }, [isOpen])

    const pathname = usePathname()
    const renderView = ({ style, ...reset }) => {
        const customStyle = {
            marginRight: '-19px',
            right: '2px',
            overflowX: "hidden"
        };
        return <div {...reset} style={{ ...style, ...customStyle }} />;
    };

    const renderThumbVertical = ({ style, ...reset }) => {
        const thumbStyle = {
            borderRadius: 6,
            backgroundColor: '#F1F2F6',
            right: '2px',
        };
        return <div style={{ ...style, ...thumbStyle }} {...reset} />;
    };

    const renderTrackVertical = () => {
        const thumbStyle = {
            position: 'absolute',
            width: '6px',
            transition: 'opacity 200ms ease 0s',
            opacity: 0,
            right: '6px',
            bottom: '2px',
            top: '2px',
            borderRadius: '3px',
        };
        return <div style={thumbStyle} />;
    };

    const renderThumbHorizontal = ({ style, ...reset }) => {
        const thumbStyle = {
            borderRadius: 6,
            backgroundColor: '#F1F2F6',
        };
        return <div style={{ ...style, ...thumbStyle }} {...reset} />;
    };

    const handleLink = () => {
        if (window.innerWidth < 768) {
            dispatch(toggleMenu())
        }
    }

    const getImage = (title) => {
        const splited = title.split(".")
        const extension = splited[splited.length - 1].toUpperCase()
        if (extension == "PDF") {
            return "/pdf.png";
        } else if (extension == "DOC" || extension == "DOCX") {
            return "/word.png"
        } else {
            return "/text.png"
        }
    }

    return (
        <div className="md:flex">
            <div className="overflow-hidden h-screen w-full md:w-[32%] p-5 pb-20  border border-solid border-1 border-neutral-300" style={menuStyle}>
                <div className="m-2">
                    <button onClick={handleNewchat}
                        className="text-center w-full py-4 border border-solid border-1 border-neutral-300 rounded hover:bg-mainGreen hover-border-none">
                        + New chat
                    </button>
                </div>
                {
                    <Scrollbars autoHide
                        className="scroll-bar"
                        autoHideTimeout={500}
                        autoHideDuration={200}
                        renderView={renderView}
                        renderThumbHorizontal={renderThumbHorizontal}
                        renderThumbVertical={renderThumbVertical}
                        renderTrackVertical={renderTrackVertical}>
                        <ul className="overflow-hidden mt-5 flex flex-col gap-2">
                            {
                                chats?.map((chat, index) => (
                                    <li>
                                        <Link href={`/panel/${user_type}/${chat.ID}`} onClick={handleLink}>
                                            <div
                                                className={pathname === "panel/12" ? "px-2 py-4 hover:bg-[#EAFFF6]" : "px-2 py-4 hover:bg-[#EAFFF6]"}>
                                                {
                                                    <div className="flex justify-between">
                                                        <div className="w-[85%]">
                                                            <div className="flex items-center">
                                                                <h2 className="font-bold text-[0.9rem] text-textGray">
                                                                    {
                                                                        chat.message == "" ? "Please chat with WAFI" : chat.message
                                                                    }
                                                                </h2>
                                                                <span className="ml-2 text-[#8083A3] text-[0.7rem]">{chat.date.substring(11, 16)}</span>
                                                            </div>
                                                            <div className="">
                                                                <p className="text-[#8083A3] text-[0.8rem]">
                                                                    Lorem Ipsum is simply dummy text of the printing
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-1 w-[15%] flex justify-center items-start">
                                                            <span
                                                                className="flex items-center font-bold text-[#8083A3] border border-solid border-2 border-[#ECEEF5] px-2 py-1 text-center rounded">
                                                                ...
                                                            </span>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </Scrollbars>
                }
            </div>
            <div className="main md:w-full md:w-[78%]" style={chatStyle}>
                {children}
            </div>
        </div>
    )
}