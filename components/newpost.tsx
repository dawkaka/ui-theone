import { useState, ChangeEvent, useRef, useEffect } from "react";
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

Modal.setAppElement("body")


const AddPost: React.FunctionComponent<{ open: () => void; isOpen: boolean, close: () => void }> = ({ isOpen, close, open }) => {

    const [step, setStep] = useState(0)
    const [caption, setCaption] = useState("")
    const [aspectRatio, setAspectRatio] = useState(1)
    const [lockAsRatio, setLockAsRatio] = useState(false)
    const [flash, setFlash] = useState(true)
    const [alt, setAlt] = useState<string[]>(new Array(10).fill(""))
    const [carouselCurrent, setCarouselCurrent] = useState(0)
    const [currAlt, setCurrentAlt] = useState(alt[carouselCurrent])

    const files = useRef<File[]>([])
    const blobs = useRef<string[]>([])
    const cropperRef = useRef<any>(null);
    const blob = useRef("")
    const altRef = useRef<HTMLDivElement>(null)
    const altTextRef = useRef<HTMLTextAreaElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]



    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            files.current.push(fs[0])
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                const _URL = window.URL || window.webkitURL
                const blb = _URL.createObjectURL(fs[0]);
                cropperRef.current!.src = blb
                blobs.current.push(blb)
            }
            setStep(1)
        }
    }

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!lockAsRatio) {
            setLockAsRatio(true)
        }
        const fs = e.currentTarget.files
        if (fs) {
            const reader = new FileReader()
            files.current.push(fs[0])
            reader.readAsDataURL(fs[0])
            reader.onload = (e) => {
                const _URL = window.URL || window.webkitURL
                const blb = _URL.createObjectURL(fs[0]);
                cropperRef.current!.src = blb
                blobs.current.push(blb)
            }
        }
        setFlash(false)
        setTimeout(() => {
            setFlash(true)
        });
    }


    const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCaption(e.currentTarget.value)
    }

    const changeAspectRatio = (a: number) => {
        if (aspectRatio === a) return
        setAspectRatio(a)
        setFlash(false)
        setTimeout(() => {
            setFlash(true)
        });

    }


    useEffect(() => {
        const _URL = window.URL || window.webkitURL
        if (step === 1) {
            if (files.current.length > 0) {
                cropperRef.current!.src = _URL.createObjectURL(files.current[files.current.length - 1]);
            }
        }

        if (imgRef.current) {
            imgRef.current.src = blob.current
        }

    }, [step])

    const onCrop = () => {
        const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL() as string
        blob.current = data
        blobs.current[blobs.current.length - 1] = data
    }

    const removeImage = () => {
        if (files.current.length == 1) return
        cropperRef.current!.src = files.current.pop()
        blobs.current.pop()
        if (files.current.length === 1) {
            setLockAsRatio(false)
        }
        setStep(10)
        setTimeout(() => {
            setStep(1)
        });
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
                    <div className={styles.modalBody}>
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
                        <div className={styles.fileContent}>
                            {flash && <Cropper
                                src={cropperRef.current?.src}
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
                                crop={onCrop}
                                ref={cropperRef}
                            />
                            }
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
                                    !lockAsRatio ?
                                        <div className={styles.square}
                                            onClick={() => changeAspectRatio(1)}></div>
                                        :
                                        null
                                }
                                {
                                    !lockAsRatio ?
                                        <div className={styles.landscape}
                                            onClick={() => changeAspectRatio(16 / 9)}></div>
                                        :
                                        null
                                }
                                {
                                    !lockAsRatio ? <div className={styles.portrait}
                                        onClick={() => changeAspectRatio(4 / 5)}></div>
                                        :
                                        null
                                }
                            </div>
                        </div >
                    </div >
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
                            <div className={styles.captionContainer}>
                                <textarea placeholder={localeTr.typecaption + "..."} onChange={handleCaption}
                                    autoFocus value={caption} className={styles.textArea}></textarea>
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
                            <div onClick={() => setStep(4)}
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
                                <Carousel files={blobs.current}
                                    currFunc={(a: number) => setCarouselCurrent(a)} />
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
                            <p>Shiping</p>
                            <div onClick={() => close()}
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