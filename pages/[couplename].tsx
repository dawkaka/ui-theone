import { ChangeEvent, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { NextPage } from "next";
import Layout from "../components/mainLayout";
import Suggestions from "../components/suggestions";
import Header from "../components/pageHeader";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import styles from "../styles/couple.module.css"
import { Actions, SearchUser, Verified } from "../components/mis";
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
import { Langs } from "../types";
import CouplePreview from "../components/couplepreview";

Modal.setAppElement("#__next")

const CoupleProfile: NextPage = () => {
    const [step, setStep] = useState(0)
    const [editOpen, setEditOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [openReportModal, setOpenReportModal] = useState(false)
    const [openFollowers, setOpenFollowers] = useState(false)


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

    const onDone = () => {
        newFileRef.current = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
        if (targetRef.current === "avatar") {
            document.querySelector<HTMLImageElement>("#avatar")!.srcset = newFileRef.current
        } else {
            document.querySelector<HTMLImageElement>("#cover")!.srcset = newFileRef.current
        }
        setIsOpen(false)
    }

    useEffect(() => {
        if (step === 1) {
            cropperRef.current.src = newFileRef.current
        }
    }, [step])

    return (
        <>
            <Layout>
                <div className={styles.mainContainer}>
                    <div className={styles.profileContainer}>
                        <Header title="john.and.jane" arrow />
                        <section className={styles.profileInfo}>
                            <div className={styles.coverPicContainer}>
                                <div className={styles.cover} >
                                    <Image src="/me7.jpg" height={"300px"} width={"900px"} objectFit="cover" id="cover" />
                                </div>
                                <span
                                    className={styles.editCover}
                                    style={{ position: "absolute", top: 0, right: 0 }}
                                    onClick={editCover}
                                >
                                    <MdModeEdit size={30} color="white" />
                                </span>
                            </div>
                            <div className={styles.profile}>
                                <div className={styles.flex}>
                                    <div className={styles.imageContainer}>

                                        <img
                                            height={"120px"}
                                            width={"120px"}
                                            src={"/med.jpg"}
                                            className={styles.profileImage}
                                            id="avatar"
                                        />
                                        <span
                                            className={styles.avatarContainer}
                                            style={{ width: "100%", height: "100%" }}
                                            onClick={editAvatar}
                                        >
                                            <MdModeEdit size={30} color="white" style={{ top: "50%", left: "50%" }} />
                                        </span>
                                    </div>
                                    <div className={styles.profileActBtnContainer}>
                                        <div style={{ position: "relative" }}>
                                            <div onClick={() => setOpenSettings(true)}>
                                                <Actions size={25} orientation="landscape" />
                                            </div>
                                            <ul className={styles.userActions}>
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
                                        </div>
                                        {false ? <button>{localeTr.follow}</button> :
                                            <button className={styles.editButton} onClick={() => setEditOpen(true)}>{localeTr.edit}</button>}
                                    </div>
                                </div>
                                <div style={{ marginTop: "var(--gap-half)", color: "var(--accents-7)" }}>
                                    <p className={styles.userName}>john.and.jane <Verified size={15} /></p>
                                    <p className={styles.bio}>{`
                                       this is my bio and I am telling you it's the best thing to happen
                                        to anyone bro and
                                        git like wire my gee`}
                                    </p>
                                    <div style={{ display: "flex", gap: "var(--gap)", alignItems: "center" }}>
                                        <h2 className={styles.countInfo}>
                                            <div className={styles.countItem} onClick={() => setOpenFollowers(true)}>
                                                <strong title="Following">830</strong>
                                                <span className={styles.countItemTitle}>{localeTr.followers}</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={`${styles.countItem} ${styles.dateStarted}`}>
                                                <p title="Date relationship started">{new Date().toDateString().substring(3)}</p>
                                                <span className={styles.countItemTitle}>{localeTr.started}</span>
                                            </div>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.postsContainer}>
                                <Post verified />
                                <Post verified />
                                <Post verified />
                                <Post verified />
                                <Post verified />
                            </div>

                        </section>
                    </div>
                    <div>
                        <Suggestions />
                    </div>

                    <EditCouple open={editOpen} close={() => setEditOpen(false)} />
                    <CoupleSettings open={openSettings} close={() => setOpenSettings(false)} />
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
                <div className={styles.followersContent}>
                    <div>
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif MohammedYUssifMohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                        <SearchUser userName="youisph.is.here" picture="/med.jpg" hasPartner fullName="Yussif Mohammed" />
                    </div>
                </div>


            </div>

        </Modal>
    )

}

export default CoupleProfile