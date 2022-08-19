import React from "react";
import styles from "./styles/comment.module.css";
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {GoPrimitiveDot} from "react-icons/go";
interface comment {
   userName: string;
   comment: string;
   date: Date;
   likes_count: number;
   profile_url: string;
   isThisUser: boolean;
   hasLiked: boolean;
   hasPartner: boolean
}

const Comment: React.FunctionComponent<comment> = (props) => {
  return (
    <article className={styles.container}>
     <div className={styles.header}>
        <div className={styles.profileContainer}>
            <Image src={props.profile_url} width={40} height={40} className={styles.profileImage} />
        </div>
        <div className={styles.commentInfo}>
            <div className={styles.nameContainer}>
                <h5>{props.userName}</h5>
                <GoPrimitiveDot color="var(--success" title="has partner"></GoPrimitiveDot>
            </div>
            
            <em>{props.date.toLocaleDateString()}</em>
        </div>
     </div>
     <p className={styles.comment}>{props.comment}</p>
     <div className={styles.iconContainer}>
        {props.hasLiked ? <AiFillHeart size={20} color= {`var(--error)`}></AiFillHeart> : <AiOutlineHeart size={20}></AiOutlineHeart>}
        <span>{props.likes_count}</span>
        </div>
    </article>
  )
}

export default Comment