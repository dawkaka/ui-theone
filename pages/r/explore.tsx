import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import styles from "../../styles/explore.module.css"
import { Post } from "../../components/post"


export default function Explore() {
    const [query, setQuery] = useState("")
    return (
        <Layout>

            <div className={styles.main}>
                <section className={styles.exploreContainer}>
                    <div className={styles.searchContainer}>
                        <input type="search" placeholder="Search el wahid" onChange={(e) => {
                            setQuery(e.currentTarget.value)
                        }} />
                        <FaSearch className={styles.searchIcon} color="var(--accents-3)" />
                        {
                            !!query && (
                                <div className={styles.searchModal}>

                                </div>
                            )
                        }
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