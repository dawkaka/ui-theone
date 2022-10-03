import { useRef, useState, useEffect } from "react";
import { ChangeEvent } from "react";
import Image from "next/image";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Layout from "../../components/mainLayout";
import styles from "../../styles/profile.module.css"
import { MdModeEdit } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { EditUser } from "../../components/editprofile";
import { Actions } from "../../components/mis";
import { UserSettings } from "../../components/settings"
import tr from "../../i18n/locales/profile.json"
import { Langs } from "../../types";
import CouplePreview from "../../components/couplepreview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../../constants";
import { Prompt } from "../../components/prompt";
import { GetServerSideProps } from "next";
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

    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const editProfileImage = (e: React.MouseEvent<HTMLSpanElement>) => {
        targetRef.current = "avatar"
        setIsOpen(true)
    }

    const updatePicMutation = useMutation(
        (data: FormData) => {
            return axios.post(`${BASEURL}/user/profile-pic`, data)
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["profile", { name: router.query.name }])
                avatarImgRef.current!.src = newFileRef.current
                setIsOpen(false)
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )
    const updateShowPicMutation = useMutation(
        (data: FormData) => {
            return axios.post(`${BASEURL}/user/show-pictures/${showImage}`, data)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["profile", { name: router.query.name }])
                setIsOpen(false)
                const imgTarget = document.querySelector<HTMLImageElement>("#show-image-" + showImage)
                if (imgTarget) {
                    imgTarget.srcset = newFileRef.current
                }
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
            formData.append("profile-picture", blob, "profile.jpeg")
            updatePicMutation.mutate(formData)

        } else {
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
                newFileRef.current = e.target?.result
            }
            setTimeout(() => {
                setStep(1)
            }, 200)
        }
    }

    useEffect(() => {
        if (step === 1) {
            cropperRef.current.src = newFileRef.current
        }
    }, [step])

    const editShowImage = (n: number) => {
        setShowImage(n)
        setIsOpen(true)
        targetRef.current = "show"
    }

    const sendRequestMutation = useMutation(
        () => {
            return axios.post(`${BASEURL}/user/couple-request/yousiph`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
                queryClient.invalidateQueries(['pending-request'])
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    const { isLoading, data } = useQuery(["profile", { name: router.query.name }],
        () => axios.get(`${BASEURL}/user/${router.query.name}`),
        { initialData: props.user, staleTime: Infinity })
    if (data.data === null) {
        return (
            <Layout>
                <div>
                    <h2>User not found</h2>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <section className={styles.section}>
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
                                    />
                                    <span
                                        className={styles.avatarContainer}
                                        style={{ width: "116px", height: "116px" }}
                                        onClick={editProfileImage}
                                    >
                                        <MdModeEdit size={30} color="white" />
                                    </span>
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
                            data.data.is_this_user && (
                                <div className={styles.actions} onClick={() => setOpenSettings(true)}>
                                    <Actions orientation="landscape" size={25} />
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        {
                            data.data.show_pictures.map((file: string, indx: number) => {
                                return (
                                    <ShowPicture file={`${IMAGEURL}/${file}`} position={indx} editProfileImage={editShowImage} key={indx} />
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
                    message={"So you are fucking this person right?"}
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
    position: number
}>
    = ({ editProfileImage, position, file }) => {
        const edit = () => {
            editProfileImage(position)
        }
        return (
            <article className={styles.showImageContainer}>
                <div className={styles.showImage}>
                    <Image src={file}
                        height="230px" width="230px" layout="responsive"
                        objectFit="cover" id={`show-image-${position}`} />
                </div>
                <span
                    className={styles.showImageEdit}
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={edit}
                >
                    <MdModeEdit size={20} color="var(--accents-1)" />
                </span>
            </article>
        )
    }

const Following: React.FunctionComponent<{ open: boolean, close: () => void, heading: string }> = ({ open, close, heading }) => {
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
            <div className={styles.modalBody}>
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
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />
                    <CouplePreview name="miss.c.nasty" profile_picture="/med.jpg" status="married" isFollowing={true} verified={true} />

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
    } catch (err) {
        return { props: { user: { data: null } } }
    }
}
