import { CSSProperties, useEffect, useState } from 'react'
import Image from "next/image";
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
            if (pathname === "/r/messages") setHideBottomTab(true)
            if (pathname === "/[copulename]/[postId]") setHideBottomTab(true)
        }

        window.addEventListener("resize", () => {
            if (window.screen.width < 751) {
                if (pathname !== "/r/home") setHideHeader(true)
                if (pathname === "/r/messages") setHideBottomTab(true)
                if (pathname === "/[couplename]/[postId]") setHideBottomTab(true)
            } else {
                setHideHeader(false)
                setHideBottomTab(false)
            }
        })
    }, [pathname])

    return (
        <>
            {hideBottomTab ? null : <aside className={styles.container}>
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
                                {pathname === "/r/explore" ? <FaSearch size={22}></FaSearch> :
                                    <BsSearch size={25} color="var(--accents-6)"></BsSearch>
                                }
                            </div>

                            <p>{cMessages.explore}</p>
                        </div>
                    </Link>
                    <Link href={"/r/notifications"}>
                        <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav : null}`} tabIndex={0} aria-label="got to notifications page">
                            <div>
                                {pathname === "/r/notifications" ? <AiFillBell size={25}></AiFillBell> :
                                    <AiOutlineBell size={25} color="var(--accents-6)" ></AiOutlineBell>
                                }
                            </div>
                            <p>{cMessages.notifications}</p>
                        </div>
                    </Link>
                    <Link href={"/r/messages"}>
                        <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav : null}`} tabIndex={0} aria-label="go to messages page">
                            <div>
                                {pathname === "/r/messages" ? <MdEmail size={25}></MdEmail> :
                                    <MdOutlineMail size={25} color="var(--accents-5)"></MdOutlineMail>
                                }
                            </div>
                            <p>{cMessages.messages}</p>
                        </div>
                    </Link>
                    <Link href={"/user/yussif"}>
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
                                <div className={`${styles.navItem}`} onClick={() => setOpenRequest(true)} tabIndex={0} aria-label="Check couple request">
                                    <div><BsHeartHalf size={25} color="var(--accents-6)" /></div>
                                    <p>{cMessages.request}</p>
                                </div>
                                <div className={`${styles.logoContainer2}`}>
                                    <em>elwahid</em>
                                </div>
                                <button
                                    aria-label="add a new post"
                                    className={styles.postButton}
                                    onClick={() => setOpenPostModal(true)}
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
                <Request close={() => setOpenRequest(false)} />

            </Modal>
            <AddPost isOpen={openPostModal} open={() => setOpenPostModal(true)} close={() => setOpenPostModal(false)} />
        </>
    )
}



const Request: React.FunctionComponent<{ close: () => void }> = ({ close }) => {
    const { locale } = useRouter()
    const tr = locale ? messages[locale as Langs] : messages["en"]
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
                <div className={styles.imageContainer}>
                    <img
                        src={"/med.jpg"}
                        className={styles.profileImage}
                    />
                </div>
                <div className={styles.titleContainer}>
                    <h2 tabIndex={0} aria-label="Name of the person that sent you the couple request is Yussif Mohammed" className={styles.realName}>Yussif Mohammed</h2>
                    <h3 tabIndex={0} aria-label="Their unique user name is ant.man" className={styles.userName}>@ant.man</h3>
                </div>
                <div className={styles.requestButtons}>
                    <button aria-label={tr.accept + tr.couplerequest} className={styles.acceptBtn}>{tr.accept}</button>
                    <button aria-label={tr.decline + tr.couplerequest} className={styles.declineBtn}>{tr.decline}</button>
                </div>
            </div>

        </div>
    )
}