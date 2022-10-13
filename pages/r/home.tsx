import Modal from 'react-modal';
import styles from '../../styles/home.module.css'
import Layout from "../../components/mainLayout";
import PostFullView, { Post } from "../../components/post";
import Suggestions from "../../components/suggestions";
import { useRouter } from "next/router";
import tr from "../../i18n/locales/home.json"
import { Langs } from "../../types";


Modal.setAppElement('#__next')

export default function HomePage() {
    const router = useRouter()
    const locale = router.locale as Langs || "en"
    const localeTr = tr[locale]
    return (
        <Layout>
            <div className={styles.home}>

                <section className={styles.postsContainer}>
                    <div className={styles.headerContainer}>
                        <h1>{localeTr.header}</h1>
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
                closeTimeoutMS={400}
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
                <PostFullView postId={router.query.postId} couplename={router.pathname} />
            </Modal>
        </Layout >
    )
}