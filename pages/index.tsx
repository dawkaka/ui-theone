import type { NextPage } from 'next'
import Head from 'next/head'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AiOutlineReload } from "react-icons/ai"
import { BiArrowBack, BiSmile } from "react-icons/bi"
import { BsChatSquare } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import { Actions, CheckMark, Rocket, Verified } from "../components/mis"
import { NotFound } from "../components/notfound"
import Header from "../components/pageHeader"
import { LandingPost } from "../components/post"
import styles from "../styles/landing.module.css"
import cStyles from "../styles/couple.module.css"
import { LandingChatMsg as ChatMessage } from "./r/messages"


const Home: NextPage = () => {

  const [requestSent, setRequestSent] = useState(false)
  const [reqAccepted, setRequestAccepted] = useState(false)

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
        if (entry.intersectionRatio >= 0.5) {
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
  }, [])

  useEffect(() => {
    const updateHeaderBackgorund = () => {
      const h = document.querySelector("#header")
      const body = document.querySelector("body")
      if (!h || !body) return
      if (body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        h.classList.add(styles.scrolled)
      } else {
        h.classList.remove(styles.scrolled)
      }
    }
    window.addEventListener("scroll", updateHeaderBackgorund)
  })



  return (
    <div style={{ width: "100%" }}>
      <Head>
        <title>Elwahid - Social Media for Couples</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={`${styles.header} ${styles.widthControlWrapper}`} id="header">
        <div className={styles.widthControl}>
          <nav className={styles.nav}>
            <h2 className={styles.headerSmall} style={{ marginBottom: 0 }}>El wahid</h2>
            <div className={styles.headerButtonContainer}>
              <Link href={"/login"}>
                <a>
                  <button className={`${styles.button} ${styles.buttonOutline}`}>Sign in</button>
                </a>
              </Link>
              <Link href={"/signup"}>
                <a>
                  <button className={styles.button}>Sign up</button>
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
                  <div className={styles.heroHeading}>
                    <h1 className={styles.headerLarge}>
                      <span>Social </span> <span>Media </span> <span>Made </span> <span>for</span>
                      <span>{' '}</span>
                      <span>Couples</span>
                    </h1>
                  </div>
                  <div className={styles.heroImageContainer}>
                    <div className={styles.heroImageContainerInner}>
                      <img src="/illu.gif" style={{ width: "100%" }} />
                    </div>
                  </div>
                </header>
              </div>
            </div>
          </div>

          <div className={styles.widthControlWrapper} style={{ backgroundColor: "var(--success)" }}>
            <div className={styles.widthControl}>
              <section id="how-it-work" className={styles.section}>
                <h3 className={styles.headerMedium}>How it Works</h3>
                <div className={styles.twoCol}>
                  <div className={styles.sectionContent}>
                    <div>
                      <Rocket recieving={false} />
                      <h4 className={styles.headerSmall}>User A sends a request</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      Once you have an account, you can send request to your partner by going to their profile.
                      You can cancel the request anytime provided the user you sent the request to has not accepted nor reject you request.
                    </p>
                    {/* <ul className={styles.conList}>
                      <h5 className={styles.headerXSmall}>Constraints</h5>
                      <li>You must not be having a couple profile</li>
                      <li>You must be 18 years or older</li>
                      <li>Partner must be 18 years or older</li>
                      <li>Partner must be open to recieving request</li>
                      <li>Parner must not be having a couple profile</li>
                    </ul> */}
                  </div>

                  <div className={styles.demoContainer}>
                    <div className={`${styles.sendRequestDemo} demo`}>
                      <div className={styles.urlBar}>
                        <AiOutlineReload />
                        <div>
                          <small>https://elwahid.com/user/temi</small>
                        </div>
                      </div>
                      <div className={styles.profileTop}>
                        <div className={styles.infoWrapper}>
                          <div className={styles.infoContainer}>
                            <div className={styles.imageContainer} style={{ width: "116px", height: "116px" }}>
                              <img
                                style={{ objectFit: "cover", position: "absolute", borderRadius: "50%" }}
                                src={`/temi.jpg`}
                                className={styles.profileImage}
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
                                  >Send request</button> :
                                    <div style={{
                                      width: "150px",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignSelf: "center",
                                      marginInline: "auto",
                                      alignItems: "center",
                                    }}>
                                      <CheckMark size={40} />
                                      <small style={{ color: "var(--success)" }}>request sent</small>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <h2 className={styles.countInfo}>
                            <div className={styles.countItem}>
                              <strong title="Following">5</strong>
                              <span className={styles.countItemTitle}>Following</span>
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
                          <p role={"heading"}>Couple Request</p>
                          <div
                            className={styles.closeContainer}
                          >
                            <IoMdClose color="tranparent" size={25} />
                          </div>
                        </div>

                        <div className={styles.mRequestContainer}>
                          <div className={styles.reqImageContainer}>
                            <img
                              src={`/8.jpg`}
                              className={styles.reqProfileImage}
                            />
                          </div>
                          <div className={styles.titleContainer} style={{ textAlign: "center", width: "100%" }}>
                            <h2 tabIndex={0} className={styles.realName} style={{ width: "fit-content", alignSelf: "center" }}>Oluwatosin Ajibade</h2>
                            <h3 tabIndex={0} className={styles.userName}>@mreazi</h3>
                          </div>
                          <div className={styles.requestButtons}>

                            {!reqAccepted ? <><button className={styles.acceptBtn} onClick={() => setRequestAccepted(true)}>
                              Accept
                            </button>
                              <button
                                className={styles.declineBtn}
                              >Reject</button>
                            </>
                              :
                              <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                                <CheckMark size={120} />
                                <small style={{ color: "var(--success)" }}>Request accepted</small>
                              </div>
                            }
                          </div>
                        </div>

                      </div >
                    </div>


                    <div className={styles.changePosition}>
                      <div>
                        <Rocket recieving={true} />
                        <h5 className={styles.headerSmall}>User B recieves the request</h5>
                      </div>
                      <p className={`${styles.txL} ${styles.text80}`}>
                        Once you recieve a request, you have an option to accept or reject the request, double check the user name of the send and either accept or reject the request.
                        Once you accept the request, a couple profile is created for you and your partner.
                      </p>
                      {/* <ul className={styles.conList}>
                        <h5 className={styles.headerXSmall}>Constraints</h5>
                        <li>You must not be having a couple profile</li>
                        <li>You must be 18 years or older</li>
                        <li>Partner must be 18 years or older</li>
                        <li>Partner must be open to recieving request</li>
                        <li>Parner must not be having a couple profile</li>
                      </ul> */}
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
                  <h3 className={styles.headerMedium} style={{ marginBottom: "var(--gap)" }}>What's Next?</h3>
                  <p>Once you have couple profile, you can...</p>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.sectionContent}>
                    <div>
                      <div>
                        <Rocket recieving={false} />
                      </div>
                      <h4 className={styles.headerSmall}>Post Photos</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      Couples can upload photos and memories  to share to their followers, couples can upload up to 10 photos slides per post,
                      followers and other users can like and comment on these photos. Couples however can close and reopen comments anytime.
                      <br />
                      <br />
                      <span style={{ fontWeight: "bold" }}>Something wrong with the post?</span><br />
                      Couples can edit caption or delete post anytime
                    </p>
                  </div>
                  <div className={"demo"} style={{ maxWidth: "470px", width: "fit-content", flexGrow: 0, padding: 0, textAlign: "left" }}>
                    <LandingPost files={[
                      { name: "/3.jpg", type: "image", alt: "", width: 500, height: 500 },
                      { name: "/4.jpg", type: "image", alt: "", width: 500, height: 500 },
                      { name: "/1.jpg", type: "image", alt: "", width: 500, height: 500 },
                      { name: "/2.jpg", type: "image", alt: "", width: 500, height: 500 },
                      { name: "/6.jpg", type: "image", alt: "", width: 500, height: 500 },

                    ]} couple_name="Teazi" caption="What a bomb shelll"
                      verified married={false} likes_count={5000000}
                      comments_count={3000}
                      created_at={new Date().toString()}
                      has_liked={true}
                      is_this_couple={false}
                      comments_closed={true}
                      profile_picture={"/teazi3.jpeg"}
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
                    ]} couple_name="Teazi" caption="What a bomb shelll"
                      verified married={false} likes_count={10000000}
                      comments_count={35000}
                      created_at={new Date().toString()}
                      has_liked={true}
                      is_this_couple={false}
                      comments_closed={true}
                      profile_picture={"/teazi3.jpeg"}
                      location="Bali, Indonesia"
                      id="wolaeafjdfajsldfkjwlfjwad"
                      postId="wdaomdas"
                    />
                  </div>
                  <div className={`${styles.sectionContent} ${styles.changePosition}`}>
                    <div>
                      <div>
                        <Rocket recieving={false} />
                      </div>
                      <h4 className={styles.headerSmall}>Post Short Videos</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      Share those beautiful and romantic moments in short 30 seconds video forms to your followers and other users.
                    </p>
                  </div>
                </div>


                <div className={styles.twoCol} style={{ marginBottom: "100px" }}>

                  <div className={`${styles.sectionContent}`}>
                    <div>
                      <div style={{ marginBottom: "var(--gap)" }}>
                        <BsChatSquare size={40} color="darkred" />
                      </div>
                      <h4 className={styles.headerSmall}>Messaging your Partner</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      A messaging inbox is created especially for a single couple to chat and send streaks between them.
                      It's made just for you and yours.
                    </p>
                    {/* <ul className={styles.conList}>
                      <h5 className={styles.headerXSmall}>Constraints</h5>
                    </ul> */}
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
                                  <Image layout="fill" objectFit="cover" src={`/8.jpg`} className={styles.profileImage} />
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
                                  <div className={`${styles.msgDemo} msg-demo`} id={"msg-" + index}>
                                    <ChatMessage
                                      text={message.text} me={index % 2 === 0} recieved={index % 2 === 0 && true}
                                      date={message.date} type={message.type} key={message.date} />
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
                  <h3 className={styles.headerMedium} style={{ marginBottom: "var(--gap)" }}>Incase of a Breakfast?</h3>
                  <p>Once you decide on not having a couple profile again. E.g incase of a breakup</p>
                </div>
                <div className={styles.twoCol}>
                  <div className={`${styles.sectionContent}`}>
                    <div>
                      <div style={{ marginBottom: "var(--gap)" }}>
                        <BsChatSquare size={40} color="darkred" />
                      </div>
                      <h4 className={styles.headerSmall}>Deactivate Your Couple Profile Anytime</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      If a couple deactivates their profile, the couple profile will cease to exist and all their posts can no longer be viewed by anyone.
                      Either partner can no longer be able to upload posts
                    </p>
                    {/* <ul className={styles.conList}>
                      <h5 className={styles.headerXSmall}>Constraints</h5>
                    </ul> */}
                  </div>


                  <div className={styles.demoContainer}>
                    <div className={`${styles.sendRequestDemo} demo`}>
                      <div className={styles.urlBar}>
                        <AiOutlineReload />
                        <div>
                          <small>https://elwahid.com/teazi</small>
                        </div>
                      </div>
                      <div className={styles.profileTop}>
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
                          <small>https://elwahid.com/teazi</small>
                        </div>
                      </div>
                      <div className={cStyles.profileContainer} style={{ marginTop: "-20px", minHeight: "fit-content" }}>
                        <Header title={"Teazi"} arrow />
                        <section className={cStyles.profileInfo}>
                          <div className={cStyles.coverPicContainer}>
                            <div className={cStyles.cover} >
                              <Image src={`/7.jpg`} height={"300px"} width={"900px"} objectFit="cover" id="cover" />
                            </div>
                          </div>
                          <div className={cStyles.profile}>
                            <div>
                              <div className={cStyles.flex}>
                                <div className={cStyles.imageContainer}>
                                  <div className={cStyles.profileImage}>
                                    <Image
                                      src={`/teazi3.jpeg`}
                                      layout="fill"
                                      id="avatar"
                                    />
                                  </div>
                                </div>
                                <div className={cStyles.profileActBtnContainer}>
                                  <div style={{ position: "relative" }}>
                                    <div>
                                      <Actions size={25} orientation="landscape" />
                                    </div>
                                    <button className={cStyles.editButton}>Edit</button>
                                  </div>
                                </div>
                              </div>
                              <div style={{ marginTop: "var(--gap-half)", color: "var(--accents-7)" }}>
                                <p className={cStyles.userName}>Teazi <Verified size={15} /></p>
                                <p style={{ color: "var(--accents-5)" }}>dating</p>
                                <p className={cStyles.bio}>Mr eazi and temi</p>
                                <div style={{ marginTop: "var(--gap-half)" }}>
                                  <a style={{ color: "var(--success)" }}>https://www.teazi.com</a>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                  <h2 className={cStyles.countInfo}>
                                    <div className={cStyles.countItem}>
                                      <strong title="Number of posts">10</strong>
                                      <span className={cStyles.countItemTitle}>Posts</span>
                                    </div>
                                  </h2>
                                  <h2 className={cStyles.countInfo}>
                                    <div className={cStyles.countItem}>
                                      <strong title="Number of followers">250k</strong>
                                      <span className={cStyles.countItemTitle}>Followers</span>
                                    </div>
                                  </h2>
                                  <h2 className={cStyles.countInfo}>
                                    <div className={`${cStyles.countItem} ${styles.dateStarted}`}>
                                      <p title="Date relationship started">{new Date().toDateString().substring(3)}</p>
                                      <span className={cStyles.countItemTitle}>Started</span>
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
                        <BsChatSquare size={40} color="darkred" />
                      </div>
                      <h4 className={styles.headerSmall}>Want to make and have a couple profile again?</h4>
                    </div>
                    <p className={`${styles.txL} ${styles.text80}`}>
                      When a couple get back together, their couple profile is restored and their profile and all previous non deleted photos and videos can once again be seen by their followers and other users
                    </p>
                    {/* <ul className={styles.conList}>
                      <h5 className={styles.headerXSmall}>Constraints</h5>
                    </ul> */}
                  </div>

                </div>


              </section>
            </div>
          </div >

        </div >
      </main >
      <footer >

      </footer>
    </div >
  )
}


const messages = [
  {
    text: "Helloooooo eazziiii\n❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️", type: "text", date: "9 nov 2022, 23:10"
  },
  { text: "How you dey naa", type: "text", date: "9 nov 2022, 23:19" },
  { text: "bitching", type: "text", date: "9 nov 2022, 23:25" },
  null,
  { text: "Where are you?", type: "text", date: "9 nov 2022, 23:30" },
  { text: "I'm in the studio", type: "text", date: "9 nov 2022, 23:35" },
  null,
  { text: "/5.jpg", type: "file", date: "9 nov 2022, 23:40" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 23:45" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 23:50" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 23:55" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 00:00" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 00:20" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 00:30" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 00:40" },
  { text: "Hello eazi", type: "text", date: "9 nov 2022, 00:50" },
]

export default Home
