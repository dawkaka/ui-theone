import React, { useContext, useRef, useState } from "react";
import styles from "./styles/comment.module.css";
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASEURL, IMAGEURL } from "../constants";
import { Actions, Loader } from "./mis";
import Link from "next/link";
import { useUser } from "../hooks";
import { CommentT, MutationResponse } from "../types";
import { ToasContext } from "./context";
import { TextParser } from "./post";
import { NotFound } from "./notfound";


const Comment: React.FunctionComponent<CommentT> = (props) => {
  const { locale } = useRouter()
  const [likes, setLikes] = useState(props.likes_count)
  const likesCount = new Intl.NumberFormat(locale, { notation: "compact" }).format(likes)
  const [showActions, setShowActions] = useState(false)
  const [liked, setLiked] = useState(props.has_liked)
  const [deleted, setDeleted] = useState(false)
  const likedRef = useRef(false)
  const queryClient = useQueryClient()
  const notify = useContext(ToasContext)
  const { postId, id } = props

  const updateDeleteCache = () => {
    queryClient.setQueryData(["comments", { id: postId }], (oldData: any) => {
      if (oldData) {
        const { pages } = oldData
        let page = -1
        for (let i = 0; i < pages.length; i++) {
          if (pages[i].comments.some((val: any) => val.id === id)) {
            page = i
            break;
          }
        }
        if (page > -1) {
          pages[page].comments = pages[page].comments.filter((comment: any) => comment.id !== id);
        }
        return { ...oldData, pages }
      }
      return undefined
    })
  }

  const deleteMutation = useMutation<AxiosResponse, AxiosError<any, any>>(
    () => {
      return axios.delete(`${BASEURL}/post/comment/${props.postId}/${props.id}`)
    },
    {
      onSuccess: (data) => {
        updateDeleteCache()
        setShowActions(false)
        setDeleted(true)
        const { message, type } = data.data as MutationResponse
        notify?.notify(message, type)
      },
      onError: (err) => {
        setDeleted(false)
        notify?.notify(err.response?.data.message, "ERROR")
      }
    }
  )

  const likeMututation = useMutation(
    (liked: string) => {
      return axios.patch(`${BASEURL}/post/comment/${liked}/${props.postId}/${props.id}`)
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(["comments", { id: postId }], (oldData: any) => {
          if (oldData) {
            const { pages } = oldData
            let page = -1
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].comments.some((val: any) => val.id === id)) {
                page = i
                break;
              }
            }
            if (page > -1) {
              pages[page].comments = pages[page].comments.map((comment: CommentT) => {
                if (comment.id === id) {
                  return { ...comment, likes_count: likedRef.current ? props.likes_count + 1 : props.likes_count - 1, has_liked: likedRef.current }
                }
                return comment
              });
            }
            return { ...oldData, pages }
          }
          return undefined
        })
      },
      onError: () => {
        setLiked(!liked)
      }
    })
  if (deleted) {
    return null
  }

  return (
    <article className={styles.container} onClick={() => setShowActions(false)}>
      <div className={styles.header}>
        <div className={styles.header}>
          <div className={styles.profileContainer}>
            <Image src={props.profile_url} width={40} height={40}
              className={styles.profileImage}
              alt="User's profile"
            />
          </div>
          <div className={styles.commentInfo}>
            <div className={styles.nameContainer}>
              <Link href={`/user/${props.user_name}`}>
                <a>
                  <h5>{props.user_name}</h5>
                </a>
              </Link>
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
                {
                  props.isThisUser && (
                    <li style={{ cursor: "pointer" }} onClick={(e) => {
                      e.stopPropagation()
                      deleteMutation.mutate()
                    }}>Delete</li>
                  )
                }
              </ul>
            )
          }
        </div>
      </div>
      <div className={styles.commentBody}>
        <div className={styles.comment}>
          {<TextParser text={props.comment} />}
        </div>
        <div className={styles.iconContainer}>
          <div onClick={() => {
            if (liked) {
              likedRef.current = false
              likeMututation.mutate("unlike")
              setLikes(likes - 1)
            } else {
              likedRef.current = true
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
  const fetchComments = ({ pageParam = 0 }) => axios.get(`${BASEURL}/post/comments/${id}/${pageParam}`).then(res => res.data)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(["comments", { id }], fetchComments,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pagination.end) {
          return undefined
        }
        return lastPage.pagination.next
      },
      staleTime: Infinity
    })

  const userId = useUser()
  let comments: any[] = []
  if (data?.pages) {
    for (let page of data?.pages) {
      comments = comments.concat(page.comments)
    }
  }
  return (
    <div className={styles.commentsContainer}>
      {
        comments.length === 0 && <NotFound type="comments" />
      }
      {
        comments.map((comment: any) => {
          return (
            <Comment
              key={comment.id}
              id={comment.id}
              postId={id}
              user_name={comment.user_name}
              profile_url={`${IMAGEURL}/${comment.profile_picture}`}
              has_partner={comment.has_partner}
              has_liked={comment.has_liked}
              isThisUser={comment.user_id === userId}
              comment={comment.comment}
              date={new Date(comment.created_at)}
              likes_count={comment.likes_count}
            />
          )
        })
      }
      <Loader loadMore={fetchNextPage} isFetching={isFetching} hasNext={hasNextPage ? true : false} manual={false} />
    </div>
  )
}

export default React.memo(Comments)