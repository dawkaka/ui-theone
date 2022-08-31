import Image from "next/image";
import { NextPage } from "next";
import Layout from "../components/mainLayout";
import Suggestions from "../components/suggestions";
import Header from "../components/pageHeader";
import styles from "../styles/couple.module.css"
import { Actions, Verified } from "../components/mis";
import { Post } from "../components/post";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const CoupleProfile: NextPage = () => {
    return (
        <>
            <Layout>
                <div className={styles.mainContainer}>
                    <div className={styles.profileContainer}>
                        <Header title="john.and.jane" arrow />
                        <section className={styles.profileInfo}>
                            <div className={styles.coverPicContainer}>
                                <Image src="/me7.jpg" height={"300px"} width={"900px"} objectFit="cover" />
                            </div>
                            <div className={styles.profile}>
                                <div className={styles.flex}>
                                    <div className={styles.imageContainer}>
                                        <Image
                                            objectFit="cover"
                                            height={"120px"}
                                            width={"120px"}
                                            src={"/me.jpg"}
                                            className={styles.profileImage}
                                        />
                                    </div>
                                    <div className={styles.profileActBtnContainer}>
                                        <Actions size={25} orientation="landscape" />
                                        <button>follow</button>
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
                                            <div className={styles.countItem}>
                                                <strong title="Following">830</strong>
                                                <span className={styles.countItemTitle}>Followers</span>
                                            </div>
                                        </h2>
                                        <h2 className={styles.countInfo}>
                                            <div className={`${styles.countItem} ${styles.dateStarted}`}>
                                                <p title="Following">{new Date().toDateString().substring(3)}</p>
                                                <span className={styles.countItemTitle}>Started</span>
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
                </div>
            </Layout >
        </>
    )
}

export default CoupleProfile