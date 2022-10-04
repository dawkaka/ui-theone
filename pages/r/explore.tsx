import { useEffect, useRef, useState } from "react"
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
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BASEURL, IMAGEURL } from "../../constants"


export default function Explore() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [tab, setTab] = useState<"users" | "couples">("users")
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const scrollRef = useRef<HTMLDivElement>(null)
    const tabScrollRef = useRef(false)

    useEffect(() => {

        const scrollFunc = () => {
            if (tabScrollRef.current) return
            let width = window.getComputedStyle(scrollRef.current!).width
            width = width.substring(0, width.length - 2)
            let scrolldiff = Number(width) - scrollRef.current!.scrollLeft
            let scroll = scrolldiff / Number(width)
            if (scroll > 0.5) {
                setTab("users")
            } else {
                setTab("couples")
            }
        }

        scrollRef.current?.addEventListener("scroll", scrollFunc)

        return () => {
            scrollRef.current?.removeEventListener("scroll", scrollFunc)
        }
    }, [])

    const tabNavigation = (t: "users" | "couples") => {
        setTab(t)
        tabScrollRef.current = true
        if (t === "users") {
            scrollRef.current?.scroll({ behavior: "smooth", left: 0 })
        } else {
            scrollRef.current?.scroll({ behavior: "smooth", left: 1000 })
        }
        tabScrollRef.current = false
    }

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
                                <div className={styles.tabItem} onClick={() => tabNavigation("users")}>
                                    <p>{localeTr.users}</p>
                                    <div className={`${styles.indicator} ${styles.indOne} ${tab === "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={`${styles.tabItem}`} onClick={() => tabNavigation("couples")}>
                                    <p>Others</p>
                                    <div className={`${styles.indicator} ${styles.indTwo} ${tab !== "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={styles.closeSearch} onClick={() => setQuery("")}>
                                    <AiFillCloseCircle size={30} />
                                </div>
                            </div>
                            <div className={styles.searchResults} ref={scrollRef}>
                                <SearchResults query={query} active={tab === "users"} type="user" />
                                <SearchResults query={query} active={tab != "users"} type="couple" />
                            </div>

                        </div>
                        )
                        }

                    </div>

                    <div className={styles.ntfs}>

                    </div>
                </section>
                <Suggestions />
            </div >
        </Layout >
    )
}

const SearchResults: React.FC<{ query: string, active: boolean, type: string }> = ({ query, active, type }) => {

    const { isLoading, data } = useQuery(
        [`search-${type}`, { query }],
        () => axios.get(`${BASEURL}/${type}/search/${query}`),
        {
            enabled: active,
            staleTime: Infinity
        }
    )
    console.log(data)
    const res = data?.data ? data.data : []

    return (
        <div className={styles.resultsContainer}>
            {isLoading && <h3>Loading...</h3>}
            {
                res.map((item: any) => type === "user" ? (
                    <SearchUser
                        key={item.user_name}
                        userName={item.user_name}
                        fullName={item.first_name + " " + item.last_name}
                        picture={`${IMAGEURL}/${item.profile_picture}`} hasPartner={item.has_partner} />
                ) : (
                    <SearchCouple
                        key={item.couple_name}
                        name={item.couple_name}
                        verified={item.verified}
                        picture={`${IMAGEURL}/${item.profile_picture}`}
                        status={item.married}
                    />
                )
                )
            }
        </div>
    )
}