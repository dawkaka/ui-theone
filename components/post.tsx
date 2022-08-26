import Image from "next/image";
import { MdOutlineNavigateNext } from "react-icons/md";
import styles from "./styles/post.module.css";
import { Actions, Verified } from "./mis";
import { useRef } from "react";
import { FaMeteor } from "react-icons/fa";
interface post {
    userName: string;
    caption: string;
    files: { name: string, type: string }[];
    likes_count: number;
    comments_count: number;
    verified: boolean
}

const Post: React.FunctionComponent<post> = (props) => {

    const files = ["/me.jpg", "/me2.jpg", "/me3.jpg"]
    const slider = useRef<HTMLDivElement>(null)

    const scroll = (dir: string) => {

        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        let dist
        if (dir === "right") {
            dist = scrollPos + Number(width)
        } else {
            dist = scrollPos - Number(width)
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });

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
                                    <Image layout="fill" src={file} objectFit="cover" />
                                </div>))
                            }
                        </div>
                        <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                        <div role="button" className={styles.next} onClick={() => scroll("right")}>
                            <MdOutlineNavigateNext size={20} className={styles.aIcon} />
                        </div>
                    </div>
                    <div></div>
                    <figcaption></figcaption>
                </div>
                <div></div>
            </div>

        </article>
    )
}

export default Post