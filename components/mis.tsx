import { CSSProperties } from "react"
import styles from "./styles/misc.module.css"
import { useSpring, animated } from "@react-spring/web";
import { useState, useEffect, useRef } from "react";
import { MdOutlineError, MdOutlineNavigateNext } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { Langs } from "../types";
import tr from "../i18n/locales/components/misc.json"
import { BsFillCheckCircleFill } from "react-icons/bs";

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
    }, [curr, currFunc])

    return (
        <div className={styles.filesContainer}>
            <div className={styles.fileSlider} ref={slider}>
                {
                    files.map((file, indx) => (<div className={styles.fileContainer} key={indx}>
                        <img
                            src={file}
                            className={styles.postImage}
                            loading="lazy"
                            alt=""
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
                        <img src={picture} alt=""
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
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
                        <img src={picture} alt=""
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
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
    const videoRef = useRef<HTMLVideoElement>(null)
    const toggleVideo = () => {
        if (videoRef && videoRef.current) {
            if (videoRef.current.muted) {
                videoRef.current.muted = false
            } else {
                videoRef.current.muted = true

            }
        }
    }
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                } else {
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ position: "relative", padding: 0, margin: 0 }}>
            <video src={file}
                style={{ objectFit: "contain", backgroundColor: "black", width: "100%", maxHeight: "min(70vh, 500px)" }}
                onClick={toggleVideo}
                onEnded={() => videoRef.current?.play()}
                muted
                playsInline
                controls
                controlsList="nodownload"
                autoPlay
                preload="none"
                ref={videoRef}
            />
        </div>
    )
}



export const Loader: React.FC<{ loadMore: () => void, hasNext: boolean, isFetching: boolean, manual: boolean }> = ({ loadMore, hasNext, isFetching, manual }) => {
    const locale = useRouter().locale || "en"
    const localeTr = tr[locale as Langs]
    const loaderRef = useRef(null)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMore()
                }
            },
            { threshold: 0.5 }
        );

        if (loaderRef.current && !manual) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={loaderRef}>
            {hasNext && (
                <div style={{ width: "100%", textAlign: "center", paddingBlock: "var(--gap-quarter)", display: "flex", justifyContent: "center" }}>
                    {!isFetching ?
                        <button onClick={() => loadMore()}>{localeTr.loadmore}</button>
                        :
                        <Loading color="var(--success)" size="medium" />
                    }

                </div>
            )
            }
        </div>
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
        <div>
            <div className={styles.toast}
                onMouseOver={() => pausedRef.current = true}
                onMouseOut={() => {
                    pausedRef.current = false
                    if (Date.now() - timer.current > 3000) {
                        resetMessage()
                    }
                }}
                style={{ borderLeftColor: type === "ERROR" ? "var(--error)" : type === "SUCCESS" ? "limegreen" : "var(--success)" }}
            >
                {
                    type === "SUCCESS" ? <BsFillCheckCircleFill size={25} color="limegreen" /> :
                        <MdOutlineError size={30} color="var(--error)" />
                }
                <p>{message}</p>
            </div >
        </div>
    )
}

export const Loading: React.FC<{ color: string, size: "small" | "medium" | "large" }> = ({ color, size }) => {
    const setSize: CSSProperties =
        size === "small" ?
            { height: "13px", width: "2px" } :
            size === "medium" ?
                { height: "20px", width: "3px" } :
                { height: "50px", width: "10px" }
    return (
        <div className={styles.loadingContainer} style={{ color: color }}>
            <div className={styles.loaderBar} style={{ ...setSize }}></div>
            <div className={styles.loaderBar} style={{ ...setSize }}></div>
            <div className={styles.loaderBar} style={{ ...setSize }}></div>
            <div className={styles.loaderBar} style={{ ...setSize }}></div>
            <div className={styles.loaderBar} style={{ ...setSize }}></div>
        </div >
    )
}


export const Rocket: React.FC<{ recieving: boolean }> = ({ recieving }) => {
    return (
        <svg width="70" height="70" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: recieving ? "rotate(180deg)" : "rotate(0)" }}>
            <path d="M17.8544 4.24016C17.642 3.86016 17.0256 3.95984 17.0178 4.43135C17.0126 4.74173 17.3691 5.0812 17.7755 5.4891C17.7914 5.50512 17.8123 5.5133 17.8332 5.51365C17.8541 5.51399 17.8753 5.50651 17.8917 5.49103C18.3131 5.0954 18.679 4.76953 18.6842 4.45907C18.6921 3.98597 18.0776 3.87023 17.8544 4.24016V4.24016Z" fill="#06962E" />
            <path d="M10.5 1.15089C10.3688 0.899942 10 0.97322 10 1.28761C10 1.49455 10.2172 1.71689 10.4651 1.98428C10.4748 1.99478 10.4874 2 10.5 2C10.5125 2 10.5251 1.99478 10.5348 1.98428C10.7837 1.71589 11 1.49461 11 1.28761C11 0.972164 10.6302 0.901831 10.5 1.15089Z" fill="#C2A50A" />
            <path d="M17.8333 3.22633C17.6147 2.84991 17 2.95983 17 3.43141C17 3.74183 17.3621 4.07533 17.7752 4.47641C17.7914 4.49216 17.8124 4.5 17.8333 4.5C17.8542 4.5 17.8752 4.49216 17.8914 4.47641C18.3062 4.07383 18.6667 3.74191 18.6667 3.43141C18.6667 2.95825 18.0503 2.85275 17.8333 3.22633Z" fill="#C2A50A" />
            <path d="M19.5 3.15089C19.3688 2.89994 19 2.97322 19 3.28761C19 3.49455 19.2173 3.71689 19.4652 3.98428C19.4749 3.99478 19.4875 4 19.5 4C19.5125 4 19.5252 3.99478 19.5349 3.98428C19.7837 3.71589 20 3.49461 20 3.28761C20 2.97216 19.6302 2.90183 19.5 3.15089Z" fill="#0F34B7" fillOpacity="0.9" />
            <path d="M11.6144 1.26498C11.6084 1.05264 11.3365 0.981905 11.2334 1.19434C11.1656 1.33417 11.2388 1.55524 11.3179 1.81674C11.321 1.827 11.3277 1.83463 11.3362 1.83873C11.3446 1.84282 11.3548 1.8434 11.3647 1.83946C11.62 1.73925 11.8379 1.66025 11.9058 1.52038C12.0091 1.30724 11.7835 1.13914 11.6144 1.26498V1.26498Z" fill="#06962E" />
            <path d="M10.8333 2.22633C10.6147 1.84991 10 1.95983 10 2.43141C10 2.74183 10.3621 3.07533 10.7753 3.47641C10.7914 3.49216 10.8124 3.5 10.8333 3.5C10.8543 3.5 10.8752 3.49216 10.8914 3.47641C11.3062 3.07383 11.6667 2.74191 11.6667 2.43141C11.6667 1.95825 11.0503 1.85275 10.8333 2.22633V2.22633Z" fill="#8E04A5" />
            <path d="M16.5 8.15089C16.3688 7.89994 16 7.97322 16 8.28761C16 8.49455 16.2173 8.71689 16.4652 8.98428C16.4749 8.99478 16.4875 9 16.5 9C16.5126 9 16.5251 8.99478 16.5348 8.98428C16.7837 8.71589 17 8.49461 17 8.28761C17 7.97216 16.6302 7.90183 16.5 8.15089V8.15089Z" fill="#0F34B7" fillOpacity="0.9" />
            <path d="M16.5438 1.11605C16.4606 0.826971 16.1289 0.870759 16.0894 1.21652C16.0634 1.44412 16.2255 1.71032 16.4087 2.02913C16.4159 2.04164 16.4263 2.04864 16.4373 2.04989C16.4482 2.05115 16.4599 2.04666 16.4697 2.03608C16.721 1.76574 16.9379 1.54397 16.9639 1.31631C17.0035 0.969386 16.6889 0.855133 16.5438 1.11605V1.11605Z" fill="#06962E" />
            <path d="M14 0.301774C13.7376 -0.200116 13 -0.0535599 13 0.575219C13 0.989109 13.4345 1.43378 13.9303 1.96856C13.9497 1.98956 13.9749 2 14 2C14.0251 2 14.0503 1.98956 14.0697 1.96856C14.5674 1.43178 15 0.98922 15 0.575219C15 -0.0556711 14.2604 -0.196338 14 0.301774Z" fill="#C2A50A" />
            <path d="M19.5 5.15089C19.3688 4.89994 19 4.97322 19 5.28761C19 5.49455 19.2173 5.71689 19.4652 5.98428C19.4749 5.99478 19.4875 6 19.5 6C19.5126 6 19.5251 5.99478 19.5348 5.98428C19.7837 5.71589 20 5.49461 20 5.28761C20 4.97216 19.6302 4.90183 19.5 5.15089V5.15089Z" fill="#8E04A5" />
            <path d="M6.29 6.36117C5.22062 6.35592 3.8775 6.89667 2.85313 7.85275C2.4625 8.21733 2.11813 8.64317 1.8525 9.12092C2.77688 8.46817 3.76312 8.26342 4.91687 8.86775C5.25687 8.0295 5.71062 7.17608 6.29 6.36117ZM12.4056 12.0621C11.4581 12.6402 10.5262 13.0572 9.72 13.3512C10.3675 14.4292 10.1487 15.3486 9.44875 16.2107C9.96062 15.9634 10.4169 15.642 10.8081 15.2762C11.8356 14.3184 12.4156 13.0619 12.4056 12.0621ZM16.2506 2.76025C15.9931 2.74392 15.7406 2.73575 15.4925 2.73575C10.1163 2.73575 7.05625 6.56125 5.9425 9.63833L8.8975 12.3969C12.29 11.2617 16.2831 8.51133 16.2831 3.54658C16.2831 3.2905 16.2725 3.02858 16.2506 2.76025ZM10.0706 8.54108C9.82625 8.313 9.82625 7.94433 10.0706 7.71625C10.315 7.48817 10.71 7.48817 10.9544 7.71625C11.1988 7.94433 11.1988 8.313 10.9544 8.54108C10.71 8.76917 10.3144 8.76858 10.0706 8.54108ZM11.8381 6.89142C11.35 6.43642 11.35 5.69733 11.8381 5.24175C12.3263 4.78617 13.1181 4.78617 13.6056 5.24175C14.0938 5.69733 14.0938 6.43583 13.6056 6.89142C13.1175 7.347 12.3263 7.347 11.8381 6.89142ZM2.51375 14.1562L1.9475 13.6277L5.2025 10.6014L5.76875 11.1299L2.51375 14.1562ZM5.62562 15.2395L5.05937 14.711L7.33188 12.5737L7.89812 13.1022L5.62562 15.2395ZM1.84938 16.7357L1.28313 16.2072L5.31312 12.4517L5.76875 13.1022L1.84938 16.7357Z" fill="#C50000" />
        </svg>
    )
}