import { useLayoutEffect } from 'react'
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillBell, AiOutlineHome, AiOutlineUser, AiOutlinePlus } from "react-icons/ai"
import { BsSearch } from "react-icons/bs"
import { FaSearch, FaPlus, FaUser, FaRegQuestionCircle } from "react-icons/fa"
import { MdEmail, MdOutlineMail } from 'react-icons/md'


export default function Navigation() {
    const { pathname } = useRouter()
    useLayoutEffect(() => {

    })
    return (
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
                <div className={styles.postButtonContainer}>
                    <div className={`${styles.navItem}`}>
                        <AiOutlineUser size={25} color="var(--accents-6)"></AiOutlineUser>
                        <p>Request</p>
                    </div>
                    <div className={`${styles.logoContainer2}`}>
                        <em>elwahid</em>
                    </div>
                    <button className={styles.postButton}><AiOutlinePlus />{' '}<span>Post</span></button>
                </div>
            </nav>
        </aside>
    )
}