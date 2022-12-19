import { CSSProperties, useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillBell, AiOutlineHome, AiOutlineUser, AiOutlinePlus } from "react-icons/ai"
import { BsBell, BsBellFill, BsChatSquare, BsChatSquareFill, BsHeartHalf, BsSearch } from "react-icons/bs"
import { FaUser } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import AddPost from "./newpost";
import messages from "../i18n/locales/navigation..json"
import { Langs } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { NotFound } from "./notfound";
import { Loading } from "./mis";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";

export default function Navigation() {

    const { pathname, locale, query } = useRouter()
    const [openRequest, setOpenRequest] = useState(false)
    const [hideHeader, setHideHeader] = useState(false)
    const [openPostModal, setOpenPostModal] = useState(false)
    const [hideBottomTab, setHideBottomTab] = useState(false)

    const modalOverlay: CSSProperties = {
        zIndex: 1,
        backgroundColor: "var(--modal-overlay)",
        paddingInline: "var(--gap)",
        display: "flex",
        flexDirection: "column",
        margin: 0
    }

    const cMessages = locale ? messages[locale as Langs] : messages["en"]

    useEffect(() => {
        if (window.screen.width < 751) {
            if (pathname !== "/r/home") setHideHeader(true)
            if (pathname === "/r/messages" || pathname === "/[couplename]/[postId]" || pathname === "/[couplename]") {
                setHideBottomTab(true)
            }
        }

        window.addEventListener("resize", () => {
            if (window.screen.width < 751) {
                if (pathname !== "/r/home") setHideHeader(true)
                if (pathname === "/r/messages" || pathname === "/[couplename]/[postId]" || pathname === "/[couplename]") {
                    setHideBottomTab(true)
                }
            } else {
                setHideHeader(false)
                setHideBottomTab(false)
            }
        })

    }, [pathname])

    const { data } = useQuery(["startup"], () => {
        return axios.get(`${BASEURL}/user/u/startup`)
    }, { staleTime: 10000 })
    let startup = {
        has_partner: false,
        notifications_count: 0,
        user_name: "",
        new_posts_count: 0,
        new_messages_count: 0,
        pending_request: 0
    }
    if (data) {
        startup = {
            new_posts_count: data.data.new_posts_count,
            has_partner: data.data.has_partner,
            notifications_count: data.data.notifications_count,
            user_name: data.data.user_name,
            new_messages_count: data.data.new_messages_count,
            pending_request: data.data.pending_request

        }
    }
    const iconSize = 25
    return (
        <>
            {hideBottomTab ? "" : <aside className={styles.container}>
                <nav className={styles.nav}>
                    <div className={`${styles.logoContainer}`} aria-label="company logo, Prime Couples">
                        <Link href={"/r/home"} scroll={false}>
                            <a style={{ fontWeight: "bold" }}>Prime Couples</a>
                        </Link>
                    </div>
                    <Link href={"/r/home"} scroll={false}>
                        <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to home page">
                            <div style={{ position: "relative" }}>
                                {
                                    pathname === "/r/home" ? <AiFillHome size={iconSize}></AiFillHome> :
                                        <AiOutlineHome size={iconSize} color="var(--accents-6)"></AiOutlineHome>
                                }
                                {startup.new_posts_count > 0 && (<p
                                    style={{
                                        position: "absolute", top: 0,
                                        right: "-4px", backgroundColor: "var(--success)",
                                        color: "white", fontSize: "10px", borderRadius: "50%",
                                        padding: "2px 5px"

                                    }}
                                >{startup.new_posts_count > 10 ? "10+" : startup.new_posts_count}</p>
                                )
                                }
                            </div>

                            <p>{cMessages.home}</p>
                        </div>
                    </Link>
                    <Link href={"/r/explore"} scroll={false}>
                        <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to explore page">
                            <div>
                                {pathname === "/r/explore" ? <RiSearchFill size={iconSize} color="var(--success)" />
                                    :
                                    <RiSearchLine size={iconSize} color="var(--accents-6)" />
                                }
                            </div>

                            <p>{cMessages.explore}</p>
                        </div>
                    </Link>
                    <Link href={"/r/notifications"}>
                        <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav : null}`} tabIndex={0} aria-label="got to notifications page">
                            <div style={{ position: "relative" }}>
                                {pathname === "/r/notifications" ? <BsBellFill size={23} /> :
                                    <BsBell size={23} color="var(--accents-6)" />
                                }
                                {startup.notifications_count > 0 && (<p
                                    style={{
                                        position: "absolute", top: 0,
                                        right: "-4px", backgroundColor: "red",
                                        color: "white", fontSize: "10px", borderRadius: "50%",
                                        padding: "2px 5px"

                                    }}
                                >{startup.notifications_count > 10 ? "10+" : startup.notifications_count}</p>
                                )
                                }
                            </div>
                            <p>{cMessages.notifications}</p>
                        </div>
                    </Link>
                    {startup.has_partner && (<Link href={"/r/messages"}>
                        <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to messages page">
                            <div style={{ position: "relative" }}>
                                {pathname === "/r/messages" ? <BsChatSquareFill size={21} /> :
                                    <BsChatSquare size={21} color="var(--accents-6)" />
                                }
                                {startup.new_messages_count > 0 && (<p
                                    style={{
                                        position: "absolute", top: 0,
                                        right: "-4px", backgroundColor: "red",
                                        color: "white", fontSize: "10px", borderRadius: "50%",
                                        padding: "2px 5px"

                                    }}
                                >{startup.new_messages_count > 10 ? "10+" : startup.new_messages_count}</p>
                                )
                                }
                            </div>
                            <p>{cMessages.messages}</p>
                        </div>
                    </Link>)
                    }
                    <Link href={`/user/${startup.user_name}`} scroll={false}>
                        <div className={`${styles.navItem} ${pathname === "/user/[name]" && query.name === startup.user_name ? styles.activeNav : null}`} tabIndex={0} aria-label="go to your profile page">
                            <div>
                                {pathname === "/user/[name]" && query.name === startup.user_name ? <FaUser size={iconSize}></FaUser> :
                                    <AiOutlineUser size={iconSize} color="var(--accents-6)"></AiOutlineUser>
                                }
                            </div>
                            <p>{cMessages.profile}</p>
                        </div>
                    </Link>

                    {

                        !hideHeader && (

                            <div className={styles.postButtonContainer}>
                                {
                                    !startup.has_partner && <div
                                        className={`${styles.navItem}`} onClick={() => setOpenRequest(true)}
                                        tabIndex={0} aria-label="Check couple request" >
                                        <div style={{ position: "relative" }}>
                                            <BsHeartHalf size={iconSize} color="var(--accents-6)" />
                                            {
                                                startup.pending_request > 0 && (
                                                    <div
                                                        style={{
                                                            position: "absolute", top: 0,
                                                            right: "-4px", backgroundColor: "var(--success)",
                                                            borderRadius: "50%",
                                                            padding: "5px 5px"

                                                        }}
                                                    ></div>
                                                )
                                            }
                                        </div>
                                        <p>{cMessages.request}</p>

                                    </div>
                                }
                                <div className={`${styles.logoContainer2}`}>
                                    <Link href={"/r/home"} scroll={false}>
                                        <a style={{ fontWeight: "bold" }}>Prime Couples</a>
                                    </Link>
                                </div>
                                <button

                                    aria-label="add a new post"
                                    style={{ opacity: startup.has_partner ? 1 : 0.5 }}
                                    className={styles.postButton}
                                    onClick={() => {
                                        if (!startup.has_partner) return
                                        setOpenPostModal(true)
                                    }}
                                ><div className={styles.addPlus}><AiOutlinePlus /></div><span>{' '}{cMessages.post}</span></button>
                            </div>
                        )
                    }

                </nav>
            </aside>
            }
            <Modal
                closeTimeoutMS={400}
                isOpen={openRequest}
                onRequestClose={() => setOpenRequest(false)}
                contentLabel="Post modal"
                aria={{
                    labelledby: "Couple request",
                    describedby: "full_description"
                }}
                style={{
                    overlay: modalOverlay,
                    content: {
                        alignSelf: "center",
                        position: "relative",
                        padding: 0,
                        margin: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        left: 0,
                        border: "none",
                    }
                }}
            >
                {!startup.has_partner && <Request close={() => setOpenRequest(false)} />}

            </Modal>
            <AddPost isOpen={openPostModal} open={() => setOpenPostModal(true)} close={() => setOpenPostModal(false)} />
        </>
    )
}



const Request: React.FunctionComponent<{ close: () => void }> = ({ close }) => {
    const { locale } = useRouter()
    const tr = locale ? messages[locale as Langs] : messages["en"]
    const queryClient = useQueryClient()

    const { isLoading, data, isError } = useQuery(["pending-request"], () => {
        return axios.get(`${BASEURL}/user/u/pending-request`)
    })

    const requestMutation = useMutation(
        (action: string) => {
            return axios.post(`${BASEURL}/${action}`)
        }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-request'])

        },

    })

    return (
        <div className={styles.requestModal} aria-label="couple request modal">
            <div className={styles.requestHeader} id="full_description">
                <p aria-label="New couple request sent to you">{tr.couplerequest}</p>
                <div onClick={() => close()}
                    className={styles.closeContainer}
                >
                    <IoMdClose color="tranparent" size={25} />
                </div>
            </div>
            <div className={styles.requestContainer}>
                {isLoading ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Loading size="medium" color="var(--success)" /></div> :
                    !data?.data.request ? <NotFound type="request" /> :
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={`${IMAGEURL}/${data?.data.request.profile_picture}`}
                                    className={styles.profileImage}
                                    alt=""
                                />
                            </div>
                            <div className={styles.titleContainer}>
                                <h2 tabIndex={0} aria-label="Name of the person that sent you the couple request is Yussif Mohammed" className={styles.realName}>
                                    {data?.data.request.first_name} {data?.data.request.last_name}
                                </h2>
                                <h3 tabIndex={0} aria-label="Their unique user name is ant.man" className={styles.userName}>@{data?.data.request.user_name}</h3>
                            </div>
                            <div className={styles.requestButtons}>
                                {
                                    data?.data.request.pending_request === 2 ?
                                        <button aria-label={tr.decline + tr.couplerequest}
                                            className={styles.declineBtn}
                                            onClick={() => requestMutation.mutate("user/u/cancel-request")}
                                        >
                                            {tr.cancel}
                                        </button>
                                        :
                                        <>
                                            < button
                                                aria-label={tr.accept + tr.couplerequest}
                                                className={styles.acceptBtn}
                                                onClick={() => requestMutation.mutate(`couple/new/${data?.data.request.id}`)}
                                            >
                                                {tr.accept}
                                            </button>
                                            <button
                                                aria-label={tr.decline + tr.couplerequest}
                                                className={styles.declineBtn}
                                                onClick={() => requestMutation.mutate("user/u/reject-request")}
                                            >{tr.decline}</button>
                                        </>
                                }

                            </div>
                        </>
                }
            </div>

        </div >
    )
}