"use client"
import Image from 'next/image'
import { Scrollbars } from 'react-custom-scrollbars';
import { usePathname, useRouter } from "next/navigation";
import { AiOutlinePaperClip } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { toggleMenu } from '../../../../redux/sidebar/sidebarSlice'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useEffect, useRef, useState } from "react";
import "../../../../style/spotLoading.css"
import api, { axiosInstance } from "@/hooks/api/api";
import Tooltip from '@mui/material/Tooltip';
import "../../../../style/smallSpinner.css"
import { EMOTHIONS, BACKEND_URL } from '@/utils/const';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
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
    const [isPlay, setIsPlay] = useState({ index: -1, play: false })
    const [voiceLoading, setVoiceLoading] = useState(false)
    const [emotion, setEmotion] = useState('Talking')
    const [answer, setAnswer] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [runningAudio, setRunningAudio] = useState([]);
    const [tempAudio, setTempAudio] = useState([]);
    let speechs = [];
    let statusAudio = false;

    useEffect(() => {
        scrollbars.current.scrollToBottom()
    }, [answer]);

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
        formData.append("file", selectedFiles[0]);
        try {
            const res = await api.postFile(`chats/create?title=${selectedFiles[0].name}&user_type=admin&chat_id=${params.id}`, formData)
            toast.success("The file was sent successfully !", {
                position: toast.POSITION.TOP_CENTER
            });
            handleClose();
            getFiles()
        } catch (err) {
            toast.error("Timeout issue. Try again.", {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            setUploadLoading(false)
        }
    };

    const getChats = async () => {
        try {
            const res = await api.get(`chats/read/${params.id}`)
            setChat(res)

            if (res.chat_history !== null) {
                setChatHistory(res?.chat_history)
                const chat_history = res.chat_history;
                if (chat_history.length > 0) {

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
        getFiles()
        getChats()
    }, [])

    const addLoadingMassage = (mag) => {
        let date = new Date().toJSON();
        let updateChatHistory = JSON.parse(JSON.stringify(chatHistory));
        let chat = {
            Human: {
                date: date,
                message: mag
            },
            AI: {
                date: date,
                message: <div className="mb-10 "><span className="loader"></span></div>
            },
        }

        updateChatHistory.push(chat)
        setChatHistory(updateChatHistory)

        return updateChatHistory;
    }

    const handleSendMassage = async () => {
        getAnswer(massage)
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

    const getAnswer = async (_message) => {
        setAILoading(true)
        setEmotion("robothead");
        speechs = [];
        let updated_history = JSON.parse(JSON.stringify(addLoadingMassage(_message)))
        const newMassage = _message
        setMassage("")
        setTempAudio([]);
        let formData = new FormData()
        formData.append("audio", "")
        setAnswer("");
        setRunningAudio([]);
        try {
            const response = await fetch(`${BACKEND_URL}/chats/new_message?chat_id=${params.id}&input_type=text&output_type=text&new_message=${newMassage}&user_type=${user_type}`,
                {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                });
            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let txt = "";
            let length = "";
            let speech_txt = "";
            setIsPlay({
                index: updated_history.length - 1,
                play: true
            })
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                txt = txt + decoder.decode(value);
                speech_txt = speech_txt + decoder.decode(value);

                console.log(decoder.decode(value))
                length = updated_history.length;
                if (speech_txt.length > 100) {
                    speechFromText(speech_txt, length)
                    speech_txt = ""
                    setAnswer(txt)

                } else {
                    setAnswer(txt)
                }
                updated_history[updated_history.length - 1].AI.message = txt;
                setChatHistory(updated_history);
            }

            if (speech_txt.length != 0) {
                speechFromText(speech_txt, length)
                speech_txt = ""
            }

            const speech = await api.post(`chats/tts?text=${txt}`)
            updated_history[updated_history.length - 1].AI.speech = speech
            setChatHistory(updated_history)
            saveHistory(_message, txt, emotion);
            setAILoading(false)

        } catch (e) {
            console.log(e);
            toast.error("The server error", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    let isFirst = true;

    const speechFromText = (msg, index) => {
        fetch(`${BACKEND_URL}/chats/tts?text=${msg}`,
            {
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                speechs.push(data)
                if (isFirst) {
                    setEmotion("Talking")
                    playAudio(false)
                    isFirst = false;
                    getEmotion(msg) //get emotion
                }
            })
    }

    const getEmotion = (msg) => {
        try {
            fetch(`${BACKEND_URL}/chats/get_emotion?text=${msg}`,
                {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${window.sessionStorage.getItem("access_token")}`,
                    }
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    setEmotion(data);
                })
        } catch (e) {
            cosnole.log(e)
        }

    }

    const playAudio = (audio) => {
        if (!audio) {
            let audio_ = new Audio("data:audio/wav;base64," + speechs[0])
            audio_.play()
            playAudio(audio_)
            setRunningAudio(p => [...p, { audio: audio_, src: "data:audio/wav;base64," + speechs[0] }])
            speechs.splice(0, 1);
        } else {
            audio.addEventListener('ended', function () {
                const audio_src = audio.src;
                const running_audio = JSON.parse(JSON.stringify(runningAudio));
                let index = 0;
                running_audio.map((item, _index) => {
                    if (audio_src == item.src) {
                        index = _index
                    }
                })
                running_audio.splice(index, 1);
                setRunningAudio(running_audio);

                if (speechs.length > 0) {
                    let audio_ = new Audio("data:audio/wav;base64," + speechs[0])
                    if (!isPlay.play) {
                        audio_.play()
                        playAudio(audio_)
                        setRunningAudio(p => [...p, { audio: audio_, src: "data:audio/wav;base64," + speechs[0] }])
                        speechs.splice(0, 1);
                    }
                } else {
                    setAILoading(false)
                    isFirst = true;
                    setIsPlay({
                        index: -1,
                        play: false
                    })
                }
            });
        }
    }

    const playAudioRemain = (audio) => {
        const running_audio = JSON.parse(JSON.stringify(runningAudio));

        if (!audio) {
            let audio_ = new Audio(running_audio[0].src)
            audio_.play()
            playAudioRemain(audio_)
            running_audio.splice(0, 1);
            setRunningAudio(running_audio);
            setTempAudio(p => [...p, audio_])
        } else {
            audio.addEventListener('ended', function () {
                const audio_src = audio.src;
                let index = 0;
                if (running_audio.length == 0) {
                    setIsPlay({
                        index: -1,
                        play: false
                    })
                }
                if (running_audio.length > 0) {
                    let audio_ = new Audio(running_audio[0].src)
                    audio_.play()
                    playAudio(audio_)
                    setTempAudio(p => [...p, audio_])
                    running_audio.map((item, _index) => {
                        if (audio_src == item.src) {
                            index = _index
                        }
                    })

                    running_audio.splice(index, 1);
                    setRunningAudio(running_audio);
                } else {
                    setAILoading(false)
                    isFirst = true;
                    setIsPlay({
                        index: -1,
                        play: false
                    })
                }
            });
        }
    }

    const handleSendMassageByVoice = async (mag) => {
        getAnswer(mag)
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
                message: <div className="mb-10 ml-10"><span className="loader"></span></div>
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
        if (index == chatHistory.length - 1 && runningAudio.length > 0) {
            playAudioRemain(false)
            setIsPlay({
                index,
                play: true
            })
            setRobotVoice(false);
        } else {
            if (
                index == isPlay.index && robotVoice
            ) {

                robotVoice.play();
                setIsPlay({
                    index,
                    play: true
                })
            } else {
                setVoiceLoading(true)
                let audio = new Audio("data:audio/wav;base64," + chatHistory[index].AI.speech)
                audio.play()
                setEmotion(chatHistory[index].AI.emotion);
                setIsPlay({
                    index,
                    play: true
                })
                setRobotVoice(audio)
                setVoiceLoading(false)
            }
        }
    }

    useEffect(() => {
        if (robotVoice) {
            robotVoice.addEventListener('ended', function () {
                const index = isPlay.index;
                setIsPlay({
                    index: index,
                    play: false
                })
            });
        }
    }, [robotVoice])

    const saveHistory = async (message, ai, emotion) => {
        await api.post(`chats/save_history?ai=${ai}&message=${message}&emotion=${emotion}&chat_id=${params.id}`)
    }

    const handlePauseVoice = (index) => {
        runningAudio.map((item) => {
            item.audio.pause()
        })
        tempAudio.map((item) => {
            item.pause()
        })
        setIsPlay({
            index,
            play: false
        })
        if(robotVoice){
            
            robotVoice.pause();
        }

    }

    const getFiles = async () => {
        try {
            const res = await api.get(`chats?user_type=admin&chat_id=${params.id}`)
            setFiles(res)
        } catch (err) {
            console.log(err);
            toast.error("The server error!", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    return (
        <div className='flex lg:flex-row'>
            <div className={`h-screen ${user_type == 'admin' ? 'w-[79%]' : 'w-full'} flex flex-col justify-between`}>
                <header
                    className="px-5 md:px-10">
                    <div className="flex justify-center">
                        <div className="w-[17%] rounded-[0.5rem]">
                            {
                                !isPlay.play ?
                                    <Image src={`/robothead.svg`}
                                        alt="costumer" width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{ width: '100%', height: 'auto', objectFit: "cover", marginTop: '20px' }} /> :
                                    EMOTHIONS.filter(item => item == emotion).length > 0 ?
                                        <Image src={`/Animations/${emotion}.svg`}
                                            alt="costumer" width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: '100%', height: 'auto', objectFit: "cover" }} /> :
                                        <Image src={`/Animations/Talking.svg`}
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
                                                        {
                                                            index == chatHistory.length - 1 ?
                                                                AILoading ?
                                                                    answer == "" ?
                                                                        <div className="mb-10 ml-5"><span className="loader"></span></div> :
                                                                        answer :
                                                                    massage.AI.message :
                                                                massage.AI.message
                                                        }
                                                    </p>
                                                    <div className="mt-4 flex justify-end">
                                                        {

                                                            AILoading ? (
                                                                // <div className="loaderSmall" style={{ paddingLeft: '20px' }}></div>
                                                                <></>
                                                            ) : isPlay.index == index ?
                                                                !isPlay.play ? (
                                                                    <Tooltip title="play the voice" arrow>
                                                                        <button onClick={() => {
                                                                            if (!isPlay.play && !AILoading) {
                                                                                handlePlayVoice(massage?.AI?.message, index)
                                                                            }
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
                                                                ) :
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
                                                                        if (!isPlay.play && !AILoading) {
                                                                            handlePlayVoice(massage?.AI?.message, index)
                                                                        }
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
                            {
                                user_type == "admin" ?
                                    <AiOutlinePaperClip className="text-[#C9C9C9] text-[1.6rem]"
                                        onClick={() => { setOpen(true) }}
                                    /> : <></>
                            }
                        </button>
                        <button disabled={massage === "" || AILoading || isPlay.play} onClick={handleSendMassage}
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
                                            PDF, DOC(DOCX), TXT (max 50 MG)
                                        </Typography>
                                        <input
                                            type="file"
                                            accept=".pdf, .doc, .docx, .txt"
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
            <div className={`${user_type == "admin" ? "w-[20%]" : "hidden"} border-l-[1px] border-solid border-gray p-[10px] pt-[50px]`}>
                {
                    files.length == 0 ?
                        <div textAlign='center'>No files</div> :
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
                                    files?.map((chat, index) => (
                                        <li>
                                            <div
                                                className={pathname === "panel/12" ? "px-2 py-4 hover:bg-[#EAFFF6]" : "px-2 py-4 hover:bg-[#EAFFF6]"}>
                                                {

                                                    <div className="flex justify-between">
                                                        <div className="w-[20%] flex justify-center items-start">
                                                            <div className="w-[70%]">
                                                                <Image src={getImage(chat.Title)} alt="costumer" width={0}
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
                                                    </div>
                                                }

                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Scrollbars>
                }

            </div>
        </div>

    )
}
