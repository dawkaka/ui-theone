import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from 'react-icons/ai';
import { MdBlock, MdModeEdit, MdOutlineContentCopy, MdOutlineNavigateNext, MdReport } from "react-icons/md";
import styles from "./styles/post.module.css";
import { Actions, Loading, Verified, Video } from "./mis";
import { BsArrowUpRight, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiUserUnfollowLine } from "react-icons/ri";
import Modal from 'react-modal';
import Comments from "./comment";
import { useRouter } from "next/router";
import { Langs, MutationResponse, PostT } from "../types";
import tr from "../i18n/locales/components/post.json";
import emTr from "../i18n/locales/components/emoji.json"
import { BiCommentX } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../hooks";
import { Categories, EmojiStyle } from "emoji-picker-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { FaHeart } from "react-icons/fa";
import { Prompt } from "./prompt";
import { postDateFormat } from "../libs/utils";
import { ToasContext } from "./context";
import { NotFound } from "./notfound";

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
        couple_name, verified, has_liked, profile_picture, id, postId, caption,
        likes_count, comments_count, is_this_couple, location, files, created_at } = props
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [modalOpen, setModalOpen] = useState(false)
    const [step, setStep] = useState<"actions" | "edit" | "report">("actions")
    const [following, setFollowing] = useState(false)
    const [prOpen, setPrOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const notify = useContext(ToasContext)
    const queryClient = useQueryClient()

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
                console.log(err)
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
                                />
                            </span>
                        </div>
                        <div>
                            <Link href={`/${couple_name}`}>
                                <a>
                                    <h4>{couple_name + " "} {verified && <Verified size={13} />}</h4>
                                    <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>{props.location}</p>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div onClick={() => setModalOpen(true)}>
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

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "var(--gap-half)" }}>
                        <p style={{ color: "var(--accents-3)", fontSize: "small" }}>{postDateFormat(created_at)}</p>
                        <div className={styles.viewSliderPos}>
                            {
                                files?.length > 1 && files.map((_: any, indx: number) => (<SliderIndicator pos={indx} curr={curr} key={indx} />))

                            }
                        </div>
                        <PostIcons likes={likes_count} comments={comments_count} id={id} hasLiked={has_liked} />
                    </div>
                    <div className={styles.captionContainer}>
                        <Link
                            href={`/${couple_name}/${props.postId}`}
                        >
                            <a>
                                <p>
                                    {caption}
                                </p>
                            </a>
                        </Link>
                    </div>
                </div>
                <div
                    style={{ position: "relative", borderTop: "var(--border)" }}
                >
                    <CommentArea isCard={true} id={id} />
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
                                    <li className={styles.actionItem} onClick={() => setStep("edit")} ><span>Edit</span><MdModeEdit size={25} /></li>
                                    <li className={styles.actionItem}><span>Close comments</span><BiCommentX size={25} /></li>
                                    <li className={styles.actionItem} onClick={copyPostURl}><span>Copy post url</span> <MdOutlineContentCopy size={25} /></li>
                                    <li className={styles.actionItem} onClick={() => router.push(`/${couple_name}/${postId}`)}><span>Go to post</span> <BsArrowUpRight size={25} /></li>

                                    <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setPrOpen(true)}><span>Delete</span><AiOutlineDelete size={25} /></li>
                                    <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                </>
                            ) :
                                (
                                    <>
                                        <li className={`${styles.actionItem} ${styles.dangerAction}`}><span>Block @{couple_name}</span><MdBlock size={25} /></li>
                                        <li className={styles.actionItem} onClick={followUnfollow}><span>{following ? localeTr.unfollow : localeTr.follow} @{couple_name}</span><RiUserUnfollowLine size={25} /></li>
                                        <li className={styles.actionItem}><span>copy post url</span> <MdOutlineContentCopy size={25} /></li>
                                        <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><span>Report</span><MdReport size={25} /></li>
                                        <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                    </>
                                )
                            }
                        </ul>
                    )
                }
                {
                    step === "edit" && (
                        <EditPost closeModal={closeModal} caption={caption} location={location} id={id} />
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
                    message="Delete post?"
                    dangerAction
                    acceptFun={() => deletePost.mutate(id)}
                />
            </Modal>
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
        return () => {
            slider.current?.removeEventListener("scroll", scrollHandler)
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

    const { data } = useQuery(["post", { postId }],
        () => axios.get(`${BASEURL}/post/${couplename}/${postId}`),
        { initialData, staleTime: Infinity })

    if (data.data === null) {
        return (

            <NotFound message="Post not found" />

        )
    }
    const post = data.data
    return (
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

                                        src={`${IMAGEURL}/${post.profile_picture}`}
                                        className={styles.profileImage}
                                    />
                                </span>
                            </div>
                            <div>
                                <Link href={`/${post.couple_name}`}>
                                    <a>
                                        <h4>{post.couple_name}{" "}{post.verified ? <Verified size={13} /> : ""}</h4>
                                    </a>
                                </Link>
                                <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>{post.location}</p>
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
                        <p style={{ whiteSpace: "pre-line" }}>
                            {post.caption}
                        </p>
                        <div className={styles.postStats} style={{ marginLeft: 0, paddingInline: 0 }}>
                            <PostIcons likes={post.likes_count} comments={post.comments_count} id={post.id} hasLiked={post.has_liked} />
                            <p style={{ color: "var(--accents-3)", fontSize: "small" }}>{postDateFormat(post.created_at)}</p>
                        </div>
                    </div>
                    <Comments id={post.id} />
                </div >
                <div className={styles.viewFixedBottom}>
                    <CommentArea isCard={false} id={post.id} />
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
                                        <li className={styles.actionItem}><span>Close comments</span><BiCommentX size={25} /></li>
                                        <li className={styles.actionItem} onClick={copyPostURl}><span>Copy post link</span> <MdOutlineContentCopy size={25} /></li>
                                        <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setPrOpen(true)}><span>Delete</span><AiOutlineDelete size={25} /></li>
                                        <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                    </>
                                ) :
                                    (
                                        <>
                                            <li className={`${styles.actionItem} ${styles.dangerAction}`}><span>Block @{post.couple_name}</span><MdBlock size={25} /></li>
                                            <li className={styles.actionItem} onClick={followUnfollow}><span>{following ? localeTr.unfollow : localeTr.follow} @{post.couple_name}</span><RiUserUnfollowLine size={25} /></li>
                                            <li className={styles.actionItem}><MdOutlineContentCopy size={25} /><span>copy post url</span> </li>
                                            <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><span>Report</span><MdReport size={25} /></li>
                                            <li className={`${styles.actionItem}`} onClick={closeModal}><p style={{ marginInline: "auto" }}>{localeTr.close}</p></li>
                                        </>
                                    )
                            }

                        </ul>
                    )
                }
                {
                    step === "edit" && (
                        <EditPost closeModal={closeModal} caption={post.caption} location={post.location} id={post.id} pId={postId} />
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
                    message="Delete post?"
                    dangerAction
                    acceptFun={() => deletePost.mutate(post.id)}
                />
            </Modal>
        </div >
    )
}


const CommentArea: React.FunctionComponent<{ isCard: boolean, id: string }> = ({ isCard, id }) => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const emojiTr = emTr[locale as Langs]
    const [openEmoji, setOpenEmoji] = useState(false)
    const [comment, setComment] = useState("")
    const theme = useTheme()
    const notify = useContext(ToasContext)


    const { mutate, isLoading } = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (comment) => {
            return axios.post(`${BASEURL}/post/comment/${id}`, JSON.stringify({ comment }))
        },
        {
            onSuccess: data => {
                setComment("")
                const { message, type } = data.data as MutationResponse
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
            >
                <div onClick={() => setOpenEmoji(!openEmoji)} style={{ display: "grid", placeItems: "center" }}>
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

const PostIcons: React.FunctionComponent<{ likes: number, comments: number, id: string, hasLiked: boolean }> = ({ likes, comments, id, hasLiked }) => {
    const { locale } = useRouter()

    const [liked, setLiked] = useState(hasLiked)
    const [likesNum, setLikes] = useState(likes)
    const l = new Intl.NumberFormat(locale, { notation: "compact" }).format(likesNum)
    const c = new Intl.NumberFormat(locale, { notation: "compact" }).format(comments)


    const likePost = useMutation<AxiosResponse, AxiosError<any, any>, string>(
        (action: string) => {
            return axios.patch(`${BASEURL}/post/${action}/${id}`)
        },
        {
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
            <div className={styles.postIcon}>
                <div>
                    <AiOutlineComment size={25} />
                </div>
                <p>{c}</p>
            </div>
            <div className={styles.postIcon}>
                <div onClick={() => {
                    if (liked) {
                        likePost.mutate("unlike")
                        setLikes(likesNum - 1)
                    } else {
                        likePost.mutate("like")
                        setLikes(likesNum + 1)
                    }
                    setLiked(!liked)
                }} style={{ cursor: "pointer" }} >
                    {liked ? <AiFillHeart size={25} color="var(--error)" /> : <AiOutlineHeart size={25} />}
                </div>
                <p>{l}</p>
            </div>
        </div>
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

const EditPost: React.FunctionComponent<{ closeModal: () => void, caption: string, location: string, id: string, pId?: string }> =
    ({ closeModal, caption, location, id, pId }) => {
        const locale = useRouter().locale || "en"
        const localeTr = tr[locale as Langs]
        const editRef = useRef({ caption: caption, location: location })
        const queryclient = useQueryClient()
        const notify = useContext(ToasContext)


        const editMutation = useMutation<AxiosResponse, AxiosError<any, any>, { caption: string, location: string }>(
            (edit: { caption: string, location: string }) => {
                return axios.put(`${BASEURL}/post/${id}`, JSON.stringify(edit))
            },
            {
                onSuccess: (data) => {
                    queryclient.invalidateQueries(["post", { postId: pId }])
                    closeModal()
                    const { message, type } = data.data as MutationResponse
                    notify!.notify(message, type)
                },
                onError: err => {
                    notify!.notify(err.response?.data.message, "ERROR")
                }
            })

        const editPost = () => {
            if (editMutation.isLoading) return
            editMutation.mutate({ caption: editRef.current.caption, location: editRef.current.location })
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
                            onChange={(e) => editRef.current.caption = e.target.value}
                        ></textarea>
                    </div>
                    <div className={styles.editItem}>
                        <label htmlFor="location">{localeTr.location.title}</label>
                        <input
                            type="text"
                            placeholder={localeTr.location.placeholder}
                            id="location"
                            defaultValue={location}
                            onChange={(e) => editRef.current.location = e.target.value}
                        />
                    </div>
                </div>

            </div>
        )
    }

const SliderIndicator: React.FC<{ pos: number, curr: number }> = ({ pos, curr }) => {
    return (
        <div className={`${styles.indicator} ${pos === curr ? styles.indicatorActive : ""}`}>
        </div>
    )
}


export default PostFullView
