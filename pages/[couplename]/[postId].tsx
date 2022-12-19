import axios, { AxiosError } from "axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"
import Layout from "../../components/mainLayout"
import { NotFound } from "../../components/notfound"
import { PostFullView } from "../../components/post"
import { BASEURL } from "../../constants"
import styles from "../../styles/post.module.css"

export default function Post(props: any) {
    const router = useRouter()
    const { postId, couplename } = router.query
    if (props.post.data === null) {
        return (
            <Layout>
                <NotFound type="post" />
            </Layout>
        )
    }
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

                    <PostFullView couplename={couplename as string} postId={postId as string} initialData={props.post} />
                </div>

            </div>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const name = ctx.query.couplename as string
    const id = ctx.query.postId as string
    try {
        const res = await axios.get(`${BASEURL}/post/${name}/${id}`, {
            headers: {
                Cookie: `session=${ctx.req.cookies.session}`
            }
        })
        return { props: { post: { data: res.data } } }
    } catch (err: any) {
        if (err.response?.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/login",
                },
                props: {},
            };
        }
        return { props: { post: { data: null } } }
    }
}
