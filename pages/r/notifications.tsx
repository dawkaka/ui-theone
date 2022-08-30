import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/notifications.module.css"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import Header from "../../components/pageHeader"
import { FaAccessibleIcon, FaHeart, FaUser, FaUserAlt } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai";

export default function Notifications() {
    return (
        <Layout>
            <div className={styles.main}>

                <section className={styles.ntfsContainer}>
                    <Header title="Notifications" />
                    <div className={styles.ntfs}>
                        <Notification />
                        <Notification type="comment" />
                        <Notification />
                        <Notification type="follower" />
                        <Notification />
                        <Notification />
                        <Notification />
                        <Notification />
                        <Notification />
                        <Notification />
                        <Notification />
                        <Notification />
                    </div>
                </section>
                <Suggestions />
            </div>
        </Layout>
    )
}




const Notification: React.FunctionComponent<{
    type?: "like" | "comment" | "follower"
}> = ({ type }) => {

    let icon = <FaHeart size={30} color="var(--error-dark)" />
    if (type === "comment") {
        icon = <AiFillMessage size={30} color="limegreen" />
    } else if (type === "follower") {
        icon = <FaUser size={30} color="var(--success)" />
    }
    return (
        <Link href="/water/blue">
            <a>
                <article className={styles.notifContainer}>
                    <div className={styles.notifIconContainer}>
                        {icon}
                    </div>
                    <div className={styles.notifInfoContainer}>
                        <div className={styles.notifImagesContainer}>
                            <div className={styles.imageContainer} style={{ width: "40px", height: "40px" }}>
                                <span className={styles.avatarContainer} style={{ width: "40px", height: "40px" }}>
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={"/me.jpg"}
                                        className={styles.profileImage}
                                    />
                                </span>
                            </div>
                        </div>
                        <div>
                            <p>
                                <span className={styles.userName}>jon.doe</span>,
                                <span className={styles.userName}> silvia_saige</span>
                                {' '}and <span className={styles.userName}>47 others </span>liked you post
                            </p>
                        </div>
                        <div style={{ marginTop: "var(--gap-quarter" }}>
                            <p>Hello world I'm suraj</p>
                        </div>
                    </div>
                </article>
            </a>
        </Link>
    )
}