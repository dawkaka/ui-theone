import Image from "next/image"
import styles from "../../styles/messages.module.css"
import Layout from "../../components/mainLayout"
import { FaAdjust, FaFile, FaFly } from "react-icons/fa";

export default function Messages() {
    return (
        <Layout>
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
                            <ChatUser name="dawkaka" avatar="/me4.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                            <ChatUser name="dawkaka" avatar="/me.jpg" isVerified />
                        </div>
                        <div></div>
                    </section>
                    <section className={styles.chatContainer}>
                        <div className={styles.header}>
                            <h3>Messaging</h3>
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
                                    className={styles.textArea} placeholder="Type message"
                                >

                                </textarea>
                            </div>
                            <div className={styles.messageControls}>
                                <FaFile size={30} />
                                <FaFly size={30} />
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