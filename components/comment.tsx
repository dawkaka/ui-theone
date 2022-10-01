import React, { useRef, useState } from "react";
import styles from "./styles/comment.module.css";
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { Actions } from "./mis";
import Link from "next/link";
interface comment {
  userName: string;
  comment: string;
  date: Date;
  likes_count: number;
  profile_url: string;
  isThisUser: boolean;
  hasLiked: boolean;
  hasPartner: boolean;
  id: string;
  postId: string
}

const Comment: React.FunctionComponent<comment> = (props) => {
  const { locale } = useRouter()
  const [likes, setLikes] = useState(props.likes_count)
  const likesCount = new Intl.NumberFormat(locale, { notation: "compact" }).format(likes)
  const [showActions, setShowActions] = useState(false)
  const [liked, setLiked] = useState(props.hasLiked)

  const deleteMutation = useMutation(
    () => {
      return axios.delete(`${BASEURL}/post/comment/${props.postId}/${props.id}`)
    },
    {
      onSuccess: () => {
        setShowActions(false)
      }
    }
  )

  const likeMututation = useMutation(
    (liked: string) => {
      return axios.patch(`${BASEURL}/post/comment/${liked}/${props.postId}/${props.id}`)
    },
    {
      onError: () => {
        setLiked(!liked)
      }
    })

  return (
    <article className={styles.container} onClick={() => setShowActions(false)}>
      <div className={styles.header}>
        <div className={styles.header}>
          <div className={styles.profileContainer}>
            <Image src={props.profile_url} width={40} height={40} className={styles.profileImage} />
          </div>
          <div className={styles.commentInfo}>
            <div className={styles.nameContainer}>
              <Link href={`/user/${props.userName}`}>
                <a>
                  <h5>{props.userName}</h5>
                </a>
              </Link>
              <AiFillHeart color="var(--error)" size={12} title="has partner"></AiFillHeart>
            </div>
            <small style={{ fontSize: "11px" }}>{props.date.toLocaleDateString()}</small>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div onClick={(e) => {
            e.stopPropagation()
            setShowActions(!showActions)
          }}>
            <Actions orientation="landscape" size={15} />
          </div>
          {
            showActions && (
              <ul style={{
                padding: "var(--gap-quarter) var(--gap-half)",
                position: "absolute",
                backgroundColor: "var(--background)",
                right: 0,
                boxShadow: "0 0 5px var(--accents-2)"
              }}>
                <li style={{ cursor: "pointer" }} onClick={(e) => {
                  e.stopPropagation()
                  deleteMutation.mutate()
                }}>Delete</li>
              </ul>
            )
          }
        </div>
      </div>
      <div className={styles.commentBody}>
        <p className={styles.comment}>{props.comment}</p>
        <div className={styles.iconContainer}>
          <div onClick={() => {
            if (liked) {
              likeMututation.mutate("unlike")
              setLikes(likes - 1)
            } else {
              likeMututation.mutate("like")
              setLikes(likes + 1)
            }
            setLiked(!liked)
          }}>
            {liked ? <AiFillHeart size={20} color={`var(--error)`}></AiFillHeart> : <AiOutlineHeart size={20}></AiOutlineHeart>}
          </div>
          <span style={{ fontSize: "13px" }}>{likesCount}</span>
        </div>
      </div>
    </article>
  )
}



export const Comments: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const fetchComments = ({ pageParam = 0 }) => axios.get(`${BASEURL}/post/comments/${id}/${pageParam}`)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["comments", { id }], fetchComments,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.pagination.end) {
          return undefined
        }
        return lastPage.data.pagination.next
      }
    })

  let comments: any[] = []
  if (data?.pages) {
    for (let page of data?.pages) {
      comments = comments.concat(page.data.comments)
    }
  }

  return (
    <div className={styles.commentsContainer}>
      {
        comments.map((comment: any) => {
          return (
            <Comment
              key={comment.id}
              id={comment.id}
              postId={id}
              userName={comment.user_name}
              profile_url={`${IMAGEURL}/${comment.profile_picture}`}
              hasPartner={comment.has_partner}
              hasLiked={comment.has_liked}
              isThisUser={false}
              comment={comment.comment}
              date={new Date(comment.created_at)}
              likes_count={comment.likes_count}
            />
          )
        })
      }
      {
        (isFetching || isFetchingNextPage) && <h5>Loading...</h5>
      }
      {hasNextPage && <button onClick={() => fetchNextPage()}>load more...</button>}

    </div>
  )
}

export default Comments