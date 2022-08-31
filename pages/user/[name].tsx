import Image from "next/image";
import Layout from "../../components/mainLayout";
import styles from "../../styles/profile.module.css"
import { Verified } from "../../components/mis";

export default function Profile() {
    return (
        <Layout>
            <section className={styles.section}>
                <div className={styles.profileTopContainer}>
                    <div className={styles.profileTop}>
                        <div className={styles.infoWrapper}>
                            <div className={styles.infoContainer}>
                                <div className={styles.imageContainer} style={{ width: "116px", height: "116px" }}>
                                    <span className={styles.avatarContainer} style={{ width: "116px", height: "116px" }}>
                                        <Image
                                            layout="fill"
                                            objectFit="cover"
                                            src={"/me.jpg"}
                                            className={styles.profileImage}
                                        />
                                    </span>
                                </div>
                                <div className={styles.titleContainer}>
                                    <h1 className={styles.userName}>ant.man{' '}<Verified size={20} /></h1>
                                    <h2 data-e2e="user-subtitle" className={styles.realName}>Yussif Mohammed</h2>
                                    <div className={styles.requestContainer}>
                                        <div className={styles.requestButtonWrapper}>
                                            <button type="button" className={styles.requestButton}>Send request</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.countInfo}>
                                <div className={styles.countItem}>
                                    <strong title="Following">830</strong>
                                    <span className={styles.countItemTitle}>Following</span>
                                </div>
                            </h2>
                            <h2 className={styles.bio}>
                                {`Acting and comedy
                    🇬🇭
                    Dm on Instagram @fatimazawwa for promo`}
                            </h2>
                        </div>
                        <div className={styles.actions}>

                        </div>
                    </div>
                </div>
                <div className={styles.profileBottom}>
                    <div className={styles.showImagesWrapper}>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me2.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me3.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me4.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me5.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                        <article className={styles.showImageContainer}>
                            <Image src={"/me6.jpg"} height="230px" width="200px" layout="responsive" objectFit="cover" className={styles.showImage} />
                        </article>
                    </div>
                </div>

            </section >
        </Layout >
    )
}