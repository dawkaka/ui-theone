

interface post {
    userName: string;
    caption: string;
    files: { name: string, type: string }[];
    likes_count: number;
    comments_count: number
}

const Post: React.FunctionComponent<post> = () => {
    return (
        <article>


        </article>
    )
}

export default Post