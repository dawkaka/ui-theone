
import { FaSearch } from "react-icons/fa"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import styles from "../../styles/explore.module.css"
import { Post } from "../../components/post"

export default function Explore() {
    return (
        <Layout>

            <div className={styles.main}>
                <section className={styles.exploreContainer}>
                    <div className={styles.searchContainer}>
                        <input type="search" placeholder="Search el wahid" />
                        <FaSearch className={styles.searchIcon} color="var(--accents-3)" />
                    </div>

                    <div className={styles.ntfs}>
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                    </div>
                </section>
                <Suggestions />
            </div>
        </Layout>
    )
}