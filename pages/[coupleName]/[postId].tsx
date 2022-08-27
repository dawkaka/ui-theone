import { useRouter } from "next/router"
import Layout from "../../components/mainLayout"
import { PostFullView } from "../../components/post"

export default function Post() {
    const router = useRouter()
    const { postId, coupleName } = router.query
    return (
        <Layout>
            {
                <PostFullView coupleName={coupleName!} postId={postId!} />
            }

        </Layout>
    )
}