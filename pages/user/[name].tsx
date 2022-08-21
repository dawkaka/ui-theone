import Image from "next/image";
import Layout from "../../components/mainLayout";
import styles from "./styles/profile.module.css"
import { Verified } from "../../components/mis";

export default function Profile() {

    //src="https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/1bbad2972a229f5eedc0dc42e37656f9~c5_100x100.jpeg?x-expires=1661277600&amp;x-signature=2Q528M3b%2B8q54WDWPwZvg4ZwXtI%3D"

    return (
        <Layout>
            <section className={styles.section}>
                <div className={styles.profileTopContainer}>
                    <div className={styles.profileTop}>
                        <div>
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
                        <div data-e2e="user-more" className={styles.actions}><svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091 28 40 28C37.7909 28 36 26.2091 36 24Z"></path></svg></div>
                    </div>
                </div>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
                <h1>pic</h1>
            </section>
        </Layout>
    )
}