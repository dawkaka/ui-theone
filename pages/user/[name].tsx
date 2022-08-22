import Image from "next/image";
import Layout from "../../components/mainLayout";
import styles from "./styles/profile.module.css"
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
                                    <strong title="Following" data-e2e="following-count">830</strong>
                                    <span className={styles.countItemTitle}>Following</span>
                                </div>  </h2>
                            <h2 data-e2e="user-bio" className={styles.bio}>
                                {`Acting and comedy
                    🇬🇭
                    Dm on Instagram @fatimazawwa for promo`}
                            </h2>
                        </div>
                        <div className={styles.actions}><svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg></div>
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