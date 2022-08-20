import React from "react"
import Image from "next/image"
import styles from "./styles/couplepreview.module.css"
import { FaCertificate } from "react-icons/fa";


interface couple {
    name: string;
    isFollowing: boolean;
    status: string;
    profile_picture: string;
    verified: boolean
}


const CouplePreview: React.FunctionComponent<couple> = ({name, isFollowing, status, profile_picture, verified}) => {
    return (
        <article className={styles.container}>
            <div className={styles.infoContainer}>
            <Image  className={styles.image} src={profile_picture} height = {50} width={50}/>
             <div className={styles.coupleInfo}>
                <h4>{name}{' '} {verified ? <FaCertificate size={13} color="var(--success-light)"/>:""}</h4>
                <p className={styles.status}>{status}</p>
             </div>
             </div>
            <button className={`${styles.button} ${isFollowing  ?  styles.buttonDull: ""}`}>{isFollowing ? "following" : "follow"}</button>
        </article>
    )
}

export default CouplePreview