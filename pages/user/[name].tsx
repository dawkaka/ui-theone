import { useRef, useState, useEffect, useContext, MouseEventHandler, MouseEvent } from "react";
import { ChangeEvent } from "react";
import Image from "next/image";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Layout from "../../components/mainLayout";
import styles from "../../styles/profile.module.css"
import { MdBlock, MdModeEdit, MdReport } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { EditUser } from "../../components/editprofile";
import { Actions, Loader, Loading } from "../../components/mis";
import { UserSettings } from "../../components/settings"
import tr from "../../i18n/locales/profile.json"
import { Langs, MutationResponse } from "../../types";
import CouplePreview from "../../components/couplepreview";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../../constants";
import { Prompt } from "../../components/prompt";
import { GetServerSideProps } from "next";
import { ToasContext } from "../../components/context";
import { NotFound } from "../../components/notfound";
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
    const [prOpen, setPrOpen] = useState(false)
    const queryClient = useQueryClient()
    const notify = useContext(ToasContext)
    const [image, setImage] = useState("")
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [showActions, setShowActions] = useState(false)

    const editProfileImage = (e: React.MouseEvent<HTMLSpanElement>) => {
        targetRef.current = "avatar"
        setIsOpen(true)
    }

    const updatePicMutation = useMutation<AxiosResponse, AxiosError<any, any>, FormData>(
        (data) => {
            return axios.post(`${BASEURL}/user/profile-pic`, data)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["profile", { name: router.query.name }])
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
    const updateShowPicMutation = useMutation<AxiosResponse, AxiosError<any, any>, FormData>(
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

    const sendRequestMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/couple-request/${router.query.name}`)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['pending-request'])
                const { message, type } = data.data as MutationResponse
                notify?.notify(message, type)
            },
            onError: (err) => {
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const { data } = useQuery(["profile", { name: router.query.name }],
        () => axios.get(`${BASEURL}/user/${router.query.name}`),
        { initialData: props.user, staleTime: Infinity })

    const blockMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => axios.post(`${BASEURL}/couple/block/${router.query.name}`),
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
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

    if (data.data === null) {
        return (
            <Layout>
                <NotFound type="user" />
            </Layout>
        )
    }

    return (
        <Layout>
            <section className={styles.section} onClick={() => setShowActions(false)}>
                <div className={styles.profileTopContainer}>
                    <div className={styles.profileTop}>
                        <div className={styles.infoWrapper}>
                            <div className={styles.infoContainer}>
                                <div className={styles.imageContainer} style={{ width: "116px", height: "116px" }}>
                                    <img
                                        ref={avatarImgRef}
                                        style={{ objectFit: "cover", position: "absolute", borderRadius: "50%" }}
                                        src={`${IMAGEURL}/${data?.data.profile_picture}`}
                                        className={styles.profileImage}
                                        alt="User's profile"
                                    />
                                    {
                                        data.data.is_this_user && (<span
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
                                    <h3 className={styles.userName}>@{data.data.user_name}</h3>
                                    <h2 data-e2e="user-subtitle" className={styles.realName}>{data.data.first_name} {data.data.last_name}</h2>
                                    <div className={styles.requestContainer}>
                                        <div className={styles.requestButtonWrapper}>
                                            {
                                                !data.data.is_this_user ?
                                                    <button type="button" className={styles.requestButton}
                                                        style={{ opacity: data.data.has_partner ? "0.5" : "1" }}
                                                        onClick={() => {
                                                            if (data.data.has_partner) return
                                                            setPrOpen(true)
                                                        }}>{localeTr.sendrequest}</button>
                                                    :
                                                    <button onClick={() => setEditOpen(true)} className={`${styles.requestButton} ${styles.editButton}`}>
                                                        {localeTr.edit}
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.countInfo}>
                                <div className={styles.countItem} onClick={() => setOpenFollowing(true)}>
                                    <strong title="Following">{data.data.following_count}</strong>
                                    <span className={styles.countItemTitle}>{localeTr.following}</span>
                                </div>
                            </h2>
                            <h2 className={styles.bio}>
                                {data.data.bio}
                            </h2>
                        </div>
                        {
                            data.data.is_this_user ? (
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
                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        {
                            data.data.show_pictures.map((file: string, indx: number) => {
                                return (
                                    <ShowPicture file={`${IMAGEURL}/${file}`} position={indx} editProfileImage={editShowImage} key={indx} isThisUser={data.data.is_this_user} />
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
                    first_name={data.data.first_name}
                    last_name={data.data.last_name}
                    bio={data.data.bio}
                    website={data.data.website}
                    dob={data.data.date_of_birth}
                />
                <UserSettings open={openSettings} close={() => setOpenSettings(false)} />
                <Following open={openFollowing} close={() => setOpenFollowing(false)} heading={localeTr.following} />
                <Modal
                    closeTimeoutMS={200}
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

const Following: React.FunctionComponent<{ open: boolean, close: () => void, heading: string }> = ({ open, close, heading }) => {
    const { query: { name } } = useRouter()
    const fetchPosts = ({ pageParam = 0 }) => axios.get(`${BASEURL}/user/following/${name}/${pageParam}`)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(["following", { name }], fetchPosts,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.data.pagination.end) {
                    return undefined
                }
                return lastPage.data.pagination.next
            }
        })
    let following: any[] = []
    if (data?.pages) {
        for (let page of data?.pages) {
            following = following.concat(page.data.following)
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
                <div className={styles.followingContent}>
                    {
                        following.length === 0 && <NotFound type="following" />
                    }
                    {
                        following.map(flw => (
                            <CouplePreview name={flw.couple_name} key={flw.couple_name} profile_picture={`${IMAGEURL}/${flw.profile_picture}`} married={flw.married} isFollowing={flw.is_following} verified={flw.verified} />
                        ))
                    }
                    <Loader hasNext={hasNextPage ? true : false} loadMore={fetchNextPage} isFetching={isFetching} />
                </div>
            </div>
        </Modal>
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
