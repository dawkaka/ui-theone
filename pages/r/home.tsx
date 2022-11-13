import Modal from 'react-modal';
import styles from '../../styles/home.module.css'
import Layout from "../../components/mainLayout";
import PostFullView, { Post } from "../../components/post";
import Suggestions from "../../components/suggestions";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/home.json"
import { Langs, PostT } from "../../types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../../constants";
import { Loader, Loading } from "../../components/mis";
import { useRef } from "react";
import { getCountry } from "../../i18n/location";
import Header from "../../components/pageHeader";


Modal.setAppElement('#__next')

export default function HomePage() {
    const router = useRouter()
    const locale = router.locale as Langs || "en"
    const localeTr = tr[locale]
    const clearedRef = useRef(false)

    // const { data } = useQuery(["feed"], () => axios.get(`${BASEURL}/user/feed/0`))
    const fetchMessages = ({ pageParam = 0 }) => axios.get(`${BASEURL}/user/feed/${pageParam}`)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["feed"], fetchMessages,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data) {
                    console.log(lastPage.data)
                    if (lastPage.data?.pagination.end)
                        return undefined
                }
                return lastPage.data?.pagination.next
            }
        })

    let posts: any[] = []
    if (data && data.pages) {
        for (let page of data.pages) {
            posts = posts.concat(page.data.feed)
        }
    }
    if (data && !clearedRef.current) {
        axios.put(`${BASEURL}/user/new-posts`).then(() => { clearedRef.current = true }).catch(() => { })
    }
    return (
        <Layout>
            <div className={styles.home}>
                <section className={styles.postsContainer}>
                    <div className={styles.headerContainer}>
                        <h3>{localeTr.header}</h3>
                    </div>
                    <div className={styles.content}>
                        {
                            posts.map((post: PostT) => {
                                return (
                                    <Post key={post.id} {...post} />
                                )
                            })
                        }
                        <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} />
                    </div>
                </section>
                <Suggestions />
            </div>
            <Modal
                closeTimeoutMS={200}
                isOpen={false}
                onRequestClose={() => router.back()}
                contentLabel="Post modal"
                style={{
                    overlay: {
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        paddingInline: "var(--gap)",
                        display: "grid",
                        placeItems: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 0
                    },
                    content: {
                        maxWidth: "940px",
                        padding: 0,
                        margin: 0,
                        top: 0,
                        borderRadius: 0,
                        left: 0,
                        overflow: "hidden",
                        height: "90%",
                        backgroundColor: "var(--background)",
                        border: "none",
                        position: "relative"
                    }
                }} >
                {/* <PostFullView postId={router.query.postId} couplename={router.pathname} /> */}
            </Modal>
        </Layout >
    )
}