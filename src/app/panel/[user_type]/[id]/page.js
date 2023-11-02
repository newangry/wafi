"use client"
import Image from 'next/image'
import { Scrollbars } from 'react-custom-scrollbars';
import { usePathname, useRouter } from "next/navigation";
import { AiOutlinePaperClip } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { toggleMenu } from '../../../../redux/sidebar/sidebarSlice'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../../../style/spotLoading.css"
import api from "@/hooks/api/api";
import Tooltip from '@mui/material/Tooltip';
import "../../../../style/smallSpinner.css"
import { EMOTHIONS } from '@/utils/const';

export default function Home({ params }) {
    const user_type = params.user_type;
    const router = useRouter()
    const pathname = usePathname()
    const scrollbars = useRef(null)
    const isOpen = useSelector((state) => state.sidebar.isOpen)
    const dispatch = useDispatch()
    const [massage, setMassage] = useState("")
    const [AILoading, setAILoading] = useState(false)
    const [chat, setChat] = useState()
    const [chatHistory, setChatHistory] = useState([])
    const [robotVoice, setRobotVoice] = useState(false)
    const [isPlay, setIsPlay] = useState({index: -1, play: false})
    const [voiceLoading, setVoiceLoading] = useState(false)
    const [emothion, setEmothion] = useState('Talking')
    
    useEffect(() => {
        scrollbars.current.scrollToBottom()
    }, [chatHistory]);


    const getChats = async () => {
        try {
            const res = await api.get(`chats/read/${params.id}`)
            setChat(res)
            if (res.chat_history !== null) {
                setChatHistory(res?.chat_history)
                const chat_history = res.chat_history;
                if (chat_history.length > 0) {
                    const _emothion = chat_history[chat_history.length - 1].AI.emotion
                    handlePlayVoice(chat_history[chat_history.length - 1].AI.message, chat_history.length - 1)
                    if (EMOTHIONS.filter((item) => item == _emothion).length > 0) {
                        setEmothion(_emothion)
                    }
                } else if (chat_history == 1) {
                    router.push(`/panel/${user_type}/${res.ID}`)
                }
            }
        } catch (err) {
            toast.error("the connection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    useEffect(() => {
        setRobotVoice(new Audio())
        getChats()
    }, [])

    const addLoadingMassage = (mag) => {
        let date = new Date().toJSON();
        let updateChatHistory = [...chatHistory];
        let chat = {
            Human: {
                date: date,
                message: mag
            },
            AI: {
                date: date,
                message: <div className="mb-10"><span className="loader"></span></div>
            },
        }
        updateChatHistory.push(chat)
        setChatHistory(updateChatHistory)
    }

    const handleSendMassage = async () => {
        setAILoading(true)
        addLoadingMassage(massage)
        const newMassage = massage
        setMassage("")

        let formData = new FormData()
        formData.append("audio", "")

        try {
            await api.postFile(`chats/new_message?chat_id=${params.id}&input_type=text&output_type=text&new_message=${newMassage}&user_type=${user_type}`, formData)
            getChats()
        } catch (err) {
            console.log(err);
            toast.error("Has Error !", {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            setAILoading(false)
            scrollbars.current.scrollToBottom()
        }
    }

    const handleSendMassageByVoice = async (mag) => {
        addLoadingMassage(mag)

        let formData = new FormData()
        formData.append("audio", "")

        try {
            await api.postFile(`chats/new_message?chat_id=${params.id}&input_type=text&output_type=text&new_message=${mag}&user_type=${user_type}`, formData)
            getChats()
        } catch (err) {
            console.log(err)
            toast.error("the conection has error !", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }
    
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
    const addLoadingMassageVoice = () => {
        let date = new Date().toJSON();
        let updateChatHistory = [...chatHistory];
        let chat = {
            Human: {
                date: date,
                message: <div className="mb-10"><span className="loader"></span></div>
            },
            AI: {
                date: date,
                message: <div className="mb-10"><span className="loader"></span></div>
            },
        }
        updateChatHistory.push(chat)
        setChatHistory(updateChatHistory)
    }
    const addAudioElement = async (blob) => {
        setAILoading(true)

        addLoadingMassageVoice()

        let formData = new FormData()
        formData.append("audio_file", blob)

        try {
            const res = await api.postFile("chats/transcribe", formData)
            handleSendMassageByVoice(res)
        } catch (err) {
            toast.error("Has Error !", {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            setAILoading(false)
            scrollbars.current.scrollToBottom()
        }

        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;
    };
    const handleUpdate = () => {
        scrollbars.current.scrollToBottom()
    }
    const handlePlayVoice = async (msg, index) => {
        setVoiceLoading(true)
        if(index == isPlay.index){
            setIsPlay({
                index,
                play: true
            })
            robotVoice.play();
        } else{
            const res = await api.post(`chats/tts?text=${msg}`)
            let audio = new Audio("data:audio/wav;base64," + res)
            audio.play()
            setIsPlay({
                index,
                play: true
            })
            setRobotVoice(audio)
        }
            
        setVoiceLoading(false)
    }
    
    useEffect(() => {
        if(robotVoice){
            robotVoice.addEventListener('ended', function() {
                const index = isPlay.index;
                setIsPlay({
                    index: index,
                    play: false
                })
            });
        }
    }, [robotVoice])
    
    const handlePauseVoice = (index) => {
        robotVoice.pause();
        setIsPlay({
            index,
            play: false
        })
    }

    return (
        <div className="h-screen w-full flex flex-col justify-between">
            <header
                className="px-5 md:px-10">
                <div className="flex justify-center">
                    <div className="w-[17%] rounded-[0.5rem]">
                        {
                            <Image src={`/Animations/${emothion}.svg`}
                                alt="costumer" width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                        }

                    </div>
                </div>
            </header>
            <Scrollbars autoHide
                ref={scrollbars}
                className="scroll-bar pb-10"
                autoHideTimeout={500}
                autoHideDuration={200}
                renderView={renderView}
                renderThumbHorizontal={renderThumbHorizontal}
                renderThumbVertical={renderThumbVertical}
                renderTrackVertical={renderTrackVertical}>

                {/* <div className="flex justify-center">
                    <div className="w-[17%] rounded-[0.5rem]">
                        <Image src="/Animations/Wink.svg" alt="costumer" width={0}
                               height={0}
                               sizes="100vw"
                               style={{width: '100%', height: 'auto', objectFit: "cover"}}/>
                    </div>
                </div> */}
                {
                    chatHistory?.map((massage, index) => (
                        <div>
                            <div className="flex justify-end">
                                <div className="flex flex-row-reverse mx-8 my-5 w-[80%] md:w-[50%]">
                                    <div className="mx-2">
                                        <div className="w-[2rem] rounded-[0.5rem]">
                                            <Image src="/img.png" alt="costumer" width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: '100%', height: 'auto', objectFit: "cover" }} />

                                        </div>

                                    </div>
                                    <div>
                                        <div className="flex flex-row-reverse items-center">
                                            <h2 className="font-bold text-[0.9rem] text-textGray">
                                                Me
                                            </h2>
                                            <span className="mx-2 text-[#8083A3] text-[0.7rem]">
                                                {massage.Human.date?.substring(11, 16)}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="font-medium text-textGray  bg-mainGreen rounded-xl rounded-se-none p-3 bg-[] text-[0.8rem]">
                                                {massage?.Human?.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex ">
                                <div className="flex mx-8 my-5 w-[80%] md:w-[50%]">
                                    <div className="mx-2">
                                        <div
                                            className="hover:bg-[#EAFFF6] bg-mainGreen px-1 py-[0.3rem] rounded-[0.5rem] border border-solid border-2 border-[#ECEEF5]">
                                            <div className="w-6">
                                                <Image src="/smallHead.svg" alt="costumer" width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{ width: '100%', height: 'auto' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex  items-center">
                                            <h2 className="font-bold text-[0.9rem] text-textGray">
                                                WAFI
                                            </h2>
                                            <span className="mx-2 text-[#8083A3] text-[0.7rem]">
                                                {massage.AI.date?.substring(11, 16)}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div
                                                className="flex flex-col justify-center font-medium text-textGray bg-[#F3F4F9]  rounded-xl rounded-ss-none p-3">
                                                <p className="text-[0.8rem]">
                                                    {massage?.AI?.message}
                                                </p>
                                                <div className="mt-4 flex justify-end">
                                                    {
                                                        voiceLoading ? (
                                                            <span className="loaderSmall"></span>
                                                        ) : isPlay.index == index?
                                                             !isPlay.play? (
                                                            <Tooltip title="play the voice" arrow>
                                                                <button onClick={() => {
                                                                    handlePlayVoice(massage?.AI?.message, index)
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="23"
                                                                        height="23" fill="currentColor"
                                                                        className="bi bi-play-circle"
                                                                        viewBox="0 0 16 16">
                                                                        <path
                                                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                                        <path
                                                                            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                                                                    </svg>
                                                                </button>
                                                            </Tooltip>
                                                        ):
                                                        <Tooltip title="pause the voice" arrow>
                                                            <button onClick={() => {
                                                                handlePauseVoice(index)
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="23"
                                                                    height="23" viewBox="0 0 256 256">
                                                                    <rect width="256" height="256" fill="none" />
                                                                    <circle cx="128" cy="128" r="96" fill="none"
                                                                        stroke="#000" stroke-linecap="round"
                                                                        stroke-linejoin="round" stroke-width="12" />
                                                                    <line x1="104" y1="96" x2="104" y2="160" fill="none"
                                                                        stroke="#000" stroke-linecap="round"
                                                                        stroke-linejoin="round" stroke-width="12" />
                                                                    <line x1="152" y1="96" x2="152" y2="160" fill="none"
                                                                        stroke="#000" stroke-linecap="round"
                                                                        stroke-linejoin="round" stroke-width="12" />
                                                                </svg>
                                                            </button>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title="play the voice" arrow>
                                                                <button onClick={() => {
                                                                    handlePlayVoice(massage?.AI?.message, index)
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="23"
                                                                        height="23" fill="currentColor"
                                                                        className="bi bi-play-circle"
                                                                        viewBox="0 0 16 16">
                                                                        <path
                                                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                                        <path
                                                                            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                                                                    </svg>
                                                                </button>
                                                        </Tooltip>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Scrollbars>
            <div
                className="py-3 px-5 md:px-10 flex justify-between items-center border-t  border-t-1 border-t-neutral-300">
                <div className="w-[80%]">
                    <textarea value={massage} onChange={(e) => {
                        setMassage(e.target.value)
                    }} placeholder="Type to add your message..."
                        className="text-scroll  w-full focus:outline-none py-5 focus:border-none" />
                </div>
                <div className="flex gap-4 items-center justify-between">
                    <AudioRecorder
                        onRecordingComplete={addAudioElement}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }}
                        onNotAllowedOrFound={(err) => console.table(err)}
                        downloadFileExtension="mp3"
                        mediaRecorderOptions={{
                            audioBitsPerSecond: 128000,
                        }} />
                    <button>
                        <AiOutlinePaperClip className="text-[#C9C9C9] text-[1.6rem]" />
                    </button>
                    <button disabled={massage === "" || AILoading} onClick={handleSendMassage}
                        className="disabled:bg-[#EAFFF6] hover:bg-[#EAFFF6] bg-mainGreen px-3 py-3 rounded-[0.5rem] border border-solid border-2 border-[#ECEEF5]">
                        <div className="w-6">
                            <Image src="/send.svg" alt="costumer" width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
