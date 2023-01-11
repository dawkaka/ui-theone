import React, { useRef, useState, useContext, useMemo } from "react";
import { ChangeEvent } from "react";
import Image from "next/image";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Layout from "../../components/mainLayout";
import styles from "../../styles/profile.module.css"
import { MdBlock, MdModeEdit, MdOutlineAddToPhotos, MdPeopleOutline } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiArrowBack, BiMessageRounded } from "react-icons/bi";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { EditUser } from "../../components/editprofile";
import { Actions, CheckMark, Loader, Loading, Verified } from "../../components/mis";
import { UserSettings } from "../../components/settings"
import tr from "../../i18n/locales/profile.json"
import { CouplePreviewT, Langs, MutationResponse } from "../../types";
import CouplePreview from "../../components/couplepreview";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../../constants";
import { Prompt } from "../../components/prompt";
import { GetServerSideProps } from "next";
import { ToasContext } from "../../components/context";
import { NotFound } from "../../components/notfound";
import Head from "next/head";
import Link from "next/link";
import { AiFillHeart, AiOutlineUser } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { useUser } from "../../hooks";
Modal.setAppElement("#__next")

export default function Profile(props: any) {
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const cropperRef = useRef<any>(null)
    const avatarImgRef = useRef<HTMLImageElement>(null)
    const newFileRef = useRef<any>("")
    const targetRef = useRef<"avatar" | "show">("avatar")
    const [showImage, setShowImage] = useState(0)
    const [editOpen, setEditOpen] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [openFollowing, setOpenFollowing] = useState(false)
    const [openFind, setOpenFind] = useState(false)
    const [prOpen, setPrOpen] = useState(false)
    const queryClient = useQueryClient()
    const notify = useContext(ToasContext)
    const [image, setImage] = useState("")
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [showActions, setShowActions] = useState(false)
    const cacheKey = ["profile", { name: router.query.name }]

    const editProfileImage = () => {
        targetRef.current = "avatar"
        setIsOpen(true)
    }

    const { hasPartner: thisUserHasPatner } = useUser()

    const updatePicMutation = useMutation<AxiosResponse, AxiosError<any, any>, FormData>(
        (data) => {
            return axios.post(`${BASEURL}/user/profile-pic`, data)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(cacheKey)
                avatarImgRef.current!.src = newFileRef.current
                setIsOpen(false)
                const { message, type } = data.data as MutationResponse
                notify?.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )
    const updateShowPicMutation = useMutation<AxiosResponse<MutationResponse>, AxiosError<any, any>, FormData>(
        (data) => {
            return axios.post(`${BASEURL}/user/show-pictures/${showImage}`, data)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["profile", { name: router.query.name }])
                setIsOpen(false)
                const imgTarget = document.querySelector<HTMLImageElement>("#show-image-" + showImage)
                if (imgTarget) {
                    imgTarget.srcset = newFileRef.current
                }
                const { message, type } = data.data
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
            if (updatePicMutation.isLoading) return
            formData.append("profile-picture", blob, "profile.jpeg")
            updatePicMutation.mutate(formData)

        } else {
            if (updateShowPicMutation.isLoading) return
            formData.append("show_picture", blob, "show.jpeg")
            updateShowPicMutation.mutate(formData)
        }
    }

    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                setImage(reader.result as string)
                newFileRef.current = e.target?.result
            }
            setStep(1)
        }
    }

    const editShowImage = (n: number) => {
        setShowImage(n)
        setIsOpen(true)
        targetRef.current = "show"
    }

    const sendRequestMutation = useMutation<AxiosResponse<MutationResponse>, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/couple-request/${router.query.name}`)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['pending-request'])
                const { message } = data.data
                notify?.notify(message, "SUCCESS")
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const { data } = useQuery(cacheKey, () => axios.get(`${BASEURL}/user/${router.query.name}`).then(res => res.data),
        { initialData: props.user.data, staleTime: Infinity })

    const blockMutation = useMutation<AxiosResponse<MutationResponse>, AxiosError<any, any>>(
        () => axios.post(`${BASEURL}/couple/block/${router.query.name}`),
        {
            onSuccess: (data) => {
                const { message, type } = data.data
                notify?.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const block = () => {
        blockMutation.mutate()
    }

    const { completed, pos } = useMemo(() => {
        const arr: ("profile" | "bio" | "show" | "follow")[] = []
        if (!data) return { completed: arr, pos: 0 }
        console.log(data)
        const { profile_picture, bio, show_pictures, following_count } = data as { profile_picture: string, bio: string, following_count: number, show_pictures: string[] }
        if (profile_picture.indexOf("default") > -1) {
            arr.push("profile")
        }
        if (!bio || bio === "-") {
            arr.push("bio")
        }
        if (following_count < 5) {
            arr.push("follow")
        }
        let pos = -1
        const pics = show_pictures.filter((pic, i) => {
            let isdefault = pic.indexOf("default") > -1
            if (pos < 0 && isdefault) {
                pos = i
            }
            return isdefault
        })
        if (pics.length > 0) {
            arr.push("show")
        }
        return { completed: arr, pos: pos }
    }, [data])

    if (data === null) {
        return (
            <Layout>
                <NotFound type="user" />
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>@{data?.user_name} - {localeTr.title}</title>
                <meta name="robots" content="index,follow" />
                <meta name="description" content={`@${data?.user_name} - ${data.bio}`} />

                <meta property="og:url" content={`${BASEURL}/user/${data?.user_name}`} />
                <meta property="og:title" content={`${localeTr.sendme} @${data?.user_name}`} />
                <meta property="og:image" content={`${IMAGEURL}/${data?.profile_picture}`} />
                <meta property="og:description" content={data.bio} />

                <meta name="twitter:description" content={data.bio} />
                <meta name="twitter:title" content={`${localeTr.sendme} @${data?.user_name}`} />
                <meta name="twitter:image" content={`${IMAGEURL}/${data?.profile_picture}`} />
                <meta name="twitter:image:src" content={`${IMAGEURL}/${data?.profile_picture}`} />
                <link rel="canonical" href={`${BASEURL}/user/${data?.user_name}`} />

            </Head>
            <section className={styles.section} onClick={() => setShowActions(false)}>
                <div className={styles.profileTopContainer}>
                    <div className={styles.profileTop}>
                        <div className={styles.infoWrapper}>
                            <div className={styles.infoContainer}>
                                <div className={styles.imageContainer} style={{ width: "116px", height: "116px" }}>
                                    <img
                                        ref={avatarImgRef}
                                        style={{ objectFit: "cover", position: "absolute", borderRadius: "50%" }}
                                        src={`${IMAGEURL}/${data?.profile_picture}`}
                                        className={styles.profileImage}
                                        alt="User's profile"
                                    />
                                    {
                                        data.is_this_user && (<span
                                            className={styles.avatarContainer}
                                            style={{ width: "116px", height: "116px" }}
                                            onClick={editProfileImage}
                                        >
                                            <MdModeEdit size={30} color="white" />
                                        </span>
                                        )
                                    }
                                </div>
                                <div className={styles.titleContainer}>
                                    <h2 className={styles.realName}>{data.first_name} {data.last_name}</h2>
                                    <h3 className={styles.userName}>@{data.user_name}
                                        {data.has_partner ? <AiFillHeart color="var(--error)" size={18} title="has partner"></AiFillHeart> : null}
                                    </h3>
                                    <div className={styles.requestContainer}>
                                        <div className={styles.requestButtonWrapper}>
                                            {
                                                !data.is_this_user ?
                                                    data.has_partner ?
                                                        <Link href={`/${data.couple_name}`}>
                                                            <a
                                                                className={styles.requestButton}
                                                                style={{ color: "white" }}
                                                            >
                                                                {localeTr.coupleprofile}
                                                            </a>
                                                        </Link>
                                                        :
                                                        !thisUserHasPatner && <button type="button" className={styles.requestButton}
                                                            onClick={() => {
                                                                setPrOpen(true)
                                                            }}>{localeTr.sendrequest}</button>
                                                    :
                                                    <>
                                                        <button onClick={() => setEditOpen(true)} className={`${styles.requestButton} ${styles.editButton}`}>
                                                            {localeTr.edit}
                                                        </button>
                                                        {
                                                            data.has_partner && <Link href={`/${data.couple_name}`}>
                                                                <a
                                                                    className={styles.requestButton}
                                                                    style={{ color: "white" }}
                                                                >
                                                                    {localeTr.coupleprofile}
                                                                </a>
                                                            </Link>
                                                        }
                                                    </>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.countInfo}>
                                <div className={styles.countItem} onClick={() => setOpenFollowing(true)}>
                                    <strong title="Following">{data.following_count}</strong>
                                    <span className={styles.countItemTitle}>{localeTr.following}</span>
                                </div>
                            </h2>
                            <h2 className={styles.bio}>
                                {data.bio}
                            </h2>
                        </div>
                        {
                            data.is_this_user ? (
                                <div className={styles.actions} onClick={() => setOpenSettings(true)}>
                                    <Actions orientation="landscape" size={25} />
                                </div>
                            ) : (
                                (
                                    <div className={styles.actions} onClick={(e) => {
                                        e.stopPropagation()
                                        setShowActions(prv => !prv)
                                    }}>
                                        <Actions orientation="landscape" size={25} />
                                        {
                                            showActions &&
                                            (<ul className={styles.userActions}>
                                                <li onClick={block}
                                                    className={`${styles.actionItem} ${styles.dangerAction}`}>
                                                    <MdBlock size={25} />
                                                    <span>{localeTr.block}</span>
                                                </li>
                                            </ul>
                                            )
                                        }
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>

                {
                    data.is_this_user && completed.length > 0 ?
                        <RecommendedActions
                            completed={completed}
                            addShow={() => editShowImage(pos)}
                            addPro={editProfileImage}
                            addBio={() => setEditOpen(true)}
                            addCouples={() => setOpenFind(true)}
                        />
                        :
                        null
                }

                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        {
                            data.show_pictures.map((file: string, indx: number) => {
                                return (
                                    <ShowPicture file={`${IMAGEURL}/${file}`} position={indx} editProfileImage={editShowImage} key={indx} isThisUser={data.is_this_user} />
                                )
                            })
                        }
                    </div>
                </div>
                <Prompt
                    open={prOpen}
                    close={() => setPrOpen(false)}
                    acceptFun={sendRequestMutation.mutate}
                    dangerAction={false}
                    title={localeTr.requestprompt.title}
                    message={localeTr.requestprompt.message}
                    actionText={localeTr.requestprompt.actiontext}
                    cancelText={localeTr.requestprompt.canceltext}

                />
                <EditUser open={editOpen} close={() => setEditOpen(false)}
                    first_name={data.first_name}
                    last_name={data.last_name}
                    bio={data.bio}
                    website={data.website}
                    dob={data.date_of_birth}
                />
                <UserSettings open={openSettings} close={() => setOpenSettings(false)} />
                <Following open={openFollowing} close={() => setOpenFollowing(false)} heading={localeTr.following} />
                <FindCouples open={openFind} close={() => setOpenFind(false)} heading={localeTr.findcouples} />
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
                            margin: 0,
                            backgroundColor: "var(--background)",
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
                                    <div onClick={onDone} className={styles.nextContainer}>
                                        {
                                            updatePicMutation.isLoading || updateShowPicMutation.isLoading ? <Loading size="small" color="var(--success)" /> : <p>{localeTr.done}</p>
                                        }
                                    </div>
                                </div>
                                <div className={styles.modalContent}>
                                    <Cropper
                                        src={image}
                                        dragMode="move"
                                        style={{ height: "500px", width: "100%" }}
                                        // Cropper.js options
                                        viewMode={2}
                                        aspectRatio={1}
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

            </section >
        </Layout >
    )
}



const ShowPicture: React.FunctionComponent<{
    editProfileImage: (a: number) => void,
    file: string,
    position: number,
    isThisUser: boolean
}>
    = ({ editProfileImage, position, file, isThisUser }) => {
        const edit = () => {
            editProfileImage(position)
        }
        return (
            <article className={styles.showImageContainer}>
                <div className={styles.showImage}>
                    <Image src={file}
                        height="230px" width="230px" layout="responsive"
                        objectFit="cover" id={`show-image-${position}`}
                        alt=""
                    />
                </div>
                {isThisUser && (<span
                    className={styles.showImageEdit}
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={edit}
                >
                    <MdModeEdit size={20} color="var(--accents-1)" />
                </span>
                )}
            </article>
        )
    }




export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const name = ctx.query.name as string
    try {
        const res = await axios.get(`${BASEURL}/user/${name}`, {
            headers: {
                Cookie: `session=${ctx.req.cookies.session}`
            }
        })
        return { props: { user: { data: res.data } } }
    } catch (err: any) {
        if (err.response?.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/login",
                },
                props: {},
            };
        }
        return { props: { user: { data: null } } }
    }
}


const RecommendedActions: React.FC<{ completed: ("profile" | "bio" | "show" | "follow")[], addPro: () => void, addBio: () => void, addShow: () => void, addCouples: () => void }> =
    // eslint-disable-next-line react/display-name
    React.memo(({ completed, addBio, addCouples, addPro, addShow }) => {
        const size = 50
        const [actions, setActions] = useState([
            {
                icon: <AiOutlineUser size={size} />,
                title: "Add profile photo",
                message: "Select a profile picture to represent yourself on Prime Couples",
                completed: !completed.includes("profile"),
                btnText: "Add photo",
                btnFunc: addPro
            },
            {
                icon: <BiMessageRounded size={size} />,
                title: "Add bio",
                message: "Give your followers a brief overview of who you are",
                completed: !completed.includes("bio"),
                btnText: "Add bio",
                btnFunc: addBio
            },
            {
                icon: <MdOutlineAddToPhotos size={size} />,
                title: "Add show photos",
                message: "Add up to 6 pictures to your profile to help people identify you.",
                completed: !completed.includes("show"),
                btnText: "Add show photo",
                btnFunc: addShow
            },
            {
                icon: <BsPeople size={size} />,
                title: "Find more couples",
                message: "Follow your favorite couples to stay up to date with their posts.",
                completed: !completed.includes("follow"),
                btnText: "Find couples",
                btnFunc: addCouples
            }
        ])

        return (
            <div style={{ display: "grid", paddingTop: "var(--gap)" }}>
                <p style={{ marginLeft: "var(--gap)" }}>Finish up your profile</p>
                <small
                    style={{
                        marginLeft: "var(--gap)",
                        marginTop: "var(--gap-half)"
                    }}>
                    <span style={{ color: "var(--success)" }}>{4 - completed.length} of 4</span> copmlete
                </small>
                <div style={{ display: "flex", flexWrap: "nowrap", padding: "var(--gap)", gap: "var(--gap)", overflowX: "auto" }}>
                    {
                        actions.map(({ icon, title, message, completed, btnText, btnFunc }) => {
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flexShrink: 0,
                                        width: "200px",
                                        border: "var(--border)",
                                        borderRadius: "var(--radius-small)",
                                        padding: "var(--gap) var(--gap-half)",
                                        alignItems: "center",
                                        gap: "var(--gap-quarter)"
                                    }}
                                    key={title}
                                >
                                    {icon}
                                    <span style={{ fontWeight: "bold", lineHeight: "100%" }}>{title}</span>
                                    <small style={{ textAlign: "center", marginBottom: "var(--gap-half)" }}>{message}</small>
                                    <div style={{ marginTop: "auto" }}>
                                        {
                                            completed ?
                                                <CheckMark size={35} />
                                                :
                                                <button
                                                    style={{ width: "150px", paddingBlock: "var(--gap-quarter)" }}
                                                    onClick={() => btnFunc()}
                                                >
                                                    {btnText}
                                                </button>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        )
    })


const Following: React.FunctionComponent<{ open: boolean, close: () => void, heading: string }> = ({ open, close, heading }) => {
    const { query: { name } } = useRouter()
    const queryClient = useQueryClient()

    const fetchPosts = ({ pageParam = 0 }) => axios.get(`${BASEURL}/user/following/${name}/${pageParam}`).then(res => res.data)
    const cacheKey = ["following", { name }]
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(cacheKey, fetchPosts,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.pagination.end) {
                    return undefined
                }
                return lastPage.pagination.next
            },
            staleTime: Infinity
        })


    let following: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            following = following.concat(page.following)
        }
    }

    const updateCache = (couple_name: string) => {
        queryClient.setQueryData(cacheKey, (oldData: { pages: { following: CouplePreviewT[] }[] } | undefined) => {
            if (oldData) {
                const pages = oldData.pages
                let page = 0
                for (let i = 0; i < pages.length; i++) {
                    if (pages[i].following.some(val => val.couple_name === couple_name)) {
                        page = i
                        break;
                    }
                }
                pages[page].following = pages[page].following.map((preview) => {
                    if (preview.couple_name === couple_name) {
                        return { ...preview, is_following: !preview.is_following }
                    }
                    return preview
                });
                oldData.pages = pages
                return oldData
            }
            return undefined
        });
    }


    return (
        <Modal closeTimeoutMS={200} isOpen={open} onRequestClose={close}

            style={{
                overlay: {
                    zIndex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
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
            <div className={styles.modalBody} style={{ maxWidth: "450px" }}>
                <div className={styles.requestHeader}>
                    <p>{" "}</p>
                    <p>{heading}</p>
                    <div onClick={() => close()}
                        className={styles.closeContainer}
                    >
                        <IoMdClose color="tranparent" size={25} />
                    </div>
                </div>
                <div className={styles.followingContent}>
                    {
                        following.length === 0 && <NotFound type="following" />
                    }
                    {
                        following.map(flw => (
                            <CouplePreview updateCache={() => updateCache(flw.couple_name)} couple_name={flw.couple_name} key={flw.couple_name} profile_picture={`${IMAGEURL}/${flw.profile_picture}`} married={flw.married} is_following={flw.is_following} verified={flw.verified} />
                        ))
                    }
                    <Loader hasNext={hasNextPage ? true : false} loadMore={fetchNextPage} isFetching={isFetching} manual={false} />
                </div>
            </div>
        </Modal>
    )

}

const FindCouples: React.FunctionComponent<{ open: boolean, close: () => void, heading: string }> = ({ open, close, heading }) => {
    const { query: { name } } = useRouter()
    const queryClient = useQueryClient()

    const cacheKey = "suggested"
    const { isLoading, data } = useQuery([cacheKey], () => axios.get(`${BASEURL}/couple/u/suggested-accounts`).then(res => res.data), { staleTime: Infinity })

    const updateCache = (couple_name: string) => {
        queryClient.setQueryData([cacheKey], (oldData: CouplePreviewT[] | undefined) => {
            if (oldData) {
                const newData = oldData.map((preview) => {
                    if (preview.couple_name === couple_name) {
                        return { ...preview, is_following: !preview.is_following }
                    }
                    return preview
                });
                return newData;
            }
            return []
        });
    }



    return (
        <Modal closeTimeoutMS={200} isOpen={open} onRequestClose={close}

            style={{
                overlay: {
                    zIndex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
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
            <div className={styles.modalBody} style={{ maxWidth: "450px" }}>
                <div className={styles.requestHeader}>
                    <p>{" "}</p>
                    <p>{heading}</p>
                    <div onClick={() => close()}
                        className={styles.closeContainer}
                    >
                        <IoMdClose color="tranparent" size={25} />
                    </div>
                </div>
                <div className={styles.followingContent}>
                    {
                        isLoading ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Loading size="medium" color="var(--success)" /></div> : null
                    }
                    {
                        data?.map((c: any) => (
                            <CouplePreview
                                key={c.couple_name}
                                profile_picture={`${IMAGEURL}/${c.profile_picture}`}
                                couple_name={c.couple_name} is_following={c.is_following} married={c.married} verified={c.verified}
                                updateCache={() => updateCache(c.couple_name)}
                            />
                        ))
                    }
                </div>
            </div>
        </Modal>
    )
}