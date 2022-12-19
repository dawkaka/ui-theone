import React, { useContext } from "react"
import Image from "next/image"
import styles from "./styles/couplepreview.module.css"
import { Verified } from "./mis";
import tr from "../i18n/locales/components/couplepreview.json"
import { useRouter } from "next/router";
import { CouplePreviewT, Langs, MutationResponse } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "../constants";
import Link from "next/link";
import { ToasContext } from "./context";

const CouplePreview: React.FunctionComponent<CouplePreviewT> = ({ couple_name, is_following, married, profile_picture, verified, updateCache }) => {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const notify = useContext(ToasContext)

    const mutation = useMutation<AxiosResponse, AxiosError<any, any>, "follow" | "unfollow">(
        (type) => {
            return axios.post(`${BASEURL}/user/${type}/${couple_name}`)
        },
        {
            onSuccess: (data) => {
                const { message, type } = data.data as MutationResponse
                notify?.notify(message, type)
            },
            onError: (err) => {
                updateCache()
                notify?.notify(err.response?.data.message, "ERROR")
            }
        }
    )

    const followUnfollow = () => {
        mutation.mutate(is_following ? "unfollow" : "follow")
        updateCache()
    }

    return (

        <article className={styles.container}>

            <div className={styles.infoContainer}>
                <div className={styles.imageContainer}>
                    <Image className={styles.image}
                        src={profile_picture} height="45px" width="45px"
                        layout="fixed"
                        alt="Couple's profile"
                    />
                </div>
                <Link href={`/${name}`}>
                    <a>
                        <div className={styles.coupleInfo}>
                            <h4>{couple_name}{' '} {verified ? <Verified size={14} /> : ""}</h4>
                            <p className={styles.status}>{married ? "married" : "dating"}</p>
                        </div>
                    </a>
                </Link>
            </div>
            <button className={`${styles.button} ${is_following ? styles.buttonDull : ""}`} onClick={followUnfollow}>{is_following ? localeTr.following : localeTr.follow}</button>
        </article >

    )
}

export default CouplePreview