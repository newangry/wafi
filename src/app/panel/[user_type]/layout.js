"use client"
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'react-redux'
import { toggleMenu } from '../../../redux/sidebar/sidebarSlice'
import { useEffect } from "react";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from "axios";
import "../../../style/spinnerLoaging.css"
import api from "@/hooks/api/api";
export default function RootLayout({ children }) {
    const router = useRouter()

    const user_type = children.props.segmentPath[3][1];

    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [chats, setChats] = useState([])
    const [uploadLoading, setUploadLoading] = useState(false)
    const notify = () => {
        toast.success("The file was sent successfully !", {
            position: toast.POSITION.TOP_CENTER
        });
    }

    const getChats = async () => {
        try {
            const res = await api.get(`chats?user_type=${user_type}`)
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

    const handleAddFile = (event) => {
        const files = event.target.files;
        const updatedSelectedFiles = [...selectedFiles];

        for (let i = 0; i < files.length; i++) {
            updatedSelectedFiles.push(files[i]);
        }

        setSelectedFiles(updatedSelectedFiles);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFiles([]);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        setUploadLoading(true)
        let formData = new FormData();
        formData.append("pdf", selectedFiles[0]);
        try {
            const res = await api.postFile(`chats/create?title=${selectedFiles[0].name}&user_type=${user_type}`, formData)
            notify()
            handleClose();
            getChats()
            router.push(`/panel/${user_type}/${res.id}`)
        } catch (err) {
            toast.error("the connection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
            
        } finally {
            setUploadLoading(false)
        }
    };
    
    const handleNewchat = async() => {
        try {
            const res = await api.postFile(`chats/new_chat`)
            notify()
            handleClose();
            getChats()
            router.push(`/panel/${user_type}/${res.ID}`)
        } catch (err) {
            console.log(err)
            toast.error("the connection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            setUploadLoading(false)
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

    return (
        <div className="md:flex">
            <div className="overflow-hidden h-screen w-full md:w-[32%] p-5 pb-20  border border-solid border-1 border-neutral-300" style={menuStyle}>
                <div className="m-2">
                    <button onClick={user_type == "admin"? handleOpen:handleNewchat}
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
                                                    user_type == "admin" ?
                                                        <div className="flex justify-between">
                                                            <div className="w-[20%] flex justify-center items-start">
                                                                <div className="w-[70%]">
                                                                    <Image src="/pdf.png" alt="costumer" width={0}
                                                                        height={0}
                                                                        sizes="100vw"
                                                                        style={{ width: '100%', height: 'auto' }} />
                                                                </div>
                                                            </div>
                                                            <div className="w-[60%]">
                                                                <div className="flex items-center">
                                                                    <h2 className="font-bold text-[0.9rem] text-textGray">
                                                                        {chat.Title}
                                                                    </h2>
                                                                    <span className="ml-2 text-[#8083A3] text-[0.7rem]">{chat.DateCreated.substring(11, 16)}</span>
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
                                                        </div> :

                                                        <div className="flex justify-between">
                                                            <div className="w-[85%]">
                                                                <div className="flex items-center">
                                                                    <h2 className="font-bold text-[0.9rem] text-textGray">
                                                                        {
                                                                            chat.message == ""?"Please chat with WAFI":chat.message
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
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description">
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: '70%',
                                height: '65vh',
                                maxHeight: "100vh",
                                bgcolor: "#fcfcfa",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                                p: 4,
                                textAlign: "center",
                            }}>
                            {selectedFiles.length > 0 ? (
                                <div className="bg-[#f7f6f2] border-2 border-[#00FFB6] w-full h-full flex flex-col justify-center mx-auto rounded-3xl">
                                    <Typography id="modal-description" sx={{ mb: 2 }}>
                                        Selected Files:
                                    </Typography>
                                    <ul>
                                        {selectedFiles.map((file, index) => (
                                            <li className="text-[#4a4646]" key={index}>
                                                <DoneAllIcon /> {file.name}
                                            </li>
                                        ))}
                                    </ul>
                                    {uploadLoading && <div className="flex justify-center z-10">
                                        <span className="loader"></span>
                                    </div>}
                                    <div className="gap-3 mt-5 mb-5">
                                        <Button
                                            onClick={handleUpload}
                                            variant="outlined"
                                            color="success"
                                            sx={{ mt: 2 }}
                                            disabled={uploadLoading}
                                        >
                                            Send Files
                                        </Button>
                                        <Button
                                            onClick={() => { setSelectedFiles([]); }}
                                            variant="outlined"
                                            color="error"
                                            sx={{ mt: 2, color: "#f72a0f" }}
                                            disabled={uploadLoading}
                                        >
                                            Clear Files
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={handleDragOver}
                                        className=" rounded-md p-5 cursor-pointer mb-5 w-[90%] h-full flex flex-col justify-center mx-auto md:mx-0  bg-[#f7f6f2] relative border-2 border-[#00FFB6] mt-10"
                                        style={{
                                            height: "45vh",
                                        }}>
                                        <Image
                                            src="/csv.svg"
                                            alt="login image"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{
                                                width: "20%",
                                                height: "auto",
                                                position: "absolute",
                                                top: "50px",
                                                left: "-10%",
                                            }}
                                        />
                                        <label htmlFor="file-input">
                                            <Button
                                                component="span"
                                                sx={{
                                                    mt: 2, marginBottom: "20px", borderRadius: '100%', boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" // Box shadow

                                                }}
                                            >
                                                <Image
                                                    src="/upload.svg"
                                                    alt="login image"
                                                    variant="contained"
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{
                                                        width: "40px",
                                                        height: "auto",
                                                        marginRight: "2px",
                                                    }}
                                                />
                                            </Button>
                                        </label>
                                        <Typography id="modal-description" sx={{ mb: 2, color: '#475467' }}>
                                            <span className="text-[#00FFB6] font-extrabold ">Click to update</span>   or drag and drop
                                        </Typography>
                                        <Typography id="modal-description" sx={{ mb: 2, color: '#475467' }}>
                                            PDF (max 50 MG)
                                        </Typography>
                                        <input
                                            type="file"
                                            accept=".jpg, .jpeg, .png, .pdf"
                                            onChange={handleFileChange}
                                            style={{ display: "none" }}
                                            id="file-input"
                                            multiple // Allow multiple file selection
                                        />
                                        <Image
                                            src="/pdf.svg"
                                            alt="login image"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{
                                                width: "20%",
                                                height: "auto",
                                                position: "absolute",
                                                top: "180px",
                                                right: "-10%",
                                            }}
                                        />
                                        <Image
                                            src="/dock.svg"
                                            alt="login image"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{
                                                width: "20%",
                                                height: "auto",
                                                position: "absolute",
                                                top: "200px",
                                                right: "90%",
                                            }}
                                        />
                                        <Image
                                            src="/File.svg"
                                            alt="login image"
                                            variant="contained"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{
                                                width: "8vw",
                                                height: "auto",
                                                // marginLeft: "200px",
                                                position: "absolute",
                                                top: "200px",
                                                right: "4%",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Box>
                    </Modal>
                    <ToastContainer />
                </div>
            </div>
            <div className="main md:w-full md:w-[78%]" style={chatStyle}>
                {children}
            </div>
        </div>
    )
}