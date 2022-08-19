import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillBell, AiOutlineHome, AiOutlineUser} from "react-icons/ai"
import {BsSearch} from "react-icons/bs"
import {FaSearch, FaPlus, FaUser} from "react-icons/fa"
import {MdEmail,MdOutlineMail} from 'react-icons/md'


export default function Navigation() {
    const { pathname } = useRouter()
    return (
        <div className={styles.container}>
        <nav>
            <Link href={"/r/home"}>
                 <div className={`${styles.logoContainer}`}>
                    <em>elwahid</em>
                </div>
            </Link>
            <Link href={"/r/home"}>
                <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav: null}`}>
                    {
                        pathname === "/r/home" ? <AiFillHome size= {25}></AiFillHome> :
                        <AiOutlineHome size={25}></AiOutlineHome>
                    }
                    
                    <li>Home</li>
                </div>
            </Link>
            <Link href={"/r/explore"}>
                <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav: null}`}>
                    {pathname === "/r/explore"  ?   <FaSearch size={25}></FaSearch> :
                     <BsSearch size={25}></BsSearch>
                    }
                   
                    <li>Explore</li>
                </div>
            </Link>
            <Link href={"/r/notifications"}>
                <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav: null}`}>
                     {pathname === "/r/notifications" ? <AiFillBell size={25}></AiFillBell> :
                     <AiOutlineBell size={25}></AiOutlineBell>
                     }
                    <li>Notifications</li>
                </div>
            </Link>
            <Link href={"/r/messages"}>
                <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav: null}`}>
                    {pathname === "/r/messages" ? <MdEmail size={25}></MdEmail>:
                    <MdOutlineMail size={25}></MdOutlineMail>
                    }
                    <li>Messages</li>
                </div>
            </Link>
            <Link href={"/user/yussif"}>
                <div className={`${styles.navItem} ${pathname === "/user/[name]" ? styles.activeNav: null}`}>
                    {pathname === "/user/[name]" ? <FaUser size={25}></FaUser>:
                    <AiOutlineUser size={25}></AiOutlineUser>
                    }
                    <li>Profile</li>
                </div>
            </Link>
        </nav>
        <div className={styles.postButtonContainer}> 
            <button className={styles.postButton}><FaPlus></FaPlus>{' '}<span>Post</span></button>
        </div>
        </div>
    )
}