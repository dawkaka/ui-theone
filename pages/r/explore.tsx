import { useEffect, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import Layout from "../../components/mainLayout"
import Suggestions from "../../components/suggestions"
import styles from "../../styles/explore.module.css"
import { Post } from "../../components/post"
import { AiFillCloseCircle } from "react-icons/ai"
import tr from "../../i18n/locales/explore..json"
import { useRouter } from "next/router"
import { Langs, PostT } from "../../types"
import { Loader, Loading, SearchCouple, SearchUser } from "../../components/mis"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BASEURL, IMAGEURL } from "../../constants"
import { NotFound } from "../../components/notfound"
import Head from "next/head"


export default function Explore() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [tab, setTab] = useState<"users" | "couples">("couples")
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
            if (scroll < 0.5) {
                setTab("users")
            } else {
                setTab("couples")
            }
            tabScrollRef.current = false
        }
        scrollRef.current?.addEventListener("scroll", scrollFunc)
        const cleanUpRef = scrollRef.current
        return () => {
            cleanUpRef?.removeEventListener("scroll", scrollFunc)
        }
    })

    const tabNavigation = (t: "users" | "couples") => {
        setTab(t)
        tabScrollRef.current = true
        if (t !== "users") {
            scrollRef.current?.scroll({ behavior: "smooth", left: 0 })
        } else {
            scrollRef.current?.scroll({ behavior: "smooth", left: 1000 })
        }
        setTimeout(() => {
            tabScrollRef.current = false
        }, 300)

    }

    useEffect(() => {
        if (query === '') {
            setTab('couples')
        }
    }, [query])

    const fetchMessages = ({ pageParam = 0 }) => axios.get(`${BASEURL}/post/explore/${pageParam}`)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["explore"], fetchMessages,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data) {
                    if (lastPage.data?.pagination.end)
                        return undefined
                }
                return lastPage.data?.pagination.next
            }
        })

    let posts: any[] = []
    if (data && data.pages) {
        for (let page of data.pages) {
            posts = posts.concat(page.data.posts)
        }
    }

    return (
        <Layout>
            <Head>
                <title>{localeTr.title}</title>
                <meta name="robots" content="noindex,nofollow" />
                <meta name="description" content={`User's timeline - Prime Couples, social media for couples`} />
            </Head>
            <div className={styles.main}>
                <section className={styles.exploreContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="search"
                            placeholder={`${localeTr.search}`}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                if (e.target.value.length === 0) setTab("couples")
                            }} />
                        <FaSearch className={styles.searchIcon} color="var(--accents-3)" />

                        {!!query && (<div className={styles.searchModal}>
                            <div className={styles.searchHeader}>
                                <div className={`${styles.tabItem}`} onClick={() => tabNavigation("couples")}>
                                    <p>{localeTr.couples}</p>
                                    <div className={`${styles.indicator} ${styles.indOne} ${tab !== "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={styles.tabItem} onClick={() => tabNavigation("users")}>
                                    <p>{localeTr.users}</p>
                                    <div className={`${styles.indicator} ${styles.indTwo} ${tab === "users" ? styles.tabActive : ""}`}></div>
                                </div>
                                <div className={styles.closeSearch} onClick={() => setQuery("")}>
                                    <AiFillCloseCircle size={30} />
                                </div>
                            </div>
                            <div className={styles.searchResults} ref={scrollRef}>
                                <SearchResults query={query} active={tab != "users"} type="couple" />
                                <SearchResults query={query} active={tab === "users"} type="user" />
                            </div>

                        </div>
                        )
                        }

                    </div>

                    <div className={styles.ntfs}>
                        {
                            posts.length === 0 && <NotFound type="explore" />
                        }
                        {
                            posts.map((post: PostT) => {
                                return (
                                    <Post key={post.id} {...post} />
                                )
                            })
                        }

                        <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} manual={false} />
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
            enabled: active && query.length > 2,
            staleTime: Infinity
        }
    )
    const res = data?.data ? data.data : []

    return (
        <div className={styles.resultsContainer}>
            {isLoading && query.length > 2 && <div style={{ display: "flex", justifyContent: "center" }}>
                <Loading color="var(--success)" size="medium" />
            </div>
            }
            {
                !isLoading && res.length === 0 && <NotFound type="search" />
            }
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
                        married={item.married}
                    />
                )
                )
            }
        </div>
    )
}