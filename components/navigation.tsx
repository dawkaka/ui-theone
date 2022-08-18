import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/navigation.module.css"
import { AiFillHome, AiOutlineBell, AiFillMessage, AiOutlineSearch, AiFillBell, AiFillBehanceSquare} from "react-icons/ai"

export default function Navigation() {
    const { pathname } = useRouter()
    //const isActive =  true : false
    return (
        <nav className={styles.container}>
            <Link href={"/r/home"}>
                 <div className={`${styles.navItem} ${styles.activeNav}`}>
                    <AiFillHome size= {25}></AiFillHome>
                </div>
            </Link>
            <Link href={"/r/home"}>
                <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav: null}`}>
                    <AiFillHome size= {25}></AiFillHome>
                    <p>Home</p>
                </div>
            </Link>
            <Link href={"/r/explore"}>
                <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav: null}`}>
                    {pathname === "/r/explore"  ?   <AiOutlineSearch size={25}></AiOutlineSearch> :
                     <AiOutlineSearch size={25}></AiOutlineSearch>
                    }
                   
                    <p>Explore</p>
                </div>
            </Link>
            <Link href={"/r/notifications"}>
                <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav: null}`}>
                     {pathname === "/r/notifications" ? <AiFillBell size={25}></AiFillBell> :
                     <AiOutlineBell size={25}></AiOutlineBell>
                     }
                    <p>Notifications</p>
                </div>
            </Link>
            <Link href={"/r/messages"}>
                <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav: null}`}>
                    {pathname === "/r/messages" ? <AiFillMessage size={25}></AiFillMessage>:
                    <AiFillMessage size={25}></AiFillMessage>
                    }
                    <p>Messages</p>
                </div>
            </Link>
        </nav>
    )
}