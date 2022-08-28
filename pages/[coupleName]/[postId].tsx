import { kMaxLength } from "buffer"
import { useRouter } from "next/router"
import Layout from "../../components/mainLayout"
import { PostFullView } from "../../components/post"

export default function Post() {
    const router = useRouter()
    console.log(router)
    const { postId, coupleName } = router.query
    return (
        <Layout>
            <div style={{
                width: "100%",
                padding: "0 var(--gap-quarter)",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{ height: "80%", border: "1px  solid var(--accents-2)" }}>
                    <PostFullView coupleName={coupleName!} postId={postId!} />
                </div>

            </div>
        </Layout >
    )
}