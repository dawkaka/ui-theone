import { NextPage } from "next";
import styles from './styles/home.module.css'
import Layout from "../../components/mainLayout";
import CouplePreview from "../../components/couplepreview";
import Header from "../../components/pageHeader";

export default function HomePage() {
    return (
        <Layout>
            <div className={styles.home}>

                <section className={styles.postsContainer}>
                    <Header title={"Home"} />
                    <div className={styles.content}>
                        <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="Dating" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="Dating" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="Dating" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="Dating" verified={false} />
                    </div>
                </section>

                <section className={styles.suggestionsContainer}>
                    <div className={styles.suggestionsWrapper}>
                        <h1>Suggestions</h1>
                        <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="Dating" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married" verified={false} />
                        <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="Dating" verified />
                        <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="Dating" verified={false} />
                    </div>
                </section>

            </div>
        </Layout >
    )
}