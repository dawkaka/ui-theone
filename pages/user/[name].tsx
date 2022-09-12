import { useRef, useState, useEffect } from "react";
import { ChangeEvent } from "react";
import Image from "next/image";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Layout from "../../components/mainLayout";
import styles from "../../styles/profile.module.css"
import Link from "next/link";
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
Modal.setAppElement("#__next")

export default function Profile() {
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const cropperRef = useRef<any>(null)
    const avatarImgRef = useRef<HTMLImageElement>(null)
    const newFileRef = useRef<any>("")
    const targetRef = useRef<"avatar" | "show">("avatar")
    const [showImage, setShowImage] = useState(0)
    const [editOpen, setEditOpen] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const editProfileImage = (e: React.MouseEvent<HTMLSpanElement>) => {
        targetRef.current = "avatar"
        setIsOpen(true)
    }

    const onCrop = (e: any) => {

    }

    const onDone = () => {
        newFileRef.current = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
        if (targetRef.current === "avatar") {
            avatarImgRef.current!.src = newFileRef.current
        } else {
            const imgTarget = document.querySelector<HTMLImageElement>("#show-image-" + showImage)
            if (imgTarget) {
                console.log(imgTarget.srcset)
                imgTarget.srcset = newFileRef.current
            }
        }

        setIsOpen(false)
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

    const showImages = ["/med.jpg", "/med2.jpg", "/me.jpg", "/me3.jpg", "/me2.jpg", "/me5.jpg"]

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
                                        src={"/me.jpg"}
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
                                    <h3 className={styles.userName}>@ant.man</h3>
                                    <h2 data-e2e="user-subtitle" className={styles.realName}>Yussif Mohammed</h2>
                                    <div className={styles.requestContainer}>
                                        <div className={styles.requestButtonWrapper}>
                                            {false ? <Link href={"/user"}>
                                                <button type="button" className={styles.requestButton}>{localeTr.sendrequest}</button>
                                            </Link> : <button onClick={() => setEditOpen(true)} className={`${styles.requestButton} ${styles.editButton}`}>
                                                {localeTr.edit}
                                            </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.countInfo}>
                                <div className={styles.countItem}>
                                    <strong title="Following">830</strong>
                                    <span className={styles.countItemTitle}>{localeTr.following}</span>
                                </div>
                            </h2>
                            <h2 className={styles.bio}>
                                {`Acting and comedy
                    🇬🇭
                    Dm on Instagram @fatimazawwa for promo`}
                            </h2>
                        </div>
                        <div className={styles.actions} onClick={() => setOpenSettings(true)}>
                            <Actions orientation="landscape" size={25} />
                        </div>
                    </div>
                </div>
                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        {
                            showImages.map((file, indx) => {
                                return (
                                    <ShowPicture file={file} position={indx} editProfileImage={editShowImage} key={indx} />
                                )
                            })
                        }


                    </div>
                </div>
                <EditUser open={editOpen} close={() => setEditOpen(false)} />
                <UserSettings open={openSettings} close={() => setOpenSettings(false)} />
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
                                        crop={onCrop}
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