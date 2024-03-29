import React, { ChangeEvent, useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import Layout from "../components/mainLayout";
import Suggestions from "../components/suggestions";
import Header from "../components/pageHeader";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import styles from "../styles/couple.module.css"
import { Actions, Loader, Loading, SearchUser, Verified } from "../components/mis";
import { Post } from "../components/post";
import { MdModeEdit, MdReport } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import Modal from "react-modal";
import { useRouter } from "next/router";
import EditCouple from "../components/editprofile";
import { CoupleReportModal, CoupleSettings } from "../components/settings";
import tr from "../i18n/locales/coupleprofile.json"
import { Langs, MutationResponse, PostT } from "../types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { ToasContext } from "../components/context";
import { NotFound } from "../components/notfound";
import Head from "next/head";
import Link from "next/link";

Modal.setAppElement("#__next")

const CoupleProfile: NextPage = (props: any) => {
    const [step, setStep] = useState(0)
    const [editOpen, setEditOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [openReportModal, setOpenReportModal] = useState(false)
    const [openFollowers, setOpenFollowers] = useState(false)
    const [following, setFollowing] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const notify = useContext(ToasContext)

    const cropperRef = useRef<any>(null)
    const newFileRef = useRef<any>("")
    const [image, setImage] = useState("")
    const targetRef = useRef<"avatar" | "cover">("avatar")
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs && fs[0]) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                newFileRef.current = reader.result
                setImage(reader.result as string)
            }
            setTimeout(() => {
                setStep(1)
            }, 200)
        }
    }

    const editAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        targetRef.current = "avatar"
        setIsOpen(true)
        newFile(e)
    }
    const editCover = (e: ChangeEvent<HTMLInputElement>) => {
        targetRef.current = "cover"
        setIsOpen(true)
        newFile(e)
    }
    const updatePicMutation = useMutation<AxiosResponse, AxiosError<any, any>, FormData>(
        (data) => {
            return axios.post(`${BASEURL}/couple/${targetRef.current === "avatar" ? "profile" : "cover"}-picture`, data)
        },
        {
            onSuccess: (data) => {
                if (targetRef.current === "avatar") {
                    document.querySelector<HTMLImageElement>("#avatar")!.srcset = newFileRef.current
                } else {
                    document.querySelector<HTMLImageElement>("#cover")!.srcset = newFileRef.current
                }
                setIsOpen(false)
                const { message, type } = data.data as MutationResponse
                notify?.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const onDone = async () => {
        newFileRef.current = cropperRef.current?.cropper.getCroppedCanvas().toDataURL("image/jpeg")
        const formData = new FormData()
        const blob = await (await fetch(newFileRef.current)).blob()
        if (targetRef.current === "avatar") {
            formData.append("profile-picture", blob, "avatar.jpeg")
        } else {
            formData.append("cover-picture", blob, "cover.jpg")
        }
        updatePicMutation.mutate(formData)
    }

    const followMutation = useMutation<AxiosResponse<MutationResponse>, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/${data.couple_name}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data
                notify?.notify(message, type)
            },
            onError: (err) => {
                setFollowing(prv => !prv)
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const followUnfollow = () => {
        followMutation.mutate()
        setFollowing(!following)
    }

    const { data } = useQuery(["profile", { coupleName: router.query.couplename }],
        () => axios.get(`${BASEURL}/${router.query.couplename}`).then(res => res.data),
        { initialData: props.couple.data, staleTime: Infinity })

    useEffect(() => {
        if (data) {
            setFollowing(data.is_following)
        }
    }, [data])

    if (!data) {
        return (
            <Layout>
                <NotFound type="couple" />
            </Layout>
        )
    }

    return (
        <>
            <Head>
                <title>@{data.couple_name} - {localeTr.title}</title>
                <meta name="description" content={`@${data.couple_name}'s profile - Prime Couples is a social media made for couples`} />
                <meta name="robots" content="index,follow" />
                <meta property="og:description" content={`${data.bio}`} />
                <meta property="og:title" content={`${localeTr.followus} @${data.couple_name}`} />
                <meta property="og:title" content={`${localeTr.followus} @${data.couple_name}`} />
                <meta property="og:image" content={`${IMAGEURL}/${data.profile_picture}`} />
                <meta property="og:url" content={`${BASEURL}/${data.couple_name}`} />

                <meta name="twitter:description" content={`${data.bio}`} />
                <meta name="twitter:title" content={`${localeTr.followus} @${data.couple_name}`} />
                <meta name="twitter:image" content={`${IMAGEURL}/${data.profile_picture}`} />
                <meta name="twitter:image:src" content={`${IMAGEURL}/${data.profile_picture}`} />
                <link rel="canonical" href={`${IMAGEURL}/${data.couple_name}`} />
            </Head>
            <Layout>
                <div className={styles.mainContainer} onClick={() => setShowActions(false)}>
                    {!data || !data ? <NotFound type="couple" /> : <div className={styles.profileContainer}>
                        <Header title={data.couple_name} arrow />
                        <section className={styles.profileInfo}>
                            <div className={styles.coverPicContainer}>
                                <div className={styles.cover} >
                                    <Image src={`${IMAGEURL}/${data.cover_picture}`} height={"300px"} width={"900px"} objectFit="cover" id="cover" alt="User's cover" />
                                </div>
                                {
                                    data.is_this_couple && (
                                        <div
                                            className={styles.editCover}
                                            style={{ position: "absolute", top: 0, right: 0 }}
                                        >
                                            <MdModeEdit size={20} color="white" style={{ top: "50%", left: "50%" }} />
                                            <input
                                                type="file" onChange={editCover}
                                                accept="image/jpeg, image/png"
                                                style={{ width: "100%", height: "100%", position: "absolute", opacity: 0, top: 0, left: 0 }}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div className={styles.profile}>
                                <div className={styles.flex}>
                                    <div className={styles.imageContainer}>
                                        <div className={styles.profileImage}>
                                            <Image
                                                src={`${IMAGEURL}/${data.profile_picture}`}
                                                layout="fill"
                                                id="avatar"
                                                alt="Use's profile"
                                            />
                                        </div>
                                        {
                                            data.is_this_couple && (
                                                <div className={styles.avatarContainer}>
                                                    <MdModeEdit size={20} color="white" style={{ top: "50%", left: "50%" }} />
                                                    <input
                                                        type="file" onChange={editAvatar}
                                                        accept="image/jpeg, image/png"
                                                        style={{ width: "100%", height: "100%", position: "absolute", opacity: 0, top: 0, left: 0 }}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={styles.profileActBtnContainer}>
                                        <div style={{ position: "relative" }}>
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                if (data.is_this_couple) {
                                                    setOpenSettings(true)
                                                } else {
                                                    setShowActions(!showActions)
                                                }
                                            }}>
                                                <Actions size={25} orientation="landscape" />
                                            </div>
                                            {
                                                showActions && <ul className={styles.userActions}>
                                                    <li
                                                        className={`${styles.actionItem} ${styles.dangerAction}`}
                                                        onClick={() => setOpenReportModal(true)}>
                                                        <MdReport size={25} />
                                                        <span>{localeTr.report}</span>
                                                    </li>
                                                </ul>
                                            }
                                        </div>
                                        {!data.is_this_couple ? <button className={`${styles.button} ${following ? styles.buttonDull : ""}`} onClick={followUnfollow}>{following ? localeTr.following : localeTr.follow}</button>
                                            :
                                            <button className={styles.editButton} onClick={() => setEditOpen(true)}>{localeTr.edit}</button>}
                                    </div>
                                </div>
                                <div style={{ marginTop: "var(--gap-half)", color: "var(--accents-7)" }}>
                                    <p className={styles.userName}>{data.couple_name} {data.verified ? <Verified size={15} /> : ""}</p>
                                    <p style={{ color: "var(--accents-5)" }}>{data.married ? "married" : "dating"}</p>
                                    {
                                        data.user_names && data.user_names.length === 2 ?
                                            <div style={{ color: "var(--success)", marginBlock: "var(--gap-quarter)", display: "flex" }}>
                                                <Link href={`/user/${data.user_names[0]}`}>
                                                    <a>
                                                        {data.user_names[0]}
                                                    </a>
                                                </Link>
                                                <p style={{ color: "var(--foreground)", marginInline: "5px" }}>&</p>
                                                <Link href={`/user/${data.user_names[1]}`}>
                                                    <a>
                                                        {data.user_names[1]}
                                                    </a>
                                                </Link>
                                            </div>
                                            :
                                            null
                                    }
                                    <p className={styles.bio}>{data.bio}</p>
                                    <div style={{ marginTop: "var(--gap-half)" }}>
                                        <a href={data.website} style={{ color: "var(--success)" }}>{data.website}</a>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                        <h2 className={styles.countInfo}>
                                            <div className={styles.countItem}>
                                                <strong title="Number of posts">{data.post_count}</strong>
                                                <span className={styles.countItemTitle}>{localeTr.posts}</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={styles.countItem} onClick={() => setOpenFollowers(true)}>
                                                <strong title="Number of followers">{data.followers_count}</strong>
                                                <span className={styles.countItemTitle}>{localeTr.followers}</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={`${styles.countItem} ${styles.dateStarted}`}>
                                                <p title="Date relationship started">{new Date(data.date_commenced).toDateString().substring(3)}</p>
                                                <span className={styles.countItemTitle}>{localeTr.started}</span>
                                            </div>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.postsContainer}>
                                <Posts coupleName={router.query.couplename as string} />
                            </div>

                        </section>
                    </div>
                    }
                    <div>
                        <Suggestions />
                    </div>

                    {data && <>
                        <EditCouple open={editOpen} close={() => setEditOpen(false)}
                            web={data.website} bioG={data.bio}
                            dc={data.date_commenced} coupleName={router.query.couplename as string} />
                        <CoupleSettings open={openSettings} close={() => setOpenSettings(false)} married={data.married} />
                        <CoupleReportModal open={openReportModal} close={() => setOpenReportModal(false)} />
                        <Followers open={openFollowers} close={() => setOpenFollowers(false)} heading={localeTr.followers} />

                        <Modal
                            closeTimeoutMS={200}
                            isOpen={isOpen}
                            onRequestClose={() => setIsOpen(false)}
                            style={{
                                overlay: {
                                    zIndex: 1,
                                    backgroundColor: "var(--modal-overlay)",
                                    paddingInline: "var(--gap)",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    margin: 0
                                },
                                content: {
                                    alignSelf: "center",
                                    position: "relative",
                                    padding: 0,
                                    backgroundColor: "var(--background)",
                                    margin: 0,
                                    overflow: "hidden",
                                    justifyContent: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    left: 0,
                                    border: "none",
                                }
                            }}
                        >
                            {
                                step === 0 && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.requestHeader}>
                                            <p>{localeTr.selectimage}</p>
                                            <div onClick={() => setIsOpen(false)}
                                                className={styles.closeContainer}
                                            >
                                                <IoMdClose color="tranparent" size={25} />
                                            </div>
                                        </div>
                                        <div className={styles.modalContent}>
                                            <div className={styles.fileIcons}>
                                                <GoFileMedia size={100} className={styles.fileIcon1} />
                                                <GoFileMedia size={100} className={styles.fileIcon2} />
                                            </div>
                                            <div className={styles.selectFile}>

                                                <button>{localeTr.selectimage}
                                                    <input
                                                        type="file" onChange={newFile}
                                                        accept="image/jpeg, image/png"
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                )
                            }
                            {
                                step == 1 && (
                                    <div className={styles.modalBody}>
                                        <div className={styles.requestHeader}>
                                            <div className={styles.backIcon} onClick={() => setStep(0)}>
                                                <BiArrowBack size={20} color="var(--accents-6)" />
                                            </div>
                                            <p>{localeTr.crop}</p>
                                            <div
                                                onClick={onDone}
                                                className={styles.nextContainer}
                                            >
                                                <p>{localeTr.done}</p>
                                            </div>
                                        </div>
                                        <div className={styles.modalContent}>
                                            <Cropper
                                                src={image}
                                                dragMode="move"
                                                style={{ maxHeight: "500px" }}
                                                // Cropper.js options
                                                viewMode={2}
                                                aspectRatio={targetRef.current === "avatar" ? 1 : 3 / 1}
                                                background={false}
                                                modal={true}
                                                movable={false}
                                                checkOrientation={false}
                                                responsive={true}
                                                zoomOnTouch={false}
                                                zoomOnWheel={false}
                                                guides={false}
                                                highlight={false}
                                                zoomTo={0}
                                                ref={cropperRef}
                                            />

                                        </div>
                                    </div>
                                )
                            }
                        </Modal>
                    </>
                    }
                </div>
            </Layout >
        </>
    )
}


const Followers: React.FunctionComponent<{ open: boolean, close: () => void, heading: string }> = ({ open, close, heading }) => {
    const { query: { couplename } } = useRouter()
    const fetchPosts = ({ pageParam = 0 }) => axios.get(`${BASEURL}/${couplename}/followers/${pageParam}`)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["followers", { couplename }], fetchPosts,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data.pagination.end) {
                    return undefined
                }
                return lastPage.data.pagination.next
            },
            staleTime: Infinity
        })
    let followers: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            followers = followers.concat(page.data.followers)
        }
    }


    return (
        <Modal closeTimeoutMS={200} isOpen={open} onRequestClose={close}

            style={{
                overlay: {
                    zIndex: 1,
                    backgroundColor: "var(--modal-overlay)",
                    paddingInline: "var(--gap)",
                    display: "flex",
                    overflowY: "auto",
                    overflowX: "hidden",
                    flexDirection: "column",
                    margin: 0
                },
                content: {
                    alignSelf: "center",
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    backgroundColor: "var(--background)",
                    display: "flex",
                    flexDirection: "column",
                    left: 0,
                    border: "none",
                }
            }}
        >
            <div className={styles.modalBody} style={{ maxWidth: "400px" }}>
                <div className={styles.requestHeader}>
                    <p>{" "}</p>
                    <p>{heading}</p>
                    <div onClick={() => close()}
                        className={styles.closeContainer}
                    >
                        <IoMdClose color="tranparent" size={25} />
                    </div>
                </div>
                <div className={styles.followersContent}>
                    <div>
                        {
                            followers.length === 0 && <NotFound type="followers" />
                        }
                        {
                            followers.map(follower => (
                                <SearchUser
                                    picture={`${IMAGEURL}/${follower.profile_picture}`}
                                    userName={follower.user_name}
                                    hasPartner={follower.has_partner}
                                    fullName={follower.first_name + " " + follower.last_name}
                                    key={follower.user_name}
                                />
                            ))
                        }
                        <Loader hasNext={hasNextPage ? true : false} loadMore={fetchNextPage} isFetching={isFetching} manual={false} />
                    </div>
                </div>


            </div>

        </Modal>
    )

}

export default CoupleProfile


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const name = ctx.query.couplename as string
    try {
        const res = await axios.get(`${BASEURL}/${name}`, {
            headers: {
                Cookie: `session=${ctx.req.cookies.session}`
            }
        })
        return { props: { couple: { data: res.data } } }
    } catch (error: any) {
        if (error.response?.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/login",
                },
                props: {},
            };
        }
        return { props: { couple: { data: null } } }
    }
}

// eslint-disable-next-line react/display-name
const Posts: React.FC<{ coupleName: string }> = React.memo(({ coupleName }) => {

    const fetchPosts = ({ pageParam = 0 }) => axios.get(`${BASEURL}/${coupleName}/posts/${pageParam}`).then(res => res.data)
    const {
        data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetching,
    } = useInfiniteQuery(["posts", { coupleName }], fetchPosts,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.pagination.end) {
                    return undefined
                }
                return lastPage.pagination.next
            },
            staleTime: Infinity
        })
    let posts: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            posts = posts.concat(page.posts)
        }
    }
    return (
        <>
            {
                posts.length === 0 && !isLoading ? <NotFound type="posts" /> : null
            }
            {
                isLoading && posts.length === 0 ? <Loading color="var(--success)" size="medium" /> : null
            }
            {
                posts.map((post: PostT) => {
                    return (
                        <Post key={post.id} {...post} />
                    )
                })
            }
            <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} manual={false} />
        </>
    )
})