import type { NextPage } from 'next'
import Head from 'next/head'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AiOutlineReload } from "react-icons/ai"
import { BiArrowBack, BiSmile } from "react-icons/bi"
import { BsChatSquare, BsHeartFill } from "react-icons/bs"
import { IoMdClose, IoMdPhotos } from "react-icons/io"
import { Actions, CheckMark, Rocket, Verified } from "../components/mis"
import { NotFound } from "../components/notfound"
import { LandingPost } from "../components/post"
import styles from "../styles/landing.module.css"
import cStyles from "../styles/couple.module.css"
import { LandingChatMsg as ChatMessage } from "./r/messages"
import { RiVideoFill } from "react-icons/ri"
import { FaAngleDown, FaHeartBroken } from "react-icons/fa"
import { useRouter } from "next/router"
import tr from "../i18n/locales/landingpage.json"
import { Langs } from "../types"
import { getCountry } from "../i18n/location"
import { MdReport } from "react-icons/md"
import CookieBanner from "../components/cookie"


const LandingPage: NextPage = () => {
  const [requestSent, setRequestSent] = useState(false)
  const [reqAccepted, setRequestAccepted] = useState(false)
  const router = useRouter()
  const locale = router.locale || "en"
  const localeTr = tr[locale as Langs]
  const [showRainbow, setShowRainbow] = useState(false)

  function createObserver() {

    function demosIntersectionHandler(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.5) {
          entry.target.classList.add(`${styles.demoScale}`)
        } else {
          entry.target.classList.remove(`${styles.demoScale}`)
        }
      })
    }

    function msgsHandler(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.3) {
          entry.target.classList.add(`${styles.messageAnime}`)
          // msgDemoObser.unobserve(entry.target)
        }
      })
    }

    let options = {
      threshold: [0.3, 0.6, 0.9]
    }

    let demos = document.querySelectorAll(`.demo`);
    let msgDemos = document.querySelectorAll(".msg-demo")
    let msgDemoObser = new IntersectionObserver(msgsHandler, { root: null, threshold: [0.3, 0.6, 0.9] })
    let demosObserver = new IntersectionObserver(demosIntersectionHandler, options)
    addObserver(demos, demosObserver)
    addObserver(msgDemos, msgDemoObser)
  }

  function addObserver(targets: NodeListOf<Element>, observer: IntersectionObserver) {
    targets.forEach(elem => {
      observer.observe(elem);
    })
  }

  useEffect(() => {
    createObserver()

    const planets = Array.from(document.getElementsByClassName(`${styles.planet}`))
    const circle = document.getElementById("circle")
    planets.forEach((planet) => {
      planet.addEventListener("mouseover", (e) => {
        planets.forEach(planet => {
          if (circle) {
            circle.style.animationPlayState = "paused"
          }
          if (planet instanceof HTMLElement) {
            planet.style.animationPlayState = "paused";
            if (planet.childNodes && planet.childNodes[0] instanceof HTMLElement) {
              planet.childNodes[0].style.animationPlayState = "paused"
            }
          }
        });
      });

      planet.addEventListener("mouseout", () => {
        planets.forEach(planet => {
          if (circle) {
            circle.style.animationPlayState = "running";
          }
          if (planet instanceof HTMLElement) {
            planet.style.animationPlayState = "running";
            if (planet.childNodes && planet.childNodes[0] instanceof HTMLElement) {
              planet.childNodes[0].style.animationPlayState = "running";
            }
          }
        });
      })
    });
  })

  useEffect(() => {
    const userCountry = getCountry()
    if (userCountry) {
      setShowRainbow(!noHomo.includes(userCountry))
    }
    if (localStorage.getItem("hasAccount")) {
      router.push("/r/home")
    }
  }, [])

  return (
    <>
      <Head>
        <title>Prime Couples - {localeTr.heroHeader}</title>
        <meta name="description" content="Prime Couples is a social media made for couples, Post your soulmates anytime without worrying about mixing business with pleasure." />
        <meta name="keywords" content="primecouples, prime couples, love, romance, lovers, social media, theone, social media for couples, couple creators, soulmate, soulmates, power couples" />
        <meta name="fragment" content="!" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Social media made for couples" />
        <meta property="og:description" content="Prime Couples is a social media made for couples, Post your soulmates anytime without worrying about mixing business with pleasure." />
        <meta property="og:image" content="https://www.primecouples.com/primecouplesOG.jpg" />
        <meta property="og:url" content="https://www.primecouples.com" />

        <meta name="twitter:title" content="Social media made for couples" />
        <meta name="twitter:data1" content="" />
        <meta name="twitter:description" content="Prime Couples is a social media made for couples, Post your soulmates anytime without worrying about mixing business with pleasure" />
        <meta name="twitter:image:alt" content="Prime Couples" />
        <meta name="twitter:image" content="https://www.primecouples.com/primecouplesOG.jpg" />
        <meta name="twitter:image:src" content="https://www.primecouples.com/primecouplesOG.jpg" />
      </Head>
      <div style={{ width: "100%" }}>
        <header className={`${styles.header} ${styles.widthControlWrapper}`} id="header">
          <div className={styles.widthControl}>
            <nav className={styles.nav}>
              <div className={styles.logoContainer}>
                <img src="/logo.webp" alt="logo" />
                <h2 className={styles.headerSmall} style={{ marginBottom: 0 }}>Prime Couples</h2>
              </div>
              <div className={styles.headerButtonContainer}>
                <Link href={"/login"}>
                  <a>
                    <button className={`${styles.button} ${styles.buttonOutline}`}>{localeTr.signin}</button>
                  </a>
                </Link>
                <Link href={"/signup"}>
                  <a>
                    <button className={`${styles.button} ${showRainbow ? styles.rainbow : ''}`}>{localeTr.signup}</button>
                  </a>
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main style={{ backgroundColor: "var(--success)", paddingBottom: "200px" }}>
          <div className={styles.sectionsContainer}>
            <div className={styles.heroMainContainer} >
              <div className={styles.widthControlWrapper} style={{ color: "white" }}>
                <div className={styles.widthControl}>
                  <header className={styles.heroContainer}>
                    <div className={styles.twoCol} style={{ alignItems: "center", justifyContent: "space-between" }}>
                      <div className={styles.heroHeading}>
                        <h1 className={styles.headerLarge}>
                          {localeTr.heroHeader}
                        </h1>
                        <p className={`${styles.txL} ${styles.text80}`}>
                          {localeTr.subtext}
                        </p>
                      </div>
                      <div className={styles.heroImageContainer}>
                        <div className={styles.heroImageContainerInner}>
                          <img src="/illu.gif" style={{ width: "80%", height: "80%", objectFit: "cover", borderRadius: "100%" }} alt="" />
                          <div className={styles.heroCircle}>
                            <div className={styles.heroRotate} id="circle">
                              <div className={styles.planet}><img src="/6.webp" alt="" /></div>
                              <div className={styles.planet}><img src={showRainbow ? "/13.webp" : "/11.webp"} alt="" /></div>
                              <div className={styles.planet}><img src={showRainbow ? "/12.webp" : "/10.webp"} alt="" /></div>
                              <div className={styles.planet}><img src="/9.webp" alt="" /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>
                </div>
              </div>
            </div>

            <div className={styles.widthControlWrapper} style={{ backgroundColor: "var(--success)" }}>
              <div className={styles.widthControl}>
                <section id="how-it-work" className={styles.section}>
                  <h3 className={styles.headerMedium}>{localeTr.howitworks.header}</h3>
                  <div className={styles.twoCol}>
                    <div className={styles.sectionContent}>
                      <div>
                        <Rocket recieving={false} />
                        <h4 className={styles.headerSmall}>{localeTr.howitworks.first.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.howitworks.first.text}
                      </p>
                    </div>

                    <div className={styles.demoContainer}>
                      <div className={`${styles.sendRequestDemo} demo`}>
                        <div className={styles.urlBar}>
                          <AiOutlineReload />
                          <div>
                            <small>https://primecopules.com/user/temi</small>
                          </div>
                        </div>
                        <div className={styles.profileTop}>
                          <div className={styles.infoWrapper}>
                            <div className={styles.infoContainer}>
                              <div className={styles.imageContainer} style={{ width: "116px", height: "116px" }}>
                                <img
                                  style={{ objectFit: "cover", position: "absolute", borderRadius: "50%" }}
                                  src={`/temi.webp`}
                                  className={styles.profileImage}
                                  alt=""
                                />
                              </div>
                              <div className={styles.titleContainer}>
                                <h3 className={styles.userName}>@temi</h3>
                                <h2 className={styles.realName}>Temi Otedola</h2>
                                <div className={styles.requestContainer}>
                                  <div className={styles.requestButtonWrapper} style={{ position: "relative", width: "max-content" }}>
                                    {!requestSent ? <button className={styles.button}
                                      onClick={() => setRequestSent(true)}
                                      style={{ backgroundColor: "var(--success)", color: "white" }}
                                    >{localeTr.sendrequest}</button> :
                                      <div style={{
                                        width: "150px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignSelf: "center",
                                        marginInline: "auto",
                                        alignItems: "center",
                                      }}>
                                        <CheckMark size={40} />
                                        <small style={{ color: "var(--success)" }}>{localeTr.requestsent}</small>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h2 className={styles.countInfo}>
                              <div className={styles.countItem}>
                                <strong title="Following">5</strong>
                                <span className={styles.countItemTitle}>{localeTr.following}</span>
                              </div>
                            </h2>
                            <h2 className={styles.bio}>
                              Zina in The Man For The Job
                              Moremi in the Netflix Original Citation
                              temiotedola@vmgnt.com / temi@bookingsafrica.com
                            </h2>
                          </div>

                          <div className={styles.actions}>
                            <Actions orientation="landscape" size={25} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div>
                    <div className={styles.twoCol}>
                      <div style={{ maxWidth: "470px", width: "fit-content", flexGrow: 0, padding: 0, textAlign: "left" }}>
                        <div className={`${styles.requestModal} demo`} >
                          <div className={styles.requestHeader} id="full_description">
                            <p>{localeTr.couplerequest}</p>
                            <div
                              className={styles.closeContainer}
                            >
                              <IoMdClose color="tranparent" size={25} />
                            </div>
                          </div>

                          <div className={styles.mRequestContainer}>
                            <div className={styles.reqImageContainer}>
                              <img
                                src={`/8.webp`}
                                className={styles.reqProfileImage}
                                alt=""
                              />
                            </div>
                            <div className={styles.titleContainer} style={{ textAlign: "center", width: "100%" }}>
                              <h2 tabIndex={0} className={styles.realName} style={{ width: "fit-content", alignSelf: "center" }}>Oluwatosin Ajibade</h2>
                              <h3 tabIndex={0} className={styles.userName}>@mreazi</h3>
                            </div>
                            <div className={styles.requestButtons}>

                              {!reqAccepted ? <><button className={styles.acceptBtn} onClick={() => setRequestAccepted(true)}>
                                {localeTr.accept}
                              </button>
                                <button
                                  className={styles.declineBtn}
                                >{localeTr.reject}</button>
                              </>
                                :
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                                  <CheckMark size={120} />
                                  <small style={{ color: "var(--success)" }}>{localeTr.requestaccepted}</small>
                                </div>
                              }
                            </div>
                          </div>

                        </div >
                      </div>

                      <div className={styles.changePosition}>
                        <div>
                          <Rocket recieving={true} />
                          <h5 className={styles.headerSmall}>{localeTr.howitworks.second.header}</h5>
                        </div>
                        <p className={`${styles.txL} ${styles.text80}`}>
                          {localeTr.howitworks.second.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>


            <div className={styles.widthControlWrapper}>
              <div className={styles.widthControl}>
                <section id="what-next" className={styles.section}>
                  <div>
                    <h3 className={styles.headerMedium} style={{ marginBottom: "var(--gap)" }}>{localeTr.whatnext.header}</h3>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.sectionContent}>
                      <div>
                        <div>
                          <IoMdPhotos size={50} color="darkred" />
                        </div>
                        <h4 className={styles.headerSmall}>{localeTr.whatnext.first.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.whatnext.first.text}
                      </p>
                    </div>
                    <div className={"demo"} style={{ maxWidth: "470px", width: "fit-content", flexGrow: 0, padding: 0, textAlign: "left" }}>
                      <LandingPost files={[
                        { name: "/3.webp", type: "image", alt: "", width: 500, height: 500 },
                        { name: "/4.webp", type: "image", alt: "", width: 500, height: 500 },
                        { name: "/1.webp", type: "image", alt: "", width: 500, height: 500 },
                        { name: "/2.webp", type: "image", alt: "", width: 500, height: 500 },
                        { name: "/6.webp", type: "image", alt: "", width: 500, height: 500 },

                      ]} couple_name="Teazi" caption="❤️❤️❤️❤️❤️❤️❤️"
                        verified married={false} likes_count={5000000}
                        comments_count={3000}
                        created_at="6 Dec 2022, 23:10"
                        has_liked={true}
                        is_this_couple={false}
                        comments_closed={true}
                        profile_picture={"/6.webp"}
                        location="Bali, Indonesia"
                        id="wolaeafjdfajsldfkjwlfjwad"
                        postId="wdaomdas"
                      />
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={"demo"} style={{ maxWidth: "470px", width: "fit-content", flexGrow: 0, padding: 0, textAlign: "left" }}>
                      <LandingPost files={[
                        { name: "/landingvideo.mp4", type: "mp4", alt: "", width: 500, height: 500 },
                      ]} couple_name="Teazi" caption="We are ENGAGED 💍💍💍"
                        verified married={false} likes_count={10000000}
                        comments_count={35000}
                        created_at={new Date().toString()}
                        has_liked={true}
                        video
                        is_this_couple={false}
                        comments_closed={true}
                        profile_picture={"/6.webp"}
                        location="Bali, Indonesia"
                        id="wolaeafjdfajsldfkjwlfjwad"
                        postId="wdaomdas"
                      />
                    </div>
                    <div className={`${styles.sectionContent} ${styles.changePosition}`}>
                      <div>
                        <div>
                          <RiVideoFill size={50} color="darkred" />
                        </div>
                        <h4 className={styles.headerSmall}>{localeTr.whatnext.second.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.whatnext.second.text}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="prohibited-message">
                      <MdReport size={30} />
                      <p>{localeTr.prohibited}</p>
                    </div>

                  </div>

                  <div className={styles.twoCol} style={{ marginBottom: "100px" }}>

                    <div className={`${styles.sectionContent}`}>
                      <div>
                        <div style={{ marginBottom: "var(--gap)" }}>
                          <BsChatSquare size={40} color="darkred" />
                        </div>
                        <h4 className={styles.headerSmall}>{localeTr.whatnext.third.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.whatnext.third.text}
                      </p>
                    </div>

                    <div>
                      <div className={`${styles.messagePageContainer} demo`}>
                        <div className={styles.messagingContainer}>
                          <section className={styles.chatContainer}>
                            <div className={styles.msgHeader}>
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--gap-half)"
                              }}> <div className={styles.imageContainer} style={{ width: "35px", height: "35px" }}>
                                  <span className={styles.avatarContainer} style={{ width: "35px", height: "35px" }}>
                                    <Image layout="fill" objectFit="cover" src={`/8.webp`} className={styles.profileImage} alt="" />
                                  </span>
                                </div>
                                <h4>mreazi</h4>
                              </div>
                              <div className={styles.backIcon}>
                                <BiArrowBack />
                              </div>
                            </div>
                            <div className={styles.pmWrapper} id="messages-root">
                              {
                                messages.map((message: any, index: number) => {
                                  if (message === null) return null
                                  return (
                                    <div key={index} className={`${styles.msgDemo} msg-demo`} id={"msg-" + index}>
                                      <ChatMessage
                                        text={message.text} me={message.me} recieved={message.me && true}
                                        date={message.date} type={message.type} />
                                    </div>
                                  )
                                })
                              }
                            </div>
                            <div className={styles.writeMessageContainer}>
                              <div className={styles.textAreaContainer}>
                                <BiSmile size={25} color="var(--accents-5)" />
                                <p style={{ color: "var(--accents-5)", width: "100%", textAlign: "left" }}>type message...</p>
                                <button style={{ backgroundColor: "transparent", color: "var(--success)" }}>send</button>
                              </div>

                            </div>
                          </section>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>
              </div>
            </div>


            <div className={styles.widthControlWrapper}>
              <div className={styles.widthControl}>
                <section id="what-next" className={styles.section}>
                  <div>
                    <h3 className={styles.headerMedium} style={{ marginBottom: "var(--gap)" }}>{localeTr.breakup.header}</h3>
                  </div>
                  <div className={styles.twoCol}>
                    <div className={`${styles.sectionContent}`}>
                      <div>
                        <div style={{ marginBottom: "var(--gap)" }}>
                          <FaHeartBroken size={40} color="darkred" />
                        </div>
                        <h4 className={styles.headerSmall}>{localeTr.breakup.first.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.breakup.first.text}
                      </p>
                    </div>

                    <div className={styles.demoContainer}>
                      <div className={`${styles.sendRequestDemo} demo`} style={{ width: "min(95vw, 470px)" }}>
                        <div className={styles.urlBar}>
                          <AiOutlineReload />
                          <div>
                            <small>https://primecopules.com/teazi</small>
                          </div>
                        </div>
                        <div className={styles.profileTop} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                          <NotFound type="couple" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.demoContainer}>
                      <div className={`${styles.sendRequestDemo} demo`}>
                        <div className={styles.urlBar}>
                          <AiOutlineReload />
                          <div>
                            <small>https://primecopules.com/teazi</small>
                          </div>
                        </div>
                        <div className={cStyles.profileContainer} style={{ marginTop: "-20px", minHeight: "fit-content" }}>
                          <section className={cStyles.profileInfo}>
                            <div className={cStyles.coverPicContainer}>
                              <div className={cStyles.cover} >
                                <Image src={`/7.webp`} height={"300px"} width={"900px"} objectFit="cover" id="cover" alt="" />
                              </div>
                            </div>
                            <div className={cStyles.profile}>
                              <div>
                                <div className={cStyles.flex}>
                                  <div className={cStyles.imageContainer}>
                                    <div className={cStyles.profileImage}>
                                      <Image
                                        src={`/6.webp`}
                                        layout="fill"
                                        id="avatar"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div className={cStyles.profileActBtnContainer}>
                                    <div style={{ position: "relative" }}>
                                      <div>
                                        <Actions size={25} orientation="landscape" />
                                      </div>
                                      <button className={cStyles.editButton}>{localeTr.edit}</button>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ marginTop: "var(--gap-half)", color: "var(--accents-7)" }}>
                                  <p className={cStyles.userName}>Teazi <Verified size={15} /></p>
                                  <p style={{ color: "var(--accents-5)" }}>{localeTr.dating}</p>
                                  <p className={cStyles.bio}>Mr eazi and temi</p>
                                  <div style={{ marginTop: "var(--gap-half)" }}>
                                    <p style={{ color: "var(--success)" }}>https://www.teazi.com</p>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                    <h2 className={cStyles.countInfo}>
                                      <div className={cStyles.countItem}>
                                        <strong title="Number of posts">10</strong>
                                        <span className={cStyles.countItemTitle}>{localeTr.posts}</span>
                                      </div>
                                    </h2>
                                    <h2 className={cStyles.countInfo}>
                                      <div className={cStyles.countItem}>
                                        <strong title="Number of followers">250k</strong>
                                        <span className={cStyles.countItemTitle}>{localeTr.followers}</span>
                                      </div>
                                    </h2>
                                    <h2 className={cStyles.countInfo}>
                                      <div className={`${cStyles.countItem} ${styles.dateStarted}`}>
                                        <p title="Date relationship started">Dec 22, 2019</p>
                                        <span className={cStyles.countItemTitle}>{localeTr.started}</span>
                                      </div>
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </section>
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.sectionContent} ${styles.changePosition}`}>
                      <div>
                        <div style={{ marginBottom: "var(--gap)" }}>
                          <BsHeartFill size={40} color="darkred" />
                        </div>
                        <h4 className={styles.headerSmall}>{localeTr.breakup.second.header}</h4>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        {localeTr.breakup.second.text}
                      </p>
                    </div>

                  </div>
                </section>

                <section style={{ marginTop: "clamp(50px, 20vh, 150px)" }}>
                  <h2 className={styles.headerMedium}>Frequently Asked Questions</h2>
                  <div style={{ padding: "var(--gap-half) min(3vw, var(--gap))" }}>
                    <Faq
                      title="Can people without partners join?"
                      content="Yes, individuals who are not in relationships are welcome to join Prime Couples and engage with the content and couples that interest them. This may include following and interacting with posts from their favorite couples. However people without partners can not creat posts of their own."
                    />
                    <Faq
                      title="Can't couples just create a joint Instagram account instead?"
                      content="Well, you could try using a hammer to open a bottle of wine, but a corkscrew is just a little more... cork-savvy."
                    />
                    <Faq
                      title="Is prime couples free to use?"
                      content="Yes"
                    />
                    <Faq
                      title="Is prime couples available in other languages?"
                      content="Yes, we currently support English and Spanish. More languages will be added"
                    />
                  </div>
                </section>

              </div >
            </div >

          </div >
          <CookieBanner />
        </main >
        <footer >

        </footer>
      </div >
    </>
  )
}


const Faq: React.FC<{ title: string, content: string }> = ({ title, content }) => {
  const [opened, setOpened] = useState(false)
  return (
    <div style={{ backgroundColor: "var(--background)", padding: "var(--gap)", borderRadius: "var(--radius-small)", marginTop: "var(--gap-half)" }}>
      <div role="button" style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpened(!opened)}>
        <p className={styles.txL} style={{ color: "var(--foreground)", fontWeight: "400" }}>{title}</p>
        <FaAngleDown size={20} style={{ transform: opened ? "rotate(180deg)" : "rotate(0)" }} />
      </div>
      {opened ? <p style={{ maxWidth: "700px", color: "var(--accents-7)", marginTop: "var(--gap-half)" }}>{content}</p> : null}
    </div>
  )
}


const messages = [
  {
    text: "Helloooo eazziiii ❤️❤️❤️", type: "text", date: "9 nov 2022, 23:10", me: true
  },
  { text: "Hi cupcake, how are you doing.", type: "text", date: "9 nov 2022, 23:19", me: false },
  { text: "I have you, that's all I need.", type: "text", date: "9 nov 2022, 23:25", me: true },
  { text: "Where are you?", type: "text", date: "9 nov 2022, 23:30", me: true },
  { text: "I'm in the studio, recording something special for you ❤️", type: "text", date: "9 nov 2022, 23:35", me: false },
  { text: "/5.webp", type: "file", date: "9 nov 2022, 23:40", me: false },
]

export default LandingPage

const noHomo = [
  "Algeria",
  "Burundi",
  "Cameroon",
  "Chad",
  "Comoros",
  "Egypt",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gambia",
  "Ghana",
  "Guinea",
  "Kenya",
  "Liberia",
  "Libya",
  "Malawi",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Namibia",
  "Nigeria",
  "Senegal",
  "Sierra Leone",
  "Somalia",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
  "Asia,",
  "Afghanistan",
  "Bangladesh",
  "Brunei",
  "Indonesia",
  "Iran",
  "Iraq",
  "Kuwait",
  "Lebanon",
  "Malaysia",
  "Maldives",
  "Myanmar",
  "Oman",
  "Pakistan",
  "Palestine(Gaza Strip only)",
  "Qatar",
  "Saudi Arabia",
  "Sri Lanka",
  "Syria",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Yemen",
  "Americas",
  "Barbados",
  "Dominica(But see “Dominica leader: No enforcement of anti - gay law“)",
  "Grenada",
  "Guyana",
  "Jamaica",
  "St Lucia",
  "St Vincent & the Grenadines",
  "Cook Islands",
  "Kirbati",
  "Papua New Guinea",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
]