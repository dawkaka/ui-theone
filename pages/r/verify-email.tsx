import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { CheckMark, Loading } from "../../components/mis"
import { BASEURL } from "../../constants"
import { Langs } from "../../types"
import tr from "../../i18n/locales/misc.json"
import Head from "next/head"



export default function VerifyEmail() {
    const router = useRouter()
    const locale = router.locale || "en"
    const localeTr = tr[locale as Langs]
    const [id, setID] = useState("")
    const [response, setResponse] = useState("")
    const [time, setTime] = useState(30)

    useEffect(() => {
        if (router.query.id) {
            setID(router.query.id as string)
            router.replace('/r/verify-email', undefined, { shallow: true });
        }
    }, [router])

    const mutation = useMutation(
        () => axios.post(`${BASEURL}/user/resend-verification-link/${id}`),
        {
            onSuccess: () => {
                setResponse("SUCCESS")
            },
            onError: () => {
                setResponse("ERROR")
            }
        }
    )

    useEffect(() => {
        const timerId = setInterval(() => setTime(time - 1), 1000);
        if (time <= 0) {
            setTime(0)
            clearInterval(timerId)
        }
        return () => clearInterval(timerId);
    }, [time])

    const resendEmail = () => {
        if (time > 0) return
        mutation.mutate()
    }

    return (
        <div>
            <Head>
                <title>{localeTr.verificationemail.header}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            <div style={{ paddingTop: "20vh", paddingInline: "var(--gap)", width: "100vw", height: "100vh", backgroundColor: "var(--success)" }}>
                <div style={{ marginInline: "auto", backgroundColor: "var(--background)", borderRadius: "var(--radius-small)", boxShadow: "0 0 5px -1px var(--accents-5)", padding: "var(--gap) var(--gap-double)", maxWidth: "500px" }}>
                    <h1 style={{ marginBottom: "var(--gap-double)", textAlign: "center" }}>{localeTr.verificationemail.header}</h1>

                    <div style={{ textAlign: "center", marginTop: "var(--gap)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--gap)" }}>
                        {response === "SUCCESS" ?
                            <>
                                <CheckMark size={50} />
                                <h4>{localeTr.verificationemail.linkresent} </h4>
                                <p>{localeTr.verificationemail.resenttext}</p>
                            </>
                            :
                            null
                        }
                        {
                            response === "ERROR" ?
                                <>
                                    <p>{localeTr.verificationemail.somethingwentwrong}</p>
                                    <Link href="/signup"><a>{localeTr.verificationemail.signup}</a></Link>
                                </> : null
                        }
                        {
                            response === "" ?
                                <>
                                    <p>{localeTr.verificationemail.text}</p>
                                    <button style={{ padding: "var(--gap-half) var(--gap)", opacity: time > 0 ? 0.5 : 1 }} onClick={resendEmail}>{localeTr.verificationemail.resendlink}</button>
                                    <p>{localeTr.verificationemail.timer} {time}s</p>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
            </div >
        </div>
    )
}