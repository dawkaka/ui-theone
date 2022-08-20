import { NextPage } from "next";
import Layout from "../../components/mainLayout";
import CouplePreview from "../../components/couplepreview";



export default function HomePage() {
    return(
        <Layout>
        <div>
            <h1>Home Page</h1>
            <CouplePreview profile_picture="/me.jpg" name="Yukieforyoueyesbro" isFollowing={false} status="Dating" verified={false}/>
            <CouplePreview profile_picture="/me.jpg" name="Yukiesomething" isFollowing={false} status="married" verified/>
            <CouplePreview profile_picture="/me.jpg" name="Yukbeeie" isFollowing status="married"verified={false}/>
            <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="Dating" verified/>
             <CouplePreview profile_picture="/me.jpg" name="Yukielikesfor" isFollowing status="Dating"verified={false}/>
            <CouplePreview profile_picture="/me.jpg" name="Yukie" isFollowing={false} status="married"verified={false}/>
        </div>
        </Layout>
    )
}