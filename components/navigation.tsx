import { CSSProperties, useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillBell, AiOutlineHome, AiOutlineUser, AiOutlinePlus, AiFillCloseCircle } from "react-icons/ai"
import { BsHeartHalf, BsSearch } from "react-icons/bs"
import { FaSearch, FaPlus, FaUser, FaRegQuestionCircle } from "react-icons/fa"
import { MdEmail, MdOutlineMail } from 'react-icons/md'
import { IoMdClose } from "react-icons/io"
import AddPost from "./newpost";
import messages from "../i18n/locales/navigation..json"
import { Langs } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { start } from "repl";
export default function Navigation() {

    const { pathname, locale } = useRouter()
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

    const { isLoading, data } = useQuery(["pending-request"], () => {
        return axios.get(`${BASEURL}/user/u/startup`)
    })
    let startup = { has_partner: false, notifications_count: 0, user_name: "" }
    if (data) {
        startup = { has_partner: data.data.has_partner, notifications_count: data.data.notifications_count, user_name: data.data.user_name }
    }
    return (
        <>
            {hideBottomTab ? "" : <aside className={styles.container}>
                <nav className={styles.nav}>
                    <div className={`${styles.logoContainer}`} aria-label="company logo, el wahid">
                        <Link href={"/r/home"}>
                            <em>elwahid</em>
                        </Link>
                    </div>
                    <Link href={"/r/home"}>
                        <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to home page">
                            <div>
                                {
                                    pathname === "/r/home" ? <AiFillHome size={25}></AiFillHome> :
                                        <AiOutlineHome size={25} color="var(--accents-6)"></AiOutlineHome>
                                }
                            </div>
                            <p>{cMessages.home}</p>
                        </div>
                    </Link>
                    <Link href={"/r/explore"}>
                        <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to explore page">
                            <div>
                                {pathname === "/r/explore" ? <FaSearch size={25}></FaSearch> :
                                    <BsSearch size={22} color="var(--accents-6)"></BsSearch>
                                }
                            </div>

                            <p>{cMessages.explore}</p>
                        </div>
                    </Link>
                    <Link href={"/r/notifications"}>
                        <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav : null}`} tabIndex={0} aria-label="got to notifications page">
                            <div style={{ position: "relative" }}>
                                {pathname === "/r/notifications" ? <AiFillBell size={25}></AiFillBell> :
                                    <AiOutlineBell size={25} color="var(--accents-6)" ></AiOutlineBell>
                                }
                                <p
                                    style={{
                                        position: "absolute", top: 0,
                                        right: "-4px", backgroundColor: "red",
                                        color: "white", fontSize: "12px", borderRadius: "50%",
                                        padding: "2px 5px"

                                    }}
                                >{startup.notifications_count}</p>
                            </div>
                            <p>{cMessages.notifications}</p>
                        </div>
                    </Link>
                    {startup.has_partner && (<Link href={"/r/messages"}>
                        <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to messages page">
                            <div>
                                {pathname === "/r/messages" ? <MdEmail size={25}></MdEmail> :
                                    <MdOutlineMail size={26} color="var(--accents-5)"></MdOutlineMail>
                                }
                            </div>
                            <p>{cMessages.messages}</p>
                        </div>
                    </Link>)
                    }
                    <Link href={`/user/${startup.user_name}`}>
                        <div className={`${styles.navItem} ${pathname === "/user/[name]" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to your profile page">
                            <div>
                                {pathname === "/user/[name]" ? <FaUser size={25}></FaUser> :
                                    <AiOutlineUser size={25} color="var(--accents-6)"></AiOutlineUser>
                                }
                            </div>
                            <p>{cMessages.profile}</p>
                        </div>
                    </Link>
                    {
                        !hideHeader && (
                            <div className={styles.postButtonContainer}>
                                {
                                    !startup.has_partner && <div className={`${styles.navItem}`} onClick={() => setOpenRequest(true)} tabIndex={0} aria-label="Check couple request">
                                        <div><BsHeartHalf size={25} color="var(--accents-6)" /></div>
                                        <p>{cMessages.request}</p>
                                    </div>
                                }
                                <div className={`${styles.logoContainer2}`}>
                                    <em>elwahid</em>
                                </div>
                                <button

                                    aria-label="add a new post"
                                    style={{ opacity: startup.has_partner ? 1 : 0.5 }}
                                    className={styles.postButton}
                                    onClick={() => {
                                        if (!startup.has_partner) return
                                        setOpenPostModal(true)
                                    }}
                                ><AiOutlinePlus /><span>{' '}{cMessages.post}</span></button>
                            </div>
                        )
                    }

                </nav>
            </aside>
            }
            <Modal
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
                        overflow: "hidden",
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

    const { isLoading, data } = useQuery(["pending-request"], () => {
        return axios.get(`${BASEURL}/user/u/pending-request`)
    })

    const requestMutation = useMutation(
        (action: string) => {
            return axios.post(`${BASEURL}/${action}`)
        }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['pending-request'])

        },
        onError: (err) => console.log(err)

    })

    console.log(data)
    return (
        <div className={styles.requestModal} aria-label="couple request modal">
            <div className={styles.requestHeader} id="full_description">
                <p aria-label="New couple request sent to you" role={"heading"}>{tr.couplerequest}</p>
                <div onClick={() => close()}
                    className={styles.closeContainer}
                >
                    <IoMdClose color="tranparent" size={25} />
                </div>
            </div>
            <div className={styles.requestContainer}>
                {isLoading ? <h1>loading...</h1> :
                    data?.data.request == null ? <h1>No pending requests</h1> :
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={`${IMAGEURL}/${data?.data.request.profile_picture}`}
                                    className={styles.profileImage}
                                />
                            </div>
                            <div className={styles.titleContainer}>
                                <h2 tabIndex={0} aria-label="Name of the person that sent you the couple request is Yussif Mohammed" className={styles.realName}>
                                    {data?.data.request.first_name} {data?.data.request.Last_naem}
                                </h2>
                                <h3 tabIndex={0} aria-label="Their unique user name is ant.man" className={styles.userName}>@{data?.data.request.user_naame}</h3>
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
                                                onClick={() => requestMutation.mutate(`couple/new/${data.data.request.id}`)}
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