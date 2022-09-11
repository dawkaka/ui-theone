import Image from "next/image";
import styles from "../../styles/messages.module.css";
import Layout from "../../components/mainLayout";
import { GoFileMedia } from "react-icons/go";
import { AiOutlineSend } from 'react-icons/ai';
import { FaBackward } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/messages.json"
import { Langs } from "../../types";

export default function Messages() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
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
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="I don't do guarantess ahsdfa dalfja; adalkf" me />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" me />
                            <ChatMessage text="hello world !!!" me />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" me />
                            <ChatMessage text="hello world !!!" me />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="I don't do guarantess ahsdfa dalfja; adalkf" me />
                            <ChatMessage text="hello world !!!" />
                            <ChatMessage text="hello world !!!d" me />
                        </div>
                        <div className={styles.writeMessageContainer}>
                            <div className={styles.textAreaContainer}>
                                <textarea
                                    onKeyUp={(e) => {
                                        e.currentTarget.style.height = "1px";
                                        e.currentTarget.style.height = (20 + e.currentTarget.scrollHeight) + "px";
                                    }}
                                    className={styles.textArea} placeholder={localeTr.writeMessage}
                                >

                                </textarea>
                            </div>
                            <div className={styles.messageControls}>
                                <GoFileMedia size={30} color="var(--accents-6)" />
                                <AiOutlineSend size={30} color="var(--success)" />
                            </div>
                        </div>
                    </section>
                </div>
            </div >

        </Layout >
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