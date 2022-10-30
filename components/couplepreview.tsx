import React, { useContext, useState } from "react"
import Image from "next/image"
import styles from "./styles/couplepreview.module.css"
import { Verified } from "./mis";
import tr from "../i18n/locales/components/couplepreview.json"
import { useRouter } from "next/router";
import { Langs, MutationResponse } from "../types";
import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "../constants";
import Link from "next/link";
import { ToasContext } from "./context";


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
    const notify = useContext(ToasContext)
    const queryClient = useQueryClient()

    const mutation = useMutation<AxiosResponse, AxiosError<any, any>>(
        () => {
            return axios.post(`${BASEURL}/user/${!following ? "follow" : "unfollow"}/${name}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify?.notify(message, type)
                queryClient.invalidateQueries(["suggested"])
            },
            onError: (err) => {
                setFollowing(prv => !prv)
                notify?.notify(err.response?.data.message, "ERROR")
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