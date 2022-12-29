import Image from "next/image";
import styles from "../../styles/messages.module.css";
import Layout from "../../components/mainLayout";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/messages.json"
import { Langs } from "../../types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL, SOCKETURL } from "../../constants";
import { useTheme, useToggle, useUser } from "../../hooks";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import emTr from "../../i18n/locales/components/emoji.json"
import dynamic from "next/dynamic";
import { Categories } from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { GoFileMedia } from "react-icons/go";
import { io } from "socket.io-client";
import { Loader } from "../../components/mis";
import { postDateFormat } from "../../libs/utils";
import Head from "next/head";

const socket = io(`${SOCKETURL}/couple`, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});

const Picker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    { ssr: false }
);


export default function Messages() {
    const router = useRouter()
    const locale = router.locale || "en"
    const [messages, setMessages] = useState<any[]>([])
    const [typing, setTyping] = useState(false)
    const messageContainer = useRef<HTMLDivElement>(null)
    const localeTr = tr[locale as Langs]
    const userId = useUser()

    const pData = useQuery(["partner", { userId }], () => axios.get(`${BASEURL}/user/u/partner`), { staleTime: Infinity }).data

    const fetchMessages = ({ pageParam = 0 }) => axios.get(`${BASEURL}/couple/p-messages/${pageParam}`)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["messages"], fetchMessages,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data) {
                    if (lastPage.data?.pagination.end)
                        return undefined
                }
                return lastPage.data?.pagination.next
            },
        })

    socket.on('connect', () => {
    })

    socket.on("message", (data) => {
        setMessages([...messages, data])
        if (messageContainer.current) {
            setTimeout(() => { messageContainer.current?.lastElementChild?.scrollIntoView({ behavior: "auto" }) }, 1)
        }
        socket.emit("recieved")
    })


    useEffect(() => {
        if (data && data.pages) {
            let msgs: any[] = []
            for (let page of data.pages) {
                msgs = page.data.messages.concat(msgs)
            }
            msgs = msgs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            setMessages([...msgs])
            if (data.pages.length === 1) {
                setTimeout(() => messageContainer.current!.lastElementChild?.scrollIntoView())
            }
        }
        socket.emit("recieved")
    }, [data])


    socket.on("connect_error", (error) => {
    })
    socket.on("sent", (data) => {
    })
    socket.on("recieved", () => {
        let msg = messages.map(msg => {
            msg.recieved = true
            return msg
        })
        setMessages(msg)
    })

    socket.on("not-sent", error => {
    })

    socket.on("typing", () => {
        setTyping(true)
    })
    socket.on("not-typing", () => {
        setTyping(false)
    })
    return (
        <Layout>
            <Head>
                <title>{localeTr.title}</title>
                <meta name="robots" content="noindex,nofollow" />
                <meta name="description" content={`User's timeline - Prime Couples, social media for couples`} />
            </Head>
            <div className={styles.messagePageContainer}>
                <div className={styles.messagingContainer}>
                    <section className={styles.usersMessagesContainer}>
                        <div className={styles.fixedContainer}>
                            <div className={styles.header}>
                                <h3>Messaging</h3>
                            </div>
                            <div className={styles.searchContainer}>
                                <input type="search" placeholder="Search messages..." className={styles.search} />
                            </div>
                        </div>
                        <div className={styles.chatItemsContainer}>
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified={false} />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me5.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me4.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                        </div>

                        <div></div>
                    </section>
                    <section className={styles.chatContainer}>
                        <div className={styles.header}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--gap-half)"
                            }}> <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                                    <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                        <Image layout="fill" objectFit="cover" src={`${IMAGEURL}/${pData?.data.profile_picture}`}
                                            className={styles.profileImage} alt="User's cover" />
                                    </span>
                                </div>
                                <h4>{pData?.data.user_name}</h4>
                            </div>
                            <div onClick={() => router.back()} className={styles.backIcon}>
                                <BiArrowBack />
                            </div>
                        </div>
                        <div className={styles.pmWrapper} ref={messageContainer}>
                            <Loader loadMore={fetchNextPage} isFetching={isFetchingNextPage} hasNext={hasNextPage ? true : false} manual />
                            {messages.map((message: any, index: number) => {
                                return (
                                    <ChatMessage
                                        text={message.message} me={message.from === userId} recieved={message.from === userId && message.recieved}
                                        date={message.date} type={message.type} key={new Date(message.date).getTime()} />
                                )
                            })
                            }
                            {typing && <p style={{ color: "var(--success)", paddingLeft: "var(--gap-half)" }}>{localeTr.typing}</p>}

                        </div>
                        <div className={styles.writeMessageContainer}>
                            <div className={styles.textAreaContainer}>
                                <TextArea
                                    sendMessage={(type, message) => {
                                        socket.emit(`${type}-message`, message)
                                        setMessages([])
                                        setMessages([...messages, { message, from: userId, type, date: "Now" }])
                                        if (messageContainer.current) {
                                            setTimeout(() => { messageContainer.current?.lastElementChild?.scrollIntoView({ behavior: "auto" }) }, 1)
                                        }
                                    }}
                                    sendAlert={(alert) => {
                                        socket.emit(alert)
                                    }}
                                />
                            </div>

                        </div>
                    </section>
                </div>
            </div >

        </Layout >
    )
}


const TextArea: React.FunctionComponent<{
    sendMessage: (type: "text" | "file", message: string | File) => void,
    sendAlert: (action: string) => void
}> = ({ sendMessage, sendAlert }) => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const emojiTr = emTr[locale as Langs]
    const [openEmoji, setOpenEmoji] = useState(false)
    const [message, setMessage] = useState("")
    const [image, setImage] = useState("")
    const theme = useTheme()

    const fileRef = useRef<File>()

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            fileRef.current = fs[0]
            reader.readAsDataURL(fs[0])
            reader.onload = () => {
                setImage(reader.result as any)
                e.target.value = ""
            }
        }
    }
    if (message === "") {
        sendAlert("not-typing")
    }
    return (
        <>
            <div className={styles.commentContainer}>
                <div onClick={() => setOpenEmoji(!openEmoji)} style={{ display: "grid", placeItems: "center" }}>
                    <BsEmojiSmile size={20} />
                </div>
                <textarea aria-label="" placeholder={localeTr.writeMessage}
                    autoComplete="off" autoCorrect="off"
                    onKeyUp={(e) => {
                        e.currentTarget.style.height = "1px";
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                    }}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        sendAlert("typing")
                    }}
                    onBlur={() => sendAlert("not-typing")}
                    onFocus={() => {
                        sendAlert("typing")
                        setOpenEmoji(false)
                    }}
                ></textarea>

                <div>
                    {
                        message === "" ?
                            <>
                                {image !== "" && (
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "absolute", height: "60vh", width: "min(60%, 300px)", right: "var(--gap)", bottom: "60px" }}>
                                        <img src={image}
                                            style={{
                                                objectFit: "contain",
                                                marginTop: "auto",
                                                width: "100%",
                                                maxHeight: "100%"
                                            }}
                                            alt=""
                                        />
                                        <div style={{ width: "100%", gap: "var(--gap)", position: "absolute", display: "flex", justifyContent: "center", bottom: "var(--gap-half)" }}>
                                            <button
                                                onClick={() => setImage("")}
                                                style={{
                                                    padding: "3px var(--gap-half)", color: "white",
                                                    backgroundColor: "rgba(0,0,0,0.9)"
                                                }}>{localeTr.cancel}</button>
                                            <button
                                                style={{
                                                    padding: "3px var(--gap-half)",
                                                    color: "white", backgroundColor: "var(--success)"
                                                }}
                                                onClick={() => {
                                                    if (image === "" || fileRef.current === undefined) return
                                                    sendMessage("file", fileRef.current)
                                                    setImage("")
                                                }}
                                            >{localeTr.send}</button>
                                        </div>
                                    </div>
                                )
                                }
                                <div style={{ display: "grid", placeItems: "center", position: "relative" }}>
                                    <input type={"file"} accept="image/jpg, image/jpeg, image/png, image/gif"
                                        onChange={handleFile}
                                        style={{ top: 0, left: 0, position: "absolute", width: "100%", height: "100%", opacity: 0 }}

                                    />
                                    <GoFileMedia size={20} />
                                </div>
                            </>
                            :
                            <button onClick={() => {
                                if (message === "") return
                                sendMessage("text", message)
                                setMessage("")
                            }}>{localeTr.send}</button>
                    }
                </div>

            </div>
            {
                openEmoji && <div style={{ position: "absolute", bottom: "60px" }}>
                    <Picker
                        onEmojiClick={(emojiObject) => setMessage(message + emojiObject.emoji)}
                        lazyLoadEmojis={true}
                        theme={theme}
                        categories={[
                            {
                                name: emojiTr.recently_used,
                                category: Categories.SUGGESTED
                            },
                            {
                                name: emojiTr.smileys_people,
                                category: Categories.SMILEYS_PEOPLE
                            },
                            {
                                name: emojiTr.food_drink,
                                category: Categories.FOOD_DRINK
                            },
                            {
                                name: emojiTr.animals_nature,
                                category: Categories.ANIMALS_NATURE
                            },
                            {
                                name: emojiTr.activities,
                                category: Categories.ACTIVITIES
                            },
                            {
                                name: emojiTr.travel_places,
                                category: Categories.TRAVEL_PLACES
                            },
                            {
                                name: emojiTr.objects,
                                category: Categories.OBJECTS
                            },
                            {
                                name: emojiTr.symbols,
                                category: Categories.SYMBOLS
                            },

                            {
                                name: emojiTr.flags,
                                category: Categories.FLAGS
                            }
                        ]}
                    />
                </div>
            }
        </>
    )
}

const ChatUser: React.FunctionComponent<{
    name: string;
    avatar: string;
    isVerified: boolean
}> = (props) => {
    return (
        <div className={`${styles.chatItemContainer} ${!props.isVerified ? styles.chatItemActive : ""} `}>
            <div className={styles.imageContainer} style={{ width: "40px", height: "40px" }}>
                <span className={styles.avatarContainer} style={{ width: "40px", height: "40px" }}>
                    <Image
                        layout="fill"
                        objectFit="cover"
                        src={props.avatar}
                        className={styles.profileImage}
                        alt=""
                    />
                </span>
            </div>
            <div className={styles.messageInfoContainer}>
                <div className={styles.messageTop}>
                    <h4>{props.name}</h4>
                    <h5>{new Date().toLocaleDateString()}</h5>
                </div>
                <p className={styles.message}>{props.isVerified ? props.name : "You"}: gara how are you doing aalkj...</p>
            </div>
        </div>
    )
}

export const ChatMessage: React.FunctionComponent<{
    text: string;
    date: string;
    me: boolean;
    recieved: boolean;
    type: "text" | "file"
}> = ({ text, date, me, type, recieved }) => {
    const { on: show, off: toggle } = useToggle()
    let { locale } = useRouter()
    if (!locale) {
        locale = "en"
    }
    return (
        <div className={styles.messageContainer} onClick={toggle}>
            <div className={`${styles.messageInner} ${me ? styles.messageSent : ""} `}>
                {
                    type === "text" ? <p style={{ whiteSpace: "pre-wrap" }}> {text}</p> : < img src={`${IMAGEURL}/${text}`} className={styles.textImage} alt="" />
                }
            </div >
            {
                show && (
                    <p className={me ? styles.messageSent : ""}
                        style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                        {postDateFormat(date, locale)}
                    </p>

                )
            }
            {
                show && recieved ? (
                    <p className={me ? styles.messageSent : ""}
                        style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                        Seen
                    </p>
                ) : show && me ? <p className={me ? styles.messageSent : ""}
                    style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                    Sent
                </p> : null
            }

        </div >
    )
}

export const LandingChatMsg: React.FunctionComponent<{
    text: string;
    date: string;
    me: boolean;
    recieved: boolean;
    type: "text" | "file"
}> = ({ text, date, me, type, recieved }) => {
    const { on: show, off: toggle } = useToggle()
    let { locale } = useRouter()
    if (!locale) {
        locale = "en"
    }
    return (
        <div className={styles.messageContainer} onClick={toggle}>
            <div className={`${styles.messageInner} ${me ? styles.messageSent : ""} `}>
                {
                    type === "text" ? <p style={{ whiteSpace: "pre-wrap" }}> {text}</p>
                        :
                        < img src={text} style={{ width: "min(100%,300px)", objectFit: "cover" }} alt="" />
                }
            </div >
            {
                show && (
                    <p className={me ? styles.messageSent : ""}
                        style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                        {postDateFormat(date, locale)}
                    </p>

                )
            }
            {
                show && recieved ? (
                    <p className={me ? styles.messageSent : ""}
                        style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                        Seen
                    </p>
                ) : show && me ? <p className={me ? styles.messageSent : ""}
                    style={{ backgroundColor: "transparent", color: "var(--accents-5)", fontSize: 12 }}>
                    Sent
                </p> : null
            }

        </div >
    )
}