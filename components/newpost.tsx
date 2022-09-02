import { useState, ChangeEvent, useRef, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import Modal from "react-modal";
import styles from "./styles/newpost.module.css";
import { IoMdClose } from "react-icons/io";
import { GoFileMedia } from "react-icons/go";
import { BiArrowBack } from "react-icons/bi";

Modal.setAppElement("body")


const AddPost: React.FunctionComponent<{ isOpen: boolean, close: () => void }> = ({ isOpen, close }) => {


    const [step, setStep] = useState(0)
    const [caption, setCaption] = useState("")

    const newFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files) {
            const reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.onload = (e) => {
                const _URL = window.URL || window.webkitURL
                cropperRef.current!.src = _URL.createObjectURL(files[0]);
            }
            setStep(1)
        }
    }

    const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let cp = e.currentTarget.value.split(" ")
        cp = cp.map(word => {
            if (word[0] === "@") {
                word = `<span class="user-tag">${word}</span>`
            }
            return word
        })
        setCaption(cp.join(" "))
    }

    useEffect(() => {
        if (step == 1) {

        }

    }, [step])


    const cropperRef = useRef<HTMLImageElement>(null);
    const onCrop = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
    };

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
                step == 0 && (
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
                                    <input type="file" onChange={newFile} />
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
                                aspectRatio={16 / 9}
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
            {
                step == 2 && (
                    <div className={styles.modalBody}>
                        <div className={styles.requestHeader}>
                            <div className={styles.backIcon} onClick={() => setStep(1)}>
                                <BiArrowBack size={20} color="var(--accents-6)" />
                            </div>
                            <p>Caption</p>
                            <div onClick={() => setStep(3)}
                                className={styles.nextContainer}
                            >
                                <p>Post</p>
                            </div>
                        </div>
                        <div className={`${styles.modalContent} ${styles.captionStage}`}>
                            <div className={styles.captionContainer}>
                                <textarea placeholder="caption" onChange={handleCaption}
                                    autoFocus></textarea>
                                <div dangerouslySetInnerHTML={{ __html: caption }}></div>
                            </div>
                        </div>

                    </div>
                )
            }

        </Modal>

    )
}

export default AddPost