import { CSSProperties, useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillBell, AiOutlineHome, AiOutlineUser, AiOutlinePlus, AiFillCloseCircle } from "react-icons/ai"
import { BsSearch } from "react-icons/bs"
import { FaSearch, FaPlus, FaUser, FaRegQuestionCircle } from "react-icons/fa"
import { MdEmail, MdOutlineMail } from 'react-icons/md'
import { IoMdClose } from "react-icons/io"
import AddPost from "./newpost";
import ReactModal from "react-modal";


export default function Navigation() {
    const { pathname } = useRouter()
    const [openRequest, setOpenRequest] = useState(false)
    const [hideHeader, setHideHeader] = useState(false)
    const [openPostModal, setOpenPostModal] = useState(false)

    const modalOverlay: CSSProperties = {
        zIndex: 1,
        backgroundColor: "var(--modal-overlay)",
        paddingInline: "var(--gap)",
        display: "flex",
        flexDirection: "column",
        margin: 0
    }

    useEffect(() => {
        if (window.screen.width < 750 && pathname !== "/r/home") {
            setHideHeader(true)
        }
        window.addEventListener("resize", () => {
            if (window.screen.width < 750 && pathname !== "/r/home") {
                setHideHeader(true)
            } else {
                setHideHeader(false)
            }
        })
    }, [pathname])

    return (
        <>
            <aside className={styles.container}>
                <nav className={styles.nav}>
                    <div className={`${styles.logoContainer}`}>
                        <Link href={"/r/home"}>
                            <em>elwahid</em>
                        </Link>
                    </div>
                    <Link href={"/r/home"}>
                        <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav : null}`}>
                            {
                                pathname === "/r/home" ? <AiFillHome size={25}></AiFillHome> :
                                    <AiOutlineHome size={25} color="var(--accents-6)"></AiOutlineHome>
                            }

                            <p>Home</p>
                        </div>
                    </Link>
                    <Link href={"/r/explore"}>
                        <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav : null}`}>
                            {pathname === "/r/explore" ? <FaSearch size={22}></FaSearch> :
                                <BsSearch size={25} color="var(--accents-6)"></BsSearch>
                            }

                            <p>Explore</p>
                        </div>
                    </Link>
                    <Link href={"/r/notifications"}>
                        <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav : null}`}>
                            {pathname === "/r/notifications" ? <AiFillBell size={25}></AiFillBell> :
                                <AiOutlineBell size={25} color="var(--accents-6)" ></AiOutlineBell>
                            }
                            <p>Notifications</p>
                        </div>
                    </Link>
                    <Link href={"/r/messages"}>
                        <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav : null}`}>
                            {pathname === "/r/messages" ? <MdEmail size={25}></MdEmail> :
                                <MdOutlineMail size={25} color="var(--accents-5)"></MdOutlineMail>
                            }
                            <p>Messages</p>
                        </div>
                    </Link>
                    <Link href={"/user/yussif"}>
                        <div className={`${styles.navItem} ${pathname === "/user/[name]" ? styles.activeNav : null}`}>
                            {pathname === "/user/[name]" ? <FaUser size={25}></FaUser> :
                                <AiOutlineUser size={25} color="var(--accents-6)"></AiOutlineUser>
                            }
                            <p>Profile</p>
                        </div>
                    </Link>
                    {
                        !hideHeader && (
                            <div className={styles.postButtonContainer}>
                                <div className={`${styles.navItem}`} onClick={() => setOpenRequest(true)}>
                                    <AiOutlineUser size={25} color="var(--accents-6)"></AiOutlineUser>
                                    <p>Request</p>
                                </div>
                                <div className={`${styles.logoContainer2}`}>
                                    <em>elwahid</em>
                                </div>
                                <button
                                    className={styles.postButton}
                                    onClick={() => setOpenPostModal(true)}
                                ><AiOutlinePlus />{' '}<span>Post</span></button>
                            </div>
                        )
                    }

                </nav>
            </aside>
            <Modal
                isOpen={openRequest}
                onRequestClose={() => setOpenRequest(false)}
                contentLabel="Post modal"
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
    return (
        <div className={styles.requestModal}>
            <div className={styles.requestHeader}>
                <p>Couple Request</p>
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
                    <h2 data-e2e="user-subtitle" className={styles.realName}>Yussif Mohammed</h2>
                    <h3 className={styles.userName}>@ant.man</h3>
                </div>
                <div className={styles.requestButtons}>
                    <button className={styles.acceptBtn}>Accept</button>
                    <button className={styles.declineBtn}>Decline</button>
                </div>
            </div>

        </div>
    )
}