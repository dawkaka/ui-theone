import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Modal from "react-modal";
import styles from "./styles/newpost.module.css";
import { IoMdClose } from "react-icons/io";
import { GoFileMedia } from "react-icons/go";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Carousel, CheckMark, Video } from "./mis";
import tr from "../i18n/locales/components/newpost.json"
import { useRouter } from "next/router";
import { Langs } from "../types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../constants";
import { BsFillPlayBtnFill, BsPlayBtn } from "react-icons/bs";
//import Cropper from "cropperjs";

Modal.setAppElement("body")


const AddPost: React.FunctionComponent<{ open: () => void; isOpen: boolean, close: () => void }> = ({ isOpen, close, open }) => {

    const [step, setStep] = useState(0)
    const [caption, setCaption] = useState("")
    const [aspectRatio, setAspectRatio] = useState(1)
    const [lockAsRatio, setLockAsRatio] = useState(false)
    const [image, setImage] = useState<{ data: string }>({ data: "" })
    const [alt, setAlt] = useState<string[]>(new Array(10).fill(""))
    const [carouselCurrent, setCarouselCurrent] = useState(0)
    const [currAlt, setCurrentAlt] = useState(alt[carouselCurrent])
    const [location, setLocation] = useState("")
    const [cropper, setCropper] = useState<Cropper>()
    const [vid, setVid] = useState<string>("")


    const files = useRef<string[]>([])
    const blobs = useRef<string[]>([])
    //index of file to crop
    const ind = useRef<number>(0)
    const cropperRef = useRef<any>(null)
    const altRef = useRef<HTMLDivElement>(null)
    const altTextRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]


    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        setVid("")
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = () => {
                files.current.push(reader.result as string)
                setImage({ data: reader.result as string });
                blobs.current.push(reader.result as string)
                e.target.value = ""
            }
            setStep(1)
        }
    }

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!lockAsRatio) {
            setLockAsRatio(true)
        }
        if (files.current.length > 9) {
            alert("Images cant' be more than 10")
            return
        }
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = () => {
                files.current.push(reader.result as any)
                blobs.current.push(reader.result as any)
                ind.current = blobs.current.length - 1
                setImage({ data: reader.result as any })
                e.target.value = ""
            }
        }
    }


    const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCaption(e.currentTarget.value)
    }
    const handleLocation = (e: ChangeEvent<HTMLInputElement>) => {
        setLocation(e.currentTarget.value)
    }

    const changeAspectRatio = (a: number) => {
        setAspectRatio(a)
        cropper?.setAspectRatio(a)
    }


    useEffect(() => {
        if (files.current.length > 0) {
            setImage({ data: files.current[ind.current] })
        }

    }, [])
    const onCrop = () => {
        const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL("image/jpeg") as string
        blobs.current[ind.current] = data
    }

    const removeImage = (index: number) => {
        if (files.current.length == 1 || index > files.current.length - 1 || index < 0) return
        if (ind.current === index) {
            if (index + 1 < files.current.length) {
                setImage({ data: files.current[index + 1] })
            } else {
                ind.current = ind.current - 1
                setImage({ data: files.current[ind.current] })
            }
        } else {
            setImage({ data: image.data })
            if (index < ind.current) {
                ind.current = ind.current - 1
            }
        }
        files.current.splice(index, 1)
        blobs.current.splice(index, 1)
        const updALT = alt
        updALT.splice(index, 1)
        updALT.push("")
        setAlt(updALT)
        if (files.current.length === 1) {
            setLockAsRatio(false)
        }
    }

    const handleAltText = () => {
        const al = altTextRef.current!.value
        let newArr = alt
        newArr[carouselCurrent] = al
        setAlt(newArr)
        altRef.current!.style.display = "none"
    }

    const altChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let newArr = alt
        setCurrentAlt(e.currentTarget.value)
        newArr[carouselCurrent] = e.currentTarget.value
        setAlt(newArr)
    }

    useEffect(() => {
        setCurrentAlt(alt[carouselCurrent])
    }, [carouselCurrent, alt])

    const sharePostMutation = useMutation(
        (data: FormData) => {
            console.log(data.get("alts"))
            return axios.post(`${BASEURL}/post`, data)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
            }
        })


    const sharePost = async () => {
        const formData = new FormData()
        formData.append("caption", caption)
        formData.append("couple_name", "yousiph")

        if (vid === "") {
            for (let file of blobs.current) {
                const blob = await (await fetch(file)).blob();
                formData.append("files", blob, "image.jpg")
            }
        } else {
            const blob = await (await fetch(vid!)).blob();
            formData.append("files", blob, "video.mp4")
        }
        formData.append("alts", JSON.stringify(alt))
        formData.append("location", location)
        sharePostMutation.mutate(formData)
        setStep(4)
    }

    const closeModal = () => {
        close()
        setStep(0)
        setCaption("")
        setAspectRatio(1)
        setLockAsRatio(false)
        setAlt(new Array(10).fill(""))
        setCarouselCurrent(0)
        setImage({ data: "" })
        files.current = []
        blobs.current = []
        setVid("")
    }
    const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = () => {
                setVid(reader.result as any)
                e.target.value = ""
            }
            setStep(1.5)
        }
    }
    return (
        <Modal
            closeTimeoutMS={200}
            isOpen={isOpen}
            onRequestClose={() => close()}
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
                    backgroundColor: "var(--background)",
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
                            <p>{localeTr.newpost}</p>
                            <div onClick={closeModal}
                                className={styles.closeContainer}
                            >
                                <IoMdClose color="tranparent" size={25} />
                            </div>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.fileIcons}>
                                <GoFileMedia size={100} className={styles.fileIcon2} />
                                <BsPlayBtn size={100} className={styles.fileIcon1} />

                            </div>
                            <div className={styles.selectFile}>

                                <button>{localeTr.selectimage}
                                    <input
                                        type="file" onChange={newFile}
                                        accept="image/jpeg, image/png"
                                    />
                                </button>

                                <button>{localeTr.selectvideo}
                                    <input
                                        type="file" onChange={handleVideo}
                                        accept="video/mp4"
                                    />
                                </button>
                            </div>
                        </div>

                    </div>
                )
            }
            {
                step === 1 && (
                    <div className={styles.modalBody} style={{ justifyContent: "flex-start" }}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(0)}>
                                <BiArrowBack size={20} color="var(--accents-6)" />
                            </div>
                            <p>{localeTr.crop}</p>
                            <div onClick={() => {
                                setStep(2)
                            }}
                                className={styles.nextContainer}
                            >
                                <p>{localeTr.next}</p>
                            </div>
                        </div>
                        <div className={styles.fileContent} style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
                            <Cropper
                                src={image.data}
                                dragMode="move"
                                style={{ height: "50vh", width: "90%" }}
                                // Cropper.js options
                                viewMode={2}
                                aspectRatio={aspectRatio}
                                background={false}
                                modal={true}
                                movable={false}
                                minCropBoxHeight={22222}
                                minCropBoxWidth={22222}
                                checkOrientation={false}
                                responsive={true}
                                zoomOnTouch={false}
                                zoomOnWheel={false}
                                guides={false}
                                highlight={false}
                                zoomTo={0}
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                crop={onCrop}
                                ref={cropperRef}
                            />
                            <div style={{ display: "flex", overflowX: "scroll", width: "100%", height: "max-content", alignSelf: "flex-start" }}>
                                {
                                    files.current.map((file, index) => {
                                        return (
                                            <>
                                                <ImagePreview file={file} key={index} remove={() => removeImage(index)} activate={async () => {
                                                    setImage({ data: file });
                                                    ind.current = index

                                                }} />

                                            </>
                                        )
                                    })
                                }
                                <div className={styles.addImage} style={{ height: "70px", width: "70px", backgroundColor: "var(--accents-2)", flexShrink: 0 }} >
                                    <AiOutlinePlus size={45} color="white" />
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        title="add image"
                                        style={{ height: "100%", width: "100%" }}
                                        onChange={addImage}
                                    />
                                </div>
                            </div>
                            <div className={styles.aspectRatios}>

                                {
                                    !lockAsRatio && (
                                        <>
                                            <div className={styles.square}
                                                onClick={() => changeAspectRatio(1)}></div>
                                            <div className={styles.landscape}
                                                onClick={() => changeAspectRatio(16 / 9)}></div>
                                            <div className={styles.portrait}
                                                onClick={() => changeAspectRatio(4 / 5)}></div>
                                        </>
                                    )
                                }
                                <input
                                    type={"range"} min={0} max={1} step={0.0001}
                                    defaultValue={0} style={{ accentColor: "var(--success)" }}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value)
                                        cropper?.zoomTo(val.toFixed(4) as any)
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                )
            }
            {
                step === 1.5 && (
                    <div className={styles.modalBody} style={{ justifyContent: "flex-start" }}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(0)}>
                                <BiArrowBack size={20} color="var(--accents-6)" />
                            </div>
                            <p>{localeTr.crop}</p>
                            <div onClick={() => {
                                setStep(2)
                            }}
                                className={styles.nextContainer}
                            >
                                <p>{localeTr.next}</p>
                            </div>
                        </div>
                        <div className={`${styles.modalContent}`} style={{ borderBottom: "10px solid var(--background)" }}>
                            <video src={vid} controls
                                style={{ objectFit: "contain", backgroundColor: "black", width: "100%", height: "min(70vh, 500px)" }}
                            ></video>
                        </div>
                    </div>
                )
            }
            {
                step === 2 && (
                    <div className={styles.modalBody}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => vid === "" ? setStep(1) : setStep(1.5)}>
                                <BiArrowBack size={20} color="var(--accents-6)" />
                            </div>
                            <p>{localeTr.caption}</p>
                            <div onClick={() => setStep(3)}
                                className={styles.nextContainer}
                            >
                                <p>{localeTr.next}</p>
                            </div>
                        </div>
                        <div className={`${styles.modalContent} ${styles.captionStage}`}>
                            <div className={styles.editItem}>
                                <label htmlFor="caption">{localeTr.caption}</label>
                                <textarea placeholder={localeTr.typecaption + "..."} onChange={handleCaption}
                                    autoFocus value={caption} className={styles.textArea}></textarea>
                            </div>
                            <div className={styles.editItem}>
                                <label htmlFor="location">{localeTr.location.title}</label>
                                <input
                                    type="text"
                                    placeholder={localeTr.location.placeholder}
                                    id="location"
                                    value={location}
                                    onChange={handleLocation}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                step === 3 && (
                    <div className={styles.preBody}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(2)}>
                                <BiArrowBack size={20} color="var(--accents-6)" />
                            </div>
                            <p>{localeTr.preview}</p>
                            <div onClick={sharePost}
                                className={styles.nextContainer}
                            >
                                <p>{localeTr.share}</p>
                            </div>
                        </div>

                        <div className={styles.previewContent}>
                            <div className={styles.pfileContainer}>
                                {
                                    vid === "" && (
                                        <>
                                            <div className={styles.altButton} onClick={() => {
                                                const vis = altRef.current!.style.display
                                                if (vis === "none") {
                                                    altRef.current!.style.display = "block"
                                                } else {
                                                    altRef.current!.style.display = "none"
                                                }
                                            }}>
                                                <button>{localeTr.alttext}</button>
                                            </div>
                                            <div className={styles.altTextContainer} ref={altRef} >

                                                <textarea
                                                    className={`${styles.textAreaAlt} ${styles.altTextArea}`}
                                                    placeholder={localeTr.typealttext + "..."}
                                                    onChange={altChanged}
                                                    ref={altTextRef}
                                                    value={currAlt}
                                                ></textarea>
                                                <button onClick={handleAltText}>{localeTr.done}</button>
                                            </div>
                                        </>

                                    )
                                }
                                {
                                    vid === "" ?
                                        <Carousel files={blobs.current} currFunc={(a: number) => setCarouselCurrent(a)} />
                                        :
                                        <Video file={vid} />
                                }

                            </div>
                            <div className={styles.previewCaption}>
                                <p>{caption}</p>
                            </div>

                        </div>
                    </div>
                )
            }
            {
                step === 4 && (
                    <div className={styles.modalBody}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(2)}>

                            </div>
                            <p>{sharePostMutation.isLoading ? "Shipping..." : "Shipped"}</p>
                            <div onClick={closeModal}
                                className={styles.nextContainer}
                            >
                                <IoMdClose size={20} color="var(--accents-6)" />
                            </div>
                        </div>

                        <div className={styles.modalContent}>

                            <CheckMark size={200} />
                        </div>
                    </div>
                )
            }
        </Modal >

    )
}


const ImagePreview: React.FC<{ file: string, remove: () => void, activate: () => void }> = ({ file, remove, activate }) => {
    return (
        <div style={{ position: "relative" }}>
            <div
                onClick={remove}
                style={{
                    position: "absolute",
                    borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.7)",
                    padding: "5px", right: "0",
                    display: "grid", placeItems: "cneter",
                    cursor: "pointer",
                }}>
                <IoMdClose size={20} color="white" />
            </div>

            <img src={file} width="70px" height={"70px"} style={{ flexShrink: 1 }} onClick={activate} />
        </div>

    )
}

export default AddPost