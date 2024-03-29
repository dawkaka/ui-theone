import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/notifications.module.css"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import Header from "../../components/pageHeader"
import { FaAt, FaHeart, FaTimes, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/notifications.json"
import { Langs } from "../../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../../constants";
import { BsHeartFill, BsHeartHalf, BsPlusCircleFill } from "react-icons/bs";
import { Loader, Loading } from "../../components/mis";
import { RiHeartsFill } from "react-icons/ri";
import { useRef } from "react";
import { NotFound } from "../../components/notfound";
import Head from "next/head";

export default function Notifications() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const clearedRef = useRef(false)
    const fetchNotifs = ({ pageParam = 0 }) => axios.get(`${BASEURL}/user/notifications/${pageParam}`).then(res => res.data)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["notifications"], fetchNotifs,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage) {
                    if (lastPage.pagination.end) {
                        return undefined
                    }
                }
                return lastPage.pagination.next
            },
        })

    let notifications: any[] = []
    if (data && data.pages) {
        for (let page of data.pages) {
            notifications = notifications.concat(page.notifications)
        }
    }
    if (data && !clearedRef.current) {
        axios.put(`${BASEURL}/user/new-notifications`).then(() => { clearedRef.current = true }).catch(() => { })
    }
    return (
        <Layout>
            <Head>
                <title>{localeTr.title}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            <div className={styles.main}>
                <section className={styles.ntfsContainer}>
                    <Header title={localeTr.notifications} arrow={false} />
                    <div className={styles.ntfs}>
                        {
                            notifications.length === 0 && !isLoading ? <NotFound type="notifications" /> : null
                        }
                        {
                            notifications.length === 0 && isLoading ?
                                <div style={{ display: "flex", justifyContent: "center" }}> <Loading color="var(--success)" size="medium" /></div>
                                :
                                null
                        }
                        {
                            notifications.map((notif: {
                                type: "like" | "comment" | "follow" | "Partner Posted" | "Request Rejected" | "Couple Request" | "Request Accepted" | "Mentioned",
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
                                    isNew={index < data?.pages[0].new_count}
                                    key={index}
                                />
                            ))

                        }
                        <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} manual={false} />
                    </div>
                </section>
                <Suggestions />
            </div >
        </Layout >
    )
}



const Notification: React.FunctionComponent<{
    type: "like" | "comment" | "follow" | "Partner Posted" | "Request Rejected" | "Couple Request" | "Request Accepted" | "Mentioned",
    message: string,
    postId?: string,
    title: string,
    profilePicture: string,
    name?: string,
    isNew: boolean,
    user: string
}> = ({ type, message, postId, name, title, profilePicture, user, isNew }) => {
    const iconSize = 30

    let icon: JSX.Element
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
        case "Couple Request":
            icon = <BsHeartHalf size={iconSize} color="var(--error)" />
            break
        case "Request Rejected":
            icon = <FaTimes size={iconSize} color="var(--error)" />
            break
        case "Request Accepted":
            icon = <RiHeartsFill size={iconSize} color="var(--error)" />
            break
        case "Mentioned":
            icon = <FaAt size={iconSize} color="var(--success-dark)" />
            break
        default:
            icon = <BsHeartFill size={25} color="var(--error)" />
    }
    return (
        <article className={styles.notifContainer} style={{ backgroundColor: isNew ? "var(--accents-2)" : "" }}>
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
                                        alt="User's profile"
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