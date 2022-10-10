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
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../../constants";
import { BsPlusCircleFill } from "react-icons/bs";
import { Loader } from "../../components/mis";

export default function Notifications() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    // const { isLoading, data } = useQuery(["notifications"], () => axios.get(`${BASEURL}/user/notifications/0`))

    const fetchMessages = ({ pageParam = 0 }) => axios.get(`${BASEURL}/user/notifications/${pageParam}`)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["notifications"], fetchMessages,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data) {
                    if (lastPage.data?.pagination.end)
                        return undefined
                }
                return lastPage.data?.pagination.next
            }
        })

    let notifications: any[] = []
    if (data && data.pages) {
        for (let page of data.pages) {
            notifications = notifications.concat(page.data.notifications)
        }
    }
    return (
        <Layout>
            <div className={styles.main}>
                <section className={styles.ntfsContainer}>
                    <Header title={localeTr.notifications} arrow={false} />
                    <div className={styles.ntfs}>
                        {
                            notifications.map((notif: {
                                type: "like" | "comment" | "follow" | "Partner Posted" | "Request Rejected" | "Couple Request" | "Request accepted" | "Mentioned",
                                message: string,
                                post_id: string,
                                title: string,
                                profile: string,
                                name: string
                                user: string
                            }, index) => (
                                <Notification
                                    type={notif.type} message={notif.message}
                                    postId={notif.post_id}
                                    title={localeTr[notif.type]}
                                    name={notif.name}
                                    profilePicture={notif.profile}
                                    user={notif.user}
                                    key={index}
                                />
                            ))
                        }
                        <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} />
                    </div>
                </section>
                <Suggestions />
            </div >
        </Layout >
    )
}



const Notification: React.FunctionComponent<{
    type: "like" | "comment" | "follow" | "Partner Posted" | "Request Rejected" | "Couple Request" | "Request accepted" | "Mentioned",
    message: string,
    postId?: string,
    title: string,
    profilePicture: string,
    name?: string
    user: string
}> = ({ type, message, postId, name, title, profilePicture, user }) => {
    const iconSize = 30

    let icon = <FaHeart size={iconSize} color="var(--error-dark)" />
    switch (type) {
        case "comment":
            icon = <AiFillMessage size={iconSize} color="limegreen" />
            break;
        case "follow":
            icon = <FaUser size={iconSize} color="var(--success)" />
            break
        case "Partner Posted":
            icon = <BsPlusCircleFill size={iconSize} color="var(--success-dark)" />
            break
        default:
            break;
    }

    return (

        <article className={styles.notifContainer}>
            <div className={styles.notifIconContainer}>
                {icon}
            </div>
            <div className={styles.notifInfoContainer}>
                <Link href={`/user/${user}`}>
                    <a>
                        <div className={styles.notifImagesContainer}>
                            <div className={styles.imageContainer} style={{ width: "40px", height: "40px" }}>
                                <span className={styles.avatarContainer} style={{ width: "40px", height: "40px", border: "var(--border)" }}>
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={`${IMAGEURL}/${profilePicture}`}
                                        className={styles.profileImage}
                                    />
                                </span>
                            </div>
                        </div>
                    </a>
                </Link>
                <Link href={type === "follow" ? `/user/${user}` : `/${name}/${postId}`}>
                    <a>
                        <div>
                            <p><strong>{user}</strong> {title}</p>
                        </div>
                        <div style={{ marginTop: "var(--gap-quarter" }}>
                            <p>{message}</p>
                        </div>
                    </a>
                </Link>
            </div>
        </article>

    )
}