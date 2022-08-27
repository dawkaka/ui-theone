import { NextPage } from "next";
import Modal from 'react-modal';
import styles from './styles/home.module.css'
import Layout from "../../components/mainLayout";
import CouplePreview from "../../components/couplepreview";
import Header from "../../components/pageHeader";
import PostFullView, { Post } from "../../components/post";
import { useRouter } from "next/router";


Modal.setAppElement('#__next')

export default function HomePage() {
    const router = useRouter()
    return (
        <Layout>
            <div className={styles.home}>

                <section className={styles.postsContainer}>
                    <div className={styles.headerContainer}>
                        <h1>Home</h1>
                    </div>
                    <div className={styles.content}>
                        <Post verified />
                        <Post verified />
                        <Post verified />
                        <Post verified />
                        <Post verified />
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
            <Modal
                isOpen={!!router.query.postId}
                onRequestClose={() => router.push('/')}
                contentLabel="Post modal"
            >
                <PostFullView postId={router.query.postId} coupleName={router.pathname} />
            </Modal>
        </Layout >
    )
}