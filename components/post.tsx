import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link"
import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { MdOutlineNavigateNext } from "react-icons/md";
import styles from "./styles/post.module.css";
import { Actions, Verified } from "./mis";
import { FaAd } from "react-icons/fa";
import Comment from "./comment"
interface post {
    userName: string;
    caption: string;
    files: { name: string, type: string }[];
    likes_count: number;
    comments_count: number;
    verified: boolean
}

export const Post: React.FunctionComponent<post> = (props) => {

    const files = ["/me.jpg", "/me2.jpg", "/me3.jpg"]
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)

    useEffect(() => {
        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    })

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
        <article className={styles.container}>
            <div>
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
                            <h4>John.Doe{" "} {props.verified && <Verified size={13} />}</h4>
                        </div>
                    </div>
                    <div>
                        <Actions size={24} orientation="potrait" />
                    </div>
                </div>
                <div>
                    <div className={styles.filesContainer}>
                        <div className={styles.fileSlider} ref={slider}>
                            {
                                files.map(file => (<div className={styles.fileContainer} key={file}>
                                    <Image
                                        layout="responsive"
                                        src={file}
                                        objectFit="cover"
                                        width="500px"
                                        height="600px"
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
                                <p>100000</p>
                            </div>
                            <div className={styles.postIcon}>
                                <AiOutlineComment size={30} />
                                <p>100000</p>
                            </div>
                        </div>
                        <div className={styles.sliderPos}>
                            <small>{files.length - curr - 1 > 0 ? `+${files.length - 1 - curr} more` : ""}</small>
                        </div>
                    </div>
                    <Link href="/[coupleName]/[postId]" as={`/article/something`} >
                        <div className={styles.captionContainer}>
                            <p>
                                something caption that is very long and I don't want to know why it is like
                                tha from ghana we are the best couple in the world
                                I know so and I feel so.
                            </p>
                        </div>
                    </Link>
                </div>
                <div className={styles.commentContainer}>
                    <FaAd />
                    <textarea aria-label="Add a comment…" placeholder="Add a comment…"
                        autoComplete="off" autoCorrect="off"></textarea>
                    <div>
                        <button>post</button>
                    </div>

                </div>
            </div>

        </article>
    )
}


export function PostFullView({ coupleName, postId }: { coupleName: string | string[] | undefined; postId: string | string[] | undefined }) {
    return (
        <div className={styles.fullViewContainer}>
            <div className={styles.viewContent}>
                <div className={styles.viewFiles}></div>

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
                            </div>
                        </div>
                        <div>
                            <Actions size={24} orientation="potrait" />
                        </div>
                    </div>
                    <div className={styles.captionContainer} style={{
                        paddingTop: 0,
                        borderBottom: "1px solid var(--accents-2)"

                    }}>
                        <p>
                            something caption that is very long and I don't want to know why it is like
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
                                        comment={`we are dad bfor abeo before you come here talking the bewt other here and \n no dkiiings`}
                                        date={new Date}
                                        likes_count={3232}
                                    />
                                )
                            })
                        }

                    </div>
                    <div className={styles.viewFixedBottom}>
                        <div className={styles.postStats} style={{ borderTop: "1px solid var(--accents-2)", paddingBottom: "var(--gap-half)" }}>
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
                            <div className={styles.sliderPos}>
                                <small>+4 more</small>
                            </div>
                        </div>
                        <div className={styles.commentContainer} style={{
                            paddingBlock: "var(--gap)"
                        }}>
                            <FaAd />
                            <textarea aria-label="Add a comment…" placeholder="Add a comment…"
                                autoComplete="off" autoCorrect="off"></textarea>
                            <div>
                                <button>post</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}



export default PostFullView