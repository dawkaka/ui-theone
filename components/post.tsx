import React, { FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from 'react-icons/ai';
import { MdModeEdit, MdOutlineContentCopy, MdOutlineNavigateNext, MdReport } from "react-icons/md";
import styles from "./styles/post.module.css";
import { Actions, Loading, Verified, Video } from "./mis";
import { BsArrowUpRight, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiUserUnfollowLine } from "react-icons/ri";
import Modal from 'react-modal';
import Comments from "./comment";
import { useRouter } from "next/router";
import { CommentT, Langs, MutationResponse, PostT } from "../types";
import tr from "../i18n/locales/components/post.json";
import emTr from "../i18n/locales/components/emoji.json"
import { BiCommentAdd, BiCommentX } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../hooks";
import { Categories } from "emoji-picker-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { Prompt } from "./prompt";
import { postDateFormat } from "../libs/utils";
import { ToasContext } from "./context";
import { NotFound } from "./notfound";
import Head from "next/head";

const Picker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    { ssr: false }
);

const modalStyles: Modal.Styles = {
    overlay: {
        zIndex: 1,
        backgroundColor: "var(--modal-overlay)",
        padding: 0,
        paddingInline: "var(--gap)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: 0
    },
    content: {
        alignSelf: "center",
        position: "relative",
        padding: 0,
        margin: 0,
        transform: "translateY(-40px)",
        backgroundColor: "transparent",
        left: 0,
        border: "none",
    }
}

export const Post: React.FunctionComponent<PostT> = (props) => {
    const {
        couple_name, verified, has_liked, profile_picture, id, postId,
        likes_count, comments_count, is_this_couple, files, created_at } = props
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const router = useRouter()
    const [comments_closed, setComments_closed] = useState(props.comments_closed)
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [modalOpen, setModalOpen] = useState(false)
    const [step, setStep] = useState<"actions" | "edit" | "report">("actions")
    const [following, setFollowing] = useState(false)
    const [prOpen, setPrOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const notify = useContext(ToasContext)
    const queryClient = useQueryClient()
    const [caption, setCaption] = useState(props.caption)
    const [location, setLocation] = useState(props.location)


    useEffect(() => {
        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    }, [])


    const closeModal = useCallback(() => {
        setStep("actions")
        setModalOpen(false)
    }, [])


    const scroll = (dir: string) => {
        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        const widthNum = Math.floor(Number(width))
        let dist
        if (dir === "right") {
            dist = scrollPos + widthNum
        } else {
            dist = scrollPos - widthNum
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });
        setCurr(dist / widthNum)
    }

    const deletePost = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (id) => {
            return axios.delete(`${BASEURL}/post/${id}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                queryClient.invalidateQueries(["post", { postId }])
                setDeleted(true)
                notify!.notify(message, type)
                setPrOpen(false)
                closeModal()
            },
            onError: (err) => {
                setFollowing(!following)
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const followMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/${couple_name}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                setFollowing(!following)
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const followUnfollow = () => {
        followMutation.mutate()
        setFollowing(!following)
    }

    const copyPostURl = () => {
        navigator.clipboard.writeText(window.location.origin + "/" + couple_name + "/" + postId).then(() => {
            notify?.notify("Post link copied", "SUCCESS")
        }, () => {
            notify?.notify("Failed to copy", "ERROR")
        });
    }

    const toggleCommentsMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => axios.post(`${BASEURL}/post/${id}/${comments_closed ? "ON" : "OFF"}`),
        {
            onSuccess: (data) => {
                setComments_closed(!comments_closed)
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    if (deleted) {
        return null
    }
    return (
        <article className={styles.container}>
            <div>
                <div className={styles.userInfoContainer}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                            <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={`${IMAGEURL}/${profile_picture}`}
                                    className={styles.profileImage}
                                    alt=""
                                />
                            </span>
                        </div>
                        <div className={styles.textEllipsis}>
                            <Link href={`/${couple_name}`}>
                                <a style={{ fontSize: "14px", fontWeight: "bold" }}>
                                    {couple_name + " "} {verified && <Verified size={13} />}
                                </a>
                            </Link>
                            <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>{props.location}</p>
                        </div>
                    </div>
                    <div onClick={() => setModalOpen(true)}>
                        <Actions size={20} orientation="potrait" />
                    </div>
                </div>
                <div>
                    <div className={styles.filesContainer} style={{ borderTop: "var(--border)" }}>
                        <div className={styles.fileSlider} ref={slider}>
                            {

                                files?.map(file => {
                                    let post
                                    if (file.name.substring(file.name.length - 3) === "mp4") {
                                        post = <Video file={`${IMAGEURL}/${file.name}`} />
                                    } else {
                                        post = <img
                                            src={`${IMAGEURL}/${file.name}`}
                                            className={styles.postImage}
                                            width={"100%"}
                                            alt={file.alt}
                                            key={file.name}
                                        />
                                    }
                                    return (
                                        <div className={styles.fileContainer} key={file.name}>
                                            {post}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {curr !== 0 && <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                        {curr < files?.length - 1 && <div role="button" className={styles.next} onClick={() => scroll("right")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--gap-half) var(--gap-half) 0" }}>
                        <div className={styles.viewSliderPos}>
                            {
                                files?.length > 1 ?
                                    files.map((_: any, indx: number) => (<SliderIndicator pos={indx} curr={curr} key={indx} />))
                                    :
                                    <p style={{ color: "var(--accents-3)", fontSize: "small", marginTop: "var(--gap-quarter)" }}>
                                        {postDateFormat(created_at, locale)}
                                    </p>
                            }
                        </div>
                        <PostIcons
                            likes={likes_count}
                            comments={comments_count}
                            id={id} hasLiked={has_liked}
                            couple_name={couple_name}
                            postId={postId}
                        />
                    </div>
                    <div className={styles.captionContainer}>
                        <Link
                            href={`/${couple_name}/${props.postId}`}
                        >
                            <a>
                                <TextParser text={caption} />
                            </a>
                        </Link>
                        {
                            files.length > 1 ?
                                <p style={{ color: "var(--accents-3)", fontSize: "small", marginTop: "var(--gap-quarter)" }}>
                                    {postDateFormat(created_at, locale)}
                                </p>
                                :
                                null
                        }
                    </div>
                </div>
                <div
                    style={{ position: "relative", borderTop: "var(--border)", textAlign: "center" }}
                >
                    {
                        comments_closed ?
                            <p style={{ color: "var(--accents-3)", paddingBlock: "var(--gap-half)" }}>{localeTr.disablecomments}</p>
                            :
                            <CommentArea
                                isCard={false}
                                id={id}
                                postId={postId}
                                couple_name={couple_name}
                            />
                    }
                </div>

            </div>
            <Modal
                closeTimeoutMS={200}
                isOpen={modalOpen}
                style={modalStyles}
                onRequestClose={closeModal} >
                {
                    step === "actions" && (
                        <ul className={styles.modalBody}>
                            {is_this_couple ? (
                                <>
                                    <li className={styles.actionItem} onClick={() => setStep("edit")} ><span>{localeTr.edit}</span><MdModeEdit size={25} /></li>
                                    <li className={styles.actionItem} onClick={() => toggleCommentsMutation.mutate()}>
                                        {
                                            comments_closed ?
                                                <><span>{localeTr.opencomments}</span><BiCommentAdd size={25} /></>
                                                :
                                                <><span>{localeTr.closecomments}</span><BiCommentX size={25} /></>
                                        }
                                    </li>
                                    <li className={styles.actionItem} onClick={copyPostURl}><span>{localeTr.copyurl}</span> <MdOutlineContentCopy size={25} /></li>
                                    <li className={styles.actionItem} onClick={() => router.push(`/${couple_name}/${postId}`)}><span>{localeTr.gotopost}</span> <BsArrowUpRight size={25} /></li>
                                    <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setPrOpen(true)}><span>{localeTr.delete}</span><AiOutlineDelete size={25} /></li>
                                    <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                </>
                            ) :
                                (
                                    <>
                                        <li className={styles.actionItem} onClick={followUnfollow}><span>{following ? localeTr.unfollow : localeTr.follow} @{couple_name}</span><RiUserUnfollowLine size={25} /></li>
                                        <li className={styles.actionItem} onClick={copyPostURl}><span>{localeTr.copyurl}</span> <MdOutlineContentCopy size={25} /></li>
                                        <li className={styles.actionItem} onClick={() => router.push(`/${couple_name}/${postId}`)}><span>{localeTr.gotopost}</span> <BsArrowUpRight size={25} /></li>
                                        <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><span>{localeTr.report}</span><MdReport size={25} /></li>
                                        <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                    </>
                                )
                            }
                        </ul>
                    )
                }
                {
                    step === "edit" && (
                        <EditPost
                            closeModal={closeModal}
                            caption={caption}
                            location={location}
                            id={id} pId={postId}
                            couple_name={couple_name}
                            update={(caption: string, location: string) => {
                                setCaption(caption)
                                setLocation(location)
                            }}
                        />
                    )
                }
                {
                    step === "report" && (
                        <ReportPost closeModal={closeModal} id={id} />
                    )
                }
                <Prompt
                    open={prOpen}
                    close={() => setPrOpen(false)}
                    title={localeTr.deletepost.title}
                    message={localeTr.deletepost.message}
                    actionText={localeTr.deletepost.actiontext}
                    cancelText={localeTr.deletepost.canceltext}
                    dangerAction
                    acceptFun={() => deletePost.mutate(id)}
                />
            </Modal>
        </article >
    )
}


export const LandingPost: React.FunctionComponent<PostT & { video?: boolean }> = (props) => {
    const {
        couple_name, verified, has_liked, profile_picture, id, caption,
        likes_count, comments_count, files, created_at, video } = props
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const direc = useRef<"right" | "left">("right")
    let postDate = postDateFormat("Dec 22, 2022, 6:06 PM", locale)
    if (video) {
        postDate = postDateFormat("Dec 22, 2022, 6:20 PM", locale)
    }
    useEffect(() => {

        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    }, [])


    const scroll = (dir: string) => {
        if (slider.current) {
            let width = window.getComputedStyle(slider.current).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            let dist
            if (dir === "right") {
                dist = scrollPos + widthNum
            } else {
                dist = scrollPos - widthNum
            }
            slider.current!.scroll({
                left: dist,
                behavior: 'smooth'
            });
            setCurr(dist / widthNum)
        }
    }


    useEffect(() => {
        if (!video) {
            setInterval(() => {
                scroll(direc.current)

            }, 3000)
        }
    }, [video])

    if (curr === files.length) {
        direc.current = "left"
    } else if (curr < 0) {
        direc.current = "right"
    }

    return (
        <article className={styles.container} style={{ width: "min(100%,470px)", marginInline: "auto", borderRadius: "var(--radius-small)" }}>
            <div>
                <div className={styles.userInfoContainer}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                            <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={`${profile_picture}`}
                                    className={styles.profileImage}
                                    alt=""
                                />
                            </span>
                        </div>
                        <div className={styles.textEllipsis}>
                            <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                                {couple_name + " "} {verified && <Verified size={13} />}
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>{props.location}</p>
                        </div>
                    </div>
                    <div>
                        <Actions size={20} orientation="potrait" />
                    </div>
                </div>
                <div>
                    <div className={styles.filesContainer}>
                        <div className={styles.fileSlider} ref={slider}>
                            {

                                files?.map(file => {
                                    let post
                                    if (file.name.substring(file.name.length - 3) === "mp4") {
                                        post = <Video file={`${file.name}`} />
                                    } else {
                                        post = <img
                                            src={`${file.name}`}
                                            className={styles.postImage}

                                            alt={file.alt}
                                            key={file.name}
                                        />
                                    }
                                    return (
                                        <div className={styles.fileContainer} key={file.name}>
                                            {post}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {curr !== 0 && <div role="button" className={styles.prev} onClick={() => {
                            scroll("left")
                        }}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                        {curr < files?.length - 1 && <div role="button" className={styles.next} onClick={() => {
                            scroll("right")
                        }}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "var(--gap-half)" }}>
                        <div className={styles.viewSliderPos}>
                            {
                                files?.length > 1 && files.map((_: any, indx: number) => (<SliderIndicator pos={indx} curr={curr} key={indx} />))

                            }
                        </div>
                        <PostIcons
                            likes={likes_count}
                            comments={comments_count}
                            id={id}
                            couple_name={"somethingrandom"}
                            hasLiked={has_liked}
                            postId={"somethingrandom"}
                        />
                    </div>
                    <div className={styles.captionContainer}>
                        <div>
                            <TextParser text={caption} />
                        </div>

                        <p style={{ color: "var(--accents-3)", fontSize: "small", marginTop: "var(--gap-quarter)" }}>{postDate}</p>
                    </div>
                </div>
                <div style={{ position: "relative", borderTop: "var(--border)", textAlign: "center" }}>
                    <p style={{ color: "var(--accents-3)", paddingBlock: "var(--gap-half)" }}>{localeTr.disablecomments}</p>
                </div>

            </div>
        </article >
    )
}


export function PostFullView({ couplename, postId, initialData }: { couplename: string; postId: string; initialData: any }) {
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const [modalOpen, setModalOpen] = useState(false)
    const [step, setStep] = useState<"actions" | "edit" | "report">("actions")
    const [following, setFollowing] = useState(false)
    const [prOpen, setPrOpen] = useState(false)
    const notify = useContext(ToasContext)
    const queryClient = useQueryClient()

    useEffect(() => {
        const scrollHandler = () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        }
        slider.current?.addEventListener("scroll", scrollHandler)
        const cleanUp = slider.current
        return () => {
            cleanUp?.removeEventListener("scroll", scrollHandler)
        }
    }, [])

    const closeModal = useCallback(() => {
        setStep("actions")
        setModalOpen(false)
    }, [])

    const scroll = (dir: string) => {
        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        const widthNum = Math.floor(Number(width))
        let dist
        if (dir === "right") {
            dist = scrollPos + widthNum
        } else {
            dist = scrollPos - widthNum
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });
        setCurr(dist / widthNum)
    }

    const followMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/${post.couple_name}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                setFollowing(!following)
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const followUnfollow = () => {
        followMutation.mutate()
        setFollowing(!following)
    }

    const deletePost = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (id: string) => {
            return axios.delete(`${BASEURL}/post/${id}`)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["post", { postId }])
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
                setPrOpen(false)
                closeModal()
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const copyPostURl = () => {
        navigator.clipboard.writeText(window.location.origin + "/" + post.couple_name + "/" + postId).then(() => {
            notify?.notify("Post link copied", "SUCCESS")
        }, () => {
            notify?.notify("Failed to copy", "ERROR")
        });
    }


    const { data: post } = useQuery(["post", { postId }],
        () => axios.get(`${BASEURL}/post/${couplename}/${postId}`).then(res => res.data),
        { initialData: initialData.data, staleTime: Infinity })


    const [comments_closed, setComments_closed] = useState(post.comments_closed)
    const [caption, setCaption] = useState(post.caption)
    const [location, setLocation] = useState(post.location)


    const toggleCommentsMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => axios.post(`${BASEURL}/post/${post.id}/${comments_closed ? "ON" : "OFF"}`),
        {
            onSuccess: (data) => {
                setComments_closed(!comments_closed)
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: (err) => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    if (post === null) {
        return (
            <NotFound type="post" />
        )
    }
    return (
        <>
            <Head>
                <title>{localeTr.post} - @{post.couple_name}</title>
                <meta name="robots" content="index,follow" />
                <meta name="description" content={post.bio} />

                <meta property="og:title" content={`${localeTr.post} - @${post.couple_name}`} />
                <meta property="og:url" content={`${IMAGEURL}/${post.couple_name}/${postId}`} />
                <meta property="og:image" content={`${IMAGEURL}/${post.files[0].name}`} />
                <meta property="og:description" content={post.caption} />

                <meta name="twitter:description" content={post.caption} />
                <meta name="twitter:title" content={`${localeTr.post} - @${post.couple_name}`} />
                <meta name="twitter:image:src" content={`${IMAGEURL}/${post.files[0].name}`} />
                <meta name="twitter:image" content={`${IMAGEURL}/${post.files[0].name}`} />

                <link rel="canonical" href={`${BASEURL}/${post.couple_name}/${postId}`} />
            </Head>
            <div className={styles.viewContent}>
                <div className={styles.viewFiles}>
                    <div className={styles.filesContainer} style={{ width: "100%" }}>
                        <div className={styles.fileSlider} ref={slider} style={{ backgroundColor: "transparent", width: "100%" }}>
                            {
                                post.files.map((file: any) => {
                                    let post
                                    if (file.name.substring(file.name.length - 3) === "mp4") {
                                        post = <Video file={`${IMAGEURL}/${file.name}`} />
                                    } else {
                                        post = <img
                                            src={`${IMAGEURL}/${file.name}`}
                                            className={styles.postImage}
                                            width={"100%"}
                                            alt={file.alt}
                                            key={file.name}
                                        />
                                    }
                                    return (
                                        <div className={styles.fileContainer} key={file.name}>
                                            {post}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {curr !== 0 && <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                        {curr < post.files.length - 1 && <div role="button" className={styles.next} onClick={() => scroll("right")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                    </div>
                    <div className={styles.viewSliderPos}>
                        {
                            post.files.length > 1 && post.files.map((_: any, indx: number) => (<SliderIndicator pos={indx} curr={curr} key={indx} />))
                        }
                    </div>
                </div>

                <div className={styles.viewComments}>
                    <div className={styles.scrollContainer}>
                        <div className={styles.userInfoContainer}>
                            <div className={styles.infoWrapper}>
                                <div className={styles.imageContainer} style={{ width: "40px", height: "40px" }}>
                                    <span className={styles.avatarContainer} style={{ width: "40px", height: "40px" }}>
                                        <Image
                                            layout="fill"
                                            alt=""
                                            src={`${IMAGEURL}/${post.profile_picture}`}
                                            className={styles.profileImage}
                                        />
                                    </span>
                                </div>

                                <div className={styles.textEllipsis}>
                                    <Link href={`/${post.couple_name}`}>
                                        <a style={{ fontSize: "14px", fontWeight: "bold" }}>
                                            {post.couple_name}{" "}{post.verified ? <Verified size={13} /> : ""}
                                        </a>
                                    </Link>
                                    <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>{location}</p>
                                </div>
                            </div>
                            <div onClick={() => setModalOpen(true)}>
                                <Actions size={24} orientation="potrait" />
                            </div>
                        </div>
                        <div className={styles.captionContainer} style={{
                            paddingTop: 0,
                            borderBottom: "var(--border)"

                        }}>
                            <TextParser text={caption} />
                            <p style={{ color: "var(--accents-3)", fontSize: "small", marginTop: "var(--gap-quarter)" }}>{postDateFormat(post.created_at, locale)}</p>

                            <div className={styles.postStats} style={{ marginLeft: 0, paddingInline: 0 }}>
                                <PostIcons
                                    likes={post.likes_count}
                                    comments={post.comments_count}
                                    id={post.id}
                                    hasLiked={post.has_liked}
                                    postId={postId}
                                    couple_name={post.couple_name}
                                />
                            </div>
                        </div>
                        <Comments id={post.id} />
                    </div >
                    <div className={styles.viewFixedBottom} style={{ textAlign: "center" }}>
                        {comments_closed ?
                            <p style={{ color: "var(--accents-3)", paddingBlock: "var(--gap-half)" }}>{localeTr.disablecomments}</p>
                            :
                            <CommentArea
                                isCard={false}
                                id={post.id}
                                postId={postId}
                                couple_name={post.couple_name}
                            />
                        }
                    </div>
                </div >
                <Modal
                    closeTimeoutMS={200}
                    isOpen={modalOpen}
                    style={modalStyles}
                    onRequestClose={() => setModalOpen(false)} >
                    {
                        step === "actions" && (
                            <ul className={styles.modalBody}>
                                {
                                    post.is_this_couple ? (
                                        <>
                                            <li className={styles.actionItem} onClick={() => setStep("edit")}><span>Edit</span><MdModeEdit size={25} /></li>
                                            <li className={styles.actionItem} onClick={() => toggleCommentsMutation.mutate()}>
                                                {
                                                    comments_closed ?
                                                        <><span>{localeTr.opencomments}</span><BiCommentAdd size={25} /></>
                                                        :
                                                        <><span>{localeTr.closecomments}</span><BiCommentX size={25} /></>
                                                }
                                            </li>
                                            <li className={styles.actionItem} onClick={copyPostURl}><span>{localeTr.copyurl}</span> <MdOutlineContentCopy size={25} /></li>
                                            <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setPrOpen(true)}><span>{localeTr.delete}</span><AiOutlineDelete size={25} /></li>
                                            <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                        </>
                                    ) :
                                        (
                                            <>
                                                <li className={styles.actionItem} onClick={followUnfollow}><span>{following ? localeTr.unfollow : localeTr.follow} @{post.couple_name}</span><RiUserUnfollowLine size={25} /></li>
                                                <li className={styles.actionItem} onClick={copyPostURl}><span>{localeTr.copyurl}</span> <MdOutlineContentCopy size={25} /></li>
                                                <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><span>{localeTr.report}</span><MdReport size={25} /></li>
                                                <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                            </>
                                        )
                                }

                            </ul>
                        )
                    }
                    {
                        step === "edit" && (
                            <EditPost
                                closeModal={closeModal}
                                caption={post.caption}
                                location={post.location}
                                id={post.id} pId={postId}
                                couple_name={post.couple_name}
                                update={(caption: string, location: string) => {
                                    setCaption(caption)
                                    setLocation(location)
                                }}
                            />
                        )
                    }
                    {
                        step === "report" && (
                            <ReportPost closeModal={closeModal} id={post.id} />
                        )
                    }
                    <Prompt
                        open={prOpen}
                        close={() => setPrOpen(false)}
                        title={localeTr.deletepost.title}
                        message={localeTr.deletepost.message}
                        actionText={localeTr.deletepost.actiontext}
                        cancelText={localeTr.deletepost.canceltext}
                        dangerAction
                        acceptFun={() => deletePost.mutate(post.id)}
                    />
                </Modal>
            </div >
        </>
    )
}


const CommentArea: React.FunctionComponent<{ isCard: boolean, id: string, postId: string, couple_name: string }> = ({ isCard, id, postId, couple_name }) => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const emojiTr = emTr[locale as Langs]
    const [openEmoji, setOpenEmoji] = useState(false)
    const [comment, setComment] = useState("")
    const queryClient = useQueryClient()
    const theme = useTheme()
    const notify = useContext(ToasContext)


    const { mutate, isLoading } = useMutation<{ comment: CommentT, notif: MutationResponse }, AxiosError<any, any>, string>(
        async (comment) => {
            return axios.post(`${BASEURL}/post/comment/${id}`, JSON.stringify({ comment })).then(res => res.data)
        },
        {
            onSuccess: data => {
                setComment("")
                queryClient.setQueryData(["comments", { id }], (oldData: any) => {
                    if (oldData) {
                        const { pages } = oldData
                        pages[0].comments.unshift(data.comment)
                        return { ...oldData, pages }
                    }
                    return undefined
                })

                queryClient.setQueryData(["feed"], (oldData: { pages: { feed: PostT[] }[] } | undefined) => {
                    if (oldData) {
                        const pages = oldData.pages
                        let page = -1
                        for (let i = 0; i < pages.length; i++) {
                            if (pages[i].feed.some((val: any) => val.id === id)) {
                                page = i
                                break;
                            }
                        }
                        if (page > -1) {
                            pages[page].feed = pages[page].feed.map((post: any) => {
                                if (post.id === id) {
                                    return { ...post, comments_count: post.comments_count + 1 }
                                }
                                return post
                            });
                        }
                        return { ...oldData, pages: [...pages] }
                    }
                    return undefined
                })

                queryClient.setQueryData(["posts", { coupleName: couple_name }], (oldData: any) => {
                    if (oldData) {
                        const { pages } = oldData
                        let page = -1
                        for (let i = 0; i < pages.length; i++) {
                            if (pages[i].posts.some((val: any) => val.id === id)) {
                                page = i
                                break;
                            }
                        }
                        if (page > -1) {
                            pages[page].posts = pages[page].posts.map((post: any) => {
                                if (post.id === id) {
                                    return { ...post, comments_count: post.comments_count + 1 }
                                }
                                return post
                            });
                        }
                        return { ...oldData, pages: [...pages] }
                    }
                    return undefined
                })

                queryClient.setQueryData(["post", { postId }], (oldData: PostT | undefined) => {
                    if (oldData) {
                        return { ...oldData, comments_count: oldData.comments_count + 1 }
                    }
                    return undefined
                });

                const { message, type } = data.notif
                notify!.notify(message, type)
            },
            onError: err => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const postComment = (e: FormEvent) => {
        e.preventDefault()
        if (isLoading || comment === "") return
        e.preventDefault()
        mutate(comment)
    }

    return (
        <>
            <form
                onSubmit={postComment}
                className={styles.commentContainer}
                onClick={() => setOpenEmoji(false)}
            >
                <div onClick={(e) => {
                    e.stopPropagation()
                    setOpenEmoji(!openEmoji)
                }} style={{ display: "grid", placeItems: "center" }}>
                    <BsEmojiSmile />
                </div>
                <textarea aria-label={localeTr.addcomment} placeholder={localeTr.addcomment + "..."}
                    autoComplete="off" autoCorrect="off"
                    onKeyUp={(e) => {
                        e.currentTarget.style.height = "1px";
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";

                    }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={() => setOpenEmoji(false)}
                ></textarea>

                <div>
                    <button>{isLoading ? <Loading size="small" color="var(--success)" /> : localeTr.post}</button>
                </div>

            </form>
            {
                openEmoji && <div style={{ position: "absolute", bottom: isCard ? "35px" : "60px" }}>
                    <Picker
                        onEmojiClick={(emojiObject) => setComment(comment + emojiObject.emoji)}
                        lazyLoadEmojis={true}
                        theme={theme}
                        categories={[
                            {
                                name: emojiTr.recently_used,
                                category: Categories.SUGGESTED
                            },
                            {
                                name: emojiTr.smileys_people,
                                category: Categories.SMILEYS_PEOPLE
                            },
                            {
                                name: emojiTr.food_drink,
                                category: Categories.FOOD_DRINK
                            },
                            {
                                name: emojiTr.animals_nature,
                                category: Categories.ANIMALS_NATURE
                            },
                            {
                                name: emojiTr.activities,
                                category: Categories.ACTIVITIES
                            },
                            {
                                name: emojiTr.travel_places,
                                category: Categories.TRAVEL_PLACES
                            },
                            {
                                name: emojiTr.objects,
                                category: Categories.OBJECTS
                            },
                            {
                                name: emojiTr.symbols,
                                category: Categories.SYMBOLS
                            },

                            {
                                name: emojiTr.flags,
                                category: Categories.FLAGS
                            }
                        ]}
                    />
                </div>
            }
        </>
    )
}

const PostIcons: React.FunctionComponent<{ postId: string, likes: number, comments: number, id: string, hasLiked: boolean, couple_name: string }> =
    ({ postId, likes, comments, id, hasLiked, couple_name }) => {
        const { locale } = useRouter()

        const [liked, setLiked] = useState(hasLiked)
        const [likesNum, setLikes] = useState(likes)
        const l = new Intl.NumberFormat(locale, { notation: "compact" }).format(likesNum)
        const c = new Intl.NumberFormat(locale, { notation: "compact" }).format(comments)
        const likedRef = useRef(false)
        const queryClient = useQueryClient()

        const likePost = useMutation<AxiosResponse, AxiosError<any, any>, string>(
            (action: string) => {
                return axios.patch(`${BASEURL}/post/${action}/${id}`)
            },
            {
                onSuccess: () => {
                    queryClient.setQueryData(["post", { postId }], (oldData: PostT | undefined) => {
                        if (oldData) {
                            return { ...oldData, likes_count: likedRef.current ? oldData.likes_count + 1 : oldData.likes_count - 1, has_liked: likedRef.current }
                        }
                        return undefined
                    });

                    queryClient.setQueryData(["feed"], (oldData: { pages: { feed: PostT[] }[] } | undefined) => {
                        if (oldData) {
                            const pages = oldData.pages
                            let page = -1
                            for (let i = 0; i < pages.length; i++) {
                                if (pages[i].feed.some((val: any) => val.id === id)) {
                                    page = i
                                    break;
                                }
                            }
                            if (page > -1) {
                                pages[page].feed = pages[page].feed.map((post: any) => {
                                    if (post.id === id) {
                                        return { ...post, likes_count: likedRef.current ? post.likes_count + 1 : post.likes_count - 1, has_liked: likedRef.current }
                                    }
                                    return post
                                });
                            }
                            return { ...oldData, pages: [...pages] }
                        }
                        return undefined
                    })

                    queryClient.setQueryData(["posts", { coupleName: couple_name }], (oldData: any) => {
                        if (oldData) {
                            const { pages } = oldData
                            let page = -1
                            for (let i = 0; i < pages.length; i++) {
                                if (pages[i].posts.some((val: any) => val.id === id)) {
                                    page = i
                                    break;
                                }
                            }
                            if (page > -1) {
                                pages[page].posts = pages[page].posts.map((post: any) => {
                                    if (post.id === id) {
                                        return { ...post, likes_count: likedRef.current ? post.likes_count + 1 : post.likes_count - 1, has_liked: likedRef.current }
                                    }
                                    return post
                                });
                            }
                            return { ...oldData, pages: [...pages] }
                        }
                        return undefined
                    })
                },
                onError: () => {
                    if (liked) {
                        setLikes(likesNum - 1)
                    } else {
                        setLikes(likesNum + 1)
                    }
                    setLiked(!liked)
                }
            }
        )

        return (
            <div className={styles.postIcons}>
                <Link href={`/${couple_name}/${postId}`}>
                    <a className={styles.postIcon}>
                        <div>
                            <AiOutlineComment size={25} />
                        </div>
                        <p>{c}</p>
                    </a>
                </Link >
                <div className={styles.postIcon}>
                    <div onClick={() => {
                        if (liked) {
                            likedRef.current = false
                            likePost.mutate("unlike")
                            setLikes(likesNum - 1)
                        } else {
                            likedRef.current = true
                            likePost.mutate("like")
                            setLikes(likesNum + 1)
                        }
                        setLiked(!liked)
                    }} style={{ cursor: "pointer" }} >
                        {liked ? <AiFillHeart size={25} color="var(--error)" /> : <AiOutlineHeart size={25} />}
                    </div>
                    <p>{l}</p>
                </div>
            </div >
        )
    }

const ReportPost: React.FunctionComponent<{ closeModal: () => void, id: string }> = ({ closeModal, id }) => {

    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const notify = useContext(ToasContext)

    const report = useRef<HTMLUListElement>(null)

    const reportMutation = useMutation<AxiosResponse, AxiosError<any, any>, { reports: number[] }>(
        (reports) => {
            return axios.post(`${BASEURL}/post/report/${id}`, JSON.stringify(reports))
        },
        {
            onSuccess: data => {
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: err => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const reportPost = () => {
        if (reportMutation.isLoading) return
        const reports = []
        for (let list of Array.from(report.current!.childNodes)) {
            const inp = list.firstChild as HTMLInputElement
            if (inp.checked) {
                reports.push(Number(inp.value))
            }
        }
        reportMutation.mutate({ reports })
    }
    return (
        <div className={`${styles.modalBody} ${styles.editModal}`}>
            <div className={styles.editHeader}>
                <div className={styles.backIcon} onClick={closeModal}>
                    <IoMdClose size={20} color="var(--accents-6)" />
                </div>
                <p>{localeTr.reportpost}</p>
                <button onClick={reportPost}
                    className={styles.saveButton}
                >
                    {reportMutation.isLoading ? <Loading size="small" color="white" /> : localeTr.send}
                </button>
            </div>
            <ul className={`${styles.modalContent} ${styles.report}`} ref={report}>
                <li className={styles.reportItem}>
                    <input type="checkbox" id="adult" value={5}
                        className={styles.reportInput} />
                    <label htmlFor="adult">{localeTr.reports["1"]}</label>
                </li>
                <li className={styles.reportItem}>
                    <input type="checkbox" value={4}
                        id="harassment"
                        className={styles.reportInput} />
                    <label htmlFor="harassment">{localeTr.reports["2"]}</label>
                </li>
                <li className={styles.reportItem}>
                    <input type="checkbox" value={3}
                        id="violence"
                        className={styles.reportInput} />
                    <label htmlFor="violence">{localeTr.reports["3"]}</label>
                </li>
                <li className={styles.reportItem}>
                    <input type="checkbox" value={2}
                        id="fake"
                        className={styles.reportInput} />
                    <label htmlFor="fake">{localeTr.reports["4"]}</label>
                </li>
                <li className={styles.reportItem}>
                    <input type="checkbox" value={1}
                        id="intellectual"
                        className={styles.reportInput} />
                    <label htmlFor="intellectual">{localeTr.reports["5"]}</label>
                </li>
            </ul>
        </div>
    )
}

const EditPost: React.FunctionComponent<{
    closeModal: () => void, caption: string, location: string,
    id: string, pId: string, couple_name: string; update: (caption: string, location: string) => void
    // eslint-disable-next-line react/display-name
}> = React.memo(({ closeModal, caption, location, id, pId, couple_name, update }) => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const [edit, setEdit] = useState({ caption: caption, location: location })
    const queryClient = useQueryClient()
    const notify = useContext(ToasContext)


    const editMutation = useMutation<AxiosResponse, AxiosError<any, any>, { caption: string, location: string }>(
        (edit: { caption: string, location: string }) => {
            return axios.put(`${BASEURL}/post/${id}`, JSON.stringify(edit))
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData(["post", { postId: pId }], (oldData: any) => {
                    if (oldData) {
                        return { ...oldData, location: edit.location, caption: edit.caption }
                    }
                    return undefined
                });

                queryClient.setQueryData(["feed"], (oldData: any) => {
                    if (oldData) {
                        const pages = oldData.pages
                        let page = -1
                        for (let i = 0; i < pages.length; i++) {
                            if (pages[i].feed.some((val: any) => val.id === id)) {
                                page = i
                                break;
                            }
                        }
                        if (page > -1) {
                            pages[page].feed = pages[page].feed.map((post: any) => {
                                if (post.id === id) {
                                    return { ...post, location: edit.location, caption: edit.caption }
                                }
                                return post
                            });
                        }
                        return { ...oldData, pages: [...pages] }
                    }
                    return undefined
                })

                queryClient.setQueryData(["posts", { coupleName: couple_name }], (oldData: any) => {
                    if (oldData) {
                        const { pages } = oldData
                        let page = -1
                        for (let i = 0; i < pages.length; i++) {
                            if (pages[i].posts.some((val: any) => val.id === id)) {
                                page = i
                                break;
                            }
                        }
                        if (page > -1) {
                            pages[page].posts = pages[page].posts.map((post: any) => {
                                if (post.id === id) {
                                    return { ...post, location: edit.location, caption: edit.caption }
                                }
                                return post
                            });
                        }
                        return { ...oldData, pages: [...pages] }
                    }
                    return undefined
                })
                closeModal()
                update(edit.caption, edit.location)
                const { message, type } = data.data as MutationResponse
                notify!.notify(message, type)
            },
            onError: err => {
                notify!.notify(err.response?.data.message, "ERROR")
            }
        })

    const editPost = () => {
        if (editMutation.isLoading) return
        editMutation.mutate({ caption: edit.caption, location: edit.location })
    }

    return (
        <div className={`${styles.modalBody} ${styles.editModal}`}>
            <div className={styles.editHeader}>
                <div className={styles.backIcon} onClick={closeModal}>
                    <IoMdClose size={20} color="var(--accents-6)" />
                </div>
                <p>{localeTr.edit}</p>
                <button onClick={editPost}
                    className={styles.saveButton}
                >
                    {editMutation.isLoading ? <Loading size="small" color="white" /> : localeTr.save}
                </button>
            </div>
            <div className={`${styles.modalContent} ${styles.captionStage}`}>
                <div className={styles.editItem}>
                    <label htmlFor="caption">{localeTr.caption.title}</label>
                    <textarea
                        placeholder={localeTr.caption.placeholder}
                        className={styles.textArea}
                        id="caption"
                        defaultValue={caption}
                        onChange={(e) => setEdit({ ...edit, caption: e.target.value })}
                    ></textarea>
                </div>
                <div className={styles.editItem}>
                    <label htmlFor="location">{localeTr.location.title}</label>
                    <input
                        type="text"
                        placeholder={localeTr.location.placeholder}
                        id="location"
                        defaultValue={location}
                        onChange={(e) => setEdit({ ...edit, location: e.target.value })}
                    />
                </div>
            </div>

        </div>
    )
})

const SliderIndicator: React.FC<{ pos: number, curr: number }> = ({ pos, curr }) => {
    return (
        <div className={`${styles.indicator} ${pos === curr ? styles.indicatorActive : ""}`}>
        </div>
    )
}


export const TextParser: React.FC<{ text: string }> = ({ text }) => {
    let i = 0
    let ind = -1
    const parsed: ReactNode[] = []
    const tags = []
    while (i < text.length) {
        if (text[i] === "@") {
            ind = i
        } else {
            const reg = new RegExp(/[\n\r\s]+/)
            if (reg.test(text[i])) {
                if (ind > -1) {
                    if (i - ind > 3) {
                        tags.push([ind, i - 1])
                    }
                    ind = -1
                }
            }
        }
        i++
    }

    if (ind > 0) {
        tags.push([ind, text.length - 1])
    }
    let start = 0
    for (let i = 0; i < tags.length; i++) {
        parsed.push(<span key={Date.now()}>{text.substring(start, tags[i][0])}</span>)
        const tag = text.substring(tags[i][0], tags[i][1] + 1)
        parsed.push(<Link href={`/user/${tag.substring(1)}`} key={tag + Date.now()}><span style={{ color: "var(--success)" }}>{tag}</span></Link>)
        start = tags[i][1] + 1
    }
    if (start < text.length - 1) {
        parsed.push(<span key={text.substring(start) + Date.now()}>{text.substring(start)}</span>)
    }
    return (
        <div style={{ whiteSpace: "pre-wrap" }}>
            {parsed}
        </div>
    )
}

export default PostFullView
