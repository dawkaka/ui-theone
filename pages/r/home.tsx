import Modal from 'react-modal';
import styles from '../../styles/home.module.css'
import Layout from "../../components/mainLayout";
import CouplePreview from "../../components/couplepreview";
import PostFullView, { Post } from "../../components/post";
import Suggestions from "../../components/suggestions";
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
                <Suggestions />
            </div>
            <Modal
                isOpen={false}
                onRequestClose={() => router.back()}
                contentLabel="Post modal"
                style={{
                    overlay: {
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        paddingInline: "var(--gap)",
                        display: "grid",
                        placeItems: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 0
                    },
                    content: {
                        maxWidth: "940px",
                        padding: 0,
                        margin: 0,
                        top: 0,
                        borderRadius: 0,
                        left: 0,
                        overflow: "hidden",
                        height: "90%",
                        backgroundColor: "var(--background)",
                        border: "none",
                        position: "relative"
                    }
                }} >
                <PostFullView postId={router.query.postId} coupleName={router.pathname} />
            </Modal>
        </Layout >
    )
}