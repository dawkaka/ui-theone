import { useState, ChangeEvent, useRef, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Modal from "react-modal";
import styles from "./styles/newpost.module.css";
import { IoMdClose } from "react-icons/io";
import { GoFileMedia } from "react-icons/go";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CheckMark } from "./mis";

Modal.setAppElement("body")


const AddPost: React.FunctionComponent<{ open: () => void; isOpen: boolean, close: () => void }> = ({ isOpen, close, open }) => {


    const [step, setStep] = useState(0)
    const [caption, setCaption] = useState("")
    const [aspectRatio, setAspectRatio] = useState(1)
    const [lockAsRatio, setLockAsRatio] = useState(false)

    const files = useRef<File[]>([])
    const blobs = useRef<string[]>([])
    const blob = useRef("")
    const altRef = useRef<HTMLTextAreaElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)



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
        setStep(10)
        setTimeout(() => {
            setStep(1)
        });
        console.log(blobs.current)
    }


    const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCaption(e.currentTarget.value)
    }

    const changeAspectRatio = (a: number) => {
        if (aspectRatio === a) return
        setAspectRatio(a)
        setStep(10)
        setTimeout(() => {
            setStep(1)
        });

    }


    const handleAltText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (e.currentTarget.value.length > 100) {
            return
        }
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


    const cropperRef = useRef<any>(null);

    const onCrop = () => {
        const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL() as string
        blob.current = data
        blobs.current[blobs.current.length - 1] = data
        console.log(blobs.current)
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => close()}
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

                                <button>Select files from device
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
                            <p>Edit</p>
                            <div onClick={() => {
                                setStep(2)
                            }}
                                className={styles.nextContainer}
                            >
                                <p>Next</p>
                            </div>
                        </div>
                        <div className={styles.fileContent}>
                            <Cropper
                                src={cropperRef.current?.src}
                                dragMode="move"
                                style={{ height: "500px" }}
                                // Cropper.js options
                                viewMode={2}
                                aspectRatio={aspectRatio}
                                background={false}
                                modal={false}
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
                                <div>
                                    <AiOutlineMinus color="white" />
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
                            <p>Caption</p>
                            <div onClick={() => setStep(3)}
                                className={styles.nextContainer}
                            >
                                <p>Preview</p>
                            </div>
                        </div>
                        <div className={`${styles.modalContent} ${styles.captionStage}`}>
                            <div className={styles.captionContainer}>
                                <textarea placeholder="Type caption..." onChange={handleCaption}
                                    autoFocus value={caption} className={styles.textArea}></textarea>
                            </div>
                            <div className={styles.altTextContainer} >
                                <div onClick={() => {
                                    const vis = altRef.current!.style.display
                                    if (vis === "none") {
                                        altRef.current!.style.display = "block"
                                    } else {
                                        altRef.current!.style.display = "none"
                                    }
                                }}>
                                    <h4>Alt Text</h4>

                                </div>
                                <textarea
                                    className={`${styles.textArea} ${styles.altTextArea}`}
                                    placeholder="Type alt text" onChange={handleAltText}
                                    ref={altRef}
                                ></textarea>
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
                            <p>Preview</p>
                            <div onClick={() => setStep(4)}
                                className={styles.nextContainer}
                            >
                                <p>Ship</p>
                            </div>
                        </div>

                        <div className={styles.previewContent}>
                            <div className={styles.pfileContainer}>
                                {
                                    blobs.current.map((bl, indx) => (<img src={bl} key={indx} />))
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