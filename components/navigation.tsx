import Link from "next/link";
import { useRouter } from "next/router";
import styles from "styles/navigation.module.css"
import { AiFillHome } from "react-icons/ai"


export default function Navigation() {
    const { pathname } = useRouter()
    return (
        <nav className={styles.container}>
            <Link href={"/r/home"}>
                <div className={`${styles.navItem} ${pathname === "/r/home" ? styles.activeNav : null}`}>
                    <AiFillHome></AiFillHome>
                    <h1>Home</h1>
                </div>
            </Link>
            <Link href={"/r/explore"}>
                <div className={`${styles.navItem} ${pathname === "/r/explore" ? styles.activeNav : null}`}>
                    <AiFillHome></AiFillHome>
                    <h1>Explore</h1>
                </div>
            </Link>
            <Link href={"/r/notifacations"}>
                <div className={`${styles.navItem} ${pathname === "/r/notifications" ? styles.activeNav : null}`}>
                    <AiFillHome></AiFillHome>
                    <h1>Notifications</h1>
                </div>
            </Link>
            <Link href={"/r/messages"}>
                <div className={`${styles.navItem} ${pathname === "/r/messages" ? styles.activeNav : null}`}>
                    <AiFillHome></AiFillHome>
                    <h1>Messages</h1>
                </div>
            </Link>
        </nav>
    )
}