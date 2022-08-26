import styles from "./styles/post.module.css";
import Image from "next/image";
import { Actions } from "./mis";
interface post {
    userName: string;
    caption: string;
    files: { name: string, type: string }[];
    likes_count: number;
    comments_count: number;
    verified: boolean
}

const Post: React.FunctionComponent<post> = (props) => {
    return (
        <article>
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
                            <h4>John.Doe</h4>
                        </div>
                    </div>
                    <div>
                        <Actions size={24} orientation="potrait" />
                    </div>
                </div>
                <figure>
                    <div></div>
                    <div></div>
                    <figcaption></figcaption>
                </figure>
                <div></div>
            </div>

        </article>
    )
}

export default Post