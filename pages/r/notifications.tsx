import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/notifications.module.css"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import Header from "../../components/pageHeader"
import { FaHeart, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/notifications.json"
import { Langs } from "../../types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../../constants";

export default function Notifications() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const { isLoading, data } = useQuery(["notifications"], () => axios.get(`${BASEURL}/user/notifications/0`))
    console.log(data)
    return (
        <Layout>
            <div className={styles.main}>
                <section className={styles.ntfsContainer}>
                    <Header title={localeTr.notifications} arrow={false} />
                    <div className={styles.ntfs}>
                        {
                            data?.data.notifications.map((notif: any) => (
                                <Notification type={notif.type} message={notif.message} />
                            ))
                        }
                    </div>
                </section>
                <Suggestions />
            </div>
        </Layout>
    )
}



const Notification: React.FunctionComponent<{
    type?: "like" | "comment" | "follow",
    message: string
}> = ({ type, message }) => {

    let icon = <FaHeart size={30} color="var(--error-dark)" />
    if (type === "comment") {
        icon = <AiFillMessage size={30} color="limegreen" />
    } else if (type === "follow") {
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
                            <p>{message}</p>
                        </div>
                    </div>
                </article>
            </a>
        </Link>
    )
}