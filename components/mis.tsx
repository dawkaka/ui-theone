import { CSSProperties } from "react"
import styles from "./styles/misc.module.css"
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";
import { useState, useEffect, useRef } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { IMAGEURL } from "../constants";

export const Verified: React.FunctionComponent<{ size: number }> = ({ size }) => {
    return (
        <svg height={size} width={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"
                fill="#3291FF" />
        </svg>
    )
}

export const Actions: React.FunctionComponent<{ orientation: "potrait" | "landscape", size: number }> = ({ orientation, size }) => {
    const r = orientation === "potrait" ? "rotate(90deg)" : "rotate(0)"
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={styles.actions} style={{ "--rotation": r } as CSSProperties}>
            <path fillRule="evenodd" clipRule="evenodd" d="M4 24C4 21.7909 5.79086 20 8 20C10.2091 20 12 21.7909 12 24C12 26.2091 10.2091 28 8 28C5.79086 28 
                                4 26.2091 4 24ZM20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 
                                26.2091 28 24 28C21.7909 28 20 26.2091 20 24ZM36 24C36 21.7909 37.7909 20 40 20C42.2091 20 44 21.7909 44 24C44 26.2091 42.2091
                                28 40 28C37.7909 28 36 26.2091 36 24Z"></path>
        </svg >
    )
}

export const CheckMark: React.FunctionComponent<{ size: number }> = ({ size }) => {
    const styles = useSpring({
        config: { friction: 8 },
        from: { scale: 0.5 },
        to: { scale: 1 },
    })

    return (
        <animated.svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            height={size}
            width={size}
            style={{ ...styles }}
        >
            <g fill="var(--success)">
                <path

                    d="M474.045,173.813c-4.201,1.371-6.494,5.888-5.123,10.088c7.571,23.199,11.411,47.457,11.411,72.1
		c0,62.014-24.149,120.315-68,164.166s-102.153,68-164.167,68s-120.316-24.149-164.167-68S16,318.014,16,256
		S40.149,135.684,84,91.833s102.153-68,164.167-68c32.889,0,64.668,6.734,94.455,20.017c28.781,12.834,54.287,31.108,75.81,54.315
		c3.004,3.239,8.066,3.431,11.306,0.425c3.24-3.004,3.43-8.065,0.426-11.306c-23-24.799-50.26-44.328-81.024-58.047
		C317.287,15.035,283.316,7.833,248.167,7.833c-66.288,0-128.608,25.813-175.48,72.687C25.814,127.392,0,189.712,0,256
		c0,66.287,25.814,128.607,72.687,175.479c46.872,46.873,109.192,72.687,175.48,72.687s128.608-25.813,175.48-72.687
		c46.873-46.872,72.687-109.192,72.687-175.479c0-26.332-4.105-52.26-12.201-77.064
		C482.762,174.736,478.245,172.445,474.045,173.813z"/>

                <path
                    d="M504.969,83.262c-4.532-4.538-10.563-7.037-16.98-7.037s-12.448,2.499-16.978,7.034l-7.161,7.161
		c-3.124,3.124-3.124,8.189,0,11.313c3.124,3.123,8.19,3.124,11.314-0.001l7.164-7.164c1.51-1.512,3.52-2.344,5.66-2.344
		s4.15,0.832,5.664,2.348c1.514,1.514,2.348,3.524,2.348,5.663s-0.834,4.149-2.348,5.663L217.802,381.75
		c-1.51,1.512-3.52,2.344-5.66,2.344s-4.15-0.832-5.664-2.348L98.747,274.015c-1.514-1.514-2.348-3.524-2.348-5.663
		c0-2.138,0.834-4.149,2.351-5.667c1.51-1.512,3.52-2.344,5.66-2.344s4.15,0.832,5.664,2.348l96.411,96.411
		c1.5,1.5,3.535,2.343,5.657,2.343s4.157-0.843,5.657-2.343l234.849-234.849c3.125-3.125,3.125-8.189,0-11.314
		c-3.124-3.123-8.189-3.123-11.313,0L212.142,342.129l-90.75-90.751c-4.533-4.538-10.563-7.037-16.98-7.037
		s-12.448,2.499-16.978,7.034c-4.536,4.536-7.034,10.565-7.034,16.977c0,6.412,2.498,12.441,7.034,16.978l107.728,107.728
		c4.532,4.538,10.563,7.037,16.98,7.037c6.417,0,12.448-2.499,16.977-7.033l275.847-275.848c4.536-4.536,7.034-10.565,7.034-16.978
		S509.502,87.794,504.969,83.262z"/>
            </g>
        </animated.svg >
    )
}


export const Carousel: React.FunctionComponent<{ files: string[], currFunc: (a: number) => void }> = ({ files, currFunc }) => {
    const slider = useRef<HTMLDivElement>(null)
    const [curr, setCurr] = useState(0)

    useEffect(() => {
        slider.current!.addEventListener("scroll", () => {
            let width = window.getComputedStyle(slider.current!).width
            width = width.substring(0, width.length - 2)
            let scrollPos = slider.current!.scrollLeft
            const widthNum = Math.floor(Number(width))
            setCurr(Math.floor(scrollPos / widthNum))
        })
    }, [])

    const scroll = (dir: string) => {
        let width = window.getComputedStyle(slider.current!).width
        width = width.substring(0, width.length - 2)
        let scrollPos = slider.current!.scrollLeft
        const widthNum = Math.floor(Number(width))
        let dist
        if (dir === "right") {
            dist = scrollPos + widthNum
        } else {
            dist = scrollPos - widthNum
        }
        slider.current!.scroll({
            left: dist,
            behavior: 'smooth'
        });
        setCurr(dist / widthNum)
    }
    useEffect(() => {
        currFunc(curr)
    }, [curr])

    return (
        <div className={styles.filesContainer}>
            <div className={styles.fileSlider} ref={slider}>
                {
                    files.map((file, indx) => (<div className={styles.fileContainer} key={indx}>
                        <img
                            src={file}
                            className={styles.postImage}
                            loading="lazy"
                        />
                    </div>))
                }
            </div>
            {curr !== 0 && <div role="button" className={styles.prev} onClick={() => scroll("left")}>
                <MdOutlineNavigateNext size={30} className={styles.aIcon} />
            </div>
            }
            {curr < files.length - 1 && <div role="button" className={styles.next} onClick={() => scroll("right")}>
                <MdOutlineNavigateNext size={30} className={styles.aIcon} />
            </div>
            }
        </div>
    )
}


export const SearchUser: React.FunctionComponent<{
    hasPartner: boolean,
    userName: string, picture: string, fullName: string
}> = ({ hasPartner, userName, picture, fullName }) => {
    return (
        <Link href={`/user/${userName}`} shallow>
            <a>
                <article style={{ display: "flex", alignItems: "center", gap: "var(--gap-half)", marginBottom: "var(--gap-half)" }}>

                    <div>
                        <img src={picture} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", color: "var(--accents-7)" }}>
                        <h4 style={{}}>{fullName}</h4>
                        <p style={{ color: "var(--accents-6)" }}>@{userName} {' '}{hasPartner ? <FaHeart color="var(--error)" size={12} /> : ""}</p>

                    </div>
                </article>
            </a>
        </Link>
    )
}

export const SearchCouple: React.FunctionComponent<{
    verified: boolean,
    married: boolean,
    name: string,
    picture: string
}> = ({ verified, married, name, picture }) => {
    return (
        <Link href={`/${name}`} shallow>
            <a>
                <article style={{ display: "flex", alignItems: "center", gap: "var(--gap-half)", marginBottom: "var(--gap-half)" }}>
                    <div>
                        <img src={picture} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", color: "var(--accents-7)" }}>
                        <h4 style={{}}>{name}{" "} {verified ? <Verified size={13} /> : ""}</h4>
                        <p style={{ color: "var(--accents-6)" }}>{married ? "married" : "dating"}</p>
                    </div>
                </article>
            </a>
        </Link>
    )
}


export const Video: React.FC<{ file: string }> = ({ file }) => {
    const vidRef = useRef<HTMLVideoElement>(null)
    const isVideoPlaying = (video: HTMLVideoElement) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    function isInView(el: HTMLVideoElement) {
        var rect = el.getBoundingClientRect();           // absolute position of video element
        return (rect.top > 0 && rect.bottom < window.innerHeight);   // visible?
    }

    const toggleVideo = () => {
        if (vidRef && vidRef.current) {
            if (vidRef.current.muted) {
                vidRef.current.muted = false
            } else {
                vidRef.current.muted = true

            }
        }
    }

    useEffect(() => {
        window.document.addEventListener("scroll", () => {
            if (vidRef.current) {
                if (isInView(vidRef.current)) {
                    vidRef.current.click()
                    vidRef.current.play()
                } else {
                    vidRef.current.pause()
                }
            }
        })
    })

    return (
        <video src={file}
            style={{ objectFit: "contain", backgroundColor: "black", width: "100%", height: "min(70vh, 500px)" }}
            onClick={toggleVideo}
            onEnded={() => vidRef.current?.play()}
            ref={vidRef}
        />
    )
}



export const Loader: React.FC<{ loadMore: () => void, hasNext: boolean, isFetching: boolean }> = ({ loadMore, hasNext, isFetching }) => {
    return (
        <>
            {hasNext && (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {!isFetching ?
                        <button onClick={() => loadMore()}>load more</button>
                        :
                        <button>loading...</button>
                    }
                </div>
            )
            }
        </>
    )
}



export const Toast: React.FC<{ message: string, type: "ERROR" | "SUCCESS" | "NEUTRAL", resetMessage: () => void }> = ({ message, type, resetMessage }) => {
    const pausedRef = useRef(false)
    const timer = useRef(0)
    if (message === "") {
        return null
    }
    if (message !== "") {
        timer.current = Date.now()
        setTimeout(() => {
            if (!pausedRef.current) {
                resetMessage()
            }
        }, 3000)
    }
    return (
        <div className={styles.toast}
            onMouseOver={() => pausedRef.current = true}
            onMouseOut={() => {
                pausedRef.current = false
                if (Date.now() - timer.current > 3000) {
                    resetMessage()
                }
            }}
            style={{ borderLeftColor: type === "ERROR" ? "var(-error)" : type === "SUCCESS" ? "green" : "var(--success)" }}
        >
            <p>{message}</p>
        </div >
    )
}