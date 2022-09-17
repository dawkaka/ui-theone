import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { MdBlock, MdModeEdit, MdOutlineContentCopy, MdOutlineNavigateNext, MdReport } from "react-icons/md";
import styles from "./styles/post.module.css";
import { Actions, Verified } from "./mis";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiUserUnfollowLine } from "react-icons/ri";
import Modal from 'react-modal';
import Comment from "./comment";
import { useRouter } from "next/router";
import { Langs } from "../types";
import tr from "../i18n/locales/components/post.json";
import { BiCommentX } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";


interface post {
    userName: string;
    caption: string;
    files: { name: string, type: string }[];
    likes_count: number;
    comments_count: number;
    verified: boolean
}

const modalStyles: Modal.Styles = {
    overlay: {
        zIndex: 1,
        backgroundColor: "var(--modal-overlay)",
        padding: 0,
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
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        left: 0,
        border: "none",
    }
}

export const Post: React.FunctionComponent<post> = (props) => {

    const files = [
        {
            name: "/med.jpg",
            width: "1080px",
            height: "1080px"
        },
        {
            name: "/med.jpg",
            width: "1080px",
            height: "1080px"
        },
        {
            name: "/med.jpg",
            width: "1080px",
            height: "1080px"
        }
    ]

    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const [modalOpen, setModalOpen] = useState(false)
    const [step, setStep] = useState<"actions" | "edit" | "report">("actions")

    useEffect(() => {
        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    }, [])


    const closeModal = useCallback(() => {
        setStep("actions")
        setModalOpen(false)
    }, [])


    const scroll = (dir: string) => {
        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        const widthNum = Math.floor(Number(width))
        let dist
        if (dir === "right") {
            dist = scrollPos + widthNum
        } else {
            dist = scrollPos - widthNum
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });
        setCurr(dist / widthNum)
    }

    const num = new Intl.NumberFormat(locale, { notation: "compact" }).format(1400)
    const comments = num, likes = num

    return (
        <article className={styles.container}>
            <div>
                <div className={styles.userInfoContainer}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                            <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={"/me.jpg"}
                                    className={styles.profileImage}
                                />
                            </span>
                        </div>
                        <div>
                            <h4>John.Doe{" "} {props.verified && <Verified size={13} />}</h4>
                            <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>Zambiza, Tanzania</p>
                        </div>
                    </div>
                    <div onClick={() => setModalOpen(true)}>
                        <Actions size={20} orientation="potrait" />
                    </div>
                </div>
                <div>
                    <div className={styles.filesContainer}>
                        <div className={styles.fileSlider} ref={slider}>
                            {
                                files.map(file => (<div className={styles.fileContainer} key={file.name}>
                                    <img
                                        src={file.name}
                                        className={styles.postImage}
                                        loading="lazy"
                                    />
                                </div>))
                            }
                        </div>
                        {curr !== 0 && <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                        {curr < files.length - 1 && <div role="button" className={styles.next} onClick={() => scroll("right")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        }
                    </div>
                    <div className={styles.postStats}>
                        <div className={styles.postIcons}>
                            <div className={styles.postIcon}>
                                <AiOutlineHeart size={30} />
                                <p>{likes}</p>
                            </div>
                            <div className={styles.postIcon}>
                                <AiOutlineComment size={30} />
                                <p>{comments}</p>
                            </div>
                        </div>
                        <div className={styles.sliderPos}>
                            <small>{files.length - curr - 1 > 0 ? `+${files.length - 1 - curr} ${localeTr.more}` : ""}</small>
                        </div>
                    </div>
                    <div className={styles.captionContainer}>
                        <Link
                            shallow
                            href={{ pathname: "/[couplename]/[something]" }}
                            as={`/whatever/${encodeURIComponent("something")}`}
                        >
                            <a>
                                <p>
                                    Mr. Frimpong
                                </p>
                            </a>
                        </Link>
                    </div>
                </div>
                <form className={styles.commentContainer} onSubmit={(e) => e.preventDefault()}>
                    <BsEmojiSmile />
                    <textarea aria-label={localeTr.addcomment} placeholder={localeTr.addcomment + "..."}
                        autoComplete="off" autoCorrect="off" onKeyUp={(e) => {
                            e.currentTarget.style.height = "1px";
                            e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px";
                        }}></textarea>
                    <div>
                        <button>{localeTr.post}</button>
                    </div>

                </form>
            </div>
            <Modal
                isOpen={modalOpen}
                style={modalStyles}
                onRequestClose={closeModal} >
                {
                    step === "actions" && (
                        <ul className={styles.modalBody}>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`}><AiOutlineDelete size={25} /><span>{localeTr.delete}</span></li>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><MdReport size={25} /><span>{localeTr.report}</span></li>
                            <li className={styles.actionItem} onClick={() => setStep("edit")}><MdModeEdit size={25} /><span>{localeTr.edit}</span></li>
                            <li className={styles.actionItem}><BiCommentX size={25} /><span>{localeTr.closecomments}</span></li>
                            <li className={styles.actionItem}><RiUserUnfollowLine size={25} /><span>{localeTr.unfollow}</span></li>
                            <li className={styles.actionItem}><MdOutlineContentCopy size={25} /><span>{localeTr.copyurl}</span> </li>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`}><MdBlock size={25} /><span>{localeTr.block}</span></li>
                        </ul>
                    )
                }
                {
                    step === "edit" && (
                        <div className={`${styles.modalBody} ${styles.editModal}`}>
                            <div className={styles.editHeader}>
                                <div className={styles.backIcon} onClick={closeModal}>
                                    <IoMdClose size={20} color="var(--accents-6)" />
                                </div>
                                <p>{localeTr.edit}</p>
                                <button onClick={() => console.log("done")}
                                    className={styles.saveButton}
                                >
                                    {localeTr.save}
                                </button>
                            </div>
                            <div className={`${styles.modalContent} ${styles.captionStage}`}>
                                <div className={styles.editItem}>
                                    <label htmlFor="caption">{localeTr.caption.title}</label>
                                    <textarea
                                        placeholder={localeTr.caption.placeholder}
                                        autoFocus
                                        className={styles.textArea}
                                        id="caption"
                                    ></textarea>
                                </div>
                                <div className={styles.editItem}>
                                    <label htmlFor="location">{localeTr.location.title}</label>
                                    <input
                                        type="text"
                                        placeholder={localeTr.location.placeholder}
                                        id="location"
                                    />
                                </div>
                            </div>

                        </div>
                    )
                }
                {
                    step === "report" && (
                        <div className={`${styles.modalBody} ${styles.editModal}`}>
                            <div className={styles.editHeader}>
                                <div className={styles.backIcon} onClick={closeModal}>
                                    <IoMdClose size={20} color="var(--accents-6)" />
                                </div>
                                <p>{localeTr.reportpost}</p>
                                <button onClick={() => console.log("done")}
                                    className={styles.saveButton}
                                >
                                    {localeTr.send}
                                </button>
                            </div>
                            <ul className={`${styles.modalContent} ${styles.report}`}>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" id="adult" value={"adult content"}
                                        className={styles.reportInput} />
                                    <label htmlFor="adult">{localeTr.reports["1"]}</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="harassment"
                                        className={styles.reportInput} />
                                    <label htmlFor="harassment">{localeTr.reports["2"]}</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="violence"
                                        className={styles.reportInput} />
                                    <label htmlFor="violence">{localeTr.reports["3"]}</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="fake"
                                        className={styles.reportInput} />
                                    <label htmlFor="fake">{localeTr.reports["4"]}</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="intellectual"
                                        className={styles.reportInput} />
                                    <label htmlFor="intellectual">{localeTr.reports["5"]}</label>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </Modal>
        </article>
    )
}


export function PostFullView({ couplename, postId }: { couplename: string | string[] | undefined; postId: string | string[] | undefined }) {

    const files = [{
        name: "/me7.jpg",
        width: "1080px",
        height: "608px"
    },
    {
        name: "/me.jpg",
        width: "1080px",
        height: "1350px"
    },
    {
        name: "/me2.jpg",
        width: "1080px",
        height: "1080px"
    },
    {
        name: "/me3.jpg",
        width: "1080px",
        height: "1350px"
    }
    ]
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const [modalOpen, setModalOpen] = useState(false)
    const [step, setStep] = useState<"actions" | "edit" | "report">("actions")

    useEffect(() => {
        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    }, [])

    const closeModal = useCallback(() => {
        setStep("actions")
        setModalOpen(false)
    }, [])

    const scroll = (dir: string) => {
        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        const widthNum = Math.floor(Number(width))
        let dist
        if (dir === "right") {
            dist = scrollPos + widthNum
        } else {
            dist = scrollPos - widthNum
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });
        setCurr(dist / widthNum)
    }
    return (
        <div className={styles.viewContent}>

            <div className={styles.viewFiles}>
                <div className={styles.filesContainer}>
                    <div className={styles.fileSlider} ref={slider} style={{ backgroundColor: "transparent" }}>
                        {
                            files.map(file => (<div className={styles.fileContainer} key={file.name}>
                                <Image
                                    src={file.name}
                                    objectFit="cover"
                                    width={file.width}
                                    height={file.height}
                                />
                            </div>))
                        }
                    </div>
                    {curr !== 0 && <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                        <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                    </div>
                    }
                    {curr < files.length - 1 && <div role="button" className={styles.next} onClick={() => scroll("right")}>
                        <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                    </div>
                    }
                </div>
                <div className={styles.viewSliderPos}>
                    <small>{files.length - curr - 1 > 0 ? `+${files.length - 1 - curr} ${localeTr.more}` : ""}</small>
                </div>
            </div>

            <div className={styles.viewComments}>
                <div className={styles.userInfoContainer}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.imageContainer} style={{ width: "40px", height: "40px" }}>
                            <span className={styles.avatarContainer} style={{ width: "40px", height: "40px" }}>
                                <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={"/me.jpg"}
                                    className={styles.profileImage}
                                />
                            </span>
                        </div>
                        <div>
                            <h4>John.Doe{" "}<Verified size={13} /></h4>
                            <p style={{ fontSize: "13px", color: "var(--accents-5)" }}>Zambiza, Tanzania</p>
                        </div>
                    </div>
                    <div onClick={() => setModalOpen(true)}>
                        <Actions size={24} orientation="potrait" />
                    </div>
                </div>
                <div className={styles.captionContainer} style={{
                    paddingTop: 0,
                    borderBottom: "var(--border)"

                }}>
                    <p>
                        something caption that is very long and I do not want to know why it is like
                        tha from ghana we are the best couple in the world
                        I know so and I feel so.
                    </p>
                </div>
                <div className={styles.commentsContainer}>
                    {
                        new Array(15).fill(1).map((val, ind) => {
                            return (
                                <Comment
                                    key={ind}
                                    userName="cristiano"
                                    profile_url="/me3.jpg"
                                    hasPartner
                                    hasLiked
                                    isThisUser
                                    comment={`we are dad bfor abeo before you come here talking the bewt other here and
                                     no dkiiings`}
                                    date={new Date}
                                    likes_count={3232}
                                />
                            )
                        })
                    }

                </div>
                <div className={styles.viewFixedBottom}>
                    <div className={styles.postStats} style={{ borderTop: "var(--border)", paddingBottom: "var(--gap-half)" }}>
                        <div className={styles.postIcons}>
                            <div className={styles.postIcon}>
                                <AiOutlineHeart size={30} />
                                <p>100000</p>
                            </div>
                            <div className={styles.postIcon}>
                                <AiOutlineComment size={30} />
                                <p>100000</p>
                            </div>
                        </div>
                    </div>
                    <form className={styles.commentContainer} style={{
                        paddingBlock: "var(--gap)"
                    }}>
                        <BsEmojiSmile />
                        <textarea aria-label={localeTr.addcomment} placeholder={localeTr.addcomment + "..."}
                            autoComplete="off" autoCorrect="off" onKeyUp={(e) => {
                                e.currentTarget.style.height = "1px";
                                e.currentTarget.style.height = (e.currentTarget.scrollHeight) + "px";
                            }}></textarea>
                        <div>
                            <button>{localeTr.post}</button>
                        </div>

                    </form>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                style={modalStyles}
                onRequestClose={() => setModalOpen(false)} >
                {
                    step === "actions" && (
                        <ul className={styles.modalBody}>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`}><AiOutlineDelete size={25} /><span>Delete</span></li>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`} onClick={() => setStep("report")}><MdReport size={25} /><span>Report</span></li>
                            <li className={styles.actionItem} onClick={() => setStep("edit")}><MdModeEdit size={25} /><span>Edit</span></li>
                            <li className={styles.actionItem}><BiCommentX size={25} /><span>Close comments</span></li>
                            <li className={styles.actionItem}><RiUserUnfollowLine size={25} /><span>Unfollow</span></li>
                            <li className={styles.actionItem}><MdOutlineContentCopy size={25} /><span>copy post url</span> </li>
                            <li className={`${styles.actionItem} ${styles.dangerAction}`}><MdBlock size={25} /><span>Block</span></li>
                        </ul>
                    )
                }
                {
                    step === "edit" && (
                        <div className={`${styles.modalBody} ${styles.editModal}`}>
                            <div className={styles.editHeader}>
                                <div className={styles.backIcon} onClick={closeModal}>
                                    <IoMdClose size={20} color="var(--accents-6)" />
                                </div>
                                <p>Edit</p>
                                <button onClick={() => console.log("done")}
                                    className={styles.saveButton}
                                >
                                    Save
                                </button>
                            </div>
                            <div className={`${styles.modalContent} ${styles.captionStage}`}>
                                <div className={styles.editItem}>
                                    <label htmlFor="caption">Caption:</label>
                                    <textarea
                                        placeholder="Add caption..."
                                        autoFocus
                                        className={styles.textArea}
                                        id="caption"
                                    ></textarea>
                                </div>
                                <div className={styles.editItem}>
                                    <label htmlFor="location">Location:</label>
                                    <input
                                        type="text"
                                        placeholder="Add location..."
                                        id="location"
                                    />
                                </div>
                            </div>

                        </div>
                    )
                }
                {
                    step === "report" && (
                        <div className={`${styles.modalBody} ${styles.editModal}`}>
                            <div className={styles.editHeader}>
                                <div className={styles.backIcon} onClick={closeModal}>
                                    <IoMdClose size={20} color="var(--accents-6)" />
                                </div>
                                <p>Report post</p>
                                <button onClick={() => console.log("done")}
                                    className={styles.saveButton}
                                >
                                    Send
                                </button>
                            </div>
                            <ul className={`${styles.modalContent} ${styles.report}`}>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" id="adult" value={"adult content"}
                                        className={styles.reportInput} />
                                    <label htmlFor="adult">Adult content</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="harassment"
                                        className={styles.reportInput} />
                                    <label htmlFor="harassment">Harassment or hateful speech</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="violence"
                                        className={styles.reportInput} />
                                    <label htmlFor="violence">Violence of physical harm</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="fake"
                                        className={styles.reportInput} />
                                    <label htmlFor="fake">Fake or spam</label>
                                </li>
                                <li className={styles.reportItem}>
                                    <input type="checkbox" value={"adult content"}
                                        id="intellectual"
                                        className={styles.reportInput} />
                                    <label htmlFor="intellectual">Intellectual property infringement</label>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </Modal>
        </div>
    )
}



export default PostFullView