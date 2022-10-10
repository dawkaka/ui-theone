import React, { useState } from "react"
import Image from "next/image"
import styles from "./styles/couplepreview.module.css"
import { Verified } from "./mis";
import tr from "../i18n/locales/components/couplepreview.json"
import { useRouter } from "next/router";
import { Langs } from "../types";
import { Mutation, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../constants";
import Link from "next/link";


interface couple {
    name: string;
    isFollowing: boolean;
    married: boolean;
    profile_picture: string;
    verified: boolean
}


const CouplePreview: React.FunctionComponent<couple> = ({ name, isFollowing, married, profile_picture, verified }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [following, setFollowing] = useState(isFollowing)

    const mutation = useMutation(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/yousiph.and.lana`)
        },
        {
            onSuccess: (data) => {
                console.log(data)
            },
            onError: (err) => {
                console.log(err)
                setFollowing(!following)
            }
        }
    )

    const followUnfollow = () => {
        mutation.mutate()
        setFollowing(!following)
    }

    return (

        <article className={styles.container}>

            <div className={styles.infoContainer}>
                <div className={styles.imageContainer}>
                    <Image className={styles.image} src={profile_picture} height="45px" width="45px" layout="fixed" />
                </div>
                <Link href={`/${name}`}>
                    <a>
                        <div className={styles.coupleInfo}>
                            <h4>{name}{' '} {verified ? <Verified size={14} /> : ""}</h4>
                            <p className={styles.status}>{married ? "married" : "dating"}</p>
                        </div>
                    </a>
                </Link>
            </div>
            <button className={`${styles.button} ${following ? styles.buttonDull : ""}`} onClick={followUnfollow}>{following ? localeTr.following : localeTr.follow}</button>
        </article >

    )
}

export default CouplePreview