import { ChangeEvent, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import Layout from "../components/mainLayout";
import Suggestions from "../components/suggestions";
import Header from "../components/pageHeader";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import styles from "../styles/couple.module.css"
import { Actions, Loader, SearchUser, Verified } from "../components/mis";
import { Post } from "../components/post";
import { MdBlock, MdModeEdit, MdReport } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import Modal from "react-modal";
import { useRouter } from "next/router";
import EditCouple from "../components/editprofile";
import { CoupleReportModal, CoupleSettings } from "../components/settings";
import tr from "../i18n/locales/coupleprofile.json"
import { Langs, PostT } from "../types";
import CouplePreview from "../components/couplepreview";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../constants";

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


    const cropperRef = useRef<any>(null)
    const newFileRef = useRef<any>("")
    const targetRef = useRef<"avatar" | "cover">("avatar")
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                newFileRef.current = e.target?.result
            }
            setTimeout(() => {
                setStep(1)
            }, 200)
        }
    }

    const editAvatar = () => {
        targetRef.current = "avatar"
        setIsOpen(true)
    }
    const editCover = () => {
        targetRef.current = "cover"
        setIsOpen(true)
    }
    const updatePicMutation = useMutation(
        (data: FormData) => {
            return axios.post(`${BASEURL}/couple/${targetRef.current === "avatar" ? "profile" : "cover"}-picture`, data)
        },
        {
            onSuccess: (data) => {
                console.log(data)
                if (targetRef.current === "avatar") {
                    document.querySelector<HTMLImageElement>("#avatar")!.srcset = newFileRef.current
                } else {
                    document.querySelector<HTMLImageElement>("#cover")!.srcset = newFileRef.current
                }
                setIsOpen(false)
            },
            onError: (err) => {
                console.log(err)
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

    useEffect(() => {
        if (step === 1) {
            cropperRef.current.src = newFileRef.current
        }
    }, [step])

    const followMutation = useMutation(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/yousiph.and.lana`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
                setFollowing(!following)
            }
        }
    )
    const followUnfollow = () => {
        followMutation.mutate()
        setFollowing(!following)
    }

    const { isLoading, data } = useQuery(["profile", { coupleName: router.query.couplename }],
        () => axios.get(`${BASEURL}/${router.query.couplename}`),
        { initialData: props.couple, staleTime: Infinity })
    return (
        <>
            <Layout>
                <div className={styles.mainContainer} onClick={() => setShowActions(false)}>
                    <div className={styles.profileContainer}>
                        <Header title={data?.data.couple_name} arrow />
                        <section className={styles.profileInfo}>
                            <div className={styles.coverPicContainer}>
                                <div className={styles.cover} >
                                    <Image src={`${IMAGEURL}/${data?.data.cover_picture}`} height={"300px"} width={"900px"} objectFit="cover" id="cover" />
                                </div>
                                {
                                    data?.data.is_this_couple && (
                                        <span
                                            className={styles.editCover}
                                            style={{ position: "absolute", top: 0, right: 0 }}
                                            onClick={editCover}
                                        >
                                            <MdModeEdit size={30} color="white" />
                                        </span>
                                    )
                                }
                            </div>
                            <div className={styles.profile}>
                                <div className={styles.flex}>
                                    <div className={styles.imageContainer}>
                                        <div className={styles.profileImage}>
                                            <Image
                                                src={`${IMAGEURL}/${data?.data.profile_picture}`}
                                                layout="fill"
                                                id="avatar"
                                            />
                                        </div>
                                        {
                                            data?.data.is_this_couple && (
                                                <div
                                                    className={styles.avatarContainer}
                                                    onClick={editAvatar}
                                                >
                                                    <div>
                                                        <MdModeEdit size={30} color="white" style={{ top: "50%", left: "50%" }} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={styles.profileActBtnContainer}>
                                        <div style={{ position: "relative" }}>
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                if (data.data.is_this_couple) {
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
                                                    <li
                                                        className={`${styles.actionItem} ${styles.dangerAction}`}>
                                                        <MdBlock size={25} />
                                                        <span>{localeTr.block}</span>
                                                    </li>
                                                </ul>
                                            }
                                        </div>
                                        {!data.data.is_this_couple ? <button className={`${styles.button} ${following ? styles.buttonDull : ""}`} onClick={followUnfollow}>{following ? localeTr.following : localeTr.follow}</button>
                                            :
                                            <button className={styles.editButton} onClick={() => setEditOpen(true)}>{localeTr.edit}</button>}
                                    </div>
                                </div>
                                <div style={{ marginTop: "var(--gap-half)", color: "var(--accents-7)" }}>
                                    <p className={styles.userName}>{data?.data.couple_name} {data?.data.verified ? <Verified size={15} /> : ""}</p>
                                    <p style={{ color: "var(--accents-5)" }}>{data.data.married ? "married" : "dating"}</p>
                                    <p className={styles.bio}>{data?.data.bio}</p>
                                    <div style={{ marginTop: "var(--gap-half)" }}>
                                        <a href={data.data.website} style={{ color: "var(--success)" }}>{data.data.website}</a>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                        <h2 className={styles.countInfo}>
                                            <div className={styles.countItem}>
                                                <strong title="Number of posts">{data?.data.post_count}</strong>
                                                <span className={styles.countItemTitle}>{localeTr.posts}</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={styles.countItem} onClick={() => setOpenFollowers(true)}>
                                                <strong title="Number of followers">{data?.data.followers_count}</strong>
                                                <span className={styles.countItemTitle}>{localeTr.followers}</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={`${styles.countItem} ${styles.dateStarted}`}>
                                                <p title="Date relationship started">{new Date(data.data.date_commenced).toDateString().substring(3)}</p>
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
                    <div>
                        <Suggestions />
                    </div>

                    <EditCouple open={editOpen} close={() => setEditOpen(false)}
                        web={data.data.website} bioG={data.data.bio}
                        dc={data.data.date_commenced} coupleName={router.query.couplename as string} />
                    <CoupleSettings open={openSettings} close={() => setOpenSettings(false)} married={data.data.married} />
                    <CoupleReportModal open={openReportModal} close={() => setOpenReportModal(false)} />
                    <Followers open={openFollowers} close={() => setOpenFollowers(false)} heading={localeTr.followers} />

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        style={{
                            overlay: {
                                zIndex: 1,
                                backgroundColor: "var(--modal-overlay)",
                                paddingInline: "var(--gap)",
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
                                            src={cropperRef.current?.src}
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
            }
        })
    let followers: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            followers = followers.concat(page.data.followers)
        }
    }


    return (
        <Modal isOpen={open} onRequestClose={close}

            style={{
                overlay: {
                    zIndex: 1,
                    backgroundColor: "var(--modal-overlay)",
                    paddingInline: "var(--gap)",
                    display: "flex",
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
                        <Loader hasNext={hasNextPage ? true : false} loadMore={fetchNextPage} isFetching={isFetching} />
                    </div>
                </div>


            </div>

        </Modal>
    )

}

export default CoupleProfile


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const name = ctx.query.couplename as string
    const res = await axios.get(`${BASEURL}/${name}`, {
        headers: {
            Cookie: `session=${ctx.req.cookies.session}`
        }
    })
    return { props: { couple: { data: res.data } } }
}


const Posts: React.FC<{ coupleName: string }> = ({ coupleName }) => {

    const fetchPosts = ({ pageParam = 0 }) => axios.get(`${BASEURL}/${coupleName}/posts/${pageParam}`)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["posts", { coupleName }], fetchPosts,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data.pagination.end) {
                    return undefined
                }
                return lastPage.data.pagination.next
            }
        })

    let posts: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            posts = posts.concat(page.data.posts)
        }
    }
    return (
        <>
            {
                posts.map((post: PostT) => {
                    return (
                        <Post key={post.id} {...post} />
                    )
                })
            }
            <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} />
        </>
    )
}