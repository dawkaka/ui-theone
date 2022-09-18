import { kMaxLength } from "buffer"
import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"
import Layout from "../../components/mainLayout"
import { PostFullView } from "../../components/post"
import styles from "../../styles/post.module.css"

export default function Post() {
    const router = useRouter()
    const { postId, couplename } = router.query
    return (
        <Layout>
            <div style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div className={styles.container}>
                    <div className={styles.headerContainer}>
                        <div onClick={() => router.back()} className={styles.backIcon}>
                            <BiArrowBack size={20} />
                        </div>
                        <h3>Post</h3>
                    </div>

                    <PostFullView couplename={couplename!} postId={postId!} />
                </div>

            </div>
        </Layout >
    )
}