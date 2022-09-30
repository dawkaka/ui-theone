import React, { useState } from "react";
import styles from "./styles/comment.module.css";
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "../constants";
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
  const { locale } = useRouter()
  const likesCount = new Intl.NumberFormat(locale, { notation: "compact" }).format(props.likes_count)
  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileContainer}>
          <Image src={props.profile_url} width={40} height={40} className={styles.profileImage} />
        </div>
        <div className={styles.commentInfo}>
          <div className={styles.nameContainer}>
            <h5>{props.userName}</h5>
            <AiFillHeart color="var(--error)" size={12} title="has partner"></AiFillHeart>
          </div>
          <small style={{ fontSize: "11px" }}>{props.date.toLocaleDateString()}</small>
        </div>
      </div>
      <div className={styles.commentBody}>
        <p className={styles.comment}>{props.comment}</p>
        <div className={styles.iconContainer}>
          {props.hasLiked ? <AiFillHeart size={20} color={`var(--error)`}></AiFillHeart> : <AiOutlineHeart size={20}></AiOutlineHeart>}
          <span style={{ fontSize: "13px" }}>{" " + likesCount}</span>
        </div>
      </div>
    </article>
  )
}



export const Comments: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const [skip, setSkip] = useState(0)
  const { isLoading, data } = useQuery(["comments", { id }],
    () => axios.get(`${BASEURL}/post/comments/${id}/${skip}`),
    { staleTime: Infinity, keepPreviousData: true })
  console.log(data)

  return (
    <div className={styles.commentsContainer}>
      {
        isLoading && <h5>Loading...</h5>
      }
      {
        data?.data.comments.map((comment: any) => {
          return (
            < Comment

              userName={comment.user_name}
              profile_url="/me3.jpg"
              hasPartner={comment.has_partner}
              hasLiked={false}
              isThisUser
              comment={comment.comment}
              date={new Date(comment.created_at)}
              likes_count={comment.likes_count}
            />
          )
        })
      }
      {!data?.data.pagination.has_next && <button onClick={() => setSkip(data?.data.pagination.next)}>load more...</button>}

    </div>
  )
}

export default Comment