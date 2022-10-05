import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Modal from "react-modal";
import styles from "./styles/newpost.module.css";
import { IoMdClose } from "react-icons/io";
import { GoFileMedia } from "react-icons/go";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Carousel, CheckMark } from "./mis";
import tr from "../i18n/locales/components/newpost.json"
import { useRouter } from "next/router";
import { Langs } from "../types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../constants";
//import Cropper from "cropperjs";

Modal.setAppElement("body")


const AddPost: React.FunctionComponent<{ open: () => void; isOpen: boolean, close: () => void }> = ({ isOpen, close, open }) => {

    const [step, setStep] = useState(0)
    const [caption, setCaption] = useState("")
    const [aspectRatio, setAspectRatio] = useState(1)
    const [lockAsRatio, setLockAsRatio] = useState(false)
    const [image, setImage] = useState<string>()
    const [alt, setAlt] = useState<string[]>(new Array(10).fill(""))
    const [carouselCurrent, setCarouselCurrent] = useState(0)
    const [currAlt, setCurrentAlt] = useState(alt[carouselCurrent])
    const [location, setLocation] = useState("")
    const [cropper, setCropper] = useState<Cropper>()

    const files = useRef<string[]>([])
    const blobs = useRef<string[]>([])
    const cropperRef = useRef<any>(null);
    const altRef = useRef<HTMLDivElement>(null)
    const altTextRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]

    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                files.current.push(reader.result as any)
                setImage(reader.result as any);
                blobs.current.push(reader.result as any)
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
            reader.onload = (e) => {
                files.current.push(reader.result as any)
                blobs.current.push(reader.result as any)
                setImage(reader.result as any);
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
        cropper?.setAspectRatio(a)
    }


    useEffect(() => {
        if (files.current.length > 0) {
            const _URL = window.URL || window.webkitURL
            setImage(files.current[files.current.length - 1] as any)
        }

    })

    const onCrop = () => {
        const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL("image/jpeg") as string

        blobs.current[blobs.current.length - 1] = data
    }

    const removeImage = () => {
        if (files.current.length == 1) return
        setImage(files.current.pop() as any)
        blobs.current.pop()
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
        for (let file of blobs.current) {
            const blob = await (await fetch(file)).blob();
            formData.append("files", blob, "image.jpg")
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
        setImage("")
        files.current = []
        blobs.current = []
    }

    return (
        <Modal
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
                                <GoFileMedia size={100} className={styles.fileIcon1} />
                                <GoFileMedia size={100} className={styles.fileIcon2} />
                            </div>
                            <div className={styles.selectFile}>

                                <button>{localeTr.selectfile}
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
                        <div className={styles.fileContent} style={{ justifyContent: "flex-start" }}>
                            <Cropper
                                src={image}
                                dragMode="move"
                                style={{ height: "500px" }}
                                // Cropper.js options
                                viewMode={2}
                                aspectRatio={aspectRatio}
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
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                crop={onCrop}
                                ref={cropperRef}
                            />
                            <div className={styles.aspectRatios}>
                                <div className={styles.addImage}>
                                    <AiOutlinePlus />
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        title="add image"
                                        onChange={addImage}
                                    />
                                </div>
                                <div onClick={removeImage}>
                                    <AiOutlineMinus color="var(--background)" />
                                </div>
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
                            </div>
                            <div style={{ display: "flex", overflowX: "scroll", marginTop: "var(--gap-half)" }}>
                                {
                                    files.current.map(file => {
                                        return (
                                            <img src={file} width="90px" style={{ flexShrink: 1 }} />
                                        )
                                    })
                                }
                            </div>

                        </div>
                    </div>
                )
            }
            {
                step === 2 && (
                    <div className={styles.modalBody}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(1)}>
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
                                <Carousel files={blobs.current} currFunc={(a: number) => setCarouselCurrent(a)} />
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

export default AddPost