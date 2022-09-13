import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import styles from "../../styles/explore.module.css"
import { Post } from "../../components/post"
import { AiFillCloseCircle } from "react-icons/ai"
import tr from "../../i18n/locales/explore..json"
import { useRouter } from "next/router"
import { Langs } from "../../types"
import { SearchCouple, SearchUser } from "../../components/mis"


export default function Explore() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [tab, setTab] = useState("users")
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    return (
        <Layout>

            <div className={styles.main}>
                <section className={styles.exploreContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="search"
                            placeholder={`${localeTr.search} el wahid`}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.currentTarget.value)
                            }} />
                        <FaSearch className={styles.searchIcon} color="var(--accents-3)" />

                        {!!query && (<div className={styles.searchModal}>
                            <div className={styles.searchHeader}>
                                <div className={styles.tabItem} onClick={() => setTab("users")}>
                                    <p>{localeTr.users}</p>
                                    <div className={`${styles.indicator} ${styles.indOne} ${tab === "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={`${styles.tabItem}`} onClick={() => setTab("couples")}>
                                    <p>{localeTr.couples}</p>
                                    <div className={`${styles.indicator} ${styles.indTwo} ${tab !== "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={styles.closeSearch} onClick={() => setQuery("")}>
                                    <AiFillCloseCircle size={30} />
                                </div>
                            </div>
                            <div className={styles.searchResults}>
                                {
                                    tab === "users" ? (
                                        <div style={{ padding: "var(--gap)", overflowY: "auto", height: "85vh" }}>
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Yussif Mohammed" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Yussif Mohammed" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Yussif Mohammed" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Yussif Mohammed" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Yussif Mohammed" picture="/med.jpg" hasPartner />
                                            <SearchUser userName="jane.doe" fullName="Jane Doe" picture="/med.jpg" />
                                            <SearchUser userName="jane.doe" fullName="Foo Bar" picture="/med.jpg" />
                                        </div>
                                    ) : (
                                        <div style={{ padding: "var(--gap)", overflowY: "auto", height: "85vh" }}>
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />
                                            <SearchCouple name="jones.bond" picture="/med.jpg" status="married" verified />

                                        </div>
                                    )
                                }
                            </div>

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
            </div >
        </Layout >
    )
}