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
import Modal from "react-modal"
Modal.setAppElement(`.${styles.section}`)

export default function Profile() {
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const cropperRef = useRef<any>(null)
    const avatarImgRef = useRef<HTMLImageElement>(null)
    const newFileRef = useRef<any>("")

    const editProfileImage = (e: React.MouseEvent<HTMLSpanElement>) => {
        setIsOpen(true)
    }

    const onCrop = (e: any) => {
        console.log(e)
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
                                        <MdModeEdit size={30} color="var(--accents-1)" />
                                    </span>
                                </div>
                                <div className={styles.titleContainer}>
                                    <h1 className={styles.userName}>ant.man</h1>
                                    <h2 data-e2e="user-subtitle" className={styles.realName}>Yussif Mohammed</h2>
                                    <div className={styles.requestContainer}>
                                        <div className={styles.requestButtonWrapper}>
                                            <Link href={"/user"}>
                                                <button type="button" className={styles.requestButton}>Send request</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.countInfo}>
                                <div className={styles.countItem}>
                                    <strong title="Following">830</strong>
                                    <span className={styles.countItemTitle}>Following</span>
                                </div>
                            </h2>
                            <h2 className={styles.bio}>
                                {`Acting and comedy
                    🇬🇭
                    Dm on Instagram @fatimazawwa for promo`}
                            </h2>
                        </div>
                        <div className={styles.actions}>

                        </div>
                    </div>
                </div>
                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me2.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me3.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me4.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me5.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me6.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                    </div>
                </div>

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    style={{
                        overlay: {
                            zIndex: 1,
                            backgroundColor: "rgba(0,0,0,0.75)",
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
                                    <p>New post</p>
                                    <div onClick={() => close()}
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

                                        <button>Select image from device
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
                                    <p>Crop</p>
                                    <div
                                        className={styles.nextContainer}
                                    >
                                        <p>Done</p>
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