import Image from "next/image";
import styles from "../../styles/messages.module.css";
import Layout from "../../components/mainLayout";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/messages.json"
import { Langs } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../../constants";
import { useTheme } from "../../hooks";
import { FormEvent, useState } from "react";
import emTr from "../../i18n/locales/components/emoji.json"
import dynamic from "next/dynamic";
import { Categories, EmojiStyle } from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { GoFileMedia } from "react-icons/go";


const Picker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    { ssr: false }
);


export default function Messages() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const { isLoading, data } = useQuery(["messages"], () => axios.get(`${BASEURL}/couple/p-messages/0`))
    const messages = data?.data.messages || []
    console.log(messages)

    return (
        <Layout>
            <div className={styles.messagePageContainer}>
                <div className={styles.messagingContainer}>
                    <section className={styles.chatContainer}>
                        <div className={styles.header}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--gap)"
                            }}>
                                <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                                    <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                        <Image
                                            layout="fill"
                                            objectFit="cover"
                                            src={"/me.jpg"}
                                            className={styles.profileImage}
                                        />
                                    </span>
                                </div>
                                <h4>john.doe</h4>
                            </div>
                            <div onClick={() => router.back()} className={styles.backIcon}>
                                <BiArrowBack />
                            </div>
                        </div>
                        <div className={styles.pmWrapper}>
                            {
                                messages.map((message: any, index: number) => {
                                    return (
                                        <ChatMessage
                                            text={message.message} me={message.from === "63418496b2458f195b3b91ec"}
                                            date={message.date} type={message.type} key={index} />
                                    )
                                })
                            }

                        </div>
                        <div className={styles.writeMessageContainer}>
                            <div className={styles.textAreaContainer}>
                                <TextArea />
                            </div>

                        </div>
                    </section>
                </div>
            </div >

        </Layout >
    )
}


const TextArea: React.FunctionComponent = () => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const emojiTr = emTr[locale as Langs]
    const [openEmoji, setOpenEmoji] = useState(false)
    const [comment, setComment] = useState("")
    const theme = useTheme()

    const { mutate, isLoading } = useMutation(
        (comment: string) => {
            return axios.post(`${BASEURL}/post/comment/`, JSON.stringify({ comment }))
        },
        {
            onSuccess: data => {
                setComment("")
            },
            onError: err => console.log(err)
        }
    )

    const postComment = (e: FormEvent) => {
        e.preventDefault()
        if (isLoading || comment === "") return
        e.preventDefault()
        mutate(comment)
    }

    return (
        <>
            <form
                onSubmit={postComment}
                className={styles.commentContainer}
            >
                <div onClick={() => setOpenEmoji(!openEmoji)} style={{ display: "grid", placeItems: "center" }}>
                    <BsEmojiSmile size={20} />
                </div>
                <textarea aria-label="" placeholder={"Write message" + "..."}
                    autoComplete="off" autoCorrect="off"
                    onKeyUp={(e) => {
                        e.currentTarget.style.height = "1px";
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                    }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={() => setOpenEmoji(false)}
                ></textarea>

                <div>
                    {
                        comment === "" ? <div style={{ display: "grid", placeItems: "center" }}> <GoFileMedia size={20} /> </div> : <button>{isLoading ? "posting" : "send"}</button>
                    }
                </div>

            </form>
            {
                openEmoji && <div style={{ position: "absolute", bottom: "60px" }}>
                    <Picker
                        onEmojiClick={(emojiObject) => setComment(comment + emojiObject.emoji)}
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
        <div className={`${styles.chatItemContainer} ${!props.isVerified ? styles.chatItemActive : ""}`}>
            <div className={styles.imageContainer} style={{ width: "60px", height: "60px" }}>
                <span className={styles.avatarContainer} style={{ width: "60px", height: "60px" }}>
                    <Image
                        layout="fill"
                        objectFit="cover"
                        src={props.avatar}
                        className={styles.profileImage}
                    />
                </span>
            </div>
            <div className={styles.messageInfoContainer}>
                <div className={styles.messageTop}>
                    <h4>{props.name}</h4>
                    <h5>{new Date().toLocaleDateString()}</h5>
                </div>
                <p className={styles.message}>{props.isVerified ? props.name : "You"}: gara how are you doing aalkj adhdl that fore the from and aow lww want let you know</p>
            </div>
        </div>
    )
}

const ChatMessage: React.FunctionComponent<{
    text: string;
    date: Date;
    me: boolean;
    type: "text" | "file"
}> = ({ text, date, me, type }) => {
    return (
        <div className={styles.messageContainer}>
            <div className={`${styles.messageInner} ${me ? styles.messageSent : ""}`}>
                <p>{text}</p>
            </div>
        </div>
    )
}